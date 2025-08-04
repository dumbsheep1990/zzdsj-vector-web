import React from 'react';
import { 
  FileText, 
  Layers3, 
  Database, 
  Zap, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Activity,
  TrendingUp,
  Settings
} from 'lucide-react';
import ProgressIndicator, { ProgressStatus, ProgressStage } from '../../common/ProgressIndicator';

// 文档处理信息接口
interface DocumentProcessingInfo {
  documentId: string;
  documentName: string;
  taskId?: string;
  
  // 进度信息
  progress: number;
  stage: ProgressStage;
  status: ProgressStatus;
  message: string;
  
  // 块信息
  totalChunks: number;
  processedChunks: number;
  chunkStrategy: string;
  chunkSize: number;
  chunkOverlap: number;
  
  // 向量化信息
  embeddingModel?: string;
  vectorDimensions?: number;
  vectorCount?: number;
  
  // 时间信息
  startTime: Date;
  endTime?: Date;
  estimatedTimeRemaining?: number;
  
  // 性能信息
  processingSpeed?: number; // chunks/second
  averageChunkSize?: number;
  
  // 质量信息
  duplicateChunks?: number;
  emptyChunks?: number;
  errorChunks?: number;
}

interface DocumentProcessingCardProps {
  processingInfo: DocumentProcessingInfo;
  onCancel?: (taskId: string) => void;
  onRetry?: (documentId: string) => void;
  onViewDetails?: (documentId: string) => void;
  showMiniView?: boolean;
  className?: string;
}

/**
 * 文档处理卡片组件
 * 显示单个文档的详细处理进度和状态信息
 */
