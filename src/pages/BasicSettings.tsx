import React, { useState } from 'react';
import { Card, Select, Switch, Typography, Tag, Badge } from 'antd';
import PageHeader from '../components/layout/PageHeader';
import { 
  CheckOutlined, 
  CloseOutlined, 
  FilterOutlined,
  SearchOutlined,
  BulbOutlined,
  SettingOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;

const BasicSettings: React.FC = () => {
  const [useLocalModels, setUseLocalModels] = useState(false);

  const modelOptions = {
    embedding: [
      { value: 'siliconflow/BAAI/bge-m3', label: 'siliconflow/BAAI/bge-m3', tag: '推荐' },
      { value: 'local/embedding-model-1', label: '本地模型 1', tag: '本地' },
      { value: 'custom/embedding-model-1', label: '自定义模型 1', tag: '自定义' },
    ],
    rerank: [
      { value: 'siliconflow/BAAI/bge-reranker-v2-m3', label: 'siliconflow/BAAI/bge-reranker-v2-m3', tag: '推荐' },
      { value: 'local/rerank-model-1', label: '本地模型 1', tag: '本地' },
      { value: 'custom/rerank-model-1', label: '自定义模型 1', tag: '自定义' },
    ],
    chat: [
      { value: 'gpt-4', label: 'GPT-4', tag: '高级' },
      { value: 'gpt-3.5-turbo', label: 'GPT-3.5 Turbo', tag: '快速' },
      { value: 'local/chat-model-1', label: '本地模型 1', tag: '本地' },
      { value: 'custom/chat-model-1', label: '自定义模型 1', tag: '自定义' },
    ],
  };

  const searchEngineOptions = [
    { value: 'bing', label: 'Bing', icon: '🌐' },
    { value: 'seaXNG', label: 'SeaXNG', icon: '🔍' },
    { value: 'duckduckgo', label: 'DuckDuckGo', icon: '🦆' },
    { value: 'google', label: 'Google', icon: '🔎' },
  ];

  const featureConfigs = [
    {
      key: 'knowledge-base',
      title: '知识库',
      description: '启用文档管理和智能检索功能',
      icon: '📚',
      color: '#1890ff',
      enabled: true
    },
    {
      key: 'knowledge-graph',
      title: '知识图谱',
      description: '启用实体关系分析和推理功能',
      icon: '🕸️',
      color: '#52c41a',
      enabled: true
    },
    {
      key: 'web-search',
      title: '网页搜索',
      description: '启用多搜索引擎集成和聚合',
      icon: '🌏',
      color: '#fa8c16',
      enabled: true
    }
  ];

  // 现代化卡片组件
  const ModernCard: React.FC<{
    title: string;
    icon: string;
    children: React.ReactNode;
    accentColor?: string;
    className?: string;
  }> = ({ title, icon, children, accentColor = '#1890ff', className = '' }) => {
    return (
      <Card
        className={`modern-card ${className}`}
        style={{
          background: `linear-gradient(135deg, ${accentColor}08 0%, ${accentColor}04 30%, rgba(255, 255, 255, 0.98) 50%, rgba(248, 250, 252, 0.95) 100%)`,
          border: `1px solid ${accentColor}20`,
          borderRadius: '24px',
          boxShadow: `0 20px 50px ${accentColor}12, 0 10px 25px rgba(0, 0, 0, 0.06), inset 0 1px 0 rgba(255, 255, 255, 0.8)`,
          overflow: 'hidden',
          position: 'relative'
        }}
        bodyStyle={{ padding: '36px' }}
      >
        {/* 现代化光效装饰 */}
        <div 
          className="absolute top-0 left-0 w-32 h-32 opacity-30 pointer-events-none"
          style={{
            background: `radial-gradient(circle, ${accentColor}20 0%, transparent 70%)`,
            filter: 'blur(20px)'
          }}
        />
        
        {/* 标题区域 */}
        <div className="flex items-center mb-16 relative z-10">
          <div 
            className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl mr-5 shadow-lg"
            style={{
              background: `linear-gradient(135deg, ${accentColor}25, ${accentColor}15)`,
              border: `2px solid ${accentColor}35`,
              backdropFilter: 'blur(15px)',
              boxShadow: `0 8px 20px ${accentColor}30`
            }}
          >
            {icon}
          </div>
          <div>
            <Title level={3} className="mb-0 text-gray-800 font-bold tracking-tight">
              {title}
            </Title>
          </div>
        </div>
        
        {/* 配置内容区域 */}
        <div className="relative z-10">
          {children}
        </div>
      </Card>
    );
  };

  // 模型选择组件 - 纵向设计
  const ModelSelect: React.FC<{
    title: string;
    icon: string;
    options: any[];
    defaultValue: string[];
    description?: string;
    color: string;
  }> = ({ title, icon, options, defaultValue, description, color }) => (
    <div 
      className="p-8 rounded-3xl border transition-all duration-300 hover:shadow-xl hover:scale-[1.01] relative overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${color}08 0%, ${color}04 30%, rgba(255, 255, 255, 0.98) 70%, rgba(248, 250, 252, 0.95) 100%)`,
        border: `1px solid ${color}20`,
        backdropFilter: 'blur(20px)',
        boxShadow: `0 15px 35px ${color}15, 0 8px 20px rgba(0, 0, 0, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.8)`
      }}
    >
      {/* 现代化装饰元素 */}
      <div 
        className="absolute top-0 right-0 w-24 h-24 opacity-20 pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${color}25 0%, transparent 70%)`,
          filter: 'blur(15px)'
        }}
      />
      
      {/* 模型类型标题区域 */}
      <div className="flex items-center justify-between mb-10 relative z-10">
        <div className="flex items-center space-x-4">
          <div 
            className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl shadow-lg"
            style={{
              background: `linear-gradient(135deg, ${color}25, ${color}15)`,
              border: `2px solid ${color}35`,
              boxShadow: `0 8px 20px ${color}30`
            }}
          >
            {icon}
          </div>
          <div>
            <Text className="text-gray-800 text-xl font-bold mb-1 block">{title}</Text>
            <Text className="text-gray-500 text-sm">当前选择 {defaultValue.length} 个模型</Text>
          </div>
        </div>
        <Badge 
          count={defaultValue.length}
          style={{ 
            backgroundColor: color,
            fontSize: '14px',
            fontWeight: 'bold',
            borderRadius: '16px',
            minWidth: '32px',
            height: '32px',
            lineHeight: '32px',
            boxShadow: `0 4px 12px ${color}50`,
            border: '2px solid rgba(255,255,255,0.9)'
          }}
        />
      </div>
      
      {/* 模型选择器 */}
      <div className="pt-12">
        <Text className="text-gray-700 text-base font-semibold mb-8 block">选择模型：</Text>
        <Select
          mode="multiple"
          className="w-full premium-select-large"
          defaultValue={defaultValue}
          options={options.map(opt => ({
            ...opt,
            label: opt.label
          }))}
          placeholder={`请选择 ${title.replace(/🧠|🎯|💬/g, '').trim()}`}
          style={{ minHeight: '80px' }}
          maxTagCount="responsive"
          optionRender={(option) => (
            <div className="flex items-center justify-between py-4 px-3">
              <div className="flex-1">
                <div className="text-gray-800 font-semibold text-base mb-1">
                  {option.label}
                </div>
                <div className="text-gray-500 text-xs">
                  {option.data?.tag === '推荐' && '官方推荐模型，性能稳定'}
                  {option.data?.tag === '本地' && '本地部署模型，数据安全'}
                  {option.data?.tag === '自定义' && '用户自定义模型配置'}
                  {option.data?.tag === '高级' && '高级模型，功能强大'}
                  {option.data?.tag === '快速' && '快速响应，适合实时对话'}
                </div>
              </div>
              {option.data?.tag && (
                <Tag
                  color={
                    option.data.tag === '推荐' ? 'blue' : 
                    option.data.tag === '本地' ? 'green' : 
                    option.data.tag === '高级' ? 'purple' :
                    option.data.tag === '快速' ? 'cyan' : 'orange'
                  }
                  className="text-sm font-bold ml-4 rounded-lg"
                  style={{ 
                    borderRadius: '10px',
                    fontWeight: '700',
                    fontSize: '12px',
                    padding: '4px 12px'
                  }}
                >
                  {option.data.tag}
                </Tag>
              )}
            </div>
          )}
          tagRender={(props) => {
            const { label, closable, onClose } = props;
            const option = options.find(opt => opt.label === label);
            return (
              <Tag
                closable={closable}
                onClose={onClose}
                style={{
                  background: `linear-gradient(135deg, ${color}18, ${color}08)`,
                  border: `2px solid ${color}30`,
                  borderRadius: '12px',
                  color: color,
                  fontWeight: '700',
                  fontSize: '13px',
                  padding: '8px 16px',
                  margin: '4px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  maxWidth: 'none',
                  boxShadow: `0 3px 10px ${color}30`
                }}
              >
                <span className="truncate max-w-[200px]">{label}</span>
                {option?.tag && (
                  <span 
                    className="ml-2 text-xs opacity-80 px-2 py-1 rounded-md"
                    style={{ 
                      fontSize: '10px',
                      background: `${color}20`
                    }}
                  >
                    {option.tag}
                  </span>
                )}
              </Tag>
            );
          }}
        />
      </div>
      
      {/* 说明区域 */}
      {description && (
        <div 
          className="mt-8 p-6 rounded-2xl border"
          style={{
            background: `linear-gradient(135deg, ${color}05, ${color}02)`,
            border: `1px solid ${color}12`,
            backdropFilter: 'blur(20px)'
          }}
        >
          <div className="flex items-start space-x-3">
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center text-lg mt-1"
              style={{
                background: `${color}15`,
                border: `1px solid ${color}25`
              }}
            >
              💡
            </div>
            <div className="flex-1">
              <Text className="text-gray-700 text-sm font-semibold mb-2 block">使用说明</Text>
              <Text className="text-gray-600 text-sm leading-relaxed">
                {description}
              </Text>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="bg-gradient-to-br from-gray-50 via-gray-50 to-blue-50/30 min-h-screen flex flex-col">
      {/* 页面头部 */}
      <div className="sticky top-0 z-20">
        <PageHeader 
          title="基础设置"
          parentTitle="系统设置"
          description="配置系统的基础功能和模型参数"
        />
      </div>

      <div className="flex-1 overflow-auto">
        <div className="p-8 max-w-7xl mx-auto space-y-8">
          
          {/* 智能模型配置 */}
          <ModernCard 
            title="智能模型配置" 
            icon="🤖"
            accentColor="#1890ff"
          >
            {/* 模型过滤器 */}
            <div 
              className="mt-8 mb-12 p-6 rounded-2xl border transition-all duration-300 hover:shadow-lg relative overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, rgba(24, 144, 255, 0.08) 0%, rgba(24, 144, 255, 0.04) 30%, rgba(255, 255, 255, 0.98) 70%, rgba(248, 250, 252, 0.95) 100%)',
                border: '1px solid rgba(24, 144, 255, 0.2)',
                backdropFilter: 'blur(20px)',
                boxShadow: '0 12px 30px rgba(24, 144, 255, 0.12), 0 6px 15px rgba(0, 0, 0, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.8)'
              }}
            >
              {/* 装饰光效 */}
              <div 
                className="absolute top-0 right-0 w-20 h-20 opacity-25 pointer-events-none"
                style={{
                  background: 'radial-gradient(circle, rgba(24, 144, 255, 0.3) 0%, transparent 70%)',
                  filter: 'blur(12px)'
                }}
              />
              
              <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center space-x-5">
                  <div 
                    className="w-14 h-14 rounded-xl flex items-center justify-center shadow-sm"
                    style={{
                      background: 'linear-gradient(135deg, rgba(24, 144, 255, 0.25), rgba(24, 144, 255, 0.15))',
                      border: '2px solid rgba(24, 144, 255, 0.35)',
                      boxShadow: '0 6px 15px rgba(24, 144, 255, 0.3)'
                    }}
                  >
                    <FilterOutlined className="text-blue-500 text-xl" />
                  </div>
                                      <div>
                      <Text className="text-gray-800 text-lg font-bold block">模型过滤器</Text>
                      <Text className="text-gray-500 text-sm">不使用第三方模型</Text>
                    </div>
                </div>
                <Switch
                  checked={useLocalModels}
                  onChange={setUseLocalModels}
                  checkedChildren={<CheckOutlined />}
                  unCheckedChildren={<CloseOutlined />}
                  style={{
                    background: useLocalModels ? '#1890ff' : undefined,
                    boxShadow: useLocalModels ? '0 2px 8px rgba(24, 144, 255, 0.3)' : undefined
                  }}
                />
              </div>
            </div>
            
                        {/* 模型选择区域 - 纵向布局 */}
            <div className="space-y-16">
              <ModelSelect
                title="Embedding 模型"
                icon="🧠"
                options={modelOptions.embedding}
                defaultValue={['siliconflow/BAAI/bge-m3']}
                color="#1890ff"
                description="按顺序尝试调用，失败时自动切换到下一个可用模型"
              />
              <ModelSelect
                title="Re-Ranker 模型"
                icon="🎯"
                options={modelOptions.rerank}
                defaultValue={['siliconflow/BAAI/bge-reranker-v2-m3']}
                color="#722ed1"
                description="对检索结果进行重新排序，提升相关性和准确性"
              />
              <ModelSelect
                title="Chat 模型"
                icon="💬"
                options={modelOptions.chat}
                defaultValue={['gpt-4']}
                color="#eb2f96"
                description="负责生成最终回答，支持多轮对话和上下文理解"
              />
            </div>
          </ModernCard>

          {/* 功能模块配置 */}
          <ModernCard 
            title="功能模块配置" 
            icon="⚡"
            accentColor="#52c41a"
          >
            <div className="mt-8 grid gap-6 lg:grid-cols-3">
              {featureConfigs.map((feature) => (
                <div
                  key={feature.key}
                  className="relative rounded-2xl border transition-all duration-300 hover:shadow-lg hover:scale-[1.02]"
                  style={{
                    background: `linear-gradient(135deg, ${feature.color}08 0%, ${feature.color}04 30%, rgba(255, 255, 255, 0.98) 70%, rgba(248, 250, 252, 0.95) 100%)`,
                    border: `1px solid ${feature.color}25`,
                    backdropFilter: 'blur(20px)',
                    boxShadow: `0 12px 25px ${feature.color}15, 0 6px 12px rgba(0, 0, 0, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.8)`
                  }}
                >
                  {/* 装饰光效 */}
                  <div 
                    className="absolute top-0 right-0 w-16 h-16 opacity-20 pointer-events-none"
                    style={{
                      background: `radial-gradient(circle, ${feature.color}30 0%, transparent 70%)`,
                      filter: 'blur(10px)'
                    }}
                  />
                  
                  <div className="p-8 relative z-10">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <div 
                          className="w-14 h-14 rounded-xl flex items-center justify-center text-xl shadow-sm"
                          style={{
                            background: `linear-gradient(135deg, ${feature.color}25, ${feature.color}15)`,
                            border: `2px solid ${feature.color}35`,
                            boxShadow: `0 6px 15px ${feature.color}30`
                          }}
                        >
                          {feature.icon}
                        </div>
                        <div>
                          <Text className="text-gray-800 text-lg font-bold block mb-3">{feature.title}</Text>
                          <Text className="text-gray-600 text-sm leading-relaxed">
                            {feature.description}
                          </Text>
                        </div>
                      </div>
                      <Switch
                        defaultChecked={feature.enabled}
                        style={{
                          background: feature.enabled ? feature.color : undefined,
                          boxShadow: feature.enabled ? `0 2px 8px ${feature.color}40` : undefined
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ModernCard>

          {/* 搜索引擎配置 */}
          <ModernCard 
            title="搜索引擎配置" 
            icon="🔍"
            accentColor="#fa8c16"
          >
            <div 
              className="mt-8 p-6 rounded-2xl border relative overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, rgba(250, 140, 22, 0.08) 0%, rgba(250, 140, 22, 0.04) 30%, rgba(255, 255, 255, 0.98) 70%, rgba(248, 250, 252, 0.95) 100%)',
                border: '1px solid rgba(250, 140, 22, 0.25)',
                backdropFilter: 'blur(20px)',
                boxShadow: '0 15px 30px rgba(250, 140, 22, 0.15), 0 8px 20px rgba(0, 0, 0, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.8)'
              }}
            >
              {/* 装饰光效 */}
              <div 
                className="absolute top-0 right-0 w-20 h-20 opacity-25 pointer-events-none"
                style={{
                  background: 'radial-gradient(circle, rgba(250, 140, 22, 0.3) 0%, transparent 70%)',
                  filter: 'blur(12px)'
                }}
              />
              
              <div className="flex items-center mb-8 relative z-10">
                <div 
                  className="w-14 h-14 rounded-xl flex items-center justify-center mr-5 shadow-sm"
                  style={{
                    background: 'linear-gradient(135deg, rgba(250, 140, 22, 0.25), rgba(250, 140, 22, 0.15))',
                    border: '2px solid rgba(250, 140, 22, 0.35)',
                    boxShadow: '0 6px 15px rgba(250, 140, 22, 0.3)'
                  }}
                >
                  <SearchOutlined className="text-orange-500 text-xl" />
                </div>
                <Text className="text-gray-800 text-lg font-bold">选择搜索引擎</Text>
              </div>
              
              <div className="mb-8">
                <Select
                  mode="multiple"
                  className="w-full premium-select"
                  defaultValue={['bing']}
                  options={searchEngineOptions}
                  placeholder="请选择搜索引擎"
                  style={{ minHeight: '52px' }}
                  optionRender={(option) => (
                    <div className="flex items-center space-x-3 py-2 px-1">
                      <span className="text-lg">{option.data?.icon}</span>
                      <span className="text-gray-800 font-medium">{option.label}</span>
                    </div>
                  )}
                  tagRender={(props) => {
                    const { label, closable, onClose } = props;
                    const option = searchEngineOptions.find(opt => opt.label === label);
                    return (
                      <Tag
                        closable={closable}
                        onClose={onClose}
                        style={{
                          background: 'linear-gradient(135deg, #fa8c1615, #fa8c1608)',
                          border: '1px solid #fa8c1630',
                          borderRadius: '8px',
                          color: '#fa8c16',
                          fontWeight: '600',
                          fontSize: '12px',
                          padding: '4px 8px',
                          margin: '2px',
                          display: 'inline-flex',
                          alignItems: 'center'
                        }}
                      >
                        {option?.icon && <span className="mr-1">{option.icon}</span>}
                        {label}
                      </Tag>
                    );
                  }}
                />
              </div>
              
              <div 
                className="p-4 rounded-xl border"
                style={{
                  background: 'rgba(250, 140, 22, 0.06)',
                  border: '1px solid rgba(250, 140, 22, 0.15)'
                }}
              >
                <Text className="text-gray-600 text-sm leading-relaxed">
                  🌟 可同时启用多个搜索引擎，系统将并行搜索并合并结果，提供更全面的信息覆盖
                </Text>
              </div>
            </div>
          </ModernCard>

          {/* 高级检索配置 */}
          <ModernCard 
            title="高级检索配置" 
            icon="🎯"
            accentColor="#722ed1"
          >
            <div 
              className="mt-8 p-6 rounded-2xl border relative overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, rgba(114, 46, 209, 0.08) 0%, rgba(114, 46, 209, 0.04) 30%, rgba(255, 255, 255, 0.98) 70%, rgba(248, 250, 252, 0.95) 100%)',
                border: '1px solid rgba(114, 46, 209, 0.25)',
                backdropFilter: 'blur(20px)',
                boxShadow: '0 15px 30px rgba(114, 46, 209, 0.15), 0 8px 20px rgba(0, 0, 0, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.8)'
              }}
            >
              {/* 装饰光效 */}
              <div 
                className="absolute top-0 right-0 w-20 h-20 opacity-25 pointer-events-none"
                style={{
                  background: 'radial-gradient(circle, rgba(114, 46, 209, 0.3) 0%, transparent 70%)',
                  filter: 'blur(12px)'
                }}
              />
              
              <div className="flex items-center mb-8 relative z-10">
                <div 
                  className="w-14 h-14 rounded-xl flex items-center justify-center mr-5 shadow-sm"
                  style={{
                    background: 'linear-gradient(135deg, rgba(114, 46, 209, 0.25), rgba(114, 46, 209, 0.15))',
                    border: '2px solid rgba(114, 46, 209, 0.35)',
                    boxShadow: '0 6px 15px rgba(114, 46, 209, 0.3)'
                  }}
                >
                  <BulbOutlined className="text-purple-500 text-xl" />
                </div>
                <Text className="text-gray-800 text-lg font-bold">查询重写策略</Text>
              </div>
              
              <div className="mb-8">
                <Select
                  className="w-full premium-select"
                  defaultValue="hyde"
                  style={{ minHeight: '52px' }}
                  options={[
                    { 
                      value: 'hyde', 
                      label: 'HyDE (Hypothetical Document Embeddings)'
                    },
                    { 
                      value: 'query-expansion', 
                      label: '查询扩展'
                    },
                    { 
                      value: 'query-reformulation', 
                      label: '查询重构'
                    },
                  ]}
                  optionRender={(option) => (
                    <div className="py-3 px-1">
                      <div className="font-bold text-gray-800 mb-1">
                        {option.value === 'hyde' && '🔮 '}
                        {option.value === 'query-expansion' && '📈 '}
                        {option.value === 'query-reformulation' && '🔄 '}
                        {option.label}
                      </div>
                      <div className="text-sm text-gray-600">
                        {option.value === 'hyde' && '生成假设文档，提升检索精度'}
                        {option.value === 'query-expansion' && '扩展查询词汇，增加召回率'}
                        {option.value === 'query-reformulation' && '重构查询结构，优化语义匹配'}
                      </div>
                    </div>
                  )}
                />
              </div>
              
              <div 
                className="p-4 rounded-xl border"
                style={{
                  background: 'rgba(114, 46, 209, 0.06)',
                  border: '1px solid rgba(114, 46, 209, 0.15)'
                }}
              >
                <Text className="text-gray-600 text-sm leading-relaxed">
                  🚀 选择合适的查询重写策略，系统将智能优化查询语句以获得更准确的检索结果
                </Text>
              </div>
            </div>
          </ModernCard>
        </div>
      </div>

      {/* 优化的样式 */}
      <style>{`
        .modern-card {
          position: relative;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .modern-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.12), 0 8px 16px rgba(0, 0, 0, 0.08) !important;
        }
        
                 .premium-select .ant-select-selector {
           background: rgba(255, 255, 255, 0.95) !important;
           border: 2px solid rgba(0, 0, 0, 0.08) !important;
           border-radius: 16px !important;
           transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
           box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05) !important;
           backdrop-filter: blur(10px) !important;
         }
         
         .premium-select .ant-select-selector:hover {
           border-color: rgba(24, 144, 255, 0.4) !important;
           box-shadow: 0 8px 20px rgba(24, 144, 255, 0.12) !important;
           transform: translateY(-1px) !important;
         }
         
         .premium-select.ant-select-focused .ant-select-selector {
           border-color: #1890ff !important;
           box-shadow: 0 0 0 4px rgba(24, 144, 255, 0.12), 0 8px 20px rgba(24, 144, 255, 0.15) !important;
         }
         
         .premium-select .ant-select-selection-overflow {
           padding: 4px 8px !important;
         }
         
         .premium-select-large .ant-select-selector {
           background: rgba(255, 255, 255, 0.98) !important;
           border: 2px solid rgba(0, 0, 0, 0.06) !important;
           border-radius: 20px !important;
           transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
           box-shadow: 0 6px 20px rgba(0, 0, 0, 0.06) !important;
           backdrop-filter: blur(20px) !important;
           font-size: 15px !important;
         }
         
         .premium-select-large .ant-select-selector:hover {
           border-color: rgba(24, 144, 255, 0.5) !important;
           box-shadow: 0 12px 30px rgba(24, 144, 255, 0.15) !important;
           transform: translateY(-2px) !important;
         }
         
         .premium-select-large.ant-select-focused .ant-select-selector {
           border-color: #1890ff !important;
           box-shadow: 0 0 0 6px rgba(24, 144, 255, 0.15), 0 12px 30px rgba(24, 144, 255, 0.2) !important;
         }
         
         .premium-select-large .ant-select-selection-overflow {
           padding: 12px 16px !important;
           gap: 8px !important;
         }
         
         .premium-select-large .ant-select-selection-search {
           margin-inline-start: 8px !important;
         }
        
        .premium-select .ant-select-selection-item-remove {
          color: inherit !important;
          opacity: 0.7 !important;
          transition: opacity 0.2s !important;
        }
        
        .premium-select .ant-select-selection-item-remove:hover {
          opacity: 1 !important;
        }
        
        .ant-select-dropdown {
          border-radius: 16px !important;
          box-shadow: 0 12px 32px rgba(0, 0, 0, 0.12) !important;
          border: 1px solid rgba(0, 0, 0, 0.06) !important;
          backdrop-filter: blur(20px) !important;
        }
        
        .ant-select-item {
          border-radius: 8px !important;
          margin: 2px 4px !important;
          transition: all 0.2s !important;
        }
        
        .ant-select-item:hover {
          background: rgba(24, 144, 255, 0.08) !important;
        }
        
        .ant-select-item-option-selected {
          background: rgba(24, 144, 255, 0.12) !important;
          color: #1890ff !important;
          font-weight: 600 !important;
        }
      `}</style>
    </div>
  );
};

export default BasicSettings;