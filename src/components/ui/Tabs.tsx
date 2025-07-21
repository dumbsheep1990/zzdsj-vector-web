import React from 'react';

interface TabsContainerProps {
    children: React.ReactNode;
    className?: string;
}

interface TabButtonProps {
    children: React.ReactNode;
    active: boolean;
    onClick: () => void;
    className?: string;
}

// 新的 Tabs 组件接口
interface TabItem {
    id: string;
    label: string;
    icon?: React.ComponentType<{ className?: string }>;
}

interface TabsProps {
    tabs: TabItem[];
    activeTab: string;
    onTabChange: (tabId: string) => void;
    className?: string;
}

export const TabsContainer: React.FC<TabsContainerProps> = ({ children, className }) => {
    return (
        <div className={`inline-flex items-center justify-center h-full w-auto space-x-1 ${className || ''}`}>
            {children}
        </div>
    );
};

export const TabButton: React.FC<TabButtonProps> = ({ children, active, onClick, className }) => {
    return (
        <button
            className={`
                h-full px-4 flex items-center justify-center font-medium text-sm transition-all duration-200 ease-in-out
                ${active ? 
                    'bg-white text-blue-600 shadow-sm rounded-md border border-gray-200' : 
                    'text-gray-600 hover:bg-gray-50 rounded-md'}
                ${className || ''}
            `}
            onClick={onClick}
        >
            {children}
        </button>
    );
};

// 新的 Tabs 组件
const Tabs: React.FC<TabsProps> = ({ tabs, activeTab, onTabChange, className }) => {
    return (
        <div className={`border-b border-gray-200 ${className || ''}`}>
            <nav className="flex space-x-8">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => onTabChange(tab.id)}
                            className={`
                                py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200
                                ${activeTab === tab.id
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }
                            `}
                        >
                            <div className="flex items-center gap-2">
                                {Icon && <Icon className="w-4 h-4" />}
                                {tab.label}
                            </div>
                        </button>
                    );
                })}
            </nav>
        </div>
    );
};

export default Tabs;
export { Tabs };
