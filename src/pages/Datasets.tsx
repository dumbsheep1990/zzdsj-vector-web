import React from 'react';
import { Table, Card, Button, Progress, Space, Tag } from 'antd';
import type { TableProps } from 'antd';
import { Plus, Download, RefreshCw } from 'lucide-react';

interface Dataset {
  id: string;
  name: string;
  description: string;
  size: string;
  records: number;
  lastUpdated: string;
  status: 'ready' | 'processing' | 'error';
  type: string;
}

const mockDatasets: Dataset[] = [
  {
    id: '1',
    name: '通用知识库',
    description: '包含各领域基础知识的数据集',
    size: '2.5GB',
    records: 1000000,
    lastUpdated: '2025-03-22',
    status: 'ready',
    type: 'knowledge'
  },
  {
    id: '2',
    name: '专业文档集',
    description: '行业专业文档和技术资料集合',
    size: '1.8GB',
    records: 500000,
    lastUpdated: '2025-03-21',
    status: 'processing',
    type: 'document'
  },
  {
    id: '3',
    name: '问答语料库',
    description: '高质量问答对训练数据',
    size: '3.2GB',
    records: 2000000,
    lastUpdated: '2025-03-20',
    status: 'ready',
    type: 'qa'
  }
];

const Datasets: React.FC = () => {
  const columns: TableProps<Dataset>['columns'] = [
    {
      title: '数据集名称',
      dataIndex: 'name',
      key: 'name',
      width: '15%',
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      width: '25%',
    },
    {
      title: '大小',
      dataIndex: 'size',
      key: 'size',
      width: '10%',
    },
    {
      title: '记录数',
      dataIndex: 'records',
      key: 'records',
      width: '10%',
      render: (records: number) => records.toLocaleString(),
    },
    {
      title: '最后更新',
      dataIndex: 'lastUpdated',
      key: 'lastUpdated',
      width: '12%',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: '10%',
      render: (status: string) => {
        const color = status === 'ready' ? 'success' : status === 'processing' ? 'processing' : 'error';
        const text = status === 'ready' ? '就绪' : status === 'processing' ? '处理中' : '错误';
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      width: '8%',
      render: (type: string) => {
        const typeMap: Record<string, { color: string; text: string }> = {
          knowledge: { color: 'blue', text: '知识库' },
          document: { color: 'green', text: '文档' },
          qa: { color: 'purple', text: '问答' },
        };
        const { color, text } = typeMap[type] || { color: 'default', text: type };
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: '操作',
      key: 'action',
      width: '10%',
      render: (_, record) => (
        <Space>
          <Button
            type="text"
            icon={<Download className="w-4 h-4" />}
            disabled={record.status === 'processing'}
          />
          <Button
            type="text"
            icon={<RefreshCw className="w-4 h-4" />}
            disabled={record.status === 'processing'}
          />
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">数据集管理</h1>
        <Button type="primary" icon={<Plus className="w-4 h-4" />}>
          添加数据集
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <div className="text-center">
            <h3 className="text-lg font-medium mb-2">总数据集数量</h3>
            <p className="text-3xl font-bold text-blue-600">3</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <h3 className="text-lg font-medium mb-2">总记录数</h3>
            <p className="text-3xl font-bold text-green-600">3.5M</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <h3 className="text-lg font-medium mb-2">存储使用</h3>
            <Progress type="circle" percent={75} width={80} />
          </div>
        </Card>
      </div>

      <Table
        columns={columns}
        dataSource={mockDatasets}
        rowKey="id"
        pagination={{
          total: mockDatasets.length,
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
        }}
      />
    </div>
  );
};

export default Datasets;
