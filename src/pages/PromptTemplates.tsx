import React, { useState, useEffect } from 'react';
import { Input, Button, Select, Empty, message, Pagination } from 'antd';
import { 
  SearchOutlined, 
  SyncOutlined, 
  PlusOutlined 
} from '@ant-design/icons';
import PageHeader from '../components/layout/PageHeader';
import PromptTemplateCard from '../components/modules/prompts/PromptTemplateCard';
import BindTemplateModal from '../components/modules/prompts/BindTemplateModal';
import { PromptTemplateListSkeleton } from '../components/skeleton';
import '../styles/promptStyles.css'; // 导入新的样式文件

// 类型定义
export interface PromptTemplate {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  isBound: boolean;
}

// 模拟数据
const mockTemplates: PromptTemplate[] = [
  {
    id: '1',
    title: '政策解读与精准解答',
    content: '作为一个政策解读助手，你需要帮助用户理解和解释各类政府政策、法规和规定。请确保你的回答准确、清晰，直接回答用户的问题，不添加不必要的信息。如果需要引用政策文件，请注明来源和日期。回答应当客观中立，避免加入个人观点。',
    category: 'policy',
    tags: ['政策解读', '政务服务', '文件解析'],
    createdAt: '2025-05-01',
    updatedAt: '2025-05-06',
    isBound: false
  },
  {
    id: '2',
    title: '智能客服对话指引',
    content: '你是一名专业的客服代表，负责回答用户关于产品、服务和政策的问题。始终保持礼貌和专业，使用清晰简洁的语言。如果不确定答案，请直接表示不知道并提供获取正确信息的方式。每次回答应当解决用户的核心问题，并主动询问是否有其他需要帮助的地方。',
    category: 'customer_service',
    tags: ['客户服务', '对话引导', '问题解答'],
    createdAt: '2025-05-02',
    updatedAt: '2025-05-06',
    isBound: true
  },
  {
    id: '3',
    title: '财政政策专家咨询',
    content: '作为财政政策专家，你需要帮助用户理解复杂的财政政策、税务规定和政府补贴项目。回答时应当结合最新的政策文件和法规，确保信息的准确性和时效性。针对企业和个人的不同需求，提供有针对性的解释和建议，但不应提供具体的财务或投资建议。',
    category: 'policy',
    tags: ['财政政策', '税务规定', '财政补贴'],
    createdAt: '2025-05-03',
    updatedAt: '2025-05-05',
    isBound: false
  },
  {
    id: '4',
    title: '智能知识库问答引导',
    content: '你是一个专门用于知识库检索和问答的AI助手。你的任务是根据用户的问题，提供准确、相关的信息，并引导用户深入了解相关知识。回答应基于可靠的信息源，并在必要时提供参考来源。尽量使用清晰的结构和简洁的语言，确保用户容易理解复杂的概念。',
    category: 'qa_system',
    tags: ['知识库', '问答系统', '信息检索'],
    createdAt: '2025-05-04',
    updatedAt: '2025-05-05',
    isBound: false
  },
  {
    id: '5',
    title: '城市规划政策解读',
    content: '作为城市规划政策专家，你需要帮助用户理解与城市发展、土地使用、住房政策相关的法规和政策。回答应当客观准确，结合最新的政策动向，并考虑到不同地区可能存在的政策差异。提供的信息应当有助于用户了解城市规划的基本原则和具体实施细节。',
    category: 'policy',
    tags: ['城市规划', '土地政策', '住房政策'],
    createdAt: '2025-05-04',
    updatedAt: '2025-05-04',
    isBound: false
  },
  {
    id: '6',
    title: '公共服务咨询助手',
    content: '你是一名公共服务咨询助手，专门解答与政府服务、证件办理、社会保障等方面的问题。提供的信息应当准确、实用，并尽可能指引用户找到正确的办事流程和途径。回答时应关注最新的政策变化，确保用户获得的是最新且有效的信息。',
    category: 'customer_service',
    tags: ['公共服务', '政务咨询', '办事指南'],
    createdAt: '2025-05-03',
    updatedAt: '2025-05-04',
    isBound: false
  }
];

// 类别数据
const categories = [
  { value: 'all', label: '全部类别' },
  { value: 'general', label: '通用场景' },
  { value: 'policy', label: '政策场景' },
  { value: 'customer_service', label: '智能客服' },
  { value: 'qa_system', label: '问答系统' }
];

const PromptTemplates: React.FC = () => {
  // 模板数据状态
  const [templates, setTemplates] = useState<PromptTemplate[]>([]);
  const [filteredTemplates, setFilteredTemplates] = useState<PromptTemplate[]>([]);
  const [loading, setLoading] = useState(true); // 默认为加载状态
  
  // 筛选状态
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  // 绑定弹窗相关状态
  const [bindModalVisible, setBindModalVisible] = useState(false);
  const [currentTemplate, setCurrentTemplate] = useState<PromptTemplate | null>(null);
  const [modalMode, setModalMode] = useState<'bind' | 'unbind'>('bind');
  
  // 分页相关状态
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(9);
  const [paginatedTemplates, setPaginatedTemplates] = useState<PromptTemplate[]>([]);
  
  // 是否有数据状态
  const [hasData, setHasData] = useState(true);

  // 加载模板数据
  const loadTemplates = () => {
    setLoading(true);
    // 模拟API调用延迟 - 增加延迟时间以展示骨架屏效果
    setTimeout(() => {
      // 模拟API调用
      setTemplates(mockTemplates);
      setFilteredTemplates(mockTemplates);
      setLoading(false);
    }, 1500);
  };

  // 刷新数据
  const handleRefresh = () => {
    loadTemplates();
    // 显示刷新提示
    message.info('正在刷新数据...');
  };

  // 搜索处理
  const handleSearch = (value: string) => {
    setSearchText(value);
  };

  // 类别筛选处理
  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
  };

  // 绑定提示词模板（打开模态框）
  const handleBindTemplate = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (template) {
      setCurrentTemplate(template);
      setModalMode('bind');
      setBindModalVisible(true);
    }
  };

  // 解绑提示词模板（打开模态框）
  const handleUnbindTemplate = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (template) {
      setCurrentTemplate(template);
      setModalMode('unbind');
      setBindModalVisible(true);
    }
  };

  // 处理模板绑定/解绑确认
  const handleBindConfirm = (assistantIds: string[]) => {
    if (!currentTemplate) return;
    
    // 模拟API调用 - 实际项目中需要与后端交互
    setLoading(true);
    setTimeout(() => {
      // 更新模板状态
      const updatedTemplates = templates.map(t => {
        if (t.id === currentTemplate.id) {
          return {
            ...t,
            isBound: modalMode === 'bind'
          };
        }
        return t;
      });
      
      setTemplates(updatedTemplates);
      setBindModalVisible(false);
      setCurrentTemplate(null);
      setLoading(false);
      
      message.success(
        modalMode === 'bind' 
          ? `已成功将模板"${currentTemplate.title}"绑定到${assistantIds.length}个助手` 
          : `已成功解绑模板"${currentTemplate.title}"`
      );
    }, 800);
  };

  // 编辑提示词模板
  const handleEditTemplate = (templateId: string) => {
    // 暂时只显示消息提示
    message.info('编辑模板功能正在开发中');
  };
  
  // 处理页面变化
  const handlePageChange = (page: number, size?: number) => {
    setCurrentPage(page);
    if (size) setPageSize(size);
  };

  // 更新分页数据
  const updatePagination = () => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize, filteredTemplates.length);
    setPaginatedTemplates(filteredTemplates.slice(startIndex, endIndex));
  };

  // 初始化加载数据
  useEffect(() => {
    loadTemplates();
  }, []);

  // 监听筛选条件变化
  useEffect(() => {
    const filtered = templates.filter(template => {
      const matchSearch = template.title.toLowerCase().includes(searchText.toLowerCase()) || 
                         template.content.toLowerCase().includes(searchText.toLowerCase());
      const matchCategory = selectedCategory === 'all' || template.category === selectedCategory;
      
      return matchSearch && matchCategory;
    });
    
    setFilteredTemplates(filtered);
    setCurrentPage(1); // 重置为第一页
  }, [templates, searchText, selectedCategory]);

  // 分页处理
  useEffect(() => {
    updatePagination();
  }, [filteredTemplates, currentPage, pageSize]);

  // 检查是否有数据
  useEffect(() => {
    setHasData(filteredTemplates.length > 0);
  }, [filteredTemplates]);

  // 添加内联样式到DOM
  useEffect(() => {
    const styleEl = document.createElement('style');
    styleEl.textContent = `
      .prompt-template-card .ant-typography,
      .prompt-template-card .ant-typography *,
      .prompt-template-card div,
      .prompt-template-card span,
      .prompt-template-card p {
        color: #000 !important;
      }
      
      .prompt-title, .prompt-content {
        color: #000 !important;
        font-weight: 600 !important;
      }
      
      /* 动画效果 */
      .prompt-template-card {
        transition: all 0.2s ease-in-out;
      }

      .prompt-template-card:hover {
        transform: translateY(-4px);
        box-shadow: 0 10px 20px rgba(0, 0, 0, 0.08);
      }

      .prompt-tag {
        transition: all 0.2s;
      }

      .prompt-tag:hover {
        transform: translateY(-2px);
      }
    `;
    document.head.appendChild(styleEl);
    
    return () => {
      document.head.removeChild(styleEl);
    };
  }, []);

  return (
    <div className="flex flex-col h-screen">
      <PageHeader
        title="提示词模板"
        parentTitle="问答助手"
        description="浏览和管理AI提示词模板"
        primaryActions={[
          {
            icon: <PlusOutlined />,
            label: '新建模板',
            onClick: () => message.info('新建模板功能正在开发中')
          }
        ]}
      />

      <div className="flex-1 overflow-hidden">
        <div className="p-6 h-full flex flex-col">
          {/* 搜索和筛选 */}
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-4 flex-1">
              <Input 
                placeholder="搜索提示词模板..." 
                prefix={<SearchOutlined className="text-gray-400" />}
                onChange={(e) => handleSearch(e.target.value)}
                className="max-w-md"
                allowClear
              />
              
              <Select
                defaultValue="all"
                onChange={handleCategoryChange}
                style={{ width: 160 }}
                options={categories}
              />
            </div>
            
            <Button 
              icon={<SyncOutlined />} 
              onClick={handleRefresh}
              className="flex items-center"
            >
              刷新
            </Button>
          </div>

          {/* 模板列表 - 使用骨架屏替代简单的加载动画 */}
          {loading ? (
            <div className="flex-1">
              <PromptTemplateListSkeleton count={pageSize} />
            </div>
          ) : !hasData ? (
            <div className="flex-1 flex items-center justify-center">
              <Empty 
                description="没有找到匹配的提示词模板" 
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            </div>
          ) : (
            <div className="flex-1 overflow-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedTemplates.map(template => (
                  <PromptTemplateCard
                    key={template.id}
                    template={template}
                    onBind={() => handleBindTemplate(template.id)}
                    onUnbind={() => handleUnbindTemplate(template.id)}
                    onEdit={() => handleEditTemplate(template.id)}
                  />
                ))}
              </div>
              
              {/* 分页组件 */}
              {filteredTemplates.length > pageSize && (
                <div className="mt-6 flex justify-center">
                  <Pagination
                    current={currentPage}
                    pageSize={pageSize}
                    total={filteredTemplates.length}
                    onChange={handlePageChange}
                    showSizeChanger={false}
                    showTotal={(total) => `共 ${total} 个模板`}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 绑定模板弹窗 */}
      <BindTemplateModal 
        open={bindModalVisible}
        onCancel={() => setBindModalVisible(false)}
        onConfirm={handleBindConfirm}
        template={currentTemplate}
        mode={modalMode}
      />
    </div>
  );
};

export default PromptTemplates;
