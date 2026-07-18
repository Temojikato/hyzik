import React, { useEffect, useState } from 'react';
import { Box } from '@chakra-ui/react';
import { useParams } from 'react-router-dom';
import { subscribeEncounter } from '../../services/campaignService';
import { Encounter } from '../../types/Campaign';

const BattleMapDisplay: React.FC = () => {
  const { encounterId = '' } = useParams();
  const [encounter, setEncounter] = useState<Encounter | null>(null);

  useEffect(() => {
    if (!encounterId) return undefined;
    return subscribeEncounter(encounterId, setEncounter, () => setEncounter(null));
  }, [encounterId]);

  const map = encounter?.map;
  return (
    <Box position="fixed" inset={0} overflow="hidden" bg="black" onDoubleClick={() => document.documentElement.requestFullscreen?.().catch(() => undefined)}>
      {map && <Box
        as="img"
        src={map.imageUrl}
        alt=""
        draggable={false}
        position="absolute"
        maxW="none"
        w={`${map.zoom * 100}%`}
        h={`${map.zoom * 100}%`}
        objectFit="cover"
        left={`${50 - map.focusX * map.zoom}%`}
        top={`${50 - map.focusY * map.zoom}%`}
        pointerEvents="none"
      />}
    </Box>
  );
};

export default BattleMapDisplay;
