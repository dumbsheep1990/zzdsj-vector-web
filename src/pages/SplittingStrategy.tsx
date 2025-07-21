import React, { useState, useEffect } from 'react';
import { Plus, Settings, Edit, Save, Trash2, Copy, RotateCcw, Zap, Brain, Grid, Clock } from 'lucide-react';
import PageHeader from '../components/layout/PageHeader';
import { useAppContext } from '../context/AppContext';
import { Modal, Form, Input, InputNumber, Select, Switch, Card, Tabs, Button, Tag, message, Tooltip } from 'antd';

const { TabPane } = Tabs;
const { TextArea } = Input;

// 切分策略类型定义
interface SplittingStrategy {
  id: string;
  name: string;
  description: string;
  type: 'system' | 'custom';
  parameters: {
    chunk_size: number;
    chunk_overlap: number;
    separator?: string;
    preserve_structure?: boolean;
    enable_semantic_splitting?: boolean;
  };
  created_at: string;
  updated_at: string;
  usage_count: number;
  tags: string[];
}

// 默认系统模版
const systemTemplates: SplittingStrategy[] = [
  {
    id: 'basic',
    name: '基础切分',
    description: '适用于通用文档的标准切分策略，按固定大小进行分块',
    type: 'system',
    parameters: {
      chunk_size: 1000,
      chunk_overlap: 200,
      separator: '\n\n',
      preserve_structure: false,
      enable_semantic_splitting: false
    },
    created_at: '2024-01-01',
    updated_at: '2024-01-01',
    usage_count: 245,
    tags: ['通用', '基础']
  },
  {
    id: 'semantic',
    name: '语义切分',
    description: '基于语义边界进行智能切分，保持内容的语义完整性',
    type: 'system',
    parameters: {
      chunk_size: 800,
      chunk_overlap: 100,
      separator: '',
      preserve_structure: true,
      enable_semantic_splitting: true
    },
    created_at: '2024-01-01',
    updated_at: '2024-01-01',
    usage_count: 156,
    tags: ['语义', '智能']
  },
  {
    id: 'intelligent',
    name: '智能切分',
    description: '结合多种策略的智能切分，根据文档类型自动调整参数',
    type: 'system',
    parameters: {
      chunk_size: 1200,
      chunk_overlap: 150,
      separator: '',
      preserve_structure: true,
      enable_semantic_splitting: true
    },
    created_at: '2024-01-01',
    updated_at: '2024-01-01',
    usage_count: 89,
    tags: ['智能', '自适应']
  }
];

const SplittingStrategy: React.FC = () => {
  const { state } = useAppContext();
  const [strategies, setStrategies] = useState<SplittingStrategy[]>([]);
  const [customStrategies, setCustomStrategies] = useState<SplittingStrategy[]>([]);
  const [activeTab, setActiveTab] = useState<string>('system');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingStrategy, setEditingStrategy] = useState<SplittingStrategy | null>(null);
  const [form] = Form.useForm();

  // 加载数据
  useEffect(() => {
    loadStrategies();
  }, []);

  const loadStrategies = async () => {
    // 模拟加载自定义策略
    const mockCustomStrategies: SplittingStrategy[] = [
      {
        id: 'custom_1',
        name: '长文档策略',
        description: '适用于长文档的自定义切分策略',
        type: 'custom',
        parameters: {
          chunk_size: 1500,
          chunk_overlap: 300,
          separator: '\n\n',
          preserve_structure: true,
          enable_semantic_splitting: false
        },
        created_at: '2024-01-15',
        updated_at: '2024-01-15',
        usage_count: 12,
        tags: ['长文档', '自定义']
      },
      {
        id: 'custom_2',
        name: '代码文档策略',
        description: '专门用于代码文档的切分策略',
        type: 'custom',
        parameters: {
          chunk_size: 600,
          chunk_overlap: 50,
          separator: '\n```\n',
          preserve_structure: true,
          enable_semantic_splitting: false
        },
        created_at: '2024-01-20',
        updated_at: '2024-01-20',
        usage_count: 8,
        tags: ['代码', '技术文档']
      }
    ];
    
    setStrategies(systemTemplates);
    setCustomStrategies(mockCustomStrategies);
  };

  // 创建新策略
  const handleCreateStrategy = () => {
    setEditingStrategy(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  // 编辑策略
  const handleEditStrategy = (strategy: SplittingStrategy) => {
    if (strategy.type === 'system') {
      message.warning('系统模版不能直接编辑，可以复制后创建自定义策略');
      return;
    }
    setEditingStrategy(strategy);
    form.setFieldsValue({
      name: strategy.name,
      description: strategy.description,
      chunk_size: strategy.parameters.chunk_size,
      chunk_overlap: strategy.parameters.chunk_overlap,
      separator: strategy.parameters.separator,
      preserve_structure: strategy.parameters.preserve_structure,
      enable_semantic_splitting: strategy.parameters.enable_semantic_splitting,
      tags: strategy.tags
    });
    setIsModalVisible(true);
  };

  // 复制策略
  const handleCopyStrategy = (strategy: SplittingStrategy) => {
    setEditingStrategy(null);
    form.setFieldsValue({
      name: `${strategy.name} - 副本`,
      description: strategy.description,
      chunk_size: strategy.parameters.chunk_size,
      chunk_overlap: strategy.parameters.chunk_overlap,
      separator: strategy.parameters.separator,
      preserve_structure: strategy.parameters.preserve_structure,
      enable_semantic_splitting: strategy.parameters.enable_semantic_splitting,
      tags: [...strategy.tags, '复制']
    });
    setIsModalVisible(true);
  };

  // 删除策略
  const handleDeleteStrategy = (strategy: SplittingStrategy) => {
    if (strategy.type === 'system') {
      message.error('系统模版不能删除');
      return;
    }
    
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除策略"${strategy.name}"吗？此操作不可撤销。`,
      onOk: () => {
        setCustomStrategies(prev => prev.filter(s => s.id !== strategy.id));
        message.success('策略删除成功');
      }
    });
  };

  // 保存策略
  const handleSaveStrategy = async (values: any) => {
    try {
      const newStrategy: SplittingStrategy = {
        id: editingStrategy?.id || `custom_${Date.now()}`,
        name: values.name,
        description: values.description,
        type: 'custom',
        parameters: {
          chunk_size: values.chunk_size,
          chunk_overlap: values.chunk_overlap,
          separator: values.separator || '\n\n',
          preserve_structure: values.preserve_structure || false,
          enable_semantic_splitting: values.enable_semantic_splitting || false
        },
        created_at: editingStrategy?.created_at || new Date().toISOString(),
        updated_at: new Date().toISOString(),
        usage_count: editingStrategy?.usage_count || 0,
        tags: values.tags || []
      };

      if (editingStrategy) {
        setCustomStrategies(prev => prev.map(s => s.id === editingStrategy.id ? newStrategy : s));
        message.success('策略更新成功');
      } else {
        setCustomStrategies(prev => [...prev, newStrategy]);
        message.success('策略创建成功');
      }

      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      message.error('保存失败');
    }
  };

  // 获取策略类型图标
  const getStrategyIcon = (strategy: SplittingStrategy) => {
    if (strategy.parameters.enable_semantic_splitting) {
      return <Brain className="w-5 h-5 text-purple-500" />;
    } else if (strategy.name.includes('智能')) {
      return <Zap className="w-5 h-5 text-yellow-500" />;
    } else {
      return <Grid className="w-5 h-5 text-blue-500" />;
    }
  };

  // 渲染精致小卡片
  const renderStrategyCard = (strategy: SplittingStrategy) => (
    <div
      key={strategy.id}
      className="group relative bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-xl hover:border-blue-200 transition-all duration-300 overflow-hidden"
    >
      {/* 顶部装饰条 */}
      <div className={`h-1 w-full ${
        strategy.type === 'system' 
          ? 'bg-gradient-to-r from-blue-400 to-blue-600' 
          : 'bg-gradient-to-r from-green-400 to-green-600'
      }`} />
      
      {/* 卡片主体内容 */}
      <div className="p-5">
        {/* 头部区域 */}
        <div className="flex items-start justify-between mb-4 pb-4 border-b border-gray-50">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg transition-colors duration-300 ${
              strategy.type === 'system' 
                ? 'bg-blue-50 group-hover:bg-blue-100' 
                : 'bg-green-50 group-hover:bg-green-100'
            }`}>
              {getStrategyIcon(strategy)}
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-800 text-lg mb-1 line-clamp-1">{strategy.name}</h3>
              <Tag 
                color={strategy.type === 'system' ? 'blue' : 'green'} 
                className="text-xs font-medium"
              >
                {strategy.type === 'system' ? '系统模版' : '自定义'}
              </Tag>
            </div>
          </div>
          
          {/* 操作按钮 */}
          <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Tooltip 
              title="复制策略"
              overlayStyle={{ 
                backgroundColor: '#374151 !important', 
                borderRadius: '8px !important',
                fontSize: '12px !important',
                padding: '6px 10px !important',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15) !important',
                border: 'none !important'
              }}
              overlayInnerStyle={{
                color: '#ffffff !important',
                backgroundColor: 'transparent !important',
                padding: '0 !important',
                margin: '0 !important'
              }}
              overlayClassName="custom-tooltip"
              placement="top"
            >
              <Button 
                type="text" 
                size="small" 
                icon={<Copy size={14} />}
                className="hover:bg-blue-50 hover:text-blue-600 rounded-lg"
                onClick={() => handleCopyStrategy(strategy)}
              />
            </Tooltip>
            {strategy.type === 'custom' && (
              <>
                <Tooltip 
                  title="编辑策略"
                  overlayStyle={{ 
                    backgroundColor: '#374151 !important', 
                    borderRadius: '8px !important',
                    fontSize: '12px !important',
                    padding: '6px 10px !important',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15) !important',
                    border: 'none !important'
                  }}
                  overlayInnerStyle={{
                    color: '#ffffff !important',
                    backgroundColor: 'transparent !important',
                    padding: '0 !important',
                    margin: '0 !important'
                  }}
                  overlayClassName="custom-tooltip"
                  placement="top"
                >
                  <Button 
                    type="text" 
                    size="small" 
                    icon={<Edit size={14} />}
                    className="hover:bg-green-50 hover:text-green-600 rounded-lg"
                    onClick={() => handleEditStrategy(strategy)}
                  />
                </Tooltip>
                <Tooltip 
                  title="删除策略"
                  overlayStyle={{ 
                    backgroundColor: '#374151 !important', 
                    borderRadius: '8px !important',
                    fontSize: '12px !important',
                    padding: '6px 10px !important',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15) !important',
                    border: 'none !important'
                  }}
                  overlayInnerStyle={{
                    color: '#ffffff !important',
                    backgroundColor: 'transparent !important',
                    padding: '0 !important',
                    margin: '0 !important'
                  }}
                  overlayClassName="custom-tooltip"
                  placement="top"
                >
                  <Button 
                    type="text" 
                    size="small" 
                    danger
                    icon={<Trash2 size={14} />}
                    className="hover:bg-red-50 rounded-lg"
                    onClick={() => handleDeleteStrategy(strategy)}
                  />
                </Tooltip>
              </>
            )}
          </div>
        </div>

        {/* 描述区域 */}
        <div className="mb-4 p-3 bg-gray-50 rounded-lg border-l-4 border-gray-200">
          <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
            {strategy.description}
          </p>
        </div>

        {/* 参数配置区域 */}
        <div className="mb-4">
          <div className="flex items-center mb-3">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-sm font-medium text-gray-700">配置参数</span>
            </div>
            <div className="flex-1 h-px bg-gray-200 ml-3"></div>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-3 rounded-lg border border-blue-100">
              <div className="flex items-center space-x-2 mb-1">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                <div className="text-xs text-blue-700 font-semibold">分块大小</div>
              </div>
              <div className="text-sm font-bold text-blue-800">{strategy.parameters.chunk_size} 字符</div>
            </div>
            
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-3 rounded-lg border border-green-100">
              <div className="flex items-center space-x-2 mb-1">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                <div className="text-xs text-green-700 font-semibold">重叠大小</div>
              </div>
              <div className="text-sm font-bold text-green-800">{strategy.parameters.chunk_overlap} 字符</div>
            </div>
            
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-3 rounded-lg border border-purple-100">
              <div className="flex items-center space-x-2 mb-1">
                <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                <div className="text-xs text-purple-700 font-semibold">保持结构</div>
              </div>
              <div className="text-sm font-bold text-purple-800">
                {strategy.parameters.preserve_structure ? '是' : '否'}
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-3 rounded-lg border border-orange-100">
              <div className="flex items-center space-x-2 mb-1">
                <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
                <div className="text-xs text-orange-700 font-semibold">语义切分</div>
              </div>
              <div className="text-sm font-bold text-orange-800">
                {strategy.parameters.enable_semantic_splitting ? '启用' : '禁用'}
              </div>
            </div>
          </div>
        </div>

        {/* 标签区域 */}
        {strategy.tags.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center mb-2">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                <span className="text-sm font-medium text-gray-700">标签</span>
              </div>
              <div className="flex-1 h-px bg-gray-200 ml-3"></div>
            </div>
            <div className="flex flex-wrap gap-1">
              {strategy.tags.slice(0, 3).map(tag => (
                <Tag key={tag} color="default" className="text-xs px-2 py-0.5 rounded-full bg-gray-100 border-gray-200">
                  {tag}
                </Tag>
              ))}
              {strategy.tags.length > 3 && (
                <Tooltip 
                  title={strategy.tags.slice(3).join(', ')}
                  overlayStyle={{ 
                    backgroundColor: '#374151 !important', 
                    borderRadius: '8px !important',
                    fontSize: '12px !important',
                    padding: '6px 10px !important',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15) !important',
                    border: 'none !important'
                  }}
                  overlayInnerStyle={{
                    color: '#ffffff !important',
                    backgroundColor: 'transparent !important',
                    padding: '0 !important',
                    margin: '0 !important'
                  }}
                  overlayClassName="custom-tooltip"
                  placement="top"
                >
                  <Tag className="text-xs px-2 py-0.5 rounded-full bg-gray-100 border-gray-200 cursor-help">
                    +{strategy.tags.length - 3}
                  </Tag>
                </Tooltip>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 底部状态栏 */}
      <div className="px-5 py-3 bg-gray-50 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Clock size={12} className="text-gray-400" />
            <span className="text-xs text-gray-500">使用 {strategy.usage_count} 次</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className={`w-2 h-2 rounded-full ${
              strategy.usage_count > 100 ? 'bg-green-400' : 
              strategy.usage_count > 50 ? 'bg-yellow-400' : 'bg-gray-400'
            }`}></div>
            <span className="text-xs text-gray-500">
              {strategy.usage_count > 100 ? '热门' : 
               strategy.usage_count > 50 ? '常用' : '普通'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <style>
        {`
          .custom-tooltip {
            background-color: #374151 !important;
            border: none !important;
            border-radius: 8px !important;
          }
          .custom-tooltip .ant-tooltip-inner {
            background-color: #374151 !important;
            color: #ffffff !important;
            font-size: 12px !important;
            padding: 6px 10px !important;
            border-radius: 8px !important;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
          }
          .custom-tooltip .ant-tooltip-arrow {
            border-top-color: #374151 !important;
            border-bottom-color: #374151 !important;
          }
          .custom-tooltip .ant-tooltip-arrow::before {
            background: #374151 !important;
          }
        `}
      </style>
      <div className="flex-1 flex flex-col bg-gray-50">
      <PageHeader
        parentTitle="知识库管理"
        title="切分策略"
        description="管理文档切分策略，支持系统默认模版和用户自定义策略配置"
        primaryActions={[
          {
            icon: <Plus size={20} />,
            label: '新建策略',
            onClick: handleCreateStrategy
          }
        ]}
        secondaryActions={[
          {
            icon: <Settings size={20} />,
            label: '设置',
            onClick: () => console.log('设置')
          }
        ]}
        username={state.username || '管理员'}
      />

      <div className="flex-1 p-6">
        <Tabs activeKey={activeTab} onChange={setActiveTab} className="custom-tabs">
          <TabPane tab={`系统模版 (${strategies.length})`} key="system">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6">
              {strategies.map(renderStrategyCard)}
            </div>
          </TabPane>
          
          <TabPane tab={`自定义策略 (${customStrategies.length})`} key="custom">
            {customStrategies.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6">
                {customStrategies.map(renderStrategyCard)}
              </div>
            ) : (
              <div className="text-center py-20 mt-6">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Plus className="w-8 h-8 text-gray-400" />
                </div>
                <div className="text-gray-500 mb-4 text-lg">还没有自定义策略</div>
                <div className="text-gray-400 text-sm mb-6">创建自定义策略来满足特定的文档处理需求</div>
                <Button 
                  type="primary" 
                  icon={<Plus />} 
                  onClick={handleCreateStrategy}
                  size="large"
                  className="px-8"
                >
                  创建第一个自定义策略
                </Button>
              </div>
            )}
          </TabPane>
        </Tabs>
      </div>

      {/* 创建/编辑策略模态框 */}
      <Modal
        title={
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              {editingStrategy ? <Edit size={16} className="text-blue-600" /> : <Plus size={16} className="text-blue-600" />}
            </div>
            <span>{editingStrategy ? '编辑切分策略' : '创建切分策略'}</span>
          </div>
        }
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={700}
        className="custom-modal"
        styles={{
          mask: {
            backgroundColor: 'rgba(0, 0, 0, 0.45)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)'
          },
          content: {
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1), 0 8px 16px rgba(0, 0, 0, 0.05)'
          }
        }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSaveStrategy}
          initialValues={{
            chunk_size: 1000,
            chunk_overlap: 200,
            separator: '\n\n',
            preserve_structure: false,
            enable_semantic_splitting: false
          }}
          className="mt-6"
        >
          <Form.Item
            name="name"
            label="策略名称"
            rules={[{ required: true, message: '请输入策略名称' }]}
          >
            <Input placeholder="输入策略名称" size="large" />
          </Form.Item>

          <Form.Item
            name="description"
            label="策略描述"
            rules={[{ required: true, message: '请输入策略描述' }]}
          >
            <TextArea placeholder="输入策略描述" rows={3} size="large" />
          </Form.Item>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              name="chunk_size"
              label="分块大小 (字符)"
              rules={[{ required: true, message: '请输入分块大小' }]}
            >
              <InputNumber
                min={100}
                max={5000}
                step={100}
                placeholder="1000"
                className="w-full"
                size="large"
              />
            </Form.Item>

            <Form.Item
              name="chunk_overlap"
              label="重叠大小 (字符)"
              rules={[{ required: true, message: '请输入重叠大小' }]}
            >
              <InputNumber
                min={0}
                max={1000}
                step={50}
                placeholder="200"
                className="w-full"
                size="large"
              />
            </Form.Item>
          </div>

          <Form.Item
            name="separator"
            label="分隔符"
          >
            <Select placeholder="选择分隔符" size="large">
              <Select.Option value="\n\n">段落分隔 (\n\n)</Select.Option>
              <Select.Option value="\n">换行分隔 (\n)</Select.Option>
              <Select.Option value=". ">句号分隔 (. )</Select.Option>
              <Select.Option value="">自动识别</Select.Option>
            </Select>
          </Form.Item>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              name="preserve_structure"
              label="保持文档结构"
              valuePropName="checked"
            >
              <Switch size="default" />
            </Form.Item>

            <Form.Item
              name="enable_semantic_splitting"
              label="启用语义切分"
              valuePropName="checked"
            >
              <Switch size="default" />
            </Form.Item>
          </div>

          <Form.Item
            name="tags"
            label="标签"
          >
            <Select
              mode="tags"
              placeholder="输入标签"
              tokenSeparators={[',']}
              size="large"
            />
          </Form.Item>

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
            <Button onClick={() => setIsModalVisible(false)} size="large">
              取消
            </Button>
            <Button 
              type="primary" 
              htmlType="submit" 
              icon={<Save />} 
              size="large"
              className="px-8"
            >
              {editingStrategy ? '更新' : '创建'}
            </Button>
          </div>
        </Form>
      </Modal>
      </div>
    </>
  );
};

export default SplittingStrategy; 