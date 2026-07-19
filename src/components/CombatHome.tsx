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
  SimpleGrid,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  Tooltip,
  useToast,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import { FaBolt, FaChevronDown, FaChevronUp, FaLock, FaShieldHalved, FaVolumeHigh } from 'react-icons/fa6';
import { useAuth } from '../contexts/AuthContext';
import { useCampaign } from '../contexts/CampaignContext';
import { activateCombatAbility, subscribeEncounter } from '../services/campaignService';
import { Encounter, EncounterParticipant, PlayerCombatProfile, PlayerProfile } from '../types/Campaign';
import { Ability, CombatAbility, CombatSong, Reyvateil } from '../types/Reyvateils';
import { getAbilitySpokenForm, resolveAbilityInvocation } from '../utils/abilityHymmnos';
import { combatDamageTypes } from '../data/combatDamageTypes';
import { resolveBraceText, resolveCombatText, resolveStrikeText } from '../utils/combatText';
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
];

const actionLabel: Record<string, string> = { action: 'Action', quick: 'Quick', reaction: 'Reaction', passive: 'Passive' };
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
  if (ability.actionType === 'action' && resources?.actionAvailable === false) return 'Action spent';
  if (ability.actionType === 'quick' && resources?.quickAvailable === false) return 'Quick action spent';
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
            : 'The action has been committed to the combat record.',
        status: 'success',
      });
    } catch (caught: any) {
      toast({ title: 'Invocation refused', description: caught?.message || String(caught), status: 'warning', duration: 6000 });
    } finally { setActivating(false); }
  };
  const songRule = song ? (song.songForm === 'verse'
    ? 'Resolves immediately and never interrupts a Canticle.'
    : `${song.chantRounds ? `${song.chantRounds} round of chanting · ` : 'No chant · '}${song.durationRounds ? `${song.durationRounds} active rounds` : 'lasts until interrupted or combat ends'} · replaces any active Canticle.`) : '';
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
      toast({ title: `${name} committed`, status: 'success' });
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

