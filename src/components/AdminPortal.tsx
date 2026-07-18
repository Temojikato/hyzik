import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Alert, AlertIcon, Badge, Box, Button, Checkbox, CheckboxGroup, Flex, FormControl, FormLabel,
  Grid, Heading, HStack, IconButton, Input, Select, SimpleGrid, Spinner, Stat, StatHelpText,
  StatLabel, StatNumber, Tab, TabList, TabPanel, TabPanels, Table, TableContainer, Tabs, Tbody,
  Td, Text, Textarea, Th, Thead, Tr, useToast, VStack,
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { FaArrowLeft, FaArrowRotateRight, FaEye, FaLanguage, FaMessage, FaMusic, FaUsers } from 'react-icons/fa6';
import { useAuth } from '../contexts/AuthContext';
import { useCampaign } from '../contexts/CampaignContext';
import { CYPHERS } from '../data/cyphers';
import { grantCyphers, listPlayers, saveSong, sendPrivateMessages, setCurrentSong, subscribePlayers } from '../services/campaignService';
import { CampaignSong, PlayerProfile } from '../types/Campaign';
import { getYouTubeEmbedUrl } from '../utils/youtube';
import Panel from './ui/Panel';

const playerLabel = (player: PlayerProfile) => player.displayName || player.email || player.reyvateilName || player.id;
const conditionLabel = (condition: NonNullable<PlayerProfile['conditions']>[number]) => typeof condition === 'string' ? condition : `${condition.name}${condition.amount !== undefined ? ` ${condition.amount}` : ''}`;

const previewPlayers: PlayerProfile[] = [
  { id: 'preview-a', displayName: 'Aster', email: 'aster@example.com', reyvateilName: 'Melodia', level: 3, conditions: [{ name: 'Greed', amount: 22 }], unlockedCyphers: ['cypher-01', 'cypher-11'], stats: { resolve: 7 } },
  { id: 'preview-b', displayName: 'Rook', email: 'rook@example.com', reyvateilName: 'Thundara', level: 2, conditions: [], unlockedCyphers: ['cypher-01'], stats: { insight: 4 } },
  { id: 'preview-c', displayName: 'Vale', email: 'vale@example.com', reyvateilName: 'Vespera', level: 4, conditions: [{ name: 'Doubt', amount: 13 }], unlockedCyphers: Array.from({ length: 9 }, (_, index) => `cypher-${String(index + 1).padStart(2, '0')}`), stats: { arcana: 8 } },
];

const AdminPortal: React.FC<{ previewMode?: boolean }> = ({ previewMode = false }) => {
  const { currentUser } = useAuth();
  const { songs, campaignState, currentSong } = useCampaign();
  const [players, setPlayers] = useState<PlayerProfile[]>(previewMode ? previewPlayers : []);
  const [loading, setLoading] = useState(!previewMode);
  const [error, setError] = useState('');
  const [selectedPlayerId, setSelectedPlayerId] = useState(previewMode ? previewPlayers[0].id : '');
  const [selectedCyphers, setSelectedCyphers] = useState<string[]>([]);
  const [recipientIds, setRecipientIds] = useState<string[]>([]);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [songDrafts, setSongDrafts] = useState<Record<string, string>>({});
  const [playingUrl, setPlayingUrl] = useState('');
  const toast = useToast();

  const refreshPlayers = useCallback(async () => {
    if (previewMode) return;
    setLoading(true); setError('');
    try {
      const rows = await listPlayers();
      setPlayers(rows);
      if (rows.length) setSelectedPlayerId((current) => current || rows[0].id);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Unable to load players.');
    } finally { setLoading(false); }
  }, [previewMode]);

  useEffect(() => {
    if (previewMode) return undefined;
    void refreshPlayers();
    return subscribePlayers((rows) => { setPlayers(rows); setLoading(false); }, (caught) => setError(caught.message));
  }, [previewMode, refreshPlayers]);
  useEffect(() => {
    const player = players.find((item) => item.id === selectedPlayerId);
    setSelectedCyphers(player?.unlockedCyphers || []);
  }, [players, selectedPlayerId]);

  const activeConditions = useMemo(() => players.reduce((count, player) => count + (player.conditions?.length || 0), 0), [players]);

  const selectSong = async (song: CampaignSong) => {
    const youtubeUrl = songDrafts[song.id] ?? song.youtubeUrl ?? '';
    const saved = { ...song, youtubeUrl };
    try {
      await saveSong(saved);
      await setCurrentSong(saved);
      setPlayingUrl(youtubeUrl);
      toast({ title: `Now playing: ${song.title}`, status: 'success', duration: 2500 });
    } catch (caught) { toast({ title: 'Could not change the current song', description: String(caught), status: 'error' }); }
  };

  const savePlayerCyphers = async () => {
    if (!selectedPlayerId) return;
    try { await grantCyphers(selectedPlayerId, selectedCyphers); await refreshPlayers(); toast({ title: 'Cyphers updated', status: 'success' }); }
    catch (caught) { toast({ title: 'Could not update Cyphers', description: String(caught), status: 'error' }); }
  };

  const sendMessage = async () => {
    if (!currentUser || !recipientIds.length || !message.trim()) return;
    try {
      await sendPrivateMessages(currentUser.uid, recipientIds, message.trim(), subject.trim());
      setMessage(''); setSubject(''); setRecipientIds([]);
      toast({ title: `Private message sent to ${recipientIds.length} player${recipientIds.length === 1 ? '' : 's'}`, status: 'success' });
    } catch (caught) { toast({ title: 'Could not send message', description: String(caught), status: 'error' }); }
  };

  const embedUrl = getYouTubeEmbedUrl(playingUrl, true);

  return (
    <Box minH="100vh" p={{ base: 3, md: 6 }}>
      <Flex maxW="1600px" mx="auto" direction="column" gap={5}>
        <Flex justify="space-between" align="center" gap={4} flexWrap="wrap">
          <Box><HStack color="textMuted" fontSize="sm"><Badge colorScheme="purple">ADMIN</Badge><Text>Omnia campaign control</Text></HStack><Heading mt={1}>Tower operations</Heading></Box>
          <HStack><Button as={Link} to="/" leftIcon={<FaArrowLeft />} variant="outline">Player portal</Button><IconButton aria-label="Refresh players" icon={<FaArrowRotateRight />} onClick={refreshPlayers} /></HStack>
        </Flex>
        {error && <Alert status="error" borderRadius="xl"><AlertIcon />{error}</Alert>}
        <SimpleGrid columns={{ base: 2, lg: 4 }} spacing={4}>
          <Panel p={4}><Stat><StatLabel>Players</StatLabel><StatNumber>{players.length}</StatNumber><StatHelpText>registered accounts</StatHelpText></Stat></Panel>
          <Panel p={4}><Stat><StatLabel>Active conditions</StatLabel><StatNumber>{activeConditions}</StatNumber><StatHelpText>across the party</StatHelpText></Stat></Panel>
          <Panel p={4}><Stat><StatLabel>Current song</StatLabel><StatNumber fontSize="md" noOfLines={1}>{currentSong?.title || 'None'}</StatNumber><StatHelpText>player translators follow this</StatHelpText></Stat></Panel>
          <Panel p={4}><Stat><StatLabel>Cypher capacity</StatLabel><StatNumber>48</StatNumber><StatHelpText>progressive language families</StatHelpText></Stat></Panel>
        </SimpleGrid>
        <Panel overflow="hidden">
          <Tabs isLazy variant="enclosed-colored">
            <TabList px={3} pt={3} overflowX="auto"><Tab><HStack><FaUsers /><Text>Players</Text></HStack></Tab><Tab><HStack><FaMusic /><Text>Music</Text></HStack></Tab><Tab><HStack><FaLanguage /><Text>Cyphers</Text></HStack></Tab><Tab><HStack><FaMessage /><Text>Messages</Text></HStack></Tab></TabList>
            <TabPanels>
              <TabPanel p={{ base: 3, md: 5 }}>
                {loading ? <Flex py={12} justify="center"><Spinner /></Flex> : <TableContainer><Table variant="simple"><Thead><Tr><Th>Player</Th><Th>Reyvateil</Th><Th>Conditions</Th><Th>Cyphers</Th><Th textAlign="right">Portal</Th></Tr></Thead><Tbody>{players.map((player) => <Tr key={player.id}><Td><Text fontWeight="bold">{playerLabel(player)}</Text><Text fontSize="xs" color="textMuted">{player.id}</Text></Td><Td>{player.reyvateilName || player.reyvateilId || 'Not selected'}</Td><Td><HStack>{player.conditions?.length ? player.conditions.slice(0, 3).map((condition, index) => <Badge key={`${conditionLabel(condition)}-${index}`} colorScheme="red">{conditionLabel(condition)}</Badge>) : <Badge colorScheme="green">Clear</Badge>}</HStack></Td><Td>{player.unlockedCyphers?.length || 0}/48</Td><Td textAlign="right"><Button as={Link} to={`/admin/players/${player.id}`} size="sm" leftIcon={<FaEye />} variant="outline">View only</Button></Td></Tr>)}</Tbody></Table></TableContainer>}
              </TabPanel>
              <TabPanel p={{ base: 3, md: 5 }}>
                <Grid templateColumns={{ base: '1fr', xl: 'minmax(0, 1fr) 480px' }} gap={5}>
                  <VStack align="stretch" spacing={3}>{songs.map((song) => <Box key={song.id} p={4} border="1px solid" borderColor={campaignState.currentSongId === song.id ? 'primary' : 'border'} borderRadius="xl" bg={campaignState.currentSongId === song.id ? 'purple.900' : 'transparent'}><Flex justify="space-between" gap={4} align={{ base: 'stretch', md: 'center' }} direction={{ base: 'column', md: 'row' }}><Box><Text fontWeight="bold">{song.title}</Text><Text fontSize="sm" color="textMuted">{song.location || 'Campaign track'} · {song.lines.length} lyric packets</Text></Box><Button size="sm" onClick={() => selectSong(song)}>{campaignState.currentSongId === song.id ? 'Restart / sync' : 'Make current'}</Button></Flex><FormControl mt={3}><FormLabel fontSize="xs" color="textMuted">YouTube URL</FormLabel><Input size="sm" value={songDrafts[song.id] ?? song.youtubeUrl ?? ''} onChange={(event) => setSongDrafts((current) => ({ ...current, [song.id]: event.target.value }))} placeholder="https://youtube.com/watch?v=…" /></FormControl></Box>)}</VStack>
                  <Panel p={4} alignSelf="start" position={{ xl: 'sticky' }} top={5}><Heading size="sm" mb={3}>Game-master playback</Heading>{embedUrl ? <Box as="iframe" title="Current song playback" src={embedUrl} allow="autoplay; encrypted-media" w="100%" aspectRatio="16/9" border={0} borderRadius="xl" /> : <Box aspectRatio="16/9" border="1px dashed" borderColor="border" borderRadius="xl" display="grid" placeItems="center" p={5}><Text textAlign="center" color="textMuted">Choose a song with a valid YouTube URL. Selection updates every player translator and starts playback here.</Text></Box>}</Panel>
                </Grid>
              </TabPanel>
              <TabPanel p={{ base: 3, md: 5 }}>
                <Flex gap={4} align={{ base: 'stretch', md: 'end' }} direction={{ base: 'column', md: 'row' }} mb={5}><FormControl maxW="520px"><FormLabel>Player</FormLabel><Select value={selectedPlayerId} onChange={(event) => setSelectedPlayerId(event.target.value)}>{players.map((player) => <option key={player.id} value={player.id}>{playerLabel(player)}</option>)}</Select></FormControl><Button onClick={savePlayerCyphers}>Save unlocks</Button><Button variant="outline" onClick={() => setSelectedCyphers(CYPHERS.map((cypher) => cypher.id))}>Unlock all</Button></Flex>
                <CheckboxGroup value={selectedCyphers} onChange={(value) => setSelectedCyphers(value as string[])}><SimpleGrid columns={{ base: 1, md: 2, xl: 4 }} spacing={3}>{CYPHERS.map((cypher) => <Checkbox key={cypher.id} value={cypher.id} p={3} border="1px solid" borderColor={selectedCyphers.includes(cypher.id) ? cypher.color : 'border'} borderRadius="xl"><Text fontWeight="bold">{String(cypher.number).padStart(2, '0')} · {cypher.title}</Text><Text fontSize="xs" color="textMuted">{cypher.domain}</Text></Checkbox>)}</SimpleGrid></CheckboxGroup>
              </TabPanel>
              <TabPanel p={{ base: 3, md: 5 }}>
                <Grid templateColumns={{ base: '1fr', lg: 'minmax(260px, .7fr) minmax(0, 1.3fr)' }} gap={6}><Box><Heading size="sm" mb={3}>Recipients</Heading><VStack align="stretch" maxH="470px" overflowY="auto"><Checkbox isChecked={recipientIds.length === players.length && players.length > 0} onChange={(event) => setRecipientIds(event.target.checked ? players.map((player) => player.id) : [])} p={3} border="1px solid" borderColor="border" borderRadius="xl"><Text fontWeight="bold">Entire party</Text></Checkbox>{players.map((player) => <Checkbox key={player.id} isChecked={recipientIds.includes(player.id)} onChange={(event) => setRecipientIds((current) => event.target.checked ? [...current, player.id] : current.filter((id) => id !== player.id))} p={3} border="1px solid" borderColor="border" borderRadius="xl"><Text fontWeight="bold">{playerLabel(player)}</Text><Text fontSize="xs" color="textMuted">{player.reyvateilName || 'No Reyvateil'}</Text></Checkbox>)}</VStack></Box><VStack align="stretch" spacing={4}><Box><Heading size="sm">Discreet transmission</Heading><Text fontSize="sm" color="textMuted" mt={1}>It appears immediately but hides its contents behind a silent privacy prompt.</Text></Box><FormControl><FormLabel>Subject (optional)</FormLabel><Input value={subject} onChange={(event) => setSubject(event.target.value)} maxLength={80} /></FormControl><FormControl><FormLabel>Message</FormLabel><Textarea value={message} onChange={(event) => setMessage(event.target.value)} minH="220px" maxLength={2000} /></FormControl><Flex justify="space-between" align="center"><Text color="textMuted" fontSize="sm">{recipientIds.length} selected · {message.length}/2000</Text><Button leftIcon={<FaMessage />} onClick={sendMessage} isDisabled={!recipientIds.length || !message.trim()}>Send silently</Button></Flex></VStack></Grid>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Panel>
      </Flex>
    </Box>
  );
};

export default AdminPortal;
