import { Node, Edge } from '@xyflow/react';

export interface AgentConfig {
  tools?: ToolConfig[];
  maxTokens?: number;
  temperature?: number;
  systemPrompt?: string;
}

export interface ToolConfig {
  id: string;
  name: string;
  description?: string;
  parameters?: any;
}

export interface ApplicationConfig {
  endpoint?: string;
  apiKey?: string;
}

export interface NodeData {
  id: string;
  label: string;
  type: 'agent' | 'tool' | 'application';
  config?: AgentConfig | ToolConfig | ApplicationConfig;
}

export type CustomNode = Node<NodeData>;
export type CustomEdge = Edge;

export interface WorkflowState {
  nodes: CustomNode[];
  edges: CustomEdge[];
  selectedNodeId: string | null;
}

export interface AgentOption {
  id: string;
  name: string;
  description: string;
}

export interface ToolOption {
  id: string;
  name: string;
  description: string;
  parameters?: any;
}

export interface SavedWorkflow {
  id: string;
  name: string;
  description?: string;
  nodes: CustomNode[];
  edges: CustomEdge[];
  createdAt: string;
  updatedAt: string;
} 