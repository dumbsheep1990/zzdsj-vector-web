import React from 'react';
import { Card, Avatar, Button, Typography, Tag, Space, Switch, message, Tooltip, Row, Col, Divider } from 'antd';
import { 
  RobotOutlined, MessageOutlined, EditOutlined, BarChartOutlined, 
  SettingOutlined, DeleteOutlined, StarOutlined, StarFilled, 
  InfoCircleOutlined, BookOutlined,
  ApiOutlined, NodeIndexOutlined, SortAscendingOutlined, CopyOutlined,
  CheckCircleFilled, CloseCircleFilled
} from '@ant-design/icons';
import { Assistant } from './types';

const { Text, Title, Paragraph } = Typography;

interface AssistantCardProps {
  assistant: Assistant;
  isFavorite: boolean;
  toggleFavorite: (id: string) => void;
  handleEdit: (assistant: Assistant) => void;
  handleDelete: (id: string) => void;
  handleStatusChange: (id: string, status: 'online' | 'offline') => void;
  getRandomGradient?: () => string;
}

const AssistantCard: React.FC<AssistantCardProps> = ({ 
  assistant, 
  isFavorite, 
  toggleFavorite, 
  handleEdit, 
  handleDelete,
  handleStatusChange,
  getRandomGradient 
}) => {
  const cardStyle = { 
    width: "100%",
    borderRadius: "16px",
    overflow: "hidden"
  };
  
  // Determine header gradient based on assistant ID to ensure consistency
  const getGradient = (id: string) => {
    // Generate a deterministic number from the assistant ID
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
      hash = ((hash << 5) - hash) + id.charCodeAt(i);
      hash = hash & hash; // Convert to 32bit integer
    }
    
    // Approved gradients - only blues, teals, cyans, greens, and purples
    // Deliberately avoiding red and pink tones
    // Using dual-color, same color family gradients
    const gradients = [
      'linear-gradient(135deg, #0062E6, #33AEFF)', // Blue family
      'linear-gradient(135deg, #1E3C72, #2A5298)', // Deep blue family
      'linear-gradient(135deg, #4364F7, #6FB1FC)', // Medium blue family
      'linear-gradient(135deg, #2193b0, #6dd5ed)', // Teal family
      'linear-gradient(135deg, #0F2027, #203A43)', // Dark blue-gray family
      'linear-gradient(135deg, #3a7bd5, #00d2ff)', // Blue to cyan family
      'linear-gradient(135deg, #396afc, #2948ff)', // Bright blue family
      'linear-gradient(135deg, #0F9B58, #03C988)', // Green family
      'linear-gradient(135deg, #134E5E, #1D7D77)', // Dark teal family
      'linear-gradient(135deg, #2E3192, #1BFFFF)', // Deep blue to cyan family
      'linear-gradient(135deg, #4B79A1, #283E51)', // Steel blue family
      'linear-gradient(135deg, #3A7BD5, #3A6073)', // Navy blue family
      'linear-gradient(135deg, #2C3E50, #4CA1AF)', // Dark blue to light blue family
      'linear-gradient(135deg, #5614B0, #A70FD6)', // Purple family
      'linear-gradient(135deg, #3c1053, #ad5389)', // Deep purple family
    ];
    
    // Select gradient based on hash
    const index = Math.abs(hash) % gradients.length;
    return gradients[index];
  };

  // Use the assistant's ID to get a consistent gradient
  const headerGradient = getGradient(assistant.id);
  
  const onStatusChange = (checked: boolean) => {
    handleStatusChange(assistant.id, checked ? 'online' : 'offline');
  };
  
  const copyApiEndpoint = () => {
    const endpoint = `/api/assistants/${assistant.id}`;
    navigator.clipboard.writeText(endpoint)
      .then(() => message.success('API接口地址已复制到剪贴板'))
      .catch(() => message.error('复制失败'));
  };

  return (
    <Card
      style={cardStyle}
      className="shadow-sm transition-shadow duration-300 hover:shadow-md"
      cover={
        <div 
          style={{ 
            height: '80px', 
            position: 'relative',
            overflow: 'hidden',
            background: headerGradient,
            borderTopLeftRadius: '16px',
            borderTopRightRadius: '16px',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'linear-gradient(to bottom, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.4))',
              backdropFilter: 'blur(1px)',
              zIndex: 1
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              opacity: 0.07,
              backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'20\' height=\'20\' viewBox=\'0 0 20 20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\' fill-rule=\'evenodd\'%3E%3Ccircle cx=\'3\' cy=\'3\' r=\'1\'/%3E%3Ccircle cx=\'13\' cy=\'13\' r=\'1\'/%3E%3C/g%3E%3C/svg%3E")',
              zIndex: 1
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backdropFilter: 'blur(4px)',
              background: 'rgba(255, 255, 255, 0.05)',
              zIndex: 1
            }}
          />
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            padding: '16px',
            height: '100%',
            position: 'relative',
            zIndex: 2
          }}>
            <div className="flex items-center">
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  overflow: 'hidden',
                  marginRight: '12px',
                  background: 'rgba(255, 255, 255, 0.25)',
                  backdropFilter: 'blur(10px)',
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                  border: '2px solid rgba(255, 255, 255, 0.5)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Avatar
                  size={36}
                  style={{ 
                    backgroundColor: 'transparent',
                    fontSize: '18px',
                    color: 'white'
                  }}
                >
                  {assistant.name.charAt(0).toUpperCase()}
                </Avatar>
              </div>
              <div className="flex flex-col text-white">
                <div className="flex items-center">
                  <Typography.Title level={5} style={{ color: 'white', margin: 0, marginRight: '8px' }}>
                    {assistant.name}
                  </Typography.Title>
                  <Tooltip title={isFavorite ? '取消收藏' : '收藏'}>
                    <Button 
                      type="text" 
                      shape="circle"
                      size="small"
                      icon={isFavorite ? <StarFilled style={{ color: '#fadb14' }} /> : <StarOutlined style={{ color: 'white' }} />} 
                      onClick={() => toggleFavorite(assistant.id)}
                      style={{ padding: 0, marginTop: '-4px' }}
                    />
                  </Tooltip>
                </div>
                <div className="flex items-center mt-1">
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    background: 'rgba(0, 0, 0, 0.25)',
                    backdropFilter: 'blur(4px)',
                    borderRadius: '20px',
                    padding: '4px 8px',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                  }}>
                    <Switch
                      size="small"
                      checked={assistant.status === 'online'}
                      onChange={onStatusChange}
                      style={{ 
                        marginRight: '8px',
                        backgroundColor: assistant.status === 'online' ? '#52c41a' : 'rgba(255, 255, 255, 0.35)'
                      }}
                    />
                    <Tag 
                      color={assistant.status === 'online' ? 'success' : 'default'}
                      style={{ 
                        margin: 0, 
                        fontSize: '12px', 
                        display: 'flex', 
                        alignItems: 'center',
                        padding: '0 8px',
                        height: '20px',
                        borderRadius: '14px',
                        backdropFilter: 'blur(8px)',
                        backgroundColor: assistant.status === 'online' 
                          ? 'rgba(82, 196, 26, 0.25)' 
                          : 'rgba(255, 255, 255, 0.25)',
                        color: 'white',
                        fontWeight: 'bold',
                        border: '1px solid ' + (assistant.status === 'online' 
                          ? 'rgba(82, 196, 26, 0.5)' 
                          : 'rgba(255, 255, 255, 0.3)')
                      }}
                    >
                      {assistant.status === 'online' ? (
                        <>
                          <CheckCircleFilled style={{ fontSize: '10px', marginRight: '4px', color: '#52c41a' }} /> 在线
                        </>
                      ) : (
                        <>
                          <CloseCircleFilled style={{ fontSize: '10px', marginRight: '4px', color: '#f5f5f5' }} /> 离线
                        </>
                      )}
                    </Tag>
                  </div>
                </div>
              </div>
            </div>
            
            <div style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', display: 'flex' }}>
              <Button
                size="middle"
                icon={<MessageOutlined />}
                style={{ 
                  background: 'rgba(255, 255, 255, 0.25)', 
                  backdropFilter: 'blur(8px)',
                  borderColor: 'rgba(255, 255, 255, 0.5)', 
                  color: 'white',
                  borderRadius: '12px',
                  fontSize: '12px',
                  marginRight: '8px',
                  height: '36px',
                  display: 'flex',
                  alignItems: 'center',
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                  transition: 'all 0.3s ease'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.35)';
                  e.currentTarget.style.boxShadow = '0 6px 8px rgba(0, 0, 0, 0.15)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.25)';
                  e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
                }}
              >
                开始对话
              </Button>
              <Button
                size="middle"
                icon={<CopyOutlined />}
                onClick={copyApiEndpoint}
                style={{ 
                  background: 'rgba(255, 255, 255, 0.25)', 
                  backdropFilter: 'blur(8px)',
                  borderColor: 'rgba(255, 255, 255, 0.5)', 
                  color: 'white',
                  borderRadius: '12px',
                  fontSize: '12px',
                  height: '36px',
                  display: 'flex',
                  alignItems: 'center',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                  transition: 'all 0.3s ease'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.35)';
                  e.currentTarget.style.boxShadow = '0 6px 8px rgba(0, 0, 0, 0.15)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.25)';
                  e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
                }}
              >
                复制API
              </Button>
            </div>
          </div>
        </div>
      }
      actions={[
        <Tooltip title="编辑">
          <EditOutlined key="edit" onClick={() => handleEdit(assistant)} />
        </Tooltip>,
        <Tooltip title="设置">
          <SettingOutlined key="setting" />
        </Tooltip>,
        <Tooltip title="删除">
          <DeleteOutlined key="delete" onClick={() => handleDelete(assistant.id)} />
        </Tooltip>,
      ]}
    >
      <div style={{ 
        padding: '12px',
        background: 'rgba(255, 255, 255, 0.7)',
        backdropFilter: 'blur(10px)',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05), 0 1px 3px rgba(0, 0, 0, 0.1)',
        margin: '4px'
      }}>
        <Typography.Paragraph 
          ellipsis={{ rows: 2 }}
          className="text-gray-600"
          style={{ margin: '0 0 8px 0', minHeight: '42px' }}
        >
          {assistant.description || '暂无描述'}
        </Typography.Paragraph>
        
        <Space wrap style={{ marginBottom: '8px' }}>
          {assistant.capabilities.map((cap) => (
            <Tag key={cap} color="blue" style={{ borderRadius: '12px' }}>{cap}</Tag>
          ))}
        </Space>
      </div>
      
      <div style={{ 
        background: 'rgba(250, 250, 250, 0.85)',
        backdropFilter: 'blur(10px)',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05), 0 1px 3px rgba(0, 0, 0, 0.1)',
        padding: '12px',
        margin: '4px'
      }}>
        <Row gutter={[8, 10]}>
          {/* 模型信息区块 */}
          <Col span={24}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-gray-700">
                <ApiOutlined className="mr-1" />
                模型信息
              </span>
              <span className="text-xs text-gray-500">
                {new Date(assistant.createTime).toLocaleDateString('zh-CN')}
              </span>
            </div>
            
            <Row gutter={[8, 8]}>
              <Col span={24}>
                <div style={{
                  background: 'rgba(255, 255, 255, 0.9)', 
                  borderRadius: '12px',
                  padding: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)'
                }}>
                  <Text className="text-xs font-medium">
                    <Tag color="blue" style={{ margin: 0, marginRight: '4px', borderRadius: '12px' }}>
                      <RobotOutlined className="mr-1" />推理
                    </Tag>
                  </Text>
                  <Text className="text-xs">
                    {assistant.models?.find(m => m.type === '推理模型')?.name || assistant.model || '未配置'}
                  </Text>
                </div>
              </Col>
              <Col span={24}>
                <div style={{
                  background: 'rgba(255, 255, 255, 0.9)', 
                  borderRadius: '12px',
                  padding: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)'
                }}>
                  <Text className="text-xs font-medium">
                    <Tag color="green" style={{ margin: 0, marginRight: '4px', borderRadius: '12px' }}>
                      <ApiOutlined className="mr-1" />向量
                    </Tag>
                  </Text>
                  <Text className="text-xs">
                    {assistant.models?.find(m => m.type === '向量模型')?.name || '未配置'}
                  </Text>
                </div>
              </Col>
              <Col span={24}>
                <div style={{
                  background: 'rgba(255, 255, 255, 0.9)', 
                  borderRadius: '12px',
                  padding: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)'
                }}>
                  <Text className="text-xs font-medium">
                    <Tag color="orange" style={{ margin: 0, marginRight: '4px', borderRadius: '12px' }}>
                      <CopyOutlined className="mr-1" />重排
                    </Tag>
                  </Text>
                  <Text className="text-xs">
                    {assistant.models?.find(m => m.type === '重排模型')?.name || '未配置'}
                  </Text>
                </div>
              </Col>
            </Row>
          </Col>

          {/* 使用情况统计区块 */}
          {assistant.usageStats && (
            <Col span={24}>
              <Divider style={{ margin: '8px 0' }} />
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-gray-700">
                  <ApiOutlined className="mr-1" />
                  使用统计
                </span>
              </div>
              
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-white p-2 rounded border border-gray-100 flex flex-col items-center justify-center" style={{ minHeight: '60px', borderRadius: '12px' }}>
                  <div className="text-xs text-gray-500 mb-1">对话次数</div>
                  <div className="text-sm font-semibold">
                    {assistant.usageStats.totalChats.toLocaleString()}
                  </div>
                </div>
                <div className="bg-white p-2 rounded border border-gray-100 flex flex-col items-center justify-center" style={{ minHeight: '60px', borderRadius: '12px' }}>
                  <div className="text-xs text-gray-500 mb-1">Token消耗</div>
                  <div className="text-sm font-semibold">
                    {assistant.usageStats.tokenUsage 
                      ? (assistant.usageStats.tokenUsage > 1000000 
                        ? `${(assistant.usageStats.tokenUsage / 1000000).toFixed(1)}M` 
                        : `${(assistant.usageStats.tokenUsage / 1000).toFixed(0)}K`)
                      : '0'}
                  </div>
                </div>
                <div className="bg-white p-2 rounded border border-gray-100 flex flex-col items-center justify-center" style={{ minHeight: '60px', borderRadius: '12px' }}>
                  <div className="text-xs text-gray-500 mb-1">API调用</div>
                  <div className="text-sm font-semibold">
                    {assistant.usageStats.apiCalls?.toLocaleString() || '0'}
                  </div>
                </div>
              </div>
            </Col>
          )}
          
          {/* 知识库区块 */}
          {assistant.knowledgeBases && assistant.knowledgeBases.length > 0 && (
            <Col span={24}>
              <Divider style={{ margin: '8px 0' }} />
              <div style={{ minHeight: '100px' }}>
                <div>
                  <div className="flex items-center mb-2">
                    <span className="text-xs font-medium text-gray-700">
                      <ApiOutlined className="mr-1" />
                      关联知识库
                    </span>
                  </div>
                  <div className="flex flex-wrap">
                    {assistant.knowledgeBases.map((kb) => (
                      <Tag 
                        key={kb.id} 
                        color="processing" 
                        className="mb-2 mr-2"
                        style={{ fontSize: '12px', borderRadius: '12px' }}
                      >
                        {kb.name} ({kb.documentCount})
                      </Tag>
                    ))}
                  </div>
                </div>
              </div>
            </Col>
          )}
          {(!assistant.knowledgeBases || assistant.knowledgeBases.length === 0) && (
            <Col span={24}>
              <Divider style={{ margin: '8px 0' }} />
              <div style={{ minHeight: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div className="text-gray-400 text-xs">
                  <ApiOutlined className="mr-1" />
                  未关联知识库
                </div>
              </div>
            </Col>
          )}
        </Row>
      </div>
    </Card>
  );
};

export default AssistantCard;
