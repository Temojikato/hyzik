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
      minH="100vh"
      bg="background"
      p={4}
    >
      <Box
        w="100%"
        maxW="440px"
        p={{ base: 6, md: 8 }}
        borderRadius="panel"
        bg="surface"
        boxShadow="panel"
        border="1px solid"
        borderColor="purple.500"
      >
        <Heading
          as="h2"
          size="xl"
          textAlign="center"
          mb={6}
          color="textHeader"
        >
          HYZIK
        </Heading>
        <Text textAlign="center" color="textMuted" mb={7}>Reconnect to the Omnia campaign interface.</Text>

        <form onSubmit={handleSubmit}>
          <VStack spacing={5}>
            {/* Email Input */}
            <FormControl id="email" isRequired>
              <FormLabel>Email address</FormLabel>
              <InputGroup>
                <InputLeftElement pointerEvents="none">
                  <Icon as={FaEnvelope} color="purple.400" />
                </InputLeftElement>
                <Input
                  type="email"
                  placeholder="you@example.com"
                  ref={emailRef}
                  focusBorderColor="purple.400"
                />
              </InputGroup>
            </FormControl>

            {/* Password Input */}
            <FormControl id="password" isRequired>
              <FormLabel>Password</FormLabel>
              <InputGroup>
                <InputLeftElement pointerEvents="none">
                  <Icon as={FaLock} color="purple.400" />
                </InputLeftElement>
                <Input
                  type="password"
                  placeholder="Shhh... it's a secret"
                  ref={passwordRef}
                  focusBorderColor="purple.400"
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
              loadingText="Connecting..."
            >
              Enter campaign
            </Button>
          </VStack>
        </form>

        <Text
          mt={6}
          textAlign="center"
          color="gray.300"
        >
          Need an account? <Link to="/signup" style={{ color: '#C5A7FF' }}>Create one</Link>
        </Text>
      </Box>
    </Flex>
  );
};

export default Login;
