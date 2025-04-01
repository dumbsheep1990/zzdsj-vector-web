import React, { useState } from 'react';
import {
  Tabs, 
  Input, 
  Button,
  Modal,
  Form,
  Upload,
  Select,
  message,
  Typography
} from 'antd';
import { 
  ToolOutlined, 
  SearchOutlined, 
  UploadOutlined, 
  PlusOutlined,
  InboxOutlined,
  FileTextOutlined,
  CodeOutlined,
  TableOutlined,
  ApiOutlined
} from '@ant-design/icons';
import { useAppContext } from '../context/AppContext';
import ToolCard from '../components/modules/tools/ToolCard';
import PageHeader from '../components/layout/PageHeader';
import './DataProcessingTools.css'; // 导入自定义样式

const { TabPane } = Tabs;

// 定义工具类别类型
type ToolCategory = '数据爬取' | '数据清洗' | '数据格式化' | '数据集生成';

// 定义工具接口
interface Tool {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  category: ToolCategory;
  subCategory: string;
  tags: string[];
  usageCount: number;
  isFavorite: boolean;
}

// 预定义工具图标映射
const toolIcons: Record<string, React.ReactNode> = {
  // 数据爬取
  '常规爬取工具': <ToolOutlined />,
  '智能爬取工具': <ToolOutlined />,
  'LLM语义爬取': <ToolOutlined />,
  // 数据清洗
  '内容提取': <ToolOutlined />,
  '标签去除': <ToolOutlined />,
  '媒体文件识别': <ToolOutlined />,
  // 数据格式化
  'Markdown': <ToolOutlined />,
  'HTML': <ToolOutlined />,
  'TXT': <ToolOutlined />,
  // 数据集生成
  'JSONL': <ToolOutlined />,
  'Alpaca': <ToolOutlined />,
  'shareGPT': <ToolOutlined />,
  'QA问答': <ToolOutlined />
};

