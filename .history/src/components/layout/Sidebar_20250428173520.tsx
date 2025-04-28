import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
    ChevronDown, 
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
    const { state, setActiveSection } = useAppContext();
    const { activeSection, sidebarExpanded } = state;
    const [expandedItems, setExpandedItems] = useState<string[]>(['qa-management', 'knowledge-base']);
    const [hoveredItem, setHoveredItem] = useState<string | null>(null);
    const [hoveredSubItem, setHoveredSubItem] = useState<string | null>(null);
    const hoverTimeoutRef = useRef<number | null>(null);
    const isInitialMount = useRef(true);

    useEffect(() => {
        if (isInitialMount.current) {
            const currentPath = window.location.pathname;
            const findMatchingSection = () => {
                if (currentPath === '/dashboard') return 'dashboard';
                if (currentPath.includes('/qa-assistant/assistant-list')) return 'assistant-list';
                if (currentPath.includes('/qa-assistant/qa-management')) return 'qa-management';
                if (currentPath.includes('/knowledge-base/files')) return 'knowledge-base';
                if (currentPath.includes('/knowledge-base/vectors')) return 'vectors';
                if (currentPath.includes('/knowledge-base/metadata')) return 'metadata';
                if (currentPath.includes('/knowledge-graph/database')) return 'graph-database';
                if (currentPath.includes('/knowledge-graph/preview')) return 'graph-preview';
                if (currentPath.includes('/settings/basic')) return 'basic-settings';
                if (currentPath.includes('/settings/model')) return 'model-settings';
                if (currentPath.includes('/tool-plaza/agent-tools')) return 'agent-tools';
                if (currentPath.includes('/tool-plaza/tool-factory')) return 'tool-factory';
                if (currentPath.includes('/tool-plaza/mcp')) return 'mcp-center';
                if (currentPath.includes('/tool-plaza/data-processing')) return 'data-processing-tools';
                
                return 'dashboard';
            };
            
            const matchedSection = findMatchingSection();
            if (matchedSection !== activeSection) {
                setActiveSection(matchedSection);
            }
            isInitialMount.current = false;
        }
    }, [activeSection, setActiveSection]);

    const toggleExpanded = useCallback((itemId: string) => {
        setExpandedItems(prev => {
            if (prev.includes(itemId)) {
                return prev.filter(id => id !== itemId);
            } else {
                return [...prev, itemId];
            }
        });
    }, []);

    const handleMouseEnter = useCallback((itemId: string) => {
        if (hoverTimeoutRef.current) {
            window.clearTimeout(hoverTimeoutRef.current);
            hoverTimeoutRef.current = null;
        }
        setHoveredItem(itemId);
    }, []);

    const handleMouseLeave = useCallback(() => {
        if (hoverTimeoutRef.current) {
            window.clearTimeout(hoverTimeoutRef.current);
        }
        
        hoverTimeoutRef.current = window.setTimeout(() => {
            setHoveredItem(null);
            setHoveredSubItem(null);
            hoverTimeoutRef.current = null;
        }, 50);
    }, []);

    const handleSubItemMouseEnter = useCallback((itemId: string) => {
        setHoveredSubItem(itemId);
    }, []);

    const handleSubItemMouseLeave = useCallback(() => {
        setHoveredSubItem(null);
    }, []);

    const handleItemClick = useCallback((item: NavigationItem) => {
        const hasChildren = Boolean(item.children && item.children.length > 0);
        
        if (hasChildren) {
            toggleExpanded(item.id);
        } else {
            if (activeSection !== item.id) {
                setActiveSection(item.id);
            }
        }
    }, [activeSection, setActiveSection, toggleExpanded]);

    const handleSubItemClick = useCallback((itemId: string) => {
        if (activeSection !== itemId) {
            setActiveSection(itemId);
        }
        setHoveredItem(null);
        setHoveredSubItem(null);
    }, [activeSection, setActiveSection]);

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
        overflow: 'hidden',
        position: 'relative' as const
    };

    const logoContainerStyle = {
        height: '56px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 1rem',
        borderBottom: '1px solid #e5e7eb',
        position: 'relative' as const
    };

    const logoStyle = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%'
    };

    const navStyle = {
        flex: 1,
        paddingTop: '0.75rem',
        overflowY: 'auto' as const,
        overflowX: 'hidden' as const
    };

    const getIconStyle = (isActive: boolean, isChildParam?: boolean, hasChildrenParam?: boolean) => {
        // Default parameters inside function body
        const isChild = isChildParam === true;
        const hasChildren = hasChildrenParam === true;
        
        return {
            display: 'flex',
            justifyContent: 'center',
            color: isActive ? '#2563eb' : isChild ? '#64748b' : '#4b5563',
            ...(isActive && !sidebarExpanded ? {
                background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
                padding: '9px',
                borderRadius: '10px',
                boxShadow: '0 3px 8px rgba(37, 99, 235, 0.15)',
                transform: 'scale(1.12)',
                transition: 'all 0.25s ease',
                border: '2px solid rgba(37, 99, 235, 0.2)'
            } : {}),
            ...(isActive && hasChildren && !isChild ? {
                position: 'relative' as const,
                '&::after': {
                    content: '""',
                    position: 'absolute' as const,
                    right: '-4px',
                    top: '-4px',
                    width: '8px',
                    height: '8px',
                    background: '#2563eb',
                    borderRadius: '50%',
                    border: '2px solid white'
                }
            } : {})
        };
    };

    const getNavItemStyle = (isActive: boolean, isChildParam?: boolean, hasChildrenParam?: boolean) => {
        // Default parameters inside function body
        const isChild = isChildParam === true;
        const hasChildren = hasChildrenParam === true;
        
        return {
            display: 'flex',
            alignItems: 'center',
            justifyContent: sidebarExpanded ? 'flex-start' : 'center',
            width: '100%',
            height: isChild ? '36px' : '44px',
            padding: '0 1rem',
            paddingLeft: isChild ? '3.25rem' : '1rem',
            background: isActive 
                ? (sidebarExpanded ? 'linear-gradient(90deg, #eff6ff 0%, #dbeafe 100%)' : 'transparent')
                : 'transparent',
            color: isActive ? '#2563eb' : '#4b5563',
            cursor: 'pointer',
            fontSize: isChild ? '14px' : '15px',
            transition: 'all 0.2s ease',
            position: 'relative' as const,
            zIndex: 1,
            marginLeft: isChild ? '0.5rem' : '0',
            boxSizing: 'border-box' as const,
            ...(isActive && !sidebarExpanded ? {
                transform: 'scale(1.05)',
                transition: 'all 0.2s ease'
            } : {}),
            ...(isActive && hasChildren && !isChild ? {
                '&::before': {
                    content: '""',
                    position: 'absolute' as const,
                    left: '0',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: '4px',
                    height: '24px',
                    background: '#2563eb',
                    borderRadius: '0 4px 4px 0'
                }
            } : {})
        };
    };

    const iconContainerStyle = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: sidebarExpanded ? 'space-between' : 'center',
        width: '100%'
    };

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

    const popupMenuStyle = {
        position: 'fixed' as const,
        left: '64px',
        top: '0',
        minWidth: '160px',
        maxWidth: '180px',
        borderRadius: '8px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15), 0 1px 4px rgba(0, 0, 0, 0.1)',
        padding: '0.5rem 0',
        zIndex: 1000,
        border: '1px solid rgba(255, 255, 255, 0.1)',
        display: 'block',
        backdropFilter: 'blur(8px)',
        background: 'rgba(31, 41, 55, 0.85)'
    };

    const popupMenuItemStyle = {
        padding: '0.5rem 1rem',
        display: 'flex',
        alignItems: 'center',
        cursor: 'pointer',
        color: '#e5e7eb',
        fontSize: '13px',
        transition: 'all 0.2s ease',
        fontWeight: 500,
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis'
    };

    const popupMenuItemHoverStyle = {
        background: 'rgba(255, 255, 255, 0.1)',
        color: '#ffffff',
        transform: 'translateX(2px)'
    };

    const popupSubMenuItemStyle = {
        ...popupMenuItemStyle,
        paddingLeft: '1.75rem',
        fontSize: '12px',
        fontWeight: 400,
        color: '#9ca3af'
    };

    const renderPopupMenu = useCallback((item: NavigationItem, index: number) => {
        if (!hoveredItem || hoveredItem !== item.id || sidebarExpanded) return null;

        const menuTop = 56 + (index * 44);

        return (
            <div 
                style={{
                    ...popupMenuStyle,
                    top: `${menuTop}px`
                }}
                onMouseEnter={() => {
                    if (hoverTimeoutRef.current) {
                        window.clearTimeout(hoverTimeoutRef.current);
                        hoverTimeoutRef.current = null;
                    }
                }}
                onMouseLeave={handleMouseLeave}
            >
                <div 
                    style={{
                        ...popupMenuItemStyle,
                        fontWeight: 600,
                        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                        paddingBottom: '0.5rem',
                        marginBottom: '0.25rem',
                        color: '#ffffff',
                        fontSize: '13px'
                    }}
                >
                    {item.label}
                </div>
                {item.children?.map(child => (
                    <div
                        key={child.id}
                        style={{
                            ...popupSubMenuItemStyle,
                            ...(activeSection === child.id || hoveredSubItem === child.id ? popupMenuItemHoverStyle : {})
                        }}
                        onMouseEnter={() => handleSubItemMouseEnter(child.id)}
                        onMouseLeave={handleSubItemMouseLeave}
                        onClick={() => handleSubItemClick(child.id)}
                    >
                        {child.label}
                    </div>
                ))}
            </div>
        );
    }, [activeSection, hoveredItem, hoveredSubItem, sidebarExpanded, handleMouseLeave, handleSubItemMouseEnter, handleSubItemMouseLeave, handleSubItemClick]);

    const renderNavItem = useCallback((item: NavigationItem, isChild: boolean = false, index: number = 0) => {
        const isActive = activeSection === item.id || (item.children?.some(child => child.id === activeSection) && !isChild);
        const isExpanded = expandedItems.includes(item.id);
        const hasChildren = Boolean(item.children && item.children.length > 0);

        const currentStyle = {
            ...getNavItemStyle(isActive, isChild!, hasChildren!),
            ...(hoveredItem === item.id && !isActive ? {
                background: isChild ? 'rgba(241, 245, 249, 0.7)' : 'transparent',
                color: '#2563eb',
                '&::before': {
                    content: '""',
                    position: 'absolute' as const,
                    inset: '0',
                    background: 'radial-gradient(circle at center, rgba(37, 99, 235, 0.1) 0%, transparent 70%)',
                    borderRadius: '8px',
                    zIndex: -1
                }
            } : {})
        };

        return (
            <li key={item.id} style={{ position: 'relative' }}>
                <button
                    style={currentStyle}
                    onMouseEnter={() => handleMouseEnter(item.id)}
                    onMouseLeave={handleMouseLeave}
                    onClick={() => {
                        if (isChild) {
                            handleSubItemClick(item.id);
                        } else {
                            handleItemClick(item);
                        }
                    }}
                >
                    <span style={iconContainerStyle}>
                        <span style={{ display: 'flex', alignItems: 'center' }}>
                            <span style={getIconStyle(isActive, isChild!, hasChildren!)}>
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
                {!sidebarExpanded && hasChildren && renderPopupMenu(item, index)}
                {hasChildren && isExpanded && sidebarExpanded && (
                    <div style={{ position: 'relative' }}>
                        <div style={verticalLineStyle} />
                        <ul style={{ 
                            listStyle: 'none', 
                            margin: '0.25rem 0 0.5rem', 
                            padding: 0,
                            position: 'relative'
                        }}>
                            {(item.children || []).map((child: NavigationItem, childIndex: number) => 
                                renderNavItem(child, true, childIndex)
                            )}
                        </ul>
                    </div>
                )}
            </li>
        );
    }, [activeSection, expandedItems, hoveredItem, sidebarExpanded, handleMouseEnter, handleMouseLeave, handleItemClick, handleSubItemClick, renderPopupMenu]);

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
            </div>

            {/* 导航区域 */}
            <nav style={navStyle}>
                <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                    {navigationItems.map((item, index) => renderNavItem(item, false, index))}
                </ul>
            </nav>

            {/* 底部用户信息 */}
            <div style={footerStyle}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: sidebarExpanded ? 'flex-start' : 'center' }}>
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