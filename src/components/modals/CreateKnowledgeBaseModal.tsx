import React, { useState, useEffect } from 'react';
import { Form, Input, Select, Tag, Button, Radio, Tooltip, Switch, Card, Space, Divider } from 'antd';
import { PlusOutlined, QuestionCircleOutlined, DatabaseOutlined, SettingOutlined, TagsOutlined, ShareAltOutlined, RocketOutlined, BulbOutlined } from '@ant-design/icons';
import { Database, Layers, Network, Search, Sparkles, Brain } from 'lucide-react';
import GlassmorphismModal from './GlassmorphismModal';
import './GlassmorphismStyles.css';

// 现代化样式配置
const styles = {
  formContainer: {
    width: '100%',
    background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
    borderRadius: '12px',
    padding: '24px',
  },
  sectionCard: {
    borderRadius: '16px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
    border: 'none',
    marginBottom: '20px',
  },
  basicInfoCard: {
    background: 'linear-gradient(135deg, #e0f2fe 0%, #b3e5fc 100%)',
  },
  templateCard: {
    background: 'linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%)',
  },
  indexCard: {
    background: 'linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%)',
  },
  tagsCard: {
    background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
  },
  advancedCard: {
    background: 'linear-gradient(135deg, #fff3e0 0%, #ffcc80 100%)',
  },
  cardHeader: {
    background: 'transparent',
    border: 'none',
    fontSize: '16px',
    fontWeight: 600,
  },
  inputStyle: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    border: '2px solid rgba(255, 255, 255, 0.8)',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
    fontSize: '14px',
  },
  textAreaStyle: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    border: '2px solid rgba(255, 255, 255, 0.8)',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
    fontSize: '14px',
  },
  selectStyle: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: '8px',
  },
  templateButton: {
    borderRadius: '12px',
    border: '2px solid rgba(255, 255, 255, 0.8)',
    background: 'rgba(255, 255, 255, 0.7)',
    color: '#374151',
    fontWeight: 500,
    height: '48px',
    marginBottom: '8px',
    transition: 'all 0.3s ease',
    boxShadow: 'none',
  },
  templateButtonActive: {
    borderRadius: '12px',
    border: '2px solid #667eea',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    fontWeight: 500,
    height: '48px',
    marginBottom: '8px',
    transition: 'all 0.3s ease',
    boxShadow: 'none',
  },
  knowledgeGraphToggle: {
    background: 'linear-gradient(135deg, #ff6b6b 0%, #feca57 100%)',
    borderRadius: '16px',
    padding: '20px',
    border: '2px solid rgba(255, 255, 255, 0.8)',
  },
  primaryButton: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    borderColor: 'transparent',
    color: 'white',
    borderRadius: '12px',
    height: '48px',
    fontSize: '16px',
    fontWeight: 600,
    boxShadow: '0 8px 25px rgba(102, 126, 234, 0.4)',
    minWidth: '140px',
  },
  cancelButton: {
    borderRadius: '12px',
    backgroundColor: '#f8f9fa',
    borderColor: '#e9ecef',
    color: '#6c757d',
    height: '48px',
    fontSize: '16px',
    fontWeight: 500,
    minWidth: '120px',
  },
  modalTitle: {
    display: 'flex',
    alignItems: 'center',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    fontSize: '20px',
    fontWeight: 700,
  },
  sectionIcon: {
    fontSize: '20px',
    marginRight: '12px',
  }
};

// 行业模板选项 - 添加图标和颜色
const industryTemplates = [
  { label: '政策文档模版', value: 'policy', icon: <DatabaseOutlined />, color: '#1890ff' },
  { label: '法律文书模版', value: 'legal', icon: <SettingOutlined />, color: '#722ed1' },
  { label: '医疗文献模版', value: 'medical', icon: <BulbOutlined />, color: '#13c2c2' },
  { label: '技术文档模版', value: 'technical', icon: <RocketOutlined />, color: '#52c41a' },
  { label: '学术论文模版', value: 'academic', icon: <ShareAltOutlined />, color: '#fa8c16' }
];

// 政务服务模板选项
const governmentTemplates = [
  { label: '综合政务服务', value: 'general_gov', icon: <DatabaseOutlined />, color: '#1890ff' },
  { label: '公文处理模版', value: 'documents', icon: <SettingOutlined />, color: '#722ed1' },
  { label: '政策解读模版', value: 'policy_explain', icon: <BulbOutlined />, color: '#13c2c2' }
];

