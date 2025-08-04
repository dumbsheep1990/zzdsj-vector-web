import React, { useState, useRef, useCallback, useEffect } from 'react';
import { 
  X, 
  Upload, 
  FileText, 
  AlertCircle, 
  CheckCircle, 
  Loader2,
  Settings,
  Monitor,
  Eye,
  Target,
  Layers3,
  PlayCircle,
  FileCheck
} from 'lucide-react';
import SSEProgressMonitor from '../../common/SSEProgressMonitor';
import ProgressIndicator, { ProgressStatus, ProgressStage } from '../../common/ProgressIndicator';
import { useSSEConnection, SSEMessage } from '../../../hooks/common/useSSEConnection';
import SplitterStrategySelector from './SplitterStrategySelector';
import StrategyPreviewCard from './StrategyPreviewCard';
import DocumentProcessingCard from './DocumentProcessingCard';

// 文件上传状态
interface FileUploadState {
  file: File;
  id: string;
  status: 'pending' | 'uploading' | 'processing' | 'completed' | 'error';
  progress: number;
  stage: ProgressStage;
  message: string;
  taskId?: string;
  error?: string;
  // 新增处理详情
  totalChunks?: number;
  processedChunks?: number;
  chunkStrategy?: string;
  vectorCount?: number;
  startTime?: Date;
  endTime?: Date;
}

// 切分策略配置
interface StrategyConfig {
  id: string;
  name: string;
  type: 'token_based' | 'semantic' | 'smart';
  chunkSize: number;
  chunkOverlap: number;
  preserveStructure: boolean;
  description?: string;
  estimatedSpeed?: 'fast' | 'medium' | 'slow';
  accuracy?: 'high' | 'medium' | 'low';
  contextPreservation?: 'high' | 'medium' | 'low';
}

// 组件属性
interface EnhancedDocumentUploaderProps {
  knowledgeBaseId: string;
  userId: string;
  onUploadComplete?: (results: any[]) => void;
  onClose?: () => void;
  allowedTypes?: string[];
  maxSize?: number; // in MB
  multiple?: boolean;
  messageServiceUrl?: string;
  apiBaseUrl?: string;
  folderId?: string | null; // 目标文件夹ID
}

/**
 * 增强版文档上传器
 * 集成切分策略选择、SSE进度监控、详细处理信息
 */
