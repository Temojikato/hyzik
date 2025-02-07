// src/components/ReyvateilTest.tsx

import React, { useState, useEffect } from 'react';
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
import {
  ClassSpecificQuiz,
  ClassSpecificOptionKey,
  QuizData,
  QuizQuestion,
} from '../types/ReyvateilsQuizzes';

// ─── DYNAMIC IMPORTS FOR CLASS-SPECIFIC QUIZZES ─────────────────────────
const classSpecificQuizzes: { [key: string]: () => Promise<any> } = {
  Artificer: () => import('../artificerQuiz.json'),
  Barbarian: () => import('../barbarianQuiz.json'),
  Bard: () => import('../bardQuiz.json'),
  Bloodhunter: () => import('../bloodhunterQuiz.json'),
  Cleric: () => import('../clericQuiz.json'),
  Druid: () => import('../druidQuiz.json'),
  Fighter: () => import('../fighterQuiz.json'),
  Monk: () => import('../monkQuiz.json'),
  Paladin: () => import('../paladinQuiz.json'),
  Ranger: () => import('../rangerQuiz.json'),
  Rogue: () => import('../rogueQuiz.json'),
  Sorcerer: () => import('../sorcererQuiz.json'),
  Warlock: () => import('../warlockQuiz.json'),
  Wizard: () => import('../wizardQuiz.json'),
};

const quizData: QuizData = quizDataJson;

// ─── CONFIGURATION ──────────────────────────────────────────────────────
const totalQuizQuestions = 9;
const numOptionsPerQuestion = 6;

// ─── COMPONENT PROPS ────────────────────────────────────────────────────
interface ReyvateilTestProps {
  reyvateils: Reyvateil[];
  onAccept: (reyvateil: Reyvateil, selectedImageUrl: string) => void;
  onSelectYourself: () => void;
}

