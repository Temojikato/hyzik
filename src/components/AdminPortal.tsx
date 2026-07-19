import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Alert, AlertIcon, Badge, Box, Button, ChakraProvider, Checkbox, Divider, Flex, FormControl, FormLabel,
  Grid, Heading, HStack, IconButton, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter,
  ModalHeader, ModalOverlay, NumberInput, NumberInputField, Select, SimpleGrid, Spinner, Stat, StatHelpText,
  StatLabel, StatNumber, Tab, TabList, TabPanel, TabPanels, Table, TableContainer, Tabs, Tbody, Td, Text,
  Textarea, Th, Thead, Tr, useDisclosure, useToast, VStack, extendTheme,
  Slider, SliderFilledTrack, SliderThumb, SliderTrack, Progress,
} from '@chakra-ui/react';
import { collection, DocumentReference, getDocs } from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';
import { getDownloadURL, ref } from 'firebase/storage';
import { Link } from 'react-router-dom';
import {
  FaArrowLeft, FaArrowRotateRight, FaBolt, FaEye, FaGift, FaMessage, FaMusic, FaPlay,
  FaArrowUpRightFromSquare, FaPlus, FaSkull, FaTrash, FaUsers,
  FaChartLine,
} from 'react-icons/fa6';
import { db, functions, storage } from '../Firebase';
import { useAuth } from '../contexts/AuthContext';
import { useCampaign } from '../contexts/CampaignContext';
import { CYPHERS } from '../data/cyphers';
import { mapData } from '../mapdata';
import {
  adminAdvanceDay, adminRevivePlayer, adminSetWorldMode, advanceEncounterTurn, deleteSong, endEncounter, grantCondition, grantCypherToPlayers, grantItem, listPlayers, saveSong,
  sendGrantDeliveries, sendPrivateMessages, setCurrentSong, setPlayerActive, setPlayersActive, startEncounter, subscribeEncounter,
  subscribePlayers, updateEncounterParticipants, updatePlayerName, subscribeEconomyTransactions, adminRecordBarter,
} from '../services/campaignService';
import { CampaignSong, CampaignState, EconomyTransaction, Encounter, EncounterMapFrame, EncounterParticipant, GrantKind, PlayerProfile } from '../types/Campaign';
import { ConditionDefinition } from '../types/Conditions';
import { Item } from '../types/Reyvateils';
import { MonsterSpecies } from '../types/BestiaryTypes';
import { fetchAllMonstersFromNestedDocs } from '../utils/fetchAllMonsters';
import { getEncounterParticipantIssues } from '../utils/encounter';
import AdminMusicPlayer from './admin/AdminMusicPlayer';
import { ECONOMY_FACTIONS, reputationTier } from '../utils/economy';

const adminTheme = extendTheme({
  styles: { global: { 'html, body': { background: '#090d14', color: '#edf2f7' } } },
  colors: { brand: { 50: '#f5f3ff', 100: '#ede9fe', 200: '#ddd6fe', 300: '#c4b5fd', 400: '#a78bfa', 500: '#8b5cf6', 600: '#7c3aed', 700: '#6d28d9', 800: '#5b21b6', 900: '#4c1d95' } },
  components: {
    Button: {
      baseStyle: { borderRadius: '10px', fontWeight: '700' },
      variants: {
        solid: (props: { colorScheme?: string }) => ({
          bg: props.colorScheme === 'red' ? '#b91c1c' : props.colorScheme === 'green' ? '#15803d' : props.colorScheme === 'gray' ? '#374151' : '#7c3aed',
          color: '#ffffff',
          _hover: { bg: props.colorScheme === 'red' ? '#991b1b' : props.colorScheme === 'green' ? '#166534' : props.colorScheme === 'gray' ? '#4b5563' : '#6d28d9' },
        }),
        outline: { bg: 'transparent', borderColor: '#46536a', color: '#edf2f7', _hover: { bg: '#202938' } },
        ghost: { bg: 'transparent', color: '#edf2f7', _hover: { bg: '#202938' } },
      },
      defaultProps: { colorScheme: 'brand' },
    },
    Input: { variants: { outline: { field: { bg: '#0d131e', borderColor: '#354156', _hover: { borderColor: '#52617a' }, _focusVisible: { borderColor: '#8b5cf6', boxShadow: '0 0 0 1px #8b5cf6' } } } }, defaultProps: { variant: 'outline' } },
    Select: { variants: { outline: { field: { bg: '#0d131e', borderColor: '#354156', '> option': { bg: '#111722' } } } }, defaultProps: { variant: 'outline' } },
    Textarea: { variants: { outline: { bg: '#0d131e', borderColor: '#354156' } }, defaultProps: { variant: 'outline' } },
    Table: { variants: { simple: { th: { color: '#8f9bb0', borderColor: '#2c3648' }, td: { borderColor: '#2c3648' } } } },
  },
});

const panel = { bg: '#111722', border: '1px solid #2c3648', borderRadius: '16px', boxShadow: '0 18px 45px rgba(0,0,0,.22)' };
const playerLabel = (player: PlayerProfile) => player.displayName || player.email || player.reyvateilName || player.reyvateilId || 'Unnamed player';
const isPlayerActive = (player: PlayerProfile) => player.active !== false && player.mortality?.dead !== true;
const conditionLabel = (condition: NonNullable<PlayerProfile['conditions']>[number]) => typeof condition === 'string' ? condition : `${condition.name} ${condition.amount || 0}`;
const slug = (value: string) => value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || crypto.randomUUID();
const mortalityGrantOptions = [
  { id: 'permanent-damage', label: 'Permanent Damage', hint: 'Attack roll 10–16 · death at 5' },
  { id: 'lost-limb', label: 'Lost Limb', hint: 'Attack roll 17–20 · death at 3' },
  { id: 'death', label: 'Instant Death', hint: 'Attack roll 21+' },
];

const RecipientPicker: React.FC<{ players: PlayerProfile[]; value: string[]; onChange: (ids: string[]) => void }> = ({ players, value, onChange }) => {
  const active = players.filter(isPlayerActive);
  const allSelected = active.length > 0 && active.every((player) => value.includes(player.id));
  return <VStack align="stretch" maxH="470px" overflowY="auto" pr={1}>
    <Checkbox isChecked={allSelected} onChange={(event) => onChange(event.target.checked ? active.map((player) => player.id) : [])} p={3} border="1px solid #2c3648" borderRadius="12px"><Text fontWeight="bold">Entire active party</Text><Text fontSize="xs" color="#8f9bb0">Inactive players are excluded</Text></Checkbox>
    {players.map((player) => <Checkbox key={player.id} isDisabled={!isPlayerActive(player)} opacity={isPlayerActive(player) ? 1 : .42} isChecked={value.includes(player.id)} onChange={(event) => onChange(event.target.checked ? [...value, player.id] : value.filter((id) => id !== player.id))} p={3} border="1px solid #2c3648" borderRadius="12px"><Text fontWeight="bold">{playerLabel(player)}</Text><Text fontSize="xs" color="#8f9bb0">{player.reyvateilName || player.reyvateilId || 'No Reyvateil'}{player.mortality?.dead ? ' · dead' : !isPlayerActive(player) ? ' · paused' : ''}</Text></Checkbox>)}
  </VStack>;
};

interface AdminItem extends Item { reference: DocumentReference }
interface MonsterOption { id: string; name: string; tier: string; hp: number; armorClass?: number; songHearing?: EncounterParticipant['songHearing'] }
const finitePositive = (...values: unknown[]) => {
  const match = values.map(Number).find((value) => Number.isFinite(value) && value > 0);
  return match;
};

