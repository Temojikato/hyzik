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
import { rollLoot, addLootToInventory, RolledLoot } from "../utils/lootLogic";
import { User } from "firebase/auth";
import { Item } from "../types/Reyvateils";

// Interfaces matching our JSON structure:
export interface Tier {
  id: string;
  name: string;
  description: string;
  loot: { itemName: string; itemChance: number; quantity?: string }[];
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

/**
 * Returns a number between 1 and maxItems.
 * Always returns at least 1.
 * For each potential additional item (from 2 to maxItems), there is a 1 in maxItems chance to stop.
 */
function determineLootCount(maxItems: number): number {
  let count = 1;
  for (let i = 2; i <= maxItems; i++) {
    if (Math.random() < 1 / maxItems) {
      break;
    }
    count++;
  }
  console.log(count);
  return count;
}

const LootTroveModal: React.FC<LootTroveModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  inventory,
  setInventory
}) => {
  const toast = useToast();
  const categories: LootCategory[] = lootTroveData.categories;
  const [selectedCategory, setSelectedCategory] = useState<LootCategory | null>(null);

  const handleTierClick = async (tier: Tier) => {
    // Determine how many loot rolls we get from this tier.
    const lootRollCount = determineLootCount(tier.maxAmountOfItems);
    let combinedLoot: RolledLoot[] = [];
    for (let i = 0; i < lootRollCount; i++) {
      // rollLoot returns an array of RolledLoot for one roll.
      combinedLoot.push(...rollLoot(tier.loot));
    }

    // Add the combined loot to the user's inventory.
    try {
      console.log(combinedLoot)
      await addLootToInventory(combinedLoot, currentUser!, toast, setInventory, inventory);
    } catch (error) {
      // (Error handling is done within addLootToInventory.)
      console.error("Error adding loot:", error);
    }
    // Reset and close.
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
      <ModalContent bg="secondary">
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
