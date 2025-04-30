import React from 'react';
import { Position, Handle } from '@xyflow/react';
import { Box, Tag, Flex, Text } from '@chakra-ui/react';
import { NodeData, ToolConfig } from '../types';

interface AgentNodeProps {
  data: NodeData;
  selected: boolean;
}

export const AgentNode: React.FC<AgentNodeProps> = ({ data, selected }) => {
  const agentConfig = data.config as { tools?: ToolConfig[] };
  const tools = agentConfig?.tools || [];

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
          <Tag size="sm" colorScheme="green">
            {data.type}
          </Tag>
        </Box>
        
        {tools.length > 0 && (
          <Box>
            <Text fontSize="sm" fontWeight="semibold">Tools:</Text>
            {tools.map((tool: ToolConfig) => (
              <Tag key={tool.id} size="sm" colorScheme="blue" mt={1} mr={1}>
                {tool.name}
              </Tag>
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

export default AgentNode; 