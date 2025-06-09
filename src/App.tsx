import React, { FC, useEffect, useState } from 'react';
import { BrowserRouter as Router, useLocation, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/layout/Sidebar';
import { AppProvider } from './context/AppContext';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './context/AuthContext';
import AppRoutes from './routes';
import { zIndexLevels } from './styles/zIndexLevels';
import { ToastProvider } from './components/Toast';

/**
 * 创建一个Portal容器用于渲染弹出层内容，确保它们不受页面模糊效果的影响
 */
const setupPortalContainer = () => {
    // 检查是否已经存在
    let portalContainer = document.getElementById('portal-container');
    if (!portalContainer) {
        portalContainer = document.createElement('div');
        portalContainer.id = 'portal-container';
        portalContainer.style.position = 'fixed';
        portalContainer.style.top = '0';
        portalContainer.style.left = '0';
        portalContainer.style.width = '100%';
        portalContainer.style.height = '100%';
        portalContainer.style.pointerEvents = 'none';
        portalContainer.style.zIndex = `${zIndexLevels.DIALOG}`;
        document.body.appendChild(portalContainer);
    }
    return portalContainer;
};

/**
 * MainLayout component that wraps the main application layout
 * with sidebar and content area
 */
const MainLayout: FC<{ children: React.ReactNode }> = ({ children }) => {
    useEffect(() => {
        // 确保portal容器存在
        setupPortalContainer();
    }, []);

    return (
        <div style={{ 
            display: 'flex',
            width: '100vw',
            height: '100vh',
            overflow: 'hidden',
            position: 'relative',
            zIndex: zIndexLevels.BASE
        }}>
            {/* 侧边栏容器，使用较低的z-index确保不会遮挡模态框 */}
            <div style={{ 
                position: 'relative', 
                zIndex: zIndexLevels.SIDEBAR 
            }}>
                <Sidebar />
            </div>
            <main style={{
                flex: 1,
                minWidth: 0,
                height: '100vh',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: '#f9fafb',
                position: 'relative',
                zIndex: zIndexLevels.CONTENT
            }}>
                <div style={{ 
                    flex: 1, 
                    overflowY: 'auto', 
                    overflowX: 'hidden',
                    position: 'relative'
                }}>
                    {children}
                </div>
            </main>
        </div>
    );
};

/**
 * Main App component that initializes the router and application context
 */
const App: React.FC = () => {
    return (
        <Router>
            <AuthProvider>
                <AppProvider>
                    <ToastProvider>
                        <AppContent />
                    </ToastProvider>
                </AppProvider>
            </AuthProvider>
        </Router>
    );
};

/**
 * 内部组件，用于包装基于路由条件的内容
 */
const RouteWrapper: FC = () => {
    const location = useLocation();
    const { authState } = useAuth();
    const [currentLayout, setCurrentLayout] = useState<'auth' | 'main'>('auth');
    
    // 使用Effect来处理布局变化，确保在认证状态或路由变化时正确更新
    useEffect(() => {
        const isAuthPath = location.pathname === '/login' || location.pathname === '/register';
        
        // 如果用户已登录并且在认证页面，应该使用主布局
        // 如果用户未登录但不在认证页面，也使用主布局但可能会被重定向到登录页
        // 只有未登录且在认证页面时才使用认证布局
        if ((authState.isAuthenticated && !isAuthPath) || (!authState.isAuthenticated && !isAuthPath)) {
            setCurrentLayout('main');
        } else if (!authState.isAuthenticated && isAuthPath) {
            setCurrentLayout('auth');
        } else if (authState.isAuthenticated && isAuthPath) {
            // 用户已登录但仍在登录/注册页，应该跳转到主页面
            setCurrentLayout('main');
        }
    }, [location.pathname, authState.isAuthenticated]);
    
    // 根据当前布局状态渲染
    return currentLayout === 'auth' 
        ? <AppRoutes />
        : (
            <MainLayout>
                <AppRoutes />
            </MainLayout>
        );
};

/**
 * AppContent component that conditionally wraps the routes with the MainLayout
 * Login and Register pages don't use the MainLayout to achieve full-screen effect
 */
const AppContent: FC = () => {
    return <RouteWrapper />;
};

export default App;