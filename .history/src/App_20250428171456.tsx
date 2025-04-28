import React, { FC, useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Sidebar from './components/layout/Sidebar';
import { AppProvider, useAppContext } from './context/AppContext';
import AppRoutes from './routes';

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
                {children}
            </main>
        </div>
    );
};

const AppContent: FC = () => {
    return (
        <MainLayout>
            <AppRoutes />
        </MainLayout>
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