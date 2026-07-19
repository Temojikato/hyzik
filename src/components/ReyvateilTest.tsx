import React, { useState } from 'react';
import {
  Alert,
  AlertIcon,
  Badge,
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Progress,
  SimpleGrid,
  Stack,
  Text,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import { useBackDismiss } from '../contexts/BackNavigationContext';
import {
  ResonanceQuestion,
  ResonanceResult,
  resonanceQuestions,
  resonanceTraitLabels,
  resolveReyvateilResonance,
} from '../data/reyvateilResonanceQuiz';
import { Reyvateil } from '../types/Reyvateils';

interface ReyvateilTestProps {
  reyvateils: Reyvateil[];
  onAccept: (reyvateil: Reyvateil, selectedImageUrl: string) => void;
  onSelectYourself: () => void;
}

const shuffle = <T,>(values: readonly T[]): T[] => {
  const result = [...values];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const target = Math.floor(Math.random() * (index + 1));
    [result[index], result[target]] = [result[target], result[index]];
  }
  return result;
};

const createQuizRun = (): ResonanceQuestion[] => resonanceQuestions.map((question) => ({
  ...question,
  choices: shuffle(question.choices),
}));

const formatLabel = (value: string) => value
  .replace(/([A-Z])/g, ' $1')
  .replace(/^./, (character) => character.toUpperCase());

