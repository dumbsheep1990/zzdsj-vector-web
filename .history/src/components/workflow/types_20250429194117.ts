import { Node, Edge } from '@xyflow/react';

export interface AgentConfig {
  id: string;
  name: string;
  description: string;
  tools: ToolConfig[];
  maxTokens?: number;
  temperature?: number;
  systemPrompt?: string;
}

export interface ToolConfig {
  id: string;
  name: string;
  description: string;
  parameters: Record<string, unknown>;
}

export interface ApplicationConfig {
  id: string;
  name: string;
  description: string;
  endpoint?: string;
  apiKey?: string;
}

export interface NodeData {
  id: string;
  type: string;
  label: string;
  config: AgentConfig | ToolConfig | ApplicationConfig | Record<string, unknown>;
}

export type CustomNode = {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: NodeData;
};

export type CustomEdge = {
  id: string;
  source: string;
  target: string;
  type?: string;
  animated?: boolean;
  label?: string;
};

export interface WorkflowState {
  nodes: CustomNode[];
  edges: CustomEdge[];
  name: string;
  description: string;
  selectedNodes: string[];
  selectedEdges: string[];
}

export interface AgentOption {
  value: string;
  label: string;
  description: string;
}

export interface ToolOption {
  value: string;
  label: string;
  description: string;
}

export interface SavedWorkflow {
  id: string;
  name: string;
  description: string;
  nodes: CustomNode[];
  edges: CustomEdge[];
  createdAt: string;
  updatedAt: string;
} 