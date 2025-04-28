import React, { FC } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Sidebar from './components/layout/Sidebar';
import { AppProvider } from './context/AppContext';
import AppRoutes from './routes';

/**
 * MainLayout component that wraps the main application layout
 * with sidebar and content area
 */
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
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: '#f9fafb'
            }}>
                <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>
                    {children}
                </div>
            </main>
        </div>
    );
};

/**
 * AppContent component that wraps the routes with the MainLayout
 */
const AppContent: FC = () => {
    return (
        <MainLayout>
            <AppRoutes />
        </MainLayout>
    );
};

/**
 * Main App component that initializes the router and application context
 */
const App: React.FC = () => {
    return (
        <Router>
            <AppProvider>
                <AppContent />
            </AppProvider>
        </Router>
    );
};

export default App;