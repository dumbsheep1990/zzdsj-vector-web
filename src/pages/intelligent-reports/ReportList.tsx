import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Plus, Search, Filter, Download, Eye, Edit, Trash2, Calendar, User, Star, Clock } from 'lucide-react';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import DropdownMenu from '../../components/ui/DropdownMenu';
import Pagination from '../../components/ui/Pagination';

// 报告状态枚举
enum ReportStatus {
  DRAFT = 'draft',
  GENERATING = 'generating',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled'
}

// 报告类型枚举
enum ReportType {
  RESEARCH = 'research',
  ANALYSIS = 'analysis',
  SUMMARY = 'summary',
  COMPARISON = 'comparison',
  FORECAST = 'forecast'
}

// 报告接口
interface Report {
  id: string;
  title: string;
  type: ReportType;
  status: ReportStatus;
  createdAt: string;
  updatedAt: string;
  author: string;
  qualityScore: number;
  estimatedTime: string;
  tags: string[];
  description: string;
  size: string;
  language: string;
  priority: 'high' | 'medium' | 'low';
}

// 模拟数据
const mockReports: Report[] = [
  {
    id: '1',
    title: '2024年政策执行效果分析报告',
    type: ReportType.ANALYSIS,
    status: ReportStatus.COMPLETED,
    createdAt: '2024-01-15',
    updatedAt: '2024-01-20',
    author: 'AI助手',
    qualityScore: 92,
    estimatedTime: '45分钟',
    tags: ['政策分析', '效果评估', '2024年度'],
    description: '深入分析2024年各项政策的执行效果和社会影响',
    size: '2.3MB',
    language: 'zh-CN',
    priority: 'high'
  },
  {
    id: '2',
    title: '企业数字化转型趋势研究',
    type: ReportType.RESEARCH,
    status: ReportStatus.GENERATING,
    createdAt: '2024-01-10',
    updatedAt: '2024-01-18',
    author: 'AI助手',
    qualityScore: 0,
    estimatedTime: '30分钟',
    tags: ['数字化', '转型', '趋势分析'],
    description: '企业数字化转型现状及未来发展趋势研究',
    size: '1.8MB',
    language: 'zh-CN',
    priority: 'medium'
  },
  {
    id: '3',
    title: '季度财务数据汇总',
    type: ReportType.SUMMARY,
    status: ReportStatus.COMPLETED,
    createdAt: '2024-01-05',
    updatedAt: '2024-01-08',
    author: 'AI助手',
    qualityScore: 88,
    estimatedTime: '20分钟',
    tags: ['财务', '季度报告', '数据汇总'],
    description: '第一季度财务数据的全面汇总和分析',
    size: '1.2MB',
    language: 'zh-CN',
    priority: 'high'
  },
  {
    id: '4',
    title: '竞争对手产品对比分析',
    type: ReportType.COMPARISON,
    status: ReportStatus.DRAFT,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-03',
    author: 'AI助手',
    qualityScore: 0,
    estimatedTime: '60分钟',
    tags: ['竞争分析', '产品对比', '市场研究'],
    description: '主要竞争对手产品功能和市场定位对比分析',
    size: '3.1MB',
    language: 'zh-CN',
    priority: 'medium'
  },
  {
    id: '5',
    title: '2024年市场预测报告',
    type: ReportType.FORECAST,
    status: ReportStatus.FAILED,
    createdAt: '2023-12-28',
    updatedAt: '2023-12-30',
    author: 'AI助手',
    qualityScore: 0,
    estimatedTime: '75分钟',
    tags: ['市场预测', '2024年', '行业分析'],
    description: '基于当前数据对2024年市场走势的预测分析',
    size: '2.7MB',
    language: 'zh-CN',
    priority: 'low'
  }
];

