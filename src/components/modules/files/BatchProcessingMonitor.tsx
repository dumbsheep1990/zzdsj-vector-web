import React, { useState, useEffect, useCallback } from 'react';
import { 
  Activity, 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  Pause, 
  Play,
  RotateCcw,
  X,
  BarChart3,
  TrendingUp,
  Database,
  Layers3
} from 'lucide-react';
import DocumentProcessingCard from './DocumentProcessingCard';
import { MiniProgressIndicator } from '../../common/ProgressIndicator';
import { useSSEConnection, SSEMessage } from '../../../hooks/common/useSSEConnection';

// 批量处理状态
interface BatchProcessingStatus {
  totalFiles: number;
  processingFiles: number;
  completedFiles: number;
  errorFiles: number;
  pausedFiles: number;
  totalProgress: number;
  startTime: Date;
  estimatedEndTime?: Date;
  averageProcessingTime: number;
  processingSpeed: number; // files/minute
}

// 单个文档的处理信息
interface DocumentProcessingInfo {
  documentId: string;
  documentName: string;
  taskId?: string;
  progress: number;
  stage: string;
  status: 'idle' | 'processing' | 'completed' | 'error' | 'paused';
  message: string;
  totalChunks: number;
  processedChunks: number;
  chunkStrategy: string;
  chunkSize: number;
  chunkOverlap: number;
  embeddingModel?: string;
  vectorDimensions?: number;
  vectorCount?: number;
  startTime: Date;
  endTime?: Date;
  estimatedTimeRemaining?: number;
  processingSpeed?: number;
  averageChunkSize?: number;
  duplicateChunks?: number;
  emptyChunks?: number;
  errorChunks?: number;
}

interface BatchProcessingMonitorProps {
  knowledgeBaseId: string;
  userId: string;
  messageServiceUrl?: string;
  apiBaseUrl?: string;
  onClose?: () => void;
  className?: string;
  initialFiles?: string[]; // 初始文件ID列表
}

/**
 * 批量文档处理监控面板
 * 显示多个文档的处理进度和整体统计信息
 */