// 通用模板选项
const generalTemplates = [
  { label: '通用数据知识库', value: 'general_data', icon: <DatabaseOutlined />, color: '#1890ff' },
  { label: '问答知识库', value: 'qa_base', icon: <ShareAltOutlined />, color: '#52c41a' },
  { label: '综合资料库', value: 'resource_base', icon: <TagsOutlined />, color: '#fa8c16' }
];

// 索引构建方式选项 - 更新为向量数据库特定的索引类型
const indexMethods = [
  { 
    label: 'HNSW', 
    value: 'hnsw', 
    description: '分层可导航小世界图，适合高维向量检索，精度高',
    icon: <Layers size={18} />,
    color: '#667eea',
    performance: '高精度',
    speed: '中等'
  },
  { 
    label: 'IVF_FLAT', 
    value: 'ivf_flat', 
    description: '倒排文件索引，平衡精度和速度',
    icon: <Network size={18} />,
    color: '#52c41a',
    performance: '平衡',
    speed: '快速'
  },
  { 
    label: 'IVF_PQ', 
    value: 'ivf_pq', 
    description: '倒排文件+乘积量化，内存效率高',
    icon: <Database size={18} />,
    color: '#fa8c16',
    performance: '中等',
    speed: '快速'
  },
  { 
    label: 'FLAT', 
    value: 'flat', 
    description: '暴力搜索，精度最高但速度慢',
    icon: <Search size={18} />,
    color: '#722ed1',
    performance: '最高',
    speed: '慢'
  },
  { 
    label: 'IVF_SQ8', 
    value: 'ivf_sq8', 
    description: '倒排文件+标量量化，压缩存储',
    icon: <Sparkles size={18} />,
    color: '#13c2c2',
    performance: '中等',
    speed: '快速'
  }
];

// 检索方式选项
const retrievalMethods = [
  { label: '语义检索(推荐)', value: 'semantic', icon: <Brain size={16} />, color: '#667eea' },
  { label: '全文检索', value: 'fulltext', icon: <Search size={16} />, color: '#52c41a' },
  { label: '混合检索', value: 'hybrid', icon: <Sparkles size={16} />, color: '#fa8c16' }
];

interface CreateKnowledgeBaseModalProps {
  open: boolean;
  onClose: () => void;
  onCreateKnowledgeBase: (values: any) => void;
}

const CreateKnowledgeBaseModal: React.FC<CreateKnowledgeBaseModalProps> = ({ open, onClose, onCreateKnowledgeBase }) => {
  const [form] = Form.useForm();
  const [tags, setTags] = useState<string[]>([]);
  const [inputVisible, setInputVisible] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [selectedTemplateType, setSelectedTemplateType] = useState<string>('industry');
  const [enableKnowledgeGraph, setEnableKnowledgeGraph] = useState<boolean>(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [selectedIndex, setSelectedIndex] = useState<string>('hnsw');
  const [selectedRetrieval, setSelectedRetrieval] = useState<string>('semantic');
  
  // 创建背景模糊效果
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [open]);

  // 处理取消
  const handleCancel = () => {
    form.resetFields();
    setTags([]);
    setEnableKnowledgeGraph(false);
    setSelectedTemplate('');
    setSelectedIndex('hnsw');
    setSelectedRetrieval('semantic');
    onClose();
  };
  
  // 处理提交
  const handleSubmit = () => {
    form.validateFields()
      .then(values => {
        onCreateKnowledgeBase({ 
          ...values, 
          tags,
          enableKnowledgeGraph 
        });
        form.resetFields();
        setTags([]);
        setEnableKnowledgeGraph(false);
        setSelectedTemplate('');
        setSelectedIndex('hnsw');
        setSelectedRetrieval('semantic');
        onClose();
      })
      .catch(error => {
        console.error('Validation failed:', error);
      });
  };
  
  // 处理添加标签
  const handleInputConfirm = () => {
    if (inputValue && tags.indexOf(inputValue) === -1) {
      setTags([...tags, inputValue]);
    }
    setInputVisible(false);
    setInputValue('');
  };
  
  // 处理删除标签
  const handleClose = (removedTag: string) => {
    const newTags = tags.filter(tag => tag !== removedTag);
    setTags(newTags);
  };
  
  // 自动生成标签
  const handleAutoGenerateTags = () => {
    const name = form.getFieldValue('name') || '';
    const description = form.getFieldValue('description') || '';
    
    if (name || description) {
      const generatedTags = [
        name.split(' ')[0], 
        description.split(' ')[0],
        '自动生成'
      ].filter(tag => tag && !tags.includes(tag));
      
      setTags([...tags, ...generatedTags]);
    }
  };

  // 渲染模板选项
  const renderTemplateOptions = () => {
    let templates: Array<{label: string; value: string; icon: React.ReactNode; color: string}> = [];
    switch (selectedTemplateType) {
      case 'industry':
        templates = industryTemplates;
        break;
      case 'government':
        templates = governmentTemplates;
        break;
      case 'general':
        templates = generalTemplates;
        break;
      default:
        templates = [];
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {templates.map(template => (
          <div
            key={template.value}
            className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
              selectedTemplate === template.value 
                ? 'border-blue-500 bg-gradient-to-r from-blue-50 to-indigo-50 shadow-md' 
                : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm hover:bg-gray-50'
            }`}
            onClick={() => {
              setSelectedTemplate(template.value);
              form.setFieldsValue({ templateId: template.value });
            }}
          >
            <div className="flex items-center mb-2">
              <span 
                style={{ 
                  color: selectedTemplate === template.value ? '#3b82f6' : template.color, 
                  fontSize: '18px' 
                }} 
                className="mr-2"
              >
                {template.icon}
              </span>
              <span className={`font-medium ${
                selectedTemplate === template.value ? 'text-blue-800' : 'text-gray-800'
              }`}>
                {template.label}
              </span>
            </div>
          </div>
        ))}
      </div>
    );
  };

  // 渲染索引方法选项
  const renderIndexOptions = () => {
    return (
      <div className="space-y-3">
        {indexMethods.map(method => (
          <div
            key={method.value}
            className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
              selectedIndex === method.value 
                ? 'border-blue-500 bg-gradient-to-r from-blue-50 to-indigo-50 shadow-md' 
                : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm hover:bg-gray-50'
            }`}
            onClick={() => {
              setSelectedIndex(method.value);
              form.setFieldsValue({ indexMethod: method.value });
            }}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center mb-2">
                  <span 
                    style={{ 
                      color: selectedIndex === method.value ? '#3b82f6' : method.color 
                    }} 
                    className="mr-3"
                  >
                    {method.icon}
                  </span>
                  <span className={`font-semibold text-lg ${
                    selectedIndex === method.value ? 'text-blue-800' : 'text-gray-800'
                  }`}>
                    {method.label}
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-3">{method.description}</p>
                <div className="flex space-x-4">
                  <div className="flex items-center">
                    <span className="text-xs text-gray-500 mr-1">精度:</span>
                    <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800">
                      {method.performance}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-xs text-gray-500 mr-1">速度:</span>
                    <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800">
                      {method.speed}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };
  
  // 自定义模态框标题
  const modalTitle = (
    <div style={styles.modalTitle}>
      <Sparkles size={24} className="mr-3" />
      <span>创建智能知识库</span>
    </div>
  );

  // 自定义模态框底部
  const modalFooter = (
    <div className="flex justify-end space-x-4 pt-6">
      <Button style={styles.cancelButton} onClick={handleCancel}>
        取消
      </Button>
      <Button style={styles.primaryButton} onClick={handleSubmit}>
        <Sparkles size={16} className="mr-2" />
        创建知识库
      </Button>
    </div>
  );

  return (
    <GlassmorphismModal
      open={open}
      onClose={handleCancel}
      title={modalTitle}
      width={900}
      footer={modalFooter}
      zIndex={1000}
    >
      <div style={styles.formContainer}>
        <Form form={form} layout="vertical">
          {/* 基础信息卡片 */}
          <Card 
            style={{...styles.sectionCard, ...styles.basicInfoCard}}
            title={
              <div className="flex items-center">
                <DatabaseOutlined style={{...styles.sectionIcon, color: '#1890ff'}} />
                <span>基础信息</span>
              </div>
            }
            headStyle={styles.cardHeader}
          >
            <Form.Item
              name="name"
              label={<span className="text-gray-700 font-medium">知识库名称</span>}
              rules={[{ required: true, message: '请输入知识库名称' }]}
            >
              <Input 
                placeholder="为您的知识库起一个响亮的名字" 
                style={styles.inputStyle}
                size="large"
              />
            </Form.Item>
            
            <Form.Item
              name="description"
              label={<span className="text-gray-700 font-medium">知识库简介</span>}
              rules={[{ required: true, message: '请输入知识库简介' }]}
            >
              <Input.TextArea 
                placeholder="请简要描述该知识库的内容和用途，这将帮助我们更好地优化检索效果"
                rows={4}
                style={styles.textAreaStyle}
              />
            </Form.Item>
          </Card>

          {/* 模板选择卡片 */}
          <Card 
            style={{...styles.sectionCard, ...styles.templateCard}}
            title={
              <div className="flex items-center">
                <SettingOutlined style={{...styles.sectionIcon, color: '#722ed1'}} />
                <span>模板配置</span>
              </div>
            }
            headStyle={styles.cardHeader}
          >
            <div className="mb-6">
              <div className="text-gray-700 font-medium mb-3">模板类型</div>
              <div className="w-full">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div 
                    className={`p-3 rounded-xl border-2 cursor-pointer transition-all duration-300 text-center ${
                      selectedTemplateType === 'industry' 
                        ? 'border-blue-500 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-800 shadow-md' 
                        : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:shadow-sm hover:bg-gray-50'
                    }`}
                    onClick={() => {
                      setSelectedTemplateType('industry');
                      setSelectedTemplate('');
                      form.setFieldsValue({ templateId: undefined });
                    }}
                  >
                    <span className="font-medium">行业特定模板</span>
                  </div>
                  <div 
                    className={`p-3 rounded-xl border-2 cursor-pointer transition-all duration-300 text-center ${
                      selectedTemplateType === 'government' 
                        ? 'border-blue-500 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-800 shadow-md' 
                        : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:shadow-sm hover:bg-gray-50'
                    }`}
                    onClick={() => {
                      setSelectedTemplateType('government');
                      setSelectedTemplate('');
                      form.setFieldsValue({ templateId: undefined });
                    }}
                  >
                    <span className="font-medium">政务服务模板</span>
                  </div>
                  <div 
                    className={`p-3 rounded-xl border-2 cursor-pointer transition-all duration-300 text-center ${
                      selectedTemplateType === 'general' 
                        ? 'border-blue-500 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-800 shadow-md' 
                        : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:shadow-sm hover:bg-gray-50'
                    }`}
                    onClick={() => {
                      setSelectedTemplateType('general');
                      setSelectedTemplate('');
                      form.setFieldsValue({ templateId: undefined });
                    }}
                  >
                    <span className="font-medium">通用场景模板</span>
                  </div>
                </div>
              </div>
            </div>

            <Form.Item
              name="templateId"
              label={
                <div className="flex items-center">
                  <span className="text-gray-700 font-medium">选择模板</span>
                  <Tooltip title="根据知识库用途选择合适的模板" overlayClassName="kb-tooltip" color="rgba(50, 50, 50, 0.95)" placement="top">
                    <QuestionCircleOutlined className="ml-2 text-gray-400" />
                  </Tooltip>
                </div>
              }
              rules={[{ required: true, message: '请选择知识库模板' }]}
            >
              <div>{renderTemplateOptions()}</div>
            </Form.Item>
          </Card>

          {/* 索引配置卡片 */}
          <Card 
            style={{...styles.sectionCard, ...styles.indexCard}}
            title={
              <div className="flex items-center">
                <RocketOutlined style={{...styles.sectionIcon, color: '#52c41a'}} />
                <span>索引配置</span>
              </div>
            }
            headStyle={styles.cardHeader}
          >
            <Form.Item
              name="indexMethod"
              label={
                <div className="flex items-center">
                  <span className="text-gray-700 font-medium">索引构建方式</span>
                  <Tooltip title="不同的索引方法提供不同的性能和检索特性，HNSW适合高精度检索，IVF系列适合大规模数据" overlayClassName="kb-tooltip" color="rgba(50, 50, 50, 0.95)" placement="top">
                    <QuestionCircleOutlined className="ml-2 text-gray-400" />
                  </Tooltip>
                </div>
              }
              rules={[{ required: true, message: '请选择索引构建方式' }]}
              initialValue="hnsw"
            >
              <div>{renderIndexOptions()}</div>
            </Form.Item>

          </Card>

          {/* 标签管理卡片 */}
          <Card 
            style={{...styles.sectionCard, ...styles.tagsCard}}
            title={
              <div className="flex items-center">
                <TagsOutlined style={{...styles.sectionIcon, color: '#f59e0b'}} />
                <span>标签管理</span>
              </div>
            }
            headStyle={styles.cardHeader}
          >
            <Form.Item
              label={
                <div className="flex items-center">
                  <span className="text-gray-700 font-medium">知识库标签</span>
                  <Tooltip title="为知识库添加标签，方便分类和查找" overlayClassName="kb-tooltip" color="rgba(50, 50, 50, 0.95)" placement="top">
                    <QuestionCircleOutlined className="ml-2 text-gray-400" />
                  </Tooltip>
                </div>
              }
            >
              <div className="p-4 rounded-xl bg-white border-2 border-gray-200">
                <div className="flex flex-wrap gap-2 mb-3">
                  {tags.map(tag => (
                    <Tag
                      key={tag}
                      closable
                      onClose={() => handleClose(tag)}
                      className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 border-blue-200"
                    >
                      {tag}
                    </Tag>
                  ))}
                  {inputVisible ? (
                    <Input
                      type="text"
                      size="small"
                      style={{ width: 100, ...styles.inputStyle }}
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onBlur={handleInputConfirm}
                      onPressEnter={handleInputConfirm}
                      autoFocus
                    />
                  ) : (
                    <Tag 
                      onClick={() => setInputVisible(true)} 
                      className="border-dashed border-gray-300 bg-gray-50 text-gray-600 cursor-pointer hover:border-blue-300 hover:text-blue-600"
                    >
                      <PlusOutlined className="mr-1" /> 添加标签
                    </Tag>
                  )}
                </div>
                <Button
                  type="link"
                  size="small"
                  onClick={handleAutoGenerateTags}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <Sparkles size={14} className="mr-1" />
                  智能生成标签
                </Button>
              </div>
            </Form.Item>
          </Card>

          {/* 高级功能卡片 */}
          <Card 
            style={{...styles.sectionCard, ...styles.advancedCard}}
            title={
              <div className="flex items-center">
                <BulbOutlined style={{...styles.sectionIcon, color: '#fa8c16'}} />
                <span>高级功能</span>
              </div>
            }
            headStyle={styles.cardHeader}
          >
            <Form.Item
              name="retrievalMethod"
              label={
                <div className="flex items-center">
                  <span className="text-gray-700 font-medium">检索方式</span>
                  <Tooltip title="选择适合你的知识库内容的检索方法" overlayClassName="kb-tooltip" color="rgba(50, 50, 50, 0.95)" placement="top">
                    <QuestionCircleOutlined className="ml-2 text-gray-400" />
                  </Tooltip>
                </div>
              }
              rules={[{ required: true, message: '请选择检索方式' }]}
              initialValue="semantic"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {retrievalMethods.map(method => (
                  <div
                    key={method.value}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                      selectedRetrieval === method.value 
                        ? 'border-blue-500 bg-gradient-to-r from-blue-50 to-indigo-50 shadow-md' 
                        : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm hover:bg-gray-50'
                    }`}
                    onClick={() => {
                      setSelectedRetrieval(method.value);
                      form.setFieldsValue({ retrievalMethod: method.value });
                    }}
                  >
                    <div className="flex items-center justify-center">
                      <span 
                        style={{ 
                          color: selectedRetrieval === method.value ? '#3b82f6' : method.color 
                        }} 
                        className="mr-2"
                      >
                        {method.icon}
                      </span>
                      <span className={`font-medium text-sm ${
                        selectedRetrieval === method.value ? 'text-blue-800' : 'text-gray-800'
                      }`}>
                        {method.label}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </Form.Item>

            <Form.Item
              name="enableKnowledgeGraph"
              label={
                <div className="flex items-center">
                  <span className="text-gray-700 font-medium">知识图谱</span>
                  <Tooltip title="启用后将自动分析文档内容并构建实体关系图谱，有助于知识发现和关联分析" overlayClassName="kb-tooltip" color="rgba(50, 50, 50, 0.95)" placement="top">
                    <QuestionCircleOutlined className="ml-2 text-gray-400" />
                  </Tooltip>
                </div>
              }
            >
              <div 
                className="flex items-center justify-between p-6 rounded-2xl border-2 border-orange-200"
                style={styles.knowledgeGraphToggle}
              >
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <Brain size={20} className="mr-2 text-white" />
                    <div className="text-white font-semibold text-lg">智能知识图谱</div>
                  </div>
                  <div className="text-white text-sm opacity-90">
                    自动识别实体关系，构建可视化知识网络，增强知识发现能力
                  </div>
                </div>
                <Switch
                  checked={enableKnowledgeGraph}
                  onChange={setEnableKnowledgeGraph}
                  className="ml-6"
                />
              </div>
            </Form.Item>
          </Card>
        </Form>
      </div>
    </GlassmorphismModal>
  );
};

export default CreateKnowledgeBaseModal;
