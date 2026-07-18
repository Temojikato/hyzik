import React from 'react';
import { Alert, AlertDescription, AlertIcon, AlertTitle, Box, Button, Flex, Spinner } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const AdminRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const { currentUser, loading, isAdmin, refreshClaims } = useAuth();
  if (loading) return <Flex minH="100vh" align="center" justify="center"><Spinner size="xl" /></Flex>;
  if (!currentUser) return null;
  if (isAdmin) return children;
  return (
    <Flex minH="100vh" align="center" justify="center" p={6}>
      <Box maxW="620px">
        <Alert status="warning" borderRadius="panel" alignItems="flex-start">
          <AlertIcon mt={1} />
          <Box>
            <AlertTitle>Admin access has not been granted</AlertTitle>
            <AlertDescription display="block" mt={2}>
              This account is signed in, but it does not have the protected Firebase admin claim. Run the included admin setup command once, then refresh access.
            </AlertDescription>
            <Button mt={4} size="sm" onClick={refreshClaims}>Refresh access</Button>
            <Button as={Link} to="/" mt={4} ml={2} size="sm" variant="ghost">Back to player portal</Button>
          </Box>
        </Alert>
      </Box>
    </Flex>
  );
};

export default AdminRoute;
