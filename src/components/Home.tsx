// src/components/Home.tsx
import React, { useEffect, useState } from 'react';
import { doc, DocumentReference, getDoc, runTransaction } from 'firebase/firestore';
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
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import ReyvateilInfo from './ReyvateilInfo';
import { useNavigate } from 'react-router-dom';
import { useThemeContext } from '../contexts/ThemeContext';
import InventoryModal from './InventoryModal';
import FullScreenMapModal from './FullScreenMapModal';
import PlayerInfo from './PlayerInfo';
import FullScreenBestiaryModal from './FullScreenBestiaryModal';
import Header from './Header'; // Import the Header component

const Home: React.FC = () => {
  const { currentUser } = useAuth();
  const [reyvateil, setReyvateil] = useState<Reyvateil | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const { currentTheme } = useThemeContext();
  const [inventory, setInventory] = useState<Item[]>([]);
  const {
    isOpen,
    onOpen,
    onClose,
  } = useDisclosure(); // Controls for the inventory modal
  const {
    isOpen: isOpenMaps,
    onOpen: onOpenMaps,
    onClose: onCloseMaps,
  } = useDisclosure();
  const {
    isOpen: isOpenBestiary,
    onOpen: onOpenBestiary,
    onClose: onCloseBestiary,
  } = useDisclosure();
  const navigate = useNavigate();
  const [unlockedRecipes, setUnlockedRecipes] = useState<string[]>([]);
  const toast = useToast();

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

          setUnlockedRecipes(userData.unlockedRecipes || []);

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

  const handleRecipeUnlock = async (recipe: string): Promise<void> => {
    if (!currentUser || !reyvateil) {
      toast({
        title: 'Error',
        description: 'No user or Reyvateil found.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    const userRef = doc(db, 'users', currentUser.uid);
    try {
      await runTransaction(db, async (transaction) => {
        const userSnap = await transaction.get(userRef);
        if (!userSnap.exists()) {
          throw new Error('User data not found.');
        }

        const userData = userSnap.data();

        transaction.update(userRef, {
          unlockedRecipes: [...(userData.unlockedRecipes || []), recipe],
        });
      });

      setUnlockedRecipes([...unlockedRecipes, recipe]);

      toast({
        title: 'Success',
        description: `${recipe} recipe has been unlocked!`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error: any) {
      console.error('Transaction failed:', error);
      toast({
        title: 'Error',
        description: `Failed to unlock ritual. Please try again :: ${error.message}`,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
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
      {/* Header Component */}
      <Header
        onOpenBestiary={onOpenBestiary}
        onOpenMaps={onOpenMaps}
        onOpenInventory={onOpen}
        handleLogout={handleLogout}
      />

      {/* Rest of your components */}
      <ReyvateilInfo
        reyvateil={reyvateil}
        inventory={inventory}
        setInventory={setInventory}
      />
      <PlayerInfo />
      <InventoryModal
        isOpen={isOpen}
        onClose={onClose}
        inventory={inventory}
        setInventory={setInventory}
        currentUser={currentUser}
        reyvateil={reyvateil}
        unlockedRecipes={unlockedRecipes}
        setUnlockedRecipes={handleRecipeUnlock}
      />
      <FullScreenMapModal isOpen={isOpenMaps} onClose={onCloseMaps} />
      <FullScreenBestiaryModal isOpen={isOpenBestiary} onClose={onCloseBestiary} />
    </Box>
  );
};

export default Home;
