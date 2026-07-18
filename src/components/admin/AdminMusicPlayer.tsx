import React, { useMemo, useRef, useState } from 'react';
import { Box, Flex, HStack, IconButton, Slider, SliderFilledTrack, SliderThumb, SliderTrack, Text } from '@chakra-ui/react';
import { FaPause, FaPlay, FaVolumeHigh } from 'react-icons/fa6';
import { CampaignSong } from '../../types/Campaign';
import { getYouTubeVideoId } from '../../utils/youtube';

const AdminMusicPlayer: React.FC<{ song: CampaignSong | null }> = ({ song }) => {
  const frameRef = useRef<HTMLIFrameElement>(null);
  const [playing, setPlaying] = useState(true);
  const [volume, setVolume] = useState(70);
  const videoId = getYouTubeVideoId(song?.youtubeUrl);
  const source = useMemo(() => videoId ? `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&enablejsapi=1&rel=0` : '', [videoId]);
  const command = (func: string, args: unknown[] = []) => frameRef.current?.contentWindow?.postMessage(JSON.stringify({ event: 'command', func, args }), '*');
  const toggle = () => {
    const next = !playing;
    setPlaying(next);
    command(next ? 'playVideo' : 'pauseVideo');
  };
  const changeVolume = (next: number) => {
    setVolume(next);
    command('setVolume', [next]);
  };

  return (
    <Box bg="#111722" border="1px solid" borderColor="#2c3648" borderRadius="16px" p={3} boxShadow="0 14px 35px rgba(0,0,0,.28)">
      <Flex align="center" gap={3}>
        <IconButton aria-label={playing ? 'Pause music' : 'Play music'} icon={playing ? <FaPause /> : <FaPlay />} onClick={toggle} isDisabled={!source} bg="#8b5cf6" _hover={{ bg: '#7c3aed' }} color="white" />
        <Box minW={0} flex="1"><Text fontSize="10px" textTransform="uppercase" letterSpacing=".16em" color="#8f9bb0">Now playing</Text><Text fontWeight="700" noOfLines={1}>{song?.title || 'No campaign track selected'}</Text></Box>
        <HStack w={{ base: '110px', md: '190px' }}><FaVolumeHigh color="#8f9bb0" /><Slider aria-label="Music volume" value={volume} onChange={changeVolume}><SliderTrack bg="#273142"><SliderFilledTrack bg="#8b5cf6" /></SliderTrack><SliderThumb /></Slider></HStack>
      </Flex>
      {source && <Box position="absolute" w="1px" h="1px" overflow="hidden" opacity={0} pointerEvents="none"><iframe ref={frameRef} title="Persistent campaign music" src={source} allow="autoplay; encrypted-media" /></Box>}
    </Box>
  );
};

export default AdminMusicPlayer;
