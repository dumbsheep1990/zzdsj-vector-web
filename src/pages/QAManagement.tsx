import React, { useState } from 'react';
import { Menu, Empty, Tooltip, Tag } from 'antd';
import PageHeader from '../components/layout/PageHeader';
import { QuestionList } from '../components/modules/qa/QuestionList';
import { DocumentDetail } from '../components/modules/qa/DocumentDetail';
import { QASettings } from '../components/modules/qa/QASettings';
import { 
  QuestionCircleOutlined, 
  SettingOutlined,
  ApiOutlined,
  DatabaseOutlined
} from '@ant-design/icons';
import { mockQAStats, mockAssistants } from '../utils/mockData';

const QAManagement: React.FC = () => {
  // 状态管理
  const [selectedAssistantId, setSelectedAssistantId] = useState<string | null>(null);
  const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('questions');

  // 获取当前选中的助手信息
  const currentAssistant = mockAssistants.find(a => a.id === selectedAssistantId);

  // 获取助手状态标签颜色
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return 'success';
      case 'offline':
        return 'default';
      case 'training':
        return 'processing';
      default:
        return 'default';
    }
  };

  // 生成菜单项
  const menuItems = mockAssistants.map(assistant => ({
    key: assistant.id,
    label: (
      <div className="py-4 px-4 hover:bg-blue-50 transition-colors duration-200 rounded-lg">
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium text-base truncate mr-2">{assistant.name}</span>
            <Tag color={getStatusColor(assistant.status)} className="shrink-0">
              {assistant.status === 'online' ? '在线' : 
               assistant.status === 'training' ? '训练中' : '离线'}
            </Tag>
          </div>
          <div className="text-sm text-gray-500 mb-3 line-clamp-2">{assistant.description}</div>
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <Tooltip title="问题数量">
              <span className="flex items-center whitespace-nowrap">
                <QuestionCircleOutlined className="mr-1" />
                {assistant.questionCount} 个问题
              </span>
            </Tooltip>
            <Tooltip title="文档数量">
              <span className="flex items-center whitespace-nowrap">
                <DatabaseOutlined className="mr-1" />
                {assistant.documentCount} 个文档
              </span>
            </Tooltip>
            <Tooltip title="模型">
              <span className="flex items-center whitespace-nowrap overflow-hidden text-ellipsis">
                <ApiOutlined className="mr-1" />
                {assistant.config.model}
              </span>
            </Tooltip>
          </div>
        </div>
      </div>
    ),
    children: [
      {
        key: `${assistant.id}-questions`,
        icon: <QuestionCircleOutlined />,
        label: (
          <div className="py-2 px-2">问答管理</div>
        )
      },
      {
        key: `${assistant.id}-settings`,
        icon: <SettingOutlined />,
        label: (
          <div className="py-2 px-2">参数设置</div>
        )
      }
    ]
  }));

  // 处理菜单选择
  const handleMenuSelect = ({ key }: { key: string }) => {
    if (key.includes('-')) {
      // 子菜单项
      const [assistantId, tab] = key.split('-');
      setSelectedAssistantId(assistantId);
      setActiveTab(tab);
    } else {
      // 主菜单项（助手）
      setSelectedAssistantId(key);
      setActiveTab('questions');
    }
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="shrink-0">
        <PageHeader 
          title="问答管理" 
          parentTitle="问答助手"
          description="管理助手的问答信息"
          filterComponent={
            selectedAssistantId && (
              <div className="text-sm text-gray-500">
                {currentAssistant?.name} - 
                共 {mockQAStats.totalQuestions} 个问题，
                {mockQAStats.activeQuestions} 个活跃
              </div>
            )
          }
        />
      </div>
      
      <div className="flex-1 min-h-0 overflow-hidden">
        <div className="h-full flex">
          {/* 左侧助手列表 */}
          <div className="w-80 border-r border-gray-100 h-full overflow-hidden flex flex-col">
            <Menu
              mode="inline"
              selectedKeys={[selectedAssistantId ? `${selectedAssistantId}-${activeTab}` : '']}
              openKeys={selectedAssistantId ? [selectedAssistantId] : []}
              items={menuItems}
              onSelect={handleMenuSelect}
              className="border-0 flex-1 overflow-auto"
              style={{ 
                padding: '12px 0'
              }}
              rootClassName="qa-assistant-menu"
            />
          </div>

          {/* 中间内容区 */}
          <div className="w-96 border-r border-gray-100 h-full flex flex-col overflow-hidden">
            {!selectedAssistantId ? (
              <div className="h-full flex items-center justify-center">
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description="请选择一个助手"
                />
              </div>
            ) : activeTab === 'questions' ? (
              <QuestionList 
                assistantId={selectedAssistantId}
                onSelectQuestion={setSelectedQuestionId}
              />
            ) : (
              <QASettings 
                assistantId={selectedAssistantId}
                assistant={currentAssistant}
              />
            )}
          </div>

          {/* 右侧详情区 */}
          <div className="flex-1 h-full overflow-hidden flex flex-col">
            <div className="flex-1 min-h-0 overflow-auto bg-gray-50 p-6">
              {selectedQuestionId ? (
                <DocumentDetail 
                  questionId={selectedQuestionId}
                  assistantId={selectedAssistantId!}
                />
              ) : (
                <div className="h-full flex items-center justify-center text-gray-400">
                  <span>请选择要查看的问题</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
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
    border-radius: 8px;
    margin: 4px 8px !important;
  }

  .ant-menu-item-selected {
    background-color: #e6f4ff !important;
    color: #1677ff !important;
  }

  .ant-menu-item:hover {
    background-color: #f5f5f5 !important;
  }

  .ant-menu-submenu-title {
    margin: 0 !important;
    padding: 0 !important;
    height: auto !important;
    line-height: 1.5 !important;
  }

  .ant-menu-submenu-selected > .ant-menu-submenu-title {
    color: #1677ff !important;
  }

  .ant-menu-submenu-arrow {
    right: 8px !important;
  }

  .ant-menu-submenu {
    margin: 4px 8px !important;
  }

  .ant-menu-submenu .ant-menu-item {
    margin-left: 8px !important;
    margin-right: 8px !important;
  }

  .ant-menu {
    height: 100% !important;
    overflow-y: auto !important;
  }
}
`;

// 创建样式元素
const styleSheet = document.createElement('style');
styleSheet.textContent = styles;
document.head.appendChild(styleSheet);

export default QAManagement;
