import React from 'react';
import { Box, BoxProps } from '@chakra-ui/react';

const Panel: React.FC<BoxProps> = ({ children, ...props }) => (
  <Box
    bg="rgba(17,23,37,.92)"
    border="1px solid"
    borderColor="border"
    borderRadius="panel"
    boxShadow="panel"
    {...props}
  >
    {children}
  </Box>
);

export default Panel;
