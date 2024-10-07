import React, { useRef, useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../Firebase';
import { Link, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Text,
  Heading,
  useToast,
  InputGroup,
  InputLeftElement,
  Icon,
  Flex,
  useColorModeValue,
} from '@chakra-ui/react';
import { FaEnvelope, FaLock } from 'react-icons/fa';

const Login: React.FC = () => {
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth, emailRef.current!.value, passwordRef.current!.value);
      toast({
        title: 'Login Successful',
        description: 'Welcome back, adventurer!',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      navigate('/');
    } catch (err) {
      toast({
        title: 'Login Failed',
        description: 'The spirits say your credentials are incorrect. Try again!',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Flex
      align="center"
      justify="center"
      h="100vh"
      bgGradient="linear(to-br, gray.900, purple.900, black)"
      p={4}
    >
      <Box
        w="100%"
        maxW="400px"
        p={8}
        borderRadius="md"
        bg={useColorModeValue('gray.800', 'gray.700')}
        boxShadow="2xl"
        border="1px solid"
        borderColor="purple.500"
      >
        <Heading
          as="h2"
          size="xl"
          textAlign="center"
          mb={6}
          fontFamily="Hymmnos"
          color="purple.300"
          textShadow="2px 2px 10px rgba(255, 0, 255, 0.8)"
        >
          Hyzik en lonfa
        </Heading>

        <form onSubmit={handleSubmit}>
          <VStack spacing={5}>
            {/* Email Input */}
            <FormControl id="email" isRequired>
              <FormLabel fontFamily="Hymmnos" color="gray.200">Email Address</FormLabel>
              <InputGroup>
                <InputLeftElement pointerEvents="none">
                  <Icon as={FaEnvelope} color="purple.400" />
                </InputLeftElement>
                <Input
                  type="email"
                  placeholder="you@fantasy.com"
                  ref={emailRef}
                  focusBorderColor="purple.400"
                  fontFamily="Hymmnos"
                  fontSize="2xl"
                  bg="gray.600"
                  color="gray.100"
                />
              </InputGroup>
            </FormControl>

            {/* Password Input */}
            <FormControl id="password" isRequired>
              <FormLabel fontFamily="Hymmnos" color="gray.200">Password</FormLabel>
              <InputGroup>
                <InputLeftElement pointerEvents="none">
                  <Icon as={FaLock} color="purple.400" />
                </InputLeftElement>
                <Input
                  type="password"
                  placeholder="Shhh... it's a secret"
                  fontFamily="Hymmnos"
                  fontSize="2xl"
                  ref={passwordRef}
                  focusBorderColor="purple.400"
                  bg="gray.600"
                  color="gray.100"
                />
              </InputGroup>
            </FormControl>

            {/* Submit Button */}
            <Button
              type="submit"
              colorScheme="purple"
              variant="solid"
              w="full"
              isLoading={loading}
              fontFamily="Hymmnos"
              fontSize="2xl"
              loadingText="Connecting..."
              boxShadow="0 0 20px rgba(128, 90, 213, 0.5)"
              _hover={{
                bgGradient: 'linear(to-r, purple.500, pink.500)',
                boxShadow: '0 0 30px rgba(255, 20, 147, 0.8)',
              }}
            >
              Enter the Realm
            </Button>
          </VStack>
        </form>

        <Text
          mt={6}
          textAlign="center"
          color="gray.300"
          fontFamily="Hymmnos"
          _hover={{ textDecoration: 'underline', color: 'purple.400' }}
        >
          Need an account? <Link to="/signup">Sign Up</Link>
        </Text>
      </Box>
    </Flex>
  );
};

export default Login;
