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
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';

const Signup: React.FC = () => {
  const emailRef = useRef<HTMLInputElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
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
        displayName: nameRef.current!.value.trim(),
        active: false,
        conditions: [],
        inventory: [],
        unlockedCyphers: [],
        unlockedRecipes: [],
        createdAt: serverTimestamp(),
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
    <Flex minH="100vh" align="center" justify="center" bg="background" p={4}>
      <Box
        bg="surface"
        p={{ base: 6, md: 8 }}
        border="1px solid"
        borderColor="primary"
        rounded="panel"
        boxShadow="panel"
        width="100%"
        maxW="460px"
      >
        <VStack spacing={4} align="stretch">
          <Heading as="h2" size="lg" textAlign="center">
            Create campaign access
          </Heading>
          <Text textAlign="center" color="textMuted">Your Reyvateil selection follows after account creation.</Text>
          {error && (
            <Alert status="error">
              <AlertIcon />
              {error}
            </Alert>
          )}
          <form onSubmit={handleSubmit}>
            <VStack spacing={4} align="stretch">
              <FormControl id="name" isRequired>
                <FormLabel>Your name</FormLabel>
                <Input ref={nameRef} maxLength={80} placeholder="What should the party call you?" />
              </FormControl>
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
                colorScheme="purple"
                width="100%"
                isLoading={loading}
              >
                Sign Up
              </Button>
            </VStack>
          </form>
          <Text textAlign="center">
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#C5A7FF' }}>
              Log In
            </Link>
          </Text>
        </VStack>
      </Box>
    </Flex>
  );
};

export default Signup;