const AdminPortalContent: React.FC<{ previewMode?: boolean }> = ({ previewMode = false }) => {
  const { currentUser } = useAuth();
  const { songs, campaignState, currentSong } = useCampaign();
  const [players, setPlayers] = useState<PlayerProfile[]>([]);
  const [conditions, setConditions] = useState<ConditionDefinition[]>([]);
  const [items, setItems] = useState<AdminItem[]>([]);
  const [monsterSpecies, setMonsterSpecies] = useState<MonsterSpecies[]>([]);
  const [economyTransactions, setEconomyTransactions] = useState<EconomyTransaction[]>([]);
  const [loading, setLoading] = useState(!previewMode);
  const [error, setError] = useState('');
  const [syncingCombat, setSyncingCombat] = useState(false);
  const toast = useToast();
  const userModal = useDisclosure();
  const dayModal = useDisclosure();

  const refreshPlayers = useCallback(async () => {
    if (previewMode) return;
    setLoading(true);
    try { setPlayers(await listPlayers()); setError(''); }
    catch (caught) { setError(caught instanceof Error ? caught.message : 'Unable to load players.'); }
    finally { setLoading(false); }
  }, [previewMode]);

  useEffect(() => {
    if (previewMode) {
      setPlayers([{ id: 'preview-a', displayName: 'Aster', reyvateilName: 'Melodia', active: true, conditions: [{ name: 'Greed', amount: 22 }], unlockedCyphers: ['cypher-01'] }]);
      setLoading(false);
      return;
    }
    void refreshPlayers();
    return subscribePlayers((rows) => { setPlayers(rows); setLoading(false); }, (caught) => setError(caught.message));
  }, [previewMode, refreshPlayers]);

  useEffect(() => {
    if (previewMode) return;
    void Promise.all([
      getDocs(collection(db, 'conditionDefinitions')).then((snapshot) => setConditions(snapshot.docs.map((entry) => entry.data() as ConditionDefinition))),
      getDocs(collection(db, 'items')).then((snapshot) => setItems(snapshot.docs.map((entry) => ({ id: entry.id, ...entry.data(), reference: entry.ref } as AdminItem)))),
      fetchAllMonstersFromNestedDocs().then(setMonsterSpecies),
    ]).catch((caught) => setError(caught instanceof Error ? caught.message : String(caught)));
  }, [previewMode]);

  useEffect(() => {
    if (previewMode) return;
    return subscribeEconomyTransactions(setEconomyTransactions, (caught) => setError(caught.message));
  }, [previewMode]);

  const activeConditions = useMemo(() => players.reduce((total, player) => total + (player.conditions?.length || 0), 0), [players]);
  const activePlayers = useMemo(() => players.filter(isPlayerActive), [players]);
  const synchronizeCombat = async () => {
    setSyncingCombat(true);
    try {
      const result = await httpsCallable<undefined, { reyvateils: number; players: number }>(functions, 'adminSeedCombatProfiles')();
      toast({ title: 'Combat arsenal synchronized', description: `${result.data.reyvateils} Reyvateils and ${result.data.players} existing players prepared without replacing social data.`, status: 'success', duration: 7000 });
    } catch (caught: any) {
      toast({ title: 'Combat synchronization failed', description: caught?.message || String(caught), status: 'error', duration: 8000 });
    } finally { setSyncingCombat(false); }
  };

  return <Box minH="100vh" bg="#090d14" color="#edf2f7" p={{ base: 3, md: 6 }}>
    <Flex maxW="1680px" mx="auto" direction="column" gap={5}>
      <Flex justify="space-between" align="center" gap={4} flexWrap="wrap">
        <Box><HStack color="#8f9bb0" fontSize="sm"><Badge bg="#312e52" color="#c4b5fd">ADMIN</Badge><Text>Omnia campaign control</Text></HStack><Heading mt={1}>Tower operations</Heading></Box>
        <HStack><Button onClick={synchronizeCombat} isLoading={syncingCombat} variant="outline" borderColor="#4a5568">Sync combat data</Button><Button as={Link} to="/" leftIcon={<FaArrowLeft />} variant="outline" borderColor="#4a5568">Player portal</Button><IconButton aria-label="Refresh players" icon={<FaArrowRotateRight />} onClick={refreshPlayers} /></HStack>
      </Flex>
      <AdminMusicPlayer song={currentSong} />
      {error && <Alert status="error" bg="#3a1822" borderRadius="12px"><AlertIcon />{error}</Alert>}
      <SimpleGrid columns={{ base: 2, lg: 4 }} spacing={4}>
        <Box sx={panel} p={4}><Stat><StatLabel color="#8f9bb0">Active players</StatLabel><StatNumber>{activePlayers.length}/{players.length}</StatNumber><StatHelpText color="#8f9bb0">session clocks running</StatHelpText></Stat></Box>
        <Box sx={panel} p={4}><Stat><StatLabel color="#8f9bb0">Conditions</StatLabel><StatNumber>{activeConditions}</StatNumber><StatHelpText color="#8f9bb0">across the party</StatHelpText></Stat></Box>
        <Box sx={panel} p={4}><Stat><StatLabel color="#8f9bb0">Current song</StatLabel><StatNumber fontSize="md" noOfLines={1}>{currentSong?.title || 'None'}</StatNumber><StatHelpText color="#8f9bb0">stored in Firestore</StatHelpText></Stat></Box>
        <Box sx={panel} p={4}><Stat><StatLabel color="#8f9bb0">Campaign state</StatLabel><StatNumber fontSize="md">{campaignState.battleActive ? 'IN COMBAT' : 'Exploration'}</StatNumber><StatHelpText color="#8f9bb0">{campaignState.timersPaused ? 'all timers paused' : 'timers follow player status'}</StatHelpText></Stat></Box>
      </SimpleGrid>
      <CampaignClockPanel state={campaignState} players={players} onAdvanceDay={dayModal.onOpen} />
      <Box sx={panel} overflow="hidden">
        <Tabs isLazy variant="unstyled">
          <TabList px={3} pt={3} overflowX="auto" gap={1} borderBottom="1px solid #2c3648">{[
            [<FaUsers />, 'Players'], [<FaGift />, 'Grant'], [<FaMessage />, 'Messages'], [<FaMusic />, 'Music'], [<FaChartLine />, 'Economy'], [<FaSkull />, 'Encounter'],
          ].map(([icon, label]) => <Tab key={String(label)} color="#a6b0c2" whiteSpace="nowrap" borderRadius="10px 10px 0 0" _selected={{ bg: '#252d3c', color: 'white' }}><HStack>{icon}<Text>{label}</Text></HStack></Tab>)}</TabList>
          <TabPanels>
            <TabPanel p={{ base: 3, md: 5 }}><PlayersPanel players={players} loading={loading} currentUid={currentUser?.uid} onCreate={userModal.onOpen} /></TabPanel>
            <TabPanel p={{ base: 3, md: 5 }}><GrantDeliveryPanel players={players} conditions={conditions} items={items} senderId={currentUser?.uid || ''} /></TabPanel>
            <TabPanel p={{ base: 3, md: 5 }}><MessagePanel players={players} senderId={currentUser?.uid || ''} /></TabPanel>
            <TabPanel p={{ base: 3, md: 5 }}><MusicPanel songs={songs} currentSongId={campaignState.currentSongId} /></TabPanel>
            <TabPanel p={{ base: 3, md: 5 }}><EconomyPanel players={players} transactions={economyTransactions} /></TabPanel>
            <TabPanel p={{ base: 3, md: 5 }}><EncounterPanel players={players} songs={songs} species={monsterSpecies} activeEncounterId={campaignState.activeEncounterId} /></TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Flex>
    <CreateUserModal isOpen={userModal.isOpen} onClose={userModal.onClose} />
    <AdvanceDayModal isOpen={dayModal.isOpen} onClose={dayModal.onClose} players={players} currentDay={campaignState.day || 1} />
  </Box>;
};

const CampaignClockPanel: React.FC<{ state: CampaignState; players: PlayerProfile[]; onAdvanceDay: () => void }> = ({ state, players, onAdvanceDay }) => {
  const [changing, setChanging] = useState<'town' | 'dungeon' | ''>('');
  const toast = useToast();
  const mode = state.worldMode === 'dungeon' ? 'dungeon' : 'town';
  const pending = players.reduce((total, player) => total + (player.purchaseReservations?.length || 0), 0);
  const changeMode = async (next: 'town' | 'dungeon') => {
    setChanging(next);
    try {
      const result = await adminSetWorldMode(next);
      toast({
        title: next === 'town' ? 'Town mode active' : 'Dungeon mode active',
        description: next === 'town'
          ? `${result.fulfilledReservations} reserved purchase${result.fulfilledReservations === 1 ? '' : 's'} delivered.`
          : 'Players may reserve vendor stock, but nothing is delivered until the party returns to town.',
        status: 'success', duration: 6000,
      });
    } catch (caught: any) {
      toast({ title: 'Could not change campaign mode', description: caught?.message || String(caught), status: 'error', duration: 7000 });
    } finally { setChanging(''); }
  };
  return <Box sx={panel} p={4}>
    <Flex justify="space-between" gap={4} align="center" flexWrap="wrap">
      <Box><HStack><Badge colorScheme={mode === 'town' ? 'green' : 'orange'}>{mode.toUpperCase()} MODE</Badge><Badge bg="#252d3c" color="#cbd5e1">DAY {state.day || 1}</Badge>{pending > 0 && <Badge colorScheme="orange">{pending} pending reservations</Badge>}</HStack><Text mt={2} color="#8f9bb0" fontSize="sm">Town delivers purchases immediately. Dungeon mode records paid reservations for the next return.</Text></Box>
      <HStack flexWrap="wrap">
        <Button variant={mode === 'town' ? 'solid' : 'outline'} colorScheme="green" onClick={() => changeMode('town')} isLoading={changing === 'town'} isDisabled={Boolean(changing)}>Enter town</Button>
        <Button variant={mode === 'dungeon' ? 'solid' : 'outline'} colorScheme="orange" onClick={() => changeMode('dungeon')} isLoading={changing === 'dungeon'} isDisabled={Boolean(changing)}>Enter dungeon</Button>
        <Button onClick={onAdvanceDay} isDisabled={state.battleActive === true}>Advance day / rest</Button>
      </HStack>
    </Flex>
  </Box>;
};

const AdvanceDayModal: React.FC<{ isOpen: boolean; onClose: () => void; players: PlayerProfile[]; currentDay: number }> = ({ isOpen, onClose, players, currentDay }) => {
  const [hours, setHours] = useState<Record<string, number>>({});
  const [saving, setSaving] = useState(false);
  const toast = useToast();
  useEffect(() => {
    if (isOpen) setHours(Object.fromEntries(players.map((player) => [player.id, player.mortality?.dead ? 0 : 8])));
  }, [isOpen, players]);
  const advance = async () => {
    setSaving(true);
    try {
      const result = await adminAdvanceDay(players.map((player) => ({ userId: player.id, hours: hours[player.id] || 0 })));
      toast({ title: `Campaign advanced to day ${result.day}`, description: `${result.restedPlayers} players healed; ${result.dailyResets} earned daily resets.`, status: 'success', duration: 7000 });
      onClose();
    } catch (caught: any) {
      toast({ title: 'Could not advance the day', description: caught?.message || String(caught), status: 'error', duration: 8000 });
    } finally { setSaving(false); }
  };
  return <Modal isOpen={isOpen} onClose={onClose} size="2xl" isCentered scrollBehavior="inside">
    <ModalOverlay />
    <ModalContent bg="#111722" color="#edf2f7">
      <ModalHeader>End day {currentDay}</ModalHeader><ModalCloseButton />
      <ModalBody><Text color="#8f9bb0">Each hour restores one-sixth of maximum HP (rounded up). Five or more hours grants that player’s daily resets. Dead players cannot recover through sleep.</Text><VStack mt={5} align="stretch" spacing={3}>{players.map((player) => {
        const maxHp = Number(player.combatStats?.maxHp || player.combatProfile?.derived.maxHp || 1);
        const currentHp = Number(player.combatStats?.currentHp ?? maxHp);
        const rested = hours[player.id] || 0;
        const projected = player.mortality?.dead ? currentHp : Math.min(maxHp, currentHp + Math.ceil((maxHp * rested) / 6));
        return <Grid key={player.id} templateColumns={{ base: '1fr', md: 'minmax(0,1fr) 140px 160px' }} gap={3} alignItems="center" p={3} border="1px solid #2c3648" borderRadius="12px" opacity={player.mortality?.dead ? .45 : 1}>
          <Box><Text fontWeight="bold">{playerLabel(player)}</Text><Text fontSize="xs" color="#8f9bb0">HP {currentHp}/{maxHp} → {projected}/{maxHp}</Text></Box>
          <FormControl><FormLabel fontSize="xs" mb={1}>Hours slept</FormLabel><NumberInput min={0} max={24} value={rested} isDisabled={player.mortality?.dead} onChange={(_, value) => setHours((current) => ({ ...current, [player.id]: Number.isFinite(value) ? value : 0 }))}><NumberInputField /></NumberInput></FormControl>
          <Badge justifySelf={{ base: 'start', md: 'end' }} colorScheme={rested >= 5 && !player.mortality?.dead ? 'green' : 'gray'}>{rested >= 5 && !player.mortality?.dead ? 'DAILY RESET' : 'NO DAILY RESET'}</Badge>
        </Grid>;
      })}</VStack></ModalBody>
      <ModalFooter><Button variant="ghost" mr={3} onClick={onClose}>Cancel</Button><Button onClick={advance} isLoading={saving}>Advance to day {currentDay + 1}</Button></ModalFooter>
    </ModalContent>
  </Modal>;
};

const PlayersPanel: React.FC<{ players: PlayerProfile[]; loading: boolean; currentUid?: string; onCreate: () => void }> = ({ players, loading, currentUid, onCreate }) => {
  const toast = useToast();
  const toggleAll = async (active: boolean) => { try { await setPlayersActive(players.map((player) => player.id), active); toast({ title: active ? 'Party activated' : 'Party paused', status: 'success' }); } catch (caught) { toast({ title: 'Could not update the party', description: String(caught), status: 'error' }); } };
  const remove = async (player: PlayerProfile) => {
    if (!window.confirm(`Permanently delete ${playerLabel(player)} from Authentication and Firestore?`)) return;
    try { await httpsCallable<{ uid: string }, { uid: string }>(functions, 'adminDeleteUser')({ uid: player.id }); toast({ title: 'User deleted', status: 'success' }); }
    catch (caught: any) { toast({ title: 'Could not delete user', description: caught?.message || String(caught), status: 'error' }); }
  };
  const revive = async (player: PlayerProfile) => {
    if (!window.confirm(`Invoke a rare revival for ${playerLabel(player)}? Their permanent injuries and lost limbs remain recorded.`)) return;
    try { await adminRevivePlayer(player.id); toast({ title: `${playerLabel(player)} revived`, description: 'Reyvateil protection restored at 1 HP. Injury history was retained.', status: 'success' }); }
    catch (caught: any) { toast({ title: 'Revival failed', description: caught?.message || String(caught), status: 'error' }); }
  };
  const rename = async (player: PlayerProfile) => { const next = window.prompt('Player name', player.displayName || ''); if (!next?.trim()) return; try { await updatePlayerName(player.id, next); toast({ title: 'Player name saved', status: 'success' }); } catch (caught) { toast({ title: 'Could not save name', description: String(caught), status: 'error' }); } };
  return <VStack align="stretch" spacing={4}>
    <Flex justify="space-between" gap={3} flexWrap="wrap"><Box><Heading size="md">Players</Heading><Text color="#8f9bb0">Names, session state, conditions, and portal access.</Text></Box><HStack flexWrap="wrap"><Button variant="outline" borderColor="#3f4c63" onClick={() => toggleAll(false)}>Pause all</Button><Button leftIcon={<FaBolt />} onClick={() => toggleAll(true)}>Activate all</Button><Button leftIcon={<FaPlus />} onClick={onCreate}>Create user</Button></HStack></Flex>
    <HStack flexWrap="wrap"><Text color="#8f9bb0" fontSize="sm">Edit player name:</Text>{players.map((player) => <Button key={player.id} size="xs" variant="outline" borderColor="#46536a" onClick={() => rename(player)}>{playerLabel(player)}</Button>)}</HStack>
    {loading ? <Flex py={12} justify="center"><Spinner /></Flex> : <TableContainer><Table variant="simple"><Thead><Tr><Th>Player</Th><Th>Status</Th><Th>Reyvateil</Th><Th>Damage</Th><Th>Conditions</Th><Th>Cyphers</Th><Th textAlign="right">Actions</Th></Tr></Thead><Tbody>{players.map((player) => <Tr key={player.id} opacity={player.mortality?.dead ? .38 : isPlayerActive(player) ? 1 : .48} filter={player.mortality?.dead ? 'grayscale(1)' : undefined}><Td><Text fontWeight="bold">{playerLabel(player)}</Text><Text fontSize="xs" color="#8f9bb0">{player.id}</Text></Td><Td>{player.mortality?.dead ? <Badge colorScheme="red">DEAD</Badge> : <Button size="xs" colorScheme={isPlayerActive(player) ? 'green' : 'gray'} variant={isPlayerActive(player) ? 'solid' : 'outline'} onClick={() => setPlayerActive(player.id, !isPlayerActive(player))}>{isPlayerActive(player) ? 'Active' : 'Paused'}</Button>}</Td><Td>{player.reyvateilName || player.reyvateilId || 'Not selected'}</Td><Td><HStack><Badge colorScheme="orange">PD {player.mortality?.permanentDamage || 0}/5</Badge><Badge colorScheme="red">Limbs {player.mortality?.lostLimbs?.length || 0}/3</Badge></HStack></Td><Td><HStack>{player.conditions?.length ? player.conditions.slice(0, 3).map((condition, index) => <Badge key={`${conditionLabel(condition)}-${index}`} bg="#51252c" color="#fecaca">{conditionLabel(condition)}</Badge>) : <Badge bg="#163c32" color="#a7f3d0">Clear</Badge>}</HStack></Td><Td>{player.unlockedCyphers?.length || 0}/48</Td><Td><HStack justify="flex-end">{player.mortality?.dead && <Button size="xs" colorScheme="green" onClick={() => revive(player)}>Revive</Button>}<Button as={Link} to={`/admin/players/${player.id}`} size="xs" leftIcon={<FaEye />} variant="outline" borderColor="#46536a">View</Button><IconButton aria-label={`Delete ${playerLabel(player)}`} size="xs" colorScheme="red" variant="ghost" icon={<FaTrash />} isDisabled={player.id === currentUid} onClick={() => remove(player)} /></HStack></Td></Tr>)}</Tbody></Table></TableContainer>}
  </VStack>;
};

const CreateUserModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState(''); const [password, setPassword] = useState(''); const [saving, setSaving] = useState(false); const toast = useToast();
  const create = async () => { setSaving(true); try { await httpsCallable(functions, 'adminCreateUser')({ email: email.trim(), password }); toast({ title: 'Account created', description: 'The player will inscribe their own name before the Reyvateil quiz.', status: 'success' }); setEmail(''); setPassword(''); onClose(); } catch (caught: any) { toast({ title: 'Could not create user', description: caught?.message || String(caught), status: 'error' }); } finally { setSaving(false); } };
  return <Modal isOpen={isOpen} onClose={onClose} isCentered><ModalOverlay bg="rgba(0,0,0,.72)" /><ModalContent bg="#111722" border="1px solid #354156"><ModalHeader>Create campaign user</ModalHeader><ModalCloseButton /><ModalBody><VStack spacing={4} align="stretch"><Text color="#aeb8ca" fontSize="sm">The player chooses their own name after their first sign-in, immediately before the Reyvateil quiz.</Text><FormControl isRequired><FormLabel>Email</FormLabel><Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} /></FormControl><FormControl isRequired><FormLabel>Temporary password</FormLabel><Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} /><Text color="#8f9bb0" fontSize="xs" mt={1}>At least 6 characters. Share it privately with the player.</Text></FormControl></VStack></ModalBody><ModalFooter><Button variant="ghost" mr={3} onClick={onClose}>Cancel</Button><Button onClick={create} isLoading={saving} isDisabled={!email.trim() || password.length < 6}>Create user</Button></ModalFooter></ModalContent></Modal>;
};

const GrantPanel: React.FC<{ players: PlayerProfile[]; conditions: ConditionDefinition[]; items: AdminItem[] }> = ({ players, conditions, items }) => {
  const [kind, setKind] = useState<GrantKind>('condition'); const [recipients, setRecipients] = useState<string[]>([]); const [selectedId, setSelectedId] = useState(''); const [search, setSearch] = useState(''); const [amount, setAmount] = useState(1); const [sending, setSending] = useState(false); const toast = useToast();
  const options = useMemo(() => kind === 'condition' ? conditions.map((entry) => ({ id: entry.name, label: entry.name, hint: entry.type })) : kind === 'item' ? items.map((entry) => ({ id: entry.id, label: entry.name, hint: entry.category })) : CYPHERS.map((entry) => ({ id: entry.id, label: `${String(entry.number).padStart(2, '0')} · ${entry.title}`, hint: entry.domain })), [kind, conditions, items]);
  const filtered = options.filter((option) => `${option.label} ${option.hint}`.toLowerCase().includes(search.toLowerCase())).slice(0, 50);
  const send = async () => { if (!selectedId || !recipients.length) return; setSending(true); try { if (kind === 'condition') { const definition = conditions.find((entry) => entry.name === selectedId); await grantCondition(recipients, { name: selectedId, type: definition?.type, color: definition?.color }, amount); } else if (kind === 'item') { const item = items.find((entry) => entry.id === selectedId); if (!item) throw new Error('Item not found'); await grantItem(recipients, item.reference, amount); } else await grantCypherToPlayers(recipients, selectedId); toast({ title: `${kind === 'cypher' ? 'Cypher' : kind} granted to ${recipients.length} player${recipients.length === 1 ? '' : 's'}`, status: 'success' }); setSelectedId(''); setRecipients([]); } catch (caught) { toast({ title: 'Grant failed', description: String(caught), status: 'error' }); } finally { setSending(false); } };
  return <Grid templateColumns={{ base: '1fr', lg: 'minmax(260px,.7fr) minmax(0,1.3fr)' }} gap={6}><Box><Heading size="sm" mb={3}>Recipients</Heading><RecipientPicker players={players} value={recipients} onChange={setRecipients} /></Box><VStack align="stretch" spacing={4}><Box><Heading size="md">Grant resources</Heading><Text color="#8f9bb0">One consistent dispatch flow for conditions, inventory, recipes, and Cyphers.</Text></Box><FormControl><FormLabel>Grant type</FormLabel><HStack>{(['condition', 'item', 'cypher'] as GrantKind[]).map((value) => <Button key={value} flex="1" variant={kind === value ? 'solid' : 'outline'} borderColor="#3f4c63" onClick={() => { setKind(value); setSelectedId(''); setSearch(''); }}>{value === 'cypher' ? 'Cypher' : value[0].toUpperCase() + value.slice(1)}</Button>)}</HStack></FormControl><FormControl><FormLabel>Search</FormLabel><Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={`Search ${kind}s…`} /></FormControl><Box border="1px solid #2c3648" borderRadius="12px" maxH="270px" overflowY="auto" p={2}>{filtered.map((option) => <Button key={option.id} w="full" justifyContent="space-between" variant={selectedId === option.id ? 'solid' : 'ghost'} mb={1} onClick={() => setSelectedId(option.id)}><Text noOfLines={1}>{option.label}</Text><Text fontSize="xs" opacity={.68}>{option.hint}</Text></Button>)}{!filtered.length && <Text color="#8f9bb0" p={4}>Nothing matches that search.</Text>}</Box>{kind !== 'cypher' && <FormControl maxW="220px"><FormLabel>Amount</FormLabel><NumberInput min={1} value={amount} onChange={(_, value) => setAmount(Number.isFinite(value) ? value : 1)}><NumberInputField /></NumberInput></FormControl>}<Flex justify="space-between" align="center"><Text color="#8f9bb0">{recipients.length} active recipient{recipients.length === 1 ? '' : 's'}</Text><Button leftIcon={<FaGift />} onClick={send} isLoading={sending} isDisabled={!selectedId || !recipients.length}>Send grant</Button></Flex></VStack></Grid>;
};

const GrantDeliveryPanel: React.FC<{
  players: PlayerProfile[];
  conditions: ConditionDefinition[];
  items: AdminItem[];
  senderId: string;
}> = ({ players, conditions, items, senderId }) => {
  const [kind, setKind] = useState<GrantKind>('condition');
  const [recipients, setRecipients] = useState<string[]>([]);
  const [selectedId, setSelectedId] = useState('');
  const [search, setSearch] = useState('');
  const [amount, setAmount] = useState(1);
  const [damageDetail, setDamageDetail] = useState('');
  const [sending, setSending] = useState(false);
  const toast = useToast();
  const options = useMemo(() => kind === 'condition'
    ? conditions.map((entry) => ({ id: entry.name, label: entry.name, hint: entry.type }))
    : kind === 'item'
      ? items.map((entry) => ({ id: entry.id, label: entry.name, hint: entry.category }))
      : kind === 'cypher'
        ? CYPHERS.map((entry) => ({ id: entry.id, label: `${String(entry.number).padStart(2, '0')} · ${entry.title}`, hint: entry.domain }))
        : mortalityGrantOptions,
  [kind, conditions, items]);
  const filtered = options.filter((option) => `${option.label} ${option.hint}`.toLowerCase().includes(search.toLowerCase())).slice(0, 50);

  const send = async () => {
    if (!senderId || !selectedId || !recipients.length) return;
    setSending(true);
    try {
      const condition = conditions.find((entry) => entry.name === selectedId);
      const item = items.find((entry) => entry.id === selectedId);
      const cypher = CYPHERS.find((entry) => entry.id === selectedId);
      await sendGrantDeliveries({
        senderId,
        recipientIds: recipients,
        kind,
        resourceId: selectedId,
        label: kind === 'condition' ? selectedId : kind === 'item' ? item?.name || selectedId : kind === 'cypher' ? cypher?.title || selectedId : mortalityGrantOptions.find((entry) => entry.id === selectedId)?.label || selectedId,
        amount: kind === 'cypher' || selectedId === 'death' ? 1 : amount,
        conditionType: condition?.type,
        conditionColor: condition?.color,
        damageDetail: kind === 'damage' ? damageDetail : '',
      });
      toast({
        title: `Discovery sent to ${recipients.length} player${recipients.length === 1 ? '' : 's'}`,
        description: kind === 'item' ? 'They can keep it or reveal it to the active party.' : kind === 'damage' ? 'The mortal consequence will be recorded when they open it.' : 'It will be applied when they open it.',
        status: 'success',
      });
      setSelectedId('');
      setRecipients([]);
      setDamageDetail('');
    } catch (caught) {
      toast({ title: 'Delivery failed', description: String(caught), status: 'error' });
    } finally { setSending(false); }
  };

  return (
    <Grid templateColumns={{ base: '1fr', lg: 'minmax(260px,.7fr) minmax(0,1.3fr)' }} gap={6}>
      <Box><Heading size="sm" mb={3}>Recipients</Heading><RecipientPicker players={players} value={recipients} onChange={setRecipients} /></Box>
      <VStack align="stretch" spacing={4}>
        <Box><Heading size="md">Send a discovery</Heading><Text color="#8f9bb0">The player receives a silent sealed popup. Resources are applied only after they open and resolve it.</Text></Box>
        <FormControl><FormLabel>Grant type</FormLabel><SimpleGrid columns={{ base: 2, md: 4 }} spacing={2}>{(['condition', 'item', 'cypher', 'damage'] as GrantKind[]).map((value) => <Button key={value} variant={kind === value ? 'solid' : 'outline'} borderColor="#3f4c63" onClick={() => { setKind(value); setSelectedId(''); setSearch(''); setDamageDetail(''); }}>{value === 'cypher' ? 'Cypher' : value[0].toUpperCase() + value.slice(1)}</Button>)}</SimpleGrid></FormControl>
        <FormControl><FormLabel>Search</FormLabel><Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder={`Search ${kind}s…`} /></FormControl>
        <Box border="1px solid #2c3648" borderRadius="12px" maxH="270px" overflowY="auto" p={2}>
          {filtered.map((option) => <Button key={option.id} w="full" justifyContent="space-between" variant={selectedId === option.id ? 'solid' : 'ghost'} mb={1} onClick={() => setSelectedId(option.id)}><Text noOfLines={1}>{option.label}</Text><Text fontSize="xs" opacity={.68}>{option.hint}</Text></Button>)}
          {!filtered.length && <Text color="#8f9bb0" p={4}>Nothing matches that search.</Text>}
        </Box>
        {kind !== 'cypher' && selectedId !== 'death' && <FormControl maxW="220px"><FormLabel>{kind === 'damage' ? 'Count' : 'Amount'}</FormLabel><NumberInput min={1} max={kind === 'damage' ? 20 : undefined} value={amount} onChange={(_, value) => setAmount(Number.isFinite(value) ? value : 1)}><NumberInputField /></NumberInput></FormControl>}
        {kind === 'damage' && selectedId === 'lost-limb' && <FormControl><FormLabel>Limb description</FormLabel><Input value={damageDetail} onChange={(event) => setDamageDetail(event.target.value)} placeholder="e.g. left arm" /></FormControl>}
        <Flex justify="space-between" align="center"><Text color="#8f9bb0">{recipients.length} active recipient{recipients.length === 1 ? '' : 's'}</Text><Button leftIcon={<FaGift />} onClick={send} isLoading={sending} isDisabled={!senderId || !selectedId || !recipients.length}>Send discovery</Button></Flex>
      </VStack>
    </Grid>
  );
};

const MessagePanel: React.FC<{ players: PlayerProfile[]; senderId: string }> = ({ players, senderId }) => {
  const [recipients, setRecipients] = useState<string[]>([]); const [subject, setSubject] = useState(''); const [message, setMessage] = useState(''); const [sending, setSending] = useState(false); const toast = useToast();
  const send = async () => { if (!senderId || !recipients.length || !message.trim()) return; setSending(true); try { await sendPrivateMessages(senderId, recipients, message.trim(), subject.trim()); setMessage(''); setSubject(''); setRecipients([]); toast({ title: 'Silent message sent', status: 'success' }); } catch (caught) { toast({ title: 'Message failed', description: String(caught), status: 'error' }); } finally { setSending(false); } };
  return <Grid templateColumns={{ base: '1fr', lg: 'minmax(260px,.7fr) minmax(0,1.3fr)' }} gap={6}><Box><Heading size="sm" mb={3}>Recipients</Heading><RecipientPicker players={players} value={recipients} onChange={setRecipients} /></Box><VStack align="stretch" spacing={4}><Box><Heading size="md">Discreet transmission</Heading><Text color="#8f9bb0">Contents stay hidden behind the player’s silent privacy prompt.</Text></Box><FormControl><FormLabel>Subject (optional)</FormLabel><Input value={subject} maxLength={80} onChange={(e) => setSubject(e.target.value)} /></FormControl><FormControl><FormLabel>Message</FormLabel><Textarea minH="240px" value={message} maxLength={2000} onChange={(e) => setMessage(e.target.value)} /></FormControl><Flex justify="space-between"><Text color="#8f9bb0">{recipients.length} selected · {message.length}/2000</Text><Button leftIcon={<FaMessage />} onClick={send} isLoading={sending} isDisabled={!recipients.length || !message.trim()}>Send silently</Button></Flex></VStack></Grid>;
};

const emptySong = (): CampaignSong => ({ id: '', title: '', location: '', youtubeUrl: '', lines: [] });
const MusicPanel: React.FC<{ songs: CampaignSong[]; currentSongId?: string }> = ({ songs, currentSongId }) => {
  const [draft, setDraft] = useState<CampaignSong | null>(null); const [lyrics, setLyrics] = useState(''); const [saving, setSaving] = useState(false); const toast = useToast();
  const edit = (song?: CampaignSong) => { const next = song ? { ...song } : emptySong(); setDraft(next); setLyrics(next.lines.map((line) => line.hymmnos).join('\n')); };
  const save = async () => { if (!draft?.title.trim()) return; setSaving(true); const song = { ...draft, id: draft.id || `${slug(draft.title)}-${crypto.randomUUID().slice(0, 8)}`, title: draft.title.trim(), lines: lyrics.split(/\r?\n/).map((line) => line.trim()).filter(Boolean).map((hymmnos) => ({ hymmnos })) }; try { await saveSong(song); setDraft(null); toast({ title: 'Song saved permanently', description: 'The track and YouTube link are stored in Firestore.', status: 'success' }); } catch (caught) { toast({ title: 'Could not save song', description: String(caught), status: 'error' }); } finally { setSaving(false); } };
  const remove = async (song: CampaignSong) => { if (!window.confirm(`Delete “${song.title}” from the campaign library?`)) return; try { await deleteSong(song.id); toast({ title: 'Song deleted', status: 'success' }); } catch (caught) { toast({ title: 'Could not delete song', description: String(caught), status: 'error' }); } };
  return <VStack align="stretch" spacing={4}><Flex justify="space-between"><Box><Heading size="md">Permanent music library</Heading><Text color="#8f9bb0">Every title, lyric packet, and YouTube link is stored in Firestore.</Text></Box><Button leftIcon={<FaPlus />} onClick={() => edit()}>Add song</Button></Flex><SimpleGrid columns={{ base: 1, xl: 2 }} spacing={3}>{songs.map((song) => <Box key={song.id} p={4} border="1px solid" borderColor={song.id === currentSongId ? '#8b5cf6' : '#2c3648'} bg={song.id === currentSongId ? '#211a38' : '#0d131e'} borderRadius="12px"><Flex justify="space-between" gap={3}><Box minW={0}><Text fontWeight="bold" noOfLines={1}>{song.title}</Text><Text color="#8f9bb0" fontSize="sm">{song.location || 'Campaign track'} · {song.lines.length} lyric lines</Text></Box><HStack><IconButton aria-label="Play" icon={<FaPlay />} size="sm" onClick={() => setCurrentSong(song)} /><Button size="sm" variant="outline" borderColor="#46536a" onClick={() => edit(song)}>Edit</Button><IconButton aria-label="Delete" icon={<FaTrash />} size="sm" variant="ghost" colorScheme="red" onClick={() => remove(song)} /></HStack></Flex></Box>)}</SimpleGrid>{!songs.length && <Box border="1px dashed #3f4c63" borderRadius="12px" p={10} textAlign="center"><Text color="#8f9bb0">No songs yet. Add the first permanent campaign track.</Text></Box>}
    <Modal isOpen={!!draft} onClose={() => setDraft(null)} size="xl"><ModalOverlay bg="rgba(0,0,0,.72)" /><ModalContent bg="#111722" border="1px solid #354156"><ModalHeader>{draft?.id ? 'Edit song' : 'Add song'}</ModalHeader><ModalCloseButton /><ModalBody><VStack spacing={4}><FormControl isRequired><FormLabel>Title</FormLabel><Input value={draft?.title || ''} onChange={(e) => setDraft((current) => current ? { ...current, title: e.target.value } : current)} /></FormControl><FormControl><FormLabel>Campaign location</FormLabel><Input value={draft?.location || ''} onChange={(e) => setDraft((current) => current ? { ...current, location: e.target.value } : current)} /></FormControl><FormControl><FormLabel>YouTube URL</FormLabel><Input value={draft?.youtubeUrl || ''} onChange={(e) => setDraft((current) => current ? { ...current, youtubeUrl: e.target.value } : current)} /></FormControl><FormControl><FormLabel>Hymmnos lyrics</FormLabel><Textarea value={lyrics} onChange={(e) => setLyrics(e.target.value)} minH="220px" placeholder="One line per lyric packet" /></FormControl></VStack></ModalBody><ModalFooter><Button variant="ghost" mr={3} onClick={() => setDraft(null)}>Cancel</Button><Button onClick={save} isLoading={saving} isDisabled={!draft?.title.trim()}>Save song</Button></ModalFooter></ModalContent></Modal>
  </VStack>;
};

