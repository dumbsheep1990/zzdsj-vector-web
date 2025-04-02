import React, { useState, useEffect } from 'react';
import { 
  Modal, Form, Input, Select, Switch, Button, 
  Tabs, Row, Col, Card, Typography,
  Tag, List, Tooltip, Slider
} from 'antd';
import { 
  RobotOutlined, BookOutlined, NodeIndexOutlined, 
  SortAscendingOutlined, SendOutlined, SettingOutlined,
  LinkOutlined, SearchOutlined, InfoCircleOutlined,
  MessageOutlined
} from '@ant-design/icons';
import { ModifiedAssistant } from './AssistantCard';

const { Text, Title, Paragraph } = Typography;
const { TabPane } = Tabs;

interface ExtendedAssistant extends ModifiedAssistant {
  models?: Array<{
    type: '推理模型' | '向量模型' | '重排模型';
    name: string;
  }>;
  retrievalSettings?: {
    topK: number;
    threshold: number;
    useReranking: boolean;
  };
  routingSettings?: {
    enabled: boolean;
    path: string;
  };
  knowledgeBases?: Array<{
    id: string;
    name: string;
    documentCount: number;
  }>;
}

interface AssistantSettingsModalProps {
  visible: boolean;
  assistant: ExtendedAssistant;
  onClose: () => void;
  onSave: (assistant: ExtendedAssistant) => void;
}

