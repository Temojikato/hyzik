import React, { useEffect, useMemo, useState } from 'react';
import {
  Badge,
  Box,
  Button,
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
  Text,
  Tooltip,
  useToast,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import { FaBolt, FaLock, FaShieldHalved, FaVolumeHigh } from 'react-icons/fa6';
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
  if (levelLocked) {
    return (
      <Box position="relative" minH="270px" overflow="hidden" border="1px solid" borderColor="whiteAlpha.300" bg="blackAlpha.500" borderRadius="xl" aria-label={`${kind === 'song' ? 'Song' : 'Technique'} locked until level ${levelRequired}`}>
        <Box p={5} filter="blur(7px)" opacity={0.28} userSelect="none" aria-hidden="true">
          <Heading size="md" fontFamily="Hymmnos">{invocation.headword}</Heading>
          <HStack mt={3}><Badge>{actionLabel[ability.actionType]}</Badge><Badge>{ability.damageType}</Badge></HStack>
          <Text mt={6}>{resolvedDescription}</Text>
          <Box mt={5} h="72px" borderRadius="lg" bg="whiteAlpha.200" />
        </Box>
        <VStack position="absolute" inset={0} justify="center" spacing={3} px={6} textAlign="center" bg="blackAlpha.600">
          <Flex boxSize="56px" borderRadius="full" bg="purple.900" border="1px solid" borderColor="purple.300" align="center" justify="center"><FaLock size="24px" /></Flex>
          <Badge colorScheme="purple" fontSize="sm" px={3} py={1}>LOCKED</Badge>
          <Heading size="md">Sealed {kind === 'song' ? 'Song' : 'Technique'}</Heading>
          <Text color="textMuted">Reach level {levelRequired} to reveal and invoke this {kind === 'song' ? 'Song' : 'technique'}.</Text>
        </VStack>
      </Box>
    );
  }
  return (
    <Box p={4} border="1px solid" borderColor="whiteAlpha.300" bg="blackAlpha.300" borderRadius="xl">
      <Flex justify="space-between" gap={3} align="start">
        <Box><Heading size="md" fontFamily="Hymmnos" overflowWrap="anywhere">{invocation.headword}</Heading><Text fontSize="sm" fontWeight="bold" color={translated ? 'green.200' : 'purple.200'}>{translated ? ability.name : 'Translation locked by Cypher'}</Text><HStack mt={2} spacing={2} flexWrap="wrap"><Badge colorScheme="purple">{actionLabel[ability.actionType]}</Badge><Badge variant="outline">{ability.uses || '∞'} {resetLabel[ability.reset]}</Badge>{song && <><Badge colorScheme={song.songForm === 'verse' ? 'cyan' : 'pink'}>{song.songForm === 'verse' ? 'Verse · instant' : 'Canticle · continuous'}</Badge><Badge colorScheme="teal">{songAudienceLabel[song.audience || (song.songForm === 'canticle' ? 'all-hearers' : 'chosen-hearer')]}</Badge><Badge colorScheme={combatProfile.level >= song.levelRequired ? 'green' : 'gray'}>Level {song.levelRequired}</Badge></>}</HStack></Box>
        <Badge colorScheme="orange">{ability.damageType}</Badge>
      </Flex>
      <Text mt={3} fontSize="sm">{resolvedDescription}</Text>
      {song && <Text mt={2} fontSize="xs" color="textMuted">{song.songForm === 'verse'
        ? 'Resolves immediately and never interrupts a Canticle.'
        : `${song.chantRounds ? `${song.chantRounds} round of chanting · ` : 'No chant · '}${song.durationRounds ? `${song.durationRounds} active rounds` : 'lasts until interrupted or combat ends'} · replaces any active Canticle.`} <b>Audience:</b> {songAudienceRule({ ...song, audience: song.audience || (song.songForm === 'canticle' ? 'all-hearers' : 'chosen-hearer') })}</Text>}
      <Box mt={4} p={3} borderRadius="lg" bg="blackAlpha.500">
        <Text fontFamily="Hymmnos" fontSize="2xl" color="textHeader" overflowWrap="anywhere">{invocation.headword}</Text>
        <Text fontSize="xs" mt={1} color="textMuted">{invocation.pronunciation}</Text>
        <Text fontSize="xs" mt={1} color={translated ? 'green.300' : 'purple.200'}>{translated ? translation.map((part) => part?.meaning).join(' · ') : 'Translation locked by Cypher'}</Text>
        <Button mt={2} size="xs" variant="ghost" leftIcon={<FaVolumeHigh />} onClick={play}>Pronounce “{spoken}”</Button>
        {song?.audioUrl && <Button mt={2} ml={2} size="xs" variant="outline" leftIcon={<FaVolumeHigh />} onClick={() => void new Audio(song.audioUrl).play()}>Play scored Song</Button>}
      </Box>
      {ability.actionType === 'passive' ? <Badge mt={4} colorScheme="green">Always active</Badge> : (
        <Button mt={4} w="full" onClick={activate} isLoading={activating} isDisabled={Boolean(reason)} title={reason}>
          {reason || `Exclaim “${spoken}” and activate`}
        </Button>
      )}
    </Box>
  );
};

