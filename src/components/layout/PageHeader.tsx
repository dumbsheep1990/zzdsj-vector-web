import React from 'react';
import { ChevronRight } from 'lucide-react';

interface ActionButton {
    icon: React.ReactNode;
    label: string;
    onClick: () => void;
}

interface PageHeaderProps {
    title: string;
    parentTitle?: string;
    description?: string;
    primaryActions?: ActionButton[];
    secondaryActions?: ActionButton[];
    filterComponent?: React.ReactNode;
    searchComponent?: React.ReactNode;
}

const PageHeader: React.FC<PageHeaderProps> = ({
    title,
    parentTitle,
    description,
    primaryActions = [],
    secondaryActions = [],
    filterComponent,
    searchComponent,
}) => {
    return (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50">
            {/* 标题栏 - 与侧边栏完全对齐 */}
            <div style={{
                height: '56px',
                display: 'flex',
                alignItems: 'center',
                padding: '0 1.5rem',
                borderBottom: '1px solid #e5e7eb'
            }}>
                <div className="flex items-center">
                    {parentTitle && (
                        <>
                            <span style={{ fontSize: '15px', color: '#64748b', fontWeight: 500 }}>{parentTitle}</span>
                            <ChevronRight size={16} className="mx-2 text-gray-400" />
                        </>
                    )}
                    <span style={{ 
                        fontSize: '18px',
                        fontWeight: 600,
                        color: '#1e293b',
                        lineHeight: '1'
                    }}>
                        {title}
                    </span>
                    {description && (
                        <span style={{ 
                            fontSize: '15px',
                            color: '#64748b',
                            marginLeft: '1rem',
                            paddingLeft: '1rem',
                            borderLeft: '1px solid #e5e7eb'
                        }}>
                            {description}
                        </span>
                    )}
                </div>
            </div>

            {/* 功能区 */}
            {(searchComponent || filterComponent || primaryActions.length > 0 || secondaryActions.length > 0) && (
                <div style={{
                    padding: '0.75rem 1.5rem',
                    borderBottom: '1px solid #e5e7eb'
                }}>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 flex-1">
                            {searchComponent}
                            {filterComponent}
                        </div>
                        <div className="flex items-center">
                            <div className="flex items-center space-x-3">
                                {secondaryActions.map((action, index) => (
                                    <button
                                        key={index}
                                        onClick={action.onClick}
                                        className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors text-sm"
                                    >
                                        {action.icon && <span className="mr-1.5">{action.icon}</span>}
                                        {action.label}
                                    </button>
                                ))}
                            </div>
                            {primaryActions.length > 0 && (
                                <div className="flex items-center space-x-3 ml-4 pl-4 border-l border-gray-200">
                                    {primaryActions.map((action, index) => (
                                        <button
                                            key={index}
                                            onClick={action.onClick}
                                            className="inline-flex items-center px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
                                        >
                                            {action.icon && <span className="mr-1.5">{action.icon}</span>}
                                            {action.label}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PageHeader;
