import React, { useEffect, useState } from 'react';
import { Badge, Box, Button, Flex, Grid, Heading, HStack, Image, SimpleGrid, Spinner, Text, VStack } from '@chakra-ui/react';
import { doc, DocumentReference, getDoc } from 'firebase/firestore';
import { Link, useParams } from 'react-router-dom';
import { FaArrowLeft, FaEye } from 'react-icons/fa6';
import { db } from '../Firebase';
import { PlayerProfile } from '../types/Campaign';
import { Item, Reyvateil } from '../types/Reyvateils';
import Panel from './ui/Panel';

const AdminPlayerPreview: React.FC = () => {
  const { playerId = '' } = useParams();
  const [profile, setProfile] = useState<PlayerProfile | null>(null);
  const [reyvateil, setReyvateil] = useState<Reyvateil | null>(null);
  const [inventory, setInventory] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const userSnapshot = await getDoc(doc(db, 'users', playerId));
      if (!userSnapshot.exists()) { setLoading(false); return; }
      const data = { id: userSnapshot.id, ...userSnapshot.data() } as PlayerProfile;
      setProfile(data);
      if (data.reyvateilId) {
        const snapshot = await getDoc(doc(db, 'reyvateils', data.reyvateilId));
        if (snapshot.exists()) setReyvateil({ id: snapshot.id, ...snapshot.data() } as Reyvateil);
      }
      const itemRows = await Promise.all(((data.inventory || []) as Array<{ reference?: DocumentReference; quantity?: number }>).map(async (row) => {
        if (!row.reference) return null;
        const snapshot = await getDoc(row.reference);
        return snapshot.exists() ? ({ id: snapshot.id, ...snapshot.data(), quantity: row.quantity || 1 } as Item) : null;
      }));
      setInventory(itemRows.filter(Boolean) as Item[]);
      setLoading(false);
    };
    void load();
  }, [playerId]);

  if (loading) return <Flex minH="100vh" align="center" justify="center"><Spinner size="xl" /></Flex>;
  if (!profile) return <Flex p={8} direction="column" gap={4}><Text>Player not found.</Text><Button as={Link} to="/admin">Back</Button></Flex>;

  return (
    <Box minH="100vh" p={{ base: 3, md: 6 }}>
      <Flex maxW="1500px" mx="auto" direction="column" gap={5}>
        <Flex justify="space-between" align="center" gap={3} flexWrap="wrap">
          <Button as={Link} to="/admin" leftIcon={<FaArrowLeft />} variant="outline">Admin portal</Button>
          <Badge colorScheme="cyan" px={3} py={2} borderRadius="full"><HStack><FaEye /><Text>View-only player portal</Text></HStack></Badge>
        </Flex>
        <Panel p={{ base: 5, md: 7 }} overflow="hidden" position="relative">
          <Grid templateColumns={{ base: '1fr', md: '180px 1fr' }} gap={6} alignItems="center">
            <Image src={profile.reyvateilImageUrl || reyvateil?.image} alt={reyvateil?.name || 'Reyvateil'} w="180px" h="180px" objectFit="cover" borderRadius="2xl" fallback={<Box w="180px" h="180px" bg="whiteAlpha.100" borderRadius="2xl" />} />
            <Box><Text color="textMuted" fontSize="sm">{profile.displayName || profile.email || profile.id}</Text><Heading mt={1}>{reyvateil?.name || profile.reyvateilName || 'No Reyvateil selected'}</Heading><HStack mt={3} flexWrap="wrap"><Badge colorScheme="purple">Level {profile.level || 1}</Badge>{reyvateil?.class && <Badge colorScheme="cyan">{reyvateil.class}</Badge>}<Badge>{profile.unlockedCyphers?.length || 0} Cyphers</Badge></HStack><Text mt={4} color="textMuted">{reyvateil?.features}</Text></Box>
          </Grid>
        </Panel>
        <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={5}>
          <Panel p={5}><Heading size="md" mb={4}>Player state</Heading><SimpleGrid columns={2} spacing={3}>{Object.entries(profile.stats || {}).map(([name, value]) => <Box key={name} p={3} bg="whiteAlpha.50" borderRadius="xl"><Text fontSize="xs" color="textMuted" textTransform="uppercase">{name}</Text><Text fontSize="2xl" fontWeight="bold">{value}</Text></Box>)}</SimpleGrid>{!Object.keys(profile.stats || {}).length && <Text color="textMuted">No standalone player stats recorded.</Text>}<Heading size="sm" mt={5} mb={3}>Conditions</Heading><HStack flexWrap="wrap">{profile.conditions?.length ? profile.conditions.map((condition, index) => { const label = typeof condition === 'string' ? condition : `${condition.name}${condition.amount !== undefined ? ` · ${condition.amount}` : ''}`; return <Badge key={`${label}-${index}`} colorScheme="red" px={3} py={1}>{label}</Badge>; }) : <Badge colorScheme="green">No active conditions</Badge>}</HStack></Panel>
          <Panel p={5}><Heading size="md" mb={4}>Reyvateil abilities</Heading><VStack align="stretch">{reyvateil?.abilities?.map((ability) => <Box key={ability.name} p={3} bg="whiteAlpha.50" borderRadius="xl"><Text fontWeight="bold">{ability.name}</Text><Text fontSize="sm" color="textMuted" noOfLines={2}>{ability.description}</Text><Badge mt={2}>{ability.cooldown}s cooldown</Badge></Box>) || <Text color="textMuted">No abilities loaded.</Text>}</VStack></Panel>
          <Panel p={5} gridColumn={{ lg: '1 / -1' }}><Heading size="md" mb={4}>Inventory</Heading><SimpleGrid columns={{ base: 1, md: 2, xl: 4 }} spacing={3}>{inventory.length ? inventory.map((item) => <Box key={item.id} p={3} bg="whiteAlpha.50" borderRadius="xl"><Flex justify="space-between"><Text fontWeight="bold">{item.name}</Text><Badge>{item.quantity || 1}</Badge></Flex><Text color="textMuted" fontSize="sm" noOfLines={2}>{item.description}</Text></Box>) : <Text color="textMuted">Inventory is empty.</Text>}</SimpleGrid></Panel>
        </SimpleGrid>
      </Flex>
    </Box>
  );
};

export default AdminPlayerPreview;
