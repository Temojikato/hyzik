import React, { useEffect, useMemo, useState } from 'react';
import {
  Badge, Box, Button, FormControl, FormLabel, HStack, IconButton, Image, Modal, ModalBody,
  ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Select, Spinner, Text,
  Tooltip, VStack, useToast,
} from '@chakra-ui/react';
import { doc, getDoc } from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';
import { getDownloadURL, ref } from 'firebase/storage';
import { FaBoxOpen, FaGift, FaPeopleGroup, FaShieldHalved } from 'react-icons/fa6';
import { db, functions, storage } from '../Firebase';
import { useAuth } from '../contexts/AuthContext';
import { subscribeGrantDeliveries } from '../services/campaignService';
import { GrantDelivery } from '../types/Campaign';
import { Item } from '../types/Reyvateils';
import { useBackDismiss } from '../contexts/BackNavigationContext';

interface PartyOption { id: string; displayName: string; reyvateilName?: string }
type Stage = 'sealed' | 'found' | 'shared' | 'confirmation';

const GrantDeliveryCenter: React.FC = () => {
  const { currentUser, profile } = useAuth();
  const [deliveries, setDeliveries] = useState<GrantDelivery[]>([]);
  const [active, setActive] = useState<GrantDelivery | null>(null);
  const [stage, setStage] = useState<Stage>('sealed');
  const [confirmation, setConfirmation] = useState('');
  const [snoozed, setSnoozed] = useState<string[]>([]);
  const [item, setItem] = useState<Item | null>(null);
  const [imageUrl, setImageUrl] = useState('');
  const [party, setParty] = useState<PartyOption[]>([]);
  const [targetId, setTargetId] = useState('');
  const [busy, setBusy] = useState(false);
  const toast = useToast();
  const activeId = active?.id;
  const activeKind = active?.kind;
  const activeResourceId = active?.resourceId;
  const activeLabel = active?.label;
  const activeStatus = active?.status;
  const activeRecipientId = active?.recipientId;

  useEffect(() => {
    if (!currentUser) { setDeliveries([]); return undefined; }
    return subscribeGrantDeliveries(currentUser.uid, setDeliveries, () => setDeliveries([]));
  }, [currentUser]);

  const unread = useMemo(() => deliveries.filter((delivery) => !snoozed.includes(delivery.id)), [deliveries, snoozed]);

  useEffect(() => {
    if (!active && unread[0]) {
      const delivery = unread[0];
      setActive(delivery);
      setStage(delivery.status === 'transfer-waiting'
        ? 'found'
        : delivery.status === 'shared'
          ? 'shared'
          : delivery.source === 'loot'
            ? 'found'
            : 'sealed');
      setConfirmation('');
      setTargetId('');
    }
  }, [active, unread]);

  useEffect(() => {
    if (!active || stage === 'confirmation') return;
    const latest = deliveries.find((delivery) => delivery.id === active.id);
    if (!latest) { if (!busy) setActive(null); return; }
    setActive(latest);
    if (latest.status === 'shared') setStage('shared');
  }, [deliveries, active, stage, busy]);

  useEffect(() => {
    setItem(null);
    setImageUrl('');
    if (!activeId || activeKind !== 'item' || !activeResourceId || !activeLabel) return;
    let cancelled = false;
    void getDoc(doc(db, 'items', activeResourceId)).then((snapshot) => {
      if (!cancelled && snapshot.exists()) setItem({ id: snapshot.id, ...snapshot.data() } as Item);
    });
    void getDownloadURL(ref(storage, `items/${activeLabel}.png`)).then((url) => {
      if (!cancelled) setImageUrl(url);
    }).catch(() => undefined);
    return () => { cancelled = true; };
  }, [activeId, activeKind, activeResourceId, activeLabel]);

  useEffect(() => {
    if (!activeId || activeStatus !== 'shared' || activeRecipientId !== currentUser?.uid) return;
    void httpsCallable<void, { players: PartyOption[] }>(functions, 'getActiveParty')().then((result) => setParty(result.data.players));
  }, [activeId, activeStatus, activeRecipientId, currentUser?.uid]);

  const snooze = () => {
    if (!active) return;
    setSnoozed((current) => [...current, active.id]);
    setActive(null);
  };
  useBackDismiss(Boolean(active), snooze);

  const call = async <T,>(name: string, data: unknown) => {
    setBusy(true);
    try { return await httpsCallable<unknown, T>(functions, name)(data); }
    finally { setBusy(false); }
  };

  const reveal = async () => {
    if (!active) return;
    if (active.kind === 'item') { setStage('found'); return; }
    try {
      await call('claimGrantDelivery', { deliveryId: active.id, mode: 'accept' });
      setConfirmation(active.kind === 'cypher'
        ? `Cypher acquired: ${active.label}. Its language remains unlocked permanently.`
        : `You gained ${active.amount} ${active.label}.`);
      setStage('confirmation');
    } catch (caught: any) { toast({ title: 'Could not open discovery', description: caught?.message || String(caught), status: 'error' }); }
  };

  const take = async () => {
    if (!active) return;
    try {
      await call('claimGrantDelivery', { deliveryId: active.id, mode: 'take' });
      setConfirmation(`You kept ${active.amount} × ${active.label}. It is now in your inventory.`);
      setStage('confirmation');
    } catch (caught: any) { toast({ title: 'Could not take item', description: caught?.message || String(caught), status: 'error' }); }
  };

  const showGroup = async () => {
    if (!active) return;
    try {
      const result = await call<{ audienceCount: number }>('shareGrantWithParty', { deliveryId: active.id });
      setStage('shared');
      toast({ title: 'Shown to the group', description: `${result.data.audienceCount} other active player${result.data.audienceCount === 1 ? '' : 's'} can now see it.`, status: 'success' });
    } catch (caught: any) { toast({ title: 'Could not reveal item', description: caught?.message || String(caught), status: 'error' }); }
  };

  const assign = async () => {
    if (!active || !targetId) return;
    try {
      const result = await call<{ targetName: string }>('claimGrantDelivery', { deliveryId: active.id, mode: 'assign', targetUserId: targetId });
      setConfirmation(`${active.amount} × ${active.label} was given to ${result.data.targetName}.`);
      setStage('confirmation');
    } catch (caught: any) { toast({ title: 'Could not assign item', description: caught?.message || String(caught), status: 'error' }); }
  };

  const respondTransfer = async (accept: boolean) => {
    if (!active) return;
    try {
      await call('respondToInventoryTransfer', { deliveryId: active.id, accept });
      setConfirmation(accept ? `${active.amount} × ${active.label} is now in your inventory.` : `${active.label} was returned to ${active.senderName || 'the sender'}.`);
      setStage('confirmation');
    } catch (caught: any) { toast({ title: 'Could not resolve transfer', description: caught?.message || String(caught), status: 'error' }); }
  };

  if (!currentUser) return null;
  const finder = active?.recipientId === currentUser.uid;
  const transfer = active?.status === 'transfer-waiting';
  const sealedTitle = active?.kind === 'condition' ? 'A change awaits you' : active?.kind === 'cypher' ? 'A Cypher awaits you' : 'You found something';

  return (
    <>
      {deliveries.length > 0 && !active && <Tooltip label="Pending discovery"><IconButton aria-label="Open pending discovery" icon={<FaGift />} position="fixed" zIndex={1600} right={{ base: 14, md: 20 }} bottom={{ base: 3, md: 5 }} borderRadius="full" colorScheme="purple" onClick={() => { const delivery = deliveries[0]; setSnoozed([]); setActive(delivery); setStage(delivery.status === 'transfer-waiting' ? 'found' : delivery.status === 'shared' ? 'shared' : delivery.source === 'loot' ? 'found' : 'sealed'); }} /></Tooltip>}
      <Modal isOpen={Boolean(active)} onClose={snooze} closeOnOverlayClick={false} isCentered size="lg">
        <ModalOverlay bg="rgba(3,5,10,.88)" />
        <ModalContent bg="#0D111B" border="1px solid" borderColor="gray.600" color="white">
          <ModalHeader><HStack><FaShieldHalved /><Text>{stage === 'confirmation' ? 'Resolved' : transfer ? 'Item transfer' : stage === 'shared' ? 'Party discovery' : sealedTitle}</Text></HStack></ModalHeader>
          {stage !== 'confirmation' && <ModalCloseButton aria-label="Close for now" />}
          <ModalBody>
            {stage === 'sealed' && <VStack spacing={5} py={5}><Box p={5} borderRadius="full" bg="whiteAlpha.100"><FaBoxOpen size="42" /></Box><Text textAlign="center" color="gray.300">This discovery is hidden until you are ready to look.</Text><Badge colorScheme="gray">Silent · private · no preview</Badge></VStack>}
            {(stage === 'found' || stage === 'shared') && active?.kind === 'item' && <VStack align="stretch" spacing={4}>
              {(stage === 'shared' || transfer) && imageUrl && <Image src={imageUrl} alt={active.label} maxH="220px" objectFit="contain" borderRadius="xl" />}
              {(stage === 'shared' || transfer) && !item && <Spinner alignSelf="center" />}
              <Box><HeadingText>{active.amount} × {active.label}</HeadingText><Text mt={2} color="gray.300">{stage === 'shared' || transfer ? item?.description || 'An item discovered in Omnia.' : `You found ${active.amount} × ${active.label}. Do you take it, or show the group?`}</Text></Box>
              {(stage === 'shared' || transfer) && <HStack flexWrap="wrap"><Badge colorScheme="purple">{item?.category || 'Item'}</Badge>{item?.recipe?.length ? <Badge colorScheme="blue">Crafting component</Badge> : null}</HStack>}
              {transfer && <Text p={3} bg="whiteAlpha.100" borderRadius="lg"><strong>{active.senderName || 'A party member'}</strong> wants to send this to you. It moves into your inventory only if you accept.</Text>}
              {stage === 'shared' && !finder && <Text p={4} bg="purple.900" borderRadius="xl"><strong>{active.senderName || 'The finder'}</strong> showed this to the group. Only the finder can decide who receives it.</Text>}
              {stage === 'shared' && finder && <FormControl><FormLabel>Who keeps it?</FormLabel><Select value={targetId} onChange={(event) => setTargetId(event.target.value)} bg="#111827"><option value="">Choose a player</option><option value={currentUser.uid}>{profile?.displayName || 'You'} (keep it yourself)</option>{party.map((player) => <option key={player.id} value={player.id}>{player.displayName}{player.reyvateilName ? ` · ${player.reyvateilName}` : ''}</option>)}</Select></FormControl>}
            </VStack>}
            {stage === 'confirmation' && <VStack spacing={5} py={6}><Box p={5} borderRadius="full" bg="green.900"><FaGift size="38" /></Box><Text fontSize="lg" textAlign="center">{confirmation}</Text></VStack>}
          </ModalBody>
          <ModalFooter gap={2} flexWrap="wrap">
            {stage === 'sealed' && <><Button variant="ghost" onClick={snooze}>Not now</Button><Button leftIcon={<FaBoxOpen />} onClick={reveal} isLoading={busy}>Open</Button></>}
            {stage === 'found' && !transfer && <><Button variant="ghost" onClick={snooze}>Not now</Button><Button leftIcon={<FaPeopleGroup />} variant="outline" onClick={showGroup} isLoading={busy}>Show the group</Button><Button onClick={take} isLoading={busy}>{active?.source === 'loot' ? 'Take' : 'Keep it'}</Button></>}
            {stage === 'found' && transfer && <><Button variant="outline" onClick={() => respondTransfer(false)} isLoading={busy}>Decline</Button><Button onClick={() => respondTransfer(true)} isLoading={busy}>Accept</Button></>}
            {stage === 'shared' && finder && <Button onClick={assign} isLoading={busy} isDisabled={!targetId}>Give item</Button>}
            {stage === 'shared' && !finder && <Button onClick={snooze}>Close for now</Button>}
            {stage === 'confirmation' && <Button onClick={() => { setActive(null); setConfirmation(''); }}>Acknowledge</Button>}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

const HeadingText: React.FC<{ children: React.ReactNode }> = ({ children }) => <Text fontSize="2xl" fontWeight="bold">{children}</Text>;

export default GrantDeliveryCenter;