const EncounterPanel: React.FC<{ players: PlayerProfile[]; songs: CampaignSong[]; species: MonsterSpecies[]; activeEncounterId?: string }> = ({ players, songs, species, activeEncounterId }) => {
  const [encounter, setEncounter] = useState<Encounter | null>(null);
  useEffect(() => activeEncounterId ? subscribeEncounter(activeEncounterId, setEncounter) : (setEncounter(null), undefined), [activeEncounterId]);
  return encounter && encounter.status === 'active' ? <BattleScreenViewport encounter={encounter} /> : <EncounterBuilderDraggable players={players} songs={songs} species={species} />;
};

const EncounterBuilder: React.FC<{ players: PlayerProfile[]; songs: CampaignSong[]; species: MonsterSpecies[] }> = ({ players, songs, species }) => {
  const [name, setName] = useState('New encounter'); const [playerIds, setPlayerIds] = useState<string[]>([]); const [songId, setSongId] = useState(''); const [monsterId, setMonsterId] = useState(''); const [monsters, setMonsters] = useState<EncounterParticipant[]>([]); const [floorKey, setFloorKey] = useState(''); const [map, setMap] = useState<EncounterMapFrame | undefined>(); const [starting, setStarting] = useState(false); const toast = useToast();
  const floors = useMemo(() => mapData.flatMap((category) => category.floors.map((floor) => ({ key: `${category.id}:${floor.id}`, floor }))), []);
  const monsterOptions = useMemo<MonsterOption[]>(() => species.flatMap((entry) => Object.entries(entry.Tiers || {}).map(([tier, data]) => { const con = Number(data.Stats?.Constitution); const multiplier = tier.toLowerCase().includes('greater') ? 4 : tier.toLowerCase().includes('regular') ? 2 : 1; return { id: `${entry.categoryId}|${entry.name}|${tier}`, name: data.Name || `${tier} ${entry.name}`, tier, hp: Number.isFinite(con) ? Math.max(1, (10 + con * 2) * multiplier) : 10 * multiplier }; })), [species]);
  const chooseFloor = async (key: string) => { setFloorKey(key); const selected = floors.find((entry) => entry.key === key); if (!selected) { setMap(undefined); return; } try { const imageUrl = await getDownloadURL(ref(storage, `maps/${selected.floor.name}.jpg`)); setMap({ floorId: selected.floor.id, floorName: selected.floor.name, imageUrl, focusX: 50, focusY: 50, zoom: 2 }); } catch { setMap(undefined); toast({ title: 'Map image unavailable', status: 'warning' }); } };
  const addMonster = () => { const option = monsterOptions.find((entry) => entry.id === monsterId); if (!option) return; setMonsters((current) => [...current, { id: crypto.randomUUID(), sourceId: option.id, kind: 'monster', name: option.name, monsterTier: option.tier, hp: option.hp, maxHp: option.hp, armorClass: option.armorClass }]); };
  const begin = async () => { const party: EncounterParticipant[] = players.filter((player) => playerIds.includes(player.id)).map((player): EncounterParticipant => ({ id: `player-${player.id}`, sourceId: player.id, kind: 'player', name: playerLabel(player), hp: Number(player.stats?.hp || 10), maxHp: Number(player.stats?.maxHp || player.stats?.hp || 10), armorClass: player.stats?.armorClass })); const participants: EncounterParticipant[] = [...party, ...monsters]; if (!participants.length) return; setStarting(true); try { await startEncounter({ name: name.trim() || 'Encounter', song: songs.find((song) => song.id === songId), map, participants }); toast({ title: 'Battle started', description: 'Every player timer is paused until combat ends.', status: 'success' }); } catch (caught) { toast({ title: 'Could not start encounter', description: String(caught), status: 'error' }); } finally { setStarting(false); } };
  return <VStack align="stretch" spacing={5}><Box><Heading size="md">Encounter builder</Heading><Text color="#8f9bb0">Assemble combat, choose its score, and frame the exact 8K map area.</Text></Box><SimpleGrid columns={{ base: 1, xl: 2 }} spacing={6}><VStack align="stretch" spacing={4}><FormControl><FormLabel>Encounter name</FormLabel><Input value={name} onChange={(e) => setName(e.target.value)} /></FormControl><FormControl><FormLabel>Battle music</FormLabel><Select value={songId} onChange={(e) => setSongId(e.target.value)}><option value="">Keep current music</option>{songs.map((song) => <option key={song.id} value={song.id}>{song.title}</option>)}</Select></FormControl><Box><FormLabel>Party members</FormLabel><RecipientPicker players={players} value={playerIds} onChange={setPlayerIds} /></Box><Divider borderColor="#2c3648" /><FormControl><FormLabel>Add monster</FormLabel><HStack><Select value={monsterId} onChange={(e) => setMonsterId(e.target.value)}><option value="">Choose monster and tier</option>{monsterOptions.map((option) => <option key={option.id} value={option.id}>{option.name}</option>)}</Select><Button onClick={addMonster} isDisabled={!monsterId}>Add</Button></HStack></FormControl><VStack align="stretch">{monsters.map((monster) => <Flex key={monster.id} p={3} bg="#0d131e" borderRadius="10px" justify="space-between"><Box><Text fontWeight="bold">{monster.name}</Text><Text fontSize="xs" color="#8f9bb0">Starting HP {monster.hp}</Text></Box><IconButton aria-label="Remove monster" icon={<FaTrash />} size="sm" variant="ghost" colorScheme="red" onClick={() => setMonsters((current) => current.filter((entry) => entry.id !== monster.id))} /></Flex>)}</VStack></VStack><VStack align="stretch" spacing={4}><FormControl><FormLabel>Battle map</FormLabel><Select value={floorKey} onChange={(e) => chooseFloor(e.target.value)}><option value="">No map</option>{floors.map((entry) => <option key={entry.key} value={entry.key}>{entry.floor.name}</option>)}</Select></FormControl>{map ? <><Box position="relative" aspectRatio="16/9" overflow="hidden" borderRadius="14px" border="1px solid #354156" cursor="crosshair" onClick={(event) => { const rect = event.currentTarget.getBoundingClientRect(); setMap({ ...map, focusX: ((event.clientX - rect.left) / rect.width) * 100, focusY: ((event.clientY - rect.top) / rect.height) * 100 }); }}><Box as="img" src={map.imageUrl} w="100%" h="100%" objectFit="cover" transform={`scale(${map.zoom})`} transformOrigin={`${map.focusX}% ${map.focusY}%`} transition="transform .2s" /><Box position="absolute" left="50%" top="50%" transform="translate(-50%,-50%)" w="24px" h="24px" border="2px solid #f8fafc" borderRadius="full" boxShadow="0 0 0 2px #8b5cf6" /></Box><FormControl><FormLabel>Zoom ({map.zoom.toFixed(1)}×)</FormLabel><Input type="range" min="1" max="8" step=".25" value={map.zoom} onChange={(e) => setMap({ ...map, zoom: Number(e.target.value) })} /></FormControl><Text color="#8f9bb0" fontSize="sm">Click the map to center the battle. The saved frame is shown throughout combat.</Text></> : <Box aspectRatio="16/9" border="1px dashed #3f4c63" borderRadius="14px" display="grid" placeItems="center"><Text color="#8f9bb0">Choose an available floor map.</Text></Box>}</VStack></SimpleGrid><Flex justify="flex-end"><Button size="lg" leftIcon={<FaSkull />} onClick={begin} isLoading={starting} isDisabled={!playerIds.length && !monsters.length}>Start battle and pause all timers</Button></Flex></VStack>;
};

const clampMapFocus = (value: number, zoom: number) => {
  const halfVisible = 50 / Math.max(1, zoom);
  return Math.min(100 - halfVisible, Math.max(halfVisible, value));
};