const EnhancedDocumentUploader: React.FC<EnhancedDocumentUploaderProps> = ({
  knowledgeBaseId,
  userId,
  onUploadComplete,
  onClose,
  allowedTypes = ['*/*'],
  maxSize = 10,
  multiple = true,
  messageServiceUrl = 'http://localhost:8089',
  apiBaseUrl = 'http://localhost:8082',
  folderId = null
}) => {
  // 文件和上传状态
  const [files, setFiles] = useState<FileUploadState[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  // UI状态
  const [activeTab, setActiveTab] = useState<'upload' | 'strategy' | 'monitor'>('upload');
  const [showStrategyPreview, setShowStrategyPreview] = useState(true);
  const [showDetailedProgress, setShowDetailedProgress] = useState(false);
  
  // 策略配置
  const [splitterStrategyId, setSplitterStrategyId] = useState<string>('token_basic');
  const [uploadSettings, setUploadSettings] = useState({
    chunkSize: 1000,
    chunkOverlap: 200,
    chunkStrategy: 'token_based',
    preserveStructure: true
  });

  // 当前策略配置
  const [currentStrategy, setCurrentStrategy] = useState<StrategyConfig>({
    id: 'token_basic',
    name: '基础Token分块',
    type: 'token_based',
    chunkSize: 1000,
    chunkOverlap: 200,
    preserveStructure: true,
    description: '基于Token数量进行固定大小分块，速度快，适合通用文档',
    estimatedSpeed: 'fast',
    accuracy: 'medium',
    contextPreservation: 'medium'
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

  // 处理SSE消息 (上传modal不处理文档处理消息)
  function handleSSEMessage(message: SSEMessage) {
    // 上传modal只关心上传进度，不处理文档处理进度
    // 文档处理进度由文件管理器处理
    return;
  }

  // 更新当前策略配置
  useEffect(() => {
    setCurrentStrategy(prev => ({
      ...prev,
      id: splitterStrategyId,
      chunkSize: uploadSettings.chunkSize,
      chunkOverlap: uploadSettings.chunkOverlap,
      preserveStructure: uploadSettings.preserveStructure
    }));
  }, [splitterStrategyId, uploadSettings]);

  // 处理文件选择
  const handleFiles = useCallback((fileList: FileList) => {
    const newFiles: FileUploadState[] = [];
    
    Array.from(fileList).forEach(file => {
      // 验证文件类型
      if (allowedTypes.length && !allowedTypes.includes('*/*')) {
        const isAllowed = allowedTypes.some(type => {
          if (type.endsWith('/*')) {
            return file.type.startsWith(type.slice(0, -1));
          }
          return file.type === type;
        });
        
        if (!isAllowed) {
          console.warn(`文件类型不支持: ${file.type}`);
          return;
        }
      }

      // 验证文件大小
      if (file.size > maxSize * 1024 * 1024) {
        console.warn(`文件过大: ${file.size} bytes`);
        return;
      }

      newFiles.push({
        file,
        id: `file_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        status: 'pending',
        progress: 0,
        stage: '',
        message: '准备上传',
        startTime: new Date()
      });
    });

    setFiles(prev => [...prev, ...newFiles]);
  }, [allowedTypes, maxSize]);

  // 文件拖拽处理
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  }, [handleFiles]);

  // 开始上传
  const startUpload = async () => {
    const pendingFiles = files.filter(f => f.status === 'pending');
    if (pendingFiles.length === 0) return;

    setUploading(true);

    for (const fileState of pendingFiles) {
      try {
        setFiles(prev => 
          prev.map(f => 
            f.id === fileState.id 
              ? { ...f, status: 'uploading', message: '正在上传...' }
              : f
          )
        );

        // 创建FormData
        const formData = new FormData();
        formData.append('files', fileState.file);
        formData.append('user_id', userId);
        formData.append('enable_async_processing', 'true');
        
        // 添加文件夹ID（如果指定）
        if (folderId) {
          formData.append('folder_id', folderId);
        }
        
        // 添加策略ID（包括自定义策略）
        if (splitterStrategyId) {
          formData.append('splitter_strategy_id', splitterStrategyId);
        }
        
        // 添加自定义配置
        formData.append('chunk_size', uploadSettings.chunkSize.toString());
        formData.append('chunk_overlap', uploadSettings.chunkOverlap.toString());
        formData.append('chunk_strategy', uploadSettings.chunkStrategy);
        formData.append('preserve_structure', uploadSettings.preserveStructure.toString());

        // 发送上传请求
        const response = await fetch(
          `${apiBaseUrl}/api/v1/knowledge-bases/${knowledgeBaseId}/documents/upload-async`,
          {
            method: 'POST',
            body: formData
          }
        );

        if (response.ok) {
          const result = await response.json();
          
          // 如果返回成功或者有任务ID，都认为上传成功
          if (result.success || (result.tasks && result.tasks.length > 0) || result.message?.includes('成功')) {
            const taskId = result.tasks?.[0]?.task_id || `upload_${Date.now()}`;
            
            // 上传成功，立即更新状态并通知文件管理器
            setFiles(prev => 
              prev.map(f => 
                f.id === fileState.id 
                  ? { 
                      ...f, 
                      status: 'completed', // 上传完成
                      taskId,
                      message: '上传成功',
                      progress: 100
                    }
                  : f
              )
            );
            
            // 立即调用回调，将文件添加到文件管理列表
            if (onUploadComplete) {
              onUploadComplete([{
                id: fileState.id,
                filename: fileState.file.name,
                taskId: taskId,
                status: 'processing', // 文件管理列表中显示为处理中
                message: '文档处理中...',
                size: fileState.file.size,
                uploadTime: new Date().toISOString()
              }]);
            }
          } else {
            // 只有在明确失败时才抛出错误
            throw new Error('上传失败：' + (result.message || '未知错误'));
          }
        } else {
          const errorData = await response.json();
          throw new Error(`上传失败：HTTP ${response.status} - ${errorData.message || '服务器错误'}`);
        }

      } catch (error) {
        console.error('上传失败:', error);
        setFiles(prev => 
          prev.map(f => 
            f.id === fileState.id 
              ? { 
                  ...f, 
                  status: 'error', 
                  message: `上传失败: ${error}`,
                  error: String(error)
                }
              : f
          )
        );
      }
    }

    setUploading(false);
    
    // 上传循环结束后，立即关闭modal
    const completedFiles = files.filter(f => f.status === 'completed').length;
    const totalFiles = files.length;
    
    if (completedFiles > 0) {
      // 延迟一点时间让用户看到上传成功状态，然后关闭modal
      setTimeout(() => {
        if (onClose) {
          onClose();
        }
      }, 1000);
    }
  };

  // 移除文件
  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  // 清除所有文件
  const clearFiles = () => {
    setFiles([]);
  };

  // 计算统计信息
  const totalFiles = files.length;
  const completedFiles = files.filter(f => f.status === 'completed').length;
  const processingFiles = files.filter(f => f.status === 'processing' || f.status === 'uploading').length;
  const errorFiles = files.filter(f => f.status === 'error').length;
  const totalProgress = files.length > 0 
    ? Math.round(files.reduce((sum, file) => sum + file.progress, 0) / files.length)
    : 0;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-7xl max-h-[95vh] overflow-hidden flex flex-col">
        {/* 头部 */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-3">
            <Upload className="w-6 h-6 text-blue-600" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900">智能文档上传</h2>
              <p className="text-sm text-gray-500">
                上传文档并配置智能切分策略
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
            { key: 'upload', label: '文件上传', icon: Upload },
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
        <div className="flex-1 overflow-hidden flex">
          {/* 左侧主内容 */}
          <div className="flex-1 overflow-auto">
            {activeTab === 'upload' && (
              <div className="p-6">
                {/* 策略预览 */}
                {showStrategyPreview && (
                  <div className="mb-6">
                    <StrategyPreviewCard
                      strategy={currentStrategy}
                      showDetails={false}
                      onEdit={() => setActiveTab('strategy')}
                      className="mb-4"
                    />
                  </div>
                )}

                {/* 拖拽上传区域 */}
                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-all mb-6 ${
                    dragActive 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    拖拽文件到此处或点击选择
                  </h3>
                  <p className="text-gray-500 mb-4">
                    支持 PDF、Word、TXT、Markdown 等格式，最大 {maxSize}MB
                  </p>
                  
                  <div className="flex justify-center space-x-3">
                    <button
                      onClick={() => inputRef.current?.click()}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      选择文件
                    </button>
                    
                    {files.length > 0 && (
                      <button
                        onClick={startUpload}
                        disabled={!isConnected || uploading || processingFiles > 0}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
                      >
                        <PlayCircle className="w-4 h-4" />
                        <span>开始处理 ({files.filter(f => f.status === 'pending').length})</span>
                      </button>
                    )}
                  </div>
                  
                  <input
                    ref={inputRef}
                    type="file"
                    multiple={multiple}
                    accept={allowedTypes.join(',')}
                    onChange={(e) => e.target.files && handleFiles(e.target.files)}
                    className="hidden"
                  />
                </div>

                {/* 文件列表 - 只显示上传进度 */}
                {files.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-medium text-gray-900">
                        文件列表 ({totalFiles})
                      </h4>
                      
                      <button
                        onClick={clearFiles}
                        className="text-sm text-red-600 hover:text-red-700"
                      >
                        清空
                      </button>
                    </div>

                    {/* 总体上传进度 */}
                    {uploading && (
                      <div className="mb-4">
                        <ProgressIndicator
                          progress={totalProgress}
                          status={errorFiles > 0 ? 'error' : 'uploading'}
                          stage=""
                          message={`上传进度: ${completedFiles}/${totalFiles} 个文件已完成`}
                          size="sm"
                        />
                      </div>
                    )}

                    <div className="space-y-3 max-h-80 overflow-y-auto">
                      {files.map(fileState => (
                        <div key={fileState.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                          <div className="flex-shrink-0">
                            <FileText className="w-8 h-8 text-blue-500" />
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {fileState.file.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {Math.round(fileState.file.size / 1024)} KB
                            </p>
                            
                            {/* 只显示上传进度，不显示处理进度 */}
                            {fileState.status === 'uploading' && (
                              <div className="mt-2">
                                <ProgressIndicator
                                  progress={fileState.progress}
                                  status="uploading"
                                  stage=""
                                  message={fileState.message}
                                  size="sm"
                                  showDetails={false}
                                />
                              </div>
                            )}
                            
                            {fileState.status === 'error' && (
                              <div className="mt-1 flex items-center space-x-1 text-red-600">
                                <AlertCircle className="w-3 h-3" />
                                <span className="text-xs">{fileState.error}</span>
                              </div>
                            )}
                            
                            {fileState.status === 'completed' && (
                              <div className="mt-1 flex items-center space-x-1 text-green-600">
                                <CheckCircle className="w-3 h-3" />
                                <span className="text-xs">上传成功</span>
                              </div>
                            )}
                          </div>
                          
                          <button
                            onClick={() => removeFile(fileState.id)}
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

            {activeTab === 'strategy' && (
              <div className="p-6">
                <SplitterStrategySelector
                  selectedStrategyId={splitterStrategyId}
                  onStrategyChange={setSplitterStrategyId}
                  customSettings={uploadSettings}
                  onSettingsChange={setUploadSettings}
                  knowledgeBaseId={knowledgeBaseId}
                  apiBaseUrl={apiBaseUrl}
                  disabled={uploading || processingFiles > 0}
                />
                
                <div className="mt-6">
                  <StrategyPreviewCard
                    strategy={currentStrategy}
                    showDetails={true}
                  />
                </div>
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
    </div>
  );
};

export default EnhancedDocumentUploader;