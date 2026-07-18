import React from 'react';
import { Badge, Button, HStack, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, Text, VStack } from '@chakra-ui/react';
import { FaVolumeHigh } from 'react-icons/fa6';
import { useCampaign } from '../contexts/CampaignContext';
import { CYPHERS } from '../data/cyphers';
import { PublicLexiconEntry } from '../types/Campaign';

const speak = (entry: PublicLexiconEntry, audioUrl?: string) => {
  if (audioUrl) {
    void new Audio(audioUrl).play();
    return;
  }
  const romanized = entry.pronunciation.match(/\(([^)]+)\)/)?.[1] || entry.headword;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(new SpeechSynthesisUtterance(romanized));
};

const LexiconEntryModal: React.FC<{ entry: PublicLexiconEntry; isOpen: boolean; onClose: () => void }> = ({ entry, isOpen, onClose }) => {
  const { unlockedLexicon } = useCampaign();
  const unlocked = unlockedLexicon.get(entry.id);
  const cypher = CYPHERS.find((item) => item.id === entry.cypherId);
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalContent>
        <ModalHeader fontFamily="Hymmnos" fontSize="3xl" color={unlocked ? 'teal.200' : 'textHeader'}>{entry.headword}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack align="stretch" spacing={4}>
            <HStack flexWrap="wrap"><Badge>{entry.partOfSpeech}</Badge><Badge>{entry.dialect || 'Unmarked'}</Badge><Badge colorScheme={unlocked ? 'green' : 'purple'}>{unlocked ? 'Translated' : `${cypher?.title || 'Unknown'} Cypher required`}</Badge></HStack>
            <Text><Text as="span" color="textMuted">Pronunciation: </Text>{entry.pronunciation}</Text>
            {unlocked ? <Text fontSize="lg" color="teal.200">{unlocked.meaning}</Text> : <Text color="textMuted">The shape and sound of this word are known. Its meaning is still locked.</Text>}
            {unlocked?.notes && <Text fontSize="sm" color="textMuted">{unlocked.notes}</Text>}
            <Button leftIcon={<FaVolumeHigh />} alignSelf="start" variant="outline" onClick={() => speak(entry, unlocked?.audioUrl)}>Play pronunciation</Button>
            {!unlocked?.audioUrl && <Text fontSize="xs" color="textMuted">Device voice fallback. A pre-rendered ElevenLabs file can replace this automatically when its audio URL is added to the lexicon entry.</Text>}
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default LexiconEntryModal;
