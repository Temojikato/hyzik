import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Flex,
  Image,
  SimpleGrid,
  Text,
  Spinner,
  Alert,
  AlertIcon,
  VStack,
  useToast,
  Tooltip,
  Badge,
  Input,
  FormControl,
  FormLabel,
  Select,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  ModalCloseButton,
} from '@chakra-ui/react';
import { collection, getDocs, doc, setDoc } from 'firebase/firestore';
import { auth, db, storage } from '../Firebase';
import { Reyvateil } from '../types/Reyvateils';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ref, getDownloadURL } from 'firebase/storage';
import { signOut } from 'firebase/auth';
import ReyvateilTest from './ReyvateilTest'; // Import the new component

const ReyvateilSelection: React.FC = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isImageSelectionOpen,
    onOpen: onImageSelectionOpen,
    onClose: onImageSelectionClose,
  } = useDisclosure();
  const [reyvateils, setReyvateils] = useState<Reyvateil[]>([]);
  const [selectedReyvateilId, setSelectedReyvateilId] = useState<string>('');
  const [selectedReyvateil, setSelectedReyvateil] = useState<Reyvateil | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [submissionLoading, setSubmissionLoading] = useState<boolean>(false);
  const [fetchError, setFetchError] = useState<string>('');
  const [submissionError, setSubmissionError] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [selectedImageUrl, setSelectedImageUrl] = useState<string>('');

  // New state for managing the steps
  const [step, setStep] = useState<'initial' | 'select' | 'test'>('initial');

  useEffect(() => {
    const fetchReyvateils = async () => {
      try {
        setLoading(true);
        const reyvateilsCol = collection(db, 'reyvateils');
        const reyvateilsSnapshot = await getDocs(reyvateilsCol);
        const reyvateilsList: Reyvateil[] = reyvateilsSnapshot.docs.map(
          (docSnap) => ({
            id: docSnap.id,
            ...docSnap.data(),
          })
        ) as Reyvateil[];

        const reyvateilsWithImages = await Promise.all(
          reyvateilsList.map(async (reyvateil) => {
            const folderRef = ref(storage, `reyvateils/imgs/${reyvateil.name}`);
            const images: string[] = [];
            let index = 1;

            while (true) {
              try {
                const imgUrl = await getDownloadURL(
                  ref(folderRef, `${reyvateil.name}${index}.png`)
                );
                images.push(imgUrl);
                index++;
              } catch (error) {
                break;
              }
            }

            return {
              ...reyvateil,
              images,
            };
          })
        );

        setReyvateils(reyvateilsWithImages);
      } catch (err) {
        console.error('Error fetching Reyvateils:', err);
        setFetchError('Failed to load Reyvateils. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchReyvateils();
  }, []);

  const handleCardClick = (reyvateilId: string) => {
    const selected = reyvateils.find((r) => r.id === reyvateilId) || null;
    setSelectedReyvateil(selected);
    setSelectedReyvateilId(reyvateilId);
    setSelectedImageUrl(selected?.images?.[0] || '');
    onOpen();
  };

  const handleSubmit = async () => {
    if (!currentUser) {
      setSubmissionError('User not authenticated.');
      return;
    }

    if (!selectedReyvateilId) {
      setSubmissionError('Please select a Reyvateil.');
      return;
    }

    setSubmissionLoading(true);
    setSubmissionError('');

    try {
      const selectedReyvateilData = reyvateils.find(
        (r) => r.id === selectedReyvateilId
      );
      if (!selectedReyvateilData) {
        setSubmissionError('Selected Reyvateil not found.');
        setSubmissionLoading(false);
        return;
      }

      const userRef = doc(db, 'users', currentUser.uid);
      await setDoc(
        userRef,
        {
          reyvateilId: selectedReyvateilId,
          reyvateilLevel: 1,
          reyvateilImageUrl:
            selectedImageUrl || selectedReyvateilData.images?.[0],
        },
        { merge: true }
      );

      toast({
        title: 'Reyvateil Selected',
        description: `You have successfully selected ${selectedReyvateilData.name}.`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      onClose();
      navigate('/');
    } catch (err) {
      console.error('Error selecting Reyvateil:', err);
      setSubmissionError('Failed to select Reyvateil. Please try again.');
    } finally {
      setSubmissionLoading(false);
    }
  };

  const handleImageClick = () => {
    onImageSelectionOpen();
  };

  const handleImageSelect = (imageUrl: string) => {
    setSelectedImageUrl(imageUrl);
    onImageSelectionClose();
  };

  const handleClassFilterChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedClass(e.target.value);
  };

  const filteredReyvateils = reyvateils.filter(
    (reyvateil) =>
      reyvateil.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedClass ? reyvateil.class === selectedClass : true)
  );

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (err) {
      console.error('Failed to log out', err);
    }
  };

  const handleTestAccept = async (
    reyvateil: Reyvateil,
    selectedImageUrl: string
  ) => {
    if (!currentUser) {
      setSubmissionError('User not authenticated.');
      return;
    }

    setSubmissionLoading(true);
    setSubmissionError('');

    try {
      const userRef = doc(db, 'users', currentUser.uid);
      await setDoc(
        userRef,
        {
          reyvateilId: reyvateil.id,
          reyvateilLevel: 1,
          reyvateilImageUrl: selectedImageUrl || reyvateil.images?.[0],
        },
        { merge: true }
      );

      toast({
        title: 'Reyvateil Selected',
        description: `You have successfully selected ${reyvateil.name}.`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      navigate('/');
    } catch (err) {
      console.error('Error selecting Reyvateil:', err);
      setSubmissionError('Failed to select Reyvateil. Please try again.');
    } finally {
      setSubmissionLoading(false);
    }
  };


  const handleTestSelectYourself = () => {
    setStep('select');
  };

  if (loading) {
    return (
      <Flex justify="center" align="center" height="60vh">
        <Spinner size="xl" color="purple.400" />
      </Flex>
    );
  }

  return (
    <Flex
      justify="center"
      align="center"
      minH="100vh"
      bgGradient="linear(to-br, gray.900, purple.900, black)"
      p={4}
    >
      <Box
        bg="gray.800"
        p={6}
        rounded="md"
        boxShadow="2xl"
        width={{ base: '100%', md: '80%', lg: '70%' }}
        maxW="1200px"
        border="1px solid"
        borderColor="purple.500"
      >
        <Button colorScheme="red" fontFamily="Hymmnos" onClick={handleLogout}>
          Log Out
        </Button>
        <VStack spacing={6} align="stretch">
          {step === 'initial' && (
            <>
              <Text
                fontSize="3xl"
                fontWeight="bold"
                textAlign="center"
                color="purple.300"
                textShadow="2px 2px 10px rgba(255, 0, 255, 0.8)"
                fontFamily="hymmnos"
              >
                Welcome! Choose an option:
              </Text>
              <Flex justify="center" mt={4}>
                <Button
                  colorScheme="purple"
                  mr={4}
                  onClick={() => setStep('test')}
                >
                  Take the Test
                </Button>
                <Button
                  colorScheme="purple"
                  onClick={() => setStep('select')}
                  disabled={true} //TODO: change this after start of campaign
                >
                  Choose Yourself
                </Button>
              </Flex>
            </>
          )}

          {step === 'test' && (
            <ReyvateilTest
              reyvateils={reyvateils}
              onAccept={handleTestAccept}
              onSelectYourself={handleTestSelectYourself}
            />
          )}

          {step === 'select' && (
            <>
              <Flex direction="row" align="center" justify="center">
                <Text
                  fontSize="3xl"
                  fontWeight="bold"
                  textAlign="center"
                  color="purple.300"
                  textShadow="2px 2px 10px rgba(255, 0, 255, 0.8)"
                >
                  Choose Your
                </Text>
                <Text
                  fontFamily="Hymmnos"
                  fontSize="3xl"
                  fontWeight="bold"
                  textAlign="center"
                  color="purple.300"
                  textShadow="2px 2px 10px rgba(255, 0, 255, 0.8)"
                >
                  ((Reyvateil))
                </Text>
              </Flex>

              <FormControl id="search" mb={4}>
                <FormLabel color="gray.200">Search Reyvateils</FormLabel>
                <Input
                  type="text"
                  placeholder="Search by name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  focusBorderColor="purple.400"
                  bg="gray.700"
                  color="gray.100"
                />
              </FormControl>

              <FormControl id="class" mb={4}>
                <FormLabel color="gray.200">Filter by Class</FormLabel>
                <Select
                  placeholder="All Classes"
                  value={selectedClass}
                  onChange={handleClassFilterChange}
                  focusBorderColor="purple.400"
                  bg="gray.700"
                  color="gray.100"
                >
                  {/* Add your class options here */}
                  <option value="Barbarian">Barbarian</option>
                  {/* ... other classes ... */}
                </Select>
              </FormControl>

              {filteredReyvateils.length > 0 ? (
                <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} spacing={6}>
                  {filteredReyvateils.map((reyvateil) => (
                    <Box
                      key={reyvateil.id}
                      bg={
                        selectedReyvateilId === reyvateil.id
                          ? 'purple.700'
                          : 'gray.700'
                      }
                      borderWidth={
                        selectedReyvateilId === reyvateil.id ? '2px' : '1px'
                      }
                      borderColor={
                        selectedReyvateilId === reyvateil.id
                          ? 'purple.500'
                          : 'gray.300'
                      }
                      borderRadius="md"
                      overflow="hidden"
                      cursor="pointer"
                      transition="transform 0.2s, box-shadow 0.2s, border-color 0.2s, background-color 0.2s"
                      _hover={{
                        transform: 'scale(1.05)',
                        boxShadow: '0 0 20px rgba(128, 90, 213, 0.8)',
                      }}
                      onClick={() => handleCardClick(reyvateil.id)}
                    >
                      {reyvateil.images && (
                        <Image
                          src={reyvateil.images[0]}
                          alt={reyvateil.name}
                          height="200px"
                          width="100%"
                          objectFit="cover"
                          loading="lazy"
                        />
                      )}

                      <Box p={4}>
                        <Flex align="center" justify="space-between">
                          <Flex direction="row" align="center">
                            <Text
                              fontSize="xl"
                              fontWeight="bold"
                              color="purple.400"
                            >
                              {reyvateil.name}
                            </Text>

                            <Text
                              fontSize="xl"
                              fontWeight="bold"
                              color="purple.400"
                              fontFamily="Hymmnos"
                              ml={2}
                            >
                              ( + {reyvateil.name} + )
                            </Text>
                          </Flex>
                          <Badge colorScheme="purple" variant="solid">
                            {reyvateil.class}
                          </Badge>
                        </Flex>
                        <Tooltip
                          label={reyvateil.features}
                          aria-label="Reyvateil Features"
                        >
                          <Text mt={2} fontSize="sm" color="gray.300" noOfLines={3}>
                            {reyvateil.features}
                          </Text>
                        </Tooltip>
                      </Box>
                    </Box>
                  ))}
                </SimpleGrid>
              ) : (
                <Text color="gray.300">No Reyvateils match your search.</Text>
              )}
            </>
          )}

          {/* Modals and other components remain the same */}
          <Modal
            isOpen={isImageSelectionOpen}
            onClose={onImageSelectionClose}
            size="lg"
            scrollBehavior="inside"
          >
            <ModalOverlay />
            <ModalContent bg="gray.800">
              <ModalHeader color="purple.300">Select an Image</ModalHeader>
              <ModalCloseButton color="gray.200" />
              <ModalBody
                maxHeight="90vh"
                overflowY="auto"
                onWheel={(e) => {
                  e.stopPropagation();
                }}
              >
                <VStack spacing={4}>
                  {selectedReyvateil?.images?.map((image) => (
                    <Box
                      key={image}
                      onClick={() => handleImageSelect(image)}
                      cursor="pointer"
                      _hover={{ boxShadow: '0 0 20px rgba(128, 90, 213, 0.5)' }}
                    >
                      <Image src={image} alt="Reyvateil Image Option" />
                    </Box>
                  ))}
                </VStack>
              </ModalBody>
            </ModalContent>
          </Modal>

          {selectedReyvateil && (
            <Modal
              isOpen={isOpen}
              onClose={() => {
                onClose();
                setSelectedReyvateilId('');
                setSelectedReyvateil(null);
                setSubmissionError('');
              }}
              size="6xl"
              isCentered
            >
              <ModalOverlay />
              <ModalContent bg="gray.800">
                <ModalHeader color="purple.300">
                  <Flex direction="row" align="center">
                    <Text fontSize="xl" fontWeight="bold" color="purple.400">
                      {selectedReyvateil.name}
                    </Text>

                    <Text
                      fontSize="xl"
                      fontWeight="bold"
                      color="purple.400"
                      fontFamily="Hymmnos"
                      ml={2}
                    >
                      ( + {selectedReyvateil.name} + )
                    </Text>
                  </Flex>
                </ModalHeader>
                <ModalCloseButton color="gray.200" />
                <ModalBody>
                  <Text fontSize="sm" fontWeight="bold" color="purple.400">
                    Select a form for your Reyvateil
                  </Text>
                  <Flex
                    direction={{ base: 'column', md: 'row' }}
                    align="center"
                  >
                    <Image
                      src={selectedImageUrl || selectedReyvateil.images?.[0]}
                      alt={selectedReyvateil.name}
                      boxSize="300px"
                      objectFit="cover"
                      borderRadius="md"
                      mr={{ base: 0, md: 4 }}
                      mb={{ base: 4, md: 0 }}
                      cursor="pointer"
                      onClick={handleImageClick}
                    />
                    <Box ml={4}>
                      <Flex direction="row" align="center">
                        <Text
                          fontFamily="Hymmnos"
                          fontSize="xl"
                          fontWeight="bold"
                          color="purple.400"
                        >
                          Class :
                        </Text>

                        <Text
                          fontSize="xl"
                          fontWeight="bold"
                          color="purple.400"
                          ml={2}
                        >
                          {selectedReyvateil.class}
                        </Text>
                      </Flex>
                      <Text mt={2} fontSize="md" color="gray.300">
                        {selectedReyvateil.features}
                      </Text>
                      <br />
                      <br />
                      <Text
                        fontFamily="Hymmnos"
                        fontSize="md"
                        color="purple.400"
                      >
                        Stats:
                      </Text>
                      {selectedReyvateil.stats ? (
                        <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={2}>
                          {Object.entries(selectedReyvateil.stats).map(
                            ([stat, value]) => (
                              <Text key={stat} color="gray.300">
                                {capitalizeFirstLetter(
                                  stat.replace(/([A-Z])/g, ' $1')
                                )}
                                : {value}
                              </Text>
                            )
                          )}
                        </SimpleGrid>
                      ) : (
                        <Alert status="error" borderRadius="md" mt={2}>
                          <AlertIcon />
                          Reyvateil stats are missing. Please contact support or
                          update the data.
                        </Alert>
                      )}
                    </Box>
                  </Flex>
                </ModalBody>
                <ModalFooter>
                  <Button
                    colorScheme="purple"
                    mr={3}
                    onClick={handleSubmit}
                    isLoading={submissionLoading}
                    isDisabled={submissionError !== ''}
                    fontFamily="Hymmnos"
                    fontSize="2xl"
                    boxShadow="0 0 20px rgba(128, 90, 213, 0.5)"
                    _hover={{
                      bgGradient: 'linear(to-r, purple.500, pink.500)',
                      boxShadow: '0 0 30px rgba(255, 20, 147, 0.8)',
                    }}
                  >
                    Submit
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      onClose();
                      setSelectedReyvateilId('');
                      setSelectedReyvateil(null);
                      setSubmissionError('');
                    }}
                    color="gray.200"
                  >
                    Cancel
                  </Button>
                </ModalFooter>
              </ModalContent>
            </Modal>
          )}
        </VStack>
      </Box>
    </Flex>
  );
};

const capitalizeFirstLetter = (str: string): string => {
  return str
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (char) => char.toUpperCase());
};

export default ReyvateilSelection;
