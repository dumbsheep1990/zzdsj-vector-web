import React, { useCallback } from 'react';
import { message, Button } from 'antd';
import { PlusOutlined, ReloadOutlined, MenuFoldOutlined } from '@ant-design/icons';
import { motion, AnimatePresence } from 'framer-motion';
import styles from '../components/assistant/CreateButton.module.css';

// New redesigned components
import { AssistantCategoryGlowTabs } from '../components/assistant/AssistantCategoryGlowTabs';
import AssistantGrid from '../components/assistant/AssistantGrid';
import EmptyState from '../components/assistant/EmptyState';
import ErrorState from '../components/assistant/ErrorState';

// Types and constants
import { AssistantCategory, Assistant } from '../types/assistant';

// Custom hooks
import { useAssistantCategories } from '../hooks/useAssistantCategories';
import { useAssistants } from '../hooks/useAssistants';

/**
 * Redesigned Assistant List Page Component
 * Features category-based navigation with modern tab interface
 */
const AssistantListRedesigned: React.FC = () => {
  // Sidebar collapse state
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false);
  
  // Category management
  const { activeCategory, switchCategory } = useAssistantCategories();
  
  // Assistant data management
  const { 
    filteredAssistants, 
    loading, 
    error, 
    refreshAssistants,
    getCategoryStats 
  } = useAssistants({ 
    category: activeCategory, 
    autoFetch: true 
  });

  // Handle category change
  const handleCategoryChange = useCallback((category: AssistantCategory) => {
    switchCategory(category);
  }, [switchCategory]);

  // Handle assistant selection
  const handleAssistantSelect = useCallback((assistant: Assistant) => {
    message.info(`选择了助手: ${assistant.name}`);
    // Here you could navigate to assistant detail page or open a modal
  }, []);

  // Handle create assistant
  const handleCreateAssistant = useCallback(() => {
    message.info(`创建新的${activeCategory}助手`);
    // Here you would open the create assistant modal/page
  }, [activeCategory]);

  // Handle refresh
  const handleRefresh = useCallback(() => {
    refreshAssistants();
  }, [refreshAssistants]);

  // Get category statistics for display
  const categoryStats = getCategoryStats();
  
  // Handle sidebar collapse
  const handleSidebarCollapse = useCallback(() => {
    setSidebarCollapsed(prev => !prev);
    
    // 通过 postMessage 或者全局事件通知父组件或侧边栏组件
    window.dispatchEvent(new CustomEvent('toggleSidebar', { 
      detail: { collapsed: !sidebarCollapsed } 
    }));
    
    // 也可以通过 localStorage 存储状态，让其他组件读取
    localStorage.setItem('sidebarCollapsed', (!sidebarCollapsed).toString());
    
    message.success(sidebarCollapsed ? '侧边栏已展开' : '侧边栏已折叠');
  }, [sidebarCollapsed]);

  return (
    <div className="flex flex-col h-full overflow-hidden bg-gray-50/50">
      {/* Header with Tab Navigation */}
      <div className="flex items-start justify-between px-4 sm:px-6 py-2 sm:py-3">
        {/* Left side - Collapse button */}
        <div className="flex items-center">
          <button
            onClick={handleSidebarCollapse}
            className="group relative h-9 w-9 rounded-xl bg-white border border-gray-300 shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
            aria-label="折叠侧边栏"
          >
            <MenuFoldOutlined className="w-4 h-4 text-gray-600 group-hover:text-gray-900 transition-colors duration-200" />
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/0 via-blue-500/5 to-blue-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
          </button>
        </div>

        {/* Center - Category Navigation Tabs */}
        <div className="flex-1 flex justify-center px-4 -mt-1">
          <AssistantCategoryGlowTabs
            activeCategory={activeCategory}
            onCategoryChange={handleCategoryChange}
            className=""
          />
        </div>

        {/* Right side - Action buttons */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="group relative h-9 px-3 sm:px-4 rounded-xl bg-white border border-gray-300 shadow-sm hover:shadow-md transition-all duration-200 flex items-center space-x-2 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="刷新助手列表"
          >
            <ReloadOutlined className={`w-4 h-4 text-gray-600 group-hover:text-gray-900 transition-colors duration-200 ${loading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors duration-200">
              刷新
            </span>
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-green-500/0 via-green-500/5 to-green-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
          </button>
          
          <div
            className="group relative h-9 px-3 sm:px-4 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 flex items-center space-x-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            onClick={handleCreateAssistant}
            style={{
              background: 'linear-gradient(to right, #2563eb, #1d4ed8)',
              color: 'white',
              fontWeight: '500',
              fontSize: '14px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'linear-gradient(to right, #1d4ed8, #1e40af)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'linear-gradient(to right, #2563eb, #1d4ed8)';
            }}
          >
            <svg className="w-4 h-4 transition-transform duration-200 group-hover:scale-110" fill="white" viewBox="0 0 24 24">
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
            </svg>
            <span className="hidden sm:inline" style={{ color: 'white', fontWeight: '500' }}>
              创建助手
            </span>
            <span className="sm:hidden" style={{ color: 'white', fontWeight: '500' }}>
              创建
            </span>
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-white/0 via-white/10 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 min-h-0 overflow-auto">
        <div className="p-4 sm:p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ 
                duration: 0.3,
                ease: "easeInOut"
              }}
              role="tabpanel"
              id={`tabpanel-${activeCategory}`}
              aria-labelledby={`tab-${activeCategory}`}
            >
              {error ? (
                // Error State
                <ErrorState error={error} />
              ) : filteredAssistants.length === 0 && !loading ? (
                // Empty State
                <EmptyState
                  category={activeCategory}
                  onCreateAssistant={handleCreateAssistant}
                />
              ) : (
                // Assistant Grid
                <AssistantGrid
                  assistants={filteredAssistants}
                  category={activeCategory}
                  loading={loading}
                  onAssistantSelect={handleAssistantSelect}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Category Statistics Footer */}
      <div className="shrink-0 bg-white border-t border-gray-200/80">
        <div className="px-4 sm:px-6 py-3">
          <div className="flex justify-center items-center space-x-4 sm:space-x-8 text-xs sm:text-sm overflow-x-auto">
            <div className="flex items-center space-x-1.5 sm:space-x-2 text-gray-600 whitespace-nowrap">
              <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-blue-500 flex-shrink-0"></div>
              <span className="hidden sm:inline">基础对话</span>
              <span className="sm:hidden">基础</span>
              <span className="bg-blue-50 text-blue-700 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-xs font-medium">
                {categoryStats[AssistantCategory.BASIC_CHAT]}
              </span>
            </div>
            <div className="flex items-center space-x-1.5 sm:space-x-2 text-gray-600 whitespace-nowrap">
              <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-green-500 flex-shrink-0"></div>
              <span className="hidden sm:inline">知识问答</span>
              <span className="sm:hidden">知识</span>
              <span className="bg-green-50 text-green-700 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-xs font-medium">
                {categoryStats[AssistantCategory.KNOWLEDGE_QA]}
              </span>
            </div>
            <div className="flex items-center space-x-1.5 sm:space-x-2 text-gray-600 whitespace-nowrap">
              <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-amber-500 flex-shrink-0"></div>
              <span className="hidden sm:inline">自主规划</span>
              <span className="sm:hidden">规划</span>
              <span className="bg-amber-50 text-amber-700 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-xs font-medium">
                {categoryStats[AssistantCategory.AUTONOMOUS_PLANNING]}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssistantListRedesigned;