import React, { useState, useRef, useCallback } from 'react';
import { 
  X, 
  Link, 
  Globe, 
  AlertCircle, 
  CheckCircle, 
  Loader2,
  Settings,
  Monitor,
  Plus,
  Trash2,
  Download,
  Clock,
  FileText,
  Layers3,
  Database
} from 'lucide-react';
import SSEProgressMonitor from '../../common/SSEProgressMonitor';
import ProgressIndicator, { ProgressStatus, ProgressStage } from '../../common/ProgressIndicator';
import { useSSEConnection, SSEMessage } from '../../../hooks/common/useSSEConnection';
import SplitterStrategySelector from './SplitterStrategySelector';
import StrategyPreviewCard from './StrategyPreviewCard';

// URL导入状态
interface URLImportState {
  url: string;
  id: string;
  status: 'pending' | 'fetching' | 'processing' | 'completed' | 'error';
  progress: number;
  stage: ProgressStage;
  message: string;
  taskId?: string;
  error?: string;
  // 爬取结果
  title?: string;
  contentType?: string;
  contentLength?: number;
  totalChunks?: number;
  processedChunks?: number;
  vectorCount?: number;
  startTime?: Date;
  endTime?: Date;
  // 网站信息
  favicon?: string;
  description?: string;
  siteName?: string;
}

// 批量URL配置
interface BatchURLConfig {
  urls: string[];
  maxDepth: number;
  followLinks: boolean;
  domainRestricted: boolean;
  excludePatterns: string[];
  includePatterns: string[];
  respectRobots: boolean;
  crawlDelay: number;
}

// 组件属性
interface URLImporterProps {
  knowledgeBaseId: string;
  userId: string;
  onImportComplete?: (results: any[]) => void;
  onClose?: () => void;
  messageServiceUrl?: string;
  apiBaseUrl?: string;
  allowBatch?: boolean;
}

/**
 * URL导入组件
 * 支持单个URL和批量爬虫，集成切分策略和SSE监控
 */
