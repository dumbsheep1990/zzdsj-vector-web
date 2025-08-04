import React, { useState, useCallback, useEffect } from 'react';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '../../../components/ui/Table';
import { FileItem as FileItemType } from '../../../utils/types';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '../../../components/ui/Pagination';
import { Checkbox } from '../../../components/ui/Checkbox';
import EnhancedFileItem from './EnhancedFileItem';
import EmptyState from './EmptyState';
import PauseConfirmDialog from './PauseConfirmDialog';
import FileDetailPanel from './FileDetailPanel';
import { MiniProgressIndicator } from '../../common/ProgressIndicator';
import { useSSEConnection, SSEMessage } from '../../../hooks/common/useSSEConnection';
import { 
  Settings, 
  Activity, 
  Clock,
  CheckCircle,
  AlertTriangle,
  Database
} from 'lucide-react';

// 扩展的文件项，包含处理进度和块信息
interface EnhancedFileItem extends FileItemType {
  // 处理进度信息
  processingProgress?: number;
  processingStage?: string;
  processingMessage?: string;
  processingStatus?: 'idle' | 'processing' | 'completed' | 'error';
  taskId?: string;
  
  // 文档块信息
  totalChunks?: number;
  processedChunks?: number;
  chunkStrategy?: string;
  chunkSize?: number;
  chunkOverlap?: number;
  
  // 向量化信息
  vectorized?: boolean;
  vectorDimensions?: number;
  embeddingModel?: string;
  
  // 时间信息
  processingStartTime?: Date;
  processingEndTime?: Date;
  estimatedTimeRemaining?: number;
}

interface EnhancedFilesListProps {
  files: FileItemType[];
  selectedItem: FileItemType | null;
  setSelectedItem: (item: FileItemType | null) => void;
  selectedItems: string[];
  setSelectedItems: React.Dispatch<React.SetStateAction<string[]>>;
  knowledgeBaseId: string;
  userId: string;
  messageServiceUrl?: string;
  apiBaseUrl?: string;
}

/**
 * 增强版文件列表组件
 * 集成SSE实时进度监控，显示切分块数和处理进度
 */
const EnhancedFilesList: React.FC<EnhancedFilesListProps> = ({ 
  files, 
  selectedItem, 
  setSelectedItem, 
  selectedItems, 
  setSelectedItems,
  knowledgeBaseId,
  userId,
  messageServiceUrl = 'http://localhost:8089',
  apiBaseUrl = 'http://localhost:8082'
}) => {
  // 基础状态
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedFolders, setExpandedFolders] = useState<string[]>([]);
  const [vectorizeSettingsChanged, setVectorizeSettingsChanged] = useState<Record<string, boolean>>({});
  const [showPauseConfirm, setShowPauseConfirm] = useState<string | null>(null);
  const [activeDetailFile, setActiveDetailFile] = useState<FileItemType | null>(null);
  const itemsPerPage = 10;
  
  // 增强状态：文件处理信息
  const [enhancedFiles, setEnhancedFiles] = useState<Map<string, EnhancedFileItem>>(new Map());
  const [processingFiles, setProcessingFiles] = useState<Set<string>>(new Set());
  const [showProcessingOnly, setShowProcessingOnly] = useState(false);

  // SSE连接
  const { 
    isConnected, 
    connectionStatus, 
    messages 
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

    // 更新文件处理状态
    setEnhancedFiles(prev => {
      const newMap = new Map(prev);
      
      // 查找对应的文件ID（通过taskId关联）
      let targetFileId: string | null = null;
      for (const [fileId, fileData] of newMap.entries()) {
        if (fileData.taskId === taskId) {
          targetFileId = fileId;
          break;
        }
      }
      
      // 如果找不到对应文件，尝试通过其他方式匹配
      if (!targetFileId && message.data.details?.document_id) {
        targetFileId = message.data.details.document_id;
      }
      
      if (!targetFileId) return newMap;

      const currentFile = newMap.get(targetFileId) || {} as EnhancedFileItem;

      switch (message.type) {
        case 'progress':
          newMap.set(targetFileId, {
            ...currentFile,
            processingProgress: message.data.progress || 0,
            processingStage: message.data.stage || '',
            processingMessage: message.data.message || '',
            processingStatus: 'processing',
            taskId,
            // 更新块信息
            totalChunks: message.data.details?.total_chunks || currentFile.totalChunks,
            processedChunks: message.data.details?.processed_chunks || currentFile.processedChunks,
            chunkStrategy: message.data.details?.chunk_strategy || currentFile.chunkStrategy,
            chunkSize: message.data.details?.chunk_size || currentFile.chunkSize,
            chunkOverlap: message.data.details?.chunk_overlap || currentFile.chunkOverlap,
            embeddingModel: message.data.details?.embedding_model || currentFile.embeddingModel,
            vectorDimensions: message.data.details?.vector_dimensions || currentFile.vectorDimensions
          });
          
          setProcessingFiles(prev => new Set(prev).add(targetFileId!));
          break;

        case 'success':
          newMap.set(targetFileId, {
            ...currentFile,
            processingProgress: 100,
            processingStatus: 'completed',
            processingMessage: message.data.message || '处理完成',
            processingEndTime: new Date(),
            vectorized: true,
            totalChunks: message.data.result?.total_chunks || currentFile.totalChunks,
            processedChunks: message.data.result?.processed_chunks || currentFile.totalChunks
          });
          
          setProcessingFiles(prev => {
            const newSet = new Set(prev);
            newSet.delete(targetFileId!);
            return newSet;
          });
          break;

        case 'error':
          newMap.set(targetFileId, {
            ...currentFile,
            processingStatus: 'error',
            processingMessage: message.data.error_message || '处理失败'
          });
          
          setProcessingFiles(prev => {
            const newSet = new Set(prev);
            newSet.delete(targetFileId!);
            return newSet;
          });
          break;
      }

      return newMap;
    });
  }

  // 初始化文件增强信息
  useEffect(() => {
    const newEnhancedFiles = new Map<string, EnhancedFileItem>();
    
    files.forEach(file => {
      if (file.id && !file.isFolder) {
        newEnhancedFiles.set(file.id, {
          ...file,
          processingStatus: 'idle',
          processingProgress: 0,
          totalChunks: 0,
          processedChunks: 0,
          vectorized: false
        });
      }
    });
    
    setEnhancedFiles(newEnhancedFiles);
  }, [files]);

  // 获取增强的文件数据
  const getEnhancedFile = useCallback((file: FileItemType): EnhancedFileItem => {
    if (!file.id) return file as EnhancedFileItem;
    return enhancedFiles.get(file.id) || file as EnhancedFileItem;
  }, [enhancedFiles]);

  // 开始处理文件
  const handleStartVectorize = async (fileId: string) => {
    try {
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

      if (response.ok) {
        const result = await response.json();
        const taskId = result.task_id;
        
        // 更新文件状态
        setEnhancedFiles(prev => {
          const newMap = new Map(prev);
          const currentFile = newMap.get(fileId) || {} as EnhancedFileItem;
          newMap.set(fileId, {
            ...currentFile,
            processingStatus: 'processing',
            processingProgress: 0,
            processingMessage: '开始处理...',
            processingStartTime: new Date(),
            taskId
          });
          return newMap;
        });
        
        setProcessingFiles(prev => new Set(prev).add(fileId));
      } else {
        console.error('启动文件处理失败:', response.statusText);
      }
    } catch (error) {
      console.error('启动文件处理出错:', error);
    }
  };

  // 暂停处理文件
  const handlePauseVectorize = (fileId: string) => {
    setShowPauseConfirm(fileId);
  };

  // 切换设置
  const handleToggleSettings = (fileId: string) => {
    setVectorizeSettingsChanged(prev => ({
      ...prev,
      [fileId]: !prev[fileId]
    }));
  };

  // Toggle folder expansion
  const toggleFolder = (folderId: string) => {
    setExpandedFolders(prev => {
      if (prev.includes(folderId)) {
        return prev.filter(id => id !== folderId);
      } else {
        return [...prev, folderId];
      }
    });
  };

  // Handle item selection
  const handleItemSelection = (itemId: string, isSelected: boolean) => {
    if (isSelected) {
      setSelectedItems(prev => [...prev, itemId]);
    } else {
      setSelectedItems(prev => prev.filter(id => id !== itemId));
    }
  };

  // Handle select all
  const handleSelectAll = () => {
    const visibleFiles = getFilteredFiles();
    if (selectedItems.length === visibleFiles.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(visibleFiles.map(file => file.id || ''));
    }
  };

  // 过滤文件
  const getFilteredFiles = () => {
    let filteredFiles = files;
    
    if (showProcessingOnly) {
      filteredFiles = files.filter(file => 
        file.id && (
          processingFiles.has(file.id) || 
          getEnhancedFile(file).processingStatus === 'processing'
        )
      );
    }
    
    return filteredFiles;
  };

  // 渲染文件项
  const renderFileItem = (item: FileItemType, depth = 0) => {
    const enhancedItem = getEnhancedFile(item);
    const isExpanded = expandedFolders.includes(item.id || '');
    const isSelected = selectedItems.includes(item.id || '');
    
    return (
      <EnhancedFileItem 
        key={item.id || `temp-${Math.random()}`}
        item={enhancedItem}
        depth={depth}
        isExpanded={isExpanded}
        selectedItem={selectedItem}
        vectorizeSettingsChanged={vectorizeSettingsChanged}
        toggleFolder={toggleFolder}
        setSelectedItem={setSelectedItem}
        handleStartVectorize={handleStartVectorize}
        handlePauseVectorize={handlePauseVectorize}
        toggleVectorizeSettings={handleToggleSettings}
        renderFileItem={renderFileItem}
        isSelected={isSelected}
        onSelectionChange={handleItemSelection}
        onShowDetails={(file) => setActiveDetailFile(file)}
        isProcessing={item.id ? processingFiles.has(item.id) : false}
      />
    );
  };

  const filteredFiles = getFilteredFiles();
  const totalPages = Math.ceil(filteredFiles.length / itemsPerPage);
  const paginatedFiles = filteredFiles.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // 计算统计信息
  const totalFiles = files.filter(f => !f.isFolder).length;
  const processingCount = processingFiles.size;
  const completedCount = Array.from(enhancedFiles.values())
    .filter(f => f.processingStatus === 'completed').length;
  const errorCount = Array.from(enhancedFiles.values())
    .filter(f => f.processingStatus === 'error').length;

  if (files.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="flex flex-col h-full relative">
      {/* 顶部状态栏 */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          {/* 左侧：SSE连接状态和统计 */}
          <div className="flex items-center space-x-4">
            {/* SSE连接状态 */}
            <div className="flex items-center space-x-2">
              {isConnected ? (
                <CheckCircle className="w-4 h-4 text-green-500" />
              ) : (
                <Clock className="w-4 h-4 text-gray-400" />
              )}
              <span className="text-sm text-gray-600">
                {isConnected ? '实时连接' : '离线模式'}
              </span>
            </div>
            
            {/* 文件统计 */}
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <span>总计: {totalFiles}</span>
              {processingCount > 0 && (
                <span className="flex items-center space-x-1 text-blue-600">
                  <Activity className="w-3 h-3" />
                  <span>处理中: {processingCount}</span>
                </span>
              )}
              {completedCount > 0 && (
                <span className="flex items-center space-x-1 text-green-600">
                  <CheckCircle className="w-3 h-3" />
                  <span>已完成: {completedCount}</span>
                </span>
              )}
              {errorCount > 0 && (
                <span className="flex items-center space-x-1 text-red-600">
                  <AlertTriangle className="w-3 h-3" />
                  <span>错误: {errorCount}</span>
                </span>
              )}
            </div>
          </div>
          
          {/* 右侧：过滤选项 */}
          <div className="flex items-center space-x-3">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showProcessingOnly}
                onChange={(e) => setShowProcessingOnly(e.target.checked)}
                className="rounded"
              />
              <span className="text-sm text-gray-600">仅显示处理中</span>
            </label>
            
            <button
              onClick={() => setSelectedItems([])}
              className="text-sm text-gray-600 hover:text-gray-800"
            >
              清除选择
            </button>
          </div>
        </div>
      </div>

      {/* 覆盖层 */}
      {activeDetailFile && (
        <div 
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-10"
          onClick={() => setActiveDetailFile(null)}
        />
      )}
      
      {/* 主内容 */}
      <div className={`flex h-full relative ${activeDetailFile ? 'opacity-70' : ''}`}>
        <div className="overflow-auto w-full">
          <Table>
            <TableHeader className="bg-gray-50 sticky top-0 z-10">
              <TableRow>
                <TableHead className="w-4/12 text-left pl-4 py-4 h-14">名称</TableHead>
                <TableHead className="w-1/12 text-center py-4 h-14">类型</TableHead>
                <TableHead className="w-1/12 text-center py-4 h-14">大小</TableHead>
                <TableHead className="w-1/12 text-center py-4 h-14">块数</TableHead>
                <TableHead className="w-2/12 text-center py-4 h-14">进度</TableHead>
                <TableHead className="w-1/12 text-center py-4 h-14">状态</TableHead>
                <TableHead className="w-1/12 text-center py-4 h-14">操作</TableHead>
                <TableHead className="w-1/12 text-center py-4 h-14">
                  <Checkbox 
                    checked={selectedItems.length === filteredFiles.length && filteredFiles.length > 0}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedFiles.map(item => renderFileItem(item))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* 文件详情面板 */}
      {activeDetailFile && (
        <div className="fixed top-0 right-0 h-full w-1/2 z-20 shadow-2xl rounded-l-2xl overflow-hidden">
          <FileDetailPanel 
            file={activeDetailFile} 
            onClose={() => setActiveDetailFile(null)}
            fileStatus={getEnhancedFile(activeDetailFile).processingStatus || 'idle'}
            onStartVectorize={handleStartVectorize}
            onPauseVectorize={handlePauseVectorize}
            onToggleSettings={handleToggleSettings}
          />
        </div>
      )}

      {/* 分页 */}
      <div className="mt-auto pt-4 border-t border-gray-200">
        {totalPages > 1 && (
          <div className="p-2 border-t bg-white">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                  />
                </PaginationItem>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <PaginationItem key={page}>
                    <PaginationLink 
                      onClick={() => setCurrentPage(page)}
                      isActive={currentPage === page}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                
                <PaginationItem>
                  <PaginationNext 
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>

      {/* 暂停确认对话框 */}
      {showPauseConfirm && (
        <PauseConfirmDialog 
          isOpen={!!showPauseConfirm}
          onClose={() => setShowPauseConfirm(null)}
          onConfirm={() => {
            if (showPauseConfirm) {
              setEnhancedFiles(prev => {
                const newMap = new Map(prev);
                const currentFile = newMap.get(showPauseConfirm) || {} as EnhancedFileItem;
                newMap.set(showPauseConfirm, {
                  ...currentFile,
                  processingStatus: 'idle',
                  processingMessage: '已暂停'
                });
                return newMap;
              });
              
              setProcessingFiles(prev => {
                const newSet = new Set(prev);
                newSet.delete(showPauseConfirm);
                return newSet;
              });
              
              setShowPauseConfirm(null);
            }
          }}
        />
      )}
    </div>
  );
};

export default EnhancedFilesList;