import React, { useState, useEffect } from 'react';
import { Modal, Checkbox, List, Avatar, Button, Input, Empty, Spin, Divider, Alert } from 'antd';
import { SearchOutlined, UserOutlined, CheckCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { PromptTemplate } from '../../../pages/PromptTemplates';

interface Assistant {
  id: string;
  name: string;
  avatar?: string;
  description: string;
  type: 'qa' | 'chat' | 'custom';
  status: 'online' | 'offline' | 'training';
}

interface BindTemplateModalProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (assistantIds: string[]) => void;
  template: PromptTemplate | null;
  mode?: 'bind' | 'unbind';
}

// 模拟助手数据
const mockAssistants: Assistant[] = [
  {
    id: 'assistant-1',
    name: '产品文档助手',
    description: '专门解答产品相关问题的智能助手',
    type: 'qa',
    status: 'online',
  },
  {
    id: 'assistant-2',
    name: '技术支持助手',
    description: '提供技术文档查询和问题解答服务',
    type: 'qa',
    status: 'online',
  },
  {
    id: 'assistant-3',
    name: '新员工培训助手',
    description: '帮助新员工快速了解公司制度和流程',
    type: 'qa',
    status: 'training',
  },
  {
    id: 'assistant-4',
    name: '销售培训助手',
    description: '提供销售技巧和产品知识培训',
    type: 'qa',
    status: 'offline',
  },
  {
    id: 'assistant-5',
    name: '客服知识库助手',
    description: '协助客服人员快速查找解决方案',
    type: 'qa',
    status: 'online',
  }
];