const DocumentProcessingCard: React.FC<DocumentProcessingCardProps> = ({
  processingInfo,
  onCancel,
  onRetry,
  onViewDetails,
  showMiniView = false,
  className = ''
}) => {
  const {
    documentId,
    documentName,
    taskId,
    progress,
    stage,
    status,
    message,
    totalChunks,
    processedChunks,
    chunkStrategy,
    chunkSize,
    chunkOverlap,
    embeddingModel,
    vectorDimensions,
    vectorCount,
    startTime,
    endTime,
    estimatedTimeRemaining,
    processingSpeed,
    averageChunkSize,
    duplicateChunks = 0,
    emptyChunks = 0,
    errorChunks = 0
  } = processingInfo;

  // 计算处理时长
  const getProcessingDuration = () => {
    const endTimeToUse = endTime || new Date();
    const duration = endTimeToUse.getTime() - startTime.getTime();
    const seconds = Math.floor(duration / 1000);
    
    if (seconds < 60) return `${seconds}秒`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}分${seconds % 60}秒`;
    const hours = Math.floor(minutes / 60);
    return `${hours}时${minutes % 60}分`;
  };

  // 格式化剩余时间
  const getEstimatedTimeDisplay = () => {
    if (!estimatedTimeRemaining || status !== 'processing') return null;
    
    const minutes = Math.floor(estimatedTimeRemaining / 60);
    const seconds = estimatedTimeRemaining % 60;
    
    if (minutes > 0) {
      return `预计还需 ${minutes}分${seconds}秒`;
    }
    return `预计还需 ${seconds}秒`;
  };

  // 获取处理速度显示
  const getProcessingSpeedDisplay = () => {
    if (!processingSpeed || status !== 'processing') return null;
    
    if (processingSpeed < 1) {
      const secondsPerChunk = Math.round(1 / processingSpeed);
      return `${secondsPerChunk}秒/块`;
    }
    
    return `${processingSpeed.toFixed(1)}块/秒`;
  };

  // 获取状态图标
  const getStatusIcon = () => {
    switch (status) {
      case 'processing':
        return <Activity className="w-5 h-5 text-blue-500 animate-pulse" />;
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  // 迷你视图
  if (showMiniView) {
    return (
      <div className={`bg-white rounded-lg shadow-sm border p-3 ${className}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {getStatusIcon()}
            <div>
              <div className="font-medium text-sm truncate max-w-32">
                {documentName}
              </div>
              <div className="text-xs text-gray-500">
                {processedChunks}/{totalChunks} 块
              </div>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-sm font-medium">{progress}%</div>
            {status === 'processing' && processingSpeed && (
              <div className="text-xs text-gray-500">
                {getProcessingSpeedDisplay()}
              </div>
            )}
          </div>
        </div>
        
        <div className="mt-2">
          <div className="w-full bg-gray-200 rounded-full h-1">
            <div 
              className={`h-1 rounded-full transition-all duration-300 ${
                status === 'completed' ? 'bg-green-500' :
                status === 'error' ? 'bg-red-500' :
                'bg-blue-500'
              }`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    );
  }

  // 完整视图
  return (
    <div className={`bg-white rounded-xl shadow-lg border p-6 ${className}`}>
      {/* 头部 */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          {getStatusIcon()}
          <div>
            <h3 className="font-semibold text-gray-900 text-lg">{documentName}</h3>
            <p className="text-sm text-gray-500">
              文档ID: {documentId.slice(-8)}
              {taskId && ` • 任务: ${taskId.slice(-8)}`}
            </p>
          </div>
        </div>
        
        {/* 操作按钮 */}
        <div className="flex items-center space-x-2">
          {status === 'processing' && onCancel && taskId && (
            <button
              onClick={() => onCancel(taskId)}
              className="px-3 py-1 text-sm bg-red-100 text-red-600 hover:bg-red-200 rounded-md transition-colors"
            >
              取消
            </button>
          )}
          
          {status === 'error' && onRetry && (
            <button
              onClick={() => onRetry(documentId)}
              className="px-3 py-1 text-sm bg-blue-100 text-blue-600 hover:bg-blue-200 rounded-md transition-colors"
            >
              重试
            </button>
          )}
          
          {onViewDetails && (
            <button
              onClick={() => onViewDetails(documentId)}
              className="px-3 py-1 text-sm bg-gray-100 text-gray-600 hover:bg-gray-200 rounded-md transition-colors"
            >
              详情
            </button>
          )}
        </div>
      </div>

      {/* 进度指示器 */}
      <div className="mb-6">
        <ProgressIndicator
          progress={progress}
          status={status}
          stage={stage}
          message={message}
          size="lg"
        />
      </div>

      {/* 统计信息网格 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {/* 块处理进度 */}
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="flex items-center space-x-2 mb-2">
            <Layers3 className="w-4 h-4 text-purple-500" />
            <span className="text-sm font-medium text-gray-700">块处理</span>
          </div>
          <div className="text-lg font-semibold text-gray-900">
            {processedChunks}/{totalChunks}
          </div>
          <div className="text-xs text-gray-500">
            {Math.round((processedChunks / (totalChunks || 1)) * 100)}% 完成
          </div>
        </div>

        {/* 向量化进度 */}
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="flex items-center space-x-2 mb-2">
            <Database className="w-4 h-4 text-green-500" />
            <span className="text-sm font-medium text-gray-700">向量化</span>
          </div>
          <div className="text-lg font-semibold text-gray-900">
            {vectorCount || 0}
          </div>
          <div className="text-xs text-gray-500">
            {vectorDimensions ? `${vectorDimensions}维` : '待处理'}
          </div>
        </div>

        {/* 处理时间 */}
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="flex items-center space-x-2 mb-2">
            <Clock className="w-4 h-4 text-blue-500" />
            <span className="text-sm font-medium text-gray-700">用时</span>
          </div>
          <div className="text-lg font-semibold text-gray-900">
            {getProcessingDuration()}
          </div>
          <div className="text-xs text-gray-500">
            {getEstimatedTimeDisplay() || '已完成'}
          </div>
        </div>

        {/* 处理速度 */}
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="flex items-center space-x-2 mb-2">
            <TrendingUp className="w-4 h-4 text-orange-500" />
            <span className="text-sm font-medium text-gray-700">速度</span>
          </div>
          <div className="text-lg font-semibold text-gray-900">
            {getProcessingSpeedDisplay() || '-'}
          </div>
          <div className="text-xs text-gray-500">
            平均处理速度
          </div>
        </div>
      </div>

      {/* 配置信息 */}
      <div className="bg-gray-50 rounded-lg p-4 mb-4">
        <div className="flex items-center space-x-2 mb-3">
          <Settings className="w-4 h-4 text-gray-600" />
          <span className="font-medium text-gray-700">处理配置</span>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-gray-500">分块策略:</span>
            <span className="ml-1 font-medium">
              {chunkStrategy === 'token_based' ? 'Token分块' : 
               chunkStrategy === 'semantic' ? '语义分块' : 
               chunkStrategy === 'smart' ? '智能分块' : chunkStrategy}
            </span>
          </div>
          
          <div>
            <span className="text-gray-500">块大小:</span>
            <span className="ml-1 font-medium">{chunkSize} tokens</span>
          </div>
          
          <div>
            <span className="text-gray-500">重叠大小:</span>
            <span className="ml-1 font-medium">{chunkOverlap} tokens</span>
          </div>
          
          {embeddingModel && (
            <div>
              <span className="text-gray-500">嵌入模型:</span>
              <span className="ml-1 font-medium">{embeddingModel}</span>
            </div>
          )}
          
          {averageChunkSize && (
            <div>
              <span className="text-gray-500">平均块大小:</span>
              <span className="ml-1 font-medium">{Math.round(averageChunkSize)} tokens</span>
            </div>
          )}
        </div>
      </div>

      {/* 质量统计 */}
      {(duplicateChunks > 0 || emptyChunks > 0 || errorChunks > 0) && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <AlertCircle className="w-4 h-4 text-yellow-600" />
            <span className="font-medium text-yellow-700">质量统计</span>
          </div>
          
          <div className="grid grid-cols-3 gap-4 text-sm">
            {duplicateChunks > 0 && (
              <div className="text-center">
                <div className="text-lg font-semibold text-yellow-700">{duplicateChunks}</div>
                <div className="text-yellow-600">重复块</div>
              </div>
            )}
            
            {emptyChunks > 0 && (
              <div className="text-center">
                <div className="text-lg font-semibold text-yellow-700">{emptyChunks}</div>
                <div className="text-yellow-600">空块</div>
              </div>
            )}
            
            {errorChunks > 0 && (
              <div className="text-center">
                <div className="text-lg font-semibold text-red-700">{errorChunks}</div>
                <div className="text-red-600">错误块</div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentProcessingCard;