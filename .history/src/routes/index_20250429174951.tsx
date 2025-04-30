import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AssistantList from '../pages/AssistantList';
import QAManagement from '../pages/QAManagement';
import Datasets from '../pages/Datasets';
import KnowledgeBase from '../pages/KnowledgeBase';
import Vectors from '../pages/Vectors';
import Metadata from '../pages/Metadata';
import Dashboard from '../pages/Dashboard';
import DocumentManagement from '../pages/DocumentManagement';
import DataIntegration from '../pages/DataIntegration';
import AgentTools from '../pages/AgentTools';
import ToolFactory from '../pages/ToolFactory';
import BasicSettings from '../pages/BasicSettings';
import ModelSettings from '../pages/ModelSettings';
import GraphDatabase from '../pages/GraphDatabase';
import GraphPreview from '../pages/GraphPreview';
import MCPCenter from '../pages/MCPCenter';
import DataProcessingTools from '../pages/DataProcessingTools';
import ApplicationOrchestrationPage from '../pages/workflow/ApplicationOrchestrationPage';
import TaskOrchestrationPage from '../pages/workflow/TaskOrchestrationPage';

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
      <Route path="/knowledge-graph" element={<Navigate to="/knowledge-graph/database" replace />} />
      <Route path="/knowledge-graph/database" element={<GraphDatabase />} />
      <Route path="/knowledge-graph/preview" element={<GraphPreview />} />
      <Route path="/settings" element={<Navigate to="/settings/basic" replace />} />
      <Route path="/settings/basic" element={<BasicSettings />} />
      <Route path="/settings/model" element={<ModelSettings />} />
      <Route path="/tool-plaza" element={<Navigate to="/tool-plaza/data-integration" replace />} />
      <Route path="/tool-plaza/data-integration" element={<DataIntegration />} />
      <Route path="/tool-plaza/agent-tools" element={<AgentTools />} />
      <Route path="/tool-plaza/tool-factory" element={<ToolFactory />} />
      <Route path="/tool-plaza/mcp" element={<MCPCenter />} />
      <Route path="/tool-plaza/data-processing" element={<DataProcessingTools />} />
      <Route path="/workflow" element={<Navigate to="/workflow/application-orchestration" replace />} />
      <Route path="/workflow/application-orchestration" element={<ApplicationOrchestrationPage />} />
      <Route path="/workflow/task-orchestration" element={<TaskOrchestrationPage />} />
      <Route path="/document/:documentId" element={<DocumentManagement />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default AppRoutes;
