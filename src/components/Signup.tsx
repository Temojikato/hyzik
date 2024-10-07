// src/components/Signup.tsx

import React, { useRef, useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../Firebase';
import { Link, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Heading,
  Text,
  Alert,
  AlertIcon,
  Flex,
} from '@chakra-ui/react';
import { doc, setDoc } from 'firebase/firestore';

const Signup: React.FC = () => {
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const passwordConfirmRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordRef.current?.value !== passwordConfirmRef.current?.value) {
      return setError('Passwords do not match');
    }

    try {
      setError('');
      setLoading(true);
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        emailRef.current!.value,
        passwordRef.current!.value
      );
      const user = userCredential.user;

      // Optionally, create a user document without Reyvateil
      const userDocRef = doc(db, 'users', user.uid);
      await setDoc(userDocRef, {
        email: user.email,
        // Add other user-specific fields here
      });

      // Redirect to Reyvateil Selection
      navigate('/select-reyvateil');
    } catch (err: any) {
      console.error('Error creating account:', err);
      setError('Failed to create an account');
    }
    setLoading(false);
  };

  return (
    <Flex minH="100vh" align="center" justify="center" bg="gray.50">
      <Box
        bg="white"
        p={8}
        rounded="md"
        boxShadow="lg"
        width={{ base: '90%', md: '500px' }}
      >
        <VStack spacing={4} align="stretch">
          <Heading as="h2" size="lg" textAlign="center">
            Sign Up
          </Heading>
          {error && (
            <Alert status="error">
              <AlertIcon />
              {error}
            </Alert>
          )}
          <form onSubmit={handleSubmit}>
            <VStack spacing={4} align="stretch">
              <FormControl id="email" isRequired>
                <FormLabel>Email</FormLabel>
                <Input type="email" ref={emailRef} placeholder="Enter your email" />
              </FormControl>
              <FormControl id="password" isRequired>
                <FormLabel>Password</FormLabel>
                <Input type="password" ref={passwordRef} placeholder="Enter your password" />
              </FormControl>
              <FormControl id="password-confirm" isRequired>
                <FormLabel>Confirm Password</FormLabel>
                <Input
                  type="password"
                  ref={passwordConfirmRef}
                  placeholder="Confirm your password"
                />
              </FormControl>
              <Button
                type="submit"
                colorScheme="blue"
                width="100%"
                isLoading={loading}
              >
                Sign Up
              </Button>
            </VStack>
          </form>
          <Text textAlign="center">
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'blue' }}>
              Log In
            </Link>
          </Text>
        </VStack>
      </Box>
    </Flex>
  );
};

export default Signup;