const CommonActionCard: React.FC<{ action: string[]; participant?: EncounterParticipant; encounter: Encounter | null }> = ({ action, participant, encounter }) => {
  const [id, name, effect] = action;
  const [using, setUsing] = useState(false);
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
  return <Box p={4} bg="blackAlpha.300" borderRadius="xl"><HStack justify="space-between"><Text fontWeight="bold">{name}</Text><Badge>Action</Badge></HStack><Text mt={2} fontSize="sm">{effect}</Text><Button mt={3} size="sm" w="full" onClick={useAction} isLoading={using} isDisabled={!ready}>{ready ? `Use ${name}` : 'Waiting for your action'}</Button></Box>;
};

const DamageTypeReference: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => (
  <Modal isOpen={isOpen} onClose={onClose} size="4xl" scrollBehavior="inside">
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

  return (
    <VStack align="stretch" spacing={6} mt={5}>
      <Flex p={{ base: 4, md: 6 }} borderRadius="2xl" bg="blackAlpha.400" border="1px solid" borderColor={isTurn ? 'green.300' : 'whiteAlpha.300'} gap={5} align="center" wrap="wrap">
        <Image src={profile.reyvateilImageUrl || reyvateil.image} alt={reyvateil.name} boxSize={{ base: '100px', md: '140px' }} objectFit="cover" borderRadius="full" border="3px solid" borderColor="primary" />
        <Box flex="1" minW="240px"><Text color="textMuted" textTransform="uppercase" letterSpacing=".12em">{combat.role} · level {profile.combatProfile.level}</Text><Heading>{combat.specialtyTitle}</Heading><Text mt={1}>{reyvateil.name} translates {combat.damageType} through a {combat.role} combat doctrine.</Text><Progress mt={4} value={(hp / Math.max(1, maxHp)) * 100} colorScheme={hp / maxHp < .3 ? 'red' : 'green'} borderRadius="full" /><Text mt={1} fontWeight="bold">{hp} / {maxHp} HP</Text></Box>
        <Box minW="220px" p={4} borderRadius="xl" bg={isTurn ? 'green.900' : 'blackAlpha.400'}><Badge colorScheme={campaignState.battleActive ? 'red' : 'gray'}>{campaignState.battleActive ? `ROUND ${encounter?.turn?.round || 1}` : 'OUT OF COMBAT'}</Badge><Heading size="md" mt={2}>{isTurn ? 'Your turn' : encounter?.turn?.activeParticipantId ? `${encounter.participants.find((entry) => entry.id === encounter.turn?.activeParticipantId)?.name || 'Another combatant'} is acting` : 'Waiting for initiative'}</Heading>{isTurn && <Text mt={1}>Action {participant?.turnResources?.actionAvailable === false ? 'spent' : 'ready'} · Quick {participant?.turnResources?.quickAvailable === false ? 'spent' : 'ready'}</Text>}</Box>
      </Flex>

      <Box><Heading size="md" mb={3}>Combat aptitudes</Heading><SimpleGrid columns={{ base: 2, md: 3, xl: 6 }} spacing={3}>{Object.entries(combatProfile.aptitudes).map(([key, value]) => <Tooltip key={key} label={aptitudeLabels[key]?.hint}><Box p={4} bg="blackAlpha.300" borderRadius="xl" border="1px solid" borderColor="whiteAlpha.300"><Text color="textMuted" fontSize="xs" textTransform="uppercase">{aptitudeLabels[key]?.label || key}</Text><Text fontSize="3xl" fontWeight="bold">+{value}</Text></Box></Tooltip>)}</SimpleGrid></Box>

      <Box><Flex justify="space-between" align="center" mb={3}><Heading size="md">Derived combat values</Heading><Button size="sm" variant="outline" onClick={damageReference.onOpen}>Damage types</Button></Flex><SimpleGrid columns={{ base: 2, md: 5 }} spacing={3}><Box p={4} bg="blackAlpha.300" borderRadius="xl"><HStack><FaShieldHalved /><Text>Defence</Text></HStack><Text fontSize="2xl" fontWeight="bold">{combatProfile.derived.defense}</Text></Box><Box p={4} bg="blackAlpha.300" borderRadius="xl"><HStack><FaBolt /><Text>Initiative</Text></HStack><Text fontSize="2xl" fontWeight="bold">+{combatProfile.derived.initiative}</Text></Box><Box p={4} bg="blackAlpha.300" borderRadius="xl"><Text>Technique attack</Text><Text fontSize="2xl" fontWeight="bold">+{combatProfile.derived.techniqueAttack}</Text></Box><Box p={4} bg="blackAlpha.300" borderRadius="xl"><Text>Song attack</Text><Text fontSize="2xl" fontWeight="bold">+{combatProfile.derived.songAttack}</Text></Box><Box p={4} bg="blackAlpha.300" borderRadius="xl"><Text>Save difficulty</Text><Text fontSize="2xl" fontWeight="bold">{combatProfile.derived.saveDifficulty}</Text></Box></SimpleGrid></Box>

      {campaignState.battleActive && <Box p={4} borderRadius="xl" border="1px solid" borderColor={activeSong ? 'pink.300' : 'whiteAlpha.300'} bg={activeSong ? 'pink.900' : 'blackAlpha.300'}><Flex justify="space-between" gap={3} flexWrap="wrap"><Box><Text fontSize="xs" textTransform="uppercase" letterSpacing=".12em" color="textMuted">Shared performance channel</Text><Heading size="sm" mt={1}>{activeSong ? activeSong.songName : 'No Canticle is active'}</Heading>{activeSong && <Text mt={1}>{activeSong.performerName} · {activeSong.stage === 'chanting' ? `chanting until round ${activeSong.activatesAtRound}` : activeSong.endsAfterRound ? `active through round ${activeSong.endsAfterRound}` : 'active until interrupted or combat ends'} · all creatures who hear it are affected</Text>}</Box><Badge alignSelf="center" colorScheme={activeSong?.stage === 'chanting' ? 'yellow' : activeSong ? 'pink' : 'gray'}>{activeSong?.stage || 'silent'}</Badge></Flex><Text mt={2} fontSize="xs" color="textMuted">A new Canticle cuts this one short. Verses resolve instantly and leave this channel untouched. Soundless creatures cannot be affected by audible Song Magic.</Text></Box>}

      <Box><Heading size="md">Songs</Heading><Text color="textMuted" mt={1} mb={4}>Every Reyvateil knows both forms. Verses are instant, directed workings. Canticles are sustained stanzas heard by the whole battlefield: their effects apply equally to every creature capable of hearing them, regardless of allegiance. Only one Canticle can hold the encounter-wide performance channel.</Text>{songs.length ? <Grid templateColumns={{ base: '1fr', lg: 'repeat(2,minmax(0,1fr))' }} gap={4}>{songs.map((song) => <TechniqueCard key={song.id} ability={song} combatProfile={combatProfile} participant={participant} encounter={encounter} kind="song" />)}</Grid> : <Box p={4} borderRadius="xl" border="1px solid" borderColor="orange.300"><Text>Song definitions are synchronizing with this Reyvateil.</Text></Box>}</Box>

      <Box><Heading size="md">Inherited techniques</Heading><Text color="textMuted" mt={1} mb={4}>Five techniques were inherited from {reyvateil.name}’s ten-technique constellation. A future ritual may rewrite this inheritance.</Text><Grid templateColumns={{ base: '1fr', lg: 'repeat(2,minmax(0,1fr))' }} gap={4}>{techniques.map((ability) => <TechniqueCard key={ability.id} ability={ability} combatProfile={combatProfile} participant={participant} encounter={encounter} />)}</Grid></Box>

      <Box><Heading size="md">Universal actions</Heading><Text color="textMuted" mt={1} mb={4}>These are learned, not inherited. They keep every combatant functional regardless of Reyvateil draw.</Text><SimpleGrid columns={{ base: 1, md: 2, xl: 3 }} spacing={3}>{commonActions(combatProfile).map((action) => <CommonActionCard key={action[0]} action={action} participant={participant} encounter={encounter} />)}</SimpleGrid></Box>

      <Box p={5} borderRadius="xl" border="1px solid" borderColor="whiteAlpha.300"><Heading size="sm">Growth pattern</Heading><Text mt={2}>Gain {combat.growth.hitPointsPerLevel} maximum HP per level. Raise one aptitude at levels {combat.growth.aptitudeIncreaseLevels.join(', ')} (cap {combat.growth.aptitudeCap}). Inherit another technique at levels {combat.growth.newTechniqueLevels.join(' and ')}. This identity’s {combat.growth.songCapacity}-Song repertoire unlocks further Songs at levels {combat.growth.newSongLevels.join(', ') || '—'}. Evolution becomes possible at level {combat.growth.evolutionLevel}.</Text></Box>

      <Box p={5} borderRadius="xl" border="1px solid" borderColor="whiteAlpha.300"><Heading size="sm">Combat language</Heading><SimpleGrid columns={{ base: 1, md: 2 }} spacing={3} mt={3}><Text><b>Attack:</b> roll d20 + the listed attack bonus against the target’s Defence. Meeting or exceeding Defence hits.</Text><Text><b>Saving throw:</b> the target rolls d20 + the named aptitude against the attacker’s Save Difficulty. Advantage means roll twice and keep the higher result.</Text><Text><b>Turn:</b> one Action, one Quick action, movement, and one Reaction before your next turn. The portal spends these automatically when invoked.</Text><Text><b>Exposed:</b> the next attack against the creature has advantage, then Exposed ends. <b>Rooted:</b> movement becomes 0.</Text><Text><b>Silenced:</b> Hymmnos techniques and Songs cannot be activated. <b>Prone:</b> adjacent attacks have advantage; standing costs half movement.</Text><Text><b>Resistance:</b> halve the affected damage after other reductions. Temporary HP is lost before ordinary HP.</Text><Text><b>Song audibility:</b> a Song only affects creatures able to hear it. Canticles do not distinguish friend from foe; every audible creature receives the stated effect. A creature documented as Soundless is immune to audible Song Magic.</Text><Text><b>Song channel:</b> Verses are instant. A Canticle may require chanting, then remains active for its duration; a new Canticle interrupts the old one regardless of performer.</Text><Text><b>Resolution:</b> the portal records committed actions and resources; dice, targets, damage, and conditions remain table-visible decisions controlled by the administrator.</Text></SimpleGrid></Box>
      <DamageTypeReference isOpen={damageReference.isOpen} onClose={damageReference.onClose} />
    </VStack>
  );
};

export default CombatHome;
