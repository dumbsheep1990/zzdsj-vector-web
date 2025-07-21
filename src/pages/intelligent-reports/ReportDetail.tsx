import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  FileText, 
  ArrowLeft,
  Download,
  Edit,
  Share,
  Eye,
  Calendar,
  User,
  Clock,
  Star,
  CheckCircle,
  AlertCircle,
  Copy,
  Printer,
  ExternalLink,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  BookOpen,
  BarChart3,
  Settings,
  Maximize2,
  Minimize2,
  X
} from 'lucide-react';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Textarea } from '../../components/ui/Textarea';
import { StatsCard } from '../../components/ui/StatsCard';
import { Tabs } from '../../components/ui/Tabs';

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
  TECHNICAL = 'technical',
  BUSINESS = 'business',
  CUSTOM = 'custom'
}

interface ReportComment {
  id: string;
  author: string;
  content: string;
  timestamp: string;
  likes: number;
  dislikes: number;
  replies: ReportComment[];
}

interface ReportVersion {
  id: string;
  version: string;
  description: string;
  createdAt: string;
  changes: string[];
}

interface ReportSection {
  id: string;
  title: string;
  content: string;
  order: number;
  type: 'text' | 'chart' | 'table' | 'image';
  metadata?: any;
}

interface ReportData {
  id: string;
  title: string;
  description: string;
  type: ReportType;
  status: ReportStatus;
  format: string;
  content: string;
  sections: ReportSection[];
  wordCount: number;
  qualityScore: number;
  readingTime: number;
  viewCount: number;
  downloadCount: number;
  shareCount: number;
  rating: number;
  ratingCount: number;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  userId: string;
  userDisplayName: string;
  isPublic: boolean;
  isFeatured: boolean;
  tags: string[];
  generationTime?: number;
  agentId: string;
  agentName: string;
  templateId?: string;
  templateName?: string;
  versions: ReportVersion[];
  comments: ReportComment[];
}

