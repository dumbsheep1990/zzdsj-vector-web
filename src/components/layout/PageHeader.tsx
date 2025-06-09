import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ChevronRight, Bell, Server, User, Settings, X, CheckCircle, AlertCircle, LogOut, Menu } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { zIndexLevels } from '../../styles/zIndexLevels';

interface ActionButton {
    icon: React.ReactNode;
    label: string;
    onClick: () => void;
    disabled?: boolean;
}

interface PageHeaderProps {
    title: string;
    parentTitle?: string;
    description?: string;
    primaryActions?: ActionButton[];
    secondaryActions?: ActionButton[];
    filterComponent?: React.ReactNode;
    searchComponent?: React.ReactNode;
    username?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({
    title,
    parentTitle,
    description,
    primaryActions = [],
    secondaryActions = [],
    filterComponent,
    searchComponent,
    username = '管理员',
}) => {
    const { toggleSidebar, state } = useAppContext();
    const { sidebarExpanded } = state;
    const [showNotifications, setShowNotifications] = useState(false);
    const [notificationCount, setNotificationCount] = useState(3);
    const [showServiceStatus, setShowServiceStatus] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);
    
    // 模拟通知数据
    const notifications = [
        {
            id: 1,
            type: 'success',
            message: '文件处理完成，共处理 42 个文件',
            time: '昨天 10:30'
        },
        {
            id: 2,
            type: 'warning',
            message: '负载过高，请检查系统状态',
            time: '昨天 09:15'
        },
        {
            id: 3,
            type: 'success',
            message: '新的知识库文件上传成功',
            time: '前天 18:42'
        }
    ];
    
    const clearNotifications = () => {
        setNotificationCount(0);
    };
    
    // 添加遮罩层效果
    useEffect(() => {
        // 当任何下拉菜单打开时，添加遮罩层
        const shouldShowBackdrop = showNotifications || showServiceStatus || showUserMenu;
        
        if (shouldShowBackdrop) {
            // 添加遮罩层
            const backdrop = document.createElement('div');
            backdrop.id = 'dropdown-backdrop';
            backdrop.className = 'fixed inset-0 bg-black/10 backdrop-blur-sm z-40';
            document.body.appendChild(backdrop);
            
            // 点击遮罩层关闭所有下拉菜单
            backdrop.addEventListener('click', () => {
                setShowNotifications(false);
                setShowServiceStatus(false);
                setShowUserMenu(false);
            });
        } else {
            // 移除遮罩层
            const backdrop = document.getElementById('dropdown-backdrop');
            if (backdrop) {
                document.body.removeChild(backdrop);
            }
        }
        
        // 清理函数
        return () => {
            const backdrop = document.getElementById('dropdown-backdrop');
            if (backdrop) {
                document.body.removeChild(backdrop);
            }
        };
    }, [showNotifications, showServiceStatus, showUserMenu]);
    
    // 获取菜单的位置信息，用于定位Portal渲染的下拉菜单
    const [notificationBtnRect, setNotificationBtnRect] = useState<DOMRect | null>(null);
    const [serviceBtnRect, setServiceBtnRect] = useState<DOMRect | null>(null);
    const [userBtnRect, setUserBtnRect] = useState<DOMRect | null>(null);
    
    // 获取portal容器
    const portalContainer = document.getElementById('portal-container');
    
    const { logout } = useAuth();

    return (
        <div className="bg-white border-b border-gray-100">
            {/* 标题栏 */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50" style={{
                height: '56px',
                display: 'flex',
                alignItems: 'center',
                padding: '0 24px',
                justifyContent: 'space-between'
            }}>
                <div className="flex items-center">
                    {/* 折叠按钮 */}
                    <button
                        onClick={toggleSidebar}
                        className="flex items-center justify-center w-8 h-8 mr-4 rounded-md hover:bg-blue-100 transition-colors"
                        title={sidebarExpanded ? '收起侧边栏' : '展开侧边栏'}
                    >
                        <Menu 
                            size={20} 
                            color="#64748b"
                            style={{
                                transform: sidebarExpanded ? 'rotate(0deg)' : 'rotate(180deg)',
                                transition: 'transform 0.3s ease'
                            }}
                        />
                    </button>

                    {parentTitle && (
                        <>
                            <span style={{ fontSize: '15px', color: '#64748b', fontWeight: 500 }}>{parentTitle}</span>
                            <ChevronRight size={16} className="mx-2 text-gray-400" />
                        </>
                    )}
                    <span style={{ 
                        fontSize: '16px',
                        fontWeight: 600,
                        color: '#1e293b',
                        lineHeight: '1'
                    }}>
                        {title}
                    </span>
                    {description && (
                        <span style={{ 
                            fontSize: '14px',
                            color: '#64748b',
                            marginLeft: '1rem',
                            paddingLeft: '1rem',
                            borderLeft: '1px solid #e5e7eb'
                        }}>
                            {description}
                        </span>
                    )}
                </div>

                {/* 右侧功能区：操作按钮、通知、服务状态、用户菜单 */}
                <div className="flex items-center">
                    {/* 主要操作按钮 */}
                    {primaryActions.length > 0 && (
                        <div className="flex items-center space-x-4 mr-6">
                            {primaryActions.map((action) => (
                                <button
                                    key={action.label}
                                    onClick={action.onClick}
                                    className="inline-flex items-center px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
                                >
                                    {action.icon && <span className="mr-1.5">{action.icon}</span>}
                                    {action.label}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* 次要操作按钮 */}
                    {secondaryActions.length > 0 && (
                        <div className="flex items-center space-x-4 mr-6">
                            {secondaryActions.map((action) => (
                                <button
                                    key={action.label}
                                    onClick={action.onClick}
                                    className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors text-sm"
                                >
                                    {action.icon && <span className="mr-1.5">{action.icon}</span>}
                                    {action.label}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* 右侧图标按钮组 */}
                    <div className="flex items-center space-x-3">
                        {/* 通知按钮 */}
                        <button 
                            className="relative w-8 h-8 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 hover:from-slate-200 hover:to-slate-300 border border-slate-300 transition-all duration-200 flex items-center justify-center shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                            onClick={(e) => {
                                setShowNotifications(!showNotifications);
                                setShowServiceStatus(false);
                                setShowUserMenu(false);
                                setNotificationBtnRect(e.currentTarget.getBoundingClientRect());
                            }}
                            aria-label="通知"
                        >
                            <Bell size={16} className="text-slate-600" />
                            {notificationCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold shadow-md border-2 border-white">
                                    {notificationCount}
                                </span>
                            )}
                        </button>
                        
                        {/* 通知下拉框 - 通过Portal渲染到body层级 */}
                        {showNotifications && portalContainer && createPortal(
                            <div className="absolute bg-white rounded-lg shadow-lg z-50 border border-gray-200 overflow-hidden" 
                                style={{ 
                                    width: '320px', 
                                    right: `${window.innerWidth - (notificationBtnRect?.right || 0)}px`,
                                    top: `${(notificationBtnRect?.bottom || 0) + 8}px`,
                                    pointerEvents: 'auto' 
                                }}
                            >
                                <div className="flex items-center justify-between p-3 border-b border-gray-100">
                                    <h3 className="font-medium text-gray-800">通知消息</h3>
                                    <button 
                                        className="text-gray-400 hover:text-gray-600"
                                        onClick={() => setShowNotifications(false)}
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                                <div className="max-h-72 overflow-y-auto">
                                    {notifications.map(notification => (
                                        <div key={notification.id} className="p-3 border-b border-gray-100 hover:bg-blue-50">
                                            <div className="flex">
                                                <div className="mr-3">
                                                    {notification.type === 'success' 
                                                        ? <CheckCircle size={18} className="text-green-500" /> 
                                                        : <AlertCircle size={18} className="text-amber-500" />
                                                    }
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-800 mb-1">{notification.message}</p>
                                                    <p className="text-xs text-gray-500">{notification.time}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="p-2 text-center border-t border-gray-100">
                                    <button 
                                        className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                                        onClick={clearNotifications}
                                    >
                                        清空所有通知
                                    </button>
                                </div>
                            </div>,
                            portalContainer
                        )}
                        
                        {/* 服务状态按钮 */}
                        <button 
                            className="relative w-8 h-8 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 hover:from-slate-200 hover:to-slate-300 border border-slate-300 transition-all duration-200 flex items-center justify-center shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                            onClick={(e) => {
                                setShowServiceStatus(!showServiceStatus);
                                setShowNotifications(false);
                                setShowUserMenu(false);
                                setServiceBtnRect(e.currentTarget.getBoundingClientRect());
                            }}
                            aria-label="服务状态"
                        >
                            <Server size={16} className="text-slate-600" />
                            {/* 服务状态指示器 */}
                            <span className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full border-2 border-white shadow-sm animate-pulse"></span>
                        </button>
                        
                        {/* 服务状态下拉框 - 通过Portal渲染 */}
                        {showServiceStatus && portalContainer && createPortal(
                            <div className="absolute bg-white rounded-lg shadow-lg z-50 border border-gray-200 overflow-hidden" 
                                style={{ 
                                    width: '280px', 
                                    right: `${window.innerWidth - (serviceBtnRect?.right || 0)}px`,
                                    top: `${(serviceBtnRect?.bottom || 0) + 8}px`,
                                    pointerEvents: 'auto' 
                                }}
                            >
                                <div className="flex items-center justify-between p-3 border-b border-gray-100">
                                    <h3 className="font-medium text-gray-800">服务状态</h3>
                                    <button 
                                        className="text-gray-400 hover:text-gray-600"
                                        onClick={() => setShowServiceStatus(false)}
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                                <div className="max-h-72 overflow-y-auto p-3">
                                    <div className="mb-3">
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="text-sm text-gray-800 font-medium">知识库服务</span>
                                            <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">运行中</span>
                                        </div>
                                        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                                            <div className="h-full bg-green-500 rounded-full" style={{ width: '95%' }}></div>
                                        </div>
                                    </div>
                                    <div className="mb-3">
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="text-sm text-gray-800 font-medium">模型服务</span>
                                            <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">运行中</span>
                                        </div>
                                        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                                            <div className="h-full bg-green-500 rounded-full" style={{ width: '85%' }}></div>
                                        </div>
                                    </div>
                                    <div className="mb-3">
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="text-sm text-gray-800 font-medium">存储服务</span>
                                            <span className="text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">负载高</span>
                                        </div>
                                        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                                            <div className="h-full bg-amber-500 rounded-full" style={{ width: '75%' }}></div>
                                        </div>
                                    </div>
                                </div>
                            </div>,
                            portalContainer
                        )}

                        {/* 用户菜单按钮 */}
                        <button 
                            className="relative w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 border border-slate-300 transition-all duration-200 flex items-center justify-center shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                            onClick={(e) => {
                                setShowUserMenu(!showUserMenu);
                                setShowServiceStatus(false);
                                setShowNotifications(false);
                                setUserBtnRect(e.currentTarget.getBoundingClientRect());
                            }}
                            aria-label="用户菜单"
                            title={`当前用户: ${username}`}
                        >
                            <span className="text-white text-xs font-semibold">
                                {username ? username.charAt(0).toUpperCase() : 'U'}
                            </span>
                            {/* 在线状态指示器 */}
                            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full border border-white shadow-sm"></span>
                        </button>
                        
                        {/* 用户菜单下拉框 - 通过Portal渲染 */}
                        {showUserMenu && portalContainer && createPortal(
                            <div className="absolute bg-white rounded-lg shadow-lg z-50 border border-gray-200 overflow-hidden" 
                                style={{ 
                                    width: '250px', 
                                    right: `${window.innerWidth - (userBtnRect?.right || 0)}px`,
                                    top: `${(userBtnRect?.bottom || 0) + 8}px`,
                                    pointerEvents: 'auto' 
                                }}
                            >
                                <div className="flex items-center justify-between p-3 border-b border-gray-100">
                                    <div className="flex items-center">
                                        <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center mr-2">
                                            <User size={16} className="text-white" />
                                        </div>
                                        <h3 className="font-medium text-gray-800">{username}</h3>
                                    </div>
                                    <button 
                                        className="text-gray-400 hover:text-gray-600"
                                        onClick={() => setShowUserMenu(false)}
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                                <div className="max-h-72 overflow-y-auto">
                                    <div className="p-3 border-b border-gray-100 hover:bg-indigo-50">
                                        <button 
                                            className="flex items-center text-sm text-gray-800 w-full"
                                            onClick={() => console.log('点击了设置')}
                                        >
                                            <Settings size={16} className="mr-2 text-indigo-600" />
                                            设置
                                        </button>
                                    </div>
                                    <div className="p-3 hover:bg-indigo-50">
                                        <button 
                                            className="flex items-center text-sm text-gray-800 w-full"
                                            onClick={logout}
                                        >
                                            <LogOut size={16} className="mr-2 text-indigo-600" />
                                            退出登录
                                        </button>
                                    </div>
                                </div>
                            </div>,
                            portalContainer
                        )}
                    </div>
                </div>
            </div>

            {/* 搜索和筛选区域 */}
            {(searchComponent || filterComponent) && (
                <div className="px-6 py-2 bg-gray-50 border-t border-gray-100">
                    <div className="flex items-center space-x-4">
                        {searchComponent}
                        {filterComponent}
                    </div>
                </div>
            )}
        </div>
    );
};

export default PageHeader;
