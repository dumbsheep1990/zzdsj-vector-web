import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

interface IntelligentReportsLayoutProps {
  children: React.ReactNode;
}

const IntelligentReportsLayout: React.FC<IntelligentReportsLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { state, setSidebarExpanded, toggleSidebar } = useAppContext();

  // 在智能报告页面时自动折叠侧边栏
  useEffect(() => {
    if (location.pathname.startsWith('/intelligent-reports')) {
      setSidebarExpanded(false);
    }
  }, [location.pathname, setSidebarExpanded]);

  // 导航项配置
  const navItems = [
    { 
      path: '/intelligent-reports', 
      label: 'Next-Report 报告', 
      active: location.pathname === '/intelligent-reports' 
    },
    { 
      path: '/intelligent-reports/report-list', 
      label: '报告列表', 
      active: location.pathname === '/intelligent-reports/report-list' 
    },
    { 
      path: '/intelligent-reports/report-templates', 
      label: '报告模板', 
      active: location.pathname === '/intelligent-reports/report-templates' 
    },
    { 
      path: '/intelligent-reports/task-management', 
      label: '任务管理', 
      active: location.pathname === '/intelligent-reports/task-management' 
    },
    { 
      path: '/intelligent-reports/agent-collaboration', 
      label: '智能体协作', 
      active: location.pathname === '/intelligent-reports/agent-collaboration' 
    }
  ];

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      {/* 顶部导航栏 - 重新设计简洁版本 */}
      <header 
        className="fixed top-0 right-0 z-50 transition-all duration-300 ease-in-out border-b shadow-sm"
        style={{
          height: '56px',
          left: state.sidebarExpanded ? '240px' : '64px',
          background: '#ffffff',
          borderBottom: '1px solid #e5e7eb'
        }}
      >
        <div className="flex items-center justify-between h-full px-6">
          {/* 左侧：展开按钮 */}
          <button
            onClick={toggleSidebar}
            className="group relative p-2 rounded-lg transition-all duration-200 hover:bg-gray-50 border border-gray-200"
            title={state.sidebarExpanded ? '折叠侧边栏' : '展开侧边栏'}
          >
            <Menu className="w-5 h-5 text-gray-600 group-hover:text-blue-600 transition-colors" />
          </button>

          {/* 中间：简洁导航标签 */}
          <div className="flex-1 flex items-center justify-center">
            <nav className="flex items-center bg-gray-50 rounded-lg p-1">
              {navItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`
                    relative px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 whitespace-nowrap
                    ${item.active 
                      ? 'bg-white text-blue-600 shadow-sm border border-gray-200' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                    }
                  `}
                >
                  {item.label}
                </button>
              ))}
            </nav>
          </div>

          {/* 右侧：空白占位 */}
          <div className="w-12" />
        </div>
      </header>

      {/* 主要内容区域 - 调整顶部间距 */}
      <main className="flex-1 overflow-auto" style={{ paddingTop: '56px' }}>
        {children}
      </main>
    </div>
  );
};

export default IntelligentReportsLayout;