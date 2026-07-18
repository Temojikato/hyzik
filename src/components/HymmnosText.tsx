import React, { useMemo } from 'react';
import { Button, Text, Tooltip, useDisclosure } from '@chakra-ui/react';
import { useCampaign } from '../contexts/CampaignContext';
import LexiconEntryModal from './LexiconEntryModal';
import { PublicLexiconEntry } from '../types/Campaign';

interface HymmnosTextProps {
  children: string;
  showTranslation?: boolean;
  compact?: boolean;
}

const HymmnosText: React.FC<HymmnosTextProps> = ({ children, showTranslation = true, compact = false }) => {
  const { publicLexicon, unlockedLexicon } = useCampaign();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selected, setSelected] = React.useState<PublicLexiconEntry | null>(null);
  const lookup = useMemo(() => new Map(publicLexicon.map((entry) => [entry.headword.toLowerCase(), entry])), [publicLexicon]);
  const parts = children.split(/([A-Za-z][A-Za-z0-9.'-]*)/g);

  return (
    <Text as="span" lineHeight="1.9">
      {parts.map((part, index) => {
        const exactEntry = lookup.get(part.toLowerCase());
        const trailingPunctuation = exactEntry ? '' : (part.match(/[.,!?;:]+$/)?.[0] || '');
        const visibleWord = trailingPunctuation ? part.slice(0, -trailingPunctuation.length) : part;
        const entry = exactEntry || lookup.get(visibleWord.toLowerCase());
        if (!entry) return <React.Fragment key={`${part}-${index}`}>{part}</React.Fragment>;
        const unlocked = unlockedLexicon.get(entry.id);
        return (
          <React.Fragment key={`${entry.id}-${index}`}><Tooltip label={unlocked && showTranslation ? unlocked.meaning : entry.pronunciation}>
            <Button
              variant="link"
              minW="auto"
              h="auto"
              px={compact ? 0 : 0.5}
              color={unlocked ? 'teal.200' : 'textHeader'}
              fontFamily="Hymmnos"
              fontSize="inherit"
              textDecoration={unlocked ? 'underline dotted' : undefined}
              onClick={() => { setSelected(entry); onOpen(); }}
            >
              {exactEntry ? part : visibleWord}
            </Button>
          </Tooltip>{exactEntry ? '' : trailingPunctuation}</React.Fragment>
        );
      })}
      {selected && <LexiconEntryModal entry={selected} isOpen={isOpen} onClose={onClose} />}
    </Text>
  );
};

export default HymmnosText;
