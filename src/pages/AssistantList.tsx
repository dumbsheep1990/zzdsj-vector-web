import React, { useState, useMemo } from 'react';
import { Card, List, Button, Tag, Space, Avatar, Modal, Form, Input, Select, message, Badge, Dropdown, Tooltip, Typography, Divider, Statistic, Row, Col, Progress } from 'antd';
import { PlusOutlined, RobotOutlined, EditOutlined, MessageOutlined, DeleteOutlined, DownOutlined, SyncOutlined, FilterOutlined, SortAscendingOutlined, FileSearchOutlined, SettingOutlined, InfoCircleOutlined, StarOutlined, StarFilled, EyeOutlined, BarChartOutlined, TagsOutlined, GlobalOutlined, BookOutlined, DatabaseOutlined, ClockCircleOutlined, LinkOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import PageHeader from '../components/layout/PageHeader';

interface Assistant {
  id: string;
  name: string;
  description: string;
  type: 'general' | 'document' | 'analysis';
  model: string;
  capabilities: string[];
  status: 'online' | 'offline';
  createTime: string;
  knowledgeBases?: { id: string; name: string; documentCount: number }[];
  usageStats?: { 
    totalChats: number; 
    totalQueries: number;
    averageResponseTime: number;
    satisfactionRate: number;
  };
}

const mockAssistants: Assistant[] = [
  {
    id: 'assistant-1',
    name: '知识库问答助手',
    description: '基于企业内部知识库的智能问答助手，可以回答关于公司政策、产品信息和操作指南等方面的问题。',
    type: 'document',
    model: 'GPT-4',
    capabilities: ['知识问答', '信息检索', '文档分析'],
    status: 'online',
    createTime: '2025-02-18 09:30:00',
    knowledgeBases: [
      { id: 'kb-1', name: '企业政策库', documentCount: 124 },
      { id: 'kb-2', name: '产品手册', documentCount: 56 }
    ],
    usageStats: {
      totalChats: 1245,
      totalQueries: 5632,
      averageResponseTime: 1.2,
      satisfactionRate: 92
    }
  },
  {
    id: 'assistant-2',
    name: '数据分析助手',
    description: '专注于数据分析的AI助手，可以帮助用户分析数据趋势，生成报表，并提供数据可视化建议。',
    type: 'analysis',
    model: 'GPT-4-32k',
    capabilities: ['数据分析', '统计建模', '内容总结'],
    status: 'online',
    createTime: '2025-02-10 14:15:00',
    knowledgeBases: [
      { id: 'kb-3', name: '数据分析指南', documentCount: 78 }
    ],
    usageStats: {
      totalChats: 867,
      totalQueries: 3241,
      averageResponseTime: 2.5,
      satisfactionRate: 88
    }
  },
  {
    id: 'assistant-3',
    name: '通用知识助手',
    description: '提供广泛知识领域的问答服务，包括科学、历史、文化等各个方面的信息。',
    type: 'general',
    model: 'GPT-3.5',
    capabilities: ['知识问答', '内容总结', '信息检索'],
    status: 'offline',
    createTime: '2025-02-05 16:45:00',
    knowledgeBases: [],
    usageStats: {
      totalChats: 3452,
      totalQueries: 12568,
      averageResponseTime: 0.8,
      satisfactionRate: 95
    }
  },
  {
    id: 'assistant-4',
    name: '文档处理助手',
    description: '专门处理文档的AI助手，提供文档摘要、关键信息提取和内容分类等功能。',
    type: 'document',
    model: 'GPT-4',
    capabilities: ['文档分析', '内容总结', '信息检索'],
    status: 'online',
    createTime: '2025-01-28 11:20:00',
    knowledgeBases: [
      { id: 'kb-4', name: '技术文档库', documentCount: 215 },
      { id: 'kb-5', name: '研究论文集', documentCount: 143 }
    ],
    usageStats: {
      totalChats: 967,
      totalQueries: 4328,
      averageResponseTime: 1.8,
      satisfactionRate: 90
    }
  }
];

const AssistantList: React.FC = () => {
  const [form] = Form.useForm();
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [currentAssistant, setCurrentAssistant] = useState<Assistant | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest' | 'alphabetical'>('newest');

  const getFilteredAssistants = () => {
    let filtered = [...mockAssistants];
    
    if (filterStatus) {
      filtered = filtered.filter(assistant => assistant.status === filterStatus);
    }
    
    switch (sortOrder) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.createTime).getTime() - new Date(a.createTime).getTime());
        break;
      case 'oldest':
        filtered.sort((a, b) => new Date(a.createTime).getTime() - new Date(b.createTime).getTime());
        break;
      case 'alphabetical':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }
    
    return filtered;
  };

  const toggleFavorite = (assistantId: string) => {
    if (favorites.includes(assistantId)) {
      setFavorites(favorites.filter(id => id !== assistantId));
    } else {
      setFavorites([...favorites, assistantId]);
    }
  };

  const handleAdd = () => {
    setModalMode('create');
    setCurrentAssistant(null);
    setModalVisible(true);
  };

  const handleEdit = (record: Assistant) => {
    setModalMode('edit');
    setCurrentAssistant(record);
    form.setFieldsValue(record);
    setModalVisible(true);
  };

  const handleDelete = (record: Assistant) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除助手"${record.name}"吗？`,
      onOk: () => {
        message.success('删除成功');
      },
    });
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      console.log('Form values:', values);
      message.success(modalMode === 'create' ? '创建成功' : '更新成功');
      setModalVisible(false);
      form.resetFields();
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const handleModalCancel = () => {
    setModalVisible(false);
    form.resetFields();
  };

  const getRandomGradient = (id: string) => {
    const seed = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const colorPairs = [
      ['#1890ff', '#36cbcb'], // 蓝青
      ['#7265e6', '#6bc4ff'], // 紫蓝
      ['#ffbf00', '#ff9500'], // 橙黄
      ['#00c161', '#00e3ae'], // 翠绿
      ['#f56565', '#fc8181'], // 红粉
      ['#6b46c1', '#9f7aea'], // 紫色
      ['#4c51bf', '#667eea'], // 靛蓝
      ['#38b2ac', '#4fd1c5'], // 青绿
      ['#ed8936', '#f6ad55'], // 橘色
      ['#9f7aea', '#c3dafe']  // 淡紫
    ];
    
    const colorIndex = seed % colorPairs.length;
    const [color1, color2] = colorPairs[colorIndex];
    
    return `linear-gradient(120deg, ${color1} 0%, ${color2} 100%)`;
  };

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <PageHeader 
        title="助手列表" 
        parentTitle="问答助手"
        description={`共 ${mockAssistants.length} 个助手`}
        primaryActions={[
          {
            icon: <PlusOutlined />,
            label: '新建助手',
            onClick: handleAdd
          }
        ]}
        secondaryActions={[
          {
            icon: <SyncOutlined />,
            label: '刷新',
            onClick: () => message.success('列表已刷新')
          },
          {
            icon: <FileSearchOutlined />,
            label: '批量导入',
            onClick: () => message.info('批量导入功能开发中')
          }
        ]}
        filterComponent={
          <Space>
            <Dropdown
              menu={{
                items: [
                  { key: 'all', label: '全部状态' },
                  { key: 'online', label: '在线' },
                  { key: 'offline', label: '离线' }
                ],
                onClick: ({ key }) => setFilterStatus(key === 'all' ? null : key)
              }}
            >
              <Button icon={<FilterOutlined />}>
                {filterStatus === 'online' ? '在线' : filterStatus === 'offline' ? '离线' : '全部状态'} <DownOutlined />
              </Button>
            </Dropdown>
            <Dropdown
              menu={{
                items: [
                  { key: 'newest', label: '最新创建' },
                  { key: 'oldest', label: '最早创建' },
                  { key: 'alphabetical', label: '按名称排序' }
                ],
                onClick: ({ key }) => setSortOrder(key as any)
              }}
            >
              <Button icon={<SortAscendingOutlined />}>
                {sortOrder === 'newest' ? '最新创建' : sortOrder === 'oldest' ? '最早创建' : '按名称排序'} <DownOutlined />
              </Button>
            </Dropdown>
          </Space>
        }
      />
      
      <div className="p-6 flex-1 overflow-auto bg-gray-50">
        <List<Assistant>
          grid={{ gutter: 24, xs: 1, sm: 1, md: 2, lg: 2, xl: 3, xxl: 4 }}
          dataSource={getFilteredAssistants()}
          renderItem={(item) => {
            const gradientStyle = getRandomGradient(item.id);
            return (
              <List.Item>
                <Badge.Ribbon 
                  text={favorites.includes(item.id) ? '已收藏' : null} 
                  color="gold" 
                  style={{ display: favorites.includes(item.id) ? 'block' : 'none' }}
                >
                  <Card
                    hoverable
                    className="border border-gray-200 rounded-lg overflow-hidden"
                    style={{ 
                      height: '100%',
                      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.08)',
                      transition: 'all 0.3s ease'
                    }}
                    headStyle={{ 
                      borderBottom: 'none', 
                      background: gradientStyle,
                      padding: '16px',
                      color: '#fff'
                    }}
                    bodyStyle={{ 
                      padding: '0',
                      display: 'flex', 
                      flexDirection: 'column', 
                      height: 'calc(100% - 72px)'
                    }}
                    title={
                      <div className="flex items-start justify-between">
                        <Space size="middle" align="start">
                          <Avatar 
                            icon={<RobotOutlined />} 
                            size={48}
                            style={{ 
                              backgroundColor: 'rgba(255, 255, 255, 0.3)',
                              color: '#fff',
                              boxShadow: '0 2px 6px rgba(0, 0, 0, 0.15)'
                            }} 
                          />
                          <div>
                            <div className="flex items-center">
                              <Typography.Title level={5} style={{ margin: 0, color: '#fff' }}>
                                {item.name}
                              </Typography.Title>
                              <Tooltip title={favorites.includes(item.id) ? '取消收藏' : '收藏'}>
                                <Button 
                                  type="text" 
                                  size="small" 
                                  style={{ color: '#fff' }}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleFavorite(item.id);
                                  }}
                                  icon={favorites.includes(item.id) 
                                    ? <StarFilled style={{ color: '#ffe58f' }} /> 
                                    : <StarOutlined />
                                  }
                                />
                              </Tooltip>
                            </div>
                            <Space size={4}>
                              <Badge status={item.status === 'online' ? 'success' : 'default'} />
                              <span className="text-xs" style={{ color: 'rgba(255, 255, 255, 0.85)' }}>
                                {item.status === 'online' ? '在线' : '离线'}
                              </span>
                            </Space>
                          </div>
                        </Space>
                        
                        <Button
                          type="primary"
                          style={{ 
                            backgroundColor: '#ffffff', 
                            color: '#1890ff',
                            borderColor: '#ffffff',
                            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 500
                          }}
                          icon={<MessageOutlined />}
                          onClick={() => { console.log('Start chat with:', item.name); }}
                        >
                          开始对话
                        </Button>
                      </div>
                    }
                    actions={[
                      <Tooltip title="编辑助手">
                        <Button
                          type="text"
                          icon={<EditOutlined />}
                          onClick={() => handleEdit(item)}
                        />
                      </Tooltip>,
                      <Tooltip title="查看使用统计">
                        <Button
                          type="text"
                          icon={<BarChartOutlined />}
                          onClick={() => message.info('统计功能开发中')}
                        />
                      </Tooltip>,
                      <Tooltip title="高级设置">
                        <Button
                          type="text"
                          icon={<SettingOutlined />}
                          onClick={() => message.info('高级设置功能开发中')}
                        />
                      </Tooltip>,
                      <Tooltip title="删除助手">
                        <Button
                          type="text"
                          danger
                          icon={<DeleteOutlined />}
                          onClick={() => handleDelete(item)}
                        />
                      </Tooltip>
                    ]}
                  >
                    <div className="p-4 flex-1">
                      <Typography.Paragraph 
                        ellipsis={{ rows: 2 }}
                        className="text-gray-600"
                        style={{ margin: '0 0 12px 0' }}
                      >
                        {item.description}
                      </Typography.Paragraph>
                      
                      <Space wrap className="mb-3">
                        {item.capabilities.map((cap) => (
                          <Tag key={cap} color="blue">{cap}</Tag>
                        ))}
                      </Space>
                    </div>
                    
                    <div className="bg-gray-50 p-4 border-t border-gray-100">
                      <Row gutter={[16, 12]}>
                        <Col span={12}>
                          <div className="flex items-center text-xs text-gray-500">
                            <GlobalOutlined className="mr-1" /> 
                            <span>{item.model}</span>
                          </div>
                        </Col>
                        <Col span={12}>
                          <div className="flex items-center text-xs text-gray-500">
                            <ClockCircleOutlined className="mr-1" />
                            <span>{item.createTime.split(' ')[0]}</span>
                          </div>
                        </Col>

                        {item.usageStats && (
                          <>
                            <Col span={24}>
                              <Divider style={{ margin: '8px 0' }} />
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-medium">
                                  <BarChartOutlined className="mr-1" />
                                  使用情况
                                </span>
                                <span className="text-xs text-gray-500">
                                  满意度: {item.usageStats.satisfactionRate}%
                                </span>
                              </div>
                              <div className="text-xs text-gray-500 mb-1">
                                总对话次数: {item.usageStats.totalChats}
                              </div>
                            </Col>
                          </>
                        )}

                        {item.knowledgeBases && item.knowledgeBases.length > 0 && (
                          <Col span={24}>
                            <Divider style={{ margin: '8px 0' }} />
                            <div className="flex items-center mb-2">
                              <span className="text-xs font-medium mr-2">
                                <BookOutlined className="mr-1" />
                                关联知识库:
                              </span>
                              <div className="flex flex-wrap">
                                {item.knowledgeBases.map((kb) => (
                                  <Tag 
                                    key={kb.id} 
                                    color="processing" 
                                    className="mb-0 mr-1"
                                    style={{ fontSize: '10px' }}
                                  >
                                    {kb.name} ({kb.documentCount})
                                  </Tag>
                                ))}
                              </div>
                            </div>
                          </Col>
                        )}
                        
                        {(!item.knowledgeBases || item.knowledgeBases.length === 0) && (
                          <Col span={24}>
                            <Divider style={{ margin: '8px 0' }} />
                            <div className="flex justify-center items-center text-gray-400 text-xs py-1">
                              <InfoCircleOutlined className="mr-1" />
                              未关联知识库
                            </div>
                          </Col>
                        )}
                      </Row>
                    </div>
                  </Card>
                </Badge.Ribbon>
              </List.Item>
            );
          }}
        />
      </div>

      <Modal
        title={modalMode === 'create' ? '新建 AI 助手' : '编辑 AI 助手'}
        open={modalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            status: 'online',
            type: 'general',
            model: 'GPT-4'
          }}
        >
          <Form.Item
            name="name"
            label="助手名称"
            rules={[{ required: true, message: '请输入助手名称' }]}
          >
            <Input placeholder="请输入助手名称" />
          </Form.Item>

          <Form.Item
            name="description"
            label="描述"
            rules={[{ required: true, message: '请输入助手描述' }]}
          >
            <Input.TextArea rows={4} placeholder="请输入助手描述" />
          </Form.Item>

          <Form.Item
            name="type"
            label="类型"
            rules={[{ required: true, message: '请选择助手类型' }]}
          >
            <Select>
              <Select.Option value="general">通用知识</Select.Option>
              <Select.Option value="document">文档处理</Select.Option>
              <Select.Option value="analysis">数据分析</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="model"
            label="模型"
            rules={[{ required: true, message: '请选择模型' }]}
          >
            <Select>
              <Select.Option value="GPT-4">GPT-4</Select.Option>
              <Select.Option value="GPT-4-32k">GPT-4-32k</Select.Option>
              <Select.Option value="GPT-3.5">GPT-3.5</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="capabilities"
            label="能力标签"
            rules={[{ required: true, message: '请选择能力标签' }]}
          >
            <Select mode="multiple" placeholder="请选择能力标签">
              <Select.Option value="知识问答">知识问答</Select.Option>
              <Select.Option value="信息检索">信息检索</Select.Option>
              <Select.Option value="文档分析">文档分析</Select.Option>
              <Select.Option value="内容总结">内容总结</Select.Option>
              <Select.Option value="数据分析">数据分析</Select.Option>
              <Select.Option value="统计建模">统计建模</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="status"
            label="状态"
            rules={[{ required: true, message: '请选择状态' }]}
          >
            <Select>
              <Select.Option value="online">在线</Select.Option>
              <Select.Option value="offline">离线</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AssistantList;
