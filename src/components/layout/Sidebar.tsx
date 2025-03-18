import React, { useState } from 'react';
import { Database, ChevronRight, FileText, Code, Grid, Settings, ChevronDown } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { navigationItems } from '../../utils/mockData';

const getIconByType = (iconType: string, size: number = 20) => {
    switch (iconType) {
        case 'FileText':
            return <FileText size={size} />;
        case 'Code':
            return <Code size={size} />;
        case 'Grid':
            return <Grid size={size} />;
        case 'Database':
            return <Database size={size} />;
        case 'Settings':
            return <Settings size={size} />;
        default:
            return <FileText size={size} />;
    }
};

interface NavigationItem {
    id: string;
    label: string;
    iconType: string;
    children?: NavigationItem[];
}

const Sidebar: React.FC = () => {
    const { state, setActiveSection, toggleSidebar } = useAppContext();
    const { activeSection, sidebarExpanded } = state;
    const [expandedItems, setExpandedItems] = useState<string[]>(['files']);

    const toggleExpanded = (itemId: string) => {
        setExpandedItems(prev => 
            prev.includes(itemId) 
                ? prev.filter(id => id !== itemId)
                : [...prev, itemId]
        );
    };

    const sidebarStyle = {
        background: 'linear-gradient(180deg, #f0f9ff 0%, #e6f7ff 50%, #dcf2ff 100%)',
        borderRight: '1px solid #e5e7eb',
        width: sidebarExpanded ? '16rem' : '5rem',
        display: 'flex',
        flexDirection: 'column' as const,
        transition: 'width 0.3s ease'
    };

    const logoContainerStyle = {
        height: '56px',
        display: 'flex',
        alignItems: 'center',
        padding: '0 1rem',
        borderBottom: '1px solid #e5e7eb'
    };

    const navStyle = {
        flex: 1,
        paddingTop: '0.5rem'
    };

    const getNavItemStyle = (isActive: boolean, isChild: boolean = false) => ({
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        height: '40px',
        padding: '0 1rem',
        paddingLeft: isChild ? '2rem' : '1rem',
        background: isActive 
            ? 'linear-gradient(90deg, #eff6ff 0%, #dbeafe 100%)'
            : 'transparent',
        color: isActive ? '#2563eb' : '#4b5563',
        cursor: 'pointer',
        fontSize: isChild ? '15px' : '16px',
        transition: 'all 0.2s ease'
    });

    const iconContainerStyle = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%'
    };

    const footerStyle = {
        padding: '1rem',
        borderTop: '1px solid #e5e7eb'
    };

    const renderNavItem = (item: NavigationItem, isChild: boolean = false) => {
        const isActive = activeSection === item.id;
        const isExpanded = expandedItems.includes(item.id);
        const hasChildren = item.children && item.children.length > 0;

        const currentStyle = getNavItemStyle(isActive, isChild);
        const hoverStyle = !isActive ? {
            background: 'linear-gradient(90deg, #f8fafc 0%, #f1f5f9 100%)',
            color: '#2563eb'
        } : {};

        return (
            <li key={item.id}>
                <button
                    style={currentStyle}
                    onMouseEnter={(e) => {
                        const target = e.currentTarget;
                        Object.assign(target.style, hoverStyle);
                    }}
                    onMouseLeave={(e) => {
                        const target = e.currentTarget;
                        Object.assign(target.style, currentStyle);
                    }}
                    onClick={() => {
                        if (hasChildren) {
                            toggleExpanded(item.id);
                        } else {
                            setActiveSection(item.id);
                        }
                    }}
                >
                    <span style={iconContainerStyle}>
                        <span style={{ display: 'flex', alignItems: 'center' }}>
                            <span style={{ 
                                display: 'flex',
                                alignItems: 'center',
                                color: isActive ? '#2563eb' : '#64748b'
                            }}>
                                {getIconByType(item.iconType)}
                            </span>
                            {sidebarExpanded && (
                                <span style={{ 
                                    marginLeft: '0.75rem',
                                    fontSize: isChild ? '15px' : '16px',
                                    color: isActive ? '#2563eb' : '#4b5563',
                                    fontWeight: isActive ? 500 : 400
                                }}>
                                    {item.label}
                                </span>
                            )}
                        </span>
                        {hasChildren && sidebarExpanded && (
                            <ChevronDown
                                size={16}
                                style={{
                                    transform: isExpanded ? 'rotate(180deg)' : 'none',
                                    transition: 'transform 0.3s ease',
                                    color: isActive ? '#2563eb' : '#64748b'
                                }}
                            />
                        )}
                    </span>
                </button>
                {hasChildren && isExpanded && sidebarExpanded && (
                    <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                        {item.children.map((child: NavigationItem) => renderNavItem(child, true))}
                    </ul>
                )}
            </li>
        );
    };

    return (
        <div style={sidebarStyle}>
            {/* Logo区域 */}
            <div style={logoContainerStyle}>
                <Database color="#2563eb" size={24} />
                {sidebarExpanded && (
                    <span style={{ 
                        marginLeft: '0.75rem',
                        fontSize: '1.125rem',
                        fontWeight: 600,
                        color: '#1e293b'
                    }}>
                        智政智脑
                    </span>
                )}
                <button
                    style={{ 
                        marginLeft: 'auto',
                        color: '#9ca3af',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '4px'
                    }}
                    onClick={toggleSidebar}
                >
                    <ChevronRight
                        size={20}
                        style={{ 
                            transform: sidebarExpanded ? 'none' : 'rotate(180deg)',
                            transition: 'transform 0.3s ease'
                        }}
                    />
                </button>
            </div>

            {/* 导航菜单 */}
            <nav style={navStyle}>
                <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                    {(navigationItems as NavigationItem[]).map(item => renderNavItem(item))}
                </ul>
            </nav>

            {/* 底部用户信息 */}
            <div style={footerStyle}>
                {sidebarExpanded ? (
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <div style={{ 
                            width: '2rem', 
                            height: '2rem', 
                            borderRadius: '9999px', 
                            backgroundColor: '#2563eb',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontSize: '14px'
                        }}>
                            A
                        </div>
                        <div style={{ marginLeft: '0.75rem' }}>
                            <div style={{ fontSize: '14px', fontWeight: 500, color: '#1e293b' }}>管理员</div>
                            <div style={{ fontSize: '12px', color: '#64748b' }}>admin@example.com</div>
                        </div>
                    </div>
                ) : (
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <div style={{ 
                            width: '2rem', 
                            height: '2rem', 
                            borderRadius: '9999px', 
                            backgroundColor: '#2563eb',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontSize: '14px'
                        }}>
                            A
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Sidebar;