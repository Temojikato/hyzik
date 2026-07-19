import React from 'react';
import { Badge, Button, HStack, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, Text, VStack } from '@chakra-ui/react';
import { FaVolumeHigh } from 'react-icons/fa6';
import { useCampaign } from '../contexts/CampaignContext';
import { CYPHERS } from '../data/cyphers';
import { PublicLexiconEntry } from '../types/Campaign';
import { useBackDismiss } from '../contexts/BackNavigationContext';

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
  useBackDismiss(isOpen, onClose);
  const { unlockedLexicon } = useCampaign();
  const unlocked = unlockedLexicon.get(entry.id);
  const cypher = CYPHERS.find((item) => item.id === entry.cypherId);
  const emotionSound = /^E\.s\.\s*(I|II|III)$/i.exec(entry.partOfSpeech);
  const emotionPosition = emotionSound?.[1] === 'I'
    ? 'intensity or willingness'
    : emotionSound?.[1] === 'II'
      ? 'the nature of the singer’s emotion'
      : emotionSound?.[1] === 'III'
        ? 'whether the singer wants the present state to change, continue, or simply accepts it'
        : '';
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalContent>
        <ModalHeader fontFamily="Hymmnos" fontSize="3xl" color={unlocked ? 'teal.200' : 'textHeader'}>{entry.headword}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack align="stretch" spacing={4}>
            <HStack flexWrap="wrap"><Badge>{entry.partOfSpeech}</Badge><Badge>{entry.dialect || 'Unmarked'}</Badge><Badge colorScheme={unlocked ? 'green' : 'purple'}>{unlocked ? 'Translated' : `${cypher?.title || 'Unknown'} Cypher required`}</Badge></HStack>
            <Text><Text as="span" color="textMuted">Pronunciation: </Text>{entry.pronunciation}</Text>
            {emotionSound && <Text p={3} borderRadius="lg" border="1px solid" borderColor="cyan.500" bg="blackAlpha.400" fontSize="sm"><b>Emotion Sound {emotionSound[1]}:</b> this is not an ordinary vocabulary word. It encodes {emotionPosition}, so its canonical gloss may be a complete emotional clause.</Text>}
            {unlocked ? <Text><Text as="span" display="block" mb={1} fontSize="xs" color="textMuted" textTransform="uppercase" letterSpacing=".1em">{emotionSound ? 'Canonical emotional-state gloss' : 'Canonical meaning'}</Text><Text as="span" fontSize="lg" color="teal.200">{unlocked.meaning}</Text></Text> : <Text color="textMuted">The shape and sound of this word are known. Its meaning is still locked.</Text>}
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