const mockReport: ReportData = {
  id: '1',
  title: '2024年人工智能发展趋势分析报告',
  description: '深度分析人工智能技术发展趋势，涵盖机器学习、深度学习、自然语言处理等关键领域',
  type: ReportType.ANALYSIS,
  status: ReportStatus.COMPLETED,
  format: 'HTML',
  content: `
# 2024年人工智能发展趋势分析报告

## 执行摘要

人工智能技术在2024年迎来了前所未有的发展机遇。本报告通过对全球AI技术发展现状的深入分析，识别出以下关键趋势：

1. **大语言模型(LLM)的普及与优化**
   - GPT-4、Claude等模型的广泛应用
   - 模型参数优化和推理效率提升
   - 多模态能力的突破性进展

2. **AI芯片与硬件加速**
   - 专用AI芯片的性能提升
   - 边缘计算设备的AI能力增强
   - 量子计算在AI领域的初步应用

3. **行业应用的深度融合**
   - 医疗健康领域的AI诊断系统
   - 金融科技中的智能风控
   - 制造业的智能化升级

## 技术发展现状

### 机器学习算法进展

近年来，机器学习算法在以下方面取得了显著进展：

- **深度学习架构创新**：Transformer架构的广泛应用推动了NLP和CV领域的突破
- **自监督学习**：减少了对标注数据的依赖，提高了模型的泛化能力
- **联邦学习**：在保护数据隐私的同时实现分布式模型训练

### 大语言模型发展

大语言模型成为AI领域的重要驱动力：

- **参数规模增长**：从GPT-3的1750亿参数到GPT-4的万亿级参数
- **多模态融合**：文本、图像、音频的统一处理能力
- **推理能力提升**：复杂逻辑推理和数学计算能力的显著改善

## 市场分析

### 全球AI市场规模

根据最新市场研究数据：

- 2024年全球AI市场规模预计达到3840亿美元
- 年复合增长率(CAGR)达到37.3%
- 中国AI市场占全球份额的23.6%

### 投资趋势分析

AI投资呈现以下特点：

- **垂直应用**：特定行业的AI解决方案获得更多关注
- **基础设施**：AI芯片和云计算平台投资持续增长
- **开源生态**：开源AI项目获得企业和投资者青睐

## 技术挑战与机遇

### 主要挑战

1. **计算资源需求**
   - 大模型训练需要大量GPU资源
   - 推理成本居高不下
   - 能耗问题日益突出

2. **数据质量与隐私**
   - 高质量训练数据稀缺
   - 数据隐私保护要求严格
   - 跨域数据共享困难

3. **模型可解释性**
   - 黑盒模型的决策过程不透明
   - 关键应用场景的可信度要求
   - 监管合规挑战

### 发展机遇

1. **技术融合创新**
   - AI与5G/6G的结合
   - 边缘计算与AI的深度融合
   - 区块链技术在AI中的应用

2. **产业数字化转型**
   - 传统行业AI化升级需求
   - 新兴产业的AI原生应用
   - 政府数字化治理推动

## 未来发展预测

### 短期预测（1-2年）

- **模型效率优化**：轻量化模型和推理加速技术成熟
- **应用场景扩展**：AI助手、代码生成、创意设计等领域快速发展
- **标准化进程**：AI安全、伦理、技术标准逐步建立

### 中期预测（3-5年）

- **通用人工智能(AGI)雏形**：多模态、多任务的通用AI系统出现
- **人机协作深化**：AI成为人类工作和生活的重要伙伴
- **监管框架成熟**：完善的AI治理体系建立

### 长期预测（5-10年）

- **技术突破**：量子计算、神经形态计算等新技术推动AI发展
- **社会变革**：AI对就业、教育、社会结构产生深远影响
- **全球合作**：国际AI治理合作机制建立

## 结论与建议

### 主要结论

1. AI技术正处于快速发展期，大语言模型成为重要驱动力
2. 产业应用是AI发展的主要方向，垂直领域机会巨大
3. 技术挑战与机遇并存，需要平衡发展与风险管理

### 发展建议

1. **加强基础研究**：投入更多资源进行AI基础理论研究
2. **推进产业应用**：鼓励AI技术在各行业的创新应用
3. **完善治理体系**：建立健全AI伦理和安全监管框架
4. **培养专业人才**：加强AI人才培养和引进力度
5. **促进国际合作**：参与全球AI治理和标准制定

---

*本报告基于公开数据和专业分析，仅供参考。如需获取最新信息，请关注相关官方发布。*
  `,
  sections: [
    {
      id: '1',
      title: '执行摘要',
      content: '人工智能技术在2024年迎来了前所未有的发展机遇...',
      order: 1,
      type: 'text'
    },
    {
      id: '2',
      title: '技术发展现状',
      content: '近年来，机器学习算法在以下方面取得了显著进展...',
      order: 2,
      type: 'text'
    },
    {
      id: '3',
      title: '市场分析',
      content: '根据最新市场研究数据，2024年全球AI市场规模预计达到3840亿美元...',
      order: 3,
      type: 'chart'
    }
  ],
  wordCount: 15000,
  qualityScore: 92,
  readingTime: 25,
  viewCount: 158,
  downloadCount: 23,
  shareCount: 12,
  rating: 4.8,
  ratingCount: 25,
  createdAt: '2024-01-15',
  updatedAt: '2024-01-15',
  completedAt: '2024-01-15',
  userId: 'user1',
  userDisplayName: '张三',
  isPublic: true,
  isFeatured: true,
  tags: ['AI', '技术趋势', '分析报告'],
  generationTime: 420,
  agentId: 'agent1',
  agentName: 'Multi-Agent Collaborator',
  templateId: 'template1',
  templateName: '技术分析报告模板',
  versions: [
    {
      id: '1',
      version: '1.0',
      description: '初始版本',
      createdAt: '2024-01-15',
      changes: ['创建报告', '添加基础内容']
    },
    {
      id: '2',
      version: '1.1',
      description: '添加市场分析章节',
      createdAt: '2024-01-15',
      changes: ['添加市场分析', '更新数据源']
    }
  ],
  comments: [
    {
      id: '1',
      author: '李四',
      content: '报告质量很高，数据分析很全面，对我的工作很有帮助！',
      timestamp: '2024-01-16 10:30:00',
      likes: 5,
      dislikes: 0,
      replies: [
        {
          id: '2',
          author: '王五',
          content: '同意，特别是对未来趋势的预测很有见地。',
          timestamp: '2024-01-16 11:00:00',
          likes: 2,
          dislikes: 0,
          replies: []
        }
      ]
    },
    {
      id: '3',
      author: '赵六',
      content: '建议在技术挑战部分增加更多具体案例。',
      timestamp: '2024-01-16 14:20:00',
      likes: 3,
      dislikes: 1,
      replies: []
    }
  ]
};

const ReportDetail: React.FC = () => {
  const { reportId } = useParams<{ reportId: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('content');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [userRating, setUserRating] = useState(0);
  const [showShareModal, setShowShareModal] = useState(false);

  const getStatusColor = (status: ReportStatus) => {
    switch (status) {
      case ReportStatus.COMPLETED: return 'bg-green-100 text-green-800 border-green-200';
      case ReportStatus.GENERATING: return 'bg-blue-100 text-blue-800 border-blue-200';
      case ReportStatus.DRAFT: return 'bg-gray-100 text-gray-800 border-gray-200';
      case ReportStatus.FAILED: return 'bg-red-100 text-red-800 border-red-200';
      case ReportStatus.CANCELLED: return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

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

  const getTypeText = (type: ReportType) => {
    switch (type) {
      case ReportType.RESEARCH: return '研究报告';
      case ReportType.ANALYSIS: return '分析报告';
      case ReportType.SUMMARY: return '总结报告';
      case ReportType.COMPARISON: return '对比报告';
      case ReportType.TECHNICAL: return '技术报告';
      case ReportType.BUSINESS: return '商业报告';
      case ReportType.CUSTOM: return '自定义报告';
      default: return '未知类型';
    }
  };

  const handleBack = () => {
    navigate('/intelligent-reports/report-list');
  };

  const handleEdit = () => {
    navigate(`/intelligent-reports/report-generate?edit=${reportId}`);
  };

  const handleDownload = () => {
    // 实现下载功能
    console.log('Download report:', reportId);
  };

  const handleShare = () => {
    setShowShareModal(true);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('链接已复制到剪贴板');
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    
    const comment: ReportComment = {
      id: Date.now().toString(),
      author: 'Current User',
      content: newComment,
      timestamp: new Date().toLocaleString(),
      likes: 0,
      dislikes: 0,
      replies: []
    };
    
    // 这里应该调用API添加评论
    console.log('Add comment:', comment);
    setNewComment('');
  };

  const handleRating = (rating: number) => {
    setUserRating(rating);
    // 这里应该调用API提交评分
    console.log('Submit rating:', rating);
  };

  const handleLikeComment = (commentId: string) => {
    // 实现点赞功能
    console.log('Like comment:', commentId);
  };

  const handleDislikeComment = (commentId: string) => {
    // 实现点踩功能
    console.log('Dislike comment:', commentId);
  };

  const tabs = [
    { id: 'content', label: '报告内容', icon: FileText },
    { id: 'info', label: '报告信息', icon: Eye },
    { id: 'analytics', label: '数据分析', icon: BarChart3 },
    { id: 'comments', label: '评论反馈', icon: MessageSquare },
    { id: 'versions', label: '版本历史', icon: BookOpen }
  ];

  if (!mockReport) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">报告未找到</h2>
          <p className="text-gray-600 mb-4">请检查报告ID是否正确</p>
          <Button onClick={handleBack}>返回报告列表</Button>
        </div>
      </div>
    );
  }

  return (
    <div className={`${isFullscreen ? 'fixed inset-0 bg-white z-50 overflow-auto' : 'p-6 max-w-7xl mx-auto'}`}>
      {/* 页面标题 */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={handleBack}
            className="p-2"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <FileText className="w-8 h-8 text-blue-600" />
              {mockReport.title}
            </h1>
            <div className="flex items-center gap-4 mt-2">
              <Badge className={getStatusColor(mockReport.status)}>
                {getStatusText(mockReport.status)}
              </Badge>
              <Badge variant="outline">
                {getTypeText(mockReport.type)}
              </Badge>
              <Badge variant="outline">
                {mockReport.format}
              </Badge>
              {mockReport.isFeatured && (
                <Star className="w-4 h-4 text-yellow-500 fill-current" />
              )}
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </Button>
          <Button
            variant="outline"
            onClick={handlePrint}
            className="flex items-center gap-2"
          >
            <Printer className="w-4 h-4" />
            打印
          </Button>
          <Button
            variant="outline"
            onClick={handleShare}
            className="flex items-center gap-2"
          >
            <Share className="w-4 h-4" />
            分享
          </Button>
          <Button
            variant="outline"
            onClick={handleDownload}
            className="flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            下载
          </Button>
          <Button
            onClick={handleEdit}
            className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
          >
            <Edit className="w-4 h-4" />
            编辑
          </Button>
        </div>
      </div>

      {/* 报告基本信息 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="text-sm text-gray-600">字数</div>
            <div className="text-lg font-bold">{mockReport.wordCount.toLocaleString()}</div>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="text-sm text-gray-600">质量评分</div>
            <div className="text-lg font-bold text-green-600">{mockReport.qualityScore}/100</div>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="text-sm text-gray-600">阅读时间</div>
            <div className="text-lg font-bold">{mockReport.readingTime}分钟</div>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="text-sm text-gray-600">浏览量</div>
            <div className="text-lg font-bold">{mockReport.viewCount}</div>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="text-sm text-gray-600">下载量</div>
            <div className="text-lg font-bold">{mockReport.downloadCount}</div>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="text-sm text-gray-600">评分</div>
            <div className="text-lg font-bold text-yellow-600 flex items-center gap-1">
              <Star className="w-4 h-4 fill-current" />
              {mockReport.rating}
            </div>
          </div>
        </div>
      </div>

      {/* 标签页 */}
      <Tabs
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* 报告内容 */}
      {activeTab === 'content' && (
        <div className="mt-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6">
              <div className="prose max-w-none">
                <div dangerouslySetInnerHTML={{ __html: mockReport.content.replace(/\n/g, '<br/>') }} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 报告信息 */}
      {activeTab === 'info' && (
        <div className="mt-6 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">基本信息</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">报告ID:</span>
                  <span className="font-medium">{mockReport.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">创建者:</span>
                  <span className="font-medium">{mockReport.userDisplayName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">创建时间:</span>
                  <span className="font-medium">{mockReport.createdAt}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">更新时间:</span>
                  <span className="font-medium">{mockReport.updatedAt}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">完成时间:</span>
                  <span className="font-medium">{mockReport.completedAt || '未完成'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">生成时间:</span>
                  <span className="font-medium">{mockReport.generationTime ? `${mockReport.generationTime}秒` : '未知'}</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">技术信息</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">执行智能体:</span>
                  <span className="font-medium">{mockReport.agentName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">使用模板:</span>
                  <span className="font-medium">{mockReport.templateName || '无'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">输出格式:</span>
                  <span className="font-medium">{mockReport.format}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">公开状态:</span>
                  <span className="font-medium">{mockReport.isPublic ? '公开' : '私有'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">推荐状态:</span>
                  <span className="font-medium">{mockReport.isFeatured ? '已推荐' : '未推荐'}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">标签</h3>
            <div className="flex flex-wrap gap-2">
              {mockReport.tags.map(tag => (
                <Badge key={tag} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">报告描述</h3>
            <p className="text-gray-600">{mockReport.description}</p>
          </div>
        </div>
      )}

      {/* 数据分析 */}
      {activeTab === 'analytics' && (
        <div className="mt-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <StatsCard
              title="浏览量"
              value={mockReport.viewCount.toString()}
              subtitle="总浏览次数"
              icon={Eye}
              color="blue"
            />
            <StatsCard
              title="下载量"
              value={mockReport.downloadCount.toString()}
              subtitle="总下载次数"
              icon={Download}
              color="green"
            />
            <StatsCard
              title="分享量"
              value={mockReport.shareCount.toString()}
              subtitle="总分享次数"
              icon={Share}
              color="purple"
            />
            <StatsCard
              title="评论数"
              value={mockReport.comments.length.toString()}
              subtitle="用户评论"
              icon={MessageSquare}
              color="orange"
            />
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">用户评分</h3>
            <div className="flex items-center gap-4">
              <div className="text-4xl font-bold text-yellow-600">{mockReport.rating}</div>
              <div>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map(star => (
                    <Star 
                      key={star} 
                      className={`w-5 h-5 ${star <= mockReport.rating ? 'text-yellow-500 fill-current' : 'text-gray-300'}`} 
                    />
                  ))}
                </div>
                <div className="text-sm text-gray-600">{mockReport.ratingCount} 个评分</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">内容分析</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm text-gray-600">总字数</div>
                <div className="text-2xl font-bold">{mockReport.wordCount.toLocaleString()}</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm text-gray-600">章节数</div>
                <div className="text-2xl font-bold">{mockReport.sections.length}</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm text-gray-600">预计阅读时间</div>
                <div className="text-2xl font-bold">{mockReport.readingTime}分钟</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 评论反馈 */}
      {activeTab === 'comments' && (
        <div className="mt-6 space-y-6">
          {/* 评分区域 */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">为这个报告评分</h3>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  onClick={() => handleRating(star)}
                  className="p-1"
                >
                  <Star 
                    className={`w-8 h-8 ${star <= userRating ? 'text-yellow-500 fill-current' : 'text-gray-300'}`} 
                  />
                </button>
              ))}
              <span className="ml-2 text-sm text-gray-600">点击星星进行评分</span>
            </div>
          </div>

          {/* 评论输入 */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">添加评论</h3>
            <div className="space-y-4">
              <Textarea
                placeholder="请输入您的评论..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                rows={4}
              />
              <div className="flex justify-end">
                <Button onClick={handleAddComment}>
                  发布评论
                </Button>
              </div>
            </div>
          </div>

          {/* 评论列表 */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              用户评论 ({mockReport.comments.length})
            </h3>
            <div className="space-y-6">
              {mockReport.comments.map(comment => (
                <div key={comment.id} className="border-b border-gray-200 pb-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{comment.author}</div>
                        <div className="text-sm text-gray-500">{comment.timestamp}</div>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-gray-700 mb-3">{comment.content}</p>
                  
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => handleLikeComment(comment.id)}
                      className="flex items-center gap-1 text-sm text-gray-600 hover:text-green-600"
                    >
                      <ThumbsUp className="w-4 h-4" />
                      {comment.likes}
                    </button>
                    <button
                      onClick={() => handleDislikeComment(comment.id)}
                      className="flex items-center gap-1 text-sm text-gray-600 hover:text-red-600"
                    >
                      <ThumbsDown className="w-4 h-4" />
                      {comment.dislikes}
                    </button>
                  </div>
                  
                  {comment.replies.length > 0 && (
                    <div className="ml-8 mt-4 space-y-3">
                      {comment.replies.map(reply => (
                        <div key={reply.id} className="bg-gray-50 p-3 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
                              <User className="w-3 h-3 text-gray-600" />
                            </div>
                            <span className="font-medium text-gray-900">{reply.author}</span>
                            <span className="text-xs text-gray-500">{reply.timestamp}</span>
                          </div>
                          <p className="text-sm text-gray-700">{reply.content}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 版本历史 */}
      {activeTab === 'versions' && (
        <div className="mt-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">版本历史</h3>
            <div className="space-y-4">
              {mockReport.versions.map((version, index) => (
                <div key={version.id} className="border-l-4 border-blue-600 pl-4">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h4 className="font-medium text-gray-900">版本 {version.version}</h4>
                      <p className="text-sm text-gray-600">{version.description}</p>
                    </div>
                    <div className="text-sm text-gray-500">{version.createdAt}</div>
                  </div>
                  <div className="mt-2">
                    <h5 className="text-sm font-medium text-gray-700 mb-1">更新内容:</h5>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {version.changes.map((change, changeIndex) => (
                        <li key={changeIndex} className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          {change}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 分享模态框 */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full m-4">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">分享报告</h3>
                <Button
                  variant="ghost"
                  onClick={() => setShowShareModal(false)}
                  className="p-2"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    分享链接
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={window.location.href}
                      readOnly
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                    />
                    <Button onClick={handleCopyLink}>
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setShowShareModal(false)}>
                    取消
                  </Button>
                  <Button onClick={handleCopyLink}>
                    复制链接
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportDetail;