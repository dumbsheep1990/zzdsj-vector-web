import React, { FC } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/layout/Sidebar';
import KnowledgeBase from './pages/KnowledgeBase';
import Vectors from './pages/Vectors';
import Metadata from './pages/Metadata';
import Models from './pages/Models';
import AssistantList from './pages/AssistantList';
import AssistantChat from './pages/AssistantChat';
import DataProcessingTools from './pages/DataProcessingTools';
import QAManagement from './pages/QAManagement';
import { AppProvider, useAppContext } from './context/AppContext';

const MainLayout: FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <div style={{ 
            display: 'flex',
            width: '100vw',
            height: '100vh',
            overflow: 'hidden'
        }}>
            <Sidebar />
            <main style={{
                flex: 1,
                minWidth: 0,
                height: '100vh',
                overflow: 'auto',
                backgroundColor: '#f9fafb'
            }}>
                {children}
            </main>
        </div>
    );
};

const AppContent: FC = () => {
    const { state } = useAppContext();
    const { activeSection } = state;

    const renderContent = () => {
        switch (activeSection) {
            case 'knowledge-base':
                return <KnowledgeBase />;
            case 'vectors':
                return <Vectors />;
            case 'metadata':
                return <Metadata />;
            case 'models':
                return <Models />;
            case 'assistant-list':
                return <AssistantList />;
            case 'qa-management':
                return <QAManagement />;
            case 'data-processing-tools':
                return <DataProcessingTools />;
            case 'settings':
                return <div className="flex-1 p-6"><h1 className="text-2xl font-semibold">系统设置（开发中）</h1></div>;
            default:
                return <KnowledgeBase />;
        }
    };

    return (
        <Routes>
            <Route path="/" element={<MainLayout>{renderContent()}</MainLayout>} />
            <Route path="/chat/:assistantId" element={<AssistantChat />} />
            <Route path="/qa-management" element={<MainLayout><QAManagement /></MainLayout>} />
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
};

const App: React.FC = () => {
    return (
        <AppProvider>
            <Router>
                <AppContent />
            </Router>
        </AppProvider>
    );
};

export default App;