import React from 'react';
import { Position, Handle } from '@xyflow/react';
import { Box, Tag, Flex, Text, Badge } from '@chakra-ui/react';
import { NodeData, ToolConfig } from '../types';

interface ToolNodeProps {
  data: NodeData;
  selected: boolean;
}

export const ToolNode: React.FC<ToolNodeProps> = ({ data, selected }) => {
  const toolConfig = data.config as ToolConfig;
  const parameters = toolConfig?.parameters || {};
  const paramKeys = Object.keys(parameters);

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
          <Tag size="sm" colorScheme="purple">
            {data.type}
          </Tag>
        </Box>
        
        {paramKeys.length > 0 && (
          <Box>
            <Text fontSize="sm" fontWeight="semibold">Parameters:</Text>
            {paramKeys.map(key => (
              <Badge key={key} variant="outline" colorScheme="teal" mt={1} mr={1}>
                {key}
              </Badge>
            ))}
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

export default ToolNode; 