const BatchProcessingMonitor: React.FC<BatchProcessingMonitorProps> = ({
  knowledgeBaseId,
  userId,
  messageServiceUrl = 'http://localhost:8089',
  apiBaseUrl = 'http://localhost:8082',
  onClose,
  className = '',
  initialFiles = []
}) => {
  // 状态管理
  const [batchStatus, setBatchStatus] = useState<BatchProcessingStatus>({
    totalFiles: 0,
    processingFiles: 0,
    completedFiles: 0,
    errorFiles: 0,
    pausedFiles: 0,
    totalProgress: 0,
    startTime: new Date(),
    averageProcessingTime: 0,
    processingSpeed: 0
  });
  
  const [documentInfos, setDocumentInfos] = useState<Map<string, DocumentProcessingInfo>>(new Map());
  const [activeTab, setActiveTab] = useState<'all' | 'processing' | 'completed' | 'error'>('all');
  const [showMiniView, setShowMiniView] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // SSE连接
  const { isConnected, messages } = useSSEConnection({
    userId,
    messageServiceUrl,
    autoConnect: true,
    onMessage: handleSSEMessage
  });

  // 处理SSE消息
  function handleSSEMessage(message: SSEMessage) {
    const taskId = message.data.task_id;
    if (!taskId) return;

    setDocumentInfos(prev => {
      const newMap = new Map(prev);
      
      // 查找对应的文档
      let targetDocId: string | null = null;
      for (const [docId, docInfo] of newMap.entries()) {
        if (docInfo.taskId === taskId) {
          targetDocId = docId;
          break;
        }
      }
      
      if (!targetDocId && message.data.details?.document_id) {
        targetDocId = message.data.details.document_id;
      }
      
      if (!targetDocId) return newMap;

      const currentInfo = newMap.get(targetDocId);
      if (!currentInfo) return newMap;

      switch (message.type) {
        case 'progress':
          newMap.set(targetDocId, {
            ...currentInfo,
            progress: message.data.progress || 0,
            stage: message.data.stage || '',
            message: message.data.message || '',
            status: 'processing',
            totalChunks: message.data.details?.total_chunks || currentInfo.totalChunks,
            processedChunks: message.data.details?.processed_chunks || currentInfo.processedChunks,
            processingSpeed: message.data.details?.processing_speed || currentInfo.processingSpeed,
            estimatedTimeRemaining: message.data.details?.estimated_time_remaining || currentInfo.estimatedTimeRemaining
          });
          break;

        case 'success':
          newMap.set(targetDocId, {
            ...currentInfo,
            progress: 100,
            status: 'completed',
            message: message.data.message || '处理完成',
            endTime: new Date(),
            vectorCount: message.data.result?.vector_count || currentInfo.vectorCount,
            totalChunks: message.data.result?.total_chunks || currentInfo.totalChunks,
            processedChunks: message.data.result?.processed_chunks || currentInfo.totalChunks
          });
          break;

        case 'error':
          newMap.set(targetDocId, {
            ...currentInfo,
            status: 'error',
            message: message.data.error_message || '处理失败'
          });
          break;
      }

      return newMap;
    });
  }

  // 更新批量处理状态
  useEffect(() => {
    const docs = Array.from(documentInfos.values());
    const totalFiles = docs.length;
    const processingFiles = docs.filter(d => d.status === 'processing').length;
    const completedFiles = docs.filter(d => d.status === 'completed').length;
    const errorFiles = docs.filter(d => d.status === 'error').length;
    const pausedFiles = docs.filter(d => d.status === 'paused').length;
    
    const totalProgress = totalFiles > 0 
      ? Math.round(docs.reduce((sum, doc) => sum + doc.progress, 0) / totalFiles)
      : 0;

    // 计算处理速度和预计时间
    const completedDocs = docs.filter(d => d.status === 'completed' && d.endTime);
    let averageProcessingTime = 0;
    let processingSpeed = 0;

    if (completedDocs.length > 0) {
      const totalProcessingTime = completedDocs.reduce((sum, doc) => {
        return sum + (doc.endTime!.getTime() - doc.startTime.getTime());
      }, 0);
      averageProcessingTime = totalProcessingTime / completedDocs.length;
      processingSpeed = (completedDocs.length / (Date.now() - batchStatus.startTime.getTime())) * 60000; // files/minute
    }

    setBatchStatus(prev => ({
      ...prev,
      totalFiles,
      processingFiles,
      completedFiles,
      errorFiles,
      pausedFiles,
      totalProgress,
      averageProcessingTime,
      processingSpeed
    }));
  }, [documentInfos, batchStatus.startTime]);

  // 初始化文档信息
  useEffect(() => {
    if (initialFiles.length > 0) {
      const newDocInfos = new Map<string, DocumentProcessingInfo>();
      
      initialFiles.forEach(fileId => {
        newDocInfos.set(fileId, {
          documentId: fileId,
          documentName: `文档_${fileId.slice(-8)}`,
          progress: 0,
          stage: '',
          status: 'idle',
          message: '等待处理',
          totalChunks: 0,
          processedChunks: 0,
          chunkStrategy: 'token_based',
          chunkSize: 1000,
          chunkOverlap: 200,
          startTime: new Date()
        });
      });
      
      setDocumentInfos(newDocInfos);
    }
  }, [initialFiles]);

  // 暂停/恢复批量处理
  const handlePauseResume = async () => {
    setIsPaused(!isPaused);
    // 这里可以调用API暂停/恢复处理
  };

  // 取消特定任务
  const handleCancelTask = async (taskId: string) => {
    try {
      await fetch(`${apiBaseUrl}/api/v1/tasks/${taskId}/cancel`, {
        method: 'POST'
      });
    } catch (error) {
      console.error('取消任务失败:', error);
    }
  };

  // 重试文档处理
  const handleRetryDocument = async (documentId: string) => {
    try {
      const response = await fetch(
        `${apiBaseUrl}/api/v1/knowledge-bases/${knowledgeBaseId}/documents/${documentId}/process-async`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user_id: userId, enable_async_processing: true })
        }
      );
      
      if (response.ok) {
        const result = await response.json();
        setDocumentInfos(prev => {
          const newMap = new Map(prev);
          const currentInfo = newMap.get(documentId);
          if (currentInfo) {
            newMap.set(documentId, {
              ...currentInfo,
              status: 'processing',
              progress: 0,
              message: '重新处理中...',
              taskId: result.task_id,
              startTime: new Date()
            });
          }
          return newMap;
        });
      }
    } catch (error) {
      console.error('重试文档处理失败:', error);
    }
  };

  // 过滤文档
  const getFilteredDocs = () => {
    const docs = Array.from(documentInfos.values());
    
    switch (activeTab) {
      case 'processing':
        return docs.filter(d => d.status === 'processing');
      case 'completed':
        return docs.filter(d => d.status === 'completed');
      case 'error':
        return docs.filter(d => d.status === 'error');
      default:
        return docs;
    }
  };

  // 计算预计完成时间
  const getEstimatedCompletion = () => {
    if (batchStatus.processingSpeed <= 0) return null;
    
    const remainingFiles = batchStatus.totalFiles - batchStatus.completedFiles;
    const estimatedMinutes = remainingFiles / batchStatus.processingSpeed;
    const estimatedTime = new Date(Date.now() + estimatedMinutes * 60000);
    
    return estimatedTime;
  };

  const filteredDocs = getFilteredDocs();
  const estimatedCompletion = getEstimatedCompletion();

  return (
    <div className={`bg-white rounded-xl shadow-lg border ${className}`}>
      {/* 头部 */}
      <div className="flex items-center justify-between p-6 border-b">
        <div className="flex items-center space-x-3">
          <Activity className="w-6 h-6 text-blue-500" />
          <div>
            <h2 className="text-xl font-semibold text-gray-900">批量处理监控</h2>
            <p className="text-sm text-gray-500">
              {isConnected ? '实时监控中' : '离线模式'} • {batchStatus.totalFiles} 个文档
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowMiniView(!showMiniView)}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded"
            title="切换视图"
          >
            <BarChart3 className="w-5 h-5" />
          </button>
          
          <button
            onClick={handlePauseResume}
            className={`p-2 rounded ${
              isPaused 
                ? 'text-green-600 hover:bg-green-50' 
                : 'text-orange-600 hover:bg-orange-50'
            }`}
            title={isPaused ? '恢复处理' : '暂停处理'}
          >
            {isPaused ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
          </button>
          
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* 总体进度 */}
      <div className="p-6 border-b">
        <div className="mb-4">
          <MiniProgressIndicator
            progress={batchStatus.totalProgress}
            status={batchStatus.processingFiles > 0 ? 'processing' : 'completed'}
            className="mb-2"
          />
          <div className="flex justify-between text-sm text-gray-600">
            <span>总体进度: {batchStatus.totalProgress}%</span>
            {estimatedCompletion && (
              <span>预计完成: {estimatedCompletion.toLocaleTimeString()}</span>
            )}
          </div>
        </div>

        {/* 统计卡片 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 rounded-lg p-3">
            <div className="flex items-center space-x-2 mb-1">
              <Activity className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-medium text-blue-700">处理中</span>
            </div>
            <div className="text-2xl font-bold text-blue-700">{batchStatus.processingFiles}</div>
          </div>
          
          <div className="bg-green-50 rounded-lg p-3">
            <div className="flex items-center space-x-2 mb-1">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span className="text-sm font-medium text-green-700">已完成</span>
            </div>
            <div className="text-2xl font-bold text-green-700">{batchStatus.completedFiles}</div>
          </div>
          
          <div className="bg-red-50 rounded-lg p-3">
            <div className="flex items-center space-x-2 mb-1">
              <AlertTriangle className="w-4 h-4 text-red-500" />
              <span className="text-sm font-medium text-red-700">错误</span>
            </div>
            <div className="text-2xl font-bold text-red-700">{batchStatus.errorFiles}</div>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center space-x-2 mb-1">
              <TrendingUp className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">速度</span>
            </div>
            <div className="text-lg font-bold text-gray-700">
              {batchStatus.processingSpeed.toFixed(1)}/min
            </div>
          </div>
        </div>
      </div>

      {/* 标签页 */}
      <div className="flex items-center space-x-1 p-4 border-b bg-gray-50">
        {[
          { key: 'all', label: '全部', count: batchStatus.totalFiles },
          { key: 'processing', label: '处理中', count: batchStatus.processingFiles },
          { key: 'completed', label: '已完成', count: batchStatus.completedFiles },
          { key: 'error', label: '错误', count: batchStatus.errorFiles }
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === tab.key
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {/* 文档列表 */}
      <div className="p-4 max-h-96 overflow-y-auto">
        {filteredDocs.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Database className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>暂无{activeTab === 'all' ? '' : activeTab === 'processing' ? '处理中的' : activeTab === 'completed' ? '已完成的' : '错误的'}文档</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredDocs.map(doc => (
              <DocumentProcessingCard
                key={doc.documentId}
                processingInfo={doc}
                onCancel={handleCancelTask}
                onRetry={handleRetryDocument}
                showMiniView={showMiniView}
                className="border border-gray-200"
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BatchProcessingMonitor;