const ReyvateilTest: React.FC<ReyvateilTestProps> = ({ reyvateils, onAccept, onSelectYourself }) => {
  const [questions, setQuestions] = useState<ResonanceQuestion[]>(createQuizRun);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [result, setResult] = useState<ResonanceResult | null>(null);
  const [selectedImageUrl, setSelectedImageUrl] = useState('');
  const {
    isOpen: isImageSelectionOpen,
    onOpen: onImageSelectionOpen,
    onClose: onImageSelectionClose,
  } = useDisclosure();
  useBackDismiss(isImageSelectionOpen, onImageSelectionClose);

  const answerQuestion = (answerId: string) => {
    const updatedAnswers = [...answers];
    updatedAnswers[currentQuestionIndex] = answerId;
    setAnswers(updatedAnswers);
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((current) => current + 1);
      return;
    }
    setResult(resolveReyvateilResonance(updatedAnswers, reyvateils.map((reyvateil) => reyvateil.id)));
  };

  const retry = () => {
    setQuestions(createQuizRun());
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setResult(null);
    setSelectedImageUrl('');
  };

  const selectImage = (imageUrl: string) => {
    setSelectedImageUrl(imageUrl);
    onImageSelectionClose();
  };

  if (!result) {
    const currentQuestion = questions[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
    return (
      <Box>
        <Flex justify="space-between" align="end" gap={4} mb={2}>
          <Box>
            <Text color="purple.300" fontSize="xs" fontWeight="bold" letterSpacing="0.2em">REYVATEIL RESONANCE TRIAL</Text>
            <Heading size="md" mt={1}>{currentQuestion.title}</Heading>
          </Box>
          <Text color="gray.400" fontSize="sm" whiteSpace="nowrap">{currentQuestionIndex + 1} / {questions.length}</Text>
        </Flex>
        <Progress value={progress} colorScheme="purple" size="sm" borderRadius="full" mb={6} bg="gray.700" />

        {currentQuestionIndex === 0 && (
          <Box bg="blackAlpha.300" border="1px solid" borderColor="purple.700" borderRadius="lg" p={4} mb={6}>
            <Text color="gray.300" fontSize="sm">
              The trial is not asking which answer is good. There are no clean answers here. Choose the consequence you could carry after every easier option has already failed.
            </Text>
          </Box>
        )}

        <Text fontSize={{ base: 'lg', md: 'xl' }} color="gray.100" lineHeight="1.65" mb={7}>
          {currentQuestion.question}
        </Text>

        <Stack spacing={3}>
          {currentQuestion.choices.map((entry) => (
            <Button
              key={entry.id}
              onClick={() => answerQuestion(entry.id)}
              h="auto"
              minH="64px"
              justifyContent="flex-start"
              textAlign="left"
              whiteSpace="normal"
              lineHeight="1.45"
              px={{ base: 4, md: 5 }}
              py={4}
              bg={answers[currentQuestionIndex] === entry.id ? 'purple.700' : 'gray.700'}
              color="gray.100"
              border="1px solid"
              borderColor={answers[currentQuestionIndex] === entry.id ? 'purple.300' : 'gray.600'}
              _hover={{ bg: 'purple.800', borderColor: 'purple.400' }}
              _active={{ bg: 'purple.700' }}
            >
              {entry.text}
            </Button>
          ))}
        </Stack>

        <Flex justify="space-between" align="center" mt={6} gap={4}>
          <Button
            variant="ghost"
            colorScheme="purple"
            onClick={() => setCurrentQuestionIndex((current) => Math.max(0, current - 1))}
            isDisabled={currentQuestionIndex === 0}
          >
            Previous choice
          </Button>
          <Text color="gray.500" fontSize="xs" textAlign="right">Answers are scored as a pattern, never as a single moral verdict.</Text>
        </Flex>
      </Box>
    );
  }

  const selectedReyvateil = reyvateils.find((reyvateil) => reyvateil.id === result.profile.id);
  if (!selectedReyvateil) {
    return (
      <Alert status="error" borderRadius="lg">
        <AlertIcon />
        Your resonance was found, but its Reyvateil record is unavailable. Retry the trial or contact the campaign administrator.
      </Alert>
    );
  }

  const visibleImage = selectedImageUrl || selectedReyvateil.images?.[0] || selectedReyvateil.image;
  return (
    <Box>
      <VStack spacing={4} textAlign="center" mb={7}>
        <Badge colorScheme="purple" px={3} py={1} borderRadius="full" letterSpacing="0.12em">RESONANCE FOUND</Badge>
        <Heading size="xl" color="purple.200">{result.profile.specialtyTitle}</Heading>
        <Text color="gray.300" maxW="760px">
          Your answers did not describe a hero or a villain. They described what you preserve, what you spend, and what you become when every harmless choice is gone.
        </Text>
      </VStack>

      <Box bg="blackAlpha.300" border="1px solid" borderColor="purple.700" borderRadius="xl" p={{ base: 4, md: 6 }} mb={7}>
        <Text color="gray.400" fontSize="xs" fontWeight="bold" letterSpacing="0.16em" mb={3}>THE PATTERN YOUR CHOICES RETURNED TO</Text>
        <Stack spacing={2}>
          {result.topTraits.map((trait) => (
            <HStack key={trait} align="start">
              <Text color="purple.300">◆</Text>
              <Text color="gray.200">{resonanceTraitLabels[trait]}</Text>
            </HStack>
          ))}
        </Stack>
        <Text color="gray.500" fontSize="xs" mt={4}>These are pressures in your answers, not virtues assigned to you.</Text>
      </Box>

      <Flex direction={{ base: 'column', md: 'row' }} align="center" justify="center" gap={6}>
        {visibleImage && (
          <Image
            src={visibleImage}
            alt={selectedReyvateil.name}
            boxSize={{ base: '240px', md: '300px' }}
            objectFit="cover"
            borderRadius="xl"
            border="2px solid"
            borderColor="purple.500"
            cursor={selectedReyvateil.images?.length ? 'pointer' : 'default'}
            onClick={selectedReyvateil.images?.length ? onImageSelectionOpen : undefined}
          />
        )}
        <Box flex="1" maxW="560px">
          <Text color="purple.300" fontSize="sm" fontWeight="bold" letterSpacing="0.14em">YOUR REYVATEIL</Text>
          <Heading size="lg" mt={1}>{selectedReyvateil.name}</Heading>
          <Text color="gray.300" mt={2}>{selectedReyvateil.features}</Text>
          <HStack mt={4} flexWrap="wrap">
            <Badge colorScheme="purple">{result.profile.specialtyTitle}</Badge>
            <Badge colorScheme="blue">{formatLabel(result.profile.role)}</Badge>
          </HStack>
          {selectedReyvateil.combat?.aptitudes ? (
            <SimpleGrid columns={{ base: 2, sm: 3 }} spacing={2} mt={5}>
              {Object.entries(selectedReyvateil.combat.aptitudes).map(([stat, value]) => (
                <Box key={stat} bg="gray.700" borderRadius="md" px={3} py={2}>
                  <Text color="gray.400" fontSize="xs">{formatLabel(stat)}</Text>
                  <Text color="gray.100" fontWeight="bold">{value}</Text>
                </Box>
              ))}
            </SimpleGrid>
          ) : (
            <Alert status="error" borderRadius="md" mt={4}><AlertIcon />Combat identity data is missing.</Alert>
          )}
        </Box>
      </Flex>

      <Flex justify="center" mt={8} gap={3} flexWrap="wrap">
        <Button colorScheme="purple" onClick={() => onAccept(selectedReyvateil, selectedImageUrl)}>Accept this resonance</Button>
        <Button colorScheme="purple" variant="outline" onClick={retry}>Retake the trial</Button>
        <Button variant="ghost" colorScheme="purple" onClick={onSelectYourself}>Choose directly</Button>
      </Flex>

      <Modal isOpen={isImageSelectionOpen} onClose={onImageSelectionClose} size="lg" scrollBehavior="inside">
        <ModalOverlay />
        <ModalContent bg="gray.800">
          <ModalHeader color="purple.300">Choose this Reyvateil's form</ModalHeader>
          <ModalCloseButton color="gray.200" />
          <ModalBody maxHeight="90vh" overflowY="auto" onWheel={(event) => event.stopPropagation()}>
            <VStack spacing={4} pb={4}>
              {selectedReyvateil.images?.map((image) => (
                <Box
                  key={image}
                  onClick={() => selectImage(image)}
                  cursor="pointer"
                  border="2px solid"
                  borderColor={(selectedImageUrl || selectedReyvateil.images?.[0]) === image ? 'purple.400' : 'transparent'}
                  borderRadius="xl"
                  overflow="hidden"
                  _hover={{ boxShadow: '0 0 20px rgba(128, 90, 213, 0.5)' }}
                >
                  <Image src={image} alt={`${selectedReyvateil.name} form`} />
                </Box>
              ))}
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default ReyvateilTest;
