// src/components/Home.tsx
import React, { useEffect, useMemo, useState } from 'react';
import { doc, getDoc, getDocFromServer, runTransaction, DocumentReference } from 'firebase/firestore';
import { db, auth } from '../Firebase';
import { functions } from '../Firebase';
import { useAuth } from '../contexts/AuthContext';
import { Reyvateil, Item } from '../types/Reyvateils';
import { signOut } from 'firebase/auth';
import {
  Spinner,
  Flex,
  Alert,
  AlertIcon,
  Box,
  Button,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import ReyvateilInfo from './ReyvateilInfo';
import { useNavigate } from 'react-router-dom';
import InventoryModal from './InventoryModal';
import FullScreenMapModal from './FullScreenMapModal';
import FullScreenBestiaryModal from './FullScreenBestiaryModal';
import FullScreenNPCModal from './FullScreenNPCModal'; // Import the NPC modal component
import Header from './Header'; // Import the Header component
import PlayerInfo from './PlayerInfo';
import TranslatorModal from './TranslatorModal';
import CombatHome from './CombatHome';
import { useCampaign } from '../contexts/CampaignContext';
import combatCatalogJson from '../generated/reyvateilCombatCatalog.json';
import { ReyvateilCombatProfile } from '../types/Reyvateils';
import { httpsCallable } from 'firebase/functions';

const combatCatalog = combatCatalogJson as Record<string, ReyvateilCombatProfile>;

const Home: React.FC = () => {
  const { currentUser, profile } = useAuth();
  const { campaignState } = useCampaign();
  const [profileMode, setProfileMode] = useState<'social' | 'combat'>('social');
  const [combatSyncRequested, setCombatSyncRequested] = useState(false);
  const [reyvateil, setReyvateil] = useState<Reyvateil | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [inventory, setInventory] = useState<Item[]>([]);
  const {
    isOpen,
    onOpen,
    onClose,
  } = useDisclosure(); // Inventory modal controls
  const {
    isOpen: isOpenMaps,
    onOpen: onOpenMaps,
    onClose: onCloseMaps,
  } = useDisclosure();
  const {
    isOpen: isOpenTranslator,
    onOpen: onOpenTranslator,
    onClose: onCloseTranslator,
  } = useDisclosure();
  const {
    isOpen: isOpenBestiary,
    onOpen: onOpenBestiary,
    onClose: onCloseBestiary,
  } = useDisclosure();
  // New useDisclosure for the NPC modal (Resident Codex)
  const {
    isOpen: isOpenNPC,
    onOpen: onOpenNPC,
    onClose: onCloseNPC,
  } = useDisclosure();

  const navigate = useNavigate();
  const [unlockedRecipes, setUnlockedRecipes] = useState<string[]>([]);
  const toast = useToast();

  useEffect(() => {
    setProfileMode(campaignState.battleActive ? 'combat' : 'social');
  }, [campaignState.battleActive]);

  useEffect(() => {
    if (!currentUser || !profile?.reyvateilId || profile.combatProfile || combatSyncRequested) return;
    setCombatSyncRequested(true);
    void httpsCallable<undefined, { initialized: boolean; specialtyTitle?: string }>(functions, 'ensureCombatProfile')()
      .then((result) => {
        if (result.data.initialized) toast({ title: 'Combat profile awakened', description: `${result.data.specialtyTitle || 'Your Reyvateil'} is ready. Your existing social abilities were preserved.`, status: 'success' });
      })
      .catch((caught: any) => toast({ title: 'Combat profile is still synchronizing', description: caught?.message || String(caught), status: 'warning', duration: 7000 }));
  }, [combatSyncRequested, currentUser, profile?.combatProfile, profile?.reyvateilId, toast]);

  useEffect(() => {
    const fetchUserData = async () => {
      if (currentUser) {
        setLoading(true);
        try {
          const userRef = doc(db, 'users', currentUser.uid);
          // Reyvateil selection is written by a callable function through the
          // Admin SDK. A normal getDoc may briefly serve the pre-selection cache
          // and incorrectly restart onboarding, so routing must use server truth.
          const userSnap = await getDocFromServer(userRef);

          if (!userSnap.exists()) {
            setError('User data not found.');
            setLoading(false);
            return;
          }

          const userData = userSnap.data();
          if (!userData.reyvateilId) {
            setError('No Reyvateil selected.');
            setLoading(false);
            navigate('/select-reyvateil', { replace: true });
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
          const registeredCombat = reyvateilData.combat as ReyvateilCombatProfile | undefined;
          const bundledCombat = combatCatalog[reyvateilSnap.id];
          // Catalog rollouts must not strand existing Firestore Reyvateils. Until
          // the admin runs the persistence sync, use the bundled canonical
          // profile whenever the registered copy predates combat Songs.
          const currentCombat = Array.isArray(registeredCombat?.combatSongs)
            ? registeredCombat
            : bundledCombat || registeredCombat;
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
            combat: currentCombat,
          });

          if (userData.inventory) {
            const inventoryItems = await Promise.all(
              userData.inventory.map(async (itemData: { reference: DocumentReference; quantity: number }) => {
                try {
                  if (!(itemData.reference instanceof DocumentReference)) {
                    console.error('Invalid reference, expected DocumentReference:', itemData.reference);
                    return null;
                  }
                  const itemSnap = await getDoc(itemData.reference);
                  if (itemSnap.exists()) {
                    const itemDetails = itemSnap.data();
                    return {
                      id: itemSnap.id,
                      name: itemDetails.name,
                      description: itemDetails.description,
                      quantity: itemData.quantity,
                      category: itemDetails.category
                    };
                  }
                  return null;
                } catch (error) {
                  console.error('Error fetching item data:', error);
                  return null;
                }
              })
            );
            
            setInventory(inventoryItems);
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

  const socialReyvateil = useMemo(() => {
    if (!reyvateil) return null;
    const pool = reyvateil.combat?.socialAbilities || reyvateil.abilities;
    const inherited = new Set(profile?.combatProfile?.inheritedSocialAbilityIds || []);
    return { ...reyvateil, abilities: inherited.size ? pool.filter((ability) => ability.id && inherited.has(ability.id)) : reyvateil.abilities };
  }, [profile?.combatProfile?.inheritedSocialAbilityIds, reyvateil]);

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
    <Box minH="100vh" p={{ base: 3, md: 5 }} bg="background">
      <Box maxW="1600px" mx="auto">
      {/* Header Component with an added NPC button */}
      <Header
        onOpenBestiary={onOpenBestiary}
        onOpenMaps={onOpenMaps}
        onOpenInventory={onOpen}
        onOpenNPC={onOpenNPC} // Pass the onOpen function for NPC modal
        onOpenTranslator={onOpenTranslator}
        handleLogout={handleLogout}
      />

      <Flex mt={4} p={1} bg="blackAlpha.400" borderRadius="xl" w="fit-content" border="1px solid" borderColor="whiteAlpha.300">
        <Button variant={profileMode === 'social' ? 'solid' : 'ghost'} onClick={() => setProfileMode('social')}>Social profile</Button>
        <Button ml={1} variant={profileMode === 'combat' ? 'solid' : 'ghost'} onClick={() => setProfileMode('combat')}>
          Combat profile{campaignState.battleActive ? ' · LIVE' : ''}
        </Button>
      </Flex>
      {profileMode === 'combat' && reyvateil && profile ? <CombatHome reyvateil={reyvateil} profile={profile} /> : <>
        {socialReyvateil && <ReyvateilInfo reyvateil={socialReyvateil} inventory={inventory} setInventory={setInventory} />}
        <PlayerInfo />
      </>}
      </Box>
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
      <FullScreenMapModal
        inventory={inventory}
        setInventory={setInventory}
        currentUser={currentUser}
        isOpen={isOpenMaps}
        onClose={onCloseMaps}
      />
      <FullScreenBestiaryModal
        inventory={inventory}
        setInventory={setInventory}
        currentUser={currentUser}
        isOpen={isOpenBestiary}
        onClose={onCloseBestiary}
      />
      <FullScreenNPCModal
        isOpen={isOpenNPC}
        onClose={onCloseNPC}
        currentUser={currentUser}
      />
      <TranslatorModal isOpen={isOpenTranslator} onClose={onCloseTranslator} />
    </Box>
  );
};

export default Home;
