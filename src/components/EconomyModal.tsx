import React, { useMemo, useState } from 'react';
import {
  Badge, Box, Button, Divider, FormControl, FormLabel, Grid, HStack, Input, Modal, ModalBody,
  ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Progress, Select, SimpleGrid, Tab, TabList,
  TabPanel, TabPanels, Tabs, Text, useToast, VStack,
} from '@chakra-ui/react';
import { useAuth } from '../contexts/AuthContext';
import { purchaseCityItem } from '../services/campaignService';
import { Item } from '../types/Reyvateils';
import { ECONOMY_FACTIONS, factionPrice, itemEconomy, REPUTATION_TIERS, reputationTier } from '../utils/economy';
import { useBackDismiss } from '../contexts/BackNavigationContext';

const rarityRequirement: Record<string, number> = { common: 0, uncommon: 0, rare: 25, epic: 60, legendary: 120, artifact: Number.POSITIVE_INFINITY };

interface EconomyModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: Item[];
  setInventory: React.Dispatch<React.SetStateAction<Item[]>>;
}

const EconomyModal: React.FC<EconomyModalProps> = ({ isOpen, onClose, items, setInventory }) => {
  useBackDismiss(isOpen, onClose);
  const { profile } = useAuth();
  const toast = useToast();
  const [factionId, setFactionId] = useState(ECONOMY_FACTIONS[0].id);
  const [vendorName, setVendorName] = useState(ECONOMY_FACTIONS[0].vendors[0]);
  const [search, setSearch] = useState('');
  const [buying, setBuying] = useState('');
  const economy = profile?.economy;
  const reputation = economy?.reputation?.[factionId] || 0;
  const faction = ECONOMY_FACTIONS.find((entry) => entry.id === factionId) || ECONOMY_FACTIONS[0];
  const stock = useMemo(() => items
    .filter((item) => item.name !== 'Gold Coin' && item.category !== 'Currency')
    .filter((item) => itemEconomy(item).preferredFactionIds.includes(factionId))
    .filter((item) => `${item.name} ${item.category}`.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => factionPrice(a, reputation).price - factionPrice(b, reputation).price)
    .slice(0, 80), [items, factionId, reputation, search]);

  const buy = async (item: Item) => {
    setBuying(item.id);
    try {
      const result = await purchaseCityItem(item.id, factionId, vendorName, 1);
      setInventory((current) => {
        const existing = current.find((entry) => entry.id === item.id);
        return existing
          ? current.map((entry) => entry.id === item.id ? { ...entry, quantity: Number(entry.quantity || 0) + 1 } : entry)
          : [...current, { ...item, quantity: 1 }];
      });
      toast({ title: `${item.name} acquired`, description: `${result.totalPrice} Favor paid to ${vendorName}.`, status: 'success', duration: 5000, isClosable: true });
    } catch (caught: any) {
      toast({ title: 'Trade refused', description: caught?.message || String(caught), status: 'error', duration: 7000, isClosable: true });
    } finally { setBuying(''); }
  };

  return <Modal isOpen={isOpen} onClose={onClose} size="6xl" isCentered scrollBehavior="inside">
    <ModalOverlay />
    <ModalContent bg="surface" color="text" maxH="88vh">
      <ModalHeader><HStack justify="space-between" pr={10}><Text>City Exchange</Text><Badge colorScheme="purple" fontSize="md">{economy?.favor || 0} Favor</Badge></HStack></ModalHeader>
      <ModalCloseButton />
      <ModalBody pb={6}>
        <Tabs isLazy variant="enclosed">
          <TabList><Tab>Trade</Tab><Tab>Faction reputation</Tab></TabList>
          <TabPanels>
            <TabPanel px={0}>
              <Grid templateColumns={{ base: '1fr', lg: '290px minmax(0,1fr)' }} gap={5}>
                <VStack align="stretch" spacing={4}>
                  <FormControl><FormLabel>Faction</FormLabel><Select value={factionId} onChange={(event) => { const next = ECONOMY_FACTIONS.find((entry) => entry.id === event.target.value) || ECONOMY_FACTIONS[0]; setFactionId(next.id); setVendorName(next.vendors[0]); }}>{ECONOMY_FACTIONS.map((entry) => <option key={entry.id} value={entry.id}>{entry.name}</option>)}</Select></FormControl>
                  <FormControl><FormLabel>Vendor</FormLabel><Select value={vendorName} onChange={(event) => setVendorName(event.target.value)}>{faction.vendors.map((vendor) => <option key={vendor}>{vendor}</option>)}</Select></FormControl>
                  <Box p={4} bg="surfaceRaised" borderRadius="md"><Text fontWeight="bold">{faction.name}</Text><Text fontSize="sm" opacity={.76}>{faction.summary}</Text><Divider my={3} /><Text fontSize="sm">Reputation: <strong>{reputation}</strong> · {reputationTier(reputation).name}</Text><Text fontSize="sm">Price reduction: {reputationTier(reputation).discountPercent}%</Text></Box>
                  <Text fontSize="sm" opacity={.72}>Favor is party-city credit you may spend. Reputation is permanent and only controls trust, discounts, and rare stock access.</Text>
                </VStack>
                <VStack align="stretch" spacing={3}>
                  <Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search this faction's stock…" />
                  {stock.map((item) => {
                    const quote = factionPrice(item, reputation);
                    const required = rarityRequirement[quote.rarity] ?? 0;
                    const locked = reputation < required || !Number.isFinite(required);
                    const unaffordable = (economy?.favor || 0) < quote.price;
                    return <HStack key={item.id} p={3} border="1px solid" borderColor="border" borderRadius="md" align="center">
                      <Box flex="1"><HStack><Text fontWeight="bold">{item.name}</Text><Badge textTransform="uppercase">{quote.rarity}</Badge></HStack><Text fontSize="sm" opacity={.72}>{item.category}</Text>{locked && <Text fontSize="xs" color="orange.300">{Number.isFinite(required) ? `Requires ${required} reputation` : 'Artifacts are never ordinary vendor stock'}</Text>}</Box>
                      <Text fontWeight="bold" whiteSpace="nowrap">{quote.price} Favor</Text>
                      <Button size="sm" onClick={() => buy(item)} isLoading={buying === item.id} isDisabled={locked || unaffordable || Boolean(buying)}>Buy</Button>
                    </HStack>;
                  })}
                  {!stock.length && <Text p={6} textAlign="center" opacity={.72}>No stock matches this search.</Text>}
                </VStack>
              </Grid>
            </TabPanel>
            <TabPanel px={0}>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                {ECONOMY_FACTIONS.map((entry) => {
                  const score = economy?.reputation?.[entry.id] || 0;
                  const tier = reputationTier(score);
                  const next = REPUTATION_TIERS.find((candidate) => candidate.minimum > score);
                  const start = tier.minimum;
                  const progress = next ? ((score - start) / Math.max(1, next.minimum - start)) * 100 : 100;
                  const contributions = economy?.factionContributions?.[entry.id];
                  return <Box key={entry.id} p={4} border="1px solid" borderColor="border" borderRadius="lg">
                    <HStack justify="space-between"><Text fontWeight="bold">{entry.name}</Text><Badge colorScheme="purple">{tier.name}</Badge></HStack>
                    <Text mt={1} fontSize="sm" opacity={.7}>{score} reputation · {tier.discountPercent}% vendor discount</Text>
                    <Progress mt={3} value={progress} colorScheme="purple" borderRadius="full" />
                    <HStack mt={3} fontSize="sm" justify="space-between"><Text>{contributions?.items || 0} items donated</Text><Text>{contributions?.favor || 0} Favor generated</Text></HStack>
                  </Box>;
                })}
              </SimpleGrid>
              <SimpleGrid columns={{ base: 2, md: 4 }} spacing={3} mt={5}>
                <Box p={3} bg="surfaceRaised" borderRadius="md"><Text fontSize="xs" opacity={.68}>AVAILABLE FAVOR</Text><Text fontSize="xl" fontWeight="bold">{economy?.favor || 0}</Text></Box>
                <Box p={3} bg="surfaceRaised" borderRadius="md"><Text fontSize="xs" opacity={.68}>LIFETIME EARNED</Text><Text fontSize="xl" fontWeight="bold">{economy?.lifetimeFavorEarned || 0}</Text></Box>
                <Box p={3} bg="surfaceRaised" borderRadius="md"><Text fontSize="xs" opacity={.68}>LIFETIME SPENT</Text><Text fontSize="xl" fontWeight="bold">{economy?.lifetimeFavorSpent || 0}</Text></Box>
                <Box p={3} bg="surfaceRaised" borderRadius="md"><Text fontSize="xs" opacity={.68}>ITEMS DONATED</Text><Text fontSize="xl" fontWeight="bold">{economy?.donatedItemCount || 0}</Text></Box>
              </SimpleGrid>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </ModalBody>
    </ModalContent>
  </Modal>;
};

export default EconomyModal;
