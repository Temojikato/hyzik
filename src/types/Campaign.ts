import { Timestamp } from 'firebase/firestore';
import { CombatAptitudeKey, CombatSongAudience } from './Reyvateils';

export interface PlayerCombatProfile {
  version: number;
  catalogVersion?: number;
  specialtyTitle: string;
  role: string;
  level: number;
  techniqueAptitude: CombatAptitudeKey;
  aptitudes: Record<CombatAptitudeKey, number>;
  derived: {
    maxHp: number;
    defense: number;
    initiative: number;
    techniqueAttack: number;
    songAttack: number;
    saveDifficulty: number;
    movement: number;
  };
  inheritedCombatAbilityIds: string[];
  inheritedSocialAbilityIds: string[];
  assignedAt?: Timestamp;
}

export interface PlayerProfile {
  id: string;
  email?: string;
  displayName?: string;
  reyvateilId?: string;
  reyvateilName?: string;
  reyvateilLevel?: number;
  reyvateilImageUrl?: string;
  level?: number;
  conditions?: Array<string | { name: string; type?: string; amount?: number; color?: string }>;
  stats?: Record<string, number>;
  combatStats?: {
    currentHp?: number;
    maxHp?: number;
    armorClass?: number;
  };
  combatProfile?: PlayerCombatProfile;
  mortality?: MortalityState;
  economy?: PlayerEconomy;
  unlockedCyphers?: string[];
  unlockedRecipes?: string[];
  inventory?: unknown[];
  lastSeenAt?: Timestamp;
  active?: boolean;
  activatedAt?: Timestamp;
  pausedAt?: Timestamp;
}

export interface PlayerEconomy {
  favor: number;
  reputation: Record<string, number>;
  lifetimeFavorEarned: number;
  lifetimeFavorSpent: number;
  donatedItemCount: number;
  donatedValue: number;
  factionContributions: Record<string, { items: number; favor: number }>;
}

export type EconomyTransactionKind = 'donation' | 'purchase' | 'barter' | 'transfer' | 'transfer-declined' | 'currency-migration';

export interface EconomyTransaction {
  id: string;
  kind: EconomyTransactionKind;
  playerId: string;
  playerName: string;
  counterpartyPlayerId?: string;
  counterpartyName?: string;
  factionId?: string;
  factionName?: string;
  vendorName?: string;
  itemId?: string;
  itemName?: string;
  quantity?: number;
  favorDelta: number;
  reputationDelta?: number;
  note?: string;
  createdAt?: Timestamp;
  createdAtMs: number;
}

export type MortalConsequence = 'permanent-damage' | 'lost-limb' | 'death';

export interface MortalityState {
  permanentDamage: number;
  lostLimbs: string[];
  dead: boolean;
  deathCause?: string;
  updatedAtMs?: number;
  revivedAtMs?: number;
}

export interface CypherDefinition {
  id: string;
  number: number;
  title: string;
  domain: string;
  description: string;
  color: string;
}

export interface PublicLexiconEntry {
  id: string;
  headword: string;
  pronunciation: string;
  partOfSpeech: string;
  dialect: string;
  cypherId: string;
}

export interface UnlockedLexiconEntry extends PublicLexiconEntry {
  meaning: string;
  notes?: string;
  audioUrl?: string;
}

export interface SongLine {
  hymmnos: string;
  tokenIds?: string[];
  direction?: string;
}

export interface CampaignSong {
  id: string;
  title: string;
  location?: string;
  youtubeUrl?: string;
  lines: SongLine[];
  updatedAt?: Timestamp;
}

export interface CampaignState {
  currentSongId?: string;
  currentSongTitle?: string;
  youtubeUrl?: string;
  songLibraryInitialized?: boolean;
  battleActive?: boolean;
  timersPaused?: boolean;
  timersPausedAt?: Timestamp;
  timersResumedAt?: Timestamp;
  activeEncounterId?: string;
  updatedAt?: Timestamp;
}

export type GrantKind = 'condition' | 'item' | 'cypher' | 'damage';

export interface GrantDelivery {
  id: string;
  groupId: string;
  recipientId: string;
  senderId: string;
  kind: GrantKind;
  resourceId: string;
  label: string;
  amount: number;
  conditionType?: string;
  conditionColor?: string;
  damageDetail?: string;
  status: 'waiting' | 'shared' | 'transfer-waiting';
  source?: 'admin' | 'loot' | 'transfer';
  audienceIds?: string[];
  senderName?: string;
  recipientName?: string;
  lootRarity?: string;
  lootJackpot?: boolean;
  lootSource?: string;
  lootSourceTier?: number;
  createdAt?: Timestamp;
}

export interface EncounterMapFrame {
  floorId: string;
  floorName: string;
  imageUrl: string;
  focusX: number;
  focusY: number;
  zoom: number;
}

export interface EncounterParticipant {
  id: string;
  sourceId: string;
  kind: 'player' | 'monster';
  name: string;
  initiative?: number;
  hp: number;
  maxHp: number;
  armorClass?: number;
  monsterTier?: string;
  songHearing?: 'audible' | 'soundless';
  dead?: boolean;
  turnResources?: {
    actionAvailable: boolean;
    songAvailable: boolean;
    quickAvailable: boolean;
    reactionAvailable: boolean;
    roundUses: Record<string, number>;
    encounterUses: Record<string, number>;
  };
}

export interface EncounterTurnState {
  phase: 'initiative' | 'active';
  round: number;
  activeIndex: number;
  activeParticipantId?: string;
  sequence: string[];
  serial: number;
  advancedAt?: Timestamp;
}

export interface ActiveCombatSong {
  songId: string;
  songName: string;
  form: 'canticle';
  audience: CombatSongAudience;
  performerParticipantId: string;
  performerSourceId: string;
  performerName: string;
  stage: 'chanting' | 'active';
  startedRound: number;
  activatesAtRound: number;
  endsAfterRound: number | null;
  lastSustainedTurnSerial?: number;
  audioUrl?: string;
}

export interface CombatLogEntry {
  id: string;
  participantId?: string;
  participantName?: string;
  abilityId?: string;
  abilityName?: string;
  action: 'battle-started' | 'turn-started' | 'ability-used';
  round: number;
  createdAtMs: number;
}

export interface Encounter {
  id: string;
  name: string;
  status: 'active' | 'complete';
  songId?: string;
  map?: EncounterMapFrame;
  participants: EncounterParticipant[];
  turn?: EncounterTurnState;
  activeSong?: ActiveCombatSong | null;
  combatLog?: CombatLogEntry[];
  createdAt?: Timestamp;
  startedAt?: Timestamp;
  endedAt?: Timestamp;
  updatedAt?: Timestamp;
}

export type MessageStatus = 'waiting' | 'accepted' | 'read' | 'dismissed';

export interface PrivateMessage {
  id: string;
  groupId: string;
  recipientId: string;
  senderId: string;
  subject?: string;
  body: string;
  status: MessageStatus;
  createdAt?: Timestamp;
  acceptedAt?: Timestamp;
  readAt?: Timestamp;
}
