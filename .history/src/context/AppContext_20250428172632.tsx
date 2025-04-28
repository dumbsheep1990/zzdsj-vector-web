import React, { createContext, useContext, useState, ReactNode, useEffect, useRef, useCallback, useMemo } from 'react';
import { AppState } from '../utils/types';
import { useLocation, useNavigate } from 'react-router-dom';

// 创建上下文的默认值
const defaultState: AppState = {
    activeSection: 'dashboard',
    activeSubSection: 'model-services',
    sidebarExpanded: true,
    darkMode: false,
    username: '管理员',
};

// 路径到部分的映射
const pathToSectionMap: Record<string, string> = {
    '/dashboard': 'dashboard',
    '/qa-assistant/assistant-list': 'assistant-list',
    '/qa-assistant/qa-management': 'qa-management',
    '/knowledge-base/files': 'knowledge-base',
    '/knowledge-base/vectors': 'vectors',
    '/knowledge-base/metadata': 'metadata',
    '/knowledge-graph/database': 'graph-database',
    '/knowledge-graph/preview': 'graph-preview',
    '/settings/basic': 'basic-settings',
    '/settings/model': 'model-settings',
    '/tool-plaza/agent-tools': 'agent-tools',
    '/tool-plaza/tool-factory': 'tool-factory',
    '/tool-plaza/mcp': 'mcp-center',
    '/tool-plaza/data-processing': 'data-processing-tools',
};

// 部分到路径的映射
const sectionToPathMap: Record<string, string> = {
    'dashboard': '/dashboard',
    'assistant-list': '/qa-assistant/assistant-list',
    'qa-management': '/qa-assistant/qa-management',
    'knowledge-base': '/knowledge-base/files',
    'vectors': '/knowledge-base/vectors',
    'metadata': '/knowledge-base/metadata',
    'graph-database': '/knowledge-graph/database',
    'graph-preview': '/knowledge-graph/preview',
    'basic-settings': '/settings/basic',
    'model-settings': '/settings/model',
    'agent-tools': '/tool-plaza/agent-tools',
    'tool-factory': '/tool-plaza/tool-factory',
    'mcp-center': '/tool-plaza/mcp',
    'data-processing-tools': '/tool-plaza/data-processing',
};

// 创建上下文类型
interface AppContextType {
    state: AppState;
    setActiveSection: (section: string) => void;
    setActiveSubSection: (section: string) => void;
    toggleSidebar: () => void;
    toggleDarkMode: () => void;
}

// 创建上下文
const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [state, setState] = useState<AppState>(defaultState);
    const location = useLocation();
    const navigate = useNavigate();
    
    // 保存上一次的路径，避免循环导航
    const lastPathRef = useRef(location.pathname);

    // 监听URL变化，更新activeSection
    useEffect(() => {
        // 避免初始化时的不必要更新
        if (lastPathRef.current === location.pathname) {
            return;
        }
        lastPathRef.current = location.pathname;
        
        const path = location.pathname;
        let matchedSection = null;
        
        // 查找匹配的部分
        for (const [routePath, section] of Object.entries(pathToSectionMap)) {
            if (path.startsWith(routePath)) {
                matchedSection = section;
                break;
            }
        }
        
        if (matchedSection && matchedSection !== state.activeSection) {
            // 使用函数式更新确保使用最新的state
            setState(prev => ({
                ...prev,
                activeSection: matchedSection
            }));
        }
    }, [location.pathname]);

    // 更新当前活动栏目，使用useCallback避免不必要的函数重新创建
    const setActiveSection = useCallback((section: string) => {
        console.log('Setting activeSection to:', section);
        
        // 如果部分有对应的路径且不同于当前路径，才进行导航
        if (sectionToPathMap[section] && lastPathRef.current !== sectionToPathMap[section]) {
            lastPathRef.current = sectionToPathMap[section]; // 提前更新引用值以避免循环
            setState(prev => ({ ...prev, activeSection: section }));
            navigate(sectionToPathMap[section], { replace: true });
        } else if (section !== state.activeSection) {
            // 如果只是切换activeSection而不导航
            setState(prev => ({ ...prev, activeSection: section }));
        }
    }, [navigate, state.activeSection]);

    // 更新当前活动子栏目
    const setActiveSubSection = useCallback((section: string) => {
        console.log('Setting activeSubSection to:', section);
        setState(prev => ({ ...prev, activeSubSection: section }));
    }, []);

    // 切换侧边栏展开状态
    const toggleSidebar = useCallback(() => {
        setState(prev => ({ ...prev, sidebarExpanded: !prev.sidebarExpanded }));
    }, []);

    // 切换暗黑模式
    const toggleDarkMode = useCallback(() => {
        setState(prev => ({ ...prev, darkMode: !prev.darkMode }));
    }, []);

    // 使用useMemo优化context value，减少不必要的重渲染
    const contextValue = useMemo(() => ({
        state,
        setActiveSection,
        setActiveSubSection,
        toggleSidebar,
        toggleDarkMode
    }), [state, setActiveSection, setActiveSubSection, toggleSidebar, toggleDarkMode]);

    return (
        <AppContext.Provider value={contextValue}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
};
