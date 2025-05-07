import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Button, Pagination, message } from 'antd';
import { Database, FileText, Network, Calendar, Trash2 } from 'lucide-react';
import PageHeader from '../components/layout/PageHeader';
import GraphDatabaseListSkeleton from '../components/skeleton/GraphDatabaseListSkeleton';
import ConfirmDeleteModal from '../components/modal/ConfirmDeleteModal';

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
  // 状态管理
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(6);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [graphData, setGraphData] = useState<any[]>([]);
  const [deleteModalVisible, setDeleteModalVisible] = useState<boolean>(false);
  const [graphToDelete, setGraphToDelete] = useState<number | null>(null);
  
  // 模拟API加载数据
  useEffect(() => {
    setLoading(true);
    
    // 模拟延迟加载
    const timer = setTimeout(() => {
      setGraphData(mockDatabases);
      setTotalCount(mockDatabases.length);
      setLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);

  // 删除图谱
  const handleDelete = (id: number) => {
    setGraphToDelete(id);
    setDeleteModalVisible(true);
  };

  // 确认删除
  const confirmDelete = () => {
    // 模拟删除操作
    const updatedData = graphData.filter(item => item.id !== graphToDelete);
    setGraphData(updatedData);
    setTotalCount(updatedData.length);
    message.success('删除成功');
    setDeleteModalVisible(false);
  };

  // 分页处理
  const handlePageChange = (page: number, size?: number) => {
    setCurrentPage(page);
    if (size) setPageSize(size);
  };

  // 获取当前页数据
  const getCurrentPageData = () => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return graphData.slice(startIndex, endIndex);
  };

  // 页面操作按钮
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
        {loading ? (
          <GraphDatabaseListSkeleton count={6} />
        ) : (
          <>
            <Row gutter={[16, 16]}>
              {getCurrentPageData().map(db => (
                <Col key={db.id} xs={24} sm={12} lg={8}>
                  <Card
                  hoverable
                  className="h-full"
                  style={{
                    borderRadius: '10px',
                    height: '100%',
                    position: 'relative',
                    overflow: 'hidden',
                    transition: 'all 0.3s ease',
                    padding: '1px',
                    background: 'linear-gradient(145deg, rgba(0, 201, 255, 0.3), rgba(146, 254, 157, 0.3))',
                    boxShadow: '0 5px 15px rgba(0, 0, 0, 0.08)'
                  }}
                  bodyStyle={{ 
                    background: 'linear-gradient(145deg, rgba(255,255,255,1) 0%, rgba(248,252,253,1) 100%)',
                    borderRadius: '9px', 
                    height: '100%',
                    padding: '22px' 
                  }}
                >
                  <div className="relative z-10 mb-5 mt-1">
                    <h3 className="text-lg font-medium mb-2">{db.name}</h3>
                    <p className="text-gray-500 text-sm" style={{ minHeight: '40px' }}>{db.description}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-5">
                    <div className="p-3 rounded-lg" style={{ background: 'rgba(0, 201, 255, 0.05)', border: '1px solid rgba(0, 201, 255, 0.1)' }}>
                      <div className="flex items-center mb-1">
                        <div className="w-7 h-7 flex items-center justify-center mr-2 rounded-md" 
                          style={{ 
                            background: 'linear-gradient(135deg, rgba(0, 201, 255, 0.1), rgba(0, 201, 255, 0.2))',
                            boxShadow: '0 2px 4px rgba(0, 201, 255, 0.1)' 
                          }}>
                          <FileText size={14} style={{ color: '#00c9ff' }} />
                        </div>
                        <div className="text-xs text-gray-500">文件数量</div>
                      </div>
                      <div className="text-xl font-semibold pl-1" style={{ color: '#444' }}>{db.fileCount} <span className="text-xs text-gray-400">个</span></div>
                    </div>
                    <div className="p-3 rounded-lg" style={{ background: 'rgba(146, 254, 157, 0.05)', border: '1px solid rgba(146, 254, 157, 0.1)' }}>
                      <div className="flex items-center mb-1">
                        <div className="w-7 h-7 flex items-center justify-center mr-2 rounded-md" 
                          style={{ 
                            background: 'linear-gradient(135deg, rgba(146, 254, 157, 0.1), rgba(146, 254, 157, 0.2))',
                            boxShadow: '0 2px 4px rgba(146, 254, 157, 0.1)' 
                          }}>
                          <Network size={14} style={{ color: '#92fe9d' }} />
                        </div>
                        <div className="text-xs text-gray-500">节点数量</div>
                      </div>
                      <div className="text-xl font-semibold pl-1" style={{ color: '#444' }}>{db.nodeCount} <span className="text-xs text-gray-400">个</span></div>
                    </div>
                  </div>
                  
                  <div className="flex items-center text-gray-400 text-xs mb-4 bg-gray-50 rounded-md px-3 py-2">
                    <Calendar size={12} className="mr-2 text-gray-400" />
                    <span>最后更新：{db.lastUpdated}</span>
                  </div>
                  
                  <div className="flex pt-4 mt-auto" style={{ borderTop: '1px solid rgba(240,240,240,0.7)' }}>
                    <div className="flex flex-1">
                      <Button 
                        type="default" 
                        size="middle"
                        style={{
                          background: 'rgba(0, 201, 255, 0.08)',
                          borderColor: 'rgba(0, 201, 255, 0.2)',
                          color: '#00a6d6',
                          display: 'flex',
                          alignItems: 'center',
                          borderRadius: '6px',
                          boxShadow: '0 2px 4px rgba(0, 201, 255, 0.1)'
                        }}
                        icon={<Network size={14} className="mr-1" />}
                      >
                        预览图谱
                      </Button>
                      <Button 
                        type="default" 
                        size="middle"
                        className="ml-2"
                        style={{
                          background: 'white',
                          borderColor: 'rgba(220,220,220,0.8)',
                          color: '#666',
                          display: 'flex',
                          alignItems: 'center',
                          borderRadius: '6px'
                        }}
                        icon={<FileText size={14} className="mr-1" />}
                      >
                        查看文件
                      </Button>
                    </div>
                    <Button
                      danger
                      type="default"
                      size="middle"
                      onClick={() => handleDelete(db.id)}
                      style={{
                        background: 'rgba(255, 76, 76, 0.08)',
                        borderColor: 'rgba(255, 76, 76, 0.2)',
                        color: '#ff4d4f',
                        display: 'flex',
                        alignItems: 'center',
                        borderRadius: '6px'
                      }}
                      icon={<Trash2 size={14} className="mr-1" />}
                    >
                      删除
                    </Button>
                  </div>
                </Card>
                </Col>
              ))}
            </Row>

            {/* 翻页组件 */}
            <div className="mt-6 flex justify-center">
              <Pagination
                current={currentPage}
                pageSize={pageSize}
                total={totalCount}
                onChange={handlePageChange}
                showSizeChanger={false}
              />
            </div>

            {/* 删除确认对话框 */}
            <ConfirmDeleteModal
              visible={deleteModalVisible}
              onConfirm={confirmDelete}
              onCancel={() => setDeleteModalVisible(false)}
              message={`您确定要删除这个知识图谱吗？`}
              subMessage="删除后无法恢复。"
            />
          </>
        )}
      </div>
    </div>
  );
};

export default GraphDatabase;