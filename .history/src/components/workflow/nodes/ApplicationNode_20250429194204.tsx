import React from 'react';
import { Position, Handle } from '@xyflow/react';
import { Box, Flex, Text, Badge } from '@chakra-ui/react';
import { NodeData, ApplicationConfig } from '../types';

interface ApplicationNodeProps {
  data: NodeData;
  selected: boolean;
}

export const ApplicationNode: React.FC<ApplicationNodeProps> = ({ data, selected }) => {
  const appConfig = data.config as ApplicationConfig;

  return (
    <Box
      padding={3}
      borderWidth={selected ? 2 : 1}
      borderRadius="md"
      borderColor={selected ? 'blue.500' : 'gray.200'}
      bg="white"
      width="200px"
      boxShadow="md"
    >
      <Handle
        type="target"
        position={Position.Left}
        style={{ background: '#555' }}
      />
      
      <Flex direction="column" gap={2}>
        <Box>
          <Text fontWeight="bold">{data.label}</Text>
          <Badge colorScheme="blue">
            {data.type}
          </Badge>
        </Box>
        
        {appConfig.endpoint && (
          <Box>
            <Text fontSize="sm" fontWeight="semibold">Endpoint:</Text>
            <Text fontSize="xs" noOfLines={1}>
              {appConfig.endpoint}
            </Text>
          </Box>
        )}
      </Flex>
      
      <Handle
        type="source"
        position={Position.Right}
        style={{ background: '#555' }}
      />
    </Box>
  );
};

export default ApplicationNode; 