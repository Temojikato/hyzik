import React, { useEffect, useMemo, useState } from 'react';
import {
  Badge, Box, Button, HStack, IconButton, Modal, ModalBody, ModalContent, ModalFooter,
  ModalHeader, ModalOverlay, Text, Tooltip, VStack,
} from '@chakra-ui/react';
import { FaEye, FaEyeSlash, FaShieldHalved } from 'react-icons/fa6';
import { useAuth } from '../contexts/AuthContext';
import { subscribePrivateMessages, updateMessageStatus } from '../services/campaignService';
import { PrivateMessage } from '../types/Campaign';
import { useBackDismiss } from '../contexts/BackNavigationContext';

const PrivateMessageCenter: React.FC = () => {
  const { currentUser } = useAuth();
  const [messages, setMessages] = useState<PrivateMessage[]>([]);
  const [active, setActive] = useState<PrivateMessage | null>(null);
  const [snoozedIds, setSnoozedIds] = useState<string[]>([]);
  const unread = useMemo(() => messages.filter((message) => message.status !== 'dismissed' && message.status !== 'read'), [messages]);
  const nextPopup = unread.find((message) => !snoozedIds.includes(message.id));

  useEffect(() => {
    if (!currentUser) return undefined;
    return subscribePrivateMessages(currentUser.uid, setMessages, () => setMessages([]));
  }, [currentUser]);

  useEffect(() => {
    if (!active && nextPopup) setActive(nextPopup);
  }, [active, nextPopup]);

  const accept = async () => {
    if (!active) return;
    await updateMessageStatus(active.id, 'accepted');
    setActive({ ...active, status: 'accepted' });
  };

  const dismiss = async () => {
    if (!active) return;
    await updateMessageStatus(active.id, active.status === 'accepted' ? 'read' : 'dismissed');
    setActive(null);
  };

  const notNow = () => {
    if (!active) return;
    setSnoozedIds((current) => [...current, active.id]);
    setActive(null);
  };

  useBackDismiss(Boolean(active), active?.status === 'waiting' ? notNow : dismiss);

  if (!currentUser) return null;

  return (
    <>
      {unread.length > 0 && (
        <Tooltip label="Private transmission">
          <IconButton
            aria-label="Open private transmission"
            icon={<FaShieldHalved />}
            position="fixed"
            zIndex={1600}
            right={{ base: 3, md: 5 }}
            bottom={{ base: 3, md: 5 }}
            borderRadius="full"
            colorScheme="gray"
            boxShadow="lg"
            onClick={() => { setSnoozedIds((current) => current.filter((id) => id !== unread[0].id)); setActive(unread[0]); }}
          />
        </Tooltip>
      )}
      <Modal isOpen={Boolean(active)} onClose={() => undefined} closeOnOverlayClick={false} closeOnEsc={false} isCentered size="md">
        <ModalOverlay bg="rgba(3,5,10,.88)" />
        <ModalContent borderColor="gray.600" bg="#0D111B">
          {active?.status === 'waiting' ? (
            <>
              <ModalHeader><HStack><FaEyeSlash /><Text fontSize="md">Private transmission waiting</Text></HStack></ModalHeader>
              <ModalBody>
                <VStack spacing={4} align="stretch">
                  <Text color="textMuted">The contents are hidden. Make sure nobody else can see your screen before accepting.</Text>
                  <Badge alignSelf="start" colorScheme="gray">Silent · private · no preview</Badge>
                </VStack>
              </ModalBody>
              <ModalFooter><Button variant="ghost" mr={2} onClick={notNow}>Not now</Button><Button leftIcon={<FaEye />} onClick={accept}>Reveal message</Button></ModalFooter>
            </>
          ) : (
            <>
              <ModalHeader>{active?.subject || 'Private transmission'}</ModalHeader>
              <ModalBody><Box p={4} bg="blackAlpha.400" borderRadius="xl"><Text whiteSpace="pre-wrap">{active?.body}</Text></Box></ModalBody>
              <ModalFooter><Button onClick={dismiss}>Acknowledge</Button></ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default PrivateMessageCenter;
