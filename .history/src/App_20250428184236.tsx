import React, { FC } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Sidebar from './components/layout/Sidebar';
import PageHeader from './components/layout/PageHeader';
import { AppProvider, useAppContext } from './context/AppContext';
import AppRoutes from './routes';
import { navigationItems } from './utils/mockData';
import { NavItem } from './utils/types';

// Helper function to find item label by ID recursively
const findLabelById = (items: NavItem[], id: string): string | null => {
    for (const item of items) {
        if (item.id === id) {
            return item.label;
        }
        if (item.children) {
            const foundLabel = findLabelById(item.children, id);
            if (foundLabel) {
                return foundLabel;
            }
        }
    }
    return null;
};

const MainLayout: FC<{ children: React.ReactNode }> = ({ children }) => {
    const { state } = useAppContext();
    const { activeSection } = state;

    // Determine the title based on activeSection
    const title = findLabelById(navigationItems, activeSection) || 'Dashboard';

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

const AppContent: FC = () => {
    return (
        <MainLayout>
            <AppRoutes />
        </MainLayout>
    );
};

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