const AssistantSettingsModal: React.FC<AssistantSettingsModalProps> = ({
  visible,
  assistant,
  onClose,
  onSave,
}) => {
  const [form] = Form.useForm();
  const [selectedKnowledgeBases, setSelectedKnowledgeBases] = useState<string[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<{role: string, content: string}[]>([]);
  const [activeTab, setActiveTab] = useState('basic');
  
  const knowledgeBases = [
    { id: 'kb1', name: '产品知识库', documentCount: 120 },
    { id: 'kb2', name: '用户手册', documentCount: 85 },
    { id: 'kb3', name: '技术文档', documentCount: 230 },
    { id: 'kb4', name: '常见问题', documentCount: 65 },
    { id: 'kb5', name: '培训资料', documentCount: 42 }
  ];

  const modelOptions = {
    inference: ['gpt-4-turbo', 'gpt-3.5-turbo', 'llama-3-70b', 'claude-3-opus', 'qwen-max'],
    embedding: ['text-embedding-3-large', 'text-embedding-3-small', 'bge-large-zh', 'bge-base-zh'],
    reranking: ['bge-reranker-v2', 'cohere-reranker', 'null']
  };

  useEffect(() => {
    if (visible && assistant) {
      form.setFieldsValue({
        name: assistant.name || '',
        description: assistant.description || '',
        capabilities: assistant.capabilities || [],
        inferenceModel: assistant.models?.find(m => m.type === '推理模型')?.name || assistant.model || '',
        embeddingModel: assistant.models?.find(m => m.type === '向量模型')?.name || '',
        rerankingModel: assistant.models?.find(m => m.type === '重排模型')?.name || '',
        topK: assistant.retrievalSettings?.topK || 5,
        threshold: assistant.retrievalSettings?.threshold || 0.75,
        useReranking: assistant.retrievalSettings?.useReranking || false,
        routingEnabled: assistant.routingSettings?.enabled || false,
        routingPath: assistant.routingSettings?.path || '',
      });
      
      setSelectedKnowledgeBases(
        assistant.knowledgeBases?.map(kb => kb.id) || []
      );
    }
  }, [visible, assistant, form]);
  
  const handleKnowledgeBaseToggle = (kbId: string) => {
    setSelectedKnowledgeBases(prev => {
      if (prev.includes(kbId)) {
        return prev.filter(id => id !== kbId);
      } else {
        return [...prev, kbId];
      }
    });
  };
  
  const handleSend = () => {
    if (!chatInput.trim()) return;
    
    setChatMessages(prev => [...prev, { role: 'user', content: chatInput }]);
    
    setTimeout(() => {
      setChatMessages(prev => [
        ...prev, 
        { 
          role: 'assistant', 
          content: `这是模拟的助手回复，实际部署时将使用配置的推理模型: ${
            form.getFieldValue('inferenceModel')
          }。当前已挂载 ${selectedKnowledgeBases.length} 个知识库。` 
        }
      ]);
    }, 1000);
    
    setChatInput('');
  };
  
  const handleSubmit = () => {
    form.validateFields().then(values => {
      const updatedAssistant: ExtendedAssistant = {
        ...assistant,
        name: values.name,
        description: values.description,
        capabilities: values.capabilities,
        models: [
          { type: '推理模型', name: values.inferenceModel },
          { type: '向量模型', name: values.embeddingModel },
          { type: '重排模型', name: values.rerankingModel }
        ],
        retrievalSettings: {
          topK: values.topK,
          threshold: values.threshold,
          useReranking: values.useReranking
        },
        routingSettings: {
          enabled: values.routingEnabled,
          path: values.routingPath
        },
        knowledgeBases: knowledgeBases.filter(kb => selectedKnowledgeBases.includes(kb.id))
      };
      
      onSave(updatedAssistant);
    });
  };
  
  return (
    <Modal
      title={
        <div style={{ 
          fontSize: '18px', 
          fontWeight: 'bold',
          background: 'linear-gradient(135deg, #1890ff, #40a9ff)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          配置助手 - {assistant?.name}
        </div>
      }
      open={visible}
      onCancel={onClose}
      width={1400}
      footer={null}
      destroyOnClose
      style={{ top: 20 }}
      styles={{
        body: { 
          padding: '0', 
          maxHeight: 'calc(100vh - 150px)',
          overflow: 'hidden'
        }
      }}
    >
      <Row style={{ height: '100%' }}>
        {/* 左侧配置面板 */}
        <Col span={14} style={{ padding: '16px', overflowY: 'auto', maxHeight: 'calc(100vh - 180px)' }}>
          <Form 
            form={form}
            layout="vertical"
            style={{ 
              background: 'linear-gradient(to right, rgba(240,247,255,0.7), rgba(245,250,255,0.7))',
              padding: '12px',
              borderRadius: '8px',
              marginBottom: '16px'
            }}
          >
            <Tabs 
              activeKey={activeTab} 
              onChange={setActiveTab}
              style={{ marginBottom: '16px' }}
              tabBarStyle={{ 
                background: 'linear-gradient(to right, rgba(240,247,255,0.8), rgba(245,250,255,0.8))',
                padding: '4px',
                borderRadius: '8px'
              }}
            >
              <TabPane 
                tab={
                  <span>
                    <RobotOutlined /> 基本信息
                  </span>
                } 
                key="basic"
              >
                <Card 
                  title={
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <RobotOutlined style={{ marginRight: '8px', color: '#1890ff' }} />
                      助手基本信息
                    </div>
                  } 
                  style={{ marginBottom: '16px' }}
                  headStyle={{ 
                    background: 'linear-gradient(135deg, rgba(24, 144, 255, 0.08), rgba(24, 144, 255, 0.04))',
                    borderBottom: '1px solid rgba(24, 144, 255, 0.1)'
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
                    label="助手描述"
                    rules={[{ required: true, message: '请输入助手描述' }]}
                  >
                    <Input.TextArea 
                      placeholder="请输入助手的详细描述和功能介绍" 
                      rows={4}
                      style={{ resize: 'none' }}
                    />
                  </Form.Item>
                  
                  <Form.Item
                    name="capabilities"
                    label="助手能力"
                    tooltip="可添加多个能力标签，用逗号分隔"
                  >
                    <Select 
                      mode="tags" 
                      placeholder="请输入助手具备的能力，如：数据分析、文本摘要"
                      tokenSeparators={[',']}
                    />
                  </Form.Item>
                </Card>
              </TabPane>
              
              <TabPane 
                tab={
                  <span>
                    <RobotOutlined /> 模型设置
                  </span>
                } 
                key="model"
              >
                <Card 
                  title={
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <Tag style={{
                        marginRight: '8px',
                        background: 'rgba(24, 144, 255, 0.1)',
                        border: '1px solid rgba(24, 144, 255, 0.2)',
                        color: '#1890ff'
                      }}>
                        <RobotOutlined style={{ marginRight: '4px' }} />推理
                      </Tag>
                      推理模型设置
                    </div>
                  } 
                  style={{ marginBottom: '16px' }}
                  headStyle={{ 
                    background: 'linear-gradient(135deg, rgba(236, 245, 255, 0.95), rgba(249, 252, 255, 0.95))',
                    borderBottom: '1px solid rgba(24, 144, 255, 0.1)'
                  }}
                >
                  <Form.Item name="inferenceModel" label="选择推理模型">
                    <Select placeholder="请选择推理大模型">
                      {modelOptions.inference.map(model => (
                        <Select.Option key={model} value={model}>{model}</Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                  <Paragraph type="secondary" style={{ fontSize: '12px', marginTop: '-12px' }}>
                    <InfoCircleOutlined style={{ marginRight: '4px' }} />
                    推理模型负责理解用户问题并生成回复，选择性能更强的模型可提升回答质量
                  </Paragraph>
                </Card>
                
                <Card 
                  title={
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <Tag style={{
                        marginRight: '8px',
                        background: 'rgba(82, 196, 26, 0.1)',
                        border: '1px solid rgba(82, 196, 26, 0.2)',
                        color: '#52c41a'
                      }}>
                        <NodeIndexOutlined style={{ marginRight: '4px' }} />向量
                      </Tag>
                      向量模型设置
                    </div>
                  } 
                  style={{ marginBottom: '16px' }}
                  headStyle={{ 
                    background: 'linear-gradient(135deg, rgba(235, 249, 244, 0.95), rgba(248, 255, 252, 0.95))',
                    borderBottom: '1px solid rgba(82, 196, 26, 0.1)'
                  }}
                >
                  <Form.Item name="embeddingModel" label="选择向量模型">
                    <Select placeholder="请选择向量嵌入模型">
                      {modelOptions.embedding.map(model => (
                        <Select.Option key={model} value={model}>{model}</Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                  <Paragraph type="secondary" style={{ fontSize: '12px', marginTop: '-12px' }}>
                    <InfoCircleOutlined style={{ marginRight: '4px' }} />
                    向量模型用于将文本转换为向量表示，影响知识库检索的匹配精度
                  </Paragraph>
                </Card>
                
                <Card 
                  title={
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <Tag style={{
                        marginRight: '8px',
                        background: 'rgba(250, 173, 20, 0.1)',
                        border: '1px solid rgba(250, 173, 20, 0.2)',
                        color: '#faad14'
                      }}>
                        <SortAscendingOutlined style={{ marginRight: '4px' }} />重排
                      </Tag>
                      重排模型设置
                    </div>
                  } 
                  style={{ marginBottom: '16px' }}
                  headStyle={{ 
                    background: 'linear-gradient(135deg, rgba(255, 250, 235, 0.95), rgba(255, 252, 245, 0.95))',
                    borderBottom: '1px solid rgba(250, 173, 20, 0.1)'
                  }}
                >
                  <Form.Item name="rerankingModel" label="选择重排模型">
                    <Select placeholder="请选择重排模型(可选)">
                      {modelOptions.reranking.map(model => (
                        <Select.Option key={model} value={model}>{model}</Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                  <Paragraph type="secondary" style={{ fontSize: '12px', marginTop: '-12px' }}>
                    <InfoCircleOutlined style={{ marginRight: '4px' }} />
                    重排模型对向量检索结果进行精细排序，提高相关性，选择"null"表示不使用重排
                  </Paragraph>
                </Card>
              </TabPane>
              
              <TabPane 
                tab={
                  <span>
                    <BookOutlined /> 知识库设置
                  </span>
                } 
                key="knowledge"
              >
                <Card 
                  title={
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <BookOutlined style={{ marginRight: '8px', color: '#2db7f5' }} />
                      知识库挂载
                    </div>
                  } 
                  style={{ marginBottom: '16px' }}
                  headStyle={{ 
                    background: 'linear-gradient(135deg, rgba(45, 183, 245, 0.08), rgba(131, 232, 255, 0.08))',
                    borderBottom: '1px solid rgba(45, 183, 245, 0.1)'
                  }}
                >
                  <List
                    dataSource={knowledgeBases}
                    renderItem={kb => (
                      <List.Item>
                        <div style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          width: '100%',
                          alignItems: 'center'
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center' }}>
                            <Tag style={{
                              marginRight: '8px',
                              background: 'linear-gradient(135deg, rgba(24, 144, 255, 0.06), rgba(104, 180, 255, 0.06))',
                              border: '1px solid rgba(24, 144, 255, 0.2)',
                              color: '#1890ff',
                              padding: '4px 8px',
                              borderRadius: '12px'
                            }}>
                              {kb.documentCount}
                            </Tag>
                            <Text>{kb.name}</Text>
                          </div>
                          <Switch 
                            checked={selectedKnowledgeBases.includes(kb.id)}
                            onChange={() => handleKnowledgeBaseToggle(kb.id)}
                            style={{
                              backgroundColor: selectedKnowledgeBases.includes(kb.id) ? '#2db7f5' : undefined,
                              boxShadow: selectedKnowledgeBases.includes(kb.id) ? '0 2px 4px rgba(45, 183, 245, 0.2)' : undefined
                            }}
                          />
                        </div>
                      </List.Item>
                    )}
                  />
                </Card>
                
                <Card 
                  title={
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <SearchOutlined style={{ marginRight: '8px', color: '#1890ff' }} />
                      知识库检索优化
                    </div>
                  } 
                  style={{ marginBottom: '16px' }}
                  headStyle={{ 
                    background: 'linear-gradient(135deg, rgba(24, 144, 255, 0.08), rgba(24, 144, 255, 0.04))',
                    borderBottom: '1px solid rgba(24, 144, 255, 0.1)'
                  }}
                >
                  <Form.Item name="topK" label="检索数量 (Top-K)">
                    <Slider 
                      min={1} 
                      max={20} 
                      marks={{ 1: '1', 5: '5', 10: '10', 15: '15', 20: '20' }}
                    />
                  </Form.Item>
                  <Paragraph type="secondary" style={{ fontSize: '12px', marginTop: '-12px', marginBottom: '16px' }}>
                    <InfoCircleOutlined style={{ marginRight: '4px' }} />
                    每次检索时返回的最相似文档数量，数值越大召回越全面但可能引入噪音
                  </Paragraph>
                  
                  <Form.Item name="threshold" label="相似度阈值">
                    <Slider
                      min={0.5}
                      max={0.95}
                      step={0.05}
                      marks={{ 0.5: '0.5', 0.7: '0.7', 0.8: '0.8', 0.95: '0.95' }}
                    />
                  </Form.Item>
                  <Paragraph type="secondary" style={{ fontSize: '12px', marginTop: '-12px', marginBottom: '16px' }}>
                    <InfoCircleOutlined style={{ marginRight: '4px' }} />
                    文档相似度低于该阈值将被过滤，阈值越高精度越高但可能漏掉相关内容
                  </Paragraph>
                  
                  <Form.Item 
                    name="useReranking" 
                    valuePropName="checked"
                    label={
                      <span>
                        使用重排优化 
                        <Tooltip title="启用后将使用重排模型对检索结果进行精细排序，提高相关性">
                          <InfoCircleOutlined style={{ marginLeft: '4px' }} />
                        </Tooltip>
                      </span>
                    }
                  >
                    <Switch />
                  </Form.Item>
                </Card>
              </TabPane>

              <TabPane 
                tab={
                  <span>
                    <LinkOutlined /> 问答路由
                  </span>
                } 
                key="routing"
              >
                <Card 
                  title={
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <LinkOutlined style={{ marginRight: '8px', color: '#722ed1' }} />
                      问答路由绑定
                    </div>
                  } 
                  style={{ marginBottom: '16px' }}
                  headStyle={{ 
                    background: 'linear-gradient(135deg, rgba(114, 46, 209, 0.08), rgba(143, 87, 219, 0.04))',
                    borderBottom: '1px solid rgba(114, 46, 209, 0.1)'
                  }}
                >
                  <Form.Item
                    name="routingEnabled"
                    valuePropName="checked"
                    label={
                      <span>
                        启用问答路由 
                        <Tooltip title="启用后该助手将接入问答路由系统，可以处理多轮对话和复杂任务拆解">
                          <InfoCircleOutlined style={{ marginLeft: '4px' }} />
                        </Tooltip>
                      </span>
                    }
                  >
                    <Switch />
                  </Form.Item>
                  
                  <Form.Item
                    name="routingPath"
                    label="路由路径"
                    rules={[
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (!getFieldValue('routingEnabled') || value) {
                            return Promise.resolve();
                          }
                          return Promise.reject(new Error('启用路由后必须设置路由路径'));
                        },
                      }),
                    ]}
                  >
                    <Input 
                      placeholder="/route/assistant/{assistant_id}"
                      disabled={!form.getFieldValue('routingEnabled')}
                      addonBefore={<LinkOutlined />}
                    />
                  </Form.Item>
                  <Paragraph type="secondary" style={{ fontSize: '12px', marginTop: '-12px' }}>
                    <InfoCircleOutlined style={{ marginRight: '4px' }} />
                    问答路由用于实现多轮对话，任务拆解和复杂流程管理功能
                  </Paragraph>
                </Card>
              </TabPane>
            </Tabs>
            
            <div style={{ 
              position: 'sticky', 
              bottom: 0, 
              background: 'white', 
              padding: '16px 0', 
              borderTop: '1px solid #f0f0f0',
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '12px'
            }}>
              <Button onClick={onClose}>取消</Button>
              <Button 
                type="primary" 
                onClick={handleSubmit}
                style={{
                  background: 'linear-gradient(to right, #1890ff, #096dd9)',
                  borderColor: 'transparent'
                }}
              >
                保存配置
              </Button>
            </div>
          </Form>
        </Col>
        
        {/* 右侧测试对话区域 */}
        <Col span={10} style={{ 
          backgroundColor: '#f6f8fa', 
          height: 'calc(100vh - 150px)',
          borderLeft: '1px solid #eaeaea',
          display: 'flex',
          flexDirection: 'column'
        }}>
          {/* 聊天记录区域 */}
          <div style={{ 
            padding: '16px', 
            background: 'linear-gradient(135deg, #f5f8ff, #eef5ff)',
            borderBottom: '1px solid #eaeaea',
            flexShrink: 0
          }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center',
              marginBottom: '12px'
            }}>
              <RobotOutlined style={{ 
                fontSize: '18px', 
                color: '#1890ff',
                marginRight: '8px'
              }} />
              <div style={{ 
                fontWeight: 'bold',
                fontSize: '16px',
                background: 'linear-gradient(135deg, #1890ff, #40a9ff)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                测试对话
              </div>
            </div>
            <div style={{ fontSize: '13px', color: '#666' }}>
              通过测试对话，体验助手的响应效果与智能水平
            </div>
          </div>
          
          {/* 消息显示区域 */}
          <div style={{ 
            flex: 1, 
            overflowY: 'auto', 
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            background: 'linear-gradient(to bottom, #f6f8fa, #f0f5ff)'
          }}>
            {chatMessages.length === 0 ? (
              <div style={{ 
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                color: '#bbb',
                fontSize: '14px'
              }}>
                <MessageOutlined style={{ fontSize: '32px', marginBottom: '8px', color: '#d9d9d9' }} />
                <div>发送消息开始测试对话</div>
              </div>
            ) : (
              chatMessages.map((msg, index) => (
                <div key={index} style={{ 
                  display: 'flex',
                  flexDirection: 'column',
                  alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '90%'
                }}>
                  <div style={{ 
                    padding: '10px 14px',
                    borderRadius: msg.role === 'user' ? '12px 12px 0 12px' : '12px 12px 12px 0',
                    background: msg.role === 'user' 
                      ? 'linear-gradient(135deg, #1890ff, #40a9ff)' 
                      : 'white',
                    color: msg.role === 'user' ? 'white' : '#333',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                    border: msg.role === 'user' ? 'none' : '1px solid #eaeaea',
                    fontSize: '14px',
                    lineHeight: '1.5'
                  }}>
                    {msg.content}
                  </div>
                  <div style={{ 
                    fontSize: '12px', 
                    color: '#999',
                    marginTop: '4px',
                    alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                  }}>
                    {msg.role === 'user' ? '你' : assistant?.name || '助手'}
                  </div>
                </div>
              ))
            )}
          </div>
          
          {/* 消息输入区域 */}
          <div style={{ 
            padding: '16px',
            borderTop: '1px solid #eaeaea',
            background: 'white',
            display: 'flex',
            gap: '8px'
          }}>
            <Input 
              placeholder="输入测试问题..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onPressEnter={handleSend}
              style={{ 
                borderRadius: '20px',
                padding: '8px 16px',
                flex: 1,
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                border: '1px solid #eaeaea'
              }}
            />
            <Button 
              type="primary"
              onClick={handleSend}
              icon={<SendOutlined />}
              style={{
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #1890ff, #40a9ff)',
                boxShadow: '0 2px 6px rgba(24,144,255,0.2)'
              }}
            />
          </div>
        </Col>
      </Row>
    </Modal>
  );
};

export default AssistantSettingsModal;
