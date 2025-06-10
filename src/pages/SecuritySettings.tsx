import React, { useState } from 'react';
import { Card, Select, Switch, Typography, Badge, Input, Button, Alert, Table, Space, Popconfirm, message } from 'antd';
import PageHeader from '../components/layout/PageHeader';
import CreateApiKeyModal from '../components/modals/CreateApiKeyModal';
import { 
  KeyIcon,
  FilterIcon,
  DatabaseIcon,
  AlertTriangleIcon,
  EyeOffIcon,
  GlobeIcon,
  ServerIcon,
  CheckCircleIcon,
  XCircleIcon,
  PlusIcon,
  CopyIcon,
  TrashIcon
} from 'lucide-react';

const { Title, Text } = Typography;
const { TextArea } = Input;

interface ApiKeyItem {
  id: string;
  name: string;
  description: string;
  key: string;
  permissions: string[];
  createdAt: string;
  lastUsed: string;
  status: 'active' | 'disabled';
}

const SecuritySettings: React.FC = () => {
  const [apiKeys, setApiKeys] = useState<ApiKeyItem[]>([
    {
      id: '1',
      name: 'Frontend API Key',
      description: '前端应用访问密钥',
      key: 'sk-frontend_***************',
      permissions: ['read', 'search'],
      createdAt: '2024-01-15',
      lastUsed: '2024-03-15',
      status: 'active'
    },
    {
      id: '2', 
      name: 'Mobile API Key',
      description: '移动端应用访问密钥',
      key: 'sk-mobile_***************',
      permissions: ['read', 'search', 'chat'],
      createdAt: '2024-02-01',
      lastUsed: '2024-03-10',
      status: 'active'
    }
  ]);

  const [newKeyForm, setNewKeyForm] = useState({
    name: '',
    description: '',
    permissions: []
  });
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isCreatingKey, setIsCreatingKey] = useState(false);
  
  const [contentFilter, setContentFilter] = useState({
    enabled: true,
    level: 'medium',
    method: 'hybrid',
    customWords: ''
  });
  
  const [contentFilterWords, setContentFilterWords] = useState('');
  const [defaultReplies, setDefaultReplies] = useState({
    securityReject: '抱歉，我无法为您提供相关信息，请尝试重新表述您的问题。',
    securityPrompt: '为了确保信息安全，我将严格遵守内容安全策略。',
    maxRetries: 3
  });
  const [isSaving, setIsSaving] = useState({
    contentFilter: false,
    defaultReplies: false
  });

  const [dataSourceConfig, setDataSourceConfig] = useState({
    webSearch: true,
    localKnowledge: true,
    thirdPartyAPIs: true
  });

  // 生成新的API Key
  const generateApiKey = () => {
    if (!newKeyForm.name.trim()) {
      return;
    }
    
    const newKey: ApiKeyItem = {
      id: Date.now().toString(),
      name: newKeyForm.name,
      description: newKeyForm.description,
      key: `sk-${newKeyForm.name.toLowerCase().replace(/\s+/g, '_')}_${Math.random().toString(36).substring(2, 15)}`,
      permissions: newKeyForm.permissions,
      createdAt: new Date().toISOString().split('T')[0],
      lastUsed: '-',
      status: 'active'
    };
    
    setApiKeys(prev => [...prev, newKey]);
    setNewKeyForm({ name: '', description: '', permissions: [] });
    message.success('API Key 创建成功！');
  };

  // 处理Modal提交
  const handleModalSubmit = async (formData: { name: string; description: string; permissions: string[] }) => {
    setIsCreatingKey(true);
    try {
      // 模拟API调用延迟
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newKey: ApiKeyItem = {
        id: Date.now().toString(),
        name: formData.name,
        description: formData.description,
        key: `sk-${formData.name.toLowerCase().replace(/\s+/g, '_')}_${Math.random().toString(36).substring(2, 15)}`,
        permissions: formData.permissions,
        createdAt: new Date().toISOString().split('T')[0],
        lastUsed: '-',
        status: 'active'
      };
      
      setApiKeys(prev => [...prev, newKey]);
      setShowCreateModal(false);
      message.success('API Key 创建成功！');
    } catch (error) {
      message.error('创建失败，请重试');
    } finally {
      setIsCreatingKey(false);
    }
  };

  // 删除API Key
  const deleteApiKey = (id: string) => {
    setApiKeys(prev => prev.filter(key => key.id !== id));
  };

  // 复制API Key
  const copyApiKey = (key: string) => {
    navigator.clipboard.writeText(key);
    // 这里可以添加toast提示
  };

  // 安全卡片组件
  const SecurityCard: React.FC<{
    title: string;
    icon: React.ReactNode;
    children: React.ReactNode;
    accentColor?: string;
    status?: 'secure' | 'warning' | 'danger';
  }> = ({ title, icon, children, accentColor, status = 'secure' }) => {
    
    const statusColors = {
      secure: '#10b981',
      warning: '#f59e0b', 
      danger: '#ef4444'
    };

    // 优先使用accentColor，如果没有指定则使用status对应的颜色
    const currentColor = accentColor || statusColors[status];

    return (
      <Card
        className="security-card"
        style={{
          background: `linear-gradient(145deg, ${currentColor}06 0%, ${currentColor}03 25%, rgba(255, 255, 255, 0.98) 60%, rgba(248, 250, 252, 0.96) 100%)`,
          border: `2px solid ${currentColor}25`,
          borderRadius: '32px',
          boxShadow: `0 32px 64px ${currentColor}08, 0 16px 32px rgba(0, 0, 0, 0.04), inset 0 2px 0 rgba(255, 255, 255, 0.9)`,
          overflow: 'hidden',
          position: 'relative',
          backdropFilter: 'blur(20px)'
        }}
        bodyStyle={{ padding: '48px' }}
      >
        {/* 装饰元素 */}
        <div 
          className="absolute top-0 left-0 w-40 h-40 opacity-20 pointer-events-none"
          style={{
            background: `radial-gradient(circle, ${currentColor}30 0%, ${currentColor}10 40%, transparent 70%)`,
            filter: 'blur(25px)'
          }}
        />
        
        {/* 标题区域 */}
        <div className="flex items-center justify-between mb-20 relative z-10">
          <div className="flex items-center">
            <div 
              className="w-20 h-20 rounded-3xl flex items-center justify-center text-3xl mr-6 shadow-xl"
              style={{
                background: `linear-gradient(135deg, ${currentColor}20, ${currentColor}10)`,
                border: `3px solid ${currentColor}40`,
                backdropFilter: 'blur(15px)',
                boxShadow: `0 12px 24px ${currentColor}25`
              }}
            >
              {icon}
            </div>
            <div>
              <Title level={2} className="mb-2 text-gray-800 font-black tracking-tight">
                {title}
              </Title>
              {status === 'secure' && (
                <div className="flex items-center">
                  <CheckCircleIcon size={16} className="text-green-500 mr-2" />
                  <Text className="text-green-600 font-semibold">安全状态良好</Text>
                </div>
              )}
              {status === 'warning' && (
                <div className="flex items-center">
                  <AlertTriangleIcon size={16} className="text-yellow-500 mr-2" />
                  <Text className="text-yellow-600 font-semibold">需要注意</Text>
                </div>
              )}
              {status === 'danger' && (
                <div className="flex items-center">
                  <XCircleIcon size={16} className="text-red-500 mr-2" />
                  <Text className="text-red-600 font-semibold">存在风险</Text>
                </div>
              )}
            </div>
          </div>
          
          <Badge 
            status={status === 'secure' ? 'success' : status === 'warning' ? 'warning' : 'error'}
            style={{ 
              fontSize: '16px',
              transform: 'scale(1.5)'
            }}
          />
        </div>
        
        <div className="relative z-10">
          {children}
        </div>
      </Card>
    );
  };

  const apiKeyColumns = [
    {
      title: 'API Key名称',
      dataIndex: 'name',
      key: 'name',
      render: (name: string, record: ApiKeyItem) => (
        <div>
          <Text className="font-bold text-gray-800">{name}</Text>
          <br />
          <Text className="text-sm text-gray-500">{record.description}</Text>
        </div>
      )
    },
    {
      title: 'API Key',
      dataIndex: 'key',
      key: 'key',
      render: (key: string) => (
        <div className="flex items-center space-x-2">
          <code className="bg-gray-100 px-2 py-1 rounded text-sm">{key}</code>
          <Button 
            type="text" 
            size="small" 
            icon={<CopyIcon size={14} />}
            onClick={() => copyApiKey(key)}
            title="复制"
          />
        </div>
      )
    },
    {
      title: '权限',
      dataIndex: 'permissions',
      key: 'permissions',
      render: (permissions: string[]) => (
        <Space wrap>
          {permissions.map(permission => (
            <Badge 
              key={permission} 
              color="blue" 
              text={permission} 
              style={{ fontSize: '12px' }}
            />
          ))}
        </Space>
      )
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Badge 
          status={status === 'active' ? 'success' : 'default'} 
          text={status === 'active' ? '活跃' : '禁用'} 
        />
      )
    },
    {
      title: '操作',
      key: 'actions',
      render: (record: ApiKeyItem) => (
        <Space>
          <Button 
            type="text" 
            size="small"
            onClick={() => {
              const newStatus = record.status === 'active' ? 'disabled' : 'active';
              setApiKeys(prev => prev.map(key => 
                key.id === record.id ? { ...key, status: newStatus } : key
              ));
            }}
          >
            {record.status === 'active' ? '禁用' : '启用'}
          </Button>
          <Popconfirm
            title="确认删除此API Key？"
            onConfirm={() => deleteApiKey(record.id)}
            okText="删除"
            cancelText="取消"
          >
            <Button 
              type="text" 
              size="small" 
              danger 
              icon={<TrashIcon size={14} />}
            />
          </Popconfirm>
        </Space>
      )
    }
  ];

  // 保存敏感词库
  const saveContentFilterWords = async () => {
    setIsSaving(prev => ({ ...prev, contentFilter: true }));
    try {
      // 这里可以调用API保存敏感词库
      setContentFilter(prev => ({ ...prev, customWords: contentFilterWords }));
      message.success('敏感词库保存成功！');
    } catch (error) {
      message.error('保存失败，请重试');
    } finally {
      setTimeout(() => {
        setIsSaving(prev => ({ ...prev, contentFilter: false }));
      }, 1000);
    }
  };

  // 保存默认回复设置
  const saveDefaultReplies = async () => {
    setIsSaving(prev => ({ ...prev, defaultReplies: true }));
    try {
      // 这里可以调用API保存默认回复设置
      message.success('默认回复设置保存成功！');
    } catch (error) {
      message.error('保存失败，请重试');
    } finally {
      setTimeout(() => {
        setIsSaving(prev => ({ ...prev, defaultReplies: false }));
      }, 1000);
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-50 via-gray-50 to-blue-50/30 min-h-screen flex flex-col">
      {/* 页面头部 */}
      <div className="sticky top-0 z-20">
        <PageHeader 
          title="安全设置"
          parentTitle="系统设置"
          description="配置系统的安全功能和权限管理"
        />
      </div>

      <div className="flex-1 overflow-auto">
        <div className="p-8 max-w-7xl mx-auto space-y-8">
          
          {/* 系统API密钥管理 - 蓝色系 */}
          <SecurityCard
            title="系统API密钥管理"
            icon={<KeyIcon size={32} style={{ color: '#2563eb' }} />}
            accentColor="#2563eb"
            status="secure"
          >
            <Alert
              message="API密钥管理说明"
              description="创建和管理用于访问系统的API密钥。每个密钥都有特定的权限范围，请妥善保管。"
              type="info"
              showIcon
              style={{ 
                marginBottom: '32px',
                borderRadius: '16px',
                border: '2px solid #2563eb20',
                background: 'rgba(37, 99, 235, 0.05)'
              }}
            />

            <div className="mb-6">
              <Button
                type="primary"
                icon={<PlusIcon size={20} />}
                onClick={() => setShowCreateModal(true)}
                size="large"
                style={{
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #2563eb, #2563ebdd)',
                  border: 'none',
                  boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  transform: 'translateZ(0)', // 启用硬件加速
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
                  e.currentTarget.style.boxShadow = '0 8px 20px rgba(37, 99, 235, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(37, 99, 235, 0.3)';
                }}
                onMouseDown={(e) => {
                  e.currentTarget.style.transform = 'translateY(1px) scale(0.98)';
                }}
                onMouseUp={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
                }}
              >
                创建新的API Key
              </Button>
            </div>
            
            <Table 
              columns={apiKeyColumns}
              dataSource={apiKeys}
              rowKey="id"
              pagination={false}
              style={{
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }}
            />
          </SecurityCard>

          {/* 内容安全过滤 - 橙红色系 */}
          <SecurityCard
            title="内容安全过滤"
            icon={<FilterIcon size={32} style={{ color: '#ea580c' }} />}
            accentColor="#ea580c"
            status={contentFilter.enabled ? 'secure' : 'danger'}
          >
            <div className="space-y-8">
              <div 
                className="flex items-center justify-between p-6 rounded-2xl border-2"
                style={{
                  background: 'linear-gradient(135deg, rgba(234, 88, 12, 0.08) 0%, rgba(255, 255, 255, 0.95) 60%)',
                  borderColor: '#ea580c20'
                }}
              >
                <div className="flex items-center space-x-4">
                  <EyeOffIcon size={24} style={{ color: '#ea580c' }} />
                  <div>
                    <Text className="text-lg font-bold text-gray-800">启用内容过滤</Text>
                    <Text className="text-sm text-gray-500">智能识别并过滤不当内容</Text>
                  </div>
                </div>
                <Switch
                  checked={contentFilter.enabled}
                  onChange={(checked) => setContentFilter(prev => ({ ...prev, enabled: checked }))}
                />
              </div>

              {/* 配置区域 - 始终可见，通过禁用状态控制 */}
              <div 
                className="space-y-8"
                style={{
                  opacity: contentFilter.enabled ? 1 : 0.5,
                  pointerEvents: contentFilter.enabled ? 'auto' : 'none',
                  transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                  filter: contentFilter.enabled ? 'none' : 'grayscale(30%)',
                  transform: contentFilter.enabled ? 'translateY(0)' : 'translateY(5px)'
                }}
              >
                <div style={{
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1) 0.1s',
                  transform: contentFilter.enabled ? 'scale(1)' : 'scale(0.98)',
                  opacity: contentFilter.enabled ? 1 : 0.8
                }}>
                  <Text className="text-lg font-bold mb-4 block text-gray-800">过滤强度级别</Text>
                  <Select
                    value={contentFilter.level}
                    onChange={(value) => setContentFilter(prev => ({ ...prev, level: value }))}
                    className="w-full"
                    size="large"
                    disabled={!contentFilter.enabled}
                    style={{ 
                      borderRadius: '16px',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                    }}
                    options={[
                      { value: 'low', label: '🟢 宽松模式 - 仅过滤明显违规内容' },
                      { value: 'medium', label: '🟡 标准模式 - 平衡安全性与可用性' },
                      { value: 'high', label: '🔴 严格模式 - 最高安全标准' }
                    ]}
                  />
                </div>

                <div style={{
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1) 0.15s',
                  transform: contentFilter.enabled ? 'scale(1)' : 'scale(0.98)',
                  opacity: contentFilter.enabled ? 1 : 0.8
                }}>
                  <Text className="text-lg font-bold mb-4 block text-gray-800">过滤实现方式</Text>
                  <Select
                    value={contentFilter.method}
                    onChange={(value) => setContentFilter(prev => ({ ...prev, method: value }))}
                    className="w-full"
                    size="large"
                    disabled={!contentFilter.enabled}
                    style={{ 
                      borderRadius: '16px',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                    }}
                    options={[
                      { value: 'local', label: '🏠 本地过滤 - 快速响应' },
                      { value: 'api', label: '☁️ 第三方API - 高准确度' },
                      { value: 'hybrid', label: '🔄 混合模式 - 速度与准确性兼顾' }
                    ]}
                  />
                </div>

                <div style={{
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1) 0.2s',
                  transform: contentFilter.enabled ? 'scale(1)' : 'scale(0.98)',
                  opacity: contentFilter.enabled ? 1 : 0.8
                }}>
                  <Text className="text-lg font-bold mb-4 block text-gray-800">自定义敏感词库</Text>
                  <TextArea
                    value={contentFilterWords}
                    onChange={(e) => setContentFilterWords(e.target.value)}
                    placeholder="请输入自定义敏感词，用换行分隔..."
                    rows={6}
                    disabled={!contentFilter.enabled}
                    style={{
                      borderRadius: '16px',
                      border: '2px solid #ea580c20',
                      background: 'rgba(255,255,255,0.8)',
                      padding: '16px',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                    }}
                  />
                  
                  {/* 保存按钮 */}
                  <div className="mt-4">
                    <Button 
                      type="primary" 
                      onClick={saveContentFilterWords}
                      loading={isSaving.contentFilter}
                      disabled={!contentFilter.enabled}
                      style={{
                        borderRadius: '12px',
                        background: 'linear-gradient(135deg, #ea580c, #ea580cdd)',
                        border: 'none',
                        boxShadow: '0 4px 12px rgba(234, 88, 12, 0.3)'
                      }}
                    >
                      {isSaving.contentFilter ? '保存中...' : '保存敏感词库'}
                    </Button>
                  </div>
                  
                  {/* 固定高度的提示区域，避免布局跳动 */}
                  <div 
                    style={{
                      height: '60px', // 固定高度
                      marginTop: '8px',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                    }}
                  >
                    <div 
                      className="p-3 rounded-lg border"
                      style={{
                        background: 'rgba(234, 88, 12, 0.05)',
                        borderColor: '#ea580c20',
                        color: '#6b7280',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        opacity: contentFilter.enabled ? 0 : 1,
                        visibility: contentFilter.enabled ? 'hidden' : 'visible',
                        transform: contentFilter.enabled ? 'translateY(-10px) scale(0.95)' : 'translateY(0) scale(1)',
                        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                        pointerEvents: contentFilter.enabled ? 'none' : 'auto'
                      }}
                    >
                      <Text className="text-sm">
                        💡 启用内容过滤后即可配置敏感词库
                      </Text>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </SecurityCard>

          {/* 默认系统回复设置 - 青色系 */}
          <SecurityCard
            title="默认系统回复"
            icon={<AlertTriangleIcon size={32} style={{ color: '#0891b2' }} />}
            accentColor="#0891b2"
            status="secure"
          >
            <div className="space-y-8">
              <div>
                <Text className="text-lg font-bold mb-4 block text-gray-800">安全拒绝回复</Text>
                <TextArea
                  value={defaultReplies.securityReject}
                  onChange={(e) => setDefaultReplies(prev => ({ ...prev, securityReject: e.target.value }))}
                  placeholder="当检测到不当内容时的默认回复..."
                  rows={4}
                  style={{
                    borderRadius: '16px',
                    border: '2px solid #0891b220',
                    background: 'rgba(255,255,255,0.8)',
                    padding: '16px'
                  }}
                />
              </div>
              
              <div>
                <Text className="text-lg font-bold mb-4 block text-gray-800">安全提示语</Text>
                <TextArea
                  value={defaultReplies.securityPrompt}
                  onChange={(e) => setDefaultReplies(prev => ({ ...prev, securityPrompt: e.target.value }))}
                  placeholder="系统安全提示语..."
                  rows={3}
                  style={{
                    borderRadius: '16px',
                    border: '2px solid #0891b220',
                    background: 'rgba(255,255,255,0.8)',
                    padding: '16px'
                  }}
                />
              </div>

              <div>
                <Text className="text-lg font-bold mb-4 block text-gray-800">最大重试次数</Text>
                <Select
                  value={defaultReplies.maxRetries}
                  onChange={(value) => setDefaultReplies(prev => ({ ...prev, maxRetries: value }))}
                  className="w-full"
                  size="large"
                  style={{ borderRadius: '16px' }}
                  options={[
                    { value: 1, label: '1次 - 快速响应' },
                    { value: 2, label: '2次 - 平衡模式' },
                    { value: 3, label: '3次 - 标准设置' },
                    { value: 5, label: '5次 - 容错优先' }
                  ]}
                />
              </div>
              
              {/* 保存按钮 */}
              <div className="mt-6">
                <Button 
                  type="primary" 
                  onClick={saveDefaultReplies}
                  loading={isSaving.defaultReplies}
                  style={{
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #0891b2, #0891b2dd)',
                    border: 'none',
                    boxShadow: '0 4px 12px rgba(8, 145, 178, 0.3)'
                  }}
                >
                  {isSaving.defaultReplies ? '保存中...' : '保存默认回复设置'}
                </Button>
              </div>
            </div>
          </SecurityCard>

          {/* 数据源安全配置 - 绿色系 */}
          <SecurityCard
            title="数据源安全配置"
            icon={<DatabaseIcon size={32} style={{ color: '#059669' }} />}
            accentColor="#059669"
            status="secure"
          >
            <div className="space-y-8">
              <Alert
                message="数据源配置说明"
                description="配置系统在搜索和检索过程中可以使用的数据源，确保信息来源的可靠性。"
                type="success"
                showIcon
                style={{ 
                  marginBottom: '24px',
                  borderRadius: '16px',
                  border: '2px solid #05966920',
                  background: 'rgba(5, 150, 105, 0.05)'
                }}
              />

              <div className="grid grid-cols-1 gap-6">
                {[
                  { key: 'webSearch', label: '网络搜索', desc: '使用搜索引擎获取实时信息', icon: GlobeIcon, color: '#3b82f6' },
                  { key: 'localKnowledge', label: '本地知识库', desc: '使用已上传的文档和知识库', icon: DatabaseIcon, color: '#059669' },
                  { key: 'thirdPartyAPIs', label: '第三方API', desc: '调用外部API获取专业数据', icon: ServerIcon, color: '#e11d48' }
                ].map(({ key, label, desc, icon: Icon, color }) => (
                  <div 
                    key={key}
                    className="flex items-center justify-between p-6 rounded-2xl border-2"
                    style={{
                      background: `linear-gradient(135deg, ${color}08 0%, rgba(255, 255, 255, 0.95) 60%)`,
                      borderColor: `${color}20`,
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      cursor: 'pointer',
                      transform: 'translateZ(0)' // 启用硬件加速
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = `0 8px 20px ${color}20`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                    onClick={() => setDataSourceConfig(prev => ({ 
                      ...prev, 
                      [key]: !prev[key as keyof typeof prev]
                    }))}
                  >
                    <div className="flex items-center space-x-4">
                      <Icon 
                        size={24} 
                        style={{ 
                          color,
                          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                          opacity: dataSourceConfig[key as keyof typeof dataSourceConfig] ? 1 : 0.5
                        }} 
                      />
                      <div style={{
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        opacity: dataSourceConfig[key as keyof typeof dataSourceConfig] ? 1 : 0.7
                      }}>
                        <Text className="text-lg font-bold text-gray-800">{label}</Text>
                        <Text className="text-sm text-gray-500">{desc}</Text>
                      </div>
                    </div>
                    <Switch
                      checked={dataSourceConfig[key as keyof typeof dataSourceConfig]}
                      onChange={(checked, e) => {
                        e.stopPropagation(); // 防止事件冒泡
                        setDataSourceConfig(prev => ({ ...prev, [key]: checked }));
                      }}
                      style={{
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                      }}
                    />
                  </div>
                ))}
              </div>

              {/* 排除数据源 */}
              <div>
                <Text className="text-lg font-bold mb-4 block text-gray-800">排除数据源</Text>
                <Select
                  mode="multiple"
                  className="w-full"
                  size="large"
                  placeholder="选择要排除的数据源..."
                  style={{ borderRadius: '16px' }}
                  options={[
                    { value: 'wikipedia', label: '🌐 维基百科' },
                    { value: 'social_media', label: '📱 社交媒体' },
                    { value: 'news_sites', label: '📰 新闻网站' },
                    { value: 'forums', label: '💬 论坛社区' },
                    { value: 'personal_blogs', label: '📝 个人博客' }
                  ]}
                />
              </div>
            </div>
          </SecurityCard>
        </div>
      </div>

      {/* 创建API Key Modal */}
      <CreateApiKeyModal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleModalSubmit}
        loading={isCreatingKey}
      />

      <style>{`
        /* API表单Grid动画样式 */
        .api-form-wrapper {
          transition: grid-template-rows 0.4s cubic-bezier(0.4, 0, 0.2, 1), margin-bottom 0.4s ease !important;
        }
        
        .api-form-wrapper > div {
          overflow: hidden !important;
          min-height: 0 !important;
        }
        
        /* 覆盖全局样式干扰 */
        .api-form-wrapper,
        .api-form-wrapper *:not(.ant-btn):not(.ant-input):not(.ant-select) {
          transform: none !important;
        }
        
        .api-form-wrapper:hover {
          transform: none !important;
        }
        
        /* 安全卡片悬停效果 */
        .security-card {
          transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .security-card:hover {
          transform: translateY(-8px) scale(1.01);
        }
        
        /* 按钮悬停效果 */
        .ant-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
        }
        
        /* 输入框聚焦效果 */
        .ant-input:focus,
        .ant-input-focused,
        .ant-select-focused .ant-select-selector {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.2);
        }
        
        /* 禁用状态的过渡效果 */
        .ant-select-disabled .ant-select-selector,
        .ant-input:disabled {
          opacity: 0.6 !important;
          cursor: not-allowed !important;
          background: rgba(0, 0, 0, 0.04) !important;
        }
      `}</style>
    </div>
  );
};

export default SecuritySettings; 