// src/components/LootTroveModal.tsx

import React, { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  VStack,
  Button,
  useToast
} from "@chakra-ui/react";
import lootTroveData from "../dataSets/lootTroves.json";
import { rollLootSource } from "../services/campaignService";
import { User } from "firebase/auth";
import { Item } from "../types/Reyvateils";
import { useBackDismiss } from "../contexts/BackNavigationContext";

// Interfaces matching our JSON structure:
export interface Tier {
  id: string;
  name: string;
  description: string;
  loot: { itemName: string; itemChance: number; quantity?: string; rarity?: string }[];
  image: string;
  maxAmountOfItems: number;
}

export interface LootCategory {
  category: string;
  tiers: Tier[];
}

interface LootTroveModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User | null;
  inventory: Item[];
  setInventory: React.Dispatch<React.SetStateAction<Item[]>>;
}

const LootTroveModal: React.FC<LootTroveModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  inventory,
  setInventory
}) => {
  useBackDismiss(isOpen, onClose);
  const toast = useToast();
  const categories: LootCategory[] = lootTroveData.categories;
  const [selectedCategory, setSelectedCategory] = useState<LootCategory | null>(null);
  const [rolling, setRolling] = useState(false);

  const handleTierClick = async (tier: Tier) => {
    if (!selectedCategory || !currentUser) return;
    setRolling(true);
    try {
      const result = await rollLootSource({ sourceKind: 'trove', categoryId: selectedCategory.category, tierId: tier.id });
      toast({ title: result.jackpot ? 'Jackpot found' : 'Trove opened', description: `${result.count} reward${result.count === 1 ? '' : 's'} sent to your discoveries.`, status: result.jackpot ? 'success' : 'info', duration: 5000, isClosable: true });
    } catch (caught: any) {
      toast({ title: 'Could not open trove', description: caught?.message || String(caught), status: 'error', duration: 7000, isClosable: true });
    } finally {
      setRolling(false);
    }
    setSelectedCategory(null);
    onClose();
  };

  const handleCategoryClick = (category: LootCategory) => {
    setSelectedCategory(category);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        setSelectedCategory(null);
        onClose();
      }}
      size="md"
      isCentered
    >
      <ModalOverlay />
      <ModalContent bg="surface" color="text">
        <ModalHeader color="textHeader">Loot Troves</ModalHeader>
        <ModalCloseButton color="text" onClick={() => setSelectedCategory(null)} />
        <ModalBody>
          {selectedCategory ? (
            <VStack spacing={4}>
              <Button
                onClick={() => setSelectedCategory(null)}
                colorScheme="gray"
                width="100%"
              >
                Back to Categories
              </Button>
              {selectedCategory.tiers.map((tier) => (
                <Button
                  key={tier.id}
                  onClick={() => handleTierClick(tier)}
                  isLoading={rolling}
                  isDisabled={rolling}
                  width="100%"
                  colorScheme="purple"
                >
                  {tier.name}
                </Button>
              ))}
            </VStack>
          ) : (
            <VStack spacing={4}>
              {categories.map((category) => (
                <Button
                  key={category.category}
                  onClick={() => handleCategoryClick(category)}
                  width="100%"
                  colorScheme="purple"
                >
                  {category.category}
                </Button>
              ))}
            </VStack>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default LootTroveModal;
