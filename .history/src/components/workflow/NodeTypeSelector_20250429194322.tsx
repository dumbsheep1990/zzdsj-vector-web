import React from 'react';
import { Box, Stack, Button, Text } from '@chakra-ui/react';

interface NodeTypeSelectorProps {
  onSelectNodeType: (type: string) => void;
}

export const NodeTypeSelector: React.FC<NodeTypeSelectorProps> = ({ onSelectNodeType }) => {
  const nodeTypes = [
    { type: 'agent', label: 'Agent', description: 'AI agent that can use tools' },
    { type: 'tool', label: 'Tool', description: 'Task-specific capability' },
    { type: 'application', label: 'Application', description: 'External system integration' },
  ];

  return (
    <Box 
      p={4} 
      bg="white" 
      borderWidth="1px" 
      borderColor="gray.200" 
      borderRadius="md"
      boxShadow="sm"
      width="250px"
    >
      <Text fontSize="lg" fontWeight="bold" mb={4}>Add Node</Text>
      <Stack gap={3} direction="column">
        {nodeTypes.map((nodeType) => (
          <Button
            key={nodeType.type}
            onClick={() => onSelectNodeType(nodeType.type)}
            variant="outline"
            justifyContent="flex-start"
            height="auto"
            py={2}
            px={3}
          >
            <Box textAlign="left">
              <Text fontWeight="bold">{nodeType.label}</Text>
              <Text fontSize="xs" color="gray.500">{nodeType.description}</Text>
            </Box>
          </Button>
        ))}
      </Stack>
    </Box>
  );
};

export default NodeTypeSelector; 