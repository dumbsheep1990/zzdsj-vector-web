import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AssistantList from '../pages/AssistantList';
import QAManagement from '../pages/QAManagement';
import Datasets from '../pages/Datasets';
import KnowledgeBase from '../pages/KnowledgeBase';
import Vectors from '../pages/Vectors';
import Metadata from '../pages/Metadata';
import Settings from '../pages/Settings';
import Dashboard from '../pages/Dashboard';
import DocumentManagement from '../pages/DocumentManagement';
import DataIntegration from '../pages/DataIntegration';
import AgentTools from '../pages/AgentTools';
import ToolFactory from '../pages/ToolFactory';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/qa-assistant" element={<Navigate to="/qa-assistant/assistant-list" replace />} />
      <Route path="/qa-assistant/assistant-list" element={<AssistantList />} />
      <Route path="/qa-assistant/qa-management" element={<QAManagement />} />
      <Route path="/qa-assistant/datasets" element={<Datasets />} />
      <Route path="/knowledge-base" element={<Navigate to="/knowledge-base/files" replace />} />
      <Route path="/knowledge-base/files" element={<KnowledgeBase />} />
      <Route path="/knowledge-base/vectors" element={<Vectors />} />
      <Route path="/knowledge-base/metadata" element={<Metadata />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/document/:documentId" element={<DocumentManagement />} />
      <Route path="/tool-plaza/data-integration" element={<DataIntegration />} />
      <Route path="/tool-plaza/agent-tools" element={<AgentTools />} />
      <Route path="/tool-plaza/tool-factory" element={<ToolFactory />} />
    </Routes>
  );
};

export default AppRoutes;
