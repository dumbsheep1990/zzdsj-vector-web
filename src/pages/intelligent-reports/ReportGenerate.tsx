import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FileText, 
  Plus, 
  Settings, 
  Zap, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Play,
  Pause,
  X,
  Eye,
  Download,
  ArrowLeft
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { Badge } from '../../components/ui/Badge';
import DropdownMenu from '../../components/ui/DropdownMenu';
import { Tabs } from '../../components/ui/Tabs';

// 报告类型和格式
enum ReportType {
  RESEARCH = 'research',
  ANALYSIS = 'analysis',
  SUMMARY = 'summary',
  COMPARISON = 'comparison',
  TECHNICAL = 'technical',
  BUSINESS = 'business',
  CUSTOM = 'custom'
}

enum ReportFormat {
  HTML = 'html',
  PDF = 'pdf',
  MARKDOWN = 'markdown',
  DOCX = 'docx'
}

// 任务状态
enum TaskStatus {
  NOT_STARTED = 'not_started',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  BLOCKED = 'blocked',
  FAILED = 'failed'
}

interface TaskStep {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  progress: number;
  startTime?: string;
  endTime?: string;
  result?: string;
  error?: string;
}

const ReportGenerate: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('config');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    query: '',
    type: ReportType.CUSTOM,
    format: ReportFormat.HTML,
    outline: [] as string[],
    tags: [] as string[],
    isPublic: false,
    agentId: '',
    config: {
      temperature: 0.7,
      maxTokens: 2000,
      includeCharts: true,
      includeImages: true,
      language: 'zh-CN',
      style: 'professional'
    }
  });
  
  const [newOutlineItem, setNewOutlineItem] = useState('');
  const [newTag, setNewTag] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [taskSteps, setTaskSteps] = useState<TaskStep[]>([]);
  const [currentStep, setCurrentStep] = useState<string | null>(null);
  const [generatedReport, setGeneratedReport] = useState<any>(null);
  const [logs, setLogs] = useState<string[]>([]);

  // 模拟任务步骤
  const mockTaskSteps: TaskStep[] = [
    {
      id: '1',
      title: '需求分析',
      description: '分析用户需求，确定报告结构和内容范围',
      status: TaskStatus.NOT_STARTED,
      progress: 0
    },
    {
      id: '2',
      title: '信息收集',
      description: '从各种数据源收集相关信息和资料',
      status: TaskStatus.NOT_STARTED,
      progress: 0
    },
    {
      id: '3',
      title: '数据分析',
      description: '对收集的信息进行深度分析和处理',
      status: TaskStatus.NOT_STARTED,
      progress: 0
    },
    {
      id: '4',
      title: '内容生成',
      description: '基于分析结果生成报告内容',
      status: TaskStatus.NOT_STARTED,
      progress: 0
    },
    {
      id: '5',
      title: '格式整理',
      description: '整理报告格式，添加图表和样式',
      status: TaskStatus.NOT_STARTED,
      progress: 0
    },
    {
      id: '6',
      title: '质量检查',
      description: '检查报告质量和完整性',
      status: TaskStatus.NOT_STARTED,
      progress: 0
    }
  ];

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

  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case TaskStatus.COMPLETED: return 'text-green-600';
      case TaskStatus.IN_PROGRESS: return 'text-blue-600';
      case TaskStatus.BLOCKED: return 'text-red-600';
      case TaskStatus.FAILED: return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: TaskStatus) => {
    switch (status) {
      case TaskStatus.COMPLETED: return <CheckCircle className="w-4 h-4 text-green-600" />;
      case TaskStatus.IN_PROGRESS: return <Clock className="w-4 h-4 text-blue-600 animate-spin" />;
      case TaskStatus.BLOCKED: return <AlertCircle className="w-4 h-4 text-red-600" />;
      case TaskStatus.FAILED: return <X className="w-4 h-4 text-red-600" />;
      default: return <div className="w-4 h-4 rounded-full border-2 border-gray-300" />;
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleConfigChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      config: {
        ...prev.config,
        [field]: value
      }
    }));
  };

  const addOutlineItem = () => {
    if (newOutlineItem.trim()) {
      setFormData(prev => ({
        ...prev,
        outline: [...prev.outline, newOutlineItem.trim()]
      }));
      setNewOutlineItem('');
    }
  };

  const removeOutlineItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      outline: prev.outline.filter((_, i) => i !== index)
    }));
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  };

  const simulateGeneration = () => {
    setIsGenerating(true);
    setTaskSteps(mockTaskSteps);
    setGenerationProgress(0);
    setActiveTab('progress');
    
    // 模拟逐步执行
    let currentStepIndex = 0;
    const totalSteps = mockTaskSteps.length;
    
    const processStep = () => {
      if (currentStepIndex >= totalSteps) {
        setIsGenerating(false);
        setGenerationProgress(100);
        setCurrentStep(null);
        setGeneratedReport({
          id: Date.now().toString(),
          title: formData.title,
          content: '这是生成的报告内容...',
          format: formData.format,
          wordCount: 12500,
          qualityScore: 89
        });
        setActiveTab('result');
        return;
      }
      
      const step = mockTaskSteps[currentStepIndex];
      setCurrentStep(step.id);
      
      // 更新步骤状态
      setTaskSteps(prev => prev.map(s => 
        s.id === step.id 
          ? { ...s, status: TaskStatus.IN_PROGRESS, startTime: new Date().toLocaleTimeString() }
          : s
      ));
      
      // 模拟步骤执行时间
      setTimeout(() => {
        setTaskSteps(prev => prev.map(s => 
          s.id === step.id 
            ? { 
                ...s, 
                status: TaskStatus.COMPLETED, 
                progress: 100,
                endTime: new Date().toLocaleTimeString(),
                result: `${step.title}已完成`
              }
            : s
        ));
        
        const progress = ((currentStepIndex + 1) / totalSteps) * 100;
        setGenerationProgress(progress);
        
        // 添加日志
        setLogs(prev => [...prev, `${new Date().toLocaleTimeString()} - ${step.title}已完成`]);
        
        currentStepIndex++;
        setTimeout(processStep, 1000);
      }, 2000 + Math.random() * 3000);
    };
    
    processStep();
  };

  const handleGenerate = () => {
    if (!formData.title || !formData.query) {
      alert('请填写报告标题和生成需求');
      return;
    }
    
    simulateGeneration();
  };

  const handleStop = () => {
    setIsGenerating(false);
    setCurrentStep(null);
    setActiveTab('config');
  };

  const handlePreview = () => {
    // 实现预览功能
    console.log('Preview report');
  };

  const handleDownload = () => {
    // 实现下载功能
    console.log('Download report');
  };

  const handleSave = () => {
    // 实现保存功能
    console.log('Save report');
    navigate('/intelligent-reports/report-list');
  };

  const tabs = [
    { id: 'config', label: '配置', icon: Settings },
    { id: 'progress', label: '进度', icon: Clock },
    { id: 'result', label: '结果', icon: CheckCircle }
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* 页面标题 */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/intelligent-reports/report-list')}
            className="p-2"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <FileText className="w-8 h-8 text-blue-600" />
              智能报告生成
            </h1>
            <p className="text-gray-600 mt-1">配置参数，生成智能报告</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {isGenerating ? (
            <Button
              onClick={handleStop}
              variant="outline"
              className="text-red-600 border-red-200 hover:bg-red-50"
            >
              <Pause className="w-4 h-4 mr-2" />
              停止生成
            </Button>
          ) : (
            <Button
              onClick={handleGenerate}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Play className="w-4 h-4 mr-2" />
              开始生成
            </Button>
          )}
        </div>
      </div>

      {/* 标签页 */}
      <Tabs
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* 配置页面 */}
      {activeTab === 'config' && (
        <div className="mt-6 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 基本配置 */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">基本配置</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    报告标题 *
                  </label>
                  <Input
                    placeholder="请输入报告标题"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    报告描述
                  </label>
                  <Textarea
                    placeholder="请输入报告描述"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    rows={3}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    生成需求 *
                  </label>
                  <Textarea
                    placeholder="请详细描述您希望生成的报告内容和要求"
                    value={formData.query}
                    onChange={(e) => handleInputChange('query', e.target.value)}
                    rows={4}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      报告类型
                    </label>
                    <DropdownMenu
                      trigger={
                        <Button variant="outline" className="w-full justify-between">
                          {getTypeText(formData.type)}
                        </Button>
                      }
                    >
                      <div className="py-1">
                        {Object.values(ReportType).map(type => (
                          <button
                            key={type}
                            onClick={() => handleInputChange('type', type)}
                            className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                          >
                            {getTypeText(type)}
                          </button>
                        ))}
                      </div>
                    </DropdownMenu>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      输出格式
                    </label>
                    <DropdownMenu
                      trigger={
                        <Button variant="outline" className="w-full justify-between">
                          {formData.format.toUpperCase()}
                        </Button>
                      }
                    >
                      <div className="py-1">
                        {Object.values(ReportFormat).map(format => (
                          <button
                            key={format}
                            onClick={() => handleInputChange('format', format)}
                            className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                          >
                            {format.toUpperCase()}
                          </button>
                        ))}
                      </div>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            </div>
            
            {/* 报告大纲 */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">报告大纲</h3>
              
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="添加大纲项目"
                    value={newOutlineItem}
                    onChange={(e) => setNewOutlineItem(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addOutlineItem()}
                  />
                  <Button onClick={addOutlineItem}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                
                <div className="space-y-2">
                  {formData.outline.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-700">{index + 1}. {item}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeOutlineItem(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 标签管理 */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">标签管理</h3>
              
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="添加标签"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addTag()}
                  />
                  <Button onClick={addTag}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="outline"
                      className="flex items-center gap-1"
                    >
                      {tag}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeTag(tag)}
                        className="p-0 h-auto text-red-600 hover:text-red-700"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
            
            {/* 高级配置 */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">高级配置</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    创造性 (Temperature): {formData.config.temperature}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={formData.config.temperature}
                    onChange={(e) => handleConfigChange('temperature', parseFloat(e.target.value))}
                    className="w-full"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    最大字数
                  </label>
                  <Input
                    type="number"
                    value={formData.config.maxTokens}
                    onChange={(e) => handleConfigChange('maxTokens', parseInt(e.target.value))}
                  />
                </div>
                
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.config.includeCharts}
                    onChange={(e) => handleConfigChange('includeCharts', e.target.checked)}
                    className="rounded"
                  />
                  <label className="text-sm text-gray-700">包含图表</label>
                </div>
                
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.config.includeImages}
                    onChange={(e) => handleConfigChange('includeImages', e.target.checked)}
                    className="rounded"
                  />
                  <label className="text-sm text-gray-700">包含图片</label>
                </div>
                
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.isPublic}
                    onChange={(e) => handleInputChange('isPublic', e.target.checked)}
                    className="rounded"
                  />
                  <label className="text-sm text-gray-700">公开报告</label>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 进度页面 */}
      {activeTab === 'progress' && (
        <div className="mt-6 space-y-6">
          {/* 总体进度 */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">生成进度</h3>
              <span className="text-sm text-gray-600">{generationProgress.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${generationProgress}%` }}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 任务步骤 */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">执行步骤</h3>
              
              <div className="space-y-4">
                {taskSteps.map((step, index) => (
                  <div key={step.id} className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-1">
                      {getStatusIcon(step.status)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className={`font-medium ${getStatusColor(step.status)}`}>
                          {step.title}
                        </h4>
                        {step.status === TaskStatus.IN_PROGRESS && (
                          <Zap className="w-4 h-4 text-blue-600 animate-pulse" />
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{step.description}</p>
                      {step.startTime && (
                        <div className="text-xs text-gray-500 mt-1">
                          开始时间: {step.startTime}
                          {step.endTime && ` | 完成时间: ${step.endTime}`}
                        </div>
                      )}
                      {step.result && (
                        <div className="text-xs text-green-600 mt-1">
                          结果: {step.result}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* 实时日志 */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">实时日志</h3>
              
              <div className="bg-gray-900 text-green-400 p-4 rounded-lg h-64 overflow-y-auto font-mono text-sm">
                {logs.map((log, index) => (
                  <div key={index} className="mb-1">
                    {log}
                  </div>
                ))}
                {isGenerating && (
                  <div className="text-yellow-400 animate-pulse">
                    正在生成报告...
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 结果页面 */}
      {activeTab === 'result' && generatedReport && (
        <div className="mt-6 space-y-6">
          {/* 报告信息 */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">生成完成</h3>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  onClick={handlePreview}
                  className="flex items-center gap-2"
                >
                  <Eye className="w-4 h-4" />
                  预览
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
                  onClick={handleSave}
                  className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  保存报告
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm text-gray-600">字数统计</div>
                <div className="text-2xl font-bold text-gray-900">
                  {generatedReport.wordCount.toLocaleString()}
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm text-gray-600">质量评分</div>
                <div className="text-2xl font-bold text-green-600">
                  {generatedReport.qualityScore}/100
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm text-gray-600">输出格式</div>
                <div className="text-2xl font-bold text-blue-600">
                  {generatedReport.format.toUpperCase()}
                </div>
              </div>
            </div>
          </div>
          
          {/* 报告预览 */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">报告预览</h3>
            <div className="prose max-w-none">
              <h1>{generatedReport.title}</h1>
              <p className="text-gray-600">{generatedReport.content}</p>
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">
                  这是一个示例预览。实际报告内容将根据您的配置和需求动态生成。
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportGenerate;