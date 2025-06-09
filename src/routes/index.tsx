import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AssistantList from '../pages/AssistantList';
import QAManagement from '../pages/QAManagement';
import PromptTemplates from '../pages/PromptTemplates';
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
import SecuritySettings from '../pages/SecuritySettings';
import GraphDatabase from '../pages/GraphDatabase';
import GraphPreview from '../pages/GraphPreview';
import MCPCenter from '../pages/MCPCenter';
import DataProcessingTools from '../pages/DataProcessingTools';
import ApplicationOrchestrationPage from '../pages/workflow/ApplicationOrchestrationPage';
import TaskOrchestrationPage from '../pages/workflow/TaskOrchestrationPage';

// 智能体系统页面
import AgentList from '../pages/agent/AgentList';
import AgentBuilder from '../pages/agent/AgentBuilder';
import AgentTemplate from '../pages/agent/AgentTemplate';
import AgentDeployment from '../pages/agent/AgentDeployment';

import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import AuthGuard from '../components/auth/AuthGuard';
import { useAuth } from '../context/AuthContext';

const AppRoutes: React.FC = () => {
  const { authState } = useAuth();

  // 将已认证用户从登录/注册页面重定向走
  const AuthRedirect: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return authState.isAuthenticated 
      ? <Navigate to="/dashboard" replace /> 
      : <>{children}</>;
  };

  return (
    <Routes>
      {/* 公开路由（不需要认证） */}
      <Route path="/login" element={
        <AuthRedirect>
          <Login />
        </AuthRedirect>
      } />
      <Route path="/register" element={
        <AuthRedirect>
          <Register />
        </AuthRedirect>
      } />

      {/* 默认重定向 */}
      <Route path="/" element={
        authState.isAuthenticated 
          ? <Navigate to="/dashboard" replace /> 
          : <Navigate to="/login" replace />
      } />

      {/* 需要认证的路由 */}
      <Route path="/dashboard" element={
        <AuthGuard>
          <Dashboard />
        </AuthGuard>
      } />
      
      <Route path="/qa-assistant" element={
        <AuthGuard>
          <Navigate to="/qa-assistant/assistant-list" replace />
        </AuthGuard>
      } />
      <Route path="/qa-assistant/assistant-list" element={
        <AuthGuard>
          <AssistantList />
        </AuthGuard>
      } />
      <Route path="/qa-assistant/qa-management" element={
        <AuthGuard>
          <QAManagement />
        </AuthGuard>
      } />
      <Route path="/qa-assistant/prompt-templates" element={
        <AuthGuard>
          <PromptTemplates />
        </AuthGuard>
      } />
      <Route path="/qa-assistant/datasets" element={
        <AuthGuard>
          <Datasets />
        </AuthGuard>
      } />
      
      <Route path="/knowledge-base" element={
        <AuthGuard>
          <Navigate to="/knowledge-base/files" replace />
        </AuthGuard>
      } />
      <Route path="/knowledge-base/files" element={
        <AuthGuard>
          <KnowledgeBase />
        </AuthGuard>
      } />
      <Route path="/knowledge-base/vectors" element={
        <AuthGuard>
          <Vectors />
        </AuthGuard>
      } />
      <Route path="/knowledge-base/metadata" element={
        <AuthGuard>
          <Metadata />
        </AuthGuard>
      } />
      
      <Route path="/knowledge-graph" element={
        <AuthGuard>
          <Navigate to="/knowledge-graph/database" replace />
        </AuthGuard>
      } />
      <Route path="/knowledge-graph/database" element={
        <AuthGuard>
          <GraphDatabase />
        </AuthGuard>
      } />
      <Route path="/knowledge-graph/preview" element={
        <AuthGuard>
          <GraphPreview />
        </AuthGuard>
      } />
      
      <Route path="/settings" element={
        <AuthGuard>
          <Navigate to="/settings/basic" replace />
        </AuthGuard>
      } />
      <Route path="/settings/basic" element={
        <AuthGuard>
          <BasicSettings />
        </AuthGuard>
      } />
      <Route path="/settings/model" element={
        <AuthGuard>
          <ModelSettings />
        </AuthGuard>
      } />
      <Route path="/settings/security" element={
        <AuthGuard>
          <SecuritySettings />
        </AuthGuard>
      } />
      
      <Route path="/tool-plaza" element={
        <AuthGuard>
          <Navigate to="/tool-plaza/data-integration" replace />
        </AuthGuard>
      } />
      <Route path="/tool-plaza/data-integration" element={
        <AuthGuard>
          <DataIntegration />
        </AuthGuard>
      } />
      <Route path="/tool-plaza/agent-tools" element={
        <AuthGuard>
          <AgentTools />
        </AuthGuard>
      } />
      <Route path="/tool-plaza/tool-factory" element={
        <AuthGuard>
          <ToolFactory />
        </AuthGuard>
      } />
      <Route path="/tool-plaza/mcp" element={
        <AuthGuard>
          <MCPCenter />
        </AuthGuard>
      } />
      <Route path="/tool-plaza/data-processing" element={
        <AuthGuard>
          <DataProcessingTools />
        </AuthGuard>
      } />
      
      <Route path="/workflow" element={
        <AuthGuard>
          <Navigate to="/workflow/application-orchestration" replace />
        </AuthGuard>
      } />
      <Route path="/workflow/application-orchestration" element={
        <AuthGuard>
          <ApplicationOrchestrationPage />
        </AuthGuard>
      } />
      <Route path="/workflow/task-orchestration" element={
        <AuthGuard>
          <TaskOrchestrationPage />
        </AuthGuard>
      } />
      
      <Route path="/agent-system" element={
        <AuthGuard>
          <Navigate to="/agent-system/list" replace />
        </AuthGuard>
      } />
      <Route path="/agent-system/list" element={
        <AuthGuard>
          <AgentList />
        </AuthGuard>
      } />
      <Route path="/agent-system/builder" element={
        <AuthGuard>
          <AgentBuilder />
        </AuthGuard>
      } />
      <Route path="/agent-system/template" element={
        <AuthGuard>
          <AgentTemplate />
        </AuthGuard>
      } />
      <Route path="/agent-system/deployment" element={
        <AuthGuard>
          <AgentDeployment />
        </AuthGuard>
      } />
      
      <Route path="/document/:documentId" element={
        <AuthGuard>
          <DocumentManagement />
        </AuthGuard>
      } />
      
      {/* 通配符路由 */}
      <Route path="*" element={
        authState.isAuthenticated 
          ? <Navigate to="/dashboard" replace /> 
          : <Navigate to="/login" replace />
      } />
    </Routes>
  );
};

export default AppRoutes;
