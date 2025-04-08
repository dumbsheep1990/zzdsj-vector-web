import React, { useState, useEffect } from 'react';
import { ChevronRight, Bell, Server, User, Settings, X, CheckCircle, AlertCircle, LogOut } from 'lucide-react';

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
                    <div className="flex items-center space-x-4">
                        {/* 通知按钮 */}
                        <div className="relative">
                            <button 
                                className="p-1.5 rounded-full hover:bg-indigo-100 transition-colors relative"
                                onClick={() => {
                                    setShowNotifications(!showNotifications);
                                    if (!showNotifications) {
                                        clearNotifications();
                                    }
                                }}
                            >
                                <Bell size={18} className="text-gray-600" />
                                {notificationCount > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                                        {notificationCount}
                                    </span>
                                )}
                            </button>
                            
                            {/* 通知下拉框 */}
                            {showNotifications && (
                                <div className="absolute right-0 mt-2 w-80 bg-white/90 backdrop-blur-md rounded-lg shadow-lg z-50 border border-gray-200 overflow-hidden">
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
                                        {notifications.length > 0 ? (
                                            notifications.map((notification) => (
                                                <div key={notification.id} className="p-3 border-b border-gray-100 hover:bg-indigo-50">
                                                    <div className="flex items-start">
                                                        <div className="flex-shrink-0 mt-0.5">
                                                            {notification.type === 'success' ? (
                                                                <CheckCircle size={16} className="text-green-500" />
                                                            ) : (
                                                                <AlertCircle size={16} className="text-amber-500" />
                                                            )}
                                                        </div>
                                                        <div className="ml-2">
                                                            <p className="text-sm text-gray-800">{notification.message}</p>
                                                            <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="p-4 text-center text-gray-500 text-sm">
                                                暂无通知
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* 服务状态按钮 */}
                        <div className="relative">
                            <button 
                                className="p-1.5 rounded-full hover:bg-indigo-100 transition-colors"
                                onClick={() => setShowServiceStatus(!showServiceStatus)}
                            >
                                <Server size={18} className="text-gray-600" />
                            </button>
                            
                            {/* 服务状态下拉框 */}
                            {showServiceStatus && (
                                <div className="absolute right-0 mt-2 w-72 bg-white/90 backdrop-blur-md rounded-lg shadow-lg z-50 border border-gray-200 overflow-hidden">
                                    <div className="flex items-center justify-between p-3 border-b border-gray-100">
                                        <h3 className="font-medium text-gray-800">服务状态</h3>
                                        <button 
                                            className="text-gray-400 hover:text-gray-600"
                                            onClick={() => setShowServiceStatus(false)}
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                    <div className="max-h-72 overflow-y-auto">
                                        <div className="p-3 border-b border-gray-100">
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-gray-800">向量数据库</span>
                                                <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800">正常</span>
                                            </div>
                                        </div>
                                        <div className="p-3 border-b border-gray-100">
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-gray-800">文件处理服务</span>
                                                <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800">正常</span>
                                            </div>
                                        </div>
                                        <div className="p-3 border-b border-gray-100">
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-gray-800">搜索服务</span>
                                                <span className="text-xs px-2 py-1 rounded-full bg-amber-100 text-amber-800">负载高</span>
                                            </div>
                                        </div>
                                        <div className="p-3">
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-gray-800">API 网关</span>
                                                <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800">正常</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* 用户菜单按钮 */}
                        <div className="relative">
                            <button 
                                className="p-1.5 rounded-full hover:bg-indigo-700 transition-colors flex items-center justify-center bg-indigo-600 text-white w-8 h-8"
                                onClick={() => setShowUserMenu(!showUserMenu)}
                                aria-label="用户菜单"
                            >
                                <User size={18} className="text-white" />
                            </button>
                            
                            {/* 用户菜单下拉框 */}
                            {showUserMenu && (
                                <div className="absolute right-0 mt-2 w-64 bg-white/90 backdrop-blur-md rounded-lg shadow-lg z-50 border border-gray-200 overflow-hidden">
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
                                                onClick={() => console.log('点击了退出登录')}
                                            >
                                                <LogOut size={16} className="mr-2 text-indigo-600" />
                                                退出登录
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* 搜索和筛选区域 */}
            {(searchComponent || filterComponent) && (
                <div className="px-6 py-2 bg-white border-t border-gray-100">
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