// ─── THE COMPONENT ──────────────────────────────────────────────────────
const ReyvateilTest: React.FC<ReyvateilTestProps> = ({
  reyvateils,
  onAccept,
  onSelectYourself,
}) => {
  // STATES FOR THE INITIAL (CLASS-DETERMINING) QUIZ
  const [selectedQuestions, setSelectedQuestions] = useState<QuizQuestion[]>([]);
  const [balancedOptions, setBalancedOptions] = useState<string[][]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [testResult, setTestResult] = useState<{
    className: string;
    description: string;
    totalScore: number;
  } | null>(null);

  // STATES FOR THE TIE-BREAKER, CLASS-SPECIFIC QUIZ & FINAL RESULT
  const [quizStage, setQuizStage] = useState<
    'initial' | 'tieBreaker' | 'classSpecific' | 'result'
  >('initial');
  const [tieBreakerOptions, setTieBreakerOptions] = useState<string[]>([]);
  const [classSpecificQuiz, setClassSpecificQuiz] =
    useState<ClassSpecificQuiz | null>(null);
  const [classSpecificAnswers, setClassSpecificAnswers] = useState<string[]>([]);
  const [finalResult, setFinalResult] = useState<{
    reyvateil: string;
    description: string;
    totalScore: number;
  } | null>(null);

  // STATE FOR IMAGE SELECTION (FINAL RESULT)
  const [selectedImageUrl, setSelectedImageUrl] = useState<string>('');
  const {
    isOpen: isImageSelectionOpen,
    onOpen: onImageSelectionOpen,
    onClose: onImageSelectionClose,
  } = useDisclosure();

  // ─── UTILITY: SHUFFLE AN ARRAY ─────────────────────────────────────────
  const shuffleArray = <T,>(array: T[]): T[] => {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };

  // ─── SIMPLE BALANCED ASSIGNMENT ALGORITHM ─────────────────────────────
  /**
   * Instead of heavy recursion, build a pool of classes (repeated according to targetCounts),
   * shuffle it, and then split it into chunks. Each chunk must have unique classes.
   */
  const generateBalancedAssignmentSimple = (
    numQuestions: number,
    numOptions: number,
    classes: string[],
    targetCounts: { [key: string]: number }
  ): string[][] | null => {
    const totalSlots = numQuestions * numOptions;
    const pool: string[] = [];
    classes.forEach((cls) => {
      const count = targetCounts[cls] || 0;
      for (let i = 0; i < count; i++) {
        pool.push(cls);
      }
    });
    if (pool.length !== totalSlots) return null;
    const maxAttempts = 1000;
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      const shuffledPool = shuffleArray(pool);
      const assignment: string[][] = [];
      let valid = true;
      for (let i = 0; i < numQuestions; i++) {
        const chunk = shuffledPool.slice(i * numOptions, (i + 1) * numOptions);
        if (new Set(chunk).size !== numOptions) {
          valid = false;
          break;
        }
        assignment.push(chunk);
      }
      if (valid) return assignment;
    }
    return null;
  };

  // ─── SETUP: SELECT QUESTIONS & PRECOMPUTE BALANCED OPTIONS ─────────────
  useEffect(() => {
    const shuffledQuestions = shuffleArray(quizData.quiz.questions);
    const selected = shuffledQuestions.slice(0, totalQuizQuestions);
    setSelectedQuestions(selected);

    // Get the list of classes from the classMapping.
    const classes = quizData.quiz.classMapping.map((mapping) => mapping.class);
    const totalSlots = totalQuizQuestions * numOptionsPerQuestion;
    const numClasses = classes.length;
    const base = Math.floor(totalSlots / numClasses);
    const remainder = totalSlots % numClasses;
    const targetCounts: { [key: string]: number } = {};
    classes.forEach((cls, index) => {
      targetCounts[cls] = base + (index < remainder ? 1 : 0);
    });

    const assignment = generateBalancedAssignmentSimple(
      totalQuizQuestions,
      numOptionsPerQuestion,
      classes,
      targetCounts
    );
    if (assignment) {
      setBalancedOptions(assignment);
    } else {
      // Fallback: random options for each question.
      const fallback: string[][] = [];
      for (let i = 0; i < totalQuizQuestions; i++) {
        fallback.push(shuffleArray(classes).slice(0, numOptionsPerQuestion));
      }
      setBalancedOptions(fallback);
    }
  }, []);

  // ─── HANDLER FOR THE INITIAL QUIZ ─────────────────────────────────────────
  const handleTestAnswer = (selectedClass: string) => {
    const updatedAnswers = [...answers];
    updatedAnswers[currentQuestionIndex] = selectedClass;
    setAnswers(updatedAnswers);

    if (currentQuestionIndex < selectedQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      computeTestResult(updatedAnswers);
    }
  };

  // ─── NEW COMPUTE TEST RESULT (USING FREQUENCY) ───────────────────────────
  const computeTestResult = (answersArray: string[]) => {
    // Count how many times each class was selected.
    const frequency: { [key: string]: number } = {};
    answersArray.forEach((answer) => {
      frequency[answer] = (frequency[answer] || 0) + 1;
    });
    const maxCount = Math.max(...Object.values(frequency));
    const winners = Object.keys(frequency).filter(
      (cls) => frequency[cls] === maxCount
    );
    if (winners.length === 1) {
      // Clear winner.
      const winningClass = winners[0];
      const classInfo = quizData.quiz.classMapping.find(
        (mapping) => mapping.class === winningClass
      );
      setTestResult({
        className: winningClass,
        description: classInfo ? classInfo.description : '',
        totalScore: maxCount,
      });
      const loadQuiz = classSpecificQuizzes[winningClass];
      if (loadQuiz) {
        loadQuiz().then((module) => {
          const specificQuiz = module.default as ClassSpecificQuiz;
          setClassSpecificQuiz(specificQuiz);
          setQuizStage('classSpecific');
          setCurrentQuestionIndex(0);
          setClassSpecificAnswers([]);
        });
      } else {
        setQuizStage('result');
      }
    } else {
      // Tie detected: ask a tie-breaker question.
      setTieBreakerOptions(winners);
      setQuizStage('tieBreaker');
    }
  };

  // ─── HANDLER FOR THE TIE-BREAKER ANSWER ───────────────────────────────────
  const handleTieBreakerAnswer = (selectedClass: string) => {
    const classInfo = quizData.quiz.classMapping.find(
      (mapping) => mapping.class === selectedClass
    );
    setTestResult({
      className: selectedClass,
      description: classInfo ? classInfo.description : '',
      totalScore: 0,
    });
    const loadQuiz = classSpecificQuizzes[selectedClass];
    if (loadQuiz) {
      loadQuiz().then((module) => {
        const specificQuiz = module.default as ClassSpecificQuiz;
        setClassSpecificQuiz(specificQuiz);
        setQuizStage('classSpecific');
        setCurrentQuestionIndex(0);
        setClassSpecificAnswers([]);
      });
    } else {
      setQuizStage('result');
    }
  };

  // ─── HANDLER FOR THE CLASS-SPECIFIC QUIZ (UNCHANGED) ─────────────────────
  const handleClassSpecificAnswer = (answer: string) => {
    const updatedAnswers = [...classSpecificAnswers];
    updatedAnswers[currentQuestionIndex] = answer;
    setClassSpecificAnswers(updatedAnswers);

    if (
      classSpecificQuiz &&
      currentQuestionIndex < classSpecificQuiz.questions.length - 1
    ) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      computeClassSpecificResult(updatedAnswers);
    }
  };

  const computeClassSpecificResult = (answersArray: string[]) => {
    let totalScore = 0;
    if (!classSpecificQuiz) return;
    for (let i = 0; i < classSpecificQuiz.questions.length; i++) {
      const answer = answersArray[i];
      if (!answer) continue;
      // We still use a point system for the class-specific quiz.
      const score =
        classSpecificQuiz.scoring[answer as ClassSpecificOptionKey] || 0;
      totalScore += score;
    }
    const mapping = classSpecificQuiz.reyvateilMapping.find((mapping) => {
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
      setFinalResult({
        reyvateil: 'Unknown',
        description: 'Unable to determine your Reyvateil companion.',
        totalScore,
      });
      setQuizStage('result');
    }
  };

  // ─── RETRY HANDLER ───────────────────────────────────────────────────────
  const handleRetry = () => {
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setTestResult(null);
    setSelectedImageUrl('');
    setQuizStage('initial');
    setClassSpecificQuiz(null);
    setClassSpecificAnswers([]);
    setFinalResult(null);
  };

  // ─── IMAGE SELECTION HANDLERS ─────────────────────────────────────────────
  const handleImageClick = () => {
    onImageSelectionOpen();
  };

  const handleImageSelect = (imageUrl: string) => {
    setSelectedImageUrl(imageUrl);
    onImageSelectionClose();
  };

  const capitalizeFirstLetter = (str: string): string => {
    return str
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, (char) => char.toUpperCase());
  };

  // ─── RENDERING ───────────────────────────────────────────────────────────
  if (
    quizStage === 'initial' &&
    selectedQuestions.length > 0 &&
    balancedOptions.length > 0
  ) {
    const currentQuestion = selectedQuestions[currentQuestionIndex];
    const currentOptions = balancedOptions[currentQuestionIndex];
    return (
      <>
        <Text
          fontSize="xl"
          fontWeight="bold"
          textAlign="center"
          color="purple.300"
          mb={4}
        >
          Question {currentQuestionIndex + 1} of {totalQuizQuestions}
        </Text>
        <Text fontSize="lg" color="gray.200" textAlign="center" mb={6}>
          {currentQuestion.question}
        </Text>
        <RadioGroup
          key={currentQuestionIndex}
          onChange={(value) => handleTestAnswer(value as string)}
          value={answers[currentQuestionIndex] || ''}
        >
          <Stack spacing={4} align="center">
            {currentOptions.map((cls) => (
              <Radio key={cls} value={cls} size="lg" colorScheme="purple">
                <Text color="gray.200">{currentQuestion.options[cls]}</Text>
              </Radio>
            ))}
          </Stack>
        </RadioGroup>
      </>
    );
  } else if (quizStage === 'tieBreaker') {
    return (
      <>
        <Text
          fontSize="xl"
          fontWeight="bold"
          textAlign="center"
          color="purple.300"
          mb={4}
        >
          Tie Breaker
        </Text>
        <Text fontSize="lg" color="gray.200" textAlign="center" mb={6}>
          There is a tie between: {tieBreakerOptions.join(', ')}. Which one calls to you?
        </Text>
        <RadioGroup onChange={(value) => handleTieBreakerAnswer(value as string)}>
          <Stack spacing={4} align="center">
            {tieBreakerOptions.map((cls) => (
              <Radio key={cls} value={cls} size="lg" colorScheme="purple">
                <Text color="gray.200">{cls}</Text>
              </Radio>
            ))}
          </Stack>
        </RadioGroup>
      </>
    );
  } else if (quizStage === 'classSpecific' && classSpecificQuiz) {
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
          onChange={(value) => handleClassSpecificAnswer(value as string)}
          value={classSpecificAnswers[currentQuestionIndex] || ''}
        >
          <Stack spacing={4} align="center">
            {Object.entries(currentQuestion.options).map(
              ([optionKey, optionValue]) => (
                <Radio key={optionKey} value={optionKey} size="lg" colorScheme="purple">
                  <Text color="gray.200">{optionValue}</Text>
                </Radio>
              )
            )}
          </Stack>
        </RadioGroup>
      </>
    );
  } else if (quizStage === 'result') {
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
                        {capitalizeFirstLetter(stat.replace(/([A-Z])/g, ' $1'))}: {value}
                      </Text>
                    ))}
                  </SimpleGrid>
                ) : (
                  <Alert status="error" borderRadius="md" mt={2}>
                    <AlertIcon />
                    Reyvateil stats are missing. Please contact support or update the data.
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
                onWheel={(e) => e.stopPropagation()}
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
      return (
        <Text fontSize="lg" color="gray.200" textAlign="center" mb={6}>
          Unable to determine your Reyvateil companion.
        </Text>
      );
    }
  }

  return null;
};

export default ReyvateilTest;