const BattleMapViewport: React.FC<{
  map: EncounterMapFrame;
  onChange?: (map: EncounterMapFrame) => void;
  editable?: boolean;
}> = ({ map, onChange, editable = false }) => {
  const drag = useRef<{
    pointerId: number;
    startX: number;
    startY: number;
    focusX: number;
    focusY: number;
    width: number;
    height: number;
  } | null>(null);
  const [dragging, setDragging] = useState(false);

  const stopDragging = (event: React.PointerEvent<HTMLDivElement>) => {
    if (drag.current?.pointerId !== event.pointerId) return;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    drag.current = null;
    setDragging(false);
  };

  return (
    <Box
      position="relative"
      aspectRatio="16/9"
      overflow="hidden"
      borderRadius="14px"
      border="1px solid #354156"
      bg="#070a10"
      cursor={editable && map.zoom > 1 ? (dragging ? 'grabbing' : 'grab') : 'default'}
      sx={{ touchAction: 'none', userSelect: 'none' }}
      onPointerDown={(event) => {
        if (!editable || !onChange || map.zoom <= 1) return;
        event.preventDefault();
        const bounds = event.currentTarget.getBoundingClientRect();
        drag.current = {
          pointerId: event.pointerId,
          startX: event.clientX,
          startY: event.clientY,
          focusX: map.focusX,
          focusY: map.focusY,
          width: bounds.width,
          height: bounds.height,
        };
        event.currentTarget.setPointerCapture(event.pointerId);
        setDragging(true);
      }}
      onPointerMove={(event) => {
        const origin = drag.current;
        if (!editable || !onChange || !origin || origin.pointerId !== event.pointerId) return;
        const nextX = origin.focusX - ((event.clientX - origin.startX) / (origin.width * map.zoom)) * 100;
        const nextY = origin.focusY - ((event.clientY - origin.startY) / (origin.height * map.zoom)) * 100;
        onChange({
          ...map,
          focusX: clampMapFocus(nextX, map.zoom),
          focusY: clampMapFocus(nextY, map.zoom),
        });
      }}
      onPointerUp={stopDragging}
      onPointerCancel={stopDragging}
    >
      <Box
        as="img"
        src={map.imageUrl}
        alt={map.floorName}
        draggable={false}
        position="absolute"
        maxW="none"
        w={`${map.zoom * 100}%`}
        h={`${map.zoom * 100}%`}
        objectFit="cover"
        left={`${50 - map.focusX * map.zoom}%`}
        top={`${50 - map.focusY * map.zoom}%`}
        pointerEvents="none"
      />
      {editable && (
        <>
          <Badge position="absolute" left={3} top={3} bg="rgba(8,12,20,.84)" color="#e9d5ff" px={2} py={1} pointerEvents="none">
            {map.zoom <= 1 ? 'Zoom in to pan' : dragging ? 'Positioning frame…' : 'Drag map to position'}
          </Badge>
          <Box position="absolute" left="50%" top="50%" transform="translate(-50%,-50%)" w="32px" h="32px" pointerEvents="none">
            <Box position="absolute" left="50%" top={0} bottom={0} w="1px" bg="#ffffff" boxShadow="0 0 4px #7c3aed" />
            <Box position="absolute" top="50%" left={0} right={0} h="1px" bg="#ffffff" boxShadow="0 0 4px #7c3aed" />
            <Box position="absolute" inset="8px" border="2px solid #ffffff" borderRadius="full" boxShadow="0 0 0 2px #7c3aed" />
          </Box>
          <Text position="absolute" right={3} bottom={3} bg="rgba(8,12,20,.84)" color="#cbd5e1" px={2} py={1} borderRadius="6px" fontSize="xs" pointerEvents="none">
            Center {map.focusX.toFixed(1)}%, {map.focusY.toFixed(1)}%
          </Text>
        </>
      )}
    </Box>
  );
};

const EncounterBuilderDraggable: React.FC<{
  players: PlayerProfile[];
  songs: CampaignSong[];
  species: MonsterSpecies[];
}> = ({ players, songs, species }) => {
  const [name, setName] = useState('New encounter');
  const [playerIds, setPlayerIds] = useState<string[]>([]);
  const [songId, setSongId] = useState('');
  const [monsterId, setMonsterId] = useState('');
  const [monsters, setMonsters] = useState<EncounterParticipant[]>([]);
  const [floorKey, setFloorKey] = useState('');
  const [map, setMap] = useState<EncounterMapFrame>();
  const [starting, setStarting] = useState(false);
  const toast = useToast();
  const floors = useMemo(() => mapData.flatMap((category) => category.floors.map((floor) => ({ key: `${category.id}:${floor.id}`, floor }))), []);
  const monsterOptions = useMemo<MonsterOption[]>(() => species.flatMap((entry) => Object.entries(entry.Tiers || {}).map(([tier, data]) => {
    const stats = data.Stats || {};
    return {
      id: `${entry.categoryId}|${entry.name}|${tier}`,
      name: data.Name || `${tier} ${entry.name}`,
      tier,
      hp: finitePositive(stats.HP, stats.MaxHP, stats.HitPoints, stats['Hit Points']) || 0,
      armorClass: finitePositive(stats.Defence, stats.Defense, stats.AC, stats.ArmorClass, stats['Armor Class']),
      songHearing: data.SongHearing,
    };
  })), [species]);

  const chooseFloor = async (key: string) => {
    setFloorKey(key);
    const selected = floors.find((entry) => entry.key === key);
    if (!selected) { setMap(undefined); return; }
    try {
      const imageUrl = await getDownloadURL(ref(storage, `maps/${selected.floor.name}.jpg`));
      setMap({ floorId: selected.floor.id, floorName: selected.floor.name, imageUrl, focusX: 50, focusY: 50, zoom: 2 });
    } catch {
      setMap(undefined);
      toast({ title: 'Map image unavailable', status: 'warning' });
    }
  };

  const addMonster = () => {
    const option = monsterOptions.find((entry) => entry.id === monsterId);
    if (!option) return;
    setMonsters((current) => [...current, {
      id: crypto.randomUUID(), sourceId: option.id, kind: 'monster', name: option.name,
      monsterTier: option.tier, hp: option.hp, maxHp: option.hp, armorClass: option.armorClass,
      songHearing: option.songHearing,
    }]);
  };
  const begin = async () => {
    const party: EncounterParticipant[] = players.filter((player) => playerIds.includes(player.id)).map((player): EncounterParticipant => {
      const maxHp = finitePositive(player.combatStats?.maxHp) || 0;
      const storedHp = Number(player.combatStats?.currentHp);
      const currentHp = Number.isFinite(storedHp) && storedHp >= 0 ? Math.min(maxHp, storedHp) : maxHp;
      const armorClass = finitePositive(player.combatStats?.armorClass);
      return {
        id: `player-${player.id}`, sourceId: player.id, kind: 'player', name: playerLabel(player),
        hp: currentHp, maxHp, armorClass,
      };
    });
    const participants = [...party, ...monsters];
    if (!participants.length) return;
    const issues = getEncounterParticipantIssues(participants);
    if (issues.length) {
      toast({ title: 'Database combat profiles are incomplete', description: issues.join(' · '), status: 'warning', duration: 9000, isClosable: true });
      return;
    }
    setStarting(true);
    try {
      await startEncounter({ name: name.trim() || 'Encounter', song: songs.find((song) => song.id === songId), map, participants });
      toast({ title: 'Battle started', description: 'Every player timer is paused until combat ends.', status: 'success' });
    } catch (caught) {
      toast({ title: 'Could not start encounter', description: String(caught), status: 'error' });
    } finally { setStarting(false); }
  };

  return (
    <VStack align="stretch" spacing={5}>
      <Box><Heading size="md">Encounter builder</Heading><Text color="#8f9bb0">Assemble combat, choose its score, and frame the exact 8K map area.</Text></Box>
      <SimpleGrid columns={{ base: 1, xl: 2 }} spacing={6}>
        <VStack align="stretch" spacing={4}>
          <FormControl><FormLabel>Encounter name</FormLabel><Input value={name} onChange={(event) => setName(event.target.value)} /></FormControl>
          <FormControl><FormLabel>Battle music</FormLabel><Select value={songId} onChange={(event) => setSongId(event.target.value)}><option value="">Keep current music</option>{songs.map((song) => <option key={song.id} value={song.id}>{song.title}</option>)}</Select></FormControl>
          <Box><FormLabel>Party members</FormLabel><RecipientPicker players={players} value={playerIds} onChange={setPlayerIds} /></Box>
          <Divider borderColor="#2c3648" />
          <FormControl><FormLabel>Add monster</FormLabel><HStack><Select value={monsterId} onChange={(event) => setMonsterId(event.target.value)}><option value="">Choose monster and tier</option>{monsterOptions.map((option) => <option key={option.id} value={option.id}>{option.name}</option>)}</Select><Button onClick={addMonster} isDisabled={!monsterId}>Add</Button></HStack></FormControl>
          <VStack align="stretch" spacing={2}>{monsters.map((monster) => {
            const complete = monster.maxHp > 0 && Number(monster.armorClass) > 0;
            return <Flex key={monster.id} p={3} bg="#0d131e" border="1px solid" borderColor={complete ? '#2c3648' : '#7f1d1d'} borderRadius="10px" justify="space-between" align="center"><Box><Text fontWeight="bold">{monster.name}</Text><Text fontSize="xs" color={complete ? '#8f9bb0' : '#fca5a5'}>{complete ? `Database: ${monster.maxHp} HP · Defence ${monster.armorClass}` : 'Database combat profile incomplete (requires HP and Defence)'}</Text><Text fontSize="xs" color={monster.songHearing ? (monster.songHearing === 'soundless' ? '#f0abfc' : '#86efac') : '#8f9bb0'}>Song Hearing: {monster.songHearing === 'soundless' ? 'Soundless — immune' : monster.songHearing === 'audible' ? 'Audible — affected' : 'not documented'}</Text></Box><IconButton aria-label="Remove monster" icon={<FaTrash />} size="sm" variant="ghost" colorScheme="red" onClick={() => setMonsters((current) => current.filter((entry) => entry.id !== monster.id))} /></Flex>;
          })}</VStack>
        </VStack>
        <VStack align="stretch" spacing={4}>
          <FormControl><FormLabel>Battle map</FormLabel><Select value={floorKey} onChange={(event) => chooseFloor(event.target.value)}><option value="">No map</option>{floors.map((entry) => <option key={entry.key} value={entry.key}>{entry.floor.name}</option>)}</Select></FormControl>
          {map ? <>
            <BattleMapViewport map={map} onChange={setMap} editable />
            <FormControl>
              <Flex justify="space-between" align="center" mb={2}><FormLabel m={0}>Zoom ({map.zoom.toFixed(2)}×)</FormLabel><Button size="xs" variant="outline" onClick={() => setMap({ ...map, focusX: 50, focusY: 50, zoom: 2 })}>Reset view</Button></Flex>
              <Slider aria-label="Battle map zoom" min={1} max={8} step={0.25} value={map.zoom} onChange={(zoom) => setMap({ ...map, zoom, focusX: clampMapFocus(map.focusX, zoom), focusY: clampMapFocus(map.focusY, zoom) })}>
                <SliderTrack bg="#273142"><SliderFilledTrack bg="#8b5cf6" /></SliderTrack><SliderThumb boxSize={5} />
              </Slider>
            </FormControl>
            <Text color="#8f9bb0" fontSize="sm">Zoom in, then drag the map. The viewport itself is the saved battle frame; the center reticle marks its focal point.</Text>
          </> : <Box aspectRatio="16/9" border="1px dashed #3f4c63" borderRadius="14px" display="grid" placeItems="center"><Text color="#8f9bb0">Choose an available floor map.</Text></Box>}
        </VStack>
      </SimpleGrid>
      <Flex justify="flex-end"><Button size="lg" leftIcon={<FaSkull />} onClick={begin} isLoading={starting} isDisabled={!playerIds.length && !monsters.length}>Start battle and pause all timers</Button></Flex>
    </VStack>
  );
};

const BattleActions: React.FC<{ encounter: Encounter; onFinish: () => void }> = ({ encounter, onFinish }) => {
  const [advancing, setAdvancing] = useState(false);
  const toast = useToast();
  const openGameboard = () => window.open(
    `/admin/battle-map/${encounter.id}`,
    `hyzik-gameboard-${encounter.id}`,
    'popup=yes,width=1600,height=900,menubar=no,toolbar=no,location=no,status=no,resizable=yes,scrollbars=no',
  );
  const advance = async () => {
    setAdvancing(true);
    try {
      const result = await advanceEncounterTurn(encounter.id);
      toast({ title: `Round ${result.round}: ${result.activeParticipantName}`, description: 'That combatant may now act.', status: 'success' });
    } catch (caught: any) {
      toast({ title: 'Could not advance turn', description: caught?.message || String(caught), status: 'warning', duration: 7000 });
    } finally { setAdvancing(false); }
  };
  return <HStack><Button onClick={advance} isLoading={advancing}>{encounter.turn?.phase === 'active' ? `Next turn · round ${encounter.turn.round}` : 'Begin first turn'}</Button><Button variant="outline" leftIcon={<FaArrowUpRightFromSquare />} onClick={openGameboard} isDisabled={!encounter.map}>Open gameboard</Button><Button colorScheme="red" onClick={onFinish}>End battle</Button></HStack>;
};

const BattleScreenViewport: React.FC<{ encounter: Encounter }> = ({ encounter }) => {
  const [participants, setParticipants] = useState(encounter.participants);
  const [saving, setSaving] = useState(false);
  const toast = useToast();
  useEffect(() => setParticipants(encounter.participants), [encounter.participants]);
  const update = (id: string, change: Partial<EncounterParticipant>) => setParticipants((current) => current.map((entry) => entry.id === id ? { ...entry, ...change } : entry));
  const persist = async () => { setSaving(true); try { await updateEncounterParticipants(encounter.id, participants); } finally { setSaving(false); } };
  const ordered = [...participants].sort((a, b) => Number(Boolean(a.dead)) - Number(Boolean(b.dead)) || (b.initiative ?? -999) - (a.initiative ?? -999));
  const activeParticipant = participants.find((entry) => entry.id === encounter.turn?.activeParticipantId);
  const finish = async () => {
    if (!window.confirm('End this battle and resume eligible player timers?')) return;
    try {
      const result = await endEncounter(encounter.id);
      const unlocks = result.discoveries.flatMap((entry) => [
        ...(entry.baseUnlocked ? [`${entry.speciesName} discovered`] : []),
        ...(entry.loreUnlocked ? [`${entry.speciesName}: ${entry.loreUnlocked} lore`] : []),
        ...entry.tierUnlocked.map((tier) => `${entry.speciesName}: ${tier} profile`),
      ]);
      toast({ title: 'Battle ended', description: unlocks.length ? `Bestiary: ${unlocks.join(' · ')}` : 'Global timer pause released. No new bestiary knowledge.', status: 'success', duration: 9000, isClosable: true });
    }
    catch (caught) { toast({ title: 'Could not end battle', description: String(caught), status: 'error' }); }
  };
  return (
    <VStack align="stretch" spacing={5}>
      <Flex justify="space-between" gap={4} flexWrap="wrap"><Box><HStack><Badge bg="#7f1d1d" color="#fecaca">COMBAT · TIMERS PAUSED</Badge><Text color="#8f9bb0">{participants.length} combatants</Text></HStack><Heading mt={1}>{encounter.name}</Heading></Box><BattleActions encounter={encounter} onFinish={finish} /></Flex>
      {encounter.turn?.phase === 'active' && <Flex p={3} bg="#163c32" border="1px solid #34d399" borderRadius="12px" justify="space-between" gap={3} flexWrap="wrap"><Box><Text fontWeight="bold">Acting now: {activeParticipant?.name || 'Unknown combatant'}</Text>{activeParticipant?.turnResources && <Text fontSize="xs" color="#a7f3d0">Action {activeParticipant.turnResources.actionAvailable ? 'ready' : 'spent'} · Song {activeParticipant.turnResources.songAvailable === false ? 'spent' : 'ready'}{activeParticipant.turnResources.quickAvailable ? ' · Quick follow-up ready' : ''}</Text>}</Box><Badge colorScheme="green">Round {encounter.turn.round}</Badge></Flex>}
      <Flex p={3} bg={encounter.activeSong ? '#3b183f' : '#0d131e'} border={`1px solid ${encounter.activeSong ? '#e879f9' : '#2c3648'}`} borderRadius="12px" justify="space-between" gap={3} flexWrap="wrap"><Box><Text fontSize="xs" color="#8f9bb0">PERFORMANCE CHANNEL</Text><Text fontWeight="bold">{encounter.activeSong ? encounter.activeSong.songName : 'Silent'}</Text>{encounter.activeSong && <><Text fontSize="sm" color="#d8b4fe">{encounter.activeSong.performerName} · {encounter.activeSong.stage === 'chanting' ? `activates round ${encounter.activeSong.activatesAtRound}` : encounter.activeSong.endsAfterRound ? `active through round ${encounter.activeSong.endsAfterRound}` : 'active until interrupted'}</Text><Text fontSize="xs" color="#f5d0fe">Audience: every creature that can hear it. The performer must spend Song on each turn to sustain it. Soundless monsters are immune.</Text></>}</Box><Badge alignSelf="center" colorScheme={encounter.activeSong?.stage === 'chanting' ? 'yellow' : encounter.activeSong ? 'pink' : 'gray'}>{encounter.activeSong?.stage || 'no Canticle'}</Badge></Flex>
      <Grid templateColumns={{ base: '1fr', xl: 'minmax(420px,.85fr) minmax(0,1.15fr)' }} gap={6}>
        <VStack align="stretch" spacing={2}>{ordered.map((entry, index) => <Grid key={entry.id} templateColumns="44px minmax(130px,1fr) 82px 90px 90px" alignItems="center" gap={2} p={3} bg={!entry.dead && index === 0 && entry.initiative !== undefined ? '#211a38' : '#0d131e'} border="1px solid #2c3648" borderRadius="12px" opacity={entry.dead ? .42 : 1} filter={entry.dead ? 'grayscale(1)' : undefined}><Text textAlign="center" fontSize="xl" fontWeight="bold">{entry.dead ? '—' : index + 1}</Text><Box><Text fontWeight="bold" noOfLines={1}>{entry.name}</Text><HStack spacing={1}><Badge bg={entry.kind === 'player' ? '#163c32' : '#51252c'} color={entry.kind === 'player' ? '#a7f3d0' : '#fecaca'}>{entry.kind}</Badge>{entry.dead && <Badge colorScheme="red">DEAD · SKIPPED</Badge>}</HStack></Box><FormControl><FormLabel fontSize="10px" mb={1}>INIT</FormLabel><NumberInput size="sm" value={entry.initiative ?? ''} onChange={(_, value) => update(entry.id, { initiative: Number.isFinite(value) ? value : undefined })} onBlur={persist}><NumberInputField /></NumberInput></FormControl><FormControl><FormLabel fontSize="10px" mb={1}>HP</FormLabel><NumberInput size="sm" value={entry.hp} onChange={(_, value) => update(entry.id, { hp: Number.isFinite(value) ? value : 0 })} onBlur={persist}><NumberInputField /></NumberInput></FormControl><Text color="#8f9bb0" fontSize="sm">/ {entry.maxHp} HP</Text></Grid>)}<Button alignSelf="flex-end" variant="outline" onClick={persist} isLoading={saving}>Save battle state</Button></VStack>
        <Box>{encounter.map ? <><BattleMapViewport map={encounter.map} /><Text mt={2} color="#8f9bb0">{encounter.map.floorName} · exact saved encounter frame</Text></> : <Box aspectRatio="16/9" border="1px dashed #3f4c63" borderRadius="14px" display="grid" placeItems="center"><Text color="#8f9bb0">This encounter has no battle map.</Text></Box>}</Box>
      </Grid>
    </VStack>
  );
};

const BattleScreen: React.FC<{ encounter: Encounter }> = ({ encounter }) => {
  const [participants, setParticipants] = useState(encounter.participants); const [saving, setSaving] = useState(false); const toast = useToast();
  useEffect(() => setParticipants(encounter.participants), [encounter.participants]);
  const update = (id: string, patch: Partial<EncounterParticipant>) => setParticipants((current) => current.map((entry) => entry.id === id ? { ...entry, ...patch } : entry));
  const persist = async (next = participants) => { setSaving(true); try { await updateEncounterParticipants(encounter.id, next); } finally { setSaving(false); } };
  const ordered = [...participants].sort((a, b) => Number(Boolean(a.dead)) - Number(Boolean(b.dead)) || (b.initiative ?? -999) - (a.initiative ?? -999));
  const finish = async () => { if (!window.confirm('End this battle and resume eligible player timers?')) return; try { const result = await endEncounter(encounter.id); const unlocks = result.discoveries.flatMap((entry) => [...(entry.baseUnlocked ? [`${entry.speciesName} discovered`] : []), ...(entry.loreUnlocked ? [`${entry.speciesName}: ${entry.loreUnlocked} lore`] : []), ...entry.tierUnlocked.map((tier) => `${entry.speciesName}: ${tier} profile`)]); toast({ title: 'Battle ended', description: unlocks.length ? `Bestiary: ${unlocks.join(' · ')}` : 'Global timer pause released. No new bestiary knowledge.', status: 'success', duration: 9000, isClosable: true }); } catch (caught) { toast({ title: 'Could not end battle', description: String(caught), status: 'error' }); } };
  return <VStack align="stretch" spacing={5}><Flex justify="space-between" gap={4} flexWrap="wrap"><Box><HStack><Badge bg="#7f1d1d" color="#fecaca">COMBAT · TIMERS PAUSED</Badge><Text color="#8f9bb0">{participants.length} combatants</Text></HStack><Heading mt={1}>{encounter.name}</Heading></Box><Button colorScheme="red" onClick={finish}>End battle</Button></Flex><Grid templateColumns={{ base: '1fr', xl: 'minmax(420px,.85fr) minmax(0,1.15fr)' }} gap={6}><VStack align="stretch" spacing={2}>{ordered.map((entry, index) => <Grid key={entry.id} templateColumns="44px minmax(130px,1fr) 82px 90px 90px" alignItems="center" gap={2} p={3} bg={index === 0 && entry.initiative !== undefined ? '#211a38' : '#0d131e'} border="1px solid #2c3648" borderRadius="12px"><Text textAlign="center" fontSize="xl" fontWeight="bold">{index + 1}</Text><Box><Text fontWeight="bold" noOfLines={1}>{entry.name}</Text><Badge bg={entry.kind === 'player' ? '#163c32' : '#51252c'} color={entry.kind === 'player' ? '#a7f3d0' : '#fecaca'}>{entry.kind}</Badge></Box><FormControl><FormLabel fontSize="10px" mb={1}>INIT</FormLabel><NumberInput size="sm" value={entry.initiative ?? ''} onChange={(_, value) => update(entry.id, { initiative: Number.isFinite(value) ? value : undefined })} onBlur={() => persist()}><NumberInputField /></NumberInput></FormControl><FormControl><FormLabel fontSize="10px" mb={1}>HP</FormLabel><NumberInput size="sm" value={entry.hp} onChange={(_, value) => update(entry.id, { hp: Number.isFinite(value) ? value : 0 })} onBlur={() => persist()}><NumberInputField /></NumberInput></FormControl><Text color="#8f9bb0" fontSize="sm">/ {entry.maxHp} HP</Text></Grid>)}<Button alignSelf="flex-end" variant="outline" borderColor="#46536a" onClick={() => persist()} isLoading={saving}>Save battle state</Button></VStack><Box>{encounter.map ? <><Box aspectRatio="16/9" overflow="hidden" borderRadius="14px" border="1px solid #354156"><Box as="img" src={encounter.map.imageUrl} w="100%" h="100%" objectFit="cover" transform={`scale(${encounter.map.zoom})`} transformOrigin={`${encounter.map.focusX}% ${encounter.map.focusY}%`} /></Box><Text mt={2} color="#8f9bb0">{encounter.map.floorName} · saved encounter frame</Text></> : <Box aspectRatio="16/9" border="1px dashed #3f4c63" borderRadius="14px" display="grid" placeItems="center"><Text color="#8f9bb0">This encounter has no battle map.</Text></Box>}</Box></Grid></VStack>;
};

const EconomyPanel: React.FC<{ players: PlayerProfile[]; transactions: EconomyTransaction[] }> = ({ players, transactions }) => {
  const [playerId, setPlayerId] = useState('');
  const [factionId, setFactionId] = useState(ECONOMY_FACTIONS[0].id);
  const [vendorName, setVendorName] = useState('');
  const [favorDelta, setFavorDelta] = useState(0);
  const [reputationDelta, setReputationDelta] = useState(0);
  const [note, setNote] = useState('');
  const [saving, setSaving] = useState(false);
  const toast = useToast();
  const partyFavor = players.reduce((sum, player) => sum + Number(player.economy?.favor || 0), 0);
  const lifetimeEarned = players.reduce((sum, player) => sum + Number(player.economy?.lifetimeFavorEarned || 0), 0);
  const lifetimeSpent = players.reduce((sum, player) => sum + Number(player.economy?.lifetimeFavorSpent || 0), 0);
  const donatedItems = players.reduce((sum, player) => sum + Number(player.economy?.donatedItemCount || 0), 0);
  const recordBarter = async () => {
    if (!playerId || !note.trim() || (!favorDelta && !reputationDelta)) return;
    setSaving(true);
    try {
      await adminRecordBarter({ userId: playerId, factionId, vendorName: vendorName.trim() || undefined, favorDelta, reputationDelta, note: note.trim() });
      toast({ title: 'Barter recorded', description: 'Balances were updated and the literal trade was added to the permanent ledger.', status: 'success' });
      setFavorDelta(0); setReputationDelta(0); setNote('');
    } catch (caught: any) {
      toast({ title: 'Could not record barter', description: caught?.message || String(caught), status: 'error', duration: 7000 });
    } finally { setSaving(false); }
  };
  return <VStack align="stretch" spacing={6}>
    <Box><Heading size="md">Favor, factions, and literal trade history</Heading><Text color="#8f9bb0">Favor is spendable. Reputation and the transaction ledger are permanent campaign records.</Text></Box>
    <SimpleGrid columns={{ base: 2, lg: 4 }} spacing={3}>
      <Box sx={panel} p={4}><Text color="#8f9bb0" fontSize="xs">PARTY FAVOR AVAILABLE</Text><Heading size="lg">{partyFavor}</Heading></Box>
      <Box sx={panel} p={4}><Text color="#8f9bb0" fontSize="xs">LIFETIME FAVOR EARNED</Text><Heading size="lg">{lifetimeEarned}</Heading></Box>
      <Box sx={panel} p={4}><Text color="#8f9bb0" fontSize="xs">LIFETIME FAVOR SPENT</Text><Heading size="lg">{lifetimeSpent}</Heading></Box>
      <Box sx={panel} p={4}><Text color="#8f9bb0" fontSize="xs">ITEMS GIVEN TO OMNIA</Text><Heading size="lg">{donatedItems}</Heading></Box>
    </SimpleGrid>
    <Box>
      <Heading size="sm" mb={3}>Reputation graph</Heading>
      <SimpleGrid columns={{ base: 1, xl: 2 }} spacing={4}>
        {ECONOMY_FACTIONS.map((faction) => {
          const maximum = Math.max(1, ...players.map((player) => Number(player.economy?.reputation?.[faction.id] || 0)));
          const donated = players.reduce((sum, player) => sum + Number(player.economy?.factionContributions?.[faction.id]?.items || 0), 0);
          const generated = players.reduce((sum, player) => sum + Number(player.economy?.factionContributions?.[faction.id]?.favor || 0), 0);
          return <Box key={faction.id} sx={panel} p={4}>
            <Flex justify="space-between" gap={3}><Box><Text fontWeight="bold">{faction.name}</Text><Text fontSize="xs" color="#8f9bb0">{donated} items · {generated} Favor generated</Text></Box><Badge bg="#312e52" color="#c4b5fd">{faction.vendors.length} vendors</Badge></Flex>
            <VStack align="stretch" mt={4} spacing={3}>{players.map((player) => {
              const score = Number(player.economy?.reputation?.[faction.id] || 0);
              const contribution = player.economy?.factionContributions?.[faction.id];
              return <Box key={player.id}><Flex justify="space-between" fontSize="sm"><Text>{playerLabel(player)}</Text><Text>{score} · {reputationTier(score).name}</Text></Flex><Progress mt={1} value={(score / maximum) * 100} size="sm" colorScheme="purple" borderRadius="full" /><Text mt={1} fontSize="10px" color="#738097">{contribution?.items || 0} donated · {contribution?.favor || 0} Favor generated</Text></Box>;
            })}</VStack>
          </Box>;
        })}
      </SimpleGrid>
    </Box>
    <Box sx={panel} p={4}>
      <Heading size="sm" mb={1}>Record an in-person barter</Heading><Text color="#8f9bb0" fontSize="sm" mb={4}>Use this when the table negotiates manually at a location. Negative Favor means the player paid; positive Favor means the vendor credited them.</Text>
      <Grid templateColumns={{ base: '1fr', lg: '1fr 1fr 1fr 150px 150px' }} gap={3}>
        <FormControl><FormLabel>Player</FormLabel><Select value={playerId} onChange={(event) => setPlayerId(event.target.value)}><option value="">Choose player</option>{players.map((player) => <option key={player.id} value={player.id}>{playerLabel(player)}</option>)}</Select></FormControl>
        <FormControl><FormLabel>Faction</FormLabel><Select value={factionId} onChange={(event) => setFactionId(event.target.value)}>{ECONOMY_FACTIONS.map((faction) => <option key={faction.id} value={faction.id}>{faction.name}</option>)}</Select></FormControl>
        <FormControl><FormLabel>Vendor / counterparty</FormLabel><Input value={vendorName} onChange={(event) => setVendorName(event.target.value)} /></FormControl>
        <FormControl><FormLabel>Favor change</FormLabel><NumberInput value={favorDelta} onChange={(_, value) => setFavorDelta(Number.isFinite(value) ? Math.floor(value) : 0)}><NumberInputField /></NumberInput></FormControl>
        <FormControl><FormLabel>Rep change</FormLabel><NumberInput value={reputationDelta} onChange={(_, value) => setReputationDelta(Number.isFinite(value) ? Math.floor(value) : 0)}><NumberInputField /></NumberInput></FormControl>
      </Grid>
      <HStack mt={3} align="end"><FormControl><FormLabel>Exact trade / ruling</FormLabel><Input value={note} onChange={(event) => setNote(event.target.value)} placeholder="What changed hands, why, and any negotiated terms" /></FormControl><Button onClick={recordBarter} isLoading={saving} isDisabled={!playerId || !note.trim() || (!favorDelta && !reputationDelta)}>Record trade</Button></HStack>
    </Box>
    <Box>
      <Heading size="sm" mb={3}>Trade history</Heading>
      <TableContainer border="1px solid #2c3648" borderRadius="12px" maxH="620px" overflowY="auto"><Table size="sm" variant="simple"><Thead position="sticky" top={0} bg="#111722" zIndex={1}><Tr><Th>When</Th><Th>Player</Th><Th>Event</Th><Th>Counterparty</Th><Th>Item / terms</Th><Th isNumeric>Favor</Th><Th isNumeric>Rep</Th></Tr></Thead><Tbody>{transactions.map((entry) => <Tr key={entry.id}><Td whiteSpace="nowrap">{entry.createdAt?.toDate ? entry.createdAt.toDate().toLocaleString() : new Date(entry.createdAtMs).toLocaleString()}</Td><Td>{entry.playerName || players.find((player) => player.id === entry.playerId)?.displayName || entry.playerId}</Td><Td><Badge>{entry.kind}</Badge></Td><Td>{entry.vendorName || entry.factionName || entry.counterpartyName || '—'}</Td><Td><Text>{entry.itemName ? `${entry.quantity || 1} × ${entry.itemName}` : entry.note || '—'}</Text>{entry.itemName && entry.note && <Text fontSize="xs" color="#8f9bb0">{entry.note}</Text>}</Td><Td isNumeric color={entry.favorDelta > 0 ? '#86efac' : entry.favorDelta < 0 ? '#fca5a5' : undefined}>{entry.favorDelta > 0 ? '+' : ''}{entry.favorDelta}</Td><Td isNumeric>{entry.reputationDelta ? `+${entry.reputationDelta}` : '—'}</Td></Tr>)}{!transactions.length && <Tr><Td colSpan={7}><Text py={8} textAlign="center" color="#8f9bb0">No economy transactions recorded yet.</Text></Td></Tr>}</Tbody></Table></TableContainer>
    </Box>
  </VStack>;
};

const AdminPortal: React.FC<{ previewMode?: boolean }> = (props) => <ChakraProvider theme={adminTheme} resetCSS={false}><AdminPortalContent {...props} /></ChakraProvider>;

export default AdminPortal;
