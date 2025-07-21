import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AssistantList from '../pages/AssistantList';
import AssistantListRedesigned from '../pages/AssistantListRedesigned';
import QAManagement from '../pages/QAManagement';
import PromptTemplates from '../pages/PromptTemplates';
import Datasets from '../pages/Datasets';
import KnowledgeBase from '../pages/KnowledgeBase';
import SplittingStrategy from '../pages/SplittingStrategy';
import SearchTestPage from '../pages/SearchTestPage';
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
import ToolPlaza from '../pages/ToolPlaza';
// 助手管理页面(原工作流)
import ApplicationOrchestrationPage from '../pages/workflow/ApplicationOrchestrationPage';
import TaskOrchestrationPage from '../pages/workflow/TaskOrchestrationPage';

// 智能体系统页面
import AgentList from '../pages/agent/AgentList';
import AgentDeployment from '../pages/agent/AgentDeployment';
import AgentFlowBuilder from '../pages/agent/AgentFlowBuilder';
import AgentOrchestration from '../pages/AgentOrchestration';

// 智能报告系统页面
import IntelligentReportsLayout from '../components/layout/IntelligentReportsLayout';
import NextReportInterface from '../pages/intelligent-reports/NextReportInterface';
import ReportList from '../pages/intelligent-reports/ReportList';
import ReportTemplates from '../pages/intelligent-reports/ReportTemplates';
import TaskManagement from '../pages/intelligent-reports/TaskManagement';
import AgentCollaboration from '../pages/intelligent-reports/AgentCollaboration';
import ReportDetail from '../pages/intelligent-reports/ReportDetail';

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
          <AssistantListRedesigned />
        </AuthGuard>
      } />
      <Route path="/qa-assistant/assistant-list-old" element={
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
      <Route path="/knowledge-base/splitting-strategy" element={
        <AuthGuard>
          <SplittingStrategy />
        </AuthGuard>
      } />
      <Route path="/knowledge-base/search-test" element={
        <AuthGuard>
          <SearchTestPage />
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
          <Navigate to="/tool-plaza/home" replace />
        </AuthGuard>
      } />
      <Route path="/tool-plaza/home" element={
        <AuthGuard>
          <ToolPlaza />
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
      <Route path="/agent-system/deployment" element={
        <AuthGuard>
          <AgentDeployment />
        </AuthGuard>
      } />
      
      <Route path="/agent-system/flow-builder" element={
        <AuthGuard>
          <AgentFlowBuilder />
        </AuthGuard>
      } />
      
      <Route path="/agent-orchestration" element={
        <AuthGuard>
          <AgentOrchestration />
        </AuthGuard>
      } />
      
      {/* 智能报告路由 */}
      <Route path="/intelligent-reports" element={
        <AuthGuard>
          <IntelligentReportsLayout>
            <NextReportInterface />
          </IntelligentReportsLayout>
        </AuthGuard>
      } />
      <Route path="/intelligent-reports/nextreport" element={
        <AuthGuard>
          <IntelligentReportsLayout>
            <NextReportInterface />
          </IntelligentReportsLayout>
        </AuthGuard>
      } />
      <Route path="/intelligent-reports/report-list" element={
        <AuthGuard>
          <IntelligentReportsLayout>
            <ReportList />
          </IntelligentReportsLayout>
        </AuthGuard>
      } />
      <Route path="/intelligent-reports/report-templates" element={
        <AuthGuard>
          <IntelligentReportsLayout>
            <ReportTemplates />
          </IntelligentReportsLayout>
        </AuthGuard>
      } />
      <Route path="/intelligent-reports/task-management" element={
        <AuthGuard>
          <IntelligentReportsLayout>
            <TaskManagement />
          </IntelligentReportsLayout>
        </AuthGuard>
      } />
      <Route path="/intelligent-reports/agent-collaboration" element={
        <AuthGuard>
          <IntelligentReportsLayout>
            <AgentCollaboration />
          </IntelligentReportsLayout>
        </AuthGuard>
      } />
      <Route path="/intelligent-reports/report/:reportId" element={
        <AuthGuard>
          <IntelligentReportsLayout>
            <ReportDetail />
          </IntelligentReportsLayout>
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
