import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
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

    // 监听URL变化，更新activeSection
    useEffect(() => {
        const path = location.pathname;
        let matchedSection = 'dashboard'; // 默认值
        
        // 查找匹配的部分
        for (const [routePath, section] of Object.entries(pathToSectionMap)) {
            if (path.startsWith(routePath)) {
                matchedSection = section;
                break;
            }
        }
        
        if (matchedSection !== state.activeSection) {
            setState(prev => ({ ...prev, activeSection: matchedSection }));
        }
    }, [location.pathname, state.activeSection]);

    // 更新当前活动栏目
    const setActiveSection = (section: string) => {
        console.log('Setting activeSection to:', section);
        setState(prev => ({ ...prev, activeSection: section }));
        
        // 如果部分有对应的路径，则更新URL（但不刷新页面）
        if (sectionToPathMap[section]) {
            navigate(sectionToPathMap[section], { replace: true });
        }
    };

    // 更新当前活动子栏目
    const setActiveSubSection = (section: string) => {
        console.log('Setting activeSubSection to:', section);
        setState(prev => ({ ...prev, activeSubSection: section }));
    };

    // 切换侧边栏展开状态
    const toggleSidebar = () => {
        setState(prev => ({ ...prev, sidebarExpanded: !prev.sidebarExpanded }));
    };

    // 切换暗黑模式
    const toggleDarkMode = () => {
        setState(prev => ({ ...prev, darkMode: !prev.darkMode }));
    };

    return (
        <AppContext.Provider value={{ state, setActiveSection, setActiveSubSection, toggleSidebar, toggleDarkMode }}>
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