const CombatHome: React.FC<{ reyvateil: Reyvateil; profile: PlayerProfile }> = ({ reyvateil, profile }) => {
  const { currentUser } = useAuth();
  const { campaignState } = useCampaign();
  const [encounter, setEncounter] = useState<Encounter | null>(null);
  const damageReference = useDisclosure();
  useBackDismiss(damageReference.isOpen, damageReference.onClose);
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
  const songs = combat.combatSongs || [];
  const activeSong = encounter?.activeSong;
  const activeCombatant = encounter?.participants.find((entry) => entry.id === encounter.turn?.activeParticipantId)?.name;
  const derivedValues = [
    { label: 'Defence', value: combatProfile.derived.defense, icon: <FaShieldHalved /> },
    { label: 'Initiative', value: `+${combatProfile.derived.initiative}`, icon: <FaBolt /> },
    { label: 'Technique', value: `+${combatProfile.derived.techniqueAttack}` },
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
        <Flex mt={2} justify="space-between" align="center" gap={2}><Text fontWeight="bold" fontSize="sm">{hp} / {maxHp} HP</Text><Badge colorScheme={campaignState.battleActive ? (isTurn ? 'green' : 'red') : 'gray'}>{campaignState.battleActive ? (isTurn ? 'YOUR TURN' : `ROUND ${encounter?.turn?.round || 1}`) : 'EXPLORATION'}</Badge></Flex>
        {campaignState.battleActive && <Text mt={1} fontSize="xs" color="textMuted" noOfLines={1}>{isTurn ? `Action ${participant?.turnResources?.actionAvailable === false ? 'spent' : 'ready'} · Quick ${participant?.turnResources?.quickAvailable === false ? 'spent' : 'ready'}` : `${activeCombatant || 'Initiative'} is acting`}</Text>}
      </Box>
      <Flex display={{ base: 'none', md: 'flex' }} p={6} borderRadius="2xl" bg="blackAlpha.400" border="1px solid" borderColor={isTurn ? 'green.300' : 'whiteAlpha.300'} gap={5} align="center" wrap="wrap">
        <Image src={profile.reyvateilImageUrl || reyvateil.image} alt={reyvateil.name} boxSize={{ base: '100px', md: '140px' }} objectFit="cover" borderRadius="full" border="3px solid" borderColor="primary" />
        <Box flex="1" minW="240px"><Text color="textMuted" textTransform="uppercase" letterSpacing=".12em">{combat.role} · level {profile.combatProfile.level}</Text><Heading>{combat.specialtyTitle}</Heading><Text mt={1}>{reyvateil.name} translates {combat.damageType} through a {combat.role} combat doctrine.</Text><Progress mt={4} value={(hp / Math.max(1, maxHp)) * 100} colorScheme={hp / maxHp < .3 ? 'red' : 'green'} borderRadius="full" /><Text mt={1} fontWeight="bold">{hp} / {maxHp} HP</Text></Box>
        <Box minW="220px" p={4} borderRadius="xl" bg={isTurn ? 'green.900' : 'blackAlpha.400'}><Badge colorScheme={campaignState.battleActive ? 'red' : 'gray'}>{campaignState.battleActive ? `ROUND ${encounter?.turn?.round || 1}` : 'OUT OF COMBAT'}</Badge><Heading size="md" mt={2}>{isTurn ? 'Your turn' : activeCombatant ? `${activeCombatant} is acting` : 'Waiting for initiative'}</Heading>{isTurn && <Text mt={1}>Action {participant?.turnResources?.actionAvailable === false ? 'spent' : 'ready'} · Quick {participant?.turnResources?.quickAvailable === false ? 'spent' : 'ready'}</Text>}</Box>
      </Flex>

      <Box><Heading size={{ base: 'sm', md: 'md' }} mb={{ base: 2, md: 3 }}>Combat aptitudes</Heading><SimpleGrid columns={{ base: 3, md: 3, xl: 6 }} spacing={{ base: 2, md: 3 }}>{Object.entries(combatProfile.aptitudes).map(([key, value]) => <Tooltip key={key} label={aptitudeLabels[key]?.hint}><Box p={{ base: 2, md: 4 }} minH={{ base: '62px', md: 'auto' }} bg="blackAlpha.300" borderRadius={{ base: 'lg', md: 'xl' }} border="1px solid" borderColor="whiteAlpha.300"><Text color="textMuted" fontSize={{ base: '9px', md: 'xs' }} textTransform="uppercase" noOfLines={1}>{aptitudeLabels[key]?.label || key}</Text><Text fontSize={{ base: 'xl', md: '3xl' }} lineHeight="1.2" fontWeight="bold">+{value}</Text></Box></Tooltip>)}</SimpleGrid></Box>

      <Box><Flex justify="space-between" align="center" mb={{ base: 2, md: 3 }}><Heading size={{ base: 'sm', md: 'md' }}>Derived values</Heading><Button size={{ base: 'xs', md: 'sm' }} variant="outline" onClick={damageReference.onOpen}>Damage types</Button></Flex><SimpleGrid columns={{ base: 3, md: 5 }} spacing={{ base: 2, md: 3 }}>{derivedValues.map((entry) => <Box key={entry.label} p={{ base: 2, md: 4 }} minH={{ base: '62px', md: 'auto' }} bg="blackAlpha.300" borderRadius={{ base: 'lg', md: 'xl' }}><HStack spacing={1.5}>{entry.icon}<Text fontSize={{ base: '9px', md: 'md' }} color={{ base: 'textMuted', md: 'inherit' }} textTransform={{ base: 'uppercase', md: 'none' }} noOfLines={1}>{entry.label}</Text></HStack><Text fontSize={{ base: 'xl', md: '2xl' }} lineHeight="1.2" fontWeight="bold">{entry.value}</Text></Box>)}</SimpleGrid></Box>

      {campaignState.battleActive && <Box p={{ base: 3, md: 4 }} borderRadius="xl" border="1px solid" borderColor={activeSong ? 'pink.300' : 'whiteAlpha.300'} bg={activeSong ? 'pink.900' : 'blackAlpha.300'}><Flex justify="space-between" gap={3} flexWrap="wrap"><Box><Text fontSize="10px" textTransform="uppercase" letterSpacing=".12em" color="textMuted">Shared performance channel</Text><Heading size="sm" mt={1}>{activeSong ? activeSong.songName : 'No Canticle is active'}</Heading>{activeSong && <Text mt={1} fontSize={{ base: 'xs', md: 'md' }}>{activeSong.performerName} · {activeSong.stage === 'chanting' ? `chanting until round ${activeSong.activatesAtRound}` : activeSong.endsAfterRound ? `active through round ${activeSong.endsAfterRound}` : 'active until interrupted or combat ends'} · all hearers affected</Text>}</Box><Badge alignSelf="center" colorScheme={activeSong?.stage === 'chanting' ? 'yellow' : activeSong ? 'pink' : 'gray'}>{activeSong?.stage || 'silent'}</Badge></Flex><Text mt={2} fontSize="xs" color="textMuted" display={{ base: 'none', md: 'block' }}>A new Canticle cuts this one short. Verses resolve instantly and leave this channel untouched. Soundless creatures cannot be affected by audible Song Magic.</Text></Box>}

      <Tabs defaultIndex={0} isLazy variant="unstyled">
        <TabList p={1} bg="blackAlpha.400" border="1px solid" borderColor="whiteAlpha.300" borderRadius="xl"><Tab flex="1" minH="44px" borderRadius="lg" fontWeight="bold" _selected={{ bg: 'primary', color: 'white' }}>Techniques <Badge ml={2} colorScheme="gray">{techniques.length}</Badge></Tab><Tab flex="1" minH="44px" borderRadius="lg" fontWeight="bold" _selected={{ bg: 'primary', color: 'white' }}>Songs <Badge ml={2} colorScheme="gray">{songs.length}</Badge></Tab></TabList>
        <TabPanels>
          <TabPanel px={0} pt={{ base: 3, md: 5 }} pb={0}><Heading size={{ base: 'sm', md: 'md' }}>Inherited techniques</Heading><Text color="textMuted" fontSize={{ base: 'xs', md: 'md' }} mt={1} mb={{ base: 3, md: 4 }}>Five techniques inherited from {reyvateil.name}. Tap a row to inspect or activate it.</Text><Grid templateColumns={{ base: '1fr', lg: 'repeat(2,minmax(0,1fr))' }} gap={{ base: 2, md: 4 }}>{techniques.map((ability) => <TechniqueCard key={ability.id} ability={ability} combatProfile={combatProfile} participant={participant} encounter={encounter} />)}</Grid><Divider my={{ base: 4, md: 6 }} borderColor="whiteAlpha.300" /><Heading size={{ base: 'sm', md: 'md' }}>Universal actions</Heading><Text color="textMuted" fontSize={{ base: 'xs', md: 'md' }} mt={1} mb={{ base: 3, md: 4 }}>Reliable actions shared by every combatant.</Text><SimpleGrid columns={{ base: 1, md: 2, xl: 3 }} spacing={{ base: 2, md: 3 }}>{commonActions(combatProfile).map((action) => <CommonActionCard key={action[0]} action={action} participant={participant} encounter={encounter} />)}</SimpleGrid></TabPanel>
          <TabPanel px={0} pt={{ base: 3, md: 5 }} pb={0}><Heading size={{ base: 'sm', md: 'md' }}>Song repertoire</Heading><Text color="textMuted" fontSize={{ base: 'xs', md: 'md' }} mt={1} mb={{ base: 3, md: 4 }}>Verses resolve instantly. Canticles fill the shared channel and affect every creature that can hear them, friend or foe.</Text>{songs.length ? <Grid templateColumns={{ base: '1fr', lg: 'repeat(2,minmax(0,1fr))' }} gap={{ base: 2, md: 4 }}>{songs.map((song) => <TechniqueCard key={song.id} ability={song} combatProfile={combatProfile} participant={participant} encounter={encounter} kind="song" />)}</Grid> : <Box p={4} borderRadius="xl" border="1px solid" borderColor="orange.300"><Text>Song definitions are synchronizing with this Reyvateil.</Text></Box>}</TabPanel>
        </TabPanels>
      </Tabs>

      <ResponsiveInfoPanel title="Growth and progression"><Text fontSize={{ base: 'sm', md: 'md' }}>Gain {combat.growth.hitPointsPerLevel} maximum HP per level. Raise one aptitude at levels {combat.growth.aptitudeIncreaseLevels.join(', ')} (cap {combat.growth.aptitudeCap}). Inherit another technique at levels {combat.growth.newTechniqueLevels.join(' and ')}. This identity’s {combat.growth.songCapacity}-Song repertoire unlocks further Songs at levels {combat.growth.newSongLevels.join(', ') || '—'}. Evolution becomes possible at level {combat.growth.evolutionLevel}.</Text></ResponsiveInfoPanel>

      <ResponsiveInfoPanel title="Combat rules"><SimpleGrid columns={{ base: 1, md: 2 }} spacing={3}><Text><b>Attack:</b> roll d20 + the listed attack bonus against the target’s Defence. Meeting or exceeding Defence hits.</Text><Text><b>Saving throw:</b> the target rolls d20 + the named aptitude against the attacker’s Save Difficulty. Advantage means roll twice and keep the higher result.</Text><Text><b>Turn:</b> one Action, one Quick action, movement, and one Reaction before your next turn.</Text><Text><b>Exposed:</b> the next attack against the creature has advantage, then Exposed ends. <b>Rooted:</b> movement becomes 0.</Text><Text><b>Silenced:</b> Hymmnos techniques and Songs cannot be activated. <b>Prone:</b> adjacent attacks have advantage; standing costs half movement.</Text><Text><b>Resistance:</b> halve the affected damage after other reductions. Temporary HP is lost first.</Text><Text><b>Song audibility:</b> a Song only affects creatures able to hear it. Canticles do not distinguish friend from foe. Soundless creatures are immune.</Text><Text><b>Song channel:</b> Verses are instant. A new Canticle interrupts the old one regardless of performer.</Text></SimpleGrid></ResponsiveInfoPanel>
      <DamageTypeReference isOpen={damageReference.isOpen} onClose={damageReference.onClose} />
    </VStack>
  );
};

export default CombatHome;