const BindTemplateModal: React.FC<BindTemplateModalProps> = ({
  open,
  onCancel,
  onConfirm,
  template,
  mode = 'bind'
}) => {
  const [loading, setLoading] = useState(false);
  const [assistants, setAssistants] = useState<Assistant[]>([]);
  const [selectedAssistants, setSelectedAssistants] = useState<string[]>([]);
  const [searchText, setSearchText] = useState('');
  const [filteredAssistants, setFilteredAssistants] = useState<Assistant[]>([]);

  // 加载助手数据
  useEffect(() => {
    if (open) {
      loadAssistants();
    }
  }, [open]);

  // 筛选助手
  useEffect(() => {
    const filtered = assistants.filter(assistant => 
      assistant.name.toLowerCase().includes(searchText.toLowerCase()) ||
      assistant.description.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredAssistants(filtered);
  }, [assistants, searchText]);

  // 加载助手数据
  const loadAssistants = async () => {
    setLoading(true);
    try {
      // 模拟API调用延迟
      await new Promise(resolve => setTimeout(resolve, 800));
      setAssistants(mockAssistants);
      setLoading(false);
    } catch (error) {
      console.error('Failed to load assistants:', error);
      setLoading(false);
    }
  };

  // 重置选择状态
  const resetSelection = () => {
    setSelectedAssistants([]);
    setSearchText('');
  };

  // 处理取消
  const handleCancel = () => {
    resetSelection();
    onCancel();
  };

  // 处理确认
  const handleConfirm = () => {
    onConfirm(selectedAssistants);
    resetSelection();
  };

  // 处理选择助手
  const handleAssistantSelect = (assistantId: string) => {
    setSelectedAssistants(prev => {
      if (prev.includes(assistantId)) {
        return prev.filter(id => id !== assistantId);
      } else {
        return [...prev, assistantId];
      }
    });
  };

  // 获取助手状态标签样式
  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'online':
        return { color: '#52c41a', background: '#f6ffed', borderColor: '#b7eb8f' };
      case 'offline':
        return { color: '#bfbfbf', background: '#f5f5f5', borderColor: '#d9d9d9' };
      case 'training':
        return { color: '#1890ff', background: '#e6f7ff', borderColor: '#91d5ff' };
      default:
        return { color: '#bfbfbf', background: '#f5f5f5', borderColor: '#d9d9d9' };
    }
  };

  // 获取助手状态文本
  const getStatusText = (status: string) => {
    switch (status) {
      case 'online':
        return '在线';
      case 'offline':
        return '离线';
      case 'training':
        return '训练中';
      default:
        return '未知';
    }
  };

  return (
    <Modal
      title={`${mode === 'bind' ? '绑定' : '解绑'}提示词模板：${template?.title || ''}`}
      open={open}
      onCancel={handleCancel}
      footer={[
        <Button key="cancel" onClick={handleCancel}>
          取消
        </Button>,
        <Button 
          key="submit" 
          type={mode === 'bind' ? "primary" : "primary" }
          danger={mode === 'unbind'}
          onClick={handleConfirm}
          disabled={selectedAssistants.length === 0}
        >
          {mode === 'bind' ? '确认绑定' : '确认解绑'} ({selectedAssistants.length})
        </Button>
      ]}
      width={600}
      bodyStyle={{ 
        maxHeight: '60vh', 
        overflowY: 'auto', 
        padding: '16px 24px'
      }}
      className="template-bind-modal"
    >
      {/* 说明文本 */}
      <div className="mb-4">
        {mode === 'bind' ? (
          <p className="text-gray-600 mb-2">
            请选择要将此提示词模板绑定的助手，绑定后该助手将使用此模板作为系统提示词。
          </p>
        ) : (
          <>
            <Alert
              message="注意：解绑后，助手将恢复使用其默认系统提示词"
              type="warning"
              showIcon
              icon={<ExclamationCircleOutlined />}
              style={{marginBottom: 16}}
            />
            <p className="text-gray-600 mb-2">
              请选择要解绑的助手，解绑后助手将不再使用此提示词模板。
            </p>
          </>
        )}
        {template && (
          <div className="bg-gray-50 p-2 rounded text-gray-700 text-sm mb-4 border border-gray-100">
            <div className="font-medium mb-1">模板内容预览：</div>
            <div className="whitespace-pre-line">{template.content}</div>
          </div>
        )}
      </div>

      {/* 搜索框 */}
      <Input
        placeholder="搜索助手..."
        prefix={<SearchOutlined className="text-gray-400" />}
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        className="mb-4"
        allowClear
      />

      {/* 助手列表 */}
      {loading ? (
        <div className="flex justify-center items-center py-8">
          <Spin tip="加载中..." />
        </div>
      ) : filteredAssistants.length === 0 ? (
        <Empty description="没有找到匹配的助手" />
      ) : (
        <List
          dataSource={filteredAssistants}
          renderItem={(assistant) => (
            <List.Item 
              key={assistant.id}
              className="px-2 py-3 hover:bg-gray-50 rounded cursor-pointer transition-colors"
              onClick={() => handleAssistantSelect(assistant.id)}
            >
              <Checkbox
                checked={selectedAssistants.includes(assistant.id)}
                onChange={() => handleAssistantSelect(assistant.id)}
                className="mr-3"
              />
              <List.Item.Meta
                avatar={
                  assistant.avatar ? (
                    <Avatar src={assistant.avatar} />
                  ) : (
                    <Avatar icon={<UserOutlined />} style={{ backgroundColor: '#1890ff' }} />
                  )
                }
                title={
                  <div className="flex items-center">
                    <span className="font-medium">{assistant.name}</span>
                    <span 
                      className="ml-2 text-xs px-1.5 py-0.5 rounded border" 
                      style={getStatusStyle(assistant.status)}
                    >
                      {getStatusText(assistant.status)}
                    </span>
                    {selectedAssistants.includes(assistant.id) && (
                      <CheckCircleOutlined className="ml-auto text-blue-500" />
                    )}
                  </div>
                }
                description={
                  <div className="text-gray-500 text-sm">{assistant.description}</div>
                }
              />
            </List.Item>
          )}
        />
      )}

      {/* 底部统计信息 */}
      <Divider style={{ margin: '16px 0 12px' }} />
      <div className="text-gray-500 text-sm">
        已选择 {selectedAssistants.length} 个助手（共 {assistants.length} 个助手）
      </div>
    </Modal>
  );
};

export default BindTemplateModal;