const DataProcessingTools: React.FC = () => {
  const { state } = useAppContext();
  const { sidebarExpanded } = state;
  
  // 工具数据
  const tools: Tool[] = [
    // 数据爬取
    {
      id: 'crawler-basic',
      name: '常规网页爬取工具',
      icon: toolIcons['常规爬取工具'],
      description: '高效的网页内容爬取工具，支持批量URL处理',
      category: '数据爬取' as ToolCategory,
      subCategory: '常规爬取工具',
      tags: ['网页', '爬虫', 'URL'],
      usageCount: 18456,
      isFavorite: false
    },
    {
      id: 'api-crawler',
      name: 'API接口数据爬取',
      icon: toolIcons['常规爬取工具'],
      description: '引导用户输入API地址和参数，获取并展示JSON/XML数据',
      category: '数据爬取' as ToolCategory,
      subCategory: '常规爬取工具',
      tags: ['API', 'JSON', 'XML'],
      usageCount: 12324,
      isFavorite: false
    },
    {
      id: 'crawler-intelligent',
      name: '智能网页解析器',
      icon: toolIcons['智能爬取工具'],
      description: '使用AI技术自动识别网页结构，无需配置即可智能提取网页中的主要内容、标题、图片等关键信息。',
      category: '数据爬取' as ToolCategory,
      subCategory: '智能爬取工具',
      tags: ['AI', '自动提取', '结构识别'],
      usageCount: 3521,
      isFavorite: false
    },
    {
      id: 'crawler-llm',
      name: 'LLM语义爬取助手',
      icon: toolIcons['LLM语义爬取'],
      description: '利用大语言模型理解网页内容，根据语义需求精准提取所需信息，解决复杂、非结构化内容的数据获取难题。',
      category: '数据爬取' as ToolCategory,
      subCategory: 'LLM语义爬取',
      tags: ['LLM', '语义分析', '精准提取'],
      usageCount: 2342,
      isFavorite: false
    },
    
    // 数据清洗
    {
      id: 'cleaner-extract',
      name: '智能内容提取器',
      icon: toolIcons['内容提取'],
      description: '从混杂的文本中精准提取关键信息，如姓名、日期、价格等结构化数据，支持自定义提取规则和模板。',
      category: '数据清洗' as ToolCategory,
      subCategory: '内容提取',
      tags: ['信息提取', '正则表达式', '模式匹配'],
      usageCount: 6723,
      isFavorite: false
    },
    {
      id: 'cleaner-tag',
      name: 'HTML标签清理器',
      icon: toolIcons['标签去除'],
      description: '高效去除HTML文档中的各类标签，保留纯文本内容，可配置保留特定标签或属性，适用于网页内容清洗。',
      category: '数据清洗' as ToolCategory,
      subCategory: '标签去除',
      tags: ['HTML', '标签移除', '文本提取'],
      usageCount: 4521,
      isFavorite: false
    },
    {
      id: 'cleaner-media',
      name: '多媒体文件分析器',
      icon: toolIcons['媒体文件识别'],
      description: '自动识别并分析图片、音频、视频等多媒体文件，提取文件信息、内容描述，支持OCR识别图片中的文字。',
      category: '数据清洗' as ToolCategory,
      subCategory: '媒体文件识别',
      tags: ['OCR', '图像识别', '多媒体分析'],
      usageCount: 3210,
      isFavorite: false
    },
    
    // 数据格式化
    {
      id: 'format-markdown',
      name: 'Markdown转换器',
      icon: toolIcons['Markdown'],
      description: '将文本内容智能转换为Markdown格式，自动识别标题、列表、代码块等元素，支持定制化样式和格式规则。',
      category: '数据格式化' as ToolCategory,
      subCategory: 'Markdown',
      tags: ['文档转换', '排版', '轻量标记'],
      usageCount: 4321,
      isFavorite: false
    },
    {
      id: 'format-html',
      name: 'HTML生成器',
      icon: toolIcons['HTML'],
      description: '将结构化数据或普通文本转换为HTML页面，支持自定义模板、样式，适用于报告生成、内容展示等场景。',
      category: '数据格式化' as ToolCategory,
      subCategory: 'HTML',
      tags: ['网页生成', '模板渲染', 'CSS样式'],
      usageCount: 3245,
      isFavorite: false
    },
    {
      id: 'format-txt',
      name: '纯文本规范化',
      icon: toolIcons['TXT'],
      description: '对纯文本内容进行规范化处理，包括去除冗余空格、统一换行符、修正标点符号等，提高文本质量和一致性。',
      category: '数据格式化' as ToolCategory,
      subCategory: 'TXT',
      tags: ['文本清理', '规范化', '标准化'],
      usageCount: 2876,
      isFavorite: false
    },
    
    // 数据集生成
    {
      id: 'dataset-jsonl',
      name: 'JSONL数据集生成器',
      icon: toolIcons['JSONL'],
      description: '将各类数据源转换为JSONL格式的数据集，支持大规模数据处理，适用于机器学习训练数据准备。',
      category: '数据集生成' as ToolCategory,
      subCategory: 'JSONL',
      tags: ['机器学习', '数据集', '大规模处理'],
      usageCount: 4532,
      isFavorite: false
    },
    {
      id: 'dataset-alpaca',
      name: 'Alpaca数据集转换',
      icon: toolIcons['Alpaca'],
      description: '生成或转换符合Alpaca格式的指令微调数据集，支持自定义指令模板和回答格式，适用于LLM微调。',
      category: '数据集生成' as ToolCategory,
      subCategory: 'Alpaca',
      tags: ['LLM微调', '指令数据', '模型训练'],
      usageCount: 3241,
      isFavorite: false
    },
    {
      id: 'dataset-sharegpt',
      name: 'ShareGPT格式转换',
      icon: toolIcons['shareGPT'],
      description: '将对话数据转换为ShareGPT格式，支持多轮对话、角色设定，适用于对话模型训练和评估数据准备。',
      category: '数据集生成' as ToolCategory,
      subCategory: 'shareGPT',
      tags: ['对话数据', '角色扮演', '多轮对话'],
      usageCount: 2789,
      isFavorite: false
    },
    {
      id: 'dataset-qa',
      name: 'QA问答对生成器',
      icon: toolIcons['QA问答'],
      description: '从文本内容中自动提取或生成问答对，支持自定义问题类型和答案格式，适用于问答系统训练数据准备。',
      category: '数据集生成' as ToolCategory,
      subCategory: 'QA问答',
      tags: ['问答对', '自动生成', '知识提取'],
      usageCount: 3654,
      isFavorite: false
    }
  ];
  
  // 搜索状态
  const [searchTerm, setSearchTerm] = useState<string>('');
  
  // 收藏状态
  const [favorites, setFavorites] = useState(new Set<string>());

  // 当前激活的标签页
  const [activeTab, setActiveTab] = useState<string>('all');

  // 当前打开的模态框
  const [openModal, setOpenModal] = useState<string | null>(null);

  // 处理工具数据的函数
  const getToolsByCategory = (category: string): Tool[] => {
    return tools.filter(tool => tool.category === category);
  };

  // 处理搜索和过滤
  const filteredTools = tools.filter(tool => {
    const searchLower = searchTerm.toLowerCase();
    return (
      tool.name.toLowerCase().includes(searchLower) ||
      (tool.description && tool.description.toLowerCase().includes(searchLower)) ||
      tool.tags.some(tag => tag.toLowerCase().includes(searchLower))
    );
  });

  // 处理收藏
  const handleToggleFavorite = (id: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(id)) {
        newFavorites.delete(id);
      } else {
        newFavorites.add(id);
      }
      return newFavorites;
    });
  };

  // 处理工具使用
  const handleUseTool = (tool: Tool) => {
    console.log(`使用工具: ${tool.name}`);
    // 这里可以添加使用工具的逻辑
  };

  // 处理导入工具点击事件
  const handleImportTool = () => {
    setOpenModal('import');
    // 这里可以添加导入工具的逻辑
  };

  // 处理自定义工具点击事件
  const handleCustomTool = () => {
    setOpenModal('custom');
    // 这里可以添加自定义工具的逻辑
  };

  // 关闭模态框
  const handleCloseModal = () => {
    setOpenModal(null);
  };

  return (
    <div className={`data-processing-container ${sidebarExpanded ? 'expanded' : ''}`}>
      <PageHeader 
        title="数据处理工具集合"
        description="协助您处理数据的工具集，包括采集、清洗、格式化与数据标注生成等功能"
        searchComponent={
          <div className="flex items-center" style={{ width: '100%', justifyContent: 'flex-end' }}>
            <Input
              placeholder="搜索工具名称、描述或标签..."
              prefix={<SearchOutlined style={{ color: '#a3a3a3' }} />}
              style={{ width: 300, marginRight: 'auto' }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button 
              type="primary" 
              icon={<UploadOutlined />}
              style={{ 
                background: 'linear-gradient(135deg, #1890ff, #096dd9)', 
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                marginLeft: '12px'
              }}
              onClick={handleImportTool}
            >
              导入工具
            </Button>
            <Button 
              icon={<PlusOutlined />}
              style={{ 
                background: 'white',
                borderColor: '#d1d5db',
                color: '#374151',
                display: 'flex',
                alignItems: 'center',
                marginLeft: '12px'
              }}
              onClick={handleCustomTool}
            >
              自定义工具
            </Button>
          </div>
        }
      />
      <div className="sticky top-[112px] z-10 bg-gray-50 px-6 pb-0">
        <Tabs defaultActiveKey="all" size="large" style={{ marginTop: '8px' }} className="sticky-tabs" onChange={(key) => setActiveTab(key)}>
          <TabPane tab="全部工具" key="all" />
          <TabPane tab="数据爬取" key="数据爬取" />
          <TabPane tab="数据清洗" key="数据清洗" />
          <TabPane tab="数据格式化" key="数据格式化" />
          <TabPane tab="数据集生成" key="数据集生成" />
        </Tabs>
      </div>

      <div className="flex-1 flex flex-col overflow-y-auto px-6 pb-6 mt-4">
        {activeTab === 'all' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredTools.map(tool => (
              <ToolCard 
                key={tool.id}
                tool={tool}
                isFavorite={favorites.has(tool.id)}
                toggleFavorite={() => handleToggleFavorite(tool.id)}
                onUse={() => handleUseTool(tool)}
              />
            ))}
          </div>
        )}
        {activeTab === '数据爬取' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {getToolsByCategory('数据爬取').map(tool => (
              <ToolCard 
                key={tool.id}
                tool={tool}
                isFavorite={favorites.has(tool.id)}
                toggleFavorite={() => handleToggleFavorite(tool.id)}
                onUse={() => handleUseTool(tool)}
              />
            ))}
          </div>
        )}
        {activeTab === '数据清洗' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {getToolsByCategory('数据清洗').map(tool => (
              <ToolCard 
                key={tool.id}
                tool={tool}
                isFavorite={favorites.has(tool.id)}
                toggleFavorite={() => handleToggleFavorite(tool.id)}
                onUse={() => handleUseTool(tool)}
              />
            ))}
          </div>
        )}
        {activeTab === '数据格式化' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {getToolsByCategory('数据格式化').map(tool => (
              <ToolCard 
                key={tool.id}
                tool={tool}
                isFavorite={favorites.has(tool.id)}
                toggleFavorite={() => handleToggleFavorite(tool.id)}
                onUse={() => handleUseTool(tool)}
              />
            ))}
          </div>
        )}
        {activeTab === '数据集生成' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {getToolsByCategory('数据集生成').map(tool => (
              <ToolCard 
                key={tool.id}
                tool={tool}
                isFavorite={favorites.has(tool.id)}
                toggleFavorite={() => handleToggleFavorite(tool.id)}
                onUse={() => handleUseTool(tool)}
              />
            ))}
          </div>
        )}
      </div>
      
      {/* 导入工具模态框 */}
      <Modal
        title="导入工具"
        open={openModal === 'import'}
        onCancel={handleCloseModal}
        footer={null}
        width={600}
        className="tool-modal"
      >
        <Form layout="vertical">
          <div className="mb-6">
            <Typography.Paragraph type="secondary">
              您可以从本地文件或URL导入数据处理工具，支持JSON、YAML或JavaScript格式。
            </Typography.Paragraph>
          </div>
          
          <Form.Item label="导入方式">
            <Select
              defaultValue="file"
              style={{ width: '100%' }}
              options={[
                { value: 'file', label: '本地文件' },
                { value: 'url', label: 'URL地址' },
                { value: 'code', label: '代码片段' },
              ]}
            />
          </Form.Item>
          
          <Form.Item>
            <Upload.Dragger
              name="file"
              multiple={false}
              action="/api/upload"
              onChange={(info) => {
                if (info.file.status === 'done') {
                  message.success(`${info.file.name} 上传成功`);
                } else if (info.file.status === 'error') {
                  message.error(`${info.file.name} 上传失败`);
                }
              }}
            >
              <p className="ant-upload-drag-icon">
                <InboxOutlined style={{ color: '#4b6cb7', fontSize: 48 }} />
              </p>
              <p className="ant-upload-text" style={{ color: '#374151' }}>点击或拖拽文件到此区域上传</p>
              <p className="ant-upload-hint" style={{ color: '#6b7280' }}>
                支持 .json, .yaml, .js 格式文件
              </p>
            </Upload.Dragger>
          </Form.Item>
          
          <div className="flex justify-end mt-4">
            <Button onClick={handleCloseModal} style={{ marginRight: 8 }}>
              取消
            </Button>
            <Button 
              type="primary" 
              style={{ 
                background: 'linear-gradient(135deg, #1890ff, #096dd9)', 
                border: 'none' 
              }}
              onClick={() => {
                message.success('工具导入成功！');
                handleCloseModal();
              }}
            >
              导入
            </Button>
          </div>
        </Form>
      </Modal>
      
      {/* 自定义工具模态框 */}
      <Modal
        title="创建自定义工具"
        open={openModal === 'custom'}
        onCancel={handleCloseModal}
        footer={null}
        width={700}
        className="tool-modal"
      >
        <Form layout="vertical">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item label="工具名称" rules={[{ required: true }]}>
              <Input placeholder="输入工具名称" />
            </Form.Item>
            
            <Form.Item label="工具类别" rules={[{ required: true }]}>
              <Select
                defaultValue="数据清洗"
                style={{ width: '100%' }}
                options={[
                  { value: '数据爬取', label: '数据爬取' },
                  { value: '数据清洗', label: '数据清洗' },
                  { value: '数据格式化', label: '数据格式化' },
                  { value: '数据集生成', label: '数据集生成' },
                ]}
              />
            </Form.Item>
          </div>
          
          <Form.Item label="工具描述" rules={[{ required: true }]}>
            <Input.TextArea 
              placeholder="简要描述此工具的功能和用途" 
              rows={2}
            />
          </Form.Item>
          
          <Form.Item label="标签">
            <Select
              mode="tags"
              style={{ width: '100%' }}
              placeholder="添加标签，按Enter确认"
              defaultValue={['自定义']}
            />
          </Form.Item>
          
          <Form.Item label="工具实现代码" rules={[{ required: true }]}>
            <div style={{ 
              border: '1px solid #e2e8f0', 
              borderRadius: '0.375rem',
              padding: '1rem',
              backgroundColor: '#f8fafc'
            }}>
              <div className="flex items-center mb-2">
                <CodeOutlined style={{ marginRight: 8, color: '#4b6cb7' }} />
                <Typography.Text strong>JavaScript / TypeScript</Typography.Text>
              </div>
              <Input.TextArea 
                placeholder="// 在此编写工具实现代码 
