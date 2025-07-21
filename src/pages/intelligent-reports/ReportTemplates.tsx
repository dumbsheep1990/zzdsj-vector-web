import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FileText, 
  Plus, 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Copy, 
  Trash2, 
  Star, 
  User,
  Clock,
  Download,
  BookOpen,
  X
} from 'lucide-react';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import DropdownMenu from '../../components/ui/DropdownMenu';
import { StatsCard } from '../../components/ui/StatsCard';

interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  type: string;
  tags: string[];
  isPublic: boolean;
  isPremium: boolean;
  rating: number;
  usageCount: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  preview: string;
  config: {
    sections: string[];
    defaultFormat: string;
    estimatedTime: number;
    complexity: 'low' | 'medium' | 'high';
  };
}

const mockTemplates: ReportTemplate[] = [
  {
    id: '1',
    name: '市场研究报告模板',
    description: '专业的市场研究报告模板，包含市场概述、竞争分析、趋势预测等标准章节',
    category: '商业分析',
    type: 'research',
    tags: ['市场研究', '商业分析', '竞争分析'],
    isPublic: true,
    isPremium: false,
    rating: 4.8,
    usageCount: 245,
    createdBy: 'System',
    createdAt: '2024-01-10',
    updatedAt: '2024-01-15',
    preview: '# 市场研究报告\n\n## 1. 执行摘要\n\n## 2. 市场概述\n\n## 3. 竞争分析\n\n## 4. 趋势预测\n\n## 5. 结论与建议',
    config: {
      sections: ['执行摘要', '市场概述', '竞争分析', '趋势预测', '结论与建议'],
      defaultFormat: 'HTML',
      estimatedTime: 15,
      complexity: 'medium'
    }
  },
  {
    id: '2',
    name: '技术分析报告模板',
    description: '适用于技术方案分析、系统架构评估等技术类报告的专业模板',
    category: '技术文档',
    type: 'technical',
    tags: ['技术分析', '系统架构', '方案评估'],
    isPublic: true,
    isPremium: true,
    rating: 4.9,
    usageCount: 189,
    createdBy: 'Tech Team',
    createdAt: '2024-01-08',
    updatedAt: '2024-01-12',
    preview: '# 技术分析报告\n\n## 1. 技术概述\n\n## 2. 架构设计\n\n## 3. 性能分析\n\n## 4. 风险评估\n\n## 5. 实施建议',
    config: {
      sections: ['技术概述', '架构设计', '性能分析', '风险评估', '实施建议'],
      defaultFormat: 'PDF',
      estimatedTime: 20,
      complexity: 'high'
    }
  },
  {
    id: '3',
    name: '产品功能对比模板',
    description: '多产品功能特性对比分析的标准模板，支持表格和图表展示',
    category: '产品分析',
    type: 'comparison',
    tags: ['产品对比', '功能分析', '竞品分析'],
    isPublic: true,
    isPremium: false,
    rating: 4.6,
    usageCount: 156,
    createdBy: 'Product Team',
    createdAt: '2024-01-05',
    updatedAt: '2024-01-10',
    preview: '# 产品功能对比报告\n\n## 1. 产品概述\n\n## 2. 功能对比矩阵\n\n## 3. 优势分析\n\n## 4. 劣势分析\n\n## 5. 总结建议',
    config: {
      sections: ['产品概述', '功能对比矩阵', '优势分析', '劣势分析', '总结建议'],
      defaultFormat: 'HTML',
      estimatedTime: 10,
      complexity: 'low'
    }
  },
  {
    id: '4',
    name: '年度总结报告模板',
    description: '企业年度工作总结、成果展示的综合性报告模板',
    category: '总结报告',
    type: 'summary',
    tags: ['年度总结', '工作报告', '成果展示'],
    isPublic: false,
    isPremium: true,
    rating: 4.7,
    usageCount: 98,
    createdBy: 'HR Team',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-08',
    preview: '# 年度总结报告\n\n## 1. 年度概述\n\n## 2. 主要成果\n\n## 3. 关键指标\n\n## 4. 挑战与机遇\n\n## 5. 下年度规划',
    config: {
      sections: ['年度概述', '主要成果', '关键指标', '挑战与机遇', '下年度规划'],
      defaultFormat: 'PDF',
      estimatedTime: 25,
      complexity: 'medium'
    }
  }
];

