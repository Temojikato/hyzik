import React, { useEffect, useMemo, useState } from 'react';
import {
  Badge,
  Box,
  Button,
  Collapse,
  Divider,
  Flex,
  Grid,
  Heading,
  HStack,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Progress,
  Select,
  SimpleGrid,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tooltip,
  Tr,
  useToast,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import { FaBolt, FaChevronDown, FaChevronUp, FaCircleQuestion, FaHeartCrack, FaLock, FaShieldHalved, FaSkull, FaVolumeHigh } from 'react-icons/fa6';
import { useAuth } from '../contexts/AuthContext';
import { useCampaign } from '../contexts/CampaignContext';
import { activateCombatAbility, applyMortalConsequence, continueCombatSong, subscribeEncounter } from '../services/campaignService';
import { Encounter, EncounterParticipant, PlayerCombatProfile, PlayerProfile } from '../types/Campaign';
import { Ability, CombatAbility, CombatAptitudeKey, CombatSong, Reyvateil } from '../types/Reyvateils';
import { getAbilitySpokenForm, resolveAbilityInvocation } from '../utils/abilityHymmnos';
import { combatDamageTypes } from '../data/combatDamageTypes';
import { resolveBraceText, resolveCombatText, resolveShoveText, resolveStrikeText } from '../utils/combatText';
import { useBackDismiss } from '../contexts/BackNavigationContext';

const aptitudeLabels: Record<string, { label: string; hint: string }> = {
  force: { label: 'Force', hint: 'Power, impact, lifting, and direct physical songcraft.' },
  finesse: { label: 'Finesse', hint: 'Accuracy, evasion, delicate control, and stealth.' },
  guard: { label: 'Guard', hint: 'Durability, stability, and resistance to displacement.' },
  resonance: { label: 'Resonance', hint: 'Raw Hymmnos output, restoration, and technique potency.' },
  focus: { label: 'Focus', hint: 'Control, perception, mental defense, and save difficulty.' },
  tempo: { label: 'Tempo', hint: 'Initiative, movement, and seizing openings.' },
};

const commonActions = (combat: PlayerCombatProfile) => [
  ['universal-strike', 'Strike', resolveStrikeText(combat)],
  ['universal-brace', 'Brace', resolveBraceText(combat)],
  ['universal-sprint', 'Sprint', `Move again up to your full movement (${combat.derived.movement} spaces).`],
  ['universal-withdraw', 'Withdraw', `Move up to ${Math.floor(combat.derived.movement / 2)} spaces without provoking reactions.`],
  ['universal-assist', 'Assist', 'Give one ally advantage on its next relevant attack, saving throw, or aptitude check before your next turn.'],
  ['universal-shove', 'Shove', resolveShoveText(combat)],
];

const actionLabel: Record<string, string> = { action: 'Action', song: 'Song', quick: 'Quick follow-up', reaction: 'Reaction', passive: 'Passive' };
const resetLabel: Record<string, string> = { turn: 'each turn', round: 'each round', encounter: 'per encounter', passive: 'always' };
const songAudienceLabel: Record<CombatSong['audience'], string> = {
  performer: 'Performer must hear',
  'chosen-hearer': 'Chosen hearer',
  'area-hearers': 'All hearers in area',
  'all-hearers': 'All who hear',
};

const songAudienceRule = (song: CombatSong) => song.audience === 'all-hearers'
  ? 'Every creature that can hear it is affected: performer, allies, and enemies. Creatures with Soundless Song Hearing are unaffected.'
  : song.audience === 'area-hearers'
    ? 'Every creature in the area that can hear the Verse is affected.'
    : song.audience === 'performer'
      ? 'The performer must be able to hear their own Verse.'
      : 'The chosen target must be able to hear the Verse.';

const asInvocationAbility = (ability: CombatAbility): Ability => ({
  id: ability.id,
  name: ability.name,
  description: ability.description,
  cooldown: 0,
  icon: ability.icon || '',
  hymmnos: ability.hymmnos,
});

const abilityUnavailableReason = (
  ability: CombatAbility,
  participant: EncounterParticipant | undefined,
  encounter: Encounter | null,
  playerLevel = 1,
) => {
  const levelRequired = Number(ability.levelRequired || 1);
  if (playerLevel < levelRequired) return `Unlocks at level ${levelRequired}`;
  if (ability.actionType === 'passive') return 'Passive — always active';
  if (!encounter || encounter.status !== 'active') return 'Available during combat';
  if (!participant) return 'You are not in this encounter';
  if (encounter.turn?.phase !== 'active') return 'Waiting for initiative';
  const resources = participant.turnResources;
  if (ability.actionType !== 'reaction' && encounter.turn.activeParticipantId !== participant.id) return 'Wait for your turn';
  if (ability.actionType === 'song' && resources?.songAvailable === false) return 'Song spent';
  if (ability.actionType === 'action' && resources?.actionAvailable === false) return 'Action spent';
  if (ability.actionType === 'quick' && resources?.quickAvailable !== true) return 'Use an Action technique first';
  if (ability.actionType === 'reaction' && resources?.reactionAvailable === false) return 'Reaction spent';
  if (ability.reset === 'round' && resources?.roundUses?.[ability.id] === encounter.turn.round) return 'Resets next round';
  if (ability.reset === 'encounter' && Number(resources?.encounterUses?.[ability.id] || 0) >= ability.uses) return 'Spent for this encounter';
  return '';
};

const TechniqueCard: React.FC<{
  ability: CombatAbility | CombatSong;
  combatProfile: PlayerCombatProfile;
  participant?: EncounterParticipant;
  encounter: Encounter | null;
  kind?: 'technique' | 'song';
}> = ({ ability, combatProfile, participant, encounter, kind = 'technique' }) => {
  const toast = useToast();
  const { unlockedLexicon } = useCampaign();
  const [activating, setActivating] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const invocation = resolveAbilityInvocation(asInvocationAbility(ability));
  const translation = invocation.parts.map((part) => unlockedLexicon.get(part.id));
  const translated = translation.every(Boolean);
  const spoken = getAbilitySpokenForm(invocation);
  const reason = abilityUnavailableReason(ability, participant, encounter, combatProfile.level);
  const song = kind === 'song' ? ability as CombatSong : null;
  const levelRequired = Number(ability.levelRequired || 1);
  const levelLocked = combatProfile.level < levelRequired;
  const resolvedDescription = resolveCombatText(ability.description, combatProfile);
  const play = () => {
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(new SpeechSynthesisUtterance(spoken));
  };
  const activate = async () => {
    if (!encounter) return;
    setActivating(true);
    try {
      await activateCombatAbility(encounter.id, ability.id);
      toast({
        title: song?.songForm === 'canticle' ? `${ability.name} now holds the performance channel` : `${ability.name} invoked`,
        description: song?.songForm === 'verse'
          ? 'The Verse resolved without interrupting the active Canticle.'
          : song?.songForm === 'canticle'
            ? 'Any previous Canticle has been cut short. Every creature that can hear this one is subject to its stated effect.'
            : ability.actionType === 'action'
              ? 'Your Action is spent. One Quick follow-up is now available this turn.'
              : ability.actionType === 'quick'
                ? 'Your Quick follow-up has been spent.'
                : 'The technique has been committed to the combat record.',
        status: 'success',
      });
    } catch (caught: any) {
      toast({ title: 'Invocation refused', description: caught?.message || String(caught), status: 'warning', duration: 6000 });
    } finally { setActivating(false); }
  };
  const songRule = song ? (song.songForm === 'verse'
    ? 'Resolves immediately and never interrupts a Canticle.'
    : `${song.chantRounds ? `${song.chantRounds} round of chanting · ` : 'No chant · '}${song.durationRounds ? `${song.durationRounds} active rounds` : 'lasts until interrupted or combat ends'} · replaces any active Canticle · spend your Song each turn to sustain it.`) : '';
  const details = (compact = false) => <>
    <Text fontSize={compact ? 'sm' : 'sm'}>{resolvedDescription}</Text>
    {song && <Text mt={2} fontSize="xs" color="textMuted">{songRule} <b>Audience:</b> {songAudienceRule({ ...song, audience: song.audience || (song.songForm === 'canticle' ? 'all-hearers' : 'chosen-hearer') })}</Text>}
    <Box mt={3} p={compact ? 2.5 : 3} borderRadius="lg" bg="blackAlpha.500">
      <Text fontFamily="Hymmnos" fontSize={compact ? 'xl' : '2xl'} color="textHeader" overflowWrap="anywhere">{invocation.headword}</Text>
      <Text fontSize="xs" mt={1} color="textMuted">{invocation.pronunciation}</Text>
      <Text fontSize="xs" mt={1} color={translated ? 'green.300' : 'purple.200'}>{translated ? translation.map((part) => part?.meaning).join(' · ') : 'Translation locked by Cypher'}</Text>
      <Button mt={2} size="xs" variant="ghost" leftIcon={<FaVolumeHigh />} onClick={play}>Pronounce “{spoken}”</Button>
      {song?.audioUrl && <Button mt={2} ml={2} size="xs" variant="outline" leftIcon={<FaVolumeHigh />} onClick={() => void new Audio(song.audioUrl).play()}>Play scored Song</Button>}
    </Box>
    {ability.actionType === 'passive' ? <Badge mt={3} colorScheme="green">Always active</Badge> : (
      <Button mt={3} size={compact ? 'sm' : 'md'} w="full" onClick={activate} isLoading={activating} isDisabled={Boolean(reason)} title={reason}>
        {reason || `Exclaim “${spoken}” and activate`}
      </Button>
    )}
  </>;

  if (levelLocked) return <>
    <Flex display={{ base: 'flex', md: 'none' }} minH="72px" px={3} py={2.5} border="1px solid" borderColor="whiteAlpha.300" bg="blackAlpha.500" borderRadius="xl" align="center" gap={3} aria-label={`${kind === 'song' ? 'Song' : 'Technique'} locked until level ${levelRequired}`}>
      <Flex boxSize="38px" flexShrink={0} borderRadius="full" bg="purple.900" border="1px solid" borderColor="purple.300" align="center" justify="center"><FaLock /></Flex>
      <Box flex="1"><Text fontWeight="bold">Sealed {kind === 'song' ? 'Song' : 'Technique'}</Text><Text fontSize="xs" color="textMuted">Content reveals at level {levelRequired}</Text></Box>
      <Badge colorScheme="purple">LV {levelRequired}</Badge>
    </Flex>
    <Box display={{ base: 'none', md: 'block' }} position="relative" minH="270px" overflow="hidden" border="1px solid" borderColor="whiteAlpha.300" bg="blackAlpha.500" borderRadius="xl" aria-label={`${kind === 'song' ? 'Song' : 'Technique'} locked until level ${levelRequired}`}>
      <Box p={5} filter="blur(7px)" opacity={0.28} userSelect="none" aria-hidden="true"><Heading size="md" fontFamily="Hymmnos">{invocation.headword}</Heading><HStack mt={3}><Badge>{actionLabel[ability.actionType]}</Badge><Badge>{ability.damageType}</Badge></HStack><Text mt={6}>{resolvedDescription}</Text><Box mt={5} h="72px" borderRadius="lg" bg="whiteAlpha.200" /></Box>
      <VStack position="absolute" inset={0} justify="center" spacing={3} px={6} textAlign="center" bg="blackAlpha.600"><Flex boxSize="56px" borderRadius="full" bg="purple.900" border="1px solid" borderColor="purple.300" align="center" justify="center"><FaLock size="24px" /></Flex><Badge colorScheme="purple" fontSize="sm" px={3} py={1}>LOCKED</Badge><Heading size="md">Sealed {kind === 'song' ? 'Song' : 'Technique'}</Heading><Text color="textMuted">Reach level {levelRequired} to reveal and invoke this {kind === 'song' ? 'Song' : 'technique'}.</Text></VStack>
    </Box>
  </>;

  return <>
    <Box display={{ base: 'block', md: 'none' }} border="1px solid" borderColor={expanded ? 'purple.400' : 'whiteAlpha.300'} bg="blackAlpha.300" borderRadius="xl" overflow="hidden">
      <Flex as="button" type="button" w="full" px={3} py={3} textAlign="left" align="center" gap={3} onClick={() => setExpanded((value) => !value)} aria-expanded={expanded}>
        <Box minW={0} flex="1"><Text fontWeight="bold" noOfLines={1}>{translated ? ability.name : 'Translation locked by Cypher'}</Text><Text fontFamily="Hymmnos" color="textHeader" fontSize="md" noOfLines={1}>{invocation.headword}</Text><HStack mt={1.5} spacing={1.5}><Badge colorScheme="purple" fontSize="9px">{actionLabel[ability.actionType]}</Badge>{song && <Badge colorScheme={song.songForm === 'verse' ? 'cyan' : 'pink'} fontSize="9px">{song.songForm}</Badge>}<Badge colorScheme="orange" fontSize="9px">{ability.damageType}</Badge></HStack></Box>
        <Box color="textMuted">{expanded ? <FaChevronUp /> : <FaChevronDown />}</Box>
      </Flex>
      <Collapse in={expanded} animateOpacity><Box px={3} pb={3} pt={2} borderTop="1px solid" borderColor="whiteAlpha.200">{details(true)}</Box></Collapse>
    </Box>
    <Box display={{ base: 'none', md: 'block' }} p={4} border="1px solid" borderColor="whiteAlpha.300" bg="blackAlpha.300" borderRadius="xl">
      <Flex justify="space-between" gap={3} align="start"><Box><Heading size="md" fontFamily="Hymmnos" overflowWrap="anywhere">{invocation.headword}</Heading><Text fontSize="sm" fontWeight="bold" color={translated ? 'green.200' : 'purple.200'}>{translated ? ability.name : 'Translation locked by Cypher'}</Text><HStack mt={2} spacing={2} flexWrap="wrap"><Badge colorScheme="purple">{actionLabel[ability.actionType]}</Badge><Badge variant="outline">{ability.uses || '∞'} {resetLabel[ability.reset]}</Badge>{song && <><Badge colorScheme={song.songForm === 'verse' ? 'cyan' : 'pink'}>{song.songForm === 'verse' ? 'Verse · instant' : 'Canticle · continuous'}</Badge><Badge colorScheme="teal">{songAudienceLabel[song.audience || (song.songForm === 'canticle' ? 'all-hearers' : 'chosen-hearer')]}</Badge><Badge colorScheme={combatProfile.level >= song.levelRequired ? 'green' : 'gray'}>Level {song.levelRequired}</Badge></>}</HStack></Box><Badge colorScheme="orange">{ability.damageType}</Badge></Flex>
      <Box mt={3}>{details()}</Box>
    </Box>
  </>;
};

const CommonActionCard: React.FC<{ action: string[]; participant?: EncounterParticipant; encounter: Encounter | null }> = ({ action, participant, encounter }) => {
  const [id, name, effect] = action;
  const [using, setUsing] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const toast = useToast();
  const ready = Boolean(encounter?.turn?.phase === 'active' && participant && encounter.turn.activeParticipantId === participant.id && participant.turnResources?.actionAvailable !== false);
  const useAction = async () => {
    if (!encounter) return;
    setUsing(true);
    try {
      await activateCombatAbility(encounter.id, id);
      toast({ title: `${name} committed`, description: 'Your Action is spent. One Quick follow-up is now available this turn.', status: 'success' });
    } catch (caught: any) {
      toast({ title: 'Action refused', description: caught?.message || String(caught), status: 'warning' });
    } finally { setUsing(false); }
  };
  return <>
    <Box display={{ base: 'block', md: 'none' }} bg="blackAlpha.300" border="1px solid" borderColor="whiteAlpha.200" borderRadius="xl" overflow="hidden">
      <Flex as="button" type="button" w="full" px={3} py={3} align="center" textAlign="left" onClick={() => setExpanded((value) => !value)}><Text fontWeight="bold" flex="1">{name}</Text><Badge mr={3}>Action</Badge>{expanded ? <FaChevronUp /> : <FaChevronDown />}</Flex>
      <Collapse in={expanded} animateOpacity><Box px={3} pb={3} pt={2} borderTop="1px solid" borderColor="whiteAlpha.200"><Text fontSize="sm">{effect}</Text><Button mt={3} size="sm" w="full" onClick={useAction} isLoading={using} isDisabled={!ready}>{ready ? `Use ${name}` : 'Waiting for your action'}</Button></Box></Collapse>
    </Box>
    <Box display={{ base: 'none', md: 'block' }} p={4} bg="blackAlpha.300" borderRadius="xl"><HStack justify="space-between"><Text fontWeight="bold">{name}</Text><Badge>Action</Badge></HStack><Text mt={2} fontSize="sm">{effect}</Text><Button mt={3} size="sm" w="full" onClick={useAction} isLoading={using} isDisabled={!ready}>{ready ? `Use ${name}` : 'Waiting for your action'}</Button></Box>
  </>;
};

const ResponsiveInfoPanel: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => {
  const [expanded, setExpanded] = useState(false);
  return <>
    <Box display={{ base: 'block', md: 'none' }} border="1px solid" borderColor="whiteAlpha.300" borderRadius="xl" overflow="hidden"><Flex as="button" type="button" w="full" px={3} py={3} align="center" textAlign="left" onClick={() => setExpanded((value) => !value)}><Text fontWeight="bold" flex="1">{title}</Text>{expanded ? <FaChevronUp /> : <FaChevronDown />}</Flex><Collapse in={expanded} animateOpacity><Box px={3} pb={3} pt={2} borderTop="1px solid" borderColor="whiteAlpha.200">{children}</Box></Collapse></Box>
    <Box display={{ base: 'none', md: 'block' }} p={5} borderRadius="xl" border="1px solid" borderColor="whiteAlpha.300"><Heading size="sm">{title}</Heading><Box mt={2}>{children}</Box></Box>
  </>;
};

const DamageTypeReference: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => (
  <Modal isOpen={isOpen} onClose={onClose} size={{ base: 'full', md: '4xl' }} scrollBehavior="inside">
    <ModalOverlay />
    <ModalContent bg="backgroundSecondary" color="textBody">
      <ModalHeader>Damage types</ModalHeader>
      <ModalCloseButton />
      <ModalBody pb={6}>
        <Box p={4} mb={4} borderRadius="xl" bg="blackAlpha.400" border="1px solid" borderColor="whiteAlpha.300">
          <Text fontWeight="bold">No universal strength/weakness wheel</Text>
          <Text mt={1} color="textMuted">A damage type describes what the harm is. Resistance, vulnerability, and immunity are assigned separately on each monster, item, weapon, Song, or feature.</Text>
        </Box>
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={3}>
          {combatDamageTypes.map((type) => <Box key={type.id} p={4} borderRadius="xl" bg="blackAlpha.300" border="1px solid" borderColor="whiteAlpha.300"><HStack justify="space-between"><Heading size="sm">{type.name}</Heading><Badge colorScheme={type.category === 'physical' ? 'gray' : type.category === 'elemental' ? 'orange' : type.category === 'energetic' ? 'cyan' : 'purple'}>{type.category}</Badge></HStack><Text mt={2} fontSize="sm">{type.description}</Text><Text mt={2} fontSize="xs" color="textMuted">Examples: {type.examples}</Text></Box>)}
        </SimpleGrid>
      </ModalBody>
    </ModalContent>
  </Modal>
);

const StatsReference: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  combat: PlayerCombatProfile;
  growthOrder: CombatAptitudeKey[];
}> = ({ isOpen, onClose, combat, growthOrder }) => {
  const techniqueLabel = aptitudeLabels[combat.techniqueAptitude]?.label || combat.techniqueAptitude;
  const rows: Array<{ key: CombatAptitudeKey; job: string; implemented: string; saves: string }> = [
    { key: 'force', job: 'Power and imposed movement', implemented: 'Force techniques, Strike, Shove', saves: 'Breaking restraints and resisting forced passage' },
    { key: 'finesse', job: 'Precision and evasion', implemented: 'Defence, Finesse techniques, Strike', saves: 'Dodging bursts, traps, and aimed hazards' },
    { key: 'guard', job: 'Endurance and stability', implemented: 'Maximum HP, HP growth, Defence, Brace', saves: 'Resisting poison, impact, and displacement' },
    { key: 'resonance', job: 'Song output and magical force', implemented: 'Song Attack, Resonance techniques', saves: 'Resisting silence and hostile resonance' },
    { key: 'focus', job: 'Control, perception, and intent', implemented: 'Save DC and Focus-doctrine techniques', saves: 'Resisting fear, deception, and mental control' },
    { key: 'tempo', job: 'Speed and timing', implemented: 'Initiative, movement, Sprint, Withdraw', saves: 'Escaping zones and timing-based hazards' },
  ];
  const derived: Array<[string, string, number]> = [
    ['Defence', `10 + Guard (${combat.aptitudes.guard}) + Finesse (${combat.aptitudes.finesse})`, combat.derived.defense],
    ['Initiative', `Tempo (${combat.aptitudes.tempo})`, combat.derived.initiative],
    ['Technique Attack', `2 + doctrine aptitude: ${techniqueLabel} (${combat.aptitudes[combat.techniqueAptitude]})`, combat.derived.techniqueAttack],
    ['Song Attack', `2 + Resonance (${combat.aptitudes.resonance})`, combat.derived.songAttack],
    ['Save Difficulty', `10 + Focus (${combat.aptitudes.focus})`, combat.derived.saveDifficulty],
    ['Movement', '5 + half Tempo, rounded down', combat.derived.movement],
    ['Maximum HP', 'Base durability + Guard + level growth', combat.derived.maxHp],
  ];
  return <Modal isOpen={isOpen} onClose={onClose} size={{ base: 'full', md: '6xl' }} scrollBehavior="inside">
    <ModalOverlay />
    <ModalContent bg="backgroundSecondary" color="textBody">
      <ModalHeader>Combat stats explained</ModalHeader>
      <ModalCloseButton />
      <ModalBody pb={6}>
        <Text color="textMuted" mb={4}>Every aptitude has a universal job, a saving-throw domain, and at least one direct combat use. Rolls are resolved at the table; the portal supplies live modifiers and tracks turns, uses, Songs, and progression.</Text>
        <TableContainer border="1px solid" borderColor="whiteAlpha.300" borderRadius="xl" whiteSpace="normal">
          <Table size="sm" variant="simple">
            <Thead><Tr><Th>Aptitude</Th><Th>Primary job</Th><Th>Where it is used</Th><Th display={{ base: 'none', lg: 'table-cell' }}>Typical saves</Th></Tr></Thead>
            <Tbody>{rows.map((row) => <Tr key={row.key}><Td fontWeight="bold">{aptitudeLabels[row.key].label}<Text fontSize="xs" color="textMuted">+{combat.aptitudes[row.key]}</Text></Td><Td>{row.job}</Td><Td>{row.implemented}</Td><Td display={{ base: 'none', lg: 'table-cell' }}>{row.saves}</Td></Tr>)}</Tbody>
          </Table>
        </TableContainer>
        <Heading size="sm" mt={6} mb={3}>Derived values for this profile</Heading>
        <TableContainer border="1px solid" borderColor="whiteAlpha.300" borderRadius="xl">
          <Table size="sm"><Thead><Tr><Th>Value</Th><Th>Formula</Th><Th isNumeric>Result</Th></Tr></Thead><Tbody>{derived.map(([label, formula, value]) => <Tr key={label}><Td fontWeight="bold">{label}</Td><Td>{formula}</Td><Td isNumeric fontWeight="bold">{label === 'Initiative' || label.includes('Attack') ? '+' : ''}{value}</Td></Tr>)}</Tbody></Table>
        </TableContainer>
        <Box mt={5} p={4} borderRadius="xl" bg="blackAlpha.400"><Text fontWeight="bold">Growth path</Text><Text mt={1} color="textMuted">Automatic doctrine order: {growthOrder.map((key) => aptitudeLabels[key].label).join(' → ')}. Each listed aptitude-increase level advances the next entry, up to the aptitude cap.</Text></Box>
      </ModalBody>
    </ModalContent>
  </Modal>;
};

const MortalityReference: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  hp: number;
  profile: PlayerProfile;
}> = ({ isOpen, onClose, hp, profile }) => {
  const [limb, setLimb] = useState('Left arm');
  const [busy, setBusy] = useState('');
  const toast = useToast();
  const mortality = profile.mortality || { permanentDamage: 0, lostLimbs: [], dead: false };
  const unprotected = hp <= 0 && !mortality.dead;
  const apply = async (consequence: 'permanent-damage' | 'lost-limb' | 'death', detail?: string) => {
    if (consequence === 'death' && !window.confirm('Record immediate death? Only an administrator can invoke a revival.')) return;
    setBusy(consequence);
    try {
      const result = await applyMortalConsequence(consequence, detail);
      toast({
        title: result.mortality?.dead ? 'The mortal wound was fatal' : consequence === 'lost-limb' ? `${detail || 'A limb'} lost` : 'Permanent Damage recorded',
        description: result.mortality?.dead ? 'You are now dead and will be skipped in initiative.' : 'The injury is permanently recorded.',
        status: result.mortality?.dead ? 'error' : 'warning',
        duration: 7000,
      });
    } catch (caught: any) {
      toast({ title: 'Could not record mortal damage', description: caught?.message || String(caught), status: 'error' });
    } finally { setBusy(''); }
  };
  const scale = [
    ['Below 10', 'No lasting injury', 'The unprotected attack fails to cause a permanent consequence.'],
    ['10–16', 'Permanent Damage', 'Record one permanent injury. Five recorded injuries cause death.'],
    ['17–20', 'Lost Limb', 'Record the limb that was destroyed or severed. Three lost limbs cause death.'],
    ['21+', 'Instant Death', 'The unprotected mortal body dies immediately.'],
  ];
  return <Modal isOpen={isOpen} onClose={onClose} size={{ base: 'full', md: '4xl' }} scrollBehavior="inside">
    <ModalOverlay />
    <ModalContent bg="backgroundSecondary" color="textBody">
      <ModalHeader><HStack><FaHeartCrack /><Text>HP and mortal injury</Text></HStack></ModalHeader>
      <ModalCloseButton />
      <ModalBody pb={6}>
        <Box p={4} border="1px solid" borderColor={mortality.dead ? 'red.400' : unprotected ? 'orange.400' : 'whiteAlpha.300'} borderRadius="xl" bg="blackAlpha.400">
          <Heading size="sm">{mortality.dead ? 'Deceased' : unprotected ? 'Reyvateil protection lost' : 'Reyvateil protection active'}</Heading>
          <Text mt={2} color="textMuted">HP represents the supernatural protection maintained by your Reyvateil. At 0 HP that protection is gone: attacks strike an ordinary mortal body and use the unprotected attack-roll scale below.</Text>
        </Box>
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={3} mt={5}>{scale.map(([roll, title, body]) => <Box key={roll} p={4} border="1px solid" borderColor="whiteAlpha.300" borderRadius="xl"><Badge colorScheme={roll === '21+' ? 'red' : roll === '17–20' ? 'orange' : roll === '10–16' ? 'yellow' : 'gray'}>{roll}</Badge><Text mt={2} fontWeight="bold">{title}</Text><Text mt={1} fontSize="sm" color="textMuted">{body}</Text></Box>)}</SimpleGrid>
        <Box mt={5} p={4} borderRadius="xl" bg="blackAlpha.400"><Heading size="sm">Permanent record</Heading><HStack mt={3} flexWrap="wrap"><Badge colorScheme="orange">Permanent Damage {mortality.permanentDamage}/5</Badge><Badge colorScheme="red">Lost Limbs {mortality.lostLimbs.length}/3</Badge>{mortality.dead && <Badge colorScheme="red">DEAD · {mortality.deathCause || 'fatal injury'}</Badge>}</HStack>{mortality.lostLimbs.length > 0 && <Text mt={2} fontSize="sm" color="textMuted">Lost: {mortality.lostLimbs.join(', ')}</Text>}</Box>
        {unprotected && <Box mt={5} p={4} border="1px solid" borderColor="red.500" borderRadius="xl"><Heading size="sm">Record the unprotected attack</Heading><Text mt={1} fontSize="sm" color="textMuted">Choose the result indicated by the enemy’s final attack roll.</Text><SimpleGrid columns={{ base: 1, md: 3 }} spacing={3} mt={4}><Button colorScheme="yellow" onClick={() => apply('permanent-damage')} isLoading={busy === 'permanent-damage'}>10–16 · Permanent Damage</Button><VStack><Select value={limb} onChange={(event) => setLimb(event.target.value)} bg="blackAlpha.400"><option>Left arm</option><option>Right arm</option><option>Left leg</option><option>Right leg</option><option>Other limb</option></Select><Button w="full" colorScheme="orange" onClick={() => apply('lost-limb', limb)} isLoading={busy === 'lost-limb'}>17–20 · Lose limb</Button></VStack><Button colorScheme="red" leftIcon={<FaSkull />} onClick={() => apply('death')} isLoading={busy === 'death'}>21+ · Die</Button></SimpleGrid></Box>}
        {!unprotected && !mortality.dead && <Text mt={5} color="textMuted" textAlign="center">Mortal outcomes can only be self-recorded while HP is 0. The administrator may also issue them through Damage grants.</Text>}
      </ModalBody>
    </ModalContent>
  </Modal>;
};

const CombatHome: React.FC<{ reyvateil: Reyvateil; profile: PlayerProfile }> = ({ reyvateil, profile }) => {
  const { currentUser } = useAuth();
  const { campaignState } = useCampaign();
  const toast = useToast();
  const [encounter, setEncounter] = useState<Encounter | null>(null);
  const [sustainingSong, setSustainingSong] = useState(false);
  const damageReference = useDisclosure();
  const statsReference = useDisclosure();
  const hpReference = useDisclosure();
  useBackDismiss(damageReference.isOpen, damageReference.onClose);
  useBackDismiss(statsReference.isOpen, statsReference.onClose);
  useBackDismiss(hpReference.isOpen, hpReference.onClose);
  useEffect(() => {
    if (!campaignState.activeEncounterId) { setEncounter(null); return undefined; }
    return subscribeEncounter(campaignState.activeEncounterId, setEncounter, () => setEncounter(null));
  }, [campaignState.activeEncounterId]);
  const participant = encounter?.participants.find((entry) => entry.kind === 'player' && entry.sourceId === currentUser?.uid);
  const combat = reyvateil.combat;
  const techniques = useMemo(() => {
    const inherited = new Set(profile.combatProfile?.inheritedCombatAbilityIds || []);
    return (combat?.combatAbilities || []).filter((ability) => inherited.has(ability.id));
  }, [combat?.combatAbilities, profile.combatProfile?.inheritedCombatAbilityIds]);
  const isTurn = Boolean(participant && encounter?.turn?.activeParticipantId === participant.id);
  const hp = participant?.hp ?? profile.combatStats?.currentHp ?? combat?.derived.maxHp ?? 0;
  const maxHp = participant?.maxHp ?? profile.combatStats?.maxHp ?? combat?.derived.maxHp ?? 1;

  if (!combat || !profile.combatProfile) {
    return <Box mt={6} p={8} border="1px solid" borderColor="orange.400" borderRadius="xl"><Heading size="md">Combat profile awaiting synchronization</Heading><Text mt={2}>Your existing Reyvateil is being prepared. An administrator can run the combat migration without changing your social profile.</Text></Box>;
  }
  const combatProfile = profile.combatProfile;
  const techniqueAptitude = combatProfile.techniqueAptitude || combat.techniqueAptitude;
  const songs = combat.combatSongs || [];
  const activeSong = encounter?.activeSong;
  const ownsActiveSong = Boolean(activeSong && activeSong.performerSourceId === currentUser?.uid);
  const maySustainSong = Boolean(ownsActiveSong && isTurn && participant?.turnResources?.songAvailable !== false);
  const sustainActiveSong = async () => {
    if (!encounter || !activeSong) return;
    setSustainingSong(true);
    try {
      await continueCombatSong(encounter.id);
      toast({ title: `${activeSong.songName} sustained`, description: 'Your Song for this turn is spent; your Action and movement remain available.', status: 'success' });
    } catch (caught: any) {
      toast({ title: 'The Canticle faltered', description: caught?.message || String(caught), status: 'warning', duration: 6000 });
    } finally {
      setSustainingSong(false);
    }
  };
  const activeCombatant = encounter?.participants.find((entry) => entry.id === encounter.turn?.activeParticipantId)?.name;
  const derivedValues = [
    { label: 'Defence', value: combatProfile.derived.defense, icon: <FaShieldHalved /> },
    { label: 'Initiative', value: `+${combatProfile.derived.initiative}`, icon: <FaBolt /> },
    { label: `Technique (${aptitudeLabels[techniqueAptitude]?.label || techniqueAptitude})`, value: `+${combatProfile.derived.techniqueAttack}` },
    { label: 'Song', value: `+${combatProfile.derived.songAttack}` },
    { label: 'Save DC', value: combatProfile.derived.saveDifficulty },
  ];

  return (
    <VStack align="stretch" spacing={{ base: 4, md: 6 }} mt={{ base: 3, md: 5 }}>
      <Box display={{ base: 'block', md: 'none' }} p={3} borderRadius="xl" bg="blackAlpha.400" border="1px solid" borderColor={isTurn ? 'green.300' : 'whiteAlpha.300'}>
        <Flex align="center" gap={3}>
          <Image src={profile.reyvateilImageUrl || reyvateil.image} alt={reyvateil.name} boxSize="64px" flexShrink={0} objectFit="cover" borderRadius="full" border="2px solid" borderColor="primary" />
          <Box minW={0} flex="1"><Text color="textMuted" fontSize="10px" textTransform="uppercase" letterSpacing=".1em">{combat.role} · level {combatProfile.level}</Text><Heading fontSize="xl" lineHeight="1.1" noOfLines={2}>{combat.specialtyTitle}</Heading><Text mt={1} fontSize="xs" color="textMuted" noOfLines={1}>{reyvateil.name} · {combat.damageType}</Text></Box>
        </Flex>
        <Progress mt={3} size="sm" value={(hp / Math.max(1, maxHp)) * 100} colorScheme={hp / maxHp < .3 ? 'red' : 'green'} borderRadius="full" />
        <Flex mt={2} justify="space-between" align="center" gap={2}><HStack><Text fontWeight="bold" fontSize="sm">{hp} / {maxHp} HP</Text><Button size="xs" variant="ghost" leftIcon={<FaCircleQuestion />} onClick={hpReference.onOpen}>HP</Button></HStack><Badge colorScheme={campaignState.battleActive ? (isTurn ? 'green' : 'red') : 'gray'}>{campaignState.battleActive ? (isTurn ? 'YOUR TURN' : `ROUND ${encounter?.turn?.round || 1}`) : 'EXPLORATION'}</Badge></Flex>
        {campaignState.battleActive && <Text mt={1} fontSize="xs" color="textMuted" noOfLines={1}>{isTurn ? `Action ${participant?.turnResources?.actionAvailable === false ? 'spent' : 'ready'} · Song ${participant?.turnResources?.songAvailable === false ? 'spent' : 'ready'} · Move ${combatProfile.derived.movement}${participant?.turnResources?.quickAvailable ? ' · Quick ready' : ''}` : `${activeCombatant || 'Initiative'} is acting`}</Text>}
      </Box>
      <Flex display={{ base: 'none', md: 'flex' }} p={6} borderRadius="2xl" bg="blackAlpha.400" border="1px solid" borderColor={isTurn ? 'green.300' : 'whiteAlpha.300'} gap={5} align="center" wrap="wrap">
        <Image src={profile.reyvateilImageUrl || reyvateil.image} alt={reyvateil.name} boxSize={{ base: '100px', md: '140px' }} objectFit="cover" borderRadius="full" border="3px solid" borderColor="primary" />
        <Box flex="1" minW="240px"><Text color="textMuted" textTransform="uppercase" letterSpacing=".12em">{combat.role} · level {profile.combatProfile.level}</Text><Heading>{combat.specialtyTitle}</Heading><Text mt={1}>{reyvateil.name} translates {combat.damageType} through a {combat.role} combat doctrine.</Text><Progress mt={4} value={(hp / Math.max(1, maxHp)) * 100} colorScheme={hp / maxHp < .3 ? 'red' : 'green'} borderRadius="full" /><HStack mt={1}><Text fontWeight="bold">{hp} / {maxHp} HP</Text><Button size="xs" variant="ghost" leftIcon={<FaCircleQuestion />} onClick={hpReference.onOpen}>How HP works</Button></HStack></Box>
        <Box minW="220px" p={4} borderRadius="xl" bg={isTurn ? 'green.900' : 'blackAlpha.400'}><Badge colorScheme={campaignState.battleActive ? 'red' : 'gray'}>{campaignState.battleActive ? `ROUND ${encounter?.turn?.round || 1}` : 'OUT OF COMBAT'}</Badge><Heading size="md" mt={2}>{isTurn ? 'Your turn' : activeCombatant ? `${activeCombatant} is acting` : 'Waiting for initiative'}</Heading>{isTurn && <Text mt={1}>Action {participant?.turnResources?.actionAvailable === false ? 'spent' : 'ready'} · Song {participant?.turnResources?.songAvailable === false ? 'spent' : 'ready'} · Movement {combatProfile.derived.movement}{participant?.turnResources?.quickAvailable ? ' · Quick follow-up ready' : ''}</Text>}</Box>
      </Flex>

      {(hp <= 0 || profile.mortality?.dead || Number(profile.mortality?.permanentDamage || 0) > 0 || Number(profile.mortality?.lostLimbs?.length || 0) > 0) && <Flex p={4} borderRadius="xl" border="1px solid" borderColor={profile.mortality?.dead ? 'red.500' : hp <= 0 ? 'orange.400' : 'whiteAlpha.300'} bg={profile.mortality?.dead ? 'red.900' : 'blackAlpha.400'} align="center" gap={3} flexWrap="wrap"><FaHeartCrack /><Box flex="1"><Text fontWeight="bold">{profile.mortality?.dead ? 'DECEASED' : hp <= 0 ? 'Protection lost · mortal body exposed' : 'Permanent mortal injuries'}</Text><Text fontSize="sm" color="textMuted">Permanent Damage {profile.mortality?.permanentDamage || 0}/5 · Lost Limbs {profile.mortality?.lostLimbs?.length || 0}/3{profile.mortality?.dead ? ` · ${profile.mortality.deathCause || 'fatal injury'}` : ''}</Text></Box><Button size="sm" colorScheme={profile.mortality?.dead ? 'red' : 'orange'} onClick={hpReference.onOpen}>{hp <= 0 && !profile.mortality?.dead ? 'Record mortal damage' : 'View record'}</Button></Flex>}

      <Box><Flex justify="space-between" align="center" mb={{ base: 2, md: 3 }}><Heading size={{ base: 'sm', md: 'md' }}>Combat aptitudes</Heading><Button size={{ base: 'xs', md: 'sm' }} variant="ghost" leftIcon={<FaCircleQuestion />} onClick={statsReference.onOpen}>Stats explained</Button></Flex><SimpleGrid columns={{ base: 3, md: 3, xl: 6 }} spacing={{ base: 2, md: 3 }}>{Object.entries(combatProfile.aptitudes).map(([key, value]) => <Tooltip key={key} label={aptitudeLabels[key]?.hint}><Box p={{ base: 2, md: 4 }} minH={{ base: '62px', md: 'auto' }} bg="blackAlpha.300" borderRadius={{ base: 'lg', md: 'xl' }} border="1px solid" borderColor="whiteAlpha.300"><Text color="textMuted" fontSize={{ base: '9px', md: 'xs' }} textTransform="uppercase" noOfLines={1}>{aptitudeLabels[key]?.label || key}</Text><Text fontSize={{ base: 'xl', md: '3xl' }} lineHeight="1.2" fontWeight="bold">+{value}</Text></Box></Tooltip>)}</SimpleGrid></Box>

      <Box><Flex justify="space-between" align="center" mb={{ base: 2, md: 3 }}><Heading size={{ base: 'sm', md: 'md' }}>Derived values</Heading><Button size={{ base: 'xs', md: 'sm' }} variant="outline" onClick={damageReference.onOpen}>Damage types</Button></Flex><SimpleGrid columns={{ base: 3, md: 5 }} spacing={{ base: 2, md: 3 }}>{derivedValues.map((entry) => <Box key={entry.label} p={{ base: 2, md: 4 }} minH={{ base: '62px', md: 'auto' }} bg="blackAlpha.300" borderRadius={{ base: 'lg', md: 'xl' }}><HStack spacing={1.5}>{entry.icon}<Text fontSize={{ base: '9px', md: 'md' }} color={{ base: 'textMuted', md: 'inherit' }} textTransform={{ base: 'uppercase', md: 'none' }} noOfLines={1}>{entry.label}</Text></HStack><Text fontSize={{ base: 'xl', md: '2xl' }} lineHeight="1.2" fontWeight="bold">{entry.value}</Text></Box>)}</SimpleGrid></Box>

      {campaignState.battleActive && <Box p={{ base: 3, md: 4 }} borderRadius="xl" border="1px solid" borderColor={activeSong ? 'pink.300' : 'whiteAlpha.300'} bg={activeSong ? 'pink.900' : 'blackAlpha.300'}>
        <Flex justify="space-between" gap={3} flexWrap="wrap">
          <Box><Text fontSize="10px" textTransform="uppercase" letterSpacing=".12em" color="textMuted">Shared performance channel</Text><Heading size="sm" mt={1}>{activeSong ? activeSong.songName : 'No Canticle is active'}</Heading>{activeSong && <Text mt={1} fontSize={{ base: 'xs', md: 'md' }}>{activeSong.performerName} · {activeSong.stage === 'chanting' ? `chanting until round ${activeSong.activatesAtRound}` : activeSong.endsAfterRound ? `active through round ${activeSong.endsAfterRound}` : 'active until interrupted or combat ends'} · all hearers affected</Text>}</Box>
          <VStack align="end" spacing={2}><Badge colorScheme={activeSong?.stage === 'chanting' ? 'yellow' : activeSong ? 'pink' : 'gray'}>{activeSong?.stage || 'silent'}</Badge>{ownsActiveSong && <Button size="sm" colorScheme="pink" onClick={sustainActiveSong} isLoading={sustainingSong} isDisabled={!maySustainSong}>{maySustainSong ? 'Sustain with Song' : isTurn ? 'Song spent' : 'Sustain on your turn'}</Button>}</VStack>
        </Flex>
        <Text mt={2} fontSize="xs" color="textMuted">A Canticle breaks if its performer ends a turn without spending Song to sustain it. A new Canticle also cuts it short. Verses use Song but do not interrupt the channel.</Text>
      </Box>}

      <Tabs defaultIndex={0} isLazy variant="unstyled">
        <TabList p={1} bg="blackAlpha.400" border="1px solid" borderColor="whiteAlpha.300" borderRadius="xl"><Tab flex="1" minH="44px" borderRadius="lg" fontWeight="bold" _selected={{ bg: 'primary', color: 'white' }}>Techniques <Badge ml={2} colorScheme="gray">{techniques.length}</Badge></Tab><Tab flex="1" minH="44px" borderRadius="lg" fontWeight="bold" _selected={{ bg: 'primary', color: 'white' }}>Songs <Badge ml={2} colorScheme="gray">{songs.length}</Badge></Tab></TabList>
        <TabPanels>
          <TabPanel px={0} pt={{ base: 3, md: 5 }} pb={0}><Heading size={{ base: 'sm', md: 'md' }}>Inherited techniques</Heading><Text color="textMuted" fontSize={{ base: 'xs', md: 'md' }} mt={1} mb={{ base: 3, md: 4 }}>Five techniques inherited from {reyvateil.name}. Tap a row to inspect or activate it.</Text><Grid templateColumns={{ base: '1fr', lg: 'repeat(2,minmax(0,1fr))' }} gap={{ base: 2, md: 4 }}>{techniques.map((ability) => <TechniqueCard key={ability.id} ability={ability} combatProfile={combatProfile} participant={participant} encounter={encounter} />)}</Grid><Divider my={{ base: 4, md: 6 }} borderColor="whiteAlpha.300" /><Heading size={{ base: 'sm', md: 'md' }}>Universal actions</Heading><Text color="textMuted" fontSize={{ base: 'xs', md: 'md' }} mt={1} mb={{ base: 3, md: 4 }}>Reliable actions shared by every combatant.</Text><SimpleGrid columns={{ base: 1, md: 2, xl: 3 }} spacing={{ base: 2, md: 3 }}>{commonActions(combatProfile).map((action) => <CommonActionCard key={action[0]} action={action} participant={participant} encounter={encounter} />)}</SimpleGrid></TabPanel>
          <TabPanel px={0} pt={{ base: 3, md: 5 }} pb={0}><Heading size={{ base: 'sm', md: 'md' }}>Song repertoire</Heading><Text color="textMuted" fontSize={{ base: 'xs', md: 'md' }} mt={1} mb={{ base: 3, md: 4 }}>Song is separate from Action. Spend it on one Verse, begin a Canticle, or sustain your existing Canticle. Canticles affect every creature that can hear them, friend or foe.</Text>{songs.length ? <Grid templateColumns={{ base: '1fr', lg: 'repeat(2,minmax(0,1fr))' }} gap={{ base: 2, md: 4 }}>{songs.map((song) => <TechniqueCard key={song.id} ability={song} combatProfile={combatProfile} participant={participant} encounter={encounter} kind="song" />)}</Grid> : <Box p={4} borderRadius="xl" border="1px solid" borderColor="orange.300"><Text>Song definitions are synchronizing with this Reyvateil.</Text></Box>}</TabPanel>
        </TabPanels>
      </Tabs>

      <ResponsiveInfoPanel title="Growth and progression"><Text fontSize={{ base: 'sm', md: 'md' }}>Gain {combat.growth.hitPointsPerLevel} maximum HP per level. Aptitudes increase automatically at levels {combat.growth.aptitudeIncreaseLevels.join(', ')} in this doctrine’s order: {combat.growth.aptitudeGrowthOrder.map((key) => aptitudeLabels[key].label).join(' → ')} (cap {combat.growth.aptitudeCap}). Inherit another technique at levels {combat.growth.newTechniqueLevels.join(' and ')}. This identity’s {combat.growth.songCapacity}-Song repertoire unlocks further Songs at levels {combat.growth.newSongLevels.join(', ') || '—'}. Evolution becomes possible at level {combat.growth.evolutionLevel}.</Text></ResponsiveInfoPanel>

      <ResponsiveInfoPanel title="Combat rules"><SimpleGrid columns={{ base: 1, md: 2 }} spacing={3}><Text><b>Attack:</b> roll d20 + the listed attack bonus against the target’s Defence. Meeting or exceeding Defence hits.</Text><Text><b>Saving throw:</b> the target rolls d20 + the named aptitude against the attacker’s Save Difficulty. Advantage means roll twice and keep the higher result.</Text><Text><b>Turn:</b> movement, one Action, and one Song. Action activates a universal/inherited technique or an item. Song performs a Verse, begins a Canticle, or sustains your Canticle.</Text><Text><b>Quick:</b> not a separate action. Committing an Action technique unlocks one Quick follow-up that turn. Songs and items do not unlock it.</Text><Text><b>Reaction:</b> one reactive technique between the starts of your turns. Passives remain continuously active.</Text><Text><b>Canticle sustain:</b> spend Song on every one of your turns or the Canticle breaks when that turn ends.</Text><Text><b>Exposed:</b> the next attack against the creature has advantage, then Exposed ends. <b>Rooted:</b> movement becomes 0.</Text><Text><b>Silenced:</b> Hymmnos techniques and Songs cannot be activated. <b>Prone:</b> adjacent attacks have advantage; standing costs half movement.</Text><Text><b>Resistance:</b> halve the affected damage after other reductions. Temporary HP is lost first.</Text><Text><b>Song audibility:</b> a Song only affects creatures able to hear it. Canticles do not distinguish friend from foe. Soundless creatures are immune.</Text><Text><b>Song channel:</b> Verses are instant. A new Canticle interrupts the old one regardless of performer.</Text></SimpleGrid></ResponsiveInfoPanel>
      <DamageTypeReference isOpen={damageReference.isOpen} onClose={damageReference.onClose} />
      <StatsReference isOpen={statsReference.isOpen} onClose={statsReference.onClose} combat={{ ...combatProfile, techniqueAptitude }} growthOrder={combat.growth.aptitudeGrowthOrder} />
      <MortalityReference isOpen={hpReference.isOpen} onClose={hpReference.onClose} hp={hp} profile={profile} />
    </VStack>
  );
};

export default CombatHome;
