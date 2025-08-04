import React, { useState, useRef, useCallback, useEffect } from 'react';
import { 
  X, 
  Upload, 
  FileText, 
  AlertCircle, 
  CheckCircle, 
  Loader2,
  FolderOpen,
  Settings
} from 'lucide-react';
import SSEProgressMonitor from '../../common/SSEProgressMonitor';
import ProgressIndicator, { ProgressStatus, ProgressStage } from '../../common/ProgressIndicator';
import { useSSEConnection, SSEMessage } from '../../../hooks/common/useSSEConnection';
import SplitterStrategySelector from './SplitterStrategySelector';

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
}

// 组件属性
interface FileUploaderWithSSEProps {
  knowledgeBaseId: string;
  userId: string;
  onUploadComplete?: (results: any[]) => void;
  onClose?: () => void;
  allowedTypes?: string[];
  maxSize?: number; // in MB
  multiple?: boolean;
  messageServiceUrl?: string;
  apiBaseUrl?: string;
}

/**
 * 带SSE进度监控的文件上传组件
 * 集成实时进度反馈和状态显示
 */
const FileUploaderWithSSE: React.FC<FileUploaderWithSSEProps> = ({
  knowledgeBaseId,
  userId,
  onUploadComplete,
  onClose,
  allowedTypes = ['*/*'],
  maxSize = 10,
  multiple = true,
  messageServiceUrl = 'http://localhost:8089',
  apiBaseUrl = 'http://localhost:8082'
}) => {
  // 状态管理
  const [files, setFiles] = useState<FileUploadState[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [showSSEMonitor, setShowSSEMonitor] = useState(true);
  const [showStrategySelector, setShowStrategySelector] = useState(false);
  const [splitterStrategyId, setSplitterStrategyId] = useState<string>('token_basic');
  const [uploadSettings, setUploadSettings] = useState({
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

    setFiles(prevFiles => 
      prevFiles.map(file => {
        if (file.taskId !== taskId) return file;

        switch (message.type) {
          case 'progress':
            return {
              ...file,
              status: 'processing',
              progress: message.data.progress || 0,
              stage: (message.data.stage as ProgressStage) || '',
              message: message.data.message || ''
            };
          case 'success':
            return {
              ...file,
              status: 'completed',
              progress: 100,
              stage: 'finalize',
              message: message.data.message || '处理完成'
            };
          case 'error':
            return {
              ...file,
              status: 'error',
              progress: 0,
              stage: '',
              message: message.data.error_message || '处理失败',
              error: message.data.error_message
            };
          default:
            return file;
        }
      })
    );
  }

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
        message: '准备上传'
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
        
        if (splitterStrategyId) {
          formData.append('splitter_strategy_id', splitterStrategyId);
        }
        
        // 添加自定义配置
        if (uploadSettings.chunkSize !== 1000) {
          formData.append('chunk_size', uploadSettings.chunkSize.toString());
        }
        if (uploadSettings.chunkOverlap !== 200) {
          formData.append('chunk_overlap', uploadSettings.chunkOverlap.toString());
        }
        if (uploadSettings.chunkStrategy !== 'token_based') {
          formData.append('chunk_strategy', uploadSettings.chunkStrategy);
        }
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
          
          if (result.success && result.tasks && result.tasks.length > 0) {
            const taskId = result.tasks[0].task_id;
            
            setFiles(prev => 
              prev.map(f => 
                f.id === fileState.id 
                  ? { 
                      ...f, 
                      status: 'processing', 
                      taskId,
                      message: '上传成功，开始处理...',
                      progress: 5
                    }
                  : f
              )
            );
          } else {
            throw new Error(result.message || '上传失败');
          }
        } else {
          const errorData = await response.json();
          throw new Error(errorData.message || `HTTP ${response.status}`);
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
  };

  // 移除文件
  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  // 清除所有文件
  const clearFiles = () => {
    setFiles([]);
  };

  // 获取文件图标
  const getFileIcon = (type: string) => {
    if (type.startsWith('text/') || type.includes('document')) {
      return <FileText className="w-8 h-8 text-blue-500" />;
    }
    return <FileText className="w-8 h-8 text-gray-500" />;
  };

  // 格式化文件大小
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // 计算总体进度
  const totalProgress = files.length > 0 
    ? Math.round(files.reduce((sum, file) => sum + file.progress, 0) / files.length)
    : 0;

  const completedCount = files.filter(f => f.status === 'completed').length;
  const errorCount = files.filter(f => f.status === 'error').length;
  const processingCount = files.filter(f => f.status === 'processing' || f.status === 'uploading').length;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex">
        {/* 左侧 - 文件上传区域 */}
        <div className="flex-1 flex flex-col">
          {/* 头部 */}
          <div className="flex items-center justify-between p-6 border-b">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">文档上传</h2>
              <p className="text-sm text-gray-500 mt-1">
                上传文档到知识库，支持实时进度监控
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              {/* SSE连接状态指示 */}
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
                onClick={() => setShowStrategySelector(!showStrategySelector)}
                className={`p-2 rounded transition-colors ${
                  showStrategySelector 
                    ? 'text-blue-600 bg-blue-50' 
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
                title="切分策略设置"
              >
                <Settings className="w-5 h-5" />
              </button>
              
              <button
                onClick={() => setShowSSEMonitor(!showSSEMonitor)}
                className={`p-2 rounded transition-colors ${
                  showSSEMonitor 
                    ? 'text-blue-600 bg-blue-50' 
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
                title="切换监控面板"
              >
                <FolderOpen className="w-5 h-5" />
              </button>
              
              <button 
                onClick={onClose}
                className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* 切分策略选择器 */}
          {showStrategySelector && (
            <div className="border-b border-gray-200">
              <SplitterStrategySelector
                selectedStrategyId={splitterStrategyId}
                onStrategyChange={setSplitterStrategyId}
                customSettings={uploadSettings}
                onSettingsChange={setUploadSettings}
                knowledgeBaseId={knowledgeBaseId}
                apiBaseUrl={apiBaseUrl}
                className="border-none rounded-none"
              />
            </div>
          )}

          {/* 快速设置摘要 */}
          {!showStrategySelector && (
            <div className="p-3 bg-gray-50 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <span>策略: {
                    splitterStrategyId === 'token_basic' ? '基础Token分块' :
                    splitterStrategyId === 'semantic_smart' ? '语义分块' :
                    splitterStrategyId === 'smart_adaptive' ? '智能自适应' : '自定义'
                  }</span>
                  <span>块大小: {uploadSettings.chunkSize}</span>
                  <span>重叠: {uploadSettings.chunkOverlap}</span>
                  {uploadSettings.preserveStructure && <span>保留结构</span>}
                </div>
                <button
                  onClick={() => setShowStrategySelector(true)}
                  className="text-xs text-blue-600 hover:text-blue-700"
                >
                  调整设置
                </button>
              </div>
            </div>
          )}

          {/* 拖拽上传区域 */}
          <div className="flex-1 p-6">
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-all ${
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
                    disabled={!isConnected || processingCount > 0}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                  >
                    开始上传 ({files.filter(f => f.status === 'pending').length})
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

            {/* 文件列表 */}
            {files.length > 0 && (
              <div className="mt-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-medium text-gray-900">
                    文件列表 ({files.length})
                  </h4>
                  
                  <div className="flex items-center space-x-3">
                    <div className="text-sm text-gray-600">
                      ✅ {completedCount} • ⚠️ {errorCount} • 🔄 {processingCount}
                    </div>
                    <button
                      onClick={clearFiles}
                      className="text-sm text-red-600 hover:text-red-700"
                    >
                      清空
                    </button>
                  </div>
                </div>

                {/* 总体进度 */}
                {processingCount > 0 && (
                  <div className="mb-4">
                    <ProgressIndicator
                      progress={totalProgress}
                      status={errorCount > 0 ? 'error' : processingCount > 0 ? 'processing' : 'completed'}
                      stage=""
                      message={`总进度: ${completedCount}/${files.length} 个文件已完成`}
                      size="sm"
                    />
                  </div>
                )}

                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {files.map(fileState => (
                    <div key={fileState.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className="flex-shrink-0">
                        {getFileIcon(fileState.file.type)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {fileState.file.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatFileSize(fileState.file.size)}
                          {fileState.taskId && ` • 任务: ${fileState.taskId.slice(-8)}`}
                        </p>
                        
                        {(fileState.status === 'processing' || fileState.status === 'uploading') && (
                          <div className="mt-2">
                            <ProgressIndicator
                              progress={fileState.progress}
                              status={fileState.status as ProgressStatus}
                              stage={fileState.stage}
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
                            <span className="text-xs">处理完成</span>
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
        </div>

        {/* 右侧 - SSE监控面板 */}
        {showSSEMonitor && (
          <div className="w-96 border-l bg-gray-50">
            <SSEProgressMonitor
              userId={userId}
              messageServiceUrl={messageServiceUrl}
              className="h-full border-none shadow-none rounded-none"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUploaderWithSSE;