import React from 'react';
import { Table, Button, Space, Tag } from 'antd';
import type { TableProps } from 'antd';
import { MessageSquare, Search } from 'lucide-react';

interface QARecord {
  id: string;
  question: string;
  answer: string;
  assistant: string;
  timestamp: string;
  status: 'completed' | 'pending' | 'failed';
  category: string;
}

const mockData: QARecord[] = [
  {
    id: '1',
    question: '如何优化大规模数据处理性能？',
    answer: '可以通过以下方式优化：1. 使用索引 2. 数据分片 3. 缓存策略 4. 并行处理',
    assistant: '技术顾问助手',
    timestamp: '2025-03-22 14:30',
    status: 'completed',
    category: '技术咨询'
  },
  {
    id: '2',
    question: '企业数字化转型的关键步骤是什么？',
    answer: '主要包括：1. 战略规划 2. 技术评估 3. 人才培养 4. 流程重构 5. 数据治理',
    assistant: '企业咨询助手',
    timestamp: '2025-03-22 15:45',
    status: 'completed',
    category: '企业管理'
  }
];

const QAManagement: React.FC = () => {
  const columns: TableProps<QARecord>['columns'] = [
    {
      title: '问题',
      dataIndex: 'question',
      key: 'question',
      width: '25%',
    },
    {
      title: '回答',
      dataIndex: 'answer',
      key: 'answer',
      width: '35%',
      ellipsis: true,
    },
    {
      title: '助手',
      dataIndex: 'assistant',
      key: 'assistant',
      width: '10%',
    },
    {
      title: '时间',
      dataIndex: 'timestamp',
      key: 'timestamp',
      width: '12%',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: '8%',
      render: (status: string) => {
        const color = status === 'completed' ? 'success' : status === 'pending' ? 'processing' : 'error';
        const text = status === 'completed' ? '已完成' : status === 'pending' ? '处理中' : '失败';
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: '操作',
      key: 'action',
      width: '10%',
      render: () => (
        <Space>
          <Button type="link" icon={<Search className="w-4 h-4" />}>
            详情
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">问答管理</h1>
        <Space>
          <Button icon={<MessageSquare className="w-4 h-4" />}>新建会话</Button>
        </Space>
      </div>
      
      <Table
        columns={columns}
        dataSource={mockData}
        rowKey="id"
        pagination={{
          total: mockData.length,
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
        }}
      />
    </div>
  );
};

export default QAManagement;
