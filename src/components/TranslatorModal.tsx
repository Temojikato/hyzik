import React, { useMemo, useState } from 'react';
import {
  Badge, Box, Button, Flex, HStack, Input, Modal, ModalBody, ModalCloseButton, ModalContent,
  ModalHeader, Progress, SimpleGrid, Tab, TabList, TabPanel, TabPanels, Tabs, Text, VStack,
} from '@chakra-ui/react';
import { FaLock, FaMusic, FaVolumeHigh } from 'react-icons/fa6';
import { useCampaign } from '../contexts/CampaignContext';
import { useAuth } from '../contexts/AuthContext';
import { CYPHERS } from '../data/cyphers';
import HymmnosText from './HymmnosText';
import LexiconEntryModal from './LexiconEntryModal';
import { PublicLexiconEntry } from '../types/Campaign';
import { buildProgressiveTranslation } from '../utils/hymmnosTranslation';
import { useBackDismiss } from '../contexts/BackNavigationContext';

const SongTranslation: React.FC<{ hymmnos: string; publicLexicon: PublicLexiconEntry[]; unlockedLexicon: ReturnType<typeof useCampaign>['unlockedLexicon'] }> = ({ hymmnos, publicLexicon, unlockedLexicon }) => {
  const translation = useMemo(() => buildProgressiveTranslation(hymmnos, publicLexicon, unlockedLexicon), [hymmnos, publicLexicon, unlockedLexicon]);
  return (
    <Text mt={2} color="textMuted" fontSize="sm">
      <Badge mr={2} colorScheme={translation.revealed ? 'teal' : 'gray'}>Translation</Badge>
      <Text as="span" color={translation.revealed ? 'teal.100' : 'textMuted'}>{translation.text}</Text>
    </Text>
  );
};

const TranslatorModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  useBackDismiss(isOpen, onClose);
  const { currentSong, publicLexicon, unlockedLexicon, lexiconAvailable } = useCampaign();
  const { profile } = useAuth();
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<PublicLexiconEntry | null>(null);
  const [tabIndex, setTabIndex] = useState(0);
  const filtered = useMemo(() => {
    const needle = search.trim().toLowerCase();
    const entries = needle ? publicLexicon.filter((entry) => entry.headword.toLowerCase().includes(needle) || unlockedLexicon.get(entry.id)?.meaning.toLowerCase().includes(needle)) : publicLexicon;
    return entries.slice(0, 160);
  }, [publicLexicon, search, unlockedLexicon]);
  const unlockedCyphers = profile?.unlockedCyphers || [];

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="6xl" scrollBehavior="inside">
      <ModalContent minH={{ base: '92vh', md: '76vh' }}>
        <ModalHeader><HStack><FaMusic /><Text>Hymmnos Interface</Text><Badge colorScheme="purple">{unlockedCyphers.length}/48 Cyphers</Badge></HStack></ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <Tabs index={tabIndex} onChange={setTabIndex} isLazy>
            <TabList overflowX="auto">
              <Tab whiteSpace="nowrap">Current song</Tab>
              <Tab>Lexicon</Tab>
              <Tab>Cyphers</Tab>
            </TabList>
            <TabPanels>
              <TabPanel px={{ base: 0, md: 4 }}>
                {currentSong ? (
                  <VStack align="stretch" spacing={5}>
                    <Box>
                      <Text fontSize="xs" color="textMuted" textTransform="uppercase" letterSpacing=".14em">Current Hymmnos transmission</Text>
                      {currentSong.lines[0] ? <><Box mt={1} fontSize={{ base: '2xl', md: '3xl' }} fontWeight="bold"><HymmnosText>{currentSong.lines[0].hymmnos}</HymmnosText></Box><SongTranslation hymmnos={currentSong.lines[0].hymmnos} publicLexicon={publicLexicon} unlockedLexicon={unlockedLexicon} /></> : <Text fontSize="2xl" fontWeight="bold">Untitled transmission</Text>}
                      <Text mt={2} color="textMuted">{currentSong.location}</Text>
                    </Box>
                    {currentSong.lines.length ? currentSong.lines.map((line, index) => (
                      <Box key={`${line.hymmnos}-${index}`} p={4} bg="rgba(255,255,255,.03)" borderRadius="xl" borderLeft="3px solid" borderColor="primary">
                        <HymmnosText>{line.hymmnos}</HymmnosText>
                        <SongTranslation hymmnos={line.hymmnos} publicLexicon={publicLexicon} unlockedLexicon={unlockedLexicon} />
                      </Box>
                    )) : <Text color="textMuted">This track has no registered lyric packets.</Text>}
                  </VStack>
                ) : <Text color="textMuted">The admin has not selected a current song yet.</Text>}
              </TabPanel>
              <TabPanel px={{ base: 0, md: 4 }}>
                <Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search a Hymmnos word, pronunciation, or unlocked meaning…" mb={4} />
                {!lexiconAvailable && <Text color="orange.300" mb={4}>The protected lexicon has not been seeded yet. Headwords and pronunciation remain available; meanings stay safely locked.</Text>}
                <SimpleGrid columns={{ base: 1, md: 2, xl: 3 }} spacing={2}>
                  {filtered.map((entry) => {
                    const unlocked = unlockedLexicon.get(entry.id);
                    return (
                      <Button key={entry.id} h="auto" py={3} px={4} variant="outline" justifyContent="space-between" onClick={() => setSelected(entry)}>
                        <Box textAlign="left" minW={0}><Text fontFamily="Hymmnos" fontSize="xl" color={unlocked ? 'teal.200' : 'textHeader'}>{entry.headword}</Text><Text fontSize="xs" color="textMuted" noOfLines={1}>{unlocked?.meaning || entry.pronunciation}</Text></Box>
                        {unlocked ? <FaVolumeHigh /> : <FaLock />}
                      </Button>
                    );
                  })}
                </SimpleGrid>
              </TabPanel>
              <TabPanel px={{ base: 0, md: 4 }}>
                <Flex justify="space-between" mb={2}><Text>{unlockedCyphers.length} recovered</Text><Text color="textMuted">{48 - unlockedCyphers.length} remain</Text></Flex>
                <Progress value={(unlockedCyphers.length / 48) * 100} colorScheme="purple" borderRadius="full" mb={5} />
                <SimpleGrid columns={{ base: 1, md: 2, xl: 3 }} spacing={3}>
                  {CYPHERS.map((cypher) => {
                    const unlocked = unlockedCyphers.includes(cypher.id);
                    return <Box key={cypher.id} p={4} border="1px solid" borderColor={unlocked ? cypher.color : 'border'} bg={unlocked ? `${cypher.color}18` : 'transparent'} borderRadius="xl"><HStack><Badge>{String(cypher.number).padStart(2, '0')}</Badge><Text fontWeight="bold">{unlocked ? cypher.title : 'Untranslated Cypher'}</Text>{!unlocked && <FaLock />}</HStack><Text mt={2} fontSize="sm" color="textMuted">{unlocked ? cypher.description : cypher.domain}</Text></Box>;
                  })}
                </SimpleGrid>
              </TabPanel>
            </TabPanels>
          </Tabs>
          {selected && <LexiconEntryModal entry={selected} isOpen={Boolean(selected)} onClose={() => setSelected(null)} />}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default TranslatorModal;
