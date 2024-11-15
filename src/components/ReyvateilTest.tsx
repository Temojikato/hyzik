import React, { useState } from 'react';
import {
  Text,
  RadioGroup,
  Radio,
  Stack,
  Button,
  Flex,
  Image,
  Box,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  useDisclosure,
  ModalCloseButton,
  SimpleGrid,
  Alert,
  AlertIcon,
  VStack,
} from '@chakra-ui/react';
import { Reyvateil } from '../types/Reyvateils';
import quizDataJson from '../quizData.json';

// Define the OptionKey type
type OptionKey = 'A' | 'B' | 'C' | 'D';
// Define the option keys for class-specific quizzes
type ClassSpecificOptionKey = 'A' | 'B' | 'C';

// Define the structure of quiz options
type ClassSpecificQuizOption = {
  [key in ClassSpecificOptionKey]: string;
}

// Define the structure of quiz questions
interface ClassSpecificQuizQuestion {
  question: string;
  options: ClassSpecificQuizOption;
}

// Define the mapping from scores to Reyvateils
interface ReyvateilMapping {
  scoreRange: string;
  reyvateil: string;
  description: string;
}

// Define the overall structure of a class-specific quiz
interface ClassSpecificQuiz {
  title: string;
  introduction: string;
  questions: ClassSpecificQuizQuestion[];
  scoring: { [key in ClassSpecificOptionKey]: number };
  reyvateilMapping: ReyvateilMapping[];
}


// Define interfaces for the quiz data
type QuizOption = {
  [key in OptionKey]: string;
};

interface QuizQuestion {
  number: number;
  question: string;
  options: QuizOption;
}

interface ClassMapping {
  scoreRange: string;
  class: string;
  description: string;
}

type Scoring = {
  [key in OptionKey]: number;
};

interface QuizData {
  quiz: {
    title: string;
    questions: QuizQuestion[];
    scoring: Scoring;
    classMapping: ClassMapping[];
  };
}

// Cast the imported JSON to QuizData
const quizData: QuizData = quizDataJson;

// Map class names to their specific quizzes
const classSpecificQuizzes: { [key: string]: () => Promise<any> } = {
  'Artificer': () => import('../artificerQuiz.json'),
  'Barbarian': () => import('../barbarianQuiz.json'),
  'Bard': () => import('../bardQuiz.json'),
  'Bloodhunter': () => import('../bloodhunterQuiz.json'),
  'Cleric': () => import('../clericQuiz.json'),
  'Druid': () => import('../druidQuiz.json'),
  'Fighter': () => import('../fighterQuiz.json'),
  'Monk': () => import('../monkQuiz.json'),
  'Paladin': () => import('../paladinQuiz.json'),
  'Ranger': () => import('../rangerQuiz.json'),
  'Rogue': () => import('../rogueQuiz.json'),
  'Sorcerer': () => import('../sorcererQuiz.json'),
  'Warlock': () => import('../warlockQuiz.json'),
  'Wizard': () => import('../wizardQuiz.json'),
};


interface ReyvateilTestProps {
  reyvateils: Reyvateil[];
  onAccept: (reyvateil: Reyvateil, selectedImageUrl: string) => void;
  onSelectYourself: () => void;
}

