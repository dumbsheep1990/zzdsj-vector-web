import React from 'react';
import { Modal, Table, Button, Tag } from 'antd';
import { AgentConfig } from '../../pages/workflow/types';

interface AgentSelectionModalProps {
  visible: boolean;
  onCancel: () => void;
  agents: AgentConfig[];
  onSelectAgent: (agent: AgentConfig) => void;
}

const AgentSelectionModal: React.FC<AgentSelectionModalProps> = ({
  visible,
  onCancel,
  agents,
  onSelectAgent
}) => {
  const columns = [
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: '模型',
      dataIndex: 'model',
      key: 'model',
    },
    {
      title: '能力',
      key: 'capabilities',
      render: (_: string, record: AgentConfig) => (
        <>
          {record.knowledgeBase && <Tag color="blue">知识库</Tag>}
          {record.webSearch && <Tag color="green">网络搜索</Tag>}
          {record.imageSupport && <Tag color="purple">图像支持</Tag>}
          {record.voiceSupport && <Tag color="orange">语音支持</Tag>}
        </>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (_: string, record: AgentConfig) => (
        <Button type="primary" size="small" onClick={() => onSelectAgent(record)}>
          添加
        </Button>
      ),
    },
  ];

  return (
    <Modal
      title="选择智能体"
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={800}
    >
      <Table 
        dataSource={agents} 
        columns={columns} 
        rowKey="id"
        pagination={false}
      />
    </Modal>
  );
};

export default AgentSelectionModal; 