function processData(input) {
  // 数据处理逻辑
  return {
    result: '处理后的数据'
  }
}"
                rows={8}
                style={{ fontFamily: 'monospace' }}
              />
            </div>
          </Form.Item>
          
          <Form.Item label="工具图标" rules={[{ required: true }]}>
            <Select
              defaultValue="FileTextOutlined"
              style={{ width: '100%' }}
              options={[
                { 
                  value: 'FileTextOutlined', 
                  label: <div className="flex items-center">
                    <FileTextOutlined style={{ marginRight: 8 }} /> 文件
                  </div> 
                },
                { 
                  value: 'TableOutlined', 
                  label: <div className="flex items-center">
                    <TableOutlined style={{ marginRight: 8 }} /> 表格
                  </div> 
                },
                { 
                  value: 'ApiOutlined', 
                  label: <div className="flex items-center">
                    <ApiOutlined style={{ marginRight: 8 }} /> API
                  </div> 
                },
                { 
                  value: 'CodeOutlined', 
                  label: <div className="flex items-center">
                    <CodeOutlined style={{ marginRight: 8 }} /> 代码
                  </div> 
                }
              ]}
            />
          </Form.Item>
          
          <div className="flex justify-end mt-4">
            <Button onClick={handleCloseModal} style={{ marginRight: 8 }}>
              取消
            </Button>
            <Button 
              type="primary" 
              style={{ 
                background: 'linear-gradient(135deg, #1890ff, #096dd9)', 
                border: 'none' 
              }}
              onClick={() => {
                message.success('自定义工具创建成功！');
                handleCloseModal();
              }}
            >
              创建
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default DataProcessingTools;
