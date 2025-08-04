import React, { useState, useEffect } from 'react';
import { FileItem as FileItemType } from '../../../utils/types';
import EnhancedFilesList from './EnhancedFilesList';
import BatchProcessingMonitor from './BatchProcessingMonitor';
import FileUploaderWithSSE from './FileUploaderWithSSE';
import SSEProgressMonitor from '../../common/SSEProgressMonitor';
import { 
  Upload, 
  Monitor, 
  FileText, 
  Settings,
  Activity,
  BarChart3
} from 'lucide-react';

interface FilesPageWithSSEProps {
  knowledgeBaseId: string;
  userId: string;
  messageServiceUrl?: string;
  apiBaseUrl?: string;
}

/**
 * 集成SSE进度监控的文件管理页面
 * 展示如何使用增强的文件列表组件
 */
const FilesPageWithSSE: React.FC<FilesPageWithSSEProps> = ({
  knowledgeBaseId,
  userId,
  messageServiceUrl = 'http://localhost:8089',
  apiBaseUrl = 'http://localhost:8082'
}) => {
  // 状态管理
  const [files, setFiles] = useState<FileItemType[]>([]);
  const [selectedItem, setSelectedItem] = useState<FileItemType | null>(null);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // 视图状态
  const [showUploader, setShowUploader] = useState(false);
  const [showBatchMonitor, setShowBatchMonitor] = useState(false);
  const [showSSEMonitor, setShowSSEMonitor] = useState(false);
  const [activeView, setActiveView] = useState<'list' | 'processing'>('list');

  // 加载文件列表
  const loadFiles = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(
        `${apiBaseUrl}/api/v1/knowledge-bases/${knowledgeBaseId}/documents`,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.ok) {
        const result = await response.json();
        
        // 转换API响应为FileItem格式
        const fileItems: FileItemType[] = result.data?.map((doc: any) => ({
          id: doc.id,
          name: doc.name || doc.filename,
          type: doc.type || 'document',
          size: doc.size?.toString() || '0',
          date: doc.created_at || new Date().toISOString(),
          category: doc.category || 'document',
          status: doc.status || 'pending',
          isFolder: false,
          parentId: null,
          path: doc.path || '/',
          // 额外的处理信息
          totalChunks: doc.total_chunks || 0,
          processedChunks: doc.processed_chunks || 0,
          vectorized: doc.vectorized || false
        })) || [];
        
        setFiles(fileItems);
      } else {
        throw new Error(`加载文件失败: ${response.statusText}`);
      }
    } catch (err) {
      console.error('加载文件出错:', err);
      setError(err instanceof Error ? err.message : '加载文件失败');
    } finally {
      setLoading(false);
    }
  };

  // 组件挂载时加载文件
  useEffect(() => {
    if (knowledgeBaseId) {
      loadFiles();
    }
  }, [knowledgeBaseId]);

  // 批量开始处理选中的文件
  const handleBatchProcess = async () => {
    if (selectedItems.length === 0) {
      alert('请先选择要处理的文件');
      return;
    }

    try {
      const processingPromises = selectedItems.map(async (fileId) => {
        const response = await fetch(
          `${apiBaseUrl}/api/v1/knowledge-bases/${knowledgeBaseId}/documents/${fileId}/process-async`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              user_id: userId,
              enable_async_processing: true
            })
          }
        );
        
        if (!response.ok) {
          throw new Error(`处理文件 ${fileId} 失败`);
        }
        
        return response.json();
      });

      await Promise.all(processingPromises);
      
      // 显示批量监控面板
      setShowBatchMonitor(true);
      setActiveView('processing');
      
    } catch (error) {
      console.error('批量处理失败:', error);
      alert('批量处理失败，请重试');
    }
  };

  // 刷新文件列表
  const handleRefresh = () => {
    loadFiles();
    setSelectedItems([]);
    setSelectedItem(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center space-x-2 text-gray-500">
          <Activity className="w-5 h-5 animate-spin" />
          <span>加载文件列表...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center space-x-2 text-red-700">
          <FileText className="w-5 h-5" />
          <span className="font-medium">加载失败</span>
        </div>
        <p className="text-red-600 mt-2">{error}</p>
        <button
          onClick={handleRefresh}
          className="mt-3 px-4 py-2 bg-red-100 text-red-700 hover:bg-red-200 rounded-lg transition-colors"
        >
          重试
        </button>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* 顶部工具栏 */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          {/* 左侧：视图切换 */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setActiveView('list')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeView === 'list'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <FileText className="w-4 h-4 inline mr-1" />
                文件列表
              </button>
              
              <button
                onClick={() => setActiveView('processing')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeView === 'processing'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <BarChart3 className="w-4 h-4 inline mr-1" />
                处理监控
              </button>
            </div>
            
            {/* 选择信息 */}
            {selectedItems.length > 0 && (
              <div className="text-sm text-gray-600">
                已选择 {selectedItems.length} 个文件
              </div>
            )}
          </div>

          {/* 右侧：操作按钮 */}
          <div className="flex items-center space-x-3">
            {/* 批量操作 */}
            {selectedItems.length > 0 && (
              <button
                onClick={handleBatchProcess}
                className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors flex items-center space-x-2"
              >
                <Activity className="w-4 h-4" />
                <span>批量处理 ({selectedItems.length})</span>
              </button>
            )}
            
            {/* 上传文件 */}
            <button
              onClick={() => setShowUploader(true)}
              className="px-4 py-2 bg-green-600 text-white hover:bg-green-700 rounded-lg transition-colors flex items-center space-x-2"
            >
              <Upload className="w-4 h-4" />
              <span>上传文件</span>
            </button>
            
            {/* SSE监控 */}
            <button
              onClick={() => setShowSSEMonitor(!showSSEMonitor)}
              className={`p-2 rounded-lg transition-colors ${
                showSSEMonitor 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'text-gray-500 hover:bg-gray-100'
              }`}
              title="SSE连接监控"
            >
              <Monitor className="w-5 h-5" />
            </button>
            
            {/* 刷新 */}
            <button
              onClick={handleRefresh}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              title="刷新列表"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* 主内容区域 */}
      <div className="flex-1 overflow-hidden">
        {activeView === 'list' ? (
          /* 文件列表视图 */
          <EnhancedFilesList
            files={files}
            selectedItem={selectedItem}
            setSelectedItem={setSelectedItem}
            selectedItems={selectedItems}
            setSelectedItems={setSelectedItems}
            knowledgeBaseId={knowledgeBaseId}
            userId={userId}
            messageServiceUrl={messageServiceUrl}
            apiBaseUrl={apiBaseUrl}
          />
        ) : (
          /* 处理监控视图 */
          <div className="p-6">
            <BatchProcessingMonitor
              knowledgeBaseId={knowledgeBaseId}
              userId={userId}
              messageServiceUrl={messageServiceUrl}
              apiBaseUrl={apiBaseUrl}
              initialFiles={selectedItems}
              onClose={() => setShowBatchMonitor(false)}
            />
          </div>
        )}
      </div>

      {/* 文件上传器 */}
      {showUploader && (
        <FileUploaderWithSSE
          knowledgeBaseId={knowledgeBaseId}
          userId={userId}
          messageServiceUrl={messageServiceUrl}
          apiBaseUrl={apiBaseUrl}
          onUploadComplete={(results) => {
            console.log('上传完成:', results);
            setShowUploader(false);
            handleRefresh();
          }}
          onClose={() => setShowUploader(false)}
        />
      )}

      {/* SSE监控面板 */}
      {showSSEMonitor && (
        <SSEProgressMonitor
          userId={userId}
          messageServiceUrl={messageServiceUrl}
          showMiniView={true}
          onClose={() => setShowSSEMonitor(false)}
        />
      )}
    </div>
  );
};

export default FilesPageWithSSE;