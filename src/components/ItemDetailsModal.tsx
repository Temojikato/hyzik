// src/components/ItemDetailsModal.tsx

import React, { useState, useEffect } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  Button,
  Text,
  Image,
  VStack,
  useDisclosure,
  useToast,
  Spinner,
  FormControl,
  FormLabel,
  Select,
  NumberInput,
  NumberInputField,
  Badge,
  HStack,
  Box,
} from '@chakra-ui/react';
import { Item } from '../types/Reyvateils';
import { User } from 'firebase/auth';
import { getDownloadURL, ref } from 'firebase/storage';
import { storage } from '../Firebase';
import { useBackDismiss } from '../contexts/BackNavigationContext';
import { httpsCallable } from 'firebase/functions';
import { functions } from '../Firebase';
import { donateInventoryItem } from '../services/campaignService';
import { ECONOMY_FACTIONS, factionDonationQuote, itemEconomy } from '../utils/economy';

interface PartyOption { id: string; displayName: string; reyvateilName?: string }

interface ItemDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: Item;
  inventory: Item[];
  setInventory: React.Dispatch<React.SetStateAction<Item[]>>;
  currentUser: User | null;
  unlockedRecipes: string[];
  setUnlockedRecipes: (recipe: string) => Promise<void>;
}

const ItemDetailsModal: React.FC<ItemDetailsModalProps> = ({
  isOpen,
  onClose,
  item,
  inventory,
  setInventory,
  currentUser,
  unlockedRecipes,
  setUnlockedRecipes,
}) => {
  useBackDismiss(isOpen, onClose);
  const {
    isOpen: isSendModalOpen,
    onOpen: onSendModalOpen,
    onClose: onSendModalClose,
  } = useDisclosure();
  const {
    isOpen: isDonateModalOpen,
    onOpen: onDonateModalOpen,
    onClose: onDonateModalClose,
  } = useDisclosure();
  useBackDismiss(isSendModalOpen, onSendModalClose);
  useBackDismiss(isDonateModalOpen, onDonateModalClose);
  const toast = useToast();

  const [imageUrl, setImageUrl] = useState<string>('placeholder-image');
  const [loadingImage, setLoadingImage] = useState<boolean>(true);
  const [party, setParty] = useState<PartyOption[]>([]);
  const [sendTarget, setSendTarget] = useState('');
  const [sendAmount, setSendAmount] = useState(1);
  const [sending, setSending] = useState(false);
  const [donationFaction, setDonationFaction] = useState(ECONOMY_FACTIONS[0].id);
  const [donationAmount, setDonationAmount] = useState(1);
  const [donating, setDonating] = useState(false);

  useEffect(() => {
    const fetchImage = async () => {
      if (item) {
        try {
          const imageRef = ref(storage, "items/" + item.name + ".png");
          const url = await getDownloadURL(imageRef);
          setImageUrl(url);
        } catch (error) {
          console.error('Error fetching item image:', error);
        }
      }
      setLoadingImage(false);
    };

    fetchImage();
  }, [item]);

  const economy = itemEconomy(item);
  const donationQuote = factionDonationQuote(item, donationFaction, donationAmount);

  const openSend = async () => {
    onSendModalOpen();
    setSendTarget('');
    setSendAmount(1);
    try {
      const result = await httpsCallable<void, { players: PartyOption[] }>(functions, 'getActiveParty')();
      setParty(result.data.players);
    } catch (caught: any) {
      toast({ title: 'Could not load the party', description: caught?.message || String(caught), status: 'error' });
    }
  };

  const sendItem = async () => {
    if (!currentUser || !sendTarget) return;
    setSending(true);
    try {
      await httpsCallable(functions, 'createInventoryTransfer')({ itemId: item.id, targetUserId: sendTarget, amount: sendAmount });
      setInventory((current) => current.flatMap((entry) => {
        if (entry.id !== item.id) return [entry];
        const quantity = Math.max(0, Number(entry.quantity || 0) - sendAmount);
        return quantity ? [{ ...entry, quantity }] : [];
      }));
      toast({ title: 'Transfer sent', description: 'The item is reserved until the other player accepts or declines it.', status: 'success' });
      onSendModalClose();
      onClose();
    } catch (caught: any) {
      toast({ title: 'Could not send item', description: caught?.message || String(caught), status: 'error' });
    } finally { setSending(false); }
  };

  const donateItem = async () => {
    if (!currentUser) return;
    setDonating(true);
    try {
      const result = await donateInventoryItem(item.id, donationFaction, donationAmount);
      setInventory((current) => current.flatMap((entry) => {
        if (entry.id !== item.id) return [entry];
        const quantity = Math.max(0, Number(entry.quantity || 0) - donationAmount);
        return quantity ? [{ ...entry, quantity }] : [];
      }));
      toast({ title: `+${result.favorEarned} Favor`, description: `${result.factionName} gained ${donationAmount} × ${item.name}. Reputation +${result.reputationEarned}.`, status: 'success', duration: 6500, isClosable: true });
      onDonateModalClose();
      onClose();
    } catch (caught: any) {
      toast({ title: 'Donation failed', description: caught?.message || String(caught), status: 'error', duration: 7000, isClosable: true });
    } finally { setDonating(false); }
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} size="md" isCentered>
        <ModalOverlay />
        <ModalContent bg="surface" color="text">
          <ModalHeader color="textHeader">{item.name}</ModalHeader>
          <ModalCloseButton color="text" />
          <ModalBody>
            <VStack spacing={4} align="center">
              {loadingImage ? (
                <Spinner size="md" />
              ) : (
                <Image
                  src={imageUrl}
                  alt={item.name}
                  boxSize="150px"
                  objectFit="cover"
                />
              )}
              <Text color="text">{item.description}</Text>
              <Text color="text">
                Quantity: <strong>{item.quantity}</strong>
              </Text>
              <Text color="text">Category: {item.category}</Text>
              <HStack><Badge textTransform="uppercase">{economy.rarity}</Badge><Badge colorScheme="purple">Base donation {economy.favorValue} Favor</Badge></HStack>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="purple" variant="outline" onClick={openSend} mr={3}>
              Send
            </Button>
            <Button colorScheme="green" onClick={() => { setDonationAmount(1); onDonateModalOpen(); }}>
              Donate to the city
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={isSendModalOpen} onClose={onSendModalClose} isCentered>
        <ModalOverlay />
        <ModalContent bg="surface" color="text">
          <ModalHeader>Send {item.name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4} align="stretch">
              <Text>The item leaves your inventory now and moves to the recipient only after they accept it. A declined transfer is returned to you.</Text>
              <FormControl isRequired><FormLabel>Player</FormLabel><Select value={sendTarget} onChange={(event) => setSendTarget(event.target.value)}><option value="">Choose an active player</option>{party.map((player) => <option key={player.id} value={player.id}>{player.displayName}{player.reyvateilName ? ` · ${player.reyvateilName}` : ''}</option>)}</Select></FormControl>
              <FormControl isRequired><FormLabel>Quantity</FormLabel><NumberInput min={1} max={Math.max(1, Number(item.quantity || 1))} value={sendAmount} onChange={(_, value) => setSendAmount(Number.isFinite(value) ? Math.max(1, Math.floor(value)) : 1)}><NumberInputField /></NumberInput></FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter><Button variant="ghost" mr={3} onClick={onSendModalClose}>Cancel</Button><Button onClick={sendItem} isLoading={sending} isDisabled={!sendTarget || sendAmount < 1 || sendAmount > Number(item.quantity || 0)}>Send for acceptance</Button></ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={isDonateModalOpen} onClose={onDonateModalClose} isCentered size="lg">
        <ModalOverlay />
        <ModalContent bg="surface" color="text">
          <ModalHeader>Donate {item.name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4} align="stretch">
              <Text>Your Reyvateil can send recovered resources home from anywhere. Choose who receives them; Favor is spendable city credit, while faction reputation is permanent.</Text>
              <FormControl><FormLabel>Recipient faction</FormLabel><Select value={donationFaction} onChange={(event) => setDonationFaction(event.target.value)}>{ECONOMY_FACTIONS.map((faction) => <option key={faction.id} value={faction.id}>{faction.name}</option>)}</Select></FormControl>
              <Box p={3} border="1px solid" borderColor="border" borderRadius="md"><Text fontWeight="bold">{ECONOMY_FACTIONS.find((faction) => faction.id === donationFaction)?.name}</Text><Text fontSize="sm" opacity={.78}>{ECONOMY_FACTIONS.find((faction) => faction.id === donationFaction)?.summary}</Text></Box>
              <FormControl><FormLabel>Quantity</FormLabel><NumberInput min={1} max={Math.max(1, Number(item.quantity || 1))} value={donationAmount} onChange={(_, value) => setDonationAmount(Number.isFinite(value) ? Math.max(1, Math.floor(value)) : 1)}><NumberInputField /></NumberInput></FormControl>
              <Box p={4} borderRadius="md" bg="surfaceRaised"><HStack justify="space-between"><Text>Favor earned</Text><Text fontSize="xl" fontWeight="bold">+{donationQuote.favor}</Text></HStack><HStack justify="space-between"><Text>Faction reputation</Text><Text fontWeight="bold">+{donationQuote.reputation}</Text></HStack><Text mt={2} fontSize="sm" color={donationQuote.preferred ? 'green.300' : 'orange.300'}>{donationQuote.preferred ? 'This faction urgently values this category.' : 'This faction can use it, but another faction may value it more.'}</Text></Box>
            </VStack>
          </ModalBody>
          <ModalFooter><Button variant="ghost" mr={3} onClick={onDonateModalClose}>Cancel</Button><Button colorScheme="green" onClick={donateItem} isLoading={donating} isDisabled={donationAmount < 1 || donationAmount > Number(item.quantity || 0)}>Donate permanently</Button></ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ItemDetailsModal;
