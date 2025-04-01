import React from 'react';
import { Card, Avatar, Button, Typography, Tag, Space, Switch, message, Tooltip, Row, Col, Divider, Dropdown, Menu } from 'antd';
import { 
  RobotOutlined, MessageOutlined, EditOutlined, BarChartOutlined, 
  DeleteOutlined, StarOutlined, StarFilled, 
  InfoCircleOutlined, BookOutlined,
  ApiOutlined, NodeIndexOutlined, SortAscendingOutlined,
  CheckCircleFilled, CloseCircleFilled, MoreOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Text } = Typography;

// 助手类型定义
interface KnowledgeBase {
  id: string;
  name: string;
  documentCount: number;
}

interface Model {
  type: string;
  name: string;
}

interface UsageStats {
  totalChats: number;
  tokenUsage: number;
  apiCalls: number;
}

interface Assistant {
  id: string;
  name: string;
  avatar?: string;
  description?: string;
  status: 'online' | 'offline';
  model?: string;
  models?: Model[];
  capabilities: string[];
  createTime: string;
  knowledgeBases?: KnowledgeBase[];
  usageStats?: UsageStats;
}

interface AssistantCardProps {
  assistant: Assistant;
  isFavorite: boolean;
  toggleFavorite: (id: string) => void;
  handleEdit: (assistant: Assistant) => void;
  handleDelete: (id: string) => void;
  handleStatusChange: (id: string, status: 'online' | 'offline') => void;
}

const AssistantCard: React.FC<AssistantCardProps> = ({ 
  assistant, 
  isFavorite, 
  toggleFavorite, 
  handleEdit, 
  handleDelete,
  handleStatusChange
}) => {
  const navigate = useNavigate(); // 添加导航钩子
  
  const cardStyle = { 
    width: "100%",
    borderRadius: "16px",
    overflow: "hidden",
    height: '640px', 
    boxShadow: '0 6px 24px rgba(0, 0, 0, 0.1), 0 2px 8px rgba(0, 0, 0, 0.06), 0 0 1px rgba(0, 0, 0, 0.12)', 
    border: '1px solid rgba(220, 230, 240, 0.8)', 
    transition: 'all 0.3s ease', 
    display: 'flex',
    flexDirection: 'column' as const,
  };

  const getHeaderGradient = () => {
    // 更轻量化的现代渐变色组合
    const gradients = [
      'linear-gradient(120deg, rgba(236, 245, 255, 0.95), rgba(249, 252, 255, 0.95))',
      'linear-gradient(120deg, rgba(235, 249, 244, 0.95), rgba(248, 255, 252, 0.95))',
      'linear-gradient(120deg, rgba(236, 245, 255, 0.95), rgba(243, 246, 255, 0.95))',
      'linear-gradient(120deg, rgba(240, 245, 255, 0.95), rgba(248, 250, 255, 0.95))',
      'linear-gradient(120deg, rgba(235, 247, 250, 0.95), rgba(246, 253, 255, 0.95))',
    ];
    
    // 使用助手ID生成一个数字来选择固定的渐变
    const idSum = assistant.id.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
    return gradients[idSum % gradients.length];
  };

  const headerGradient = getHeaderGradient();

  // 添加Switch样式
  const switchStyle = {
    online: {
      backgroundColor: '#52c41a',
      boxShadow: '0 2px 4px rgba(82, 196, 26, 0.2)'
    },
    offline: {
      backgroundColor: '#bfbfbf',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
    }
  };

  const onStatusChange = (checked: boolean) => {
    handleStatusChange(assistant.id, checked ? 'online' : 'offline');
  };
  
  // 添加导航到聊天页面的处理函数
  const handleStartChat = () => {
    // 仅当助手在线时允许开始对话
    if (assistant.status === 'online') {
      navigate(`/chat/${assistant.id}`);
    } else {
      message.warning('助手当前处于离线状态，请先将其设置为在线');
    }
  };

  return (
    <Card
      style={{
        ...cardStyle,
        background: headerGradient, // 整个卡片使用同一个渐变背景
      }}
      title={
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          width: '100%' 
        }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Avatar 
              size={40} 
              icon={<RobotOutlined />} 
              src={assistant.avatar}
              style={{ 
                marginRight: '12px', 
                background: assistant.avatar ? 'transparent' : 'linear-gradient(135deg, #1890ff, #69c0ff)', 
                boxShadow: '0 2px 6px rgba(24, 144, 255, 0.2)' 
              }}
            />
            <div>
              <div style={{ 
                display: 'flex',
                alignItems: 'center',
                marginBottom: '2px'
              }}>
                <Tooltip title={assistant.name}>
                  <div style={{ 
                    fontWeight: 500, 
                    fontSize: '16px',
                    color: '#333',
                    marginRight: '8px',
                    textOverflow: 'ellipsis',
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                    maxWidth: '140px'
                  }}>
                    {assistant.name}
                  </div>
                </Tooltip>
                
                {/* 添加助手ID标签 */}
                <Tooltip title={`ID: ${assistant.id}`}>
                  <div style={{ 
                    fontSize: '11px', 
                    padding: '1px 6px', 
                    borderRadius: '4px', 
                    background: 'rgba(0, 0, 0, 0.04)',
                    color: '#666',
                    border: '1px solid rgba(0, 0, 0, 0.06)',
                    display: 'flex',
                    alignItems: 'center',
                    height: '20px',
                    fontFamily: 'monospace'
                  }}>
                    ID: {assistant.id.substring(0, 8)}...
                  </div>
                </Tooltip>
              </div>
              <div style={{ 
                fontSize: '12px', 
                color: '#8c8c8c',
                display: 'flex',
                alignItems: 'center'
              }}>
                <span style={{ 
                  color: assistant.status === 'online' ? '#52c41a' : '#d9d9d9',
                  marginRight: '4px',
                  fontSize: '10px'
                }}>
                  {assistant.status === 'online' ? <CheckCircleFilled /> : <CloseCircleFilled />}
                </span>
                {assistant.status === 'online' ? '在线' : '离线'}
              </div>
            </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {/* 收藏按钮 */}
            <Button 
              type="text" 
              icon={isFavorite ? <StarFilled style={{ color: '#faad14' }} /> : <StarOutlined />} 
              onClick={() => toggleFavorite(assistant.id)}
              style={{ marginRight: '4px' }}
            />
            
            {/* 状态开关 */}
            <Switch
              checkedChildren="在线"
              unCheckedChildren="离线"
              checked={assistant.status === 'online'}
              onChange={onStatusChange}
              size="small"
              style={assistant.status === 'online' ? switchStyle.online : switchStyle.offline}
            />
            
            {/* 更多操作菜单 */}
            <Dropdown 
              overlay={
                <Menu>
                  <Menu.Item key="edit" onClick={() => handleEdit(assistant)} icon={<EditOutlined />}>
                    编辑
                  </Menu.Item>
                  <Menu.Item key="api" onClick={() => {
                    // Copy API to clipboard
                    navigator.clipboard.writeText(`/api/v1/assistants/${assistant.id}`);
                    message.success('API地址已复制到剪贴板');
                  }} icon={<ApiOutlined />}>
                    复制API
                  </Menu.Item>
                  <Menu.Divider />
                  <Menu.Item 
                    key="delete" 
                    onClick={() => handleDelete(assistant.id)} 
                    icon={<DeleteOutlined />}
                    danger
                  >
                    删除
                  </Menu.Item>
                </Menu>
              }
              placement="bottomRight"
              trigger={['click']}
            >
              <Button type="text" icon={<MoreOutlined />} />
            </Dropdown>
          </div>
        </div>
      }
      headStyle={{
        padding: '12px 16px',
        background: headerGradient,
        borderBottom: '1px solid rgba(0, 0, 0, 0.03)',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.02)',
        borderTopLeftRadius: '16px',
        borderTopRightRadius: '16px'
      }}
      bodyStyle={{ 
        padding: '0', 
        flex: '1',
        display: 'flex',
        flexDirection: 'column' as const,
        background: 'transparent', // 移除背景使用卡片背景
        overflow: 'visible', 
        minHeight: '0', 
      }}
    >
      <div style={{ 
        padding: '14px',
        background: 'rgba(250, 251, 255, 0.35)', 
        backdropFilter: 'blur(20px)', 
        WebkitBackdropFilter: 'blur(20px)', 
        borderRadius: '16px',
        boxShadow: `
          0 10px 30px rgba(0, 0, 0, 0.08), 
          0 4px 12px rgba(31, 38, 135, 0.07), 
          inset 0 2px 0 rgba(255, 255, 255, 0.8),
          inset 0 0 8px rgba(255, 255, 255, 0.4)
        `, 
        margin: '12px',
        flex: 1,
        display: 'flex',
        flexDirection: 'column' as const,
        border: '1px solid rgba(255, 255, 255, 0.9)', 
        position: 'relative', 
        zIndex: 1,
        transform: 'translateZ(0)', 
        transition: 'all 0.3s ease'
      }}>
        <Typography.Paragraph 
          ellipsis={{ rows: 2 }}
          className="text-gray-600"
          style={{ margin: '0 0 8px 0', minHeight: '42px' }}
        >
          {assistant.description || '暂无描述'}
        </Typography.Paragraph>
        
        <Space wrap style={{ marginBottom: '8px' }}>
          {assistant.capabilities.map((cap: string) => (
            <Tag key={cap} color="blue" style={{ 
              borderRadius: '12px',
              background: 'rgba(24, 144, 255, 0.1)',
              border: '1px solid rgba(24, 144, 255, 0.2)',
              color: '#1890ff'
            }}>{cap}</Tag>
          ))}
        </Space>

        {/* 模型信息区块 - 简化和美化 */}
        <Row gutter={[8, 10]}>
          <Col span={24}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between', 
              marginBottom: '8px',
              marginTop: '12px'
            }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center',
                background: 'linear-gradient(135deg, rgba(16, 142, 233, 0.08), rgba(135, 208, 255, 0.08))',
                padding: '4px 8px',
                borderRadius: '8px'
              }}>
                <ApiOutlined style={{ color: '#1890ff', marginRight: '4px', fontSize: '12px' }}/>
                <Text style={{ 
                  background: 'linear-gradient(90deg, #1890ff, #69c0ff)', 
                  WebkitBackgroundClip: 'text', 
                  WebkitTextFillColor: 'transparent',
                  fontSize: '12px',
                  fontWeight: 500
                }}>
                  模型信息
                </Text>
              </div>
            </div>
            
            {/* 模型卡片区域 */}
            <div style={{ 
              display: 'flex', 
              flexDirection: 'row',
              gap: '8px',
              flexWrap: 'wrap'
            }}>
              {/* 推理模型卡片 */}
              <div style={{
                flex: '1 0 calc(33.333% - 8px)',
                minWidth: '100px',
                background: 'linear-gradient(145deg, #ffffff, #f0f7ff)',
                borderRadius: '10px',
                padding: '8px 10px',
                boxShadow: '0 1px 2px rgba(0, 0, 0, 0.03), 0 1px 6px rgba(24, 144, 255, 0.06)',
                border: '1px solid rgba(24, 144, 255, 0.1)'
              }}>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  marginBottom: '4px'
                }}>
                  <Tag color="blue" style={{ 
                    margin: 0, 
                    borderRadius: '4px',
                    fontSize: '10px',
                    padding: '0 4px',
                    height: '18px',
                    lineHeight: '18px',
                    background: 'rgba(24, 144, 255, 0.1)',
                    border: '1px solid rgba(24, 144, 255, 0.2)',
                    color: '#1890ff'
                  }}>
                    <RobotOutlined style={{ marginRight: '2px', fontSize: '10px' }} />推理
                  </Tag>
                </div>
                <Text style={{ 
                  fontSize: '11px',
                  color: '#333', 
                  fontWeight: '500',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: 'block'
                }}>
                  {assistant.models?.find(m => m.type === '推理模型')?.name || assistant.model || '未配置'}
                </Text>
              </div>

              {/* 向量模型卡片 */}
              <div style={{
                flex: '1 0 calc(33.333% - 8px)',
                minWidth: '100px',
                background: 'linear-gradient(145deg, #ffffff, #f0fff4)',
                borderRadius: '10px',
                padding: '8px 10px',
                boxShadow: '0 1px 2px rgba(0, 0, 0, 0.03), 0 1px 6px rgba(82, 196, 26, 0.06)',
                border: '1px solid rgba(82, 196, 26, 0.1)'
              }}>
                <div style={{
                  display: 'flex', 
                  alignItems: 'center',
                  marginBottom: '4px'
                }}>
                  <Tag color="green" style={{ 
                    margin: 0, 
                    borderRadius: '4px',
                    fontSize: '10px',
                    padding: '0 4px',
                    height: '18px',
                    lineHeight: '18px',
                    background: 'rgba(82, 196, 26, 0.1)',
                    border: '1px solid rgba(82, 196, 26, 0.2)',
                    color: '#52c41a'
                  }}>
                    <NodeIndexOutlined style={{ marginRight: '2px', fontSize: '10px' }} />向量
                  </Tag>
                </div>
                <Text style={{ 
                  fontSize: '11px',
                  color: '#333', 
                  fontWeight: '500',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: 'block'
                }}>
                  {assistant.models?.find(m => m.type === '向量模型')?.name || '未配置'}
                </Text>
              </div>

              {/* 重排模型卡片 */}
              <div style={{
                flex: '1 0 calc(33.333% - 8px)',
                minWidth: '100px',
                background: 'linear-gradient(145deg, #ffffff, #fffbe6)',
                borderRadius: '10px',
                padding: '8px 10px',
                boxShadow: '0 1px 2px rgba(0, 0, 0, 0.03), 0 1px 6px rgba(250, 173, 20, 0.06)',
                border: '1px solid rgba(250, 173, 20, 0.1)'
              }}>
                <div style={{
                  display: 'flex', 
                  alignItems: 'center',
                  marginBottom: '4px'
                }}>
                  <Tag color="orange" style={{ 
                    margin: 0, 
                    borderRadius: '4px',
                    fontSize: '10px',
                    padding: '0 4px',
                    height: '18px',
                    lineHeight: '18px',
                    background: 'rgba(250, 173, 20, 0.1)',
                    border: '1px solid rgba(250, 173, 20, 0.2)',
                    color: '#faad14'
                  }}>
                    <SortAscendingOutlined style={{ marginRight: '2px', fontSize: '10px' }} />重排
                  </Tag>
                </div>
                <Text style={{ 
                  fontSize: '11px',
                  color: '#333', 
                  fontWeight: '500',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: 'block'
                }}>
                  {assistant.models?.find(m => m.type === '重排模型')?.name || '未配置'}
                </Text>
              </div>
            </div>
          </Col>
        </Row>

        {/* 使用统计区块 */}
        {assistant.usageStats && (
          <>
            <Divider style={{ margin: '12px 0 8px', borderColor: 'rgba(0, 0, 0, 0.06)' }} />
            <Row>
              <Col span={24}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '8px'
                }}>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    background: 'linear-gradient(135deg, rgba(91, 143, 249, 0.08), rgba(146, 170, 255, 0.08))',
                    padding: '4px 8px',
                    borderRadius: '8px'
                  }}>
                    <BarChartOutlined style={{ color: '#5B8FF9', marginRight: '4px', fontSize: '12px' }}/>
                    <Text style={{ 
                      background: 'linear-gradient(90deg, #5B8FF9, #92AAFF)', 
                      WebkitBackgroundClip: 'text', 
                      WebkitTextFillColor: 'transparent',
                      fontSize: '12px',
                      fontWeight: 500
                    }}>
                      使用统计
                    </Text>
                  </div>
                </div>

                <div style={{ 
                  display: 'flex', 
                  flexWrap: 'wrap', 
                  gap: '8px' 
                }}>
                  <div style={{ 
                    flex: '1 0 calc(33.333% - 8px)',
                    minWidth: '90px', 
                    background: 'linear-gradient(145deg, #ffffff, #fafafa)',
                    borderRadius: '10px', 
                    padding: '8px 10px', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center', 
                    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.03)',
                    border: '1px solid rgba(0, 0, 0, 0.03)'
                  }}>
                    <div style={{ 
                      color: '#8c8c8c', 
                      fontSize: '10px', 
                      marginBottom: '2px',
                      display: 'flex',
                      alignItems: 'center'
                    }}>
                      <MessageOutlined style={{ marginRight: '2px', fontSize: '9px' }} />
                      对话次数
                    </div>
                    <div style={{ 
                      fontSize: '13px', 
                      fontWeight: '600',
                      background: 'linear-gradient(90deg, #1890ff, #69c0ff)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent'
                    }}>
                      {assistant.usageStats.totalChats.toLocaleString()}
                    </div>
                  </div>
                  <div style={{ 
                    flex: '1 0 calc(33.333% - 8px)',
                    minWidth: '90px', 
                    background: 'linear-gradient(145deg, #ffffff, #fafafa)',
                    borderRadius: '10px', 
                    padding: '8px 10px', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center', 
                    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.03)',
                    border: '1px solid rgba(0, 0, 0, 0.03)'
                  }}>
                    <div style={{ 
                      color: '#8c8c8c', 
                      fontSize: '10px', 
                      marginBottom: '2px',
                      display: 'flex',
                      alignItems: 'center'
                    }}>
                      <ApiOutlined style={{ marginRight: '2px', fontSize: '9px' }} />
                      Token消耗
                    </div>
                    <div style={{ 
                      fontSize: '13px', 
                      fontWeight: '600',
                      background: 'linear-gradient(90deg, #722ed1, #b37feb)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent'
                    }}>
                      {assistant.usageStats.tokenUsage 
                        ? (assistant.usageStats.tokenUsage > 1000000 
                          ? `${(assistant.usageStats.tokenUsage / 1000000).toFixed(1)}M` 
                          : `${(assistant.usageStats.tokenUsage / 1000).toFixed(0)}K`)
                        : '0'}
                    </div>
                  </div>
                  <div style={{ 
                    flex: '1 0 calc(33.333% - 8px)',
                    minWidth: '90px', 
                    background: 'linear-gradient(145deg, #ffffff, #fafafa)',
                    borderRadius: '10px', 
                    padding: '8px 10px', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center', 
                    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.03)',
                    border: '1px solid rgba(0, 0, 0, 0.03)'
                  }}>
                    <div style={{ 
                      color: '#8c8c8c', 
                      fontSize: '10px', 
                      marginBottom: '2px',
                      display: 'flex',
                      alignItems: 'center'
                    }}>
                      <BookOutlined style={{ marginRight: '2px', fontSize: '9px' }} />
                      API调用
                    </div>
                    <div style={{ 
                      fontSize: '13px', 
                      fontWeight: '600',
                      background: 'linear-gradient(90deg, #13c2c2, #5cdbd3)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent'
                    }}>
                      {assistant.usageStats.apiCalls?.toLocaleString() || '0'}
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          </>
        )}

        {/* 知识库信息区块 */}
        <Divider style={{ margin: '12px 0 8px', borderColor: 'rgba(0, 0, 0, 0.06)' }} />
        <Row>
          <Col span={24}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '8px'
            }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center',
                background: 'linear-gradient(135deg, rgba(45, 183, 245, 0.08), rgba(131, 232, 255, 0.08))',
                padding: '4px 8px',
                borderRadius: '8px'
              }}>
                <BookOutlined style={{ color: '#2db7f5', marginRight: '4px', fontSize: '12px' }}/>
                <Text style={{ 
                  background: 'linear-gradient(90deg, #2db7f5, #83e8ff)', 
                  WebkitBackgroundClip: 'text', 
                  WebkitTextFillColor: 'transparent',
                  fontSize: '12px',
                  fontWeight: 500
                }}>
                  知识库
                </Text>
              </div>
            </div>

            {assistant.knowledgeBases && assistant.knowledgeBases.length > 0 ? (
              <div style={{ 
                background: 'linear-gradient(145deg, #ffffff, #f9fdff)',
                borderRadius: '10px',
                padding: '12px 14px',
                boxShadow: '0 1px 2px rgba(0, 0, 0, 0.03), 0 1px 6px rgba(24, 144, 255, 0.04)',
                border: '1px solid rgba(24, 144, 255, 0.1)',
                minHeight: '80px'
              }}>
                <div style={{ 
                  display: 'flex', 
                  flexWrap: 'wrap', 
                  gap: '8px' 
                }}>
                  {assistant.knowledgeBases.map(kb => (
                    <Tag 
                      key={kb.id} 
                      style={{ 
                        margin: 0,
                        borderRadius: '12px',
                        background: 'linear-gradient(135deg, rgba(24, 144, 255, 0.06), rgba(104, 180, 255, 0.06))',
                        border: '1px solid rgba(24, 144, 255, 0.2)',
                        color: '#1890ff',
                        padding: '4px 8px',
                        fontSize: '11px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      <Tooltip title="知识库文档数量">
                        <div style={{ 
                          background: 'rgba(24, 144, 255, 0.1)', 
                          borderRadius: '8px', 
                          padding: '0 4px', 
                          fontSize: '10px',
                          lineHeight: '16px',
                          height: '16px',
                          display: 'inline-flex',
                          alignItems: 'center'
                        }}>
                          {kb.documentCount}
                        </div>
                      </Tooltip>
                      <span>{kb.name}</span>
                    </Tag>
                  ))}
                </div>
              </div>
            ) : (
              <div style={{ 
                background: 'linear-gradient(145deg, #ffffff, #f9fdff)',
                borderRadius: '10px',
                padding: '12px',
                boxShadow: '0 1px 2px rgba(0, 0, 0, 0.03)',
                border: '1px solid rgba(0, 0, 0, 0.03)',
                minHeight: '80px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <div style={{ 
                  color: '#bfbfbf', 
                  fontSize: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  <InfoCircleOutlined />
                  暂未关联知识库
                </div>
              </div>
            )}
          </Col>
        </Row>
      </div>
      
      {/* 底部操作区域 - 移到卡片底部中央位置 */}
      <div style={{ 
        padding: '12px 16px 16px', 
        background: 'transparent', // 移除背景使用卡片背景
        borderTop: '1px solid rgba(255, 255, 255, 0.2)', // 更明显的分隔线
        borderBottomLeftRadius: '16px',
        borderBottomRightRadius: '16px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexShrink: 0, 
      }}>
        <Button
          size="middle"
          icon={<MessageOutlined />}
          onClick={handleStartChat} 
          disabled={assistant.status !== 'online'} 
          style={{ 
            background: assistant.status === 'online' 
              ? 'linear-gradient(135deg, #096dd9, #1890ff)' 
              : 'linear-gradient(135deg, #d9d9d9, #f0f0f0)', 
            borderColor: 'transparent', 
            color: assistant.status === 'online' ? 'white' : 'rgba(0, 0, 0, 0.25)',
            borderRadius: '8px',
            fontSize: '14px',
            padding: '0 20px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: assistant.status === 'online' 
              ? '0 2px 10px rgba(24, 144, 255, 0.3)' 
              : '0 2px 10px rgba(0, 0, 0, 0.1)',
            transition: 'all 0.3s ease',
            width: 'calc(100% - 16px)', 
            maxWidth: '500px', 
            margin: '0 auto', 
          }}
          onMouseOver={(e) => {
            if (assistant.status === 'online') {
              e.currentTarget.style.background = 'linear-gradient(135deg, #1890ff, #40a9ff)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(24, 144, 255, 0.4)';
            }
          }}
          onMouseOut={(e) => {
            if (assistant.status === 'online') {
              e.currentTarget.style.background = 'linear-gradient(135deg, #096dd9, #1890ff)';
              e.currentTarget.style.boxShadow = '0 2px 10px rgba(24, 144, 255, 0.3)';
            }
          }}
        >
          开始对话
        </Button>
      </div>
    </Card>
  );
};

export default AssistantCard;
