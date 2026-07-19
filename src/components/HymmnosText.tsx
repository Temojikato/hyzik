import React, { useMemo } from 'react';
import { Button, Text, Tooltip, useDisclosure } from '@chakra-ui/react';
import { useCampaign } from '../contexts/CampaignContext';
import LexiconEntryModal from './LexiconEntryModal';
import { PublicLexiconEntry } from '../types/Campaign';
import { createHymmnosLexiconLookup, resolveHymmnosToken } from '../utils/hymmnosLexiconLookup';

interface HymmnosTextProps {
  children: string;
  showTranslation?: boolean;
  compact?: boolean;
}

const HymmnosText: React.FC<HymmnosTextProps> = ({ children, showTranslation = true, compact = false }) => {
  const { publicLexicon, unlockedLexicon } = useCampaign();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selected, setSelected] = React.useState<PublicLexiconEntry | null>(null);
  const lookup = useMemo(() => createHymmnosLexiconLookup(publicLexicon), [publicLexicon]);
  const parts = children.split(/([A-Za-z][A-Za-z0-9.'-]*)/g);

  return (
    <Text as="span" lineHeight="1.9">
      {parts.map((part, index) => {
        const { entry, visibleWord, trailingPunctuation } = resolveHymmnosToken(part, lookup);
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
              {visibleWord}
            </Button>
          </Tooltip>{trailingPunctuation}</React.Fragment>
        );
      })}
      {selected && <LexiconEntryModal entry={selected} isOpen={isOpen} onClose={onClose} />}
    </Text>
  );
};

export default HymmnosText;
