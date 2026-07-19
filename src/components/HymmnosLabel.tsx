import React, { useMemo } from 'react';
import { Box, BoxProps, Text, TextProps } from '@chakra-ui/react';
import { useCampaign } from '../contexts/CampaignContext';
import { HymmnosInterfacePhrase } from '../data/hymmnosInterface';
import { PublicLexiconEntry } from '../types/Campaign';
import HymmnosText from './HymmnosText';

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
    const lookup = new Map(publicLexicon.map((entry) => [entry.headword.toLowerCase(), entry]));
    return (phrase.hymmnos.match(/[A-Za-z][A-Za-z0-9.'-]*/g) || [])
      .map((word) => lookup.get(word.toLowerCase()))
      .filter((entry): entry is PublicLexiconEntry => Boolean(entry));
  }, [phrase.hymmnos, publicLexicon]);
  const translated = entries.length === 0 || entries.every((entry) => unlockedLexicon.has(entry.id));

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
        <Text mt={0.5} fontSize="xs" lineHeight="1.2" color={translated ? 'teal.200' : 'purple.200'} {...translationProps}>
          {translated ? phrase.translation : 'Translation locked by Cypher'}
        </Text>
      )}
    </Box>
  );
};

export default HymmnosLabel;
