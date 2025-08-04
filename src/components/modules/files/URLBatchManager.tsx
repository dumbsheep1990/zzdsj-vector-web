import React, { useState, useCallback } from 'react';
import { 
  Plus, 
  Trash2, 
  Download, 
  Eye, 
  Settings, 
  Globe,
  AlertCircle,
  CheckCircle,
  Clock,
  FileText,
  Link2,
  Filter,
  Search,
  MoreHorizontal
} from 'lucide-react';
import URLPreview from './URLPreview';

// URL项目信息
interface URLItem {
  id: string;
  url: string;
  title?: string;
  description?: string;
  status: 'pending' | 'previewing' | 'ready' | 'importing' | 'completed' | 'error';
  favicon?: string;
  contentType?: string;
  contentLength?: number;
  wordCount?: number;
  estimatedChunks?: number;
  siteName?: string;
  lastChecked?: Date;
  error?: string;
}

// 批量配置
interface BatchConfig {
  maxDepth: number;
  followLinks: boolean;
  domainRestricted: boolean;
  respectRobots: boolean;
  crawlDelay: number;
  excludePatterns: string[];
  includePatterns: string[];
  maxPages: number;
  contentTypes: string[];
}

interface URLBatchManagerProps {
  onImport: (urls: URLItem[], config: BatchConfig) => void;
  apiBaseUrl?: string;
  className?: string;
}

/**
 * URL批量管理组件
 * 提供URL批量添加、预览、配置和管理功能
 */
const URLBatchManager: React.FC<URLBatchManagerProps> = ({
  onImport,
  apiBaseUrl = 'http://localhost:8082',
  className = ''
}) => {
  const [urls, setUrls] = useState<URLItem[]>([]);
  const [inputUrl, setInputUrl] = useState('');
  const [selectedUrls, setSelectedUrls] = useState<Set<string>>(new Set());
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  // 批量配置
  const [batchConfig, setBatchConfig] = useState<BatchConfig>({
    maxDepth: 2,
    followLinks: false,
    domainRestricted: true,
    respectRobots: true,
    crawlDelay: 1000,
    excludePatterns: [],
    includePatterns: [],
    maxPages: 50,
    contentTypes: ['text/html', 'application/pdf']
  });

  // 验证URL
  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  // 添加单个URL
  const addUrl = useCallback(() => {
    if (!inputUrl.trim()) return;
    
    if (!isValidUrl(inputUrl)) {
      alert('请输入有效的URL地址');
      return;
    }

    const exists = urls.some(item => item.url === inputUrl);
    if (exists) {
      alert('该URL已存在');
      return;
    }

    const newUrl: URLItem = {
      id: `url_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      url: inputUrl,
      status: 'pending',
      lastChecked: new Date()
    };

    setUrls(prev => [...prev, newUrl]);
    setInputUrl('');
  }, [inputUrl, urls]);

  // 批量添加URL
  const addBatchUrls = useCallback((urlList: string[]) => {
    const validUrls = urlList
      .map(url => url.trim())
      .filter(url => url && isValidUrl(url))
      .filter(url => !urls.some(item => item.url === url));

    const newUrls: URLItem[] = validUrls.map(url => ({
      id: `url_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      url,
      status: 'pending',
      lastChecked: new Date()
    }));

    setUrls(prev => [...prev, ...newUrls]);
  }, [urls]);

  // 删除URL
  const removeUrl = useCallback((id: string) => {
    setUrls(prev => prev.filter(item => item.id !== id));
    setSelectedUrls(prev => {
      const newSet = new Set(prev);
      newSet.delete(id);
      return newSet;
    });
  }, []);

  // 批量删除
  const removeSelectedUrls = useCallback(() => {
    setUrls(prev => prev.filter(item => !selectedUrls.has(item.id)));
    setSelectedUrls(new Set());
  }, [selectedUrls]);

  // 预览URL
  const previewUrlInfo = useCallback(async (urlItem: URLItem) => {
    setUrls(prev => prev.map(item => 
      item.id === urlItem.id 
        ? { ...item, status: 'previewing' }
        : item
    ));

    setPreviewUrl(urlItem.url);
  }, []);

  // 处理元数据加载完成
  const handleMetadataLoaded = useCallback((metadata: any) => {
    setUrls(prev => prev.map(item => {
      if (item.url === metadata.url) {
        return {
          ...item,
          status: 'ready',
          title: metadata.title,
          description: metadata.description,
          favicon: metadata.favicon,
          contentType: metadata.contentType,
          contentLength: metadata.contentLength,
          wordCount: metadata.wordCount,
          estimatedChunks: Math.ceil((metadata.wordCount || 0) / 200),
          siteName: metadata.siteName
        };
      }
      return item;
    }));
  }, []);

  // 选择/取消选择URL
  const toggleUrlSelection = useCallback((id: string) => {
    setSelectedUrls(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  }, []);

  // 全选/取消全选
  const toggleSelectAll = useCallback(() => {
    const filteredUrls = getFilteredUrls();
    const allSelected = filteredUrls.every(url => selectedUrls.has(url.id));
    
    if (allSelected) {
      setSelectedUrls(prev => {
        const newSet = new Set(prev);
        filteredUrls.forEach(url => newSet.delete(url.id));
        return newSet;
      });
    } else {
      setSelectedUrls(prev => {
        const newSet = new Set(prev);
        filteredUrls.forEach(url => newSet.add(url.id));
        return newSet;
      });
    }
  }, [selectedUrls]);

  // 获取过滤后的URL列表
  const getFilteredUrls = useCallback(() => {
    return urls.filter(url => {
      const matchesSearch = !searchTerm || 
        url.url.toLowerCase().includes(searchTerm.toLowerCase()) ||
        url.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        url.siteName?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || url.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [urls, searchTerm, statusFilter]);

  // 开始导入
  const startImport = useCallback(() => {
    const selectedUrlItems = urls.filter(url => selectedUrls.has(url.id));
    if (selectedUrlItems.length === 0) {
      alert('请选择要导入的URL');
      return;
    }

    onImport(selectedUrlItems, batchConfig);
  }, [urls, selectedUrls, batchConfig, onImport]);

  // 格式化文件大小
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  // 获取状态图标
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ready':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'previewing':
        return <Eye className="w-4 h-4 text-blue-500 animate-pulse" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'importing':
        return <Download className="w-4 h-4 text-blue-500 animate-bounce" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const filteredUrls = getFilteredUrls();
  const selectedCount = selectedUrls.size;
  const readyUrls = urls.filter(url => url.status === 'ready');

  return (
    <div className={`bg-white rounded-lg border border-gray-200 ${className}`}>
      {/* 头部操作区 */}
      <div className="p-6 border-b border-gray-200">
        {/* URL输入 */}
        <div className="mb-4">
          <div className="flex space-x-3">
            <div className="flex-1 relative">
              <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="url"
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
                placeholder="输入URL地址或粘贴多个URL（换行分隔）"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                onKeyPress={(e) => e.key === 'Enter' && addUrl()}
              />
            </div>
            <button
              onClick={addUrl}
              disabled={!inputUrl.trim()}
              className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>添加</span>
            </button>
          </div>
        </div>

        {/* 搜索和过滤 */}
        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="搜索URL、标题或网站名..."
              className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm"
            />
          </div>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
          >
            <option value="all">所有状态</option>
            <option value="pending">待处理</option>
            <option value="ready">已就绪</option>
            <option value="error">错误</option>
          </select>

          {selectedCount > 0 && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">
                已选择 {selectedCount} 项
              </span>
              <button
                onClick={removeSelectedUrls}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="删除选中项"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* URL列表 */}
      <div className="max-h-96 overflow-y-auto">
        {filteredUrls.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <Globe className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p className="text-lg font-medium mb-1">暂无URL</p>
            <p className="text-sm">添加URL开始批量导入</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {/* 全选头部 */}
            <div className="p-3 bg-gray-50 flex items-center space-x-3">
              <input
                type="checkbox"
                checked={filteredUrls.length > 0 && filteredUrls.every(url => selectedUrls.has(url.id))}
                onChange={toggleSelectAll}
                className="rounded"
              />
              <span className="text-sm font-medium text-gray-700">
                全选 ({filteredUrls.length} 项)
              </span>
            </div>

            {filteredUrls.map((urlItem) => (
              <div key={urlItem.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-3">
                  {/* 选择框 */}
                  <input
                    type="checkbox"
                    checked={selectedUrls.has(urlItem.id)}
                    onChange={() => toggleUrlSelection(urlItem.id)}
                    className="rounded"
                  />

                  {/* 网站图标 */}
                  <div className="flex-shrink-0">
                    {urlItem.favicon ? (
                      <img 
                        src={urlItem.favicon} 
                        alt="favicon"
                        className="w-6 h-6 rounded"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    ) : (
                      <Globe className="w-6 h-6 text-gray-400" />
                    )}
                  </div>

                  {/* URL信息 */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="text-sm font-medium text-gray-900 truncate">
                        {urlItem.title || urlItem.url}
                      </h4>
                      {getStatusIcon(urlItem.status)}
                    </div>
                    
                    <p className="text-xs text-gray-500 truncate mb-1">
                      {urlItem.url}
                    </p>
                    
                    {urlItem.description && (
                      <p className="text-xs text-gray-600 line-clamp-2">
                        {urlItem.description}
                      </p>
                    )}

                    {/* 元数据信息 */}
                    {urlItem.status === 'ready' && (
                      <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                        {urlItem.contentLength && (
                          <span>{formatFileSize(urlItem.contentLength)}</span>
                        )}
                        {urlItem.wordCount && (
                          <span>{urlItem.wordCount.toLocaleString()} 字</span>
                        )}
                        {urlItem.estimatedChunks && (
                          <span>~{urlItem.estimatedChunks} 块</span>
                        )}
                        {urlItem.contentType && (
                          <span>{urlItem.contentType}</span>
                        )}
                      </div>
                    )}

                    {urlItem.error && (
                      <p className="text-xs text-red-600 mt-1">
                        {urlItem.error}
                      </p>
                    )}
                  </div>

                  {/* 操作按钮 */}
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => previewUrlInfo(urlItem)}
                      disabled={urlItem.status === 'previewing'}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                      title="预览"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    
                    <button
                      onClick={() => removeUrl(urlItem.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                      title="删除"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 底部操作 */}
      {urls.length > 0 && (
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              总计: {urls.length} • 已就绪: {readyUrls.length} • 已选择: {selectedCount}
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setUrls([])}
                className="px-3 py-1 text-sm text-gray-600 hover:text-red-600 transition-colors"
              >
                清空全部
              </button>
              
              <button
                onClick={startImport}
                disabled={selectedCount === 0}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
              >
                <Download className="w-4 h-4" />
                <span>导入选中项 ({selectedCount})</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* URL预览模态框 */}
      {previewUrl && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-auto">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">URL预览</h3>
              <button
                onClick={() => setPreviewUrl(null)}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"
              >
                <MoreHorizontal className="w-5 h-5" />
              </button>
            </div>
            
            <URLPreview
              url={previewUrl}
              onMetadataLoaded={handleMetadataLoaded}
              apiBaseUrl={apiBaseUrl}
              className="border-none"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default URLBatchManager;