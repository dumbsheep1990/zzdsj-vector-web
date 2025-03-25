import React, { FC } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Sidebar from './components/layout/Sidebar';
import KnowledgeBase from './pages/KnowledgeBase';
import Vectors from './pages/Vectors';
import Metadata from './pages/Metadata';
import Models from './pages/Models';
import AssistantList from './pages/AssistantList';
import DataProcessingTools from './pages/DataProcessingTools';
import { AppProvider, useAppContext } from './context/AppContext';

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
            case 'data-processing-tools':
                return <DataProcessingTools />;
            case 'settings':
                return <div className="flex-1 p-6"><h1 className="text-2xl font-semibold">系统设置（开发中）</h1></div>;
            default:
                return <KnowledgeBase />;
        }
    };

    return (
        <div className="flex h-screen bg-gray-50">
            <Sidebar />
            {renderContent()}
        </div>
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