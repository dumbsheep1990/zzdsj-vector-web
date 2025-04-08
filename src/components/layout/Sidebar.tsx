import React, { useState } from 'react';
import { 
    ChevronDown, 
    ChevronRight, 
    Database, 
    FileText, 
    Grid, 
    Settings, 
    HelpCircle, 
    BookOpen, 
    Code, 
    Layers, 
    FileType, 
    Search,
    Users,
    MessageCircle,
    BarChart2,
    Wrench
} from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { navigationItems } from '../../utils/mockData';

interface NavigationItem {
    id: string;
    label: string;
    iconType: string;
    children?: NavigationItem[];
}

const Sidebar: React.FC = () => {
    const { state, setActiveSection, toggleSidebar } = useAppContext();
    const { activeSection, sidebarExpanded } = state;
    const [expandedItems, setExpandedItems] = useState<string[]>(['qa-management', 'knowledge-base']);

    const toggleExpanded = (itemId: string) => {
        if (expandedItems.includes(itemId)) {
            setExpandedItems(expandedItems.filter(id => id !== itemId));
        } else {
            setExpandedItems([...expandedItems, itemId]);
        }
    };

    // 根据图标类型返回对应的图标组件
    const getIconByType = (iconType: string, size: number = 18) => {
        switch (iconType) {
            case 'Database':
                return <Database size={size} />;
            case 'FileText':
                return <FileText size={size} />;
            case 'Grid':
                return <Grid size={size} />;
            case 'Settings':
                return <Settings size={size} />;
            case 'HelpCircle':
                return <HelpCircle size={size} />;
            case 'Library':
            case 'BookOpen':
                return <BookOpen size={size} />;
            case 'Code':
                return <Code size={size} />;
            case 'Search':
                return <Search size={size} />;
            case 'FileType':
                return <FileType size={size} />;
            case 'Wrench':
                return <Wrench size={size} />;
            case 'Layers':
                return <Layers size={size} />;
            case 'Users':
                return <Users size={size} />;
            case 'MessageCircle':
                return <MessageCircle size={size} />;
            case 'BarChart2':
                return <BarChart2 size={size} />;
            default:
                return <FileText size={size} />;
        }
    };

    const sidebarStyle = {
        background: 'linear-gradient(180deg, #f0f9ff 0%, #e6f7ff 50%, #dcf2ff 100%)',
        borderRight: '1px solid #e5e7eb',
        width: sidebarExpanded ? '240px' : '64px',
        minWidth: sidebarExpanded ? '240px' : '64px',
        display: 'flex',
        flexDirection: 'column' as const,
        transition: 'all 0.3s ease',
        height: '100vh',
        overflow: 'hidden'
    };

    const logoContainerStyle = {
        height: '56px',
        display: 'flex',
        alignItems: 'center',
        padding: '0 1rem',
        borderBottom: '1px solid #e5e7eb',
        position: 'relative' as const
    };

    const logoStyle = {
        display: 'flex',
        alignItems: 'center'
    };

    const toggleButtonStyle = {
        position: 'absolute' as const,
        right: '0.75rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0.25rem',
        color: '#64748b',
        cursor: 'pointer',
        background: 'transparent',
        border: 'none'
    };

    const navStyle = {
        flex: 1,
        paddingTop: '0.75rem',
        overflowY: 'auto' as const,
        overflowX: 'hidden' as const
    };

    const getNavItemStyle = (isActive: boolean, isChild: boolean = false) => ({
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        height: isChild ? '36px' : '44px',
        padding: '0 1rem',
        paddingLeft: isChild ? '3.25rem' : '1rem',
        background: isActive 
            ? 'linear-gradient(90deg, #eff6ff 0%, #dbeafe 100%)'
            : 'transparent',
        color: isActive ? '#2563eb' : '#4b5563',
        cursor: 'pointer',
        fontSize: isChild ? '14px' : '15px',
        transition: 'all 0.2s ease',
        position: 'relative' as const,
        zIndex: 1,
        marginLeft: isChild ? '0.5rem' : '0',
        boxSizing: 'border-box' as const
    });

    const iconContainerStyle = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%'
    };

    const getIconStyle = (isActive: boolean, isChild: boolean = false) => ({
        display: 'flex',
        color: isActive ? '#2563eb' : isChild ? '#64748b' : '#4b5563'
    });

    const verticalLineStyle = {
        position: 'absolute' as const,
        left: '1.75rem',
        top: '0',
        bottom: '0',
        width: '2px',
        background: '#e5e7eb',
        zIndex: 0
    };

    const footerStyle = {
        padding: '1rem',
        borderTop: '1px solid #e5e7eb',
        background: 'linear-gradient(180deg, #e6f7ff 0%, #dcf2ff 100%)'
    };

    const userAvatarStyle = {
        width: '2rem', 
        height: '2rem', 
        borderRadius: '9999px', 
        backgroundColor: '#2563eb',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontSize: '14px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
    };

    const userInfoContainerStyle = {
        marginLeft: '0.75rem'
    };

    const userNameStyle = {
        fontSize: '14px', 
        fontWeight: 500, 
        color: '#1e293b'
    };

    const userEmailStyle = {
        fontSize: '12px', 
        color: '#64748b'
    };

    const renderNavItem = (item: NavigationItem, isChild: boolean = false) => {
        const isActive = activeSection === item.id;
        const isExpanded = expandedItems.includes(item.id);
        const hasChildren = item.children && item.children.length > 0;

        const currentStyle = getNavItemStyle(isActive, isChild);
        const hoverStyle = !isActive ? {
            background: isChild ? 'rgba(241, 245, 249, 0.7)' : 'linear-gradient(90deg, #f8fafc 0%, #f1f5f9 100%)',
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
                            <span style={getIconStyle(isActive, isChild)}>
                                {getIconByType(item.iconType, isChild ? 16 : 18)}
                            </span>
                            {sidebarExpanded && (
                                <span style={{ 
                                    marginLeft: '0.75rem',
                                    fontSize: isChild ? '14px' : '15px',
                                    color: isActive ? '#2563eb' : '#4b5563',
                                    fontWeight: isActive ? 600 : isChild ? 400 : 500
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
                    <div style={{ position: 'relative' }}>
                        <div style={verticalLineStyle} />
                        <ul style={{ 
                            listStyle: 'none', 
                            margin: '0.25rem 0 0.5rem', 
                            padding: 0,
                            position: 'relative'
                        }}>
                            {(item.children || []).map((child: NavigationItem) => renderNavItem(child, true))}
                        </ul>
                    </div>
                )}
            </li>
        );
    };

    return (
        <div style={sidebarStyle}>
            {/* Logo区域 */}
            <div style={logoContainerStyle}>
                <div style={logoStyle}>
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
                </div>
                <button
                    style={toggleButtonStyle}
                    onClick={toggleSidebar}
                >
                    <ChevronRight
                        size={18}
                        style={{ 
                            transform: sidebarExpanded ? 'none' : 'rotate(180deg)',
                            transition: 'transform 0.3s ease'
                        }}
                    />
                </button>
            </div>

            {/* 导航区域 */}
            <nav style={navStyle}>
                <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                    {navigationItems.map(item => renderNavItem(item))}
                </ul>
            </nav>

            {/* 底部用户信息 */}
            <div style={footerStyle}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div style={userAvatarStyle}>
                        {state.username?.slice(0, 2) || '管理'}
                    </div>
                    {sidebarExpanded && (
                        <div style={userInfoContainerStyle}>
                            <div style={userNameStyle}>{state.username || '管理员'}</div>
                            <div style={userEmailStyle}>系统管理员</div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Sidebar;