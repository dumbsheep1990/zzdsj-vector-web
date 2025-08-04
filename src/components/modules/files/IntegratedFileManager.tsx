import React, { useState, useEffect, useCallback } from 'react';
import {
  Search,
  Trash2,
  Upload,
  FolderPlus,
  FileText,
  Image,
  Video,
  Music,
  Database,
  X,
  Eye,
  Settings,
  Grid3X3,
  List,
  Plus,
  RefreshCw,
  Download,
  AlertCircle,
  CheckCircle,
  Clock,
  Layers,
  MoreHorizontal
} from 'lucide-react';
import { FileItem } from '../../../utils/types';
import EnhancedDocumentUploader from './EnhancedDocumentUploader';
import SSEProgressMonitor from '../../common/SSEProgressMonitor';
import { useSSEConnection } from '../../../hooks/common/useSSEConnection';

interface IntegratedFileManagerProps {
  knowledgeBaseId: string;
  userId: string;
  title?: string;
  onClose?: () => void;
  messageServiceUrl?: string;
  apiBaseUrl?: string;
}

const IntegratedFileManager: React.FC<IntegratedFileManagerProps> = ({
  knowledgeBaseId,
  userId,
  title = "文件管理",
  onClose,
  messageServiceUrl = 'http://localhost:8089',
  apiBaseUrl = 'http://localhost:8082'
}) => {
  // 基础状态
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // UI状态
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('全部');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'size' | 'type'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  
  // 文件夹导航状态
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [folderBreadcrumb, setFolderBreadcrumb] = useState<Array<{id: string | null, name: string}>>([
    { id: null, name: '根目录' }
  ]);
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null); // 用于文件上传
  
  // 模态框状态
  const [showUploader, setShowUploader] = useState(false);
  const [showSSEMonitor, setShowSSEMonitor] = useState(false);
  const [selectedFileDetail, setSelectedFileDetail] = useState<FileItem | null>(null);
  const [showCreateFolder, setShowCreateFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');

  // SSE连接
  const { connectionStatus, isConnected } = useSSEConnection({
    userId,
    messageServiceUrl,
    autoConnect: true,
    onMessage: handleSSEMessage
  });

  // 处理SSE消息
  function handleSSEMessage(message: any) {
    const { type, data } = message;
    
    switch (type) {
      case 'progress':
        // 更新文件处理进度
        updateFileProgress(data.task_id, data.progress, data.stage);
        break;
      case 'success':
        // 文件处理完成
        handleFileProcessingComplete(data.task_id, data.result);
        break;
      case 'error':
        // 文件处理失败
        handleFileProcessingError(data.task_id, data.error_message);
        break;
    }
  }

  // 加载文件列表（支持按文件夹）
  const loadFiles = useCallback(async (folderId: string | null = currentFolderId) => {
    setLoading(true);
    setError(null);
    
    try {
      // 构建文件夹API URL - 根目录时不传parent_id参数
      const foldersUrl = folderId 
        ? `${apiBaseUrl}/api/v1/knowledge-bases/${knowledgeBaseId}/folders/?parent_id=${folderId}`
        : `${apiBaseUrl}/api/v1/knowledge-bases/${knowledgeBaseId}/folders/`;
      
      // 并行加载文档和文件夹
      const [documentsResponse, foldersResponse] = await Promise.all([
        fetch(`${apiBaseUrl}/api/v1/knowledge-bases/${knowledgeBaseId}/documents`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        }),
        fetch(foldersUrl, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        })
      ]);

      let allFiles: FileItem[] = [];

      // 处理文档数据
      if (documentsResponse.ok) {
        const documentResult = await documentsResponse.json();
        if (documentResult.success && documentResult.data) {
          const documents = documentResult.data.documents || [];
          console.log(`[DEBUG] 加载文档数据，当前folderId: ${folderId}, 文档总数: ${documents.length}`);
          const mappedDocuments: FileItem[] = documents
            .filter((doc: any) => {
              // 正确处理null值比较
              const docFolderId = doc.folder_id || null;
              const currentFolderId = folderId || null;
              const match = docFolderId === currentFolderId;
              if (documents.length > 0) {
                console.log(`[DEBUG] 文档过滤: doc.folder_id=${docFolderId}, currentFolderId=${currentFolderId}, match=${match}`);
              }
              return match;
            })
            .map((doc: any) => ({
              id: doc.id,
              name: doc.title || doc.filename,
              type: getFileTypeFromMimeType(doc.content_type),
              size: formatFileSize(doc.file_size || 0),
              date: new Date(doc.created_at).toLocaleDateString(),
              category: getCategoryFromMimeType(doc.content_type),
              status: getProcessingStatus(doc.processing_status),
              isFolder: false,
              parentId: doc.folder_id || null,
              path: doc.file_path || `/${doc.filename}`,
              // 额外的文件信息
              contentType: doc.content_type,
              fileSize: doc.file_size,
              chunkCount: doc.chunk_count || 0,
              processingStatus: doc.processing_status,
              taskId: doc.task_id,
              // 向量化信息
              vectorCount: doc.vector_count || 0,
              splitterStrategy: doc.splitter_strategy
            }));
          allFiles = [...allFiles, ...mappedDocuments];
        }
      }

      // 处理文件夹数据
      if (foldersResponse.ok) {
        const folderResult = await foldersResponse.json();
        console.log('文件夹API返回:', folderResult);
        if (folderResult.success && folderResult.data) {
          const folders = folderResult.data.folders || [];
          console.log(`[DEBUG] 加载文件夹数据，当前folderId: ${folderId}, 文件夹数量: ${folders.length}`, folders);
          const mappedFolders: FileItem[] = folders.map((folder: any) => ({
              id: folder.id,
              name: folder.name,
              type: 'FOLDER',
              size: `${folder.document_count || 0} 个文件`,
              date: new Date(folder.created_at).toLocaleDateString(),
              category: 'folder',
              status: '文件夹',
              isFolder: true,
              parentId: folder.parent_id || null,
              path: folder.full_path || `/${folder.name}`,
              // 文件夹特有信息
              folderColor: folder.color || '#1890ff',
              folderIcon: folder.icon || 'folder',
              documentCount: folder.document_count || 0,
              searchEnabled: folder.enable_search || false,
              description: folder.description,
              level: folder.level || 0
            }));
          allFiles = [...mappedFolders, ...allFiles]; // 文件夹显示在前面
        }
      }
      
      console.log(`[DEBUG] 设置文件列表，总数: ${allFiles.length}, 当前folderId: ${folderId}`, allFiles);
      setFiles(allFiles);
      
      if (allFiles.length === 0) {
        console.log(`${folderId ? '当前文件夹' : '知识库'}暂无文件和文件夹`);
      }
    } catch (err) {
      console.error('加载文件列表失败:', err);
      setError(err instanceof Error ? err.message : '加载文件列表失败');
    } finally {
      setLoading(false);
    }
  }, [knowledgeBaseId, apiBaseUrl]);

  // 初始化加载
  useEffect(() => {
    loadFiles();
  }, [knowledgeBaseId]); // 只在knowledgeBaseId变化时重新加载

  // 文件类型映射
  const getFileTypeFromMimeType = (mimeType: string): string => {
    const typeMap: Record<string, string> = {
      'application/pdf': 'PDF',
      'application/msword': 'Word',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'Word',
      'application/vnd.ms-excel': 'Excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'Excel',
      'text/plain': 'TXT',
      'text/markdown': 'Markdown',
      'image/jpeg': 'JPG',
      'image/png': 'PNG',
      'image/gif': 'GIF'
    };
    
    return typeMap[mimeType] || mimeType.split('/')[1]?.toUpperCase() || 'Unknown';
  };

  // 分类映射
  const getCategoryFromMimeType = (mimeType: string): string => {
    if (mimeType.startsWith('image/')) return 'image';
    if (mimeType.startsWith('video/')) return 'video';
    if (mimeType.startsWith('audio/')) return 'audio';
    if (mimeType.includes('spreadsheet') || mimeType.includes('excel')) return 'spreadsheet';
    if (mimeType.includes('document') || mimeType.includes('pdf') || mimeType.includes('text')) return 'document';
    return 'other';
  };

  // 处理状态映射
  const getProcessingStatus = (status: string): string => {
    const statusMap: Record<string, string> = {
      'completed': '已向量化',
      'processing': '处理中',
      'pending': '待处理',
      'failed': '失败',
      'paused': '暂停'
    };
    
    return statusMap[status] || '';
  };

  // 格式化文件大小
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  // 更新文件进度
  const updateFileProgress = (taskId: string, progress: number, stage: string) => {
    setFiles(prevFiles =>
      prevFiles.map(file => {
        if (file.taskId === taskId) {
          return {
            ...file,
            status: progress < 100 ? '处理中' : '已向量化',
            // 可以添加进度信息到扩展属性
            processingProgress: progress,
            processingStage: stage
          };
        }
        return file;
      })
    );
  };

  // 处理文件处理完成
  const handleFileProcessingComplete = (taskId: string, result: any) => {
    setFiles(prevFiles =>
      prevFiles.map(file => {
        if (file.taskId === taskId) {
          return {
            ...file,
            status: '已向量化',
            chunkCount: result.chunk_count || 0,
            vectorCount: result.vector_count || 0,
            processingProgress: 100
          };
        }
        return file;
      })
    );
  };

  // 处理文件处理失败
  const handleFileProcessingError = (taskId: string, errorMessage: string) => {
    setFiles(prevFiles =>
      prevFiles.map(file => {
        if (file.taskId === taskId) {
          return {
            ...file,
            status: '失败',
            error: errorMessage
          };
        }
        return file;
      })
    );
  };

  // 处理文件上传完成
  const handleUploadComplete = async (results: any[]) => {
    console.log('文件上传完成:', results);
    
    // 立即将上传的文件添加到本地列表中，不等待服务器API
    const newFiles = results.map(result => ({
      id: result.taskId || result.id,
      name: result.filename,
      type: result.filename.split('.').pop()?.toUpperCase() || 'FILE',
      size: result.size || 0,
      uploadTime: result.uploadTime || new Date().toISOString(),
      status: result.status || 'processing',
      processingStatus: result.message || '文档处理中...',
      taskId: result.taskId,
      progress: 0,
      isFolder: false,
      parentId: selectedFolderId || currentFolderId, // 设置父文件夹ID
      metadata: {
        chunks: 0,
        vectors: 0,
        splitter_strategy: 'token_basic'
      }
    }));
    
    // 只有当上传的文件属于当前文件夹时才显示
    const relevantFiles = newFiles.filter(file => file.parentId === currentFolderId);
    
    // 将新文件添加到现有列表开头
    setFiles(prev => [...relevantFiles, ...prev]);
    
    // 关闭上传器和清除选中状态
    setShowUploader(false);
    setSelectedFolderId(null);
    
    // 不要异步刷新，避免覆盖本地文件
    // 新上传的文件已经添加到列表中，通过SSE更新状态即可
  };

  // 文件夹导航功能
  const enterFolder = async (folderId: string, folderName: string) => {
    setCurrentFolderId(folderId);
    setFolderBreadcrumb(prev => [...prev, { id: folderId, name: folderName }]);
    await loadFiles(folderId);
  };

  const navigateToFolder = async (folderId: string | null, folderName: string) => {
    if (folderId === currentFolderId) return;
    
    setCurrentFolderId(folderId);
    
    // 更新面包屑导航
    if (folderId === null) {
      // 返回根目录
      setFolderBreadcrumb([{ id: null, name: '根目录' }]);
    } else {
      // 找到目标文件夹在面包屑中的位置
      const targetIndex = folderBreadcrumb.findIndex(item => item.id === folderId);
      if (targetIndex !== -1) {
        setFolderBreadcrumb(prev => prev.slice(0, targetIndex + 1));
      }
    }
    
    await loadFiles(folderId);
  };

  // 创建文件夹
  const createFolder = async (folderName: string) => {
    try {
      const response = await fetch(
        `${apiBaseUrl}/api/v1/knowledge-bases/${knowledgeBaseId}/folders/`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: folderName,
            description: `用户创建的文件夹: ${folderName}`,
            parent_id: currentFolderId, // 在当前文件夹下创建
            color: "#1890ff",
            icon: "folder",
            enable_search: true,
            search_scope: "folder_only",
            search_weight: 5
          })
        }
      );

      if (response.ok) {
        const result = await response.json();
        
        // 检查是否超过2级限制
        if (result.data && result.data.level > 1) {
          throw new Error('最多支持2级文件夹嵌套');
        }
        
        // 创建成功后，刷新当前文件夹的文件列表
        await loadFiles(currentFolderId);
        
        setShowCreateFolder(false);
        setNewFolderName('');
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || '创建文件夹失败');
      }
    } catch (error) {
      console.error('创建文件夹失败:', error);
      setError(error instanceof Error ? error.message : '创建文件夹失败');
    }
  };

  // 处理文件夹选中
  const handleFolderSelect = (folderId: string) => {
    setSelectedFolderId(prev => prev === folderId ? null : folderId);
  };

  // 处理文件夹双击
  const handleFolderDoubleClick = async (folder: FileItem) => {
    if (folder.isFolder && folder.id) {
      await enterFolder(folder.id, folder.name);
    }
  };

  // 删除文件
  const deleteFile = async (fileId: string) => {
    try {
      const response = await fetch(
        `${apiBaseUrl}/api/v1/knowledge-bases/${knowledgeBaseId}/documents/${fileId}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );

      if (response.ok) {
        setFiles(prevFiles => prevFiles.filter(file => file.id !== fileId));
        setSelectedItems(prev => prev.filter(id => id !== fileId));
      } else {
        throw new Error('删除文件失败');
      }
    } catch (err) {
      console.error('删除文件失败:', err);
      setError(err instanceof Error ? err.message : '删除文件失败');
    }
  };

  // 批量删除
  const deleteSelectedFiles = async () => {
    if (selectedItems.length === 0) return;
    
    if (!confirm(`确定要删除选中的 ${selectedItems.length} 个文件吗？`)) {
      return;
    }

    try {
      await Promise.all(selectedItems.map(fileId => deleteFile(fileId)));
      setSelectedItems([]);
    } catch (err) {
      console.error('批量删除失败:', err);
    }
  };

  // 文件筛选
  const filteredFiles = (() => {
    let filtered = files;
    
    // 搜索筛选
    if (searchQuery) {
      filtered = filtered.filter(file => 
        file.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        file.type.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // 分类筛选
    if (activeTab !== '全部') {
      const categoryMap: Record<string, string> = {
        '文档': 'document',
        '图片': 'image',
        '视频': 'video',
        '音频': 'audio',
      };
      
      const category = categoryMap[activeTab];
      if (category) {
        filtered = filtered.filter(file => file.category === category);
      }
    }

    // 排序
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortBy) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'date':
          aValue = new Date(a.date).getTime();
          bValue = new Date(b.date).getTime();
          break;
        case 'size':
          aValue = a.fileSize || 0;
          bValue = b.fileSize || 0;
          break;
        case 'type':
          aValue = a.type.toLowerCase();
          bValue = b.type.toLowerCase();
          break;
        default:
          return 0;
      }
      
      return sortOrder === 'asc' ? 
        (aValue > bValue ? 1 : -1) : 
        (aValue < bValue ? 1 : -1);
    });

    return filtered;
  })();

  // 选择操作
  const toggleSelectAll = () => {
    if (selectedItems.length === filteredFiles.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredFiles.map(file => file.id || ''));
    }
  };

  const toggleSelect = (itemId: string) => {
    setSelectedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  // 获取状态徽章
  const getStatusBadge = (status: string) => {
    if (!status) return null;
    
    const statusConfig: Record<string, { color: string; bgColor: string; icon: React.ReactNode }> = {
      '已向量化': { color: 'text-green-700', bgColor: 'bg-green-100', icon: <CheckCircle className="w-3 h-3" /> },
      '处理中': { color: 'text-blue-700', bgColor: 'bg-blue-100', icon: <Clock className="w-3 h-3 animate-spin" /> },
      '待处理': { color: 'text-yellow-700', bgColor: 'bg-yellow-100', icon: <Clock className="w-3 h-3" /> },
      '失败': { color: 'text-red-700', bgColor: 'bg-red-100', icon: <AlertCircle className="w-3 h-3" /> },
      '暂停': { color: 'text-gray-700', bgColor: 'bg-gray-100', icon: <Clock className="w-3 h-3" /> },
    };
    
    const config = statusConfig[status] || { color: 'text-gray-700', bgColor: 'bg-gray-100', icon: null };
    
    return (
      <span className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-xs font-medium ${config.bgColor} ${config.color}`}>
        {config.icon}
        <span>{status}</span>
      </span>
    );
  };

  // 获取文件图标
  const getFileIcon = (file: FileItem) => {
    // 如果是文件夹，显示文件夹图标
    if (file.isFolder || file.type === 'FOLDER') {
      return <FolderPlus className="w-5 h-5 text-blue-500" />;
    }
    
    const iconMap: Record<string, React.ReactNode> = {
      'PDF': <FileText className="w-5 h-5 text-red-500" />,
      'Word': <FileText className="w-5 h-5 text-blue-500" />,
      'Excel': <Database className="w-5 h-5 text-green-500" />,
      'PNG': <Image className="w-5 h-5 text-purple-500" />,
      'JPG': <Image className="w-5 h-5 text-purple-500" />,
      'GIF': <Image className="w-5 h-5 text-purple-500" />,
      'MP4': <Video className="w-5 h-5 text-orange-500" />,
      'MP3': <Music className="w-5 h-5 text-pink-500" />,
      'TXT': <FileText className="w-5 h-5 text-gray-500" />,
      'Markdown': <FileText className="w-5 h-5 text-blue-400" />,
    };
    
    return iconMap[file.type] || <FileText className="w-5 h-5 text-gray-500" />;
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col h-full">
      {/* 头部 */}
      <div className="bg-gray-50 border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          <span className="text-sm text-gray-500">{files.length} 个文件</span>
          {/* SSE连接状态 */}
          <div className="flex items-center space-x-2">
            {isConnected ? (
              <div className="flex items-center space-x-1 text-green-600">
                <CheckCircle className="w-4 h-4" />
                <span className="text-xs">实时同步</span>
              </div>
            ) : (
              <div className="flex items-center space-x-1 text-gray-500">
                <AlertCircle className="w-4 h-4" />
                <span className="text-xs">离线模式</span>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={loadFiles}
            disabled={loading}
            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
            title="刷新"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          
          {onClose && (
            <button 
              onClick={onClose} 
              className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* 面包屑导航 */}
      <div className="px-4 py-2 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center space-x-2 text-sm">
          <span className="text-gray-500">位置:</span>
          {folderBreadcrumb.map((item, index) => (
            <React.Fragment key={item.id || 'root'}>
              {index > 0 && <span className="text-gray-400">/</span>}
              <button
                onClick={() => navigateToFolder(item.id, item.name)}
                className={`hover:text-blue-600 transition-colors ${
                  index === folderBreadcrumb.length - 1 
                    ? 'text-blue-600 font-medium' 
                    : 'text-gray-600 hover:underline'
                }`}
              >
                {item.name}
              </button>
            </React.Fragment>
          ))}
          {selectedFolderId && (
            <div className="ml-4 text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
              上传目标: {files.find(f => f.id === selectedFolderId)?.name || '选中的文件夹'}
            </div>
          )}
        </div>
      </div>

      {/* 控制栏 */}
      <div className="px-4 py-3 border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between mb-3">
          {/* 搜索 */}
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="搜索文件..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-3 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>
          
          {/* 操作按钮 */}
          <div className="flex items-center space-x-2 ml-4">
            {/* 视图切换 */}
            <div className="flex items-center bg-gray-100 rounded-md p-1">
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded transition-colors ${
                  viewMode === 'list' 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded transition-colors ${
                  viewMode === 'grid' 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
            </div>

            {/* 排序 */}
            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [newSortBy, newSortOrder] = e.target.value.split('-') as [typeof sortBy, typeof sortOrder];
                setSortBy(newSortBy);
                setSortOrder(newSortOrder);
              }}
              className="px-3 py-2 border border-gray-300 rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="name-asc">名称 A-Z</option>
              <option value="name-desc">名称 Z-A</option>
              <option value="date-desc">最新修改</option>
              <option value="date-asc">最早修改</option>
              <option value="size-desc">大小递减</option>
              <option value="size-asc">大小递增</option>
            </select>

            {/* 文件夹和上传按钮 */}
            <button
              onClick={() => setShowCreateFolder(true)}
              className="flex items-center space-x-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors text-sm"
              title="创建文件夹"
            >
              <FolderPlus className="w-4 h-4" />
              <span>新建文件夹</span>
            </button>
            
            <button
              onClick={() => setShowUploader(true)}
              className="flex items-center space-x-1 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
            >
              <Upload className="w-4 h-4" />
              <span>上传文件</span>
            </button>
          </div>
        </div>
        
        {/* 分类标签 */}
        <div className="flex items-center space-x-1">
          {[
            { key: '全部', icon: <Database className="w-4 h-4" /> },
            { key: '文档', icon: <FileText className="w-4 h-4" /> },
            { key: '图片', icon: <Image className="w-4 h-4" /> },
            { key: '视频', icon: <Video className="w-4 h-4" /> },
            { key: '音频', icon: <Music className="w-4 h-4" /> }
          ].map((tab) => (
            <button
              key={tab.key}
              className={`flex items-center space-x-1 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab.key
                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
              }`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.icon}
              <span>{tab.key}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 批量操作栏 */}
      {selectedItems.length > 0 && (
        <div className="px-4 py-2 bg-blue-50 border-b border-blue-100 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <span className="text-sm font-medium text-blue-800">
              已选择 {selectedItems.length} 个文件
            </span>
            <div className="flex items-center space-x-2">
              <button className="flex items-center space-x-1 px-2 py-1 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-100 rounded transition-colors">
                <Download className="w-4 h-4" />
                <span>下载</span>
              </button>
            </div>
          </div>
          <button
            onClick={deleteSelectedFiles}
            className="flex items-center space-x-1 px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-md transition-colors text-sm"
          >
            <Trash2 className="w-4 h-4" />
            <span>删除选中</span>
          </button>
        </div>
      )}

      {/* 错误提示 */}
      {error && (
        <div className="mx-4 mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <div className="flex items-center">
            <AlertCircle className="w-4 h-4 text-red-500 mr-2" />
            <span className="text-sm text-red-700">{error}</span>
            <button
              onClick={() => setError(null)}
              className="ml-auto text-red-500 hover:text-red-700"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* 文件列表 */}
      <div className="flex-grow overflow-auto">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="flex items-center space-x-2 text-gray-500">
              <RefreshCw className="w-5 h-5 animate-spin" />
              <span>加载中...</span>
            </div>
          </div>
        ) : filteredFiles.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <Database className="w-12 h-12 mb-3 opacity-25" />
            <p className="text-lg font-medium mb-1">没有找到文件</p>
            <p className="text-sm">上传文件或修改搜索条件</p>
          </div>
        ) : (
          <div className={viewMode === 'list' ? '' : 'p-4'}>
            {viewMode === 'list' ? (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 sticky top-0 z-10">
                  <tr>
                    <th scope="col" className="px-4 py-3 text-left">
                      <input 
                        type="checkbox" 
                        checked={selectedItems.length === filteredFiles.length && filteredFiles.length > 0} 
                        onChange={toggleSelectAll}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      名称
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      类型
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      大小
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      修改日期
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      状态
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      分块数
                    </th>
                    <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      操作
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredFiles.map((file) => (
                    <tr 
                      key={file.id} 
                      className={`hover:bg-gray-50 transition-colors cursor-pointer ${
                        selectedItems.includes(file.id || '') ? 'bg-blue-50' : ''
                      } ${
                        file.isFolder && selectedFolderId === file.id ? 'bg-blue-100 border-l-4 border-blue-500' : ''
                      }`}
                      onClick={() => {
                        if (file.isFolder) {
                          handleFolderSelect(file.id || '');
                        }
                      }}
                      onDoubleClick={() => {
                        if (file.isFolder) {
                          handleFolderDoubleClick(file);
                        }
                      }}
                    >
                      <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={selectedItems.includes(file.id || '')}
                          onChange={() => toggleSelect(file.id || '')}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-8 w-8 rounded-md bg-gray-50 flex items-center justify-center border border-gray-200">
                            {getFileIcon(file)}
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">{file.name}</div>
                            <div className="text-xs text-gray-500">{file.path}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm text-gray-600">{file.type}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm text-gray-600">{file.size}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm text-gray-600">{file.date}</div>
                      </td>
                      <td className="px-4 py-3">
                        {getStatusBadge(file.status || '')}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center space-x-2">
                          <Layers className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600">{file.chunkCount || 0}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end space-x-1">
                          <button 
                            className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedFileDetail(file);
                            }}
                            title="查看详情"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button 
                            className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (confirm(`确定要删除文件 "${file.name}" 吗？`)) {
                                deleteFile(file.id || '');
                              }
                            }}
                            title="删除文件"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              // 网格视图
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                {filteredFiles.map((file) => (
                  <div
                    key={file.id}
                    className={`group relative p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all cursor-pointer ${
                      selectedItems.includes(file.id || '') ? 'border-blue-300 bg-blue-50' : 'bg-white'
                    } ${
                      file.isFolder && selectedFolderId === file.id ? 'border-blue-500 bg-blue-100 shadow-md' : ''
                    }`}
                    onClick={() => {
                      if (file.isFolder) {
                        handleFolderSelect(file.id || '');
                      }
                    }}
                    onDoubleClick={() => {
                      if (file.isFolder) {
                        handleFolderDoubleClick(file);
                      }
                    }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(file.id || '')}
                        onChange={(e) => {
                          e.stopPropagation();
                          toggleSelect(file.id || '');
                        }}
                        className="w-3 h-3 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <button 
                        className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-gray-600 transition-opacity"
                        onClick={() => setSelectedFileDetail(file)}
                      >
                        <MoreHorizontal className="w-3 h-3" />
                      </button>
                    </div>
                    
                    <div className="flex flex-col items-center text-center">
                      <div className="w-8 h-8 rounded-md bg-gray-50 flex items-center justify-center mb-2 border border-gray-200">
                        {getFileIcon(file)}
                      </div>
                      <div className="text-xs font-medium text-gray-900 truncate w-full">{file.name}</div>
                      <div className="text-xs text-gray-500 mt-1">{file.type}</div>
                      {file.status && (
                        <div className="mt-1">
                          {getStatusBadge(file.status)}
                        </div>
                      )}
                      {file.chunkCount > 0 && (
                        <div className="flex items-center space-x-1 mt-1 text-xs text-gray-500">
                          <Layers className="w-3 h-3" />
                          <span>{file.chunkCount}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* 文档上传器 */}
      {showUploader && (
        <EnhancedDocumentUploader
          knowledgeBaseId={knowledgeBaseId}
          userId={userId}
          messageServiceUrl={messageServiceUrl}
          apiBaseUrl={apiBaseUrl}
          onUploadComplete={handleUploadComplete}
          onClose={() => setShowUploader(false)}
          maxSize={50}
          multiple={true}
          folderId={selectedFolderId || currentFolderId} // 传递目标文件夹ID
        />
      )}

      {/* SSE监控器 */}
      {showSSEMonitor && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">处理进度监控</h3>
              <button
                onClick={() => setShowSSEMonitor(false)}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <SSEProgressMonitor
              userId={userId}
              messageServiceUrl={messageServiceUrl}
              className="border-none shadow-none"
            />
          </div>
        </div>
      )}

      {/* 文件详情模态框 */}
      {selectedFileDetail && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-auto">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">文件详情</h3>
              <button
                onClick={() => setSelectedFileDetail(null)}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 rounded-lg bg-gray-50 flex items-center justify-center border border-gray-200">
                  {getFileIcon(selectedFileDetail)}
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-medium text-gray-900">{selectedFileDetail.name}</h4>
                  <p className="text-sm text-gray-500 mt-1">{selectedFileDetail.path}</p>
                  
                  <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">文件类型:</span>
                      <span className="ml-2 text-gray-900">{selectedFileDetail.type}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">文件大小:</span>
                      <span className="ml-2 text-gray-900">{selectedFileDetail.size}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">上传时间:</span>
                      <span className="ml-2 text-gray-900">{selectedFileDetail.date}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">处理状态:</span>
                      <span className="ml-2">{getStatusBadge(selectedFileDetail.status || '')}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">分块数量:</span>
                      <span className="ml-2 text-gray-900">{selectedFileDetail.chunkCount || 0} 个</span>
                    </div>
                    <div>
                      <span className="text-gray-500">向量数量:</span>
                      <span className="ml-2 text-gray-900">{selectedFileDetail.vectorCount || 0} 个</span>
                    </div>
                  </div>

                  {selectedFileDetail.splitterStrategy && (
                    <div className="mt-4">
                      <span className="text-gray-500">切分策略:</span>
                      <span className="ml-2 text-gray-900">{selectedFileDetail.splitterStrategy}</span>
                    </div>
                  )}

                  {selectedFileDetail.error && (
                    <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                      <div className="flex items-center">
                        <AlertCircle className="w-4 h-4 text-red-500 mr-2" />
                        <span className="text-sm text-red-700">{selectedFileDetail.error}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 创建文件夹弹窗 */}
      {showCreateFolder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold text-gray-900">创建新文件夹</h3>
              <button
                onClick={() => {
                  setShowCreateFolder(false);
                  setNewFolderName('');
                }}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-4">
              <div className="mb-4">
                <label htmlFor="folderName" className="block text-sm font-medium text-gray-700 mb-2">
                  文件夹名称
                </label>
                <input
                  type="text"
                  id="folderName"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="请输入文件夹名称"
                  autoFocus
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && newFolderName.trim()) {
                      createFolder(newFolderName.trim());
                    }
                  }}
                />
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowCreateFolder(false);
                    setNewFolderName('');
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={() => {
                    if (newFolderName.trim()) {
                      createFolder(newFolderName.trim());
                    }
                  }}
                  disabled={!newFolderName.trim()}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed rounded-md transition-colors"
                >
                  创建
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IntegratedFileManager;