const ReportList: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<ReportStatus | 'all'>('all');
  const [typeFilter, setTypeFilter] = useState<ReportType | 'all'>('all');
  const [selectedReports, setSelectedReports] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  // 筛选报告
  const filteredReports = mockReports.filter(report => {
    const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || report.status === statusFilter;
    const matchesType = typeFilter === 'all' || report.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  // 获取状态颜色
  const getStatusColor = (status: ReportStatus) => {
    switch (status) {
      case ReportStatus.COMPLETED: return 'bg-green-500';
      case ReportStatus.GENERATING: return 'bg-blue-500';
      case ReportStatus.DRAFT: return 'bg-yellow-500';
      case ReportStatus.FAILED: return 'bg-red-500';
      case ReportStatus.CANCELLED: return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  // 获取状态文本
  const getStatusText = (status: ReportStatus) => {
    switch (status) {
      case ReportStatus.COMPLETED: return '已完成';
      case ReportStatus.GENERATING: return '生成中';
      case ReportStatus.DRAFT: return '草稿';
      case ReportStatus.FAILED: return '失败';
      case ReportStatus.CANCELLED: return '已取消';
      default: return '未知';
    }
  };

  // 获取类型文本
  const getTypeText = (type: ReportType) => {
    switch (type) {
      case ReportType.RESEARCH: return '研究报告';
      case ReportType.ANALYSIS: return '分析报告';
      case ReportType.SUMMARY: return '摘要报告';
      case ReportType.COMPARISON: return '对比报告';
      case ReportType.FORECAST: return '预测报告';
      default: return '未知类型';
    }
  };

  // 处理函数
  const handleCreateReport = () => {
    navigate('/intelligent-reports');
  };

  const handleSelectReport = (reportId: string) => {
    setSelectedReports(prev => 
      prev.includes(reportId) 
        ? prev.filter(id => id !== reportId)
        : [...prev, reportId]
    );
  };

  const handleSelectAll = () => {
    setSelectedReports(
      selectedReports.length === filteredReports.length 
        ? [] 
        : filteredReports.map(report => report.id)
    );
  };

  const handleViewReport = (reportId: string) => {
    navigate(`/intelligent-reports/report/${reportId}`);
  };

  const handleEditReport = (reportId: string) => {
    // 实现编辑功能
    console.log('Edit report:', reportId);
  };

  const handleDeleteReport = (reportId: string) => {
    // 实现删除功能
    console.log('Delete report:', reportId);
  };

  const handleDownloadReport = (reportId: string) => {
    // 实现下载功能
    console.log('Download report:', reportId);
  };

  // 统计数据
  const totalReports = filteredReports.length;
  const completedReports = filteredReports.filter(r => r.status === ReportStatus.COMPLETED).length;
  const generatingReports = filteredReports.filter(r => r.status === ReportStatus.GENERATING).length;
  const avgQualityScore = filteredReports.reduce((sum, report) => sum + report.qualityScore, 0) / filteredReports.length || 0;

  const statusOptions = [
    { value: 'all', label: '全部状态' },
    { value: ReportStatus.COMPLETED, label: '已完成' },
    { value: ReportStatus.GENERATING, label: '生成中' },
    { value: ReportStatus.DRAFT, label: '草稿' },
    { value: ReportStatus.FAILED, label: '失败' },
    { value: ReportStatus.CANCELLED, label: '已取消' }
  ];

  const typeOptions = [
    { value: 'all', label: '全部类型' },
    { value: ReportType.RESEARCH, label: '研究报告' },
    { value: ReportType.ANALYSIS, label: '分析报告' },
    { value: ReportType.SUMMARY, label: '摘要报告' },
    { value: ReportType.COMPARISON, label: '对比报告' },
    { value: ReportType.FORECAST, label: '预测报告' }
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* 页面标题 - 简洁设计 */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <FileText className="w-8 h-8 text-blue-600" />
            智能报告管理
          </h1>
          <p className="text-gray-600 mt-1">管理和查看所有智能生成的报告</p>
        </div>
        <Button 
          onClick={handleCreateReport}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          创建新报告
        </Button>
      </div>

      {/* 统计卡片 - 简洁设计 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">总报告数</p>
              <p className="text-2xl font-bold text-gray-900">{totalReports}</p>
              <p className="text-xs text-gray-500 mt-1">全部报告</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">已完成</p>
              <p className="text-2xl font-bold text-green-600">{completedReports}</p>
              <p className="text-xs text-green-500 mt-1">+12% 本周</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">生成中</p>
              <p className="text-2xl font-bold text-blue-600">{generatingReports}</p>
              <p className="text-xs text-blue-500 mt-1">实时更新</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center relative">
              <Clock className="w-6 h-6 text-blue-600" />
              <div className="absolute inset-0 rounded-lg bg-blue-500/10 animate-pulse" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">平均质量分</p>
              <p className="text-2xl font-bold text-purple-600">{Math.round(avgQualityScore)}</p>
              <p className="text-xs text-purple-500 mt-1">优秀品质</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Star className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* 搜索和过滤 - 简洁设计 */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex-1 min-w-80 relative">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
              <Search className="w-4 h-4 text-gray-400" />
            </div>
            <Input
              placeholder="搜索报告标题、描述或标签..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <DropdownMenu
            trigger={
              <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                <Filter className="w-4 h-4" />
                状态: {statusOptions.find(opt => opt.value === statusFilter)?.label}
              </button>
            }
          >
            {statusOptions.map(option => (
              <div
                key={option.value}
                className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                onClick={() => setStatusFilter(option.value as ReportStatus | 'all')}
              >
                {option.label}
              </div>
            ))}
          </DropdownMenu>
          
          <DropdownMenu
            trigger={
              <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                <Filter className="w-4 h-4" />
                类型: {typeOptions.find(opt => opt.value === typeFilter)?.label}
              </button>
            }
          >
            {typeOptions.map(option => (
              <div
                key={option.value}
                className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                onClick={() => setTypeFilter(option.value as ReportType | 'all')}
              >
                {option.label}
              </div>
            ))}
          </DropdownMenu>
        </div>
      </div>

      {/* 报告列表 - 简洁设计 */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              报告列表 ({filteredReports.length})
            </h2>
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={selectedReports.length === filteredReports.length}
                onChange={handleSelectAll}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-600">全选</span>
            </div>
          </div>
        </div>

        <div className="divide-y divide-gray-200">
          {filteredReports.map((report) => (
            <div
              key={report.id}
              className="p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                  <input
                    type="checkbox"
                    checked={selectedReports.includes(report.id)}
                    onChange={() => handleSelectReport(report.id)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-base font-semibold text-gray-900">{report.title}</h3>
                      <Badge className={`${getStatusColor(report.status)} text-white px-2 py-1 rounded text-xs font-medium`}>
                        {getStatusText(report.status)}
                      </Badge>
                      <Badge variant="outline" className="px-2 py-1 rounded text-xs font-medium border-gray-200 text-gray-600">
                        {getTypeText(report.type)}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-3">{report.description}</p>
                    
                    <div className="flex items-center gap-6 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {report.createdAt}
                      </span>
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {report.author}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {report.estimatedTime}
                      </span>
                      {report.qualityScore > 0 && (
                        <span className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-amber-500" />
                          <span className="text-amber-600 font-medium">{report.qualityScore}/100</span>
                        </span>
                      )}
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mt-3">
                      {report.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 ml-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleViewReport(report.id)}
                    className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditReport(report.id)}
                    className="p-2 text-gray-600 hover:text-gray-700 hover:bg-gray-50"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDownloadReport(report.id)}
                    className="p-2 text-green-600 hover:text-green-700 hover:bg-green-50"
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteReport(report.id)}
                    className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 分页 */}
      {filteredReports.length > 0 && (
        <div className="mt-6 flex justify-center">
          <div className="bg-white border border-gray-200 rounded-lg p-2">
            <Pagination
              currentPage={currentPage}
              totalPages={Math.ceil(filteredReports.length / 10)}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportList;