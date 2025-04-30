import React from 'react';
import { 
  Box, 
  FormControl, 
  FormLabel, 
  Input, 
  Button, 
  Stack,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Select,
  Textarea,
  Heading
} from '@chakra-ui/react';
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [configKey, field] = name.split('.');
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

  const handleNumberChange = (name: string, value: number) => {
    setFormData(prev => ({
      ...prev,
      config: {
        ...prev.config,
        [name]: value
      }
    }));
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
          <Heading size="md" mb={2}>
            {initialData ? 'Edit' : 'Add'} {nodeType.charAt(0).toUpperCase() + nodeType.slice(1)}
          </Heading>

          <FormControl isRequired>
            <FormLabel>Label</FormLabel>
            <Input 
              name="label" 
              value={formData.label} 
              onChange={handleChange} 
              placeholder="Node label"
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Name</FormLabel>
            <Input 
              name="config.name" 
              value={formData.config?.name || ''} 
              onChange={handleChange} 
              placeholder="Name"
            />
          </FormControl>

          <FormControl>
            <FormLabel>Description</FormLabel>
            <Textarea 
              name="config.description" 
              value={formData.config?.description || ''} 
              onChange={handleChange} 
              placeholder="Description"
            />
          </FormControl>

          {nodeType === 'agent' && (
            <>
              <FormControl>
                <FormLabel>Max Tokens</FormLabel>
                <NumberInput 
                  defaultValue={(formData.config as AgentConfig)?.maxTokens || 2048} 
                  min={1} 
                  max={8192}
                  onChange={(_, value) => handleNumberChange('maxTokens', value)}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </FormControl>

              <FormControl>
                <FormLabel>Temperature</FormLabel>
                <NumberInput 
                  defaultValue={(formData.config as AgentConfig)?.temperature || 0.7} 
                  min={0} 
                  max={2}
                  step={0.1}
                  precision={2}
                  onChange={(_, value) => handleNumberChange('temperature', value)}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </FormControl>
            </>
          )}

          {nodeType === 'application' && (
            <FormControl>
              <FormLabel>Endpoint</FormLabel>
              <Input 
                name="config.endpoint" 
                value={(formData.config as ApplicationConfig)?.endpoint || ''} 
                onChange={handleChange} 
                placeholder="API Endpoint URL"
              />
            </FormControl>
          )}

          <Stack direction="row" spacing={4} justifyContent="flex-end" mt={4}>
            <Button onClick={onCancel} variant="outline">
              Cancel
            </Button>
            <Button type="submit" colorScheme="blue">
              Save
            </Button>
          </Stack>
        </Stack>
      </form>
    </Box>
  );
};

export default NodeConfigForm; 