const URLImporter: React.FC<URLImporterProps> = ({
  knowledgeBaseId,
  userId,
  onImportComplete,
  onClose,
  messageServiceUrl = 'http://localhost:8089',
  apiBaseUrl = 'http://localhost:8082',
  allowBatch = true
}) => {
  // URL导入状态
  const [urls, setUrls] = useState<URLImportState[]>([]);
  const [currentUrl, setCurrentUrl] = useState<string>('');
  const [importing, setImporting] = useState(false);
  
  // UI状态
  const [activeTab, setActiveTab] = useState<'single' | 'batch' | 'strategy' | 'monitor'>('single');
  const [showStrategySelector, setShowStrategySelector] = useState(false);
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);
  
  // 批量配置
  const [batchConfig, setBatchConfig] = useState<BatchURLConfig>({
    urls: [],
    maxDepth: 2,
    followLinks: false,
    domainRestricted: true,
    excludePatterns: [],
    includePatterns: [],
    respectRobots: true,
    crawlDelay: 1000
  });
  
  // 策略配置
  const [splitterStrategyId, setSplitterStrategyId] = useState<string>('token_basic');
  const [importSettings, setImportSettings] = useState({
    chunkSize: 1000,
    chunkOverlap: 200,
    chunkStrategy: 'token_based',
    preserveStructure: true
  });

  const inputRef = useRef<HTMLInputElement>(null);

  // SSE连接
  const { 
    connectionStatus, 
    messages, 
    isConnected 
  } = useSSEConnection({
    userId,
    messageServiceUrl,
    autoConnect: true,
    onMessage: handleSSEMessage
  });

  // 处理SSE消息
  function handleSSEMessage(message: SSEMessage) {
    const taskId = message.data.task_id;
    if (!taskId) return;

    setUrls(prevUrls => 
      prevUrls.map(urlItem => {
        if (urlItem.taskId !== taskId) return urlItem;

        switch (message.type) {
          case 'progress':
            return {
              ...urlItem,
              status: message.data.stage === 'fetch' ? 'fetching' : 'processing',
              progress: message.data.progress || 0,
              stage: (message.data.stage as ProgressStage) || '',
              message: message.data.message || '',
              totalChunks: message.data.details?.total_chunks || urlItem.totalChunks,
              processedChunks: message.data.details?.processed_chunks || urlItem.processedChunks,
              contentLength: message.data.details?.content_length || urlItem.contentLength,
              contentType: message.data.details?.content_type || urlItem.contentType
            };
          case 'success':
            return {
              ...urlItem,
              status: 'completed',
              progress: 100,
              stage: 'finalize',
              message: message.data.message || '导入完成',
              endTime: new Date(),
              vectorCount: message.data.result?.vector_count || urlItem.vectorCount,
              totalChunks: message.data.result?.total_chunks || urlItem.totalChunks,
              processedChunks: message.data.result?.processed_chunks || urlItem.totalChunks
            };
          case 'error':
            return {
              ...urlItem,
              status: 'error',
              progress: 0,
              stage: '',
              message: message.data.error_message || '导入失败',
              error: message.data.error_message
            };
          default:
            return urlItem;
        }
      })
    );
  }

  // 验证URL格式
  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  // 添加URL到列表
  const addUrl = () => {
    if (!currentUrl.trim()) return;
    
    if (!isValidUrl(currentUrl)) {
      alert('请输入有效的URL地址');
      return;
    }

    const urlExists = urls.some(item => item.url === currentUrl);
    if (urlExists) {
      alert('该URL已存在');
      return;
    }

    const newUrlItem: URLImportState = {
      url: currentUrl,
      id: `url_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      status: 'pending',
      progress: 0,
      stage: '',
      message: '准备导入',
      startTime: new Date()
    };

    setUrls(prev => [...prev, newUrlItem]);
    setCurrentUrl('');
  };

  // 批量添加URL
  const addBatchUrls = () => {
    const urlList = batchConfig.urls.filter(url => url.trim() && isValidUrl(url.trim()));
    
    if (urlList.length === 0) {
      alert('请输入有效的URL列表');
      return;
    }

    const newUrlItems: URLImportState[] = urlList.map(url => ({
      url: url.trim(),
      id: `batch_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      status: 'pending',
      progress: 0,
      stage: '',
      message: '准备批量导入',
      startTime: new Date()
    }));

    setUrls(prev => [...prev, ...newUrlItems]);
    setBatchConfig(prev => ({ ...prev, urls: [] }));
  };

  // 开始导入
  const startImport = async () => {
    const pendingUrls = urls.filter(u => u.status === 'pending');
    if (pendingUrls.length === 0) return;

    setImporting(true);

    for (const urlItem of pendingUrls) {
      try {
        setUrls(prev => 
          prev.map(u => 
            u.id === urlItem.id 
              ? { ...u, status: 'fetching', message: '正在获取内容...' }
              : u
          )
        );

        // 创建导入请求
        const requestBody = {
          urls: [urlItem.url],
          user_id: userId,
          enable_async_processing: true,
          // 切分策略配置
          ...(splitterStrategyId && splitterStrategyId !== 'token_basic' && {
            splitter_strategy_id: splitterStrategyId
          }),
          chunk_size: importSettings.chunkSize,
          chunk_overlap: importSettings.chunkOverlap,
          chunk_strategy: importSettings.chunkStrategy,
          preserve_structure: importSettings.preserveStructure,
          // 爬虫配置
          max_depth: batchConfig.maxDepth,
          follow_links: batchConfig.followLinks,
          domain_restricted: batchConfig.domainRestricted,
          exclude_patterns: batchConfig.excludePatterns,
          include_patterns: batchConfig.includePatterns,
          respect_robots: batchConfig.respectRobots,
          crawl_delay: batchConfig.crawlDelay
        };

        // 发送导入请求
        const response = await fetch(
          `${apiBaseUrl}/api/v1/knowledge-bases/${knowledgeBaseId}/documents/import-url-async`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody)
          }
        );

        if (response.ok) {
          const result = await response.json();
          
          if (result.success && result.tasks && result.tasks.length > 0) {
            const taskId = result.tasks[0].task_id;
            
            setUrls(prev => 
              prev.map(u => 
                u.id === urlItem.id 
                  ? { 
                      ...u, 
                      status: 'processing', 
                      taskId,
                      message: '内容获取成功，开始处理...',
                      progress: 10,
                      title: result.tasks[0].metadata?.title || '',
                      contentType: result.tasks[0].metadata?.content_type || '',
                      siteName: result.tasks[0].metadata?.site_name || ''
                    }
                  : u
              )
            );
          } else {
            throw new Error(result.message || '导入失败');
          }
        } else {
          const errorData = await response.json();
          throw new Error(errorData.message || `HTTP ${response.status}`);
        }

      } catch (error) {
        console.error('导入失败:', error);
        setUrls(prev => 
          prev.map(u => 
            u.id === urlItem.id 
              ? { 
                  ...u, 
                  status: 'error', 
                  message: `导入失败: ${error}`,
                  error: String(error)
                }
              : u
          )
        );
      }
    }

    setImporting(false);
  };

  // 移除URL
  const removeUrl = (id: string) => {
    setUrls(prev => prev.filter(u => u.id !== id));
  };

  // 清除所有URL
  const clearUrls = () => {
    setUrls([]);
  };

  // 获取网站图标
  const getFavicon = (url: string) => {
    try {
      const domain = new URL(url).hostname;
      return `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;
    } catch {
      return '';
    }
  };

  // 格式化文件大小
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // 计算统计信息
  const totalUrls = urls.length;
  const completedUrls = urls.filter(u => u.status === 'completed').length;
  const processingUrls = urls.filter(u => u.status === 'processing' || u.status === 'fetching').length;
  const errorUrls = urls.filter(u => u.status === 'error').length;
  const totalProgress = urls.length > 0 
    ? Math.round(urls.reduce((sum, url) => sum + url.progress, 0) / urls.length)
    : 0;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[95vh] overflow-hidden flex flex-col">
        {/* 头部 */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-3">
            <Globe className="w-6 h-6 text-blue-600" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900">URL导入</h2>
              <p className="text-sm text-gray-500">
                导入网页内容到知识库，支持智能爬虫和实时监控
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            {/* SSE连接状态 */}
            <div className="flex items-center space-x-2">
              {isConnected ? (
                <div className="flex items-center space-x-1 text-green-600 bg-green-50 px-2 py-1 rounded">
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-xs">实时连接</span>
                </div>
              ) : (
                <div className="flex items-center space-x-1 text-gray-500 bg-gray-50 px-2 py-1 rounded">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-xs">连接中</span>
                </div>
              )}
            </div>
            
            <button 
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 标签页导航 */}
        <div className="flex items-center space-x-1 p-4 bg-gray-50 border-b">
          {[
            { key: 'single', label: '单个导入', icon: Link },
            ...(allowBatch ? [{ key: 'batch', label: '批量爬虫', icon: Globe }] : []),
            { key: 'strategy', label: '策略配置', icon: Settings },
            { key: 'monitor', label: '进度监控', icon: Monitor }
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab.key
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* 主内容区域 */}
        <div className="flex-1 overflow-auto">
          {activeTab === 'single' && (
            <div className="p-6">
              {/* URL输入 */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  网页URL地址
                </label>
                <div className="flex space-x-3">
                  <div className="flex-1 relative">
                    <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      ref={inputRef}
                      type="url"
                      value={currentUrl}
                      onChange={(e) => setCurrentUrl(e.target.value)}
                      placeholder="https://example.com/article"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      onKeyPress={(e) => e.key === 'Enter' && addUrl()}
                    />
                  </div>
                  <button
                    onClick={addUrl}
                    disabled={!currentUrl.trim()}
                    className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>添加</span>
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  支持网页、PDF、文档等多种在线内容
                </p>
              </div>

              {/* 快速策略预览 */}
              {!showStrategySelector && (
                <div className="mb-6">
                  <StrategyPreviewCard
                    strategy={{
                      id: splitterStrategyId,
                      name: splitterStrategyId === 'token_basic' ? '基础Token分块' : 
                            splitterStrategyId === 'semantic_smart' ? '语义分块' : '智能自适应',
                      type: importSettings.chunkStrategy as any,
                      chunkSize: importSettings.chunkSize,
                      chunkOverlap: importSettings.chunkOverlap,
                      preserveStructure: importSettings.preserveStructure
                    }}
                    showDetails={false}
                    onEdit={() => setActiveTab('strategy')}
                  />
                </div>
              )}

              {/* URL列表 */}
              {urls.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium text-gray-900">
                      导入列表 ({totalUrls})
                    </h4>
                    
                    <div className="flex items-center space-x-3">
                      <div className="text-sm text-gray-600">
                        ✅ {completedUrls} • 🔄 {processingUrls} • ❌ {errorUrls}
                      </div>
                      {urls.filter(u => u.status === 'pending').length > 0 && (
                        <button
                          onClick={startImport}
                          disabled={!isConnected || importing}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
                        >
                          <Download className="w-4 h-4" />
                          <span>开始导入 ({urls.filter(u => u.status === 'pending').length})</span>
                        </button>
                      )}
                      <button
                        onClick={clearUrls}
                        className="text-sm text-red-600 hover:text-red-700"
                      >
                        清空
                      </button>
                    </div>
                  </div>

                  {/* 总体进度 */}
                  {processingUrls > 0 && (
                    <div className="mb-4">
                      <ProgressIndicator
                        progress={totalProgress}
                        status={errorUrls > 0 ? 'error' : processingUrls > 0 ? 'processing' : 'completed'}
                        stage=""
                        message={`总进度: ${completedUrls}/${totalUrls} 个URL已完成`}
                        size="sm"
                      />
                    </div>
                  )}

                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {urls.map(urlItem => (
                      <div key={urlItem.id} className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                        <div className="flex-shrink-0">
                          {urlItem.favicon || getFavicon(urlItem.url) ? (
                            <img 
                              src={urlItem.favicon || getFavicon(urlItem.url)} 
                              alt="favicon"
                              className="w-8 h-8 rounded"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                              }}
                            />
                          ) : (
                            <Globe className="w-8 h-8 text-blue-500" />
                          )}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {urlItem.title || urlItem.url}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {urlItem.url}
                          </p>
                          
                          {urlItem.contentLength && (
                            <p className="text-xs text-gray-500">
                              大小: {formatFileSize(urlItem.contentLength)}
                              {urlItem.contentType && ` • 类型: ${urlItem.contentType}`}
                              {urlItem.taskId && ` • 任务: ${urlItem.taskId.slice(-8)}`}
                            </p>
                          )}
                          
                          {(urlItem.status === 'processing' || urlItem.status === 'fetching') && (
                            <div className="mt-2">
                              <ProgressIndicator
                                progress={urlItem.progress}
                                status={urlItem.status as ProgressStatus}
                                stage={urlItem.stage}
                                message={urlItem.message}
                                size="sm"
                                showDetails={false}
                              />
                            </div>
                          )}
                          
                          {urlItem.status === 'error' && (
                            <div className="mt-1 flex items-center space-x-1 text-red-600">
                              <AlertCircle className="w-3 h-3" />
                              <span className="text-xs">{urlItem.error}</span>
                            </div>
                          )}
                          
                          {urlItem.status === 'completed' && (
                            <div className="mt-1 flex items-center space-x-1 text-green-600">
                              <CheckCircle className="w-3 h-3" />
                              <span className="text-xs">
                                导入完成 • {urlItem.totalChunks || 0} 个块
                                {urlItem.vectorCount && ` • ${urlItem.vectorCount} 个向量`}
                              </span>
                            </div>
                          )}
                        </div>
                        
                        <button
                          onClick={() => removeUrl(urlItem.id)}
                          className="p-1 text-gray-400 hover:text-red-500 rounded"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'batch' && allowBatch && (
            <div className="p-6">
              <div className="space-y-6">
                {/* 批量URL输入 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    批量URL列表
                  </label>
                  <textarea
                    value={batchConfig.urls.join('\n')}
                    onChange={(e) => setBatchConfig(prev => ({
                      ...prev,
                      urls: e.target.value.split('\n').filter(Boolean)
                    }))}
                    placeholder="https://example.com/page1&#10;https://example.com/page2&#10;https://example.com/page3"
                    className="w-full h-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    每行输入一个URL地址
                  </p>
                </div>

                {/* 爬虫配置 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      爬取深度
                    </label>
                    <input
                      type="number"
                      value={batchConfig.maxDepth}
                      onChange={(e) => setBatchConfig(prev => ({
                        ...prev,
                        maxDepth: parseInt(e.target.value) || 1
                      }))}
                      min="1"
                      max="5"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      爬取延迟 (毫秒)
                    </label>
                    <input
                      type="number"
                      value={batchConfig.crawlDelay}
                      onChange={(e) => setBatchConfig(prev => ({
                        ...prev,
                        crawlDelay: parseInt(e.target.value) || 1000
                      }))}
                      min="500"
                      max="10000"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                </div>

                {/* 爬虫选项 */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="followLinks"
                      checked={batchConfig.followLinks}
                      onChange={(e) => setBatchConfig(prev => ({
                        ...prev,
                        followLinks: e.target.checked
                      }))}
                      className="rounded"
                    />
                    <label htmlFor="followLinks" className="text-sm text-gray-700">
                      跟踪页面链接
                    </label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="domainRestricted"
                      checked={batchConfig.domainRestricted}
                      onChange={(e) => setBatchConfig(prev => ({
                        ...prev,
                        domainRestricted: e.target.checked
                      }))}
                      className="rounded"
                    />
                    <label htmlFor="domainRestricted" className="text-sm text-gray-700">
                      限制在同一域名
                    </label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="respectRobots"
                      checked={batchConfig.respectRobots}
                      onChange={(e) => setBatchConfig(prev => ({
                        ...prev,
                        respectRobots: e.target.checked
                      }))}
                      className="rounded"
                    />
                    <label htmlFor="respectRobots" className="text-sm text-gray-700">
                      遵守robots.txt
                    </label>
                  </div>
                </div>

                <button
                  onClick={addBatchUrls}
                  disabled={batchConfig.urls.length === 0}
                  className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
                >
                  <Plus className="w-5 h-5" />
                  <span>添加到导入列表 ({batchConfig.urls.length} 个URL)</span>
                </button>
              </div>
            </div>
          )}

          {activeTab === 'strategy' && (
            <div className="p-6">
              <SplitterStrategySelector
                selectedStrategyId={splitterStrategyId}
                onStrategyChange={setSplitterStrategyId}
                customSettings={importSettings}
                onSettingsChange={setImportSettings}
                knowledgeBaseId={knowledgeBaseId}
                apiBaseUrl={apiBaseUrl}
                disabled={importing || processingUrls > 0}
              />
            </div>
          )}

          {activeTab === 'monitor' && (
            <div className="p-6">
              <SSEProgressMonitor
                userId={userId}
                messageServiceUrl={messageServiceUrl}
                className="border-none shadow-none"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default URLImporter;