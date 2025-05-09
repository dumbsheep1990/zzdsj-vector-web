import React from 'react';
import { Menu, Tooltip, Tag, Button, Input, Empty } from 'antd';
import PageHeader from '../components/layout/PageHeader';
import { QuestionList } from '../components/modules/qa/QuestionList';
import { QASettings } from '../components/modules/qa/QASettings';
import AddQuestionModal from '../components/modules/qa/AddQuestionModal';
import EmptyStateDisplay from '../components/modules/qa/EmptyStateDisplay';
import { QAManagementSkeleton, AssistantListItemSkeleton } from '../components/skeleton';
import { 
  QuestionCircleOutlined, 
  DatabaseOutlined,
  PlusOutlined,
  SearchOutlined
} from '@ant-design/icons';
import { useQaPage } from '../hooks/qa/useQaPage';
import { QaAssistant } from '../hooks/qa/useQaAssistants';


const QAManagement: React.FC = () => {
  // 使用整合式问答管理页面hook
  const {
    // 数据状态
    assistants,
    selectedAssistant,
    selectedAssistantId,
    questions,
    selectedQuestion,
    selectedQuestionId,
    activeTab,
    isLoading,
    isAddQuestionModalVisible,
    searchText,
    hasSearchResults,
    statistics,
    
    // 操作方法
    handleAssistantSelect,
    handleQuestionSelect,
    handleTabChange,
    handleAddQuestion,
    handleSearch,
    handleCreateAssistant,
    getStatusColor,
    showAddQuestionModal,
    hideAddQuestionModal,
    clearSearchAndRestoreResults,
  } = useQaPage();

  // 处理菜单选择
  const handleMenuSelect = ({ key }: { key: string }) => {
    handleAssistantSelect(key);
  };

  // 渲染助手列表骨架屏
  const renderAssistantSkeletons = () => {
    return Array(5).fill(null).map((_, index) => (
      <AssistantListItemSkeleton key={index} />
    ));
  };

  // 渲染标签页内容
  const renderTabContent = () => {
    if (!selectedAssistant) return null;
    
    if (activeTab === 'questions') {
      return (
        <QuestionList 
          assistantId={selectedAssistant.id}
          onSelectQuestion={handleQuestionSelect}
        />
      );
    } else {
      return (
        <QASettings 
          assistantId={selectedAssistant.id}
          selectedQuestion={selectedQuestionId}
        />
      );
    }
  };

  // 生成菜单项 - 使用原始样式
  const renderAssistantMenuItem = (assistant: QaAssistant) => (
    <Menu.Item key={assistant.id}>
      <div className={`py-4 px-4 transition-all duration-300 rounded-xl border ${
        selectedAssistant?.id === assistant.id 
          ? 'border-blue-500 bg-blue-50/50 shadow-sm' 
          : 'border-gray-100 hover:border-blue-200 hover:shadow-lg hover:scale-[1.02]'
      } group`}>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                selectedAssistant?.id === assistant.id 
                  ? 'bg-blue-100/80' 
                  : 'bg-blue-100 group-hover:bg-blue-200'
              }`}>
                <span className={`font-medium text-sm ${
                  selectedAssistant?.id === assistant.id 
                    ? 'text-blue-700' 
                    : 'text-blue-600 group-hover:text-blue-700'
                }`}>
                  {assistant.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <span className={`font-medium text-base truncate ${
                selectedAssistant?.id === assistant.id 
                  ? 'text-blue-700' 
                  : 'group-hover:text-blue-600'
              }`}>
                {assistant.name}
              </span>
            </div>
            <Tag 
              color={getStatusColor(assistant.status)} 
              className="shrink-0 px-2 py-0.5 rounded-full text-xs font-medium"
            >
              {assistant.status === 'online' ? '在线' : 
              assistant.status === 'training' ? '训练中' : '离线'}
            </Tag>
          </div>
          <div className={`text-sm mb-4 line-clamp-2 pl-10 ${
            selectedAssistant?.id === assistant.id 
              ? 'text-gray-700' 
              : 'text-gray-600 group-hover:text-gray-700'
          }`}>
            {assistant.description}
          </div>
          <div className="flex items-center gap-4 text-xs text-gray-500 pl-10">
            <Tooltip title="问题数量">
              <span className={`flex items-center whitespace-nowrap px-2 py-1 rounded-full ${
                selectedAssistant?.id === assistant.id 
                  ? 'bg-blue-50 text-blue-600' 
                  : 'bg-gray-50 group-hover:bg-blue-50 group-hover:text-blue-600'
              } transition-colors`}>
                <QuestionCircleOutlined className="mr-1 text-blue-500" />
                {assistant.questionCount} 个问题
              </span>
            </Tooltip>
            <Tooltip title="文档数量">
              <span className={`flex items-center whitespace-nowrap px-2 py-1 rounded-full ${
                selectedAssistant?.id === assistant.id 
                  ? 'bg-green-50 text-green-600' 
                  : 'bg-gray-50 group-hover:bg-green-50 group-hover:text-green-600'
              } transition-colors`}>
                <DatabaseOutlined className="mr-1 text-green-500" />
                {assistant.documentCount} 个文档
              </span>
            </Tooltip>
          </div>
        </div>
      </div>
    </Menu.Item>
  );

  // 渲染内容区域
  const renderMainContent = () => {
    if (isLoading) {
      return <QAManagementSkeleton />;
    }

    // 渲染实际内容布局
    return (
      <div className="flex h-full">
        {/* 左侧助手列表 */}
        <div className="w-[360px] border-r border-gray-100 h-full overflow-hidden">
          {isLoading ? (
            // 助手列表加载中，显示骨架屏
            <div className="py-2 px-3 h-full overflow-auto">
              {renderAssistantSkeletons()}
            </div>
          ) : assistants.length === 0 ? (
            // 助手列表为空，显示空状态
            <div className="h-full flex items-center justify-center px-4">
              <EmptyStateDisplay 
                type="no-assistant"
                onAction={handleCreateAssistant}
              />
            </div>
          ) : (
            // 显示助手列表
            <Menu 
              className="py-2 px-3 h-full"
              selectedKeys={selectedAssistant ? [selectedAssistant.id] : []}
              onClick={handleMenuSelect}
              rootClassName="qa-assistant-menu"
            >
              {assistants.map(renderAssistantMenuItem)}
            </Menu>
          )}
        </div>

        {/* 中间问题列表 */}
        <div className="flex-1 border-r border-gray-100 h-full flex flex-col overflow-hidden">
          {!selectedAssistant ? (
            <div className="h-full flex items-center justify-center">
              <Empty description="请选择一个助手查看问题列表" />
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between px-6 py-3">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                  <DatabaseOutlined className="mr-2 text-blue-500" />
                  助手列表
                </h3>
                {assistants.length === 0 && !isLoading && (
                  <Button 
                    type="primary" 
                    size="small"
                    icon={<PlusOutlined />}
                    className="bg-blue-500 hover:bg-blue-600 border-none shadow-sm hover:shadow-md transition-all"
                    onClick={handleCreateAssistant}
                  >
                    新增
                  </Button>
                )}
              </div>
              <div className="flex items-center justify-between px-6 py-3">
                <div className="flex items-center gap-4">
                  <button 
                    className={`flex items-center gap-2 text-[15px] px-5 py-2 rounded-lg border border-gray-200 shadow-sm hover:border-blue-400 hover:text-blue-500 transition-all ${
                      activeTab === 'questions' ? 'text-blue-500 border-blue-500 shadow-md' : 'text-gray-600'
                    }`}
                    onClick={() => handleTabChange('questions')}
                  >
                    <QuestionCircleOutlined />
                    问题列表
                  </button>
                </div>
                <div className="flex items-center gap-3">
                  <Input
                    placeholder="搜索问题..."
                    prefix={<SearchOutlined className="text-gray-400" />}
                    className="w-64"
                    allowClear
                    onChange={(e) => handleSearch(e.target.value)}
                    value={searchText}
                  />
                  <Button 
                    type="primary" 
                    icon={<PlusOutlined />}
                    className="bg-blue-500 hover:bg-blue-600 border-none shadow-sm hover:shadow-md transition-all"
                    onClick={showAddQuestionModal}
                  >
                    新增问题
                  </Button>
                </div>
              </div>
              <div className="flex-1 overflow-hidden">
                {/* 内容区域 */}
                <div className="h-full overflow-auto p-6">
                  {!hasSearchResults && searchText ? (
                    <EmptyStateDisplay 
                      type="no-search-result"
                      onAction={clearSearchAndRestoreResults}
                    />
                  ) : (
                    renderTabContent()
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    );
  };

  // 主页面布局
  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* 页面标题区域 - 始终显示，不使用骨架屏 */}
      <div className="shrink-0">
        <PageHeader 
          title="问答管理" 
          parentTitle="问答助手"
          description="管理助手的问答信息"
          filterComponent={
            selectedAssistant && (
              <div className="text-sm text-gray-500">
                {selectedAssistant.name} - 
                共 {selectedAssistant.questionCount} 个问题
              </div>
            )
          }
        />
      </div>
      
      {/* 内容区域 - 根据加载状态决定是否显示骨架屏 */}
      <div className="flex-1 min-h-0 overflow-hidden">
        {renderMainContent()}
      </div>

      {/* 新增问题弹窗 */}
      <AddQuestionModal
        open={isAddQuestionModalVisible}
        onCancel={hideAddQuestionModal}
        onOk={handleAddQuestion}
      />
    </div>
  );
};

// 添加全局样式
const styles = `
.qa-assistant-menu {
  .ant-menu-item {
    margin: 0 !important;
    padding: 0 !important;
    height: auto !important;
    line-height: 1.5 !important;
    border-radius: 12px;
    margin: 6px 0 !important;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .ant-menu {
    height: 100% !important;
    overflow-y: auto !important;
    scrollbar-width: thin;
    scrollbar-color: #d1d5db #f3f4f6;
  }

  .ant-menu::-webkit-scrollbar {
    width: 4px;
  }

  .ant-menu::-webkit-scrollbar-track {
    background: #f3f4f6;
    border-radius: 2px;
  }

  .ant-menu::-webkit-scrollbar-thumb {
    background-color: #d1d5db;
    border-radius: 2px;
  }
}

.qa-content {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  
  &:hover {
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.08);
  }
}

.qa-detail {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  
  &:hover {
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  }
}

.qa-tag {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
}

.qa-loading {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}
`;

// 创建样式元素
const styleSheet = document.createElement('style');
styleSheet.textContent = styles;
document.head.appendChild(styleSheet);

export default QAManagement;
