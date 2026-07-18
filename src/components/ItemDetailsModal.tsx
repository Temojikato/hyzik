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
} from '@chakra-ui/react';
import { Item } from '../types/Reyvateils';
import { User } from 'firebase/auth';
import RemoveItemModal from './RemoveItemModal';
import { doc, runTransaction } from 'firebase/firestore';
import { db } from '../Firebase';
import { getDownloadURL, ref } from 'firebase/storage';
import { storage } from '../Firebase';
import { serializeInventory } from '../utils/inventory';
import { useBackDismiss } from '../contexts/BackNavigationContext';
import { httpsCallable } from 'firebase/functions';
import { functions } from '../Firebase';

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
    isOpen: isRemoveModalOpen,
    onOpen: onRemoveModalOpen,
    onClose: onRemoveModalClose,
  } = useDisclosure();
  const {
    isOpen: isSendModalOpen,
    onOpen: onSendModalOpen,
    onClose: onSendModalClose,
  } = useDisclosure();
  useBackDismiss(isSendModalOpen, onSendModalClose);
  const toast = useToast();

  const [imageUrl, setImageUrl] = useState<string>('placeholder-image');
  const [loadingImage, setLoadingImage] = useState<boolean>(true);
  const [party, setParty] = useState<PartyOption[]>([]);
  const [sendTarget, setSendTarget] = useState('');
  const [sendAmount, setSendAmount] = useState(1);
  const [sending, setSending] = useState(false);

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

  const handleDissimulate = async () => {
    if (!currentUser) return;

    try {
      await runTransaction(db, async (transaction) => {
        const userRef = doc(db, 'users', currentUser.uid);
        const userSnap = await transaction.get(userRef);
        if (!userSnap.exists()) throw new Error('User does not exist');

        const userData = userSnap.data();
        const newUnlockedRecipes = [...(userData.unlockedRecipes || [])];

        // Update inventory
        const newInventory = [...inventory];
        const itemIndex = newInventory.findIndex((i) => i.id === item.id);
        if (itemIndex !== -1) {
          const inv = newInventory[itemIndex];

          if (inv.quantity) {
            if (inv.quantity < 10) {
              throw new Error('Not enough items. You need ' + (10 - inv.quantity) + " more.");
            } else {
              inv.quantity -= 10;
              if (inv.quantity <= 0) {
                newInventory.splice(itemIndex, 1);
              }
            }
          } else {
            throw new Error('Item quantity is undefined.');
          }
        } else {
          throw new Error('Item not found in inventory.');
        }

        if (!newUnlockedRecipes.includes(item.id)) {
          newUnlockedRecipes.push(item.id);
        }

        // Update user data in transaction
        transaction.update(userRef, { unlockedRecipes: newUnlockedRecipes, inventory: serializeInventory(newInventory) });
      });

      setUnlockedRecipes(item.id);

      toast({
        title: 'Recipe Unlocked',
        description: `You have unlocked the recipe for ${item.name}!`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      onClose();
    } catch (error: any) {
      console.error('Error during dissimulation:', error);
      toast({
        title: 'Error',
        description: `Failed to unlock recipe: ${error.message}`,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const hasRecipe = unlockedRecipes.includes(item.id);

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
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="purple" variant="outline" onClick={openSend} mr={3}>
              Send
            </Button>
            <Button colorScheme="red" onClick={onRemoveModalOpen} mr={3}>
              Remove
            </Button>
            {!hasRecipe && (
              <Button colorScheme="blue" onClick={handleDissimulate}>
                Dissimulate
              </Button>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Remove Item Modal */}
      <RemoveItemModal
        isOpen={isRemoveModalOpen}
        onClose={onRemoveModalClose}
        item={item}
        inventory={inventory}
        setInventory={setInventory}
        currentUser={currentUser}
      />

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
    </>
  );
};

export default ItemDetailsModal;
