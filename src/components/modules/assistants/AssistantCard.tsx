import React, { useState } from 'react';
import { Card, Avatar, Button, Typography, Tag, Space, Switch, message, Tooltip, Row, Col, Divider, Dropdown } from 'antd';
import { 
  RobotOutlined, MessageOutlined, BarChartOutlined, 
  DeleteOutlined, 
  InfoCircleOutlined, BookOutlined,
  ApiOutlined, NodeIndexOutlined, SortAscendingOutlined,
  CheckCircleFilled, CloseCircleFilled, MoreOutlined, SettingOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { Assistant } from './types';
import AssistantSettingsModal from './AssistantSettingsModal';
import AssistantStatsModal from './AssistantStatsModal';

const { Text } = Typography;

// Modify the Assistant interface to replace usageStats with our local version
export type ModifiedAssistant = Omit<Assistant, 'usageStats'> & {
  usageStats?: {
    totalChats: number;
    tokenUsage: number;
    apiCalls: number;
    satisfactionRate: number; // Added to match the imported type
  };
};

interface AssistantCardProps {
  assistant: ModifiedAssistant;
  handleEdit: (assistant: ModifiedAssistant) => void;
  handleDelete: (id: string) => void;
  handleStatusChange: (id: string, status: 'online' | 'offline') => void;
}

const AssistantCard: React.FC<AssistantCardProps> = ({ 
  assistant, 
  handleEdit, 
  handleDelete,
  handleStatusChange
}) => {
  const navigate = useNavigate(); 
  const [settingsVisible, setSettingsVisible] = useState(false);
  const [statsVisible, setStatsVisible] = useState(false);
  
  const cardStyle = { 
    width: "100%",
    borderRadius: "16px",
    overflow: "hidden",
    height: '520px',
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

  // 状态切换处理函数
  const onStatusChange = (checked: boolean) => {
    handleStatusChange(assistant.id, checked ? 'online' : 'offline');
  };
  
  // 配置保存处理函数
  const handleSettingsSave = (updatedAssistant: ModifiedAssistant) => {
    // 这里可以调用API保存更新的助手配置
    // 然后关闭模态框
    message.success('助手配置已更新');
    setSettingsVisible(false);
    
    // 如果有更新整个助手的回调，可以在这里调用
    if (handleEdit) {
      handleEdit(updatedAssistant);
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
                
                {/* IDu6807u7b7eu5df2u79fbu9664 */}
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
                <Tooltip title={`ID: ${assistant.id}`}>
                  <div>
                    ID: {assistant.id.substring(0, 8)}...
                  </div>
                </Tooltip>
              </div>
            </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {/* 状态开关 */}
            <Switch
              checkedChildren="在线"
              unCheckedChildren="离线"
              checked={assistant.status === 'online'}
              onChange={(checked) => onStatusChange(checked)}
              size="default"
              style={{
                ...((assistant.status === 'online') ? switchStyle.online : switchStyle.offline),
                transform: 'scale(1.2)',
                marginRight: '12px'
              }}
            />
            
            {/* 更多操作菜单 */}
            <Dropdown 
              menu={{
                onClick: (e) => e.domEvent.stopPropagation(),
                items: [
                  {
                    key: 'stats',
                    icon: <BarChartOutlined />,
                    label: '统计',
                    onClick: () => setStatsVisible(true)
                  },
                  {
                    key: 'api',
                    icon: <ApiOutlined />,
                    label: 'API',
                    onClick: () => {
                      navigator.clipboard.writeText(`/api/v1/assistants/${assistant.id}`);
                      message.success('API地址已复制到剪贴板');
                    }
                  },
                  {
                    type: 'divider'
                  },
                  {
                    key: 'delete',
                    icon: <DeleteOutlined />,
                    label: '删除',
                    danger: true,
                    onClick: () => handleDelete(assistant.id)
                  }
                ]
              }}
              trigger={['click']}
            >
              <Button 
                type="text" 
                icon={<MoreOutlined />} 
                style={{ border: '1px solid #d9d9d9', borderRadius: '50%' }} 
                onClick={(e) => e.stopPropagation()} // 阻止Button点击事件被深
              />
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
        // background: 'transparent', // u79fbu9664u80ccu666f\u7528u5361u7247u80ccu666f
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
          {assistant.description}
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

        {/* 模型信息 */}
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
            
            {/* 模型卡片 */}
            <div style={{ 
              display: 'flex', 
              flexDirection: 'row',
              gap: '8px',
              flexWrap: 'wrap'
            }}>
              {/* 推理模型 */}
              <div style={{
                flex: '1 0 calc(33.333% - 8px)',
                minWidth: '100px',
                padding: '8px 10px',
                background: 'white',
                borderRadius: '8px',
                border: '1px solid #f0f0f0',
                display: 'flex',
                flexDirection: 'column',
                gap: '3px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Tag 
                    style={{
                      marginRight: 0,
                      borderRadius: '4px',
                      fontSize: '10px',
                      padding: '0 4px',
                      background: 'rgba(24, 144, 255, 0.1)',
                      border: '1px solid rgba(24, 144, 255, 0.2)',
                      color: '#1890ff'
                    }}>
                    <RobotOutlined style={{ marginRight: '2px', fontSize: '10px' }} />推理
                  </Tag>
                </div>
                <Text style={{ 
                  fontSize: '12px',
                  color: '#666',
                  overflow: 'hidden',
                  whiteSpace: 'nowrap',
                  textOverflow: 'ellipsis',
                  display: 'block'
                }}>
                  {assistant.models?.find(m => m.type === '推理模型')?.name || assistant.model || '未配置'}
                </Text>
              </div>

              {/* 向量模型 */}
              <div style={{
                flex: '1 0 calc(33.333% - 8px)',
                minWidth: '100px',
                padding: '8px 10px',
                background: 'white',
                borderRadius: '8px',
                border: '1px solid #f0f0f0',
                display: 'flex',
                flexDirection: 'column',
                gap: '3px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Tag 
                    style={{
                      marginRight: 0,
                      borderRadius: '4px',
                      fontSize: '10px',
                      padding: '0 4px',
                      background: 'rgba(82, 196, 26, 0.1)',
                      border: '1px solid rgba(82, 196, 26, 0.2)',
                      color: '#52c41a'
                    }}>
                    <NodeIndexOutlined style={{ marginRight: '2px', fontSize: '10px' }} />向量
                  </Tag>
                </div>
                <Text style={{ 
                  fontSize: '12px',
                  color: '#666',
                  overflow: 'hidden',
                  whiteSpace: 'nowrap',
                  textOverflow: 'ellipsis',
                  display: 'block'
                }}>
                  {assistant.models?.find(m => m.type === '向量模型')?.name || '未配置'}
                </Text>
              </div>

              {/* 重排模型 */}
              <div style={{
                flex: '1 0 calc(33.333% - 8px)',
                minWidth: '100px',
                padding: '8px 10px',
                background: 'white',
                borderRadius: '8px',
                border: '1px solid #f0f0f0',
                display: 'flex',
                flexDirection: 'column',
                gap: '3px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Tag 
                    style={{
                      marginRight: 0,
                      borderRadius: '4px',
                      fontSize: '10px',
                      padding: '0 4px',
                      background: 'rgba(250, 173, 20, 0.1)',
                      border: '1px solid rgba(250, 173, 20, 0.2)',
                      color: '#faad14'
                    }}>
                    <SortAscendingOutlined style={{ marginRight: '2px', fontSize: '10px' }} />重排
                  </Tag>
                </div>
                <Text style={{ 
                  fontSize: '12px',
                  color: '#666',
                  overflow: 'hidden',
                  whiteSpace: 'nowrap',
                  textOverflow: 'ellipsis',
                  display: 'block'
                }}>
                  {assistant.models?.find(m => m.type === '重排模型')?.name || '未配置'}
                </Text>
              </div>
            </div>
          </Col>
        </Row>

        {/* 知识库信息 */}
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
                  当前未关联知识库
                </div>
              </div>
            )}
          </Col>
        </Row>
      </div>
      
      {/* 已部署模型信息 */}
      <div style={{ 
        borderTop: '1px solid #f0f0f0',
        padding: '12px',
        display: 'flex',
        justifyContent: 'space-between',
        background: 'linear-gradient(to bottom, rgba(240, 245, 255, 0.5), rgba(245, 250, 255, 0.8))',
        borderRadius: '0 0 8px 8px'
      }}>
        {/* 配置按钮，现在同时处理编辑和配置功能 */}
        <Button 
          icon={<SettingOutlined />} 
          onClick={(e) => {
            e.stopPropagation();
            setSettingsVisible(true);
          }}
          style={{
            background: 'linear-gradient(135deg, #1677ff, #40a9ff)',
            borderColor: 'transparent',
            color: 'white',
            boxShadow: '0 2px 6px rgba(24, 144, 255, 0.2)',
            width: 'calc(50% - 6px)',
            height: '40px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: '6px',
            fontWeight: 500
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'linear-gradient(135deg, #0958d9, #1677ff)';
            e.currentTarget.style.boxShadow = '0 2px 8px rgba(24, 144, 255, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'linear-gradient(135deg, #1677ff, #40a9ff)';
            e.currentTarget.style.boxShadow = '0 2px 6px rgba(24, 144, 255, 0.2)';
          }}
        >
          配置
        </Button>
        
        {/* 开始对话按钮 */}
        <Button 
          icon={<MessageOutlined />}
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/chat/${assistant.id}`);
          }}
          disabled={assistant.status === 'offline'}
          style={{
            background: assistant.status === 'online' 
              ? 'linear-gradient(135deg, #13c2c2, #36cfc9)'
              : 'linear-gradient(135deg, #d9d9d9, #bfbfbf)',
            borderColor: 'transparent',
            color: 'white',
            boxShadow: assistant.status === 'online'
              ? '0 2px 6px rgba(19, 194, 194, 0.2)'
              : '0 2px 6px rgba(0, 0, 0, 0.1)',
            width: 'calc(50% - 6px)',
            height: '40px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: '6px',
            fontWeight: 500,
            cursor: assistant.status === 'online' ? 'pointer' : 'not-allowed',
            opacity: assistant.status === 'online' ? 1 : 0.7
          }}
          onMouseEnter={(e) => {
            if (assistant.status === 'online') {
              e.currentTarget.style.background = 'linear-gradient(135deg, #108ee9, #2bb7f6)';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(19, 194, 194, 0.3)';
            }
          }}
          onMouseLeave={(e) => {
            if (assistant.status === 'online') {
              e.currentTarget.style.background = 'linear-gradient(135deg, #13c2c2, #36cfc9)';
              e.currentTarget.style.boxShadow = '0 2px 6px rgba(19, 194, 194, 0.2)';
            }
          }}
        >
          {assistant.status === 'online' ? '开始对话' : '助手已下线'}
        </Button>
      </div>
      
      {/* 设置模态框 */}
      <AssistantSettingsModal
        visible={settingsVisible}
        assistant={assistant}
        onClose={() => setSettingsVisible(false)}
        onSave={handleSettingsSave}
      />

      {/* 统计信息模态框 */}
      <AssistantStatsModal
        visible={statsVisible}
        assistant={assistant}
        onClose={() => setStatsVisible(false)}
      />
    </Card>
  );
};

export default AssistantCard;
