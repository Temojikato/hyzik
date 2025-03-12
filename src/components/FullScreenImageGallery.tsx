// src/components/FullScreenImageGallery.tsx
import React, { useEffect } from 'react';
import { Box, IconButton } from '@chakra-ui/react';
import { FaTimes } from 'react-icons/fa';
import { Swiper, SwiperSlide } from 'swiper/react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import 'swiper/css';
import NPCImage from './NPCImage';
import { NPCImageFile } from '../types/ResidentCodexTypes';

interface FullScreenImageGalleryProps {
  isOpen: boolean;
  onClose: () => void;
  npcName: string;
  imageFiles: NPCImageFile[];
  initialIndex?: number;
  locked?: boolean;
}

const FullScreenImageGallery: React.FC<FullScreenImageGalleryProps> = ({
  isOpen,
  onClose,
  npcName,
  imageFiles,
  initialIndex = 0,
  locked = false,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <Box
      position="fixed"
      top="0"
      left="0"
      width="100vw"
      height="100vh"
      bg="black"
      zIndex={10000}
      onClick={onClose}  // Clicking background closes
      overflow="hidden"
    >
      {/* Close Button */}
      <IconButton
        icon={<FaTimes />}
        aria-label="Close Gallery"
        position="absolute"
        top="20px"
        right="20px"
        zIndex={10001}
        onClick={onClose}
      />

      <Swiper
        spaceBetween={0}
        slidesPerView={1}
        initialSlide={initialIndex}
        style={{ width: '100%', height: '100%' }}
      >
        {imageFiles.map((imgObj, idx) => {
          // Here, if images is an array of NPCImageFile objects, convert them to URLs
          // However, if you prefer to use NPCImage, pass the entire array as before.
          // We'll assume you're using NPCImage as before:
          return (
            <SwiperSlide key={idx}>
              <Box
                width="100%"
                height="100%"
                display="flex"
                alignItems="center"
                justifyContent="center"
                onClick={(e) => e.stopPropagation()}
              >
                <TransformWrapper /* ... zoom/pan props ... */>
                  <TransformComponent
                    wrapperStyle={{ width: '100%', height: '100%' }}
                    contentStyle={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <NPCImage
                      npcName={npcName}
                      imageFiles={imageFiles} // you'll pass the full imageFiles array from NPC
                      locked={locked}
                      boxSize="100%"
                      currentIndex={idx}
                    />
                  </TransformComponent>
                </TransformWrapper>
              </Box>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </Box>
  );
};

export default FullScreenImageGallery;
