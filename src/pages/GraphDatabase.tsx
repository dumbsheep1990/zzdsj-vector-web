import React from 'react';
import { Card, Row, Col, Button, Statistic } from 'antd';
import { Database, FileText, Network } from 'lucide-react';
import PageHeader from '../components/layout/PageHeader';

// 模拟数据，实际应该从API获取
const mockDatabases = [
  {
    id: 1,
    name: '产业政策知识图谱',
    description: '包含产业发展、转型升级、创新驱动等相关政策文件的实体关系数据',
    fileCount: 156,
    nodeCount: 3245,
    lastUpdated: '2024-03-15'
  },
  {
    id: 2,
    name: '科技创新政策图谱',
    description: '科技创新、研发投入、人才引进等科技发展政策数据库',
    fileCount: 89,
    nodeCount: 2167,
    lastUpdated: '2024-03-14'
  },
  {
    id: 3,
    name: '民生政策知识图谱',
    description: '教育、医疗、住房、养老等民生领域政策文档实体关系',
    fileCount: 203,
    nodeCount: 4521,
    lastUpdated: '2024-03-13'
  },
  {
    id: 4,
    name: '财税政策知识图谱',
    description: '税收优惠、财政补贴、专项资金等财税支持政策数据',
    fileCount: 145,
    nodeCount: 2876,
    lastUpdated: '2024-03-12'
  },
  {
    id: 5,
    name: '营商环境政策图谱',
    description: '市场准入、行政审批、企业服务等优化营商环境政策数据',
    fileCount: 167,
    nodeCount: 3098,
    lastUpdated: '2024-03-11'
  },
  {
    id: 6,
    name: '区域发展政策图谱',
    description: '区域协调发展、城乡统筹、区域规划等政策文件数据',
    fileCount: 134,
    nodeCount: 2789,
    lastUpdated: '2024-03-10'
  }
];

const GraphDatabase: React.FC = () => {
  const primaryActions = [
    {
      icon: <Database size={16} />,
      label: '新建图谱',
      onClick: () => console.log('新建图谱')
    }
  ];

  return (
    <div>
      <PageHeader
        title="图谱数据库"
        parentTitle="知识图谱"
        description="管理知识图谱数据库"
        primaryActions={primaryActions}
      />
      <div className="p-6">
        <Row gutter={[16, 16]}>
          {mockDatabases.map(db => (
            <Col key={db.id} xs={24} sm={12} lg={8}>
              <Card
                hoverable
                className="h-full"
                actions={[
                  <Button type="link" key="preview" icon={<Network size={16} />}>
                    预览图谱
                  </Button>,
                  <Button type="link" key="files" icon={<FileText size={16} />}>
                    查看文件
                  </Button>
                ]}
              >
                <Card.Meta
                  title={db.name}
                  description={db.description}
                  className="mb-4"
                />
                <Row gutter={16}>
                  <Col span={12}>
                    <Statistic
                      title="文件数量"
                      value={db.fileCount}
                      suffix="个"
                    />
                  </Col>
                  <Col span={12}>
                    <Statistic
                      title="节点数量"
                      value={db.nodeCount}
                      suffix="个"
                    />
                  </Col>
                </Row>
                <div className="mt-4 text-gray-400 text-sm">
                  最后更新：{db.lastUpdated}
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
};

export default GraphDatabase; 