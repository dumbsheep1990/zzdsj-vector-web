import React, { useState, useCallback } from 'react';
import { Box, Button, Flex, Heading } from '@chakra-ui/react';
import ReactFlow, { 
  Background, 
  Controls, 
  MiniMap, 
  addEdge, 
  useNodesState, 
  useEdgesState
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { NodeData, WorkflowState, CustomNode } from './types';
import AgentNode from './nodes/AgentNode';
import ToolNode from './nodes/ToolNode';
import ApplicationNode from './nodes/ApplicationNode';
import NodeTypeSelector from './NodeTypeSelector';
import NodeConfigForm from './NodeConfigForm';

// Register custom node types
const nodeTypes = {
  agent: AgentNode,
  tool: ToolNode,
  application: ApplicationNode,
};

interface WorkflowEditorProps {
  initialWorkflow?: WorkflowState;
  onSave?: (workflow: WorkflowState) => void;
}

export const WorkflowEditor: React.FC<WorkflowEditorProps> = ({ 
  initialWorkflow,
  onSave,
}) => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialWorkflow?.nodes || []);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialWorkflow?.edges || []);
  const [selectedNodeType, setSelectedNodeType] = useState<string | null>(null);
  const [showNodeConfigForm, setShowNodeConfigForm] = useState(false);
  const [workflowName, setWorkflowName] = useState(initialWorkflow?.name || 'New Workflow');
  const [workflowDesc, setWorkflowDesc] = useState(initialWorkflow?.description || '');

  const onConnect = useCallback((params) => {
    setEdges((eds) => addEdge({ ...params, animated: true }, eds));
  }, [setEdges]);

  const onNodeSelect = useCallback((type: string) => {
    setSelectedNodeType(type);
    setShowNodeConfigForm(true);
  }, []);

  const onNodeConfigSave = useCallback((data: NodeData) => {
    const newNode: CustomNode = {
      id: data.id,
      type: data.type,
      position: { 
        x: Math.random() * 300, 
        y: Math.random() * 300 
      },
      data,
    };
    
    setNodes((nds) => [...nds, newNode]);
    setShowNodeConfigForm(false);
    setSelectedNodeType(null);
  }, [setNodes]);

  const onNodeConfigCancel = useCallback(() => {
    setShowNodeConfigForm(false);
    setSelectedNodeType(null);
  }, []);

  const handleSaveWorkflow = useCallback(() => {
    if (onSave) {
      const workflow: WorkflowState = {
        nodes,
        edges,
        name: workflowName,
        description: workflowDesc,
        selectedNodes: [],
        selectedEdges: []
      };
      onSave(workflow);
    }
  }, [nodes, edges, workflowName, workflowDesc, onSave]);

  return (
    <Box height="100%" width="100%" position="relative">
      <Flex 
        position="absolute" 
        top={0} 
        left={0} 
        right={0} 
        p={4} 
        bg="white" 
        borderBottom="1px" 
        borderColor="gray.200"
        zIndex={10}
        justifyContent="space-between"
        alignItems="center"
      >
        <Heading size="md">{workflowName}</Heading>
        <Button colorScheme="blue" onClick={handleSaveWorkflow}>Save Workflow</Button>
      </Flex>

      <Box 
        position="absolute" 
        top={70} 
        bottom={0} 
        left={0} 
        right={0}
      >
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
        >
          <Background />
          <Controls />
          <MiniMap />
        </ReactFlow>
      </Box>

      <Box 
        position="absolute" 
        top={80} 
        right={10} 
        zIndex={5}
      >
        {!showNodeConfigForm && (
          <NodeTypeSelector onSelectNodeType={onNodeSelect} />
        )}
        
        {showNodeConfigForm && selectedNodeType && (
          <NodeConfigForm 
            nodeType={selectedNodeType}
            onSave={onNodeConfigSave}
            onCancel={onNodeConfigCancel}
          />
        )}
      </Box>
    </Box>
  );
};

export default WorkflowEditor; 