import React from 'react';

// Define types for graph data
export interface GraphNode {
  id: string;
  name: string;
  group: number;
  val: number;
  color?: string;
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
  fx?: number;
  fy?: number;
}

export interface GraphLink {
  source: string;
  target: string;
  value: number;
}

export interface GraphData {
  nodes: GraphNode[];
  links: GraphLink[];
}

export interface DetailPanelProps {
  title?: string;
  onClose?: () => void;
  className?: string;
  children?: React.ReactNode;
  selectedItem?: any;
  setSelectedItem?: (item: any) => void;
  activeSection?: string;
}
