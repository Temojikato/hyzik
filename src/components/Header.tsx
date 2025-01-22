// src/components/Header.tsx
import React from 'react';
import {
  Flex,
  Heading,
  Button,
  IconButton,
  useDisclosure,
  Stack,
  Box,
  Drawer,
  DrawerBody,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
} from '@chakra-ui/react';

interface HeaderProps {
  onOpenBestiary: () => void;
  onOpenMaps: () => void;
  onOpenInventory: () => void;
  handleLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({
  onOpenBestiary,
  onOpenMaps,
  onOpenInventory,
  handleLogout,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Flex justify="space-between" align="center" mb={4}>
      <Heading
        as="h1"
        fontSize="4xl"
        fontWeight="bold"
        fontFamily="Hymmnos"
        color="textHeader"
      >
        Hyzik
      </Heading>

      {/* Mobile Hamburger Menu */}
      <Box display={{ base: 'block', md: 'none' }}>
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
                <Stack spacing={4} mt={10}>
                  <Button
                    colorScheme="red"
                    variant="outline"
                    fontFamily="Hymmnos"
                    onClick={() => {
                      onOpenBestiary();
                      onClose();
                    }}
                  >
                    Open Bestiary
                  </Button>
                  <Button
                    colorScheme="green"
                    variant="outline"
                    fontFamily="Hymmnos"
                    onClick={() => {
                      onOpenMaps();
                      onClose();
                    }}
                  >
                    Open Maps
                  </Button>
                  <Button
                    colorScheme="blue"
                    variant="outline"
                    fontFamily="Hymmnos"
                    onClick={() => {
                      onOpenInventory();
                      onClose();
                    }}
                  >
                    Open Inventory
                  </Button>
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
      <Flex display={{ base: 'none', md: 'flex' }}>
        <Button
          colorScheme="red"
          variant="outline"
          fontFamily="Hymmnos"
          onClick={onOpenBestiary}
          mr={2}
        >
          Open Bestiary
        </Button>
        <Button
          colorScheme="green"
          variant="outline"
          fontFamily="Hymmnos"
          onClick={onOpenMaps}
          mr={2}
        >
          Open Maps
        </Button>
        <Button
          colorScheme="blue"
          variant="outline"
          fontFamily="Hymmnos"
          onClick={onOpenInventory}
          mr={2}
        >
          Open Inventory
        </Button>
        <Button
          colorScheme="red"
          fontFamily="Hymmnos"
          onClick={handleLogout}
        >
          Log Out
        </Button>
      </Flex>
    </Flex>
  );
};

export default Header;
