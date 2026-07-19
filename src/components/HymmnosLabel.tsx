import React, { useMemo } from 'react';
import { Box, BoxProps, Text, TextProps } from '@chakra-ui/react';
import { useCampaign } from '../contexts/CampaignContext';
import { HymmnosInterfacePhrase } from '../data/hymmnosInterface';
import { PublicLexiconEntry } from '../types/Campaign';
import HymmnosText from './HymmnosText';
import { createHymmnosLexiconLookup, hymmnosTokens, resolveHymmnosToken } from '../utils/hymmnosLexiconLookup';

interface HymmnosLabelProps extends Omit<BoxProps, 'children'> {
  phrase: HymmnosInterfacePhrase;
  interactive?: boolean;
  showTranslation?: boolean;
  scriptProps?: TextProps;
  translationProps?: TextProps;
}

const HymmnosLabel: React.FC<HymmnosLabelProps> = ({
  phrase,
  interactive = true,
  showTranslation = true,
  scriptProps,
  translationProps,
  ...boxProps
}) => {
  const { publicLexicon, unlockedLexicon } = useCampaign();
  const entries = useMemo(() => {
    const lookup = createHymmnosLexiconLookup(publicLexicon);
    return hymmnosTokens(phrase.hymmnos)
      .map((word) => resolveHymmnosToken(word, lookup).entry)
      .filter((entry): entry is PublicLexiconEntry => Boolean(entry));
  }, [phrase.hymmnos, publicLexicon]);
  const meanings = entries.map((entry) => unlockedLexicon.get(entry.id)?.meaning);
  const knownWords = meanings.filter(Boolean).length;
  const translated = entries.length === 0 || knownWords === entries.length;

  return (
    <Box {...boxProps}>
      {interactive ? (
        <Box fontFamily="Hymmnos" color="textHeader" {...scriptProps}>
          <HymmnosText compact showTranslation={false}>{phrase.hymmnos}</HymmnosText>
        </Box>
      ) : (
        <Text fontFamily="Hymmnos" color="textHeader" lineHeight="1.15" {...scriptProps}>{phrase.hymmnos}</Text>
      )}
      {showTranslation && (
        <Text mt={0.5} fontSize="xs" lineHeight="1.2" color={translated || knownWords ? 'teal.200' : 'textMuted'} aria-label={translated ? phrase.translation : 'Partially deciphered translation'} {...translationProps}>
          {translated ? phrase.translation : meanings.map((meaning, index) => (
            <React.Fragment key={`${entries[index]?.id || 'unknown'}-${index}`}>
              {index > 0 && <Text as="span" opacity={0.55}> · </Text>}
              <Text as="span" opacity={meaning ? 1 : 0.55}>{meaning || '•••'}</Text>
            </React.Fragment>
          ))}
        </Text>
      )}
    </Box>
  );
};

export default HymmnosLabel;
