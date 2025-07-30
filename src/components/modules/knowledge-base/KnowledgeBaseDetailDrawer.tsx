import React, { useState, useEffect } from 'react';
import { X, Database, FileText, Search, Settings, Upload, Download, Edit3, Trash2, RefreshCw, Eye, BarChart3, Calendar, Tag, Filter, CheckCircle, Clock, AlertCircle, TestTube, Sliders } from 'lucide-react';
import { KnowledgeBaseItem, FileItem } from '../../../utils/types';
import FileManagementPanel from '../files/FileManagementPanel';
import SearchControlPanel from './SearchControlPanel';
import IndexConfigSelector from './IndexConfigSelector';
import { Badge } from '../../ui/Badge';
import { Button } from '../../ui/Button';
import { Tabs } from '../../ui/Tabs';
import { Switch } from '../../ui/Switch';

interface KnowledgeBaseDetailDrawerProps {
  knowledgeBase: KnowledgeBaseItem | null;
  isOpen: boolean;
  onClose: () => void;
}

const KnowledgeBaseDetailDrawer: React.FC<KnowledgeBaseDetailDrawerProps> = ({
  knowledgeBase,
  isOpen,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [files, setFiles] = useState<FileItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Search tab state - moved here to fix hooks order violation
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchConfig, setSearchConfig] = useState({
    searchType: 'hybrid' as const,
    recallThreshold: 0.8,
    similarityThreshold: 0.7,
    topK: 5,
    semanticWeight: 0.7,
    keywordWeight: 0.3,
    enableReranking: true,
    maxCandidates: 100
  });
  
  // Settings tab state - moved here to fix hooks order violation
  const [indexConfig, setIndexConfig] = useState({
    indexType: 'hnsw' as const,
    parameters: { M: 16, efConstruction: 200, ef: 100 }
  });
  const [searchSettings, setSearchSettings] = useState({
    enableHybridSearch: true,
    enableReranking: false,
    similarityThreshold: 0.7
  });
  
  // 模拟文件数据
  useEffect(() => {
    if (knowledgeBase && isOpen) {
      setIsLoading(true);
      // 模拟加载文件数据
      setTimeout(() => {
        setFiles([
          { 
            id: '1', 
            name: '城市规划方案.pdf', 
            type: 'PDF', 
            size: '2.5 MB', 
            date: '2023-10-15', 
            category: 'document', 
            status: '已向量化', 
            isFolder: false, 
            parentId: null, 
            path: '/城市规划方案.pdf' 
          },
          { 
            id: '2', 
            name: '政策解读文档.docx', 
            type: 'Word', 
            size: '1.8 MB', 
            date: '2023-10-14', 
            category: 'document', 
            status: '处理中', 
            isFolder: false, 
            parentId: null, 
            path: '/政策解读文档.docx' 
          },
          { 
            id: '3', 
            name: '数据统计表.xlsx', 
            type: 'Excel', 
            size: '3.2 MB', 
            date: '2023-10-13', 
            category: 'spreadsheet', 
            status: '已向量化', 
            isFolder: false, 
            parentId: null, 
            path: '/数据统计表.xlsx' 
          },
          { 
            id: '4', 
            name: '项目文档', 
            type: 'folder', 
            size: 'NaN KB', 
            date: '2023-10-12', 
            category: 'folder', 
            status: '', 
            isFolder: true, 
            parentId: null, 
            path: '/项目文档' 
          }
        ]);
        setIsLoading(false);
      }, 1000);
    }
  }, [knowledgeBase, isOpen]);

  if (!knowledgeBase) return null;

  const getCategoryGradient = (category: string) => {
    switch (category) {
      case '文档':
        return 'linear-gradient(135deg, #bfdbfe 0%, #3b82f6 100%)';
      case '法规标准':
      case '标准':
        return 'linear-gradient(135deg, #bbf7d0 0%, #10b981 100%)';
      case '历史会议记录':
      case '会议记录':
        return 'linear-gradient(135deg, #fed7aa 0%, #f97316 100%)';
      case '数据分析':
        return 'linear-gradient(135deg, #ddd6fe 0%, #8b5cf6 100%)';
      case '配置':
        return 'linear-gradient(135deg, #bae6fd 0%, #0ea5e9 100%)';
      default:
        return 'linear-gradient(135deg, #e5e7eb 0%, #6b7280 100%)';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case '正常':
      case '活跃':
        return 'bg-green-100 text-green-800';
      case '维护中':
        return 'bg-yellow-100 text-yellow-800';
      case '错误':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case '正常':
      case '活跃':
        return <CheckCircle size={16} className="text-green-600" />;
      case '维护中':
        return <Clock size={16} className="text-yellow-600" />;
      case '错误':
        return <AlertCircle size={16} className="text-red-600" />;
      default:
        return <CheckCircle size={16} className="text-gray-600" />;
    }
  };

  const renderOverviewTab = () => (
    <div className="space-y-6">
      {/* 基本信息和统计信息 - 紧凑布局 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 基本信息卡片 - 紧凑设计 */}
        <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-start mb-4">
            <div
              className="flex items-center justify-center w-12 h-12 rounded-lg mr-4 shadow-sm"
              style={{ 
                background: getCategoryGradient(knowledgeBase.category || ''),
              }}
            >
              <Database size={20} className="text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-800 mb-1">{knowledgeBase.name}</h2>
              <p className="text-gray-600 text-sm leading-relaxed">{knowledgeBase.description}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 mb-4">
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(knowledgeBase.status || '')}`}>
              {getStatusIcon(knowledgeBase.status || '')}
              <span className="ml-1">{knowledgeBase.status || '正常'}</span>
            </div>
            <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
              <Tag size={12} className="mr-1" />
              {knowledgeBase.category}
            </div>
          </div>

          {/* 标签 - 紧凑设计 */}
          <div className="flex flex-wrap gap-2 mb-4">
            {knowledgeBase.tags?.map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-md border border-blue-200"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* 操作按钮 - 紧凑设计 */}
          <div className="flex space-x-2">
            <Button size="sm" variant="default" className="text-xs">
              <Edit3 size={14} className="mr-1" />
              编辑
            </Button>
            <Button size="sm" variant="secondary" className="text-xs">
              <Settings size={14} className="mr-1" />
              设置
            </Button>
            <Button size="sm" variant="secondary" className="text-xs">
              <RefreshCw size={14} className="mr-1" />
              刷新
            </Button>
          </div>
        </div>

        {/* 快速统计 - 紧凑设计 */}
        <div className="space-y-3">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="p-2 bg-blue-50 rounded-lg mr-3">
                  <FileText className="text-blue-600" size={16} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800">{knowledgeBase.fileCount}</p>
                  <p className="text-xs text-gray-500">文件数量</p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="p-2 bg-green-50 rounded-lg mr-3">
                  <BarChart3 className="text-green-600" size={16} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800">{knowledgeBase.vectorCount}</p>
                  <p className="text-xs text-gray-500">向量数量</p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="p-2 bg-purple-50 rounded-lg mr-3">
                  <CheckCircle className="text-purple-600" size={16} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800">{knowledgeBase.vectorized}%</p>
                  <p className="text-xs text-gray-500">向量化</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>



      {/* 最近活动 - 紧凑设计 */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <div className="p-1 bg-blue-50 rounded-md mr-2">
            <Calendar size={16} className="text-blue-600" />
          </div>
          最近活动
        </h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between py-3 px-4 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
              <div>
                <span className="text-sm font-medium text-gray-700">文档向量化完成</span>
                <p className="text-xs text-gray-500">处理了{knowledgeBase.fileCount}个文档</p>
              </div>
            </div>
            <span className="text-xs text-green-600 font-medium bg-green-100 px-2 py-1 rounded-md">{knowledgeBase.lastUpdated}</span>
          </div>
          <div className="flex items-center justify-between py-3 px-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
              <div>
                <span className="text-sm font-medium text-gray-700">新增政策文档 3 个</span>
                <p className="text-xs text-gray-500">添加了最新的政策文档</p>
              </div>
            </div>
            <span className="text-xs text-blue-600 font-medium bg-blue-100 px-2 py-1 rounded-md">2023-10-14</span>
          </div>
          <div className="flex items-center justify-between py-3 px-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></div>
              <div>
                <span className="text-sm font-medium text-gray-700">知识库配置更新</span>
                <p className="text-xs text-gray-500">更新了检索参数</p>
              </div>
            </div>
            <span className="text-xs text-yellow-600 font-medium bg-yellow-100 px-2 py-1 rounded-md">2023-10-13</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderFilesTab = () => (
    <div className="h-full">
      <FileManagementPanel
        title="文件管理"
        initialFiles={files}
        knowledgeBaseId={knowledgeBase?.id}
        onFileAction={(action, file) => {
          console.log('File action:', action, file);
          // 这里可以处理文件操作，如删除、编辑等
        }}
      />
    </div>
  );

  const renderSearchTab = () => {
    const handleSearch = async () => {
      if (!searchQuery.trim()) return;
      
      setIsSearching(true);
      // 模拟搜索API调用
      setTimeout(() => {
        const mockResults = [
          {
            id: '1',
            content: `关于"${searchQuery}"的相关内容片段，包含详细的描述和解释...`,
            score: 0.92,
            documentName: '城市规划指南.pdf',
            chunkIndex: 12
          },
          {
            id: '2', 
            content: `另一个与"${searchQuery}"相关的内容片段，提供了不同的视角...`,
            score: 0.87,
            documentName: '政策文件.docx',
            chunkIndex: 5
          },
          {
            id: '3',
            content: `第三个搜索结果，进一步阐述了"${searchQuery}"的重要性...`,
            score: 0.81,
            documentName: '技术报告.pdf',
            chunkIndex: 23
          }
        ].slice(0, searchConfig.topK);
        
        setSearchResults(mockResults);
        setIsSearching(false);
      }, 1000);
    };

    return (
      <div className="space-y-6">
        {/* 搜索控制面板 */}
        <SearchControlPanel
          knowledgeBaseId={knowledgeBase?.id || ''}
          initialConfig={searchConfig}
          onConfigChange={setSearchConfig}
          className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
        />

        {/* 快速搜索测试 */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center mb-4">
            <div className="p-2 bg-green-50 rounded-lg mr-3">
              <TestTube size={18} className="text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800">快速搜索测试</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                测试查询
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  placeholder="输入搜索内容..."
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
                <Button 
                  onClick={handleSearch}
                  disabled={isSearching || !searchQuery.trim()}
                  className="text-sm"
                >
                  {isSearching ? (
                    <RefreshCw size={14} className="mr-1 animate-spin" />
                  ) : (
                    <Search size={14} className="mr-1" />
                  )}
                  {isSearching ? '搜索中...' : '搜索'}
                </Button>
              </div>
            </div>

            {/* 搜索配置摘要 */}
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-md">
                类型: {searchConfig.searchType}
              </span>
              <span className="px-2 py-1 bg-green-50 text-green-700 rounded-md">
                Top-K: {searchConfig.topK}
              </span>
              <span className="px-2 py-1 bg-purple-50 text-purple-700 rounded-md">
                召回率: {searchConfig.recallThreshold}
              </span>
              {searchConfig.searchType === 'hybrid' && (
                <span className="px-2 py-1 bg-orange-50 text-orange-700 rounded-md">
                  权重: {searchConfig.semanticWeight}:{searchConfig.keywordWeight}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* 搜索结果 */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-gray-800">搜索结果</h4>
            {searchResults.length > 0 && (
              <span className="text-sm text-gray-500">
                找到 {searchResults.length} 个结果
              </span>
            )}
          </div>

          {isSearching ? (
            <div className="text-center py-8">
              <RefreshCw size={32} className="mx-auto mb-2 text-blue-600 animate-spin" />
              <p className="text-sm text-gray-500">正在搜索...</p>
            </div>
          ) : searchResults.length > 0 ? (
            <div className="space-y-4">
              {searchResults.map((result) => (
                <div key={result.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center">
                      <div className="p-1 bg-blue-50 rounded mr-2">
                        <FileText size={14} className="text-blue-600" />
                      </div>
                      <span className="text-sm font-medium text-gray-800">{result.documentName}</span>
                    </div>
                    <div className="flex items-center text-xs text-gray-500">
                      <span className="mr-2">相似度: {result.score.toFixed(3)}</span>
                      <span>块#{result.chunkIndex}</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 line-clamp-3">{result.content}</p>
                  <div className="mt-2 flex justify-between items-center">
                    <div className={`inline-block px-2 py-1 rounded-md text-xs ${
                      result.score >= 0.9 ? 'bg-green-100 text-green-800' :
                      result.score >= 0.8 ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {result.score >= 0.9 ? '高相关' : result.score >= 0.8 ? '中相关' : '低相关'}
                    </div>
                    <Button size="sm" variant="ghost" className="text-xs">
                      <Eye size={12} className="mr-1" />
                      查看原文
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : searchQuery && !isSearching ? (
            <div className="text-center text-gray-500 py-8">
              <Search size={32} className="mx-auto mb-2 opacity-50" />
              <p className="text-sm">未找到相关结果</p>
            </div>
          ) : (
            <div className="text-center text-gray-500 py-8">
              <Search size={32} className="mx-auto mb-2 opacity-50" />
              <p className="text-sm">输入关键词开始搜索</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderSettingsTab = () => {
    return (
      <div className="space-y-6">
        {/* 基本设置 */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center mb-4">
            <div className="p-2 bg-blue-50 rounded-lg mr-3">
              <Settings size={18} className="text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800">基本设置</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                知识库名称
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-gray-50"
                value={knowledgeBase.name}
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                描述
              </label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-gray-50"
                rows={3}
                value={knowledgeBase.description}
                readOnly
              />
            </div>
            
            {/* 知识库统计 */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t">
              <div className="text-center">
                <div className="text-lg font-semibold text-gray-800">{knowledgeBase.fileCount}</div>
                <div className="text-sm text-gray-500">文档数量</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-gray-800">{knowledgeBase.vectorCount}</div>
                <div className="text-sm text-gray-500">向量数量</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-gray-800">{knowledgeBase.vectorized}%</div>
                <div className="text-sm text-gray-500">向量化进度</div>
              </div>
            </div>
          </div>
        </div>

        {/* 向量索引配置 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <IndexConfigSelector
            value={indexConfig}
            onChange={setIndexConfig}
            showRecommendations={true}
            className="p-6"
          />
          
          {/* 索引重建操作 */}
          <div className="border-t px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-700">索引重建</h4>
                <p className="text-xs text-gray-500">应用新的索引配置需要重建索引</p>
              </div>
              <Button size="sm" variant="secondary">
                <RefreshCw size={14} className="mr-1" />
                重建索引
              </Button>
            </div>
          </div>
        </div>

        {/* 检索设置 */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center mb-4">
            <div className="p-2 bg-green-50 rounded-lg mr-3">
              <Sliders size={18} className="text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800">检索设置</h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3">
              <div>
                <p className="text-sm font-medium text-gray-700">启用混合搜索</p>
                <p className="text-xs text-gray-500">同时使用LlamaIndex和Agno框架进行检索</p>
              </div>
              <Switch 
                checked={searchSettings.enableHybridSearch} 
                onChange={(checked) => setSearchSettings(prev => ({ ...prev, enableHybridSearch: checked }))}
              />
            </div>
            
            <div className="flex items-center justify-between py-3">
              <div>
                <p className="text-sm font-medium text-gray-700">启用重排序</p>
                <p className="text-xs text-gray-500">对搜索结果进行二次排序优化</p>
              </div>
              <Switch 
                checked={searchSettings.enableReranking} 
                onChange={(checked) => setSearchSettings(prev => ({ ...prev, enableReranking: checked }))}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                默认相似度阈值
              </label>
              <div className="flex items-center space-x-3">
                <input
                  type="range"
                  min="0.1"
                  max="1.0"
                  step="0.05"
                  value={searchSettings.similarityThreshold}
                  onChange={(e) => setSearchSettings(prev => ({ ...prev, similarityThreshold: parseFloat(e.target.value) }))}
                  className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <span className="text-sm font-mono text-gray-700 w-12">
                  {searchSettings.similarityThreshold.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>0.1 (宽松)</span>
                <span>1.0 (严格)</span>
              </div>
            </div>

            {/* 保存按钮 */}
            <div className="pt-4 border-t">
              <Button variant="default" className="w-full">
                保存配置
              </Button>
            </div>
          </div>
        </div>

        {/* 高级操作 */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center mb-4">
            <div className="p-2 bg-yellow-50 rounded-lg mr-3">
              <Settings size={18} className="text-yellow-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800">高级操作</h3>
          </div>
          
          <div className="space-y-3">
            <Button variant="secondary" className="w-full justify-start">
              <Download size={14} className="mr-2" />
              导出知识库配置
            </Button>
            <Button variant="secondary" className="w-full justify-start">
              <Upload size={14} className="mr-2" />
              导入知识库配置
            </Button>
            <Button variant="secondary" className="w-full justify-start">
              <RefreshCw size={14} className="mr-2" />
              重新向量化所有文档
            </Button>
          </div>
        </div>

        {/* 危险操作 */}
        <div className="bg-red-50 rounded-xl p-6 shadow-sm border border-red-200">
          <div className="flex items-center mb-4">
            <div className="p-2 bg-red-100 rounded-lg mr-3">
              <AlertCircle size={18} className="text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-red-800">危险操作</h3>
          </div>
          
          <div className="space-y-3">
            <p className="text-sm text-red-700 mb-4">
              以下操作不可撤销，请谨慎执行
            </p>
            <Button variant="secondary" className="w-full text-red-600 border-red-300 hover:bg-red-100 justify-start">
              <Trash2 size={14} className="mr-2" />
              清空知识库数据
            </Button>
            <Button variant="secondary" className="w-full text-red-600 border-red-300 hover:bg-red-100 justify-start">
              <Trash2 size={14} className="mr-2" />
              删除知识库
            </Button>
          </div>
        </div>
      </div>
    );
  };

  const tabs = [
    { id: 'overview', label: '概览', icon: Eye },
    { id: 'files', label: '文件', icon: FileText },
    { id: 'search', label: '搜索测试', icon: Search },
    { id: 'settings', label: '设置', icon: Settings }
  ];

  return (
    <div className={`fixed top-0 left-64 right-0 bottom-0 z-50 transform transition-transform duration-300 ease-in-out ${
      isOpen ? 'translate-x-0' : 'translate-x-full'
    }`}>
      {/* 背景蒙层 */}
      <div className="absolute inset-0 bg-black/10 backdrop-blur-sm" onClick={onClose} />
      
      {/* 抽屉内容 */}
      <div className="absolute right-0 top-0 h-full w-full bg-white shadow-2xl flex flex-col">
        {/* 顶部头部 - 精致化设计 */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-indigo-50" />
          <div className="relative flex items-center justify-between p-6 border-b border-gray-200/50">
            <div className="flex items-center">
              <div
                className="flex items-center justify-center w-14 h-14 rounded-xl mr-4 shadow-lg"
                style={{ 
                  background: getCategoryGradient(knowledgeBase.category || ''),
                  boxShadow: '0 8px 32px rgba(0,0,0,0.12)'
                }}
              >
                <Database size={24} className="text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800 mb-1">{knowledgeBase.name}</h1>
                <div className="flex items-center gap-3">
                  <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(knowledgeBase.status || '')}`}>
                    {getStatusIcon(knowledgeBase.status || '')}
                    <span className="ml-2">{knowledgeBase.status || '正常'}</span>
                  </div>
                  <span className="text-sm text-gray-500">知识库详情</span>
                </div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="p-3 hover:bg-white/80 rounded-xl shadow-sm"
            >
              <X size={20} />
            </Button>
          </div>
        </div>

        {/* 标签页导航 - 精致化设计 */}
        <div className="bg-white border-b border-gray-200/50">
          <div className="flex space-x-1 px-6 py-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-6 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-blue-50 text-blue-600 shadow-sm border border-blue-200'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                }`}
              >
                <tab.icon size={16} className="mr-2" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* 内容区域 - 精致化设计 */}
        <div className="flex-1 overflow-y-auto bg-gradient-to-br from-gray-50 to-gray-100/50">
          <div className="p-6">
            {activeTab === 'overview' && renderOverviewTab()}
            {activeTab === 'files' && renderFilesTab()}
            {activeTab === 'search' && renderSearchTab()}
            {activeTab === 'settings' && renderSettingsTab()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default KnowledgeBaseDetailDrawer;