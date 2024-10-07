// src/components/Home.tsx
import React, { useEffect, useState } from 'react';
import { doc, DocumentReference, getDoc } from 'firebase/firestore';
import { db } from '../Firebase';
import { useAuth } from '../contexts/AuthContext';
import { Reyvateil, Item } from '../types/Reyvateils';
import { signOut } from 'firebase/auth';
import { auth } from '../Firebase';
import {
  Spinner,
  Flex,
  Alert,
  AlertIcon,
  Box,
  Button,
  Heading,
  useDisclosure,
} from '@chakra-ui/react';
import ReyvateilInfo from './ReyvateilInfo';
import { useNavigate } from 'react-router-dom';
import { useThemeContext } from '../contexts/ThemeContext';
import InventoryModal from './InventoryModal';
import PlayerInfo from './PlayerInfo';

const Home: React.FC = () => {
  const { currentUser } = useAuth();
  const [reyvateil, setReyvateil] = useState<Reyvateil | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const { currentTheme } = useThemeContext();
  const [inventory, setInventory] = useState<Item[]>([]);
  const { isOpen, onOpen, onClose } = useDisclosure(); // Controls for the inventory modal
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      if (currentUser) {
        setLoading(true);
        try {
          const userRef = doc(db, 'users', currentUser.uid);
          const userSnap = await getDoc(userRef);

          if (!userSnap.exists()) {
            setError('User data not found.');
            setLoading(false);
            return;
          }

          const userData = userSnap.data();
          if (!userData.reyvateilId) {
            setError('No Reyvateil selected.');
            setLoading(false);
            navigate('/select-reyvateil'); // Use navigate instead of window.location
            return;
          }

          const reyvateilRef = doc(db, 'reyvateils', userData.reyvateilId);
          const reyvateilSnap = await getDoc(reyvateilRef);
          if (!reyvateilSnap.exists()) {
            setError('Reyvateil data not found.');
            setLoading(false);
            return;
          }

          const reyvateilData = reyvateilSnap.data();
          setReyvateil({
            id: reyvateilSnap.id,
            name: reyvateilData.name,
            class: reyvateilData.class,
            image: reyvateilData.image,
            features: reyvateilData.features,
            stats: reyvateilData.stats,
            abilities: reyvateilData.abilities,
            levelUpRequirements: reyvateilData.levelUpRequirements,
            evolutionOptions: reyvateilData.evolutionOptions,
          });

          if (userData.inventory) {
            const inventoryItems = await Promise.all(
              userData.inventory.map(async (itemData: { reference: DocumentReference; quantity: number }) => {
                try {
                  if (!(itemData.reference instanceof DocumentReference)) {
                    console.error('Invalid reference, expected DocumentReference:', itemData.reference);
                    return null; // Skip this item as its reference is invalid
                  }
                  const itemSnap = await getDoc(itemData.reference);
                  if (itemSnap.exists()) {
                    const itemDetails = itemSnap.data();
                    return {
                      id: itemSnap.id,
                      name: itemDetails.name,
                      description: itemDetails.description,
                      quantity: itemData.quantity,
                    };
                  }
                  return null;
                } catch (error) {
                  console.error('Error fetching item data:', error);
                  return null; // handle error, maybe incorrect path or reference issues
                }
              })
            );
            setInventory(inventoryItems.filter((item): item is Item => item !== null));
          }
        } catch (err) {
          console.error('Error fetching user data:', err);
          setError('Failed to fetch user data.');
        } finally {
          setLoading(false);
        }
      }
    };

    fetchUserData();
  }, [currentUser, navigate]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (err) {
      console.error('Failed to log out', err);
    }
  };

  if (loading) {
    return (
      <Flex justify="center" align="center" height="100vh">
        <Spinner size="xl" />
      </Flex>
    );
  }

  if (error) {
    return (
      <Flex justify="center" align="center" height="100vh">
        <Alert status="error" borderRadius="md">
          <AlertIcon />
          {error}
        </Alert>
      </Flex>
    );
  }

  return (
    <Box p={4} bg="background">
      <Flex justify="space-between" align="center" mb={4}>
        <Heading as="h1" fontSize="4xl" fontWeight="bold" fontFamily="Hymmnos" color="textHeader">
          Hyzik
        </Heading>
        <Flex>
          <Button colorScheme="blue" fontFamily="Hymmnos" onClick={onOpen} mr={2}>
            Open Inventory
          </Button>
          <Button colorScheme="red" fontFamily="Hymmnos" onClick={handleLogout}>
            Log Out
          </Button>
        </Flex>
      </Flex>
      <ReyvateilInfo reyvateil={reyvateil} inventory={inventory} setInventory={setInventory} />
      <PlayerInfo />
      <InventoryModal
        isOpen={isOpen}
        onClose={onClose}
        inventory={inventory}
        setInventory={setInventory}
        currentUser={currentUser}
        reyvateil={reyvateil}
      />
    </Box>
  );
};

export default Home;