const ReyvateilTest: React.FC<ReyvateilTestProps> = ({
  reyvateils,
  onAccept,
  onSelectYourself,
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<OptionKey[]>([]);
  const [testResult, setTestResult] = useState<{
    className: string;
    description: string;
    totalScore: number;
  } | null>(null);
  const [selectedImageUrl, setSelectedImageUrl] = useState<string>('');
  const {
    isOpen: isImageSelectionOpen,
    onOpen: onImageSelectionOpen,
    onClose: onImageSelectionClose,
  } = useDisclosure();

  // New state variables
  const [quizStage, setQuizStage] = useState<'initial' | 'classSpecific' | 'result'>('initial');
  const [classSpecificQuiz, setClassSpecificQuiz] = useState<ClassSpecificQuiz | null>(null);
  const [classSpecificAnswers, setClassSpecificAnswers] = useState<ClassSpecificOptionKey[]>([]);
  const [finalResult, setFinalResult] = useState<{
    reyvateil: string;
    description: string;
    totalScore: number;
  } | null>(null);

  const questions = quizData.quiz.questions;

  const handleTestAnswer = (answer: OptionKey) => {
    const updatedAnswers = [...answers];
    updatedAnswers[currentQuestionIndex] = answer;
    setAnswers(updatedAnswers);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Test completed, compute the result
      computeTestResult(updatedAnswers);
    }
  };

  const computeTestResult = async (answersArray: OptionKey[]) => {
    let totalScore = 0;

    // Calculate total score based on the user's answers
    for (let i = 0; i < questions.length; i++) {
      const answer = answersArray[i];
      if (!answer) continue;
      const score = quizData.quiz.scoring[answer];
      totalScore += score;
    }

    // Determine the class based on the total score
    const classInfo = quizData.quiz.classMapping.find((mapping) => {
      const [min, max] = mapping.scoreRange.split(' - ').map(Number);
      return totalScore >= min && totalScore <= max;
    });

    if (classInfo) {
      setTestResult({
        className: classInfo.class,
        description: classInfo.description,
        totalScore,
      });

      // Dynamically load the class-specific quiz
      const loadQuiz = classSpecificQuizzes[classInfo.class];
      if (loadQuiz) {
        const module = await loadQuiz();
        const specificQuiz = module.default as ClassSpecificQuiz;
        setClassSpecificQuiz(specificQuiz);
        setQuizStage('classSpecific');
        setCurrentQuestionIndex(0);
        setClassSpecificAnswers([]); // Reset answers for the class-specific quiz
      } else {
        // Handle case where there is no class-specific quiz
        setQuizStage('result');
      }
    } else {
      // Handle cases where the score doesn't match any class
      setTestResult({
        className: 'Unknown',
        description: 'Unable to determine your class.',
        totalScore,
      });
      setQuizStage('result');
    }
  };


  const handleClassSpecificAnswer = (answer: ClassSpecificOptionKey) => {
    const updatedAnswers = [...classSpecificAnswers];
    updatedAnswers[currentQuestionIndex] = answer;
    setClassSpecificAnswers(updatedAnswers);

    if (currentQuestionIndex < classSpecificQuiz!!.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Class-specific quiz completed, compute the result
      computeClassSpecificResult(updatedAnswers);
    }
  };

  const computeClassSpecificResult = (answersArray: ClassSpecificOptionKey[]) => {
    let totalScore = 0;

    // Calculate total score based on the user's answers
    for (let i = 0; i < classSpecificQuiz!!.questions.length; i++) {
      const answer = answersArray[i];
      if (!answer) continue;
      const score = classSpecificQuiz!!.scoring[answer];
      totalScore += score;
    }

    // Determine the Reyvateil companion based on the total score
    const mapping = classSpecificQuiz!!.reyvateilMapping.find((mapping: any) => {
      const [min, max] = mapping.scoreRange.split(' - ').map(Number);
      return totalScore >= min && totalScore <= max;
    });

    if (mapping) {
      setFinalResult({
        reyvateil: mapping.reyvateil,
        description: mapping.description,
        totalScore,
      });
      setQuizStage('result');
    } else {
      // Handle cases where the score doesn't match any mapping
      setFinalResult({
        reyvateil: 'Unknown',
        description: 'Unable to determine your Reyvateil companion.',
        totalScore,
      });
      setQuizStage('result');
    }
  };

  const handleRetry = () => {
    // Reset the test state
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setTestResult(null);
    setSelectedImageUrl('');
    setQuizStage('initial');
    setClassSpecificQuiz(null);
    setClassSpecificAnswers([]);
    setFinalResult(null);
  };

  const handleImageClick = () => {
    onImageSelectionOpen();
  };

  const handleImageSelect = (imageUrl: string) => {
    setSelectedImageUrl(imageUrl);
    onImageSelectionClose();
  };

  if (quizStage === 'initial') {
    // Render the initial quiz
    return (
      <>
        {/* ... existing code for rendering the initial quiz */}
        <Text
          fontSize="xl"
          fontWeight="bold"
          textAlign="center"
          color="purple.300"
          mb={4}
        >
          Question {currentQuestionIndex + 1} of {questions.length}
        </Text>
        <Text fontSize="lg" color="gray.200" textAlign="center" mb={6}>
          {questions[currentQuestionIndex].question}
        </Text>
        <RadioGroup
          key={currentQuestionIndex}
          onChange={(value) => handleTestAnswer(value as OptionKey)}
          value={answers[currentQuestionIndex] || ''}
        >
          <Stack spacing={4} align="center">
            {Object.entries(questions[currentQuestionIndex].options).map(
              ([optionKey, optionValue]) => (
                <Radio
                  key={optionKey}
                  value={optionKey}
                  size="lg"
                  colorScheme="purple"
                >
                  <Text color="gray.200">{optionValue}</Text>
                </Radio>
              )
            )}
          </Stack>
        </RadioGroup>
      </>
    );
  } else if (quizStage === 'classSpecific' && classSpecificQuiz) {
    // Render the class-specific quiz
    const currentQuestion = classSpecificQuiz.questions[currentQuestionIndex];
    return (
      <>
        <Text
          fontSize="xl"
          fontWeight="bold"
          textAlign="center"
          color="purple.300"
          mb={4}
          fontFamily="hymmnos"
        >
          {classSpecificQuiz.title}
        </Text>
        <Text fontSize="lg" color="gray.200" textAlign="center" mb={6}>
          {currentQuestion.question}
        </Text>
        <RadioGroup
          key={currentQuestionIndex}
          onChange={(value) => handleClassSpecificAnswer(value as ClassSpecificOptionKey)}
          value={classSpecificAnswers[currentQuestionIndex] || ''}
        >
          <Stack spacing={4} align="center">
            {Object.entries(currentQuestion.options).map(
              ([optionKey, optionValue]) => (
                <Radio
                  key={optionKey}
                  value={optionKey}
                  size="lg"
                  colorScheme="purple"
                >
                  <Text color="gray.200">{optionValue}</Text>
                </Radio>
              )
            )}
          </Stack>
        </RadioGroup>
      </>
    );
  } else if (quizStage === 'result') {
    // Render the final result
    if (finalResult && testResult) {
      const selectedReyvateil = reyvateils.find(
        (r) => r.name === finalResult.reyvateil
      );

      return (
        <>
          <Text
            fontSize="2xl"
            fontWeight="bold"
            textAlign="center"
            color="purple.300"
            mb={4}
          >
            Your Class: {testResult.className}
          </Text>
          <Text fontSize="lg" color="gray.200" textAlign="center" mb={6}>
            {testResult.description}
          </Text>
          <Text
            fontSize="2xl"
            fontWeight="bold"
            textAlign="center"
            color="purple.300"
            mb={4}
          >
            Your Reyvateil Companion: {finalResult.reyvateil}
          </Text>
          <Text fontSize="lg" color="gray.200" textAlign="center" mb={6}>
            {finalResult.description}
          </Text>
          {selectedReyvateil ? (
            <Flex
              direction={{ base: 'column', md: 'row' }}
              align="center"
              justify="center"
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
                <Flex direction="row" align="center" mt={2}>
                  <Text
                    fontFamily="Hymmnos"
                    fontSize="xl"
                    fontWeight="bold"
                    color="purple.400"
                  >
                    Class :
                  </Text>

                  <Text fontSize="xl" fontWeight="bold" color="purple.400" ml={2}>
                    {selectedReyvateil.class}
                  </Text>
                </Flex>
                <Text mt={2} fontSize="md" color="gray.300">
                  {selectedReyvateil.features}
                </Text>
                <br />
                <br />
                <Text fontFamily="Hymmnos" fontSize="md" color="purple.400">
                  Stats:
                </Text>
                {selectedReyvateil.stats ? (
                  <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={2}>
                    {Object.entries(selectedReyvateil.stats).map(([stat, value]) => (
                      <Text key={stat} color="gray.300">
                        {capitalizeFirstLetter(stat.replace(/([A-Z])/g, ' $1'))}:{' '}
                        {value}
                      </Text>
                    ))}
                  </SimpleGrid>
                ) : (
                  <Alert status="error" borderRadius="md" mt={2}>
                    <AlertIcon />
                    Reyvateil stats are missing. Please contact support or update the
                    data.
                  </Alert>
                )}
              </Box>
            </Flex>
          ) : (
            <Text fontSize="lg" color="gray.200" textAlign="center" mb={6}>
              Unable to find the Reyvateil details.
            </Text>
          )}

          <Flex justify="center" mt={6}>
            <Button
              colorScheme="purple"
              mr={4}
              onClick={() => onAccept(selectedReyvateil!, selectedImageUrl)}
              isDisabled={!selectedReyvateil}
            >
              Accept
            </Button>
            <Button colorScheme="purple" mr={4} onClick={handleRetry}>
              Retry Test
            </Button>
            <Button variant="outline" colorScheme="purple" onClick={onSelectYourself}>
              Choose Yourself
            </Button>
          </Flex>

          {/* Image Selection Modal */}
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
        </>
      );
    } else {
      // Handle case where finalResult is null
      return (
        <Text fontSize="lg" color="gray.200" textAlign="center" mb={6}>
          Unable to determine your Reyvateil companion.
        </Text>
      );
    }
  }

  // Default return (should not reach here)
  return null;
};

const capitalizeFirstLetter = (str: string): string => {
  return str
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (char) => char.toUpperCase());
};

export default ReyvateilTest;