const ReportTemplates: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [showOnlyPublic, setShowOnlyPublic] = useState(false);
  const [showOnlyPremium, setShowOnlyPremium] = useState(false);
  const [sortBy, setSortBy] = useState<'name' | 'rating' | 'usageCount' | 'createdAt'>('rating');
  const [selectedTemplate, setSelectedTemplate] = useState<ReportTemplate | null>(null);

  const categories = Array.from(new Set(mockTemplates.map(t => t.category)));
  const types = Array.from(new Set(mockTemplates.map(t => t.type)));

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getComplexityText = (complexity: string) => {
    switch (complexity) {
      case 'low': return '简单';
      case 'medium': return '中等';
      case 'high': return '复杂';
      default: return '未知';
    }
  };

  const filteredTemplates = mockTemplates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    const matchesType = selectedType === 'all' || template.type === selectedType;
    const matchesPublic = !showOnlyPublic || template.isPublic;
    const matchesPremium = !showOnlyPremium || template.isPremium;
    
    return matchesSearch && matchesCategory && matchesType && matchesPublic && matchesPremium;
  });

  const sortedTemplates = [...filteredTemplates].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'rating':
        return b.rating - a.rating;
      case 'usageCount':
        return b.usageCount - a.usageCount;
      case 'createdAt':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      default:
        return 0;
    }
  });

  const handleUseTemplate = (template: ReportTemplate) => {
    navigate(`/intelligent-reports/report-generate?template=${template.id}`);
  };

  const handlePreviewTemplate = (template: ReportTemplate) => {
    setSelectedTemplate(template);
  };

  const handleEditTemplate = (template: ReportTemplate) => {
    // 实现编辑模板功能
    console.log('Edit template:', template.id);
  };

  const handleCopyTemplate = (template: ReportTemplate) => {
    // 实现复制模板功能
    console.log('Copy template:', template.id);
  };

  const handleDeleteTemplate = (template: ReportTemplate) => {
    // 实现删除模板功能
    console.log('Delete template:', template.id);
  };

  const handleCreateTemplate = () => {
    navigate('/intelligent-reports/template-builder');
  };

  const totalTemplates = mockTemplates.length;
  const publicTemplates = mockTemplates.filter(t => t.isPublic).length;
  const premiumTemplates = mockTemplates.filter(t => t.isPremium).length;
  const avgRating = mockTemplates.reduce((sum, t) => sum + t.rating, 0) / totalTemplates;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* 页面标题 */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <BookOpen className="w-8 h-8 text-blue-600" />
            报告模板库
          </h1>
          <p className="text-gray-600 mt-1">浏览和使用专业的报告模板</p>
        </div>
        <Button 
          onClick={handleCreateTemplate}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          创建模板
        </Button>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <StatsCard
          title="总模板数"
          value={totalTemplates.toString()}
          subtitle="可用模板"
          icon={FileText}
          color="blue"
        />
        <StatsCard
          title="公开模板"
          value={publicTemplates.toString()}
          subtitle="免费使用"
          icon={Eye}
          color="green"
        />
        <StatsCard
          title="高级模板"
          value={premiumTemplates.toString()}
          subtitle="专业版本"
          icon={Star}
          color="yellow"
        />
        <StatsCard
          title="平均评分"
          value={avgRating.toFixed(1)}
          subtitle="用户评价"
          icon={Star}
          color="purple"
        />
      </div>

      {/* 搜索和过滤 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-col lg:flex-row gap-4 mb-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <Input
                placeholder="搜索模板名称或描述..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <DropdownMenu
              trigger={
                <Button variant="outline" className="flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  分类: {selectedCategory === 'all' ? '全部' : selectedCategory}
                </Button>
              }
            >
              <div className="py-1">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                  全部分类
                </button>
                {categories.map(category => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    {category}
                  </button>
                ))}
              </div>
            </DropdownMenu>
            
            <DropdownMenu
              trigger={
                <Button variant="outline" className="flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  类型: {selectedType === 'all' ? '全部' : selectedType}
                </Button>
              }
            >
              <div className="py-1">
                <button
                  onClick={() => setSelectedType('all')}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                  全部类型
                </button>
                {types.map(type => (
                  <button
                    key={type}
                    onClick={() => setSelectedType(type)}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    {type}
                  </button>
                ))}
              </div>
            </DropdownMenu>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-4 text-sm">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={showOnlyPublic}
              onChange={(e) => setShowOnlyPublic(e.target.checked)}
              className="rounded"
            />
            <span>仅显示公开模板</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={showOnlyPremium}
              onChange={(e) => setShowOnlyPremium(e.target.checked)}
              className="rounded"
            />
            <span>仅显示高级模板</span>
          </label>
        </div>
      </div>

      {/* 模板网格 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedTemplates.map((template) => (
          <div key={template.id} className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
                    {template.name}
                  </h3>
                  {template.isPremium && (
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  )}
                </div>
                <DropdownMenu
                  trigger={
                    <Button variant="ghost" size="sm" className="p-1">
                      <div className="w-4 h-4 flex flex-col gap-0.5">
                        <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                        <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                        <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                      </div>
                    </Button>
                  }
                >
                  <div className="py-1">
                    <button
                      onClick={() => handlePreviewTemplate(template)}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                    >
                      <Eye className="w-4 h-4 inline mr-2" />
                      预览
                    </button>
                    <button
                      onClick={() => handleEditTemplate(template)}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                    >
                      <Edit className="w-4 h-4 inline mr-2" />
                      编辑
                    </button>
                    <button
                      onClick={() => handleCopyTemplate(template)}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                    >
                      <Copy className="w-4 h-4 inline mr-2" />
                      复制
                    </button>
                    <button
                      onClick={() => handleDeleteTemplate(template)}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
                    >
                      <Trash2 className="w-4 h-4 inline mr-2" />
                      删除
                    </button>
                  </div>
                </DropdownMenu>
              </div>
              
              <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                {template.description}
              </p>
              
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="outline" className="text-xs">
                  {template.category}
                </Badge>
                <Badge className={getComplexityColor(template.config.complexity)} variant="outline">
                  {getComplexityText(template.config.complexity)}
                </Badge>
                {template.tags.slice(0, 2).map(tag => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
              
              <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span>{template.rating}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Download className="w-4 h-4" />
                  <span>{template.usageCount}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{template.config.estimatedTime}分钟</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                <div className="flex items-center gap-1">
                  <User className="w-3 h-3" />
                  <span>{template.createdBy}</span>
                </div>
                <span>{template.createdAt}</span>
              </div>
              
              <Button
                onClick={() => handleUseTemplate(template)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                使用此模板
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* 模板预览模态框 */}
      {selectedTemplate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full m-4 max-h-[80vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">
                  {selectedTemplate.name}
                </h2>
                <Button
                  variant="ghost"
                  onClick={() => setSelectedTemplate(null)}
                  className="p-2"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            <div className="p-6 overflow-y-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3">模板信息</h3>
                  <div className="space-y-2 text-sm">
                    <div><span className="font-medium">描述：</span>{selectedTemplate.description}</div>
                    <div><span className="font-medium">分类：</span>{selectedTemplate.category}</div>
                    <div><span className="font-medium">类型：</span>{selectedTemplate.type}</div>
                    <div><span className="font-medium">复杂度：</span>{getComplexityText(selectedTemplate.config.complexity)}</div>
                    <div><span className="font-medium">预估时间：</span>{selectedTemplate.config.estimatedTime}分钟</div>
                    <div><span className="font-medium">默认格式：</span>{selectedTemplate.config.defaultFormat}</div>
                  </div>
                  
                  <h3 className="text-lg font-semibold mt-6 mb-3">章节结构</h3>
                  <div className="space-y-2">
                    {selectedTemplate.config.sections.map((section, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">{index + 1}.</span>
                        <span className="text-sm">{section}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-3">模板预览</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                      {selectedTemplate.preview}
                    </pre>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-6 border-t border-gray-200">
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setSelectedTemplate(null)}
                >
                  取消
                </Button>
                <Button
                  onClick={() => {
                    handleUseTemplate(selectedTemplate);
                    setSelectedTemplate(null);
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  使用此模板
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportTemplates;