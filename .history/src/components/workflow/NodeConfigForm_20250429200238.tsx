import React from 'react';
import { Box, Button, Flex, Input, Stack, Text, Textarea } from '@chakra-ui/react';
import { NodeData, AgentConfig, ToolConfig, ApplicationConfig } from './types';

interface NodeConfigFormProps {
  nodeType: string;
  initialData?: Partial<NodeData>;
  onSave: (data: NodeData) => void;
  onCancel: () => void;
}

export const NodeConfigForm: React.FC<NodeConfigFormProps> = ({ 
  nodeType, 
  initialData, 
  onSave, 
  onCancel 
}) => {
  const [formData, setFormData] = React.useState<Partial<NodeData>>({
    type: nodeType,
    label: initialData?.label || '',
    config: initialData?.config || getDefaultConfig(nodeType)
  });

  function getDefaultConfig(type: string): Partial<AgentConfig | ToolConfig | ApplicationConfig> {
    switch (type) {
      case 'agent':
        return { 
          id: `agent-${Date.now()}`,
          name: '',
          description: '',
          tools: [],
          maxTokens: 2048,
          temperature: 0.7
        };
      case 'tool':
        return { 
          id: `tool-${Date.now()}`,
          name: '',
          description: '',
          parameters: {}
        };
      case 'application':
        return { 
          id: `app-${Date.now()}`,
          name: '',
          description: '',
          endpoint: ''
        };
      default:
        return {};
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [, field] = name.split('.');
      setFormData(prev => ({
        ...prev,
        config: {
          ...prev.config,
          [field]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      id: initialData?.id || `node-${Date.now()}`,
      ...formData
    } as NodeData);
  };

  return (
    <Box 
      p={5} 
      bg="white" 
      borderWidth="1px" 
      borderRadius="md" 
      boxShadow="lg"
      width="400px"
    >
      <form onSubmit={handleSubmit}>
        <Stack gap={4}>
          <Text fontSize="xl" fontWeight="bold">
            {initialData ? 'Edit' : 'Add'} {nodeType.charAt(0).toUpperCase() + nodeType.slice(1)}
          </Text>

          <Box mb={3}>
            <Text fontWeight="bold" mb={1}>Label *</Text>
            <Input 
              name="label" 
              value={formData.label} 
              onChange={handleChange} 
              placeholder="Node label"
              required
            />
          </Box>

          <Box mb={3}>
            <Text fontWeight="bold" mb={1}>Name *</Text>
            <Input 
              name="config.name" 
              value={formData.config?.name || ''} 
              onChange={handleChange} 
              placeholder="Name"
              required
            />
          </Box>

          <Box mb={3}>
            <Text fontWeight="bold" mb={1}>Description</Text>
            <Textarea 
              name="config.description" 
              value={formData.config?.description || ''} 
              onChange={handleChange} 
              placeholder="Description"
            />
          </Box>

          {nodeType === 'agent' && (
            <>
              <Box mb={3}>
                <Text fontWeight="bold" mb={1}>Max Tokens</Text>
                <Input
                  type="number"
                  name="config.maxTokens"
                  value={(formData.config as AgentConfig)?.maxTokens || 2048}
                  onChange={handleChange}
                  min={1}
                  max={8192}
                />
              </Box>

              <Box mb={3}>
                <Text fontWeight="bold" mb={1}>Temperature</Text>
                <Input
                  type="number"
                  name="config.temperature"
                  value={(formData.config as AgentConfig)?.temperature || 0.7}
                  onChange={handleChange}
                  step={0.1}
                  min={0}
                  max={2}
                />
              </Box>
            </>
          )}

          {nodeType === 'application' && (
            <Box mb={3}>
              <Text fontWeight="bold" mb={1}>Endpoint</Text>
              <Input 
                name="config.endpoint" 
                value={(formData.config as ApplicationConfig)?.endpoint || ''} 
                onChange={handleChange} 
                placeholder="API Endpoint URL"
              />
            </Box>
          )}

          <Flex justifyContent="flex-end" mt={4}>
            <Button onClick={onCancel} variant="outline" mr={3}>
              Cancel
            </Button>
            <Button type="submit" colorScheme="blue">
              Save
            </Button>
          </Flex>
        </Stack>
      </form>
    </Box>
  );
};

export default NodeConfigForm; 