// src/components/Header.tsx
import React from 'react';
import {
  Flex,
  Heading,
  Button,
  useDisclosure,
  Stack,
  Box,
  Drawer,
  DrawerBody,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Text,
  Badge,
  HStack,
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCampaign } from '../contexts/CampaignContext';
import { useBackDismiss } from '../contexts/BackNavigationContext';

interface HeaderProps {
  onOpenBestiary: () => void;
  onOpenMaps: () => void;
  onOpenInventory: () => void;
  onOpenNPC: () => void;
  onOpenTranslator: () => void;
  handleLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({
  onOpenBestiary,
  onOpenMaps,
  onOpenInventory,
  onOpenNPC,
  onOpenTranslator,
  handleLogout,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  useBackDismiss(isOpen, onClose);
  const { isAdmin, currentUser, profile } = useAuth();
  const { currentSong, timersRunning } = useCampaign();

  const actions = [
    { label: 'Resident Codex', colorScheme: 'gray', variant: 'outline', onClick: onOpenNPC },
    { label: 'Open Bestiary', colorScheme: 'red', variant: 'outline', onClick: onOpenBestiary },
    { label: 'Open Maps', colorScheme: 'green', variant: 'outline', onClick: onOpenMaps },
    { label: 'Open Inventory', colorScheme: 'blue', variant: 'outline', onClick: onOpenInventory },
    { label: 'Translator', colorScheme: 'purple', variant: 'solid', onClick: onOpenTranslator },
  ];

  return (
    <Flex justify="space-between" align="center" mb={5} gap={4} p={{ base: 3, md: 4 }} bg="rgba(10,14,23,.84)" border="1px solid" borderColor="border" borderRadius="panel" backdropFilter="blur(12px)" position="sticky" top={3} zIndex={1000} boxShadow="panel">
      <Box minW={0}>
       <Heading
        as="h1"
        fontSize={{ base: '2xl', md: '3xl' }}
        fontWeight="bold"
        fontFamily="Hymmnos"
        color="textHeader"
      >
        HYZIK
      </Heading>
       <Text fontSize="sm" fontWeight="semibold" color="textHeader" noOfLines={1}>{profile?.displayName || currentUser?.displayName || 'Unnamed Diver'}</Text>
       <Text fontSize="10px" color="textMuted" noOfLines={1}>{currentUser?.uid}</Text>
       <Badge mt={1} colorScheme={timersRunning ? 'green' : 'gray'}>{timersRunning ? 'Session active' : 'Timers paused'}</Badge>
       <HStack spacing={2} display={{ base: 'none', xl: 'flex' }}><Badge colorScheme="purple">Tower link</Badge>{currentSong?.lines[0]?.hymmnos ? <><Text fontSize="xs" color="textMuted">Receiving:</Text><Text fontFamily="Hymmnos" fontSize="sm" color="textHeader" noOfLines={1}>{currentSong.lines[0].hymmnos}</Text></> : <Text fontSize="xs" color="textMuted">Awaiting song telemetry</Text>}</HStack>
      </Box>

      {/* Mobile Hamburger Menu */}
      <Box display={{ base: 'block', lg: 'none' }}>
        <Button
          colorScheme="blue"
          variant="outline"
          fontFamily="Hymmnos"
          onClick={onOpen}
        >Functions</Button>
          <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
            <DrawerOverlay />
            <DrawerContent>
              <DrawerCloseButton />
              <DrawerBody>
                <Stack spacing={3} mt={10}>
                  {actions.map((action) => <Button key={action.label} colorScheme={action.colorScheme} variant={action.variant} fontFamily="Hymmnos" justifyContent="flex-start" onClick={() => { action.onClick(); onClose(); }}>{action.label}</Button>)}
                  {isAdmin && <Button as={Link} to="/admin" colorScheme="orange" variant="outline" fontFamily="Hymmnos" justifyContent="flex-start" onClick={onClose}>Admin Portal</Button>}
                  <Button
                    colorScheme="red"
                    fontFamily="Hymmnos"
                    onClick={() => {
                      handleLogout();
                      onClose();
                    }}
                  >
                    Log Out
                  </Button>
                </Stack>
              </DrawerBody>
            </DrawerContent>
          </Drawer>
      </Box>

      {/* Desktop Buttons */}
      <Flex display={{ base: 'none', lg: 'flex' }} gap={2} align="center" justify="flex-end" flexWrap="wrap">
        {actions.map((action) => <Button key={action.label} colorScheme={action.colorScheme} variant={action.variant} fontFamily="Hymmnos" onClick={action.onClick} size={{ lg: 'sm', '2xl': 'md' }}>{action.label}</Button>)}
        {isAdmin && <Button as={Link} to="/admin" colorScheme="orange" variant="outline" fontFamily="Hymmnos" size={{ lg: 'sm', '2xl': 'md' }}>Admin Portal</Button>}
        <Button colorScheme="red" fontFamily="Hymmnos" onClick={handleLogout} size={{ lg: 'sm', '2xl': 'md' }}>Log Out</Button>
      </Flex>
    </Flex>
  );
};

export default Header;
