import React, { useState, useRef, useEffect } from 'react';
import { X, Upload, FileText, FileUp, File, Image, Video, Music, Archive, Code, Presentation, AlertCircle, CheckCircle, Clock, FolderOpen, Link, Clipboard } from 'lucide-react';

interface FileUploaderProps {
  onUploadComplete?: (files: File[]) => void;
  onClose?: () => void;
  allowedTypes?: string[];
  maxSize?: number; // in MB
  multiple?: boolean;
  knowledgeBaseId?: string; // 知识库ID，如果提供则直接上传到指定知识库
}

const FileUploader: React.FC<FileUploaderProps> = ({
  onUploadComplete,
  onClose,
  allowedTypes = ['*/*'],
  maxSize = 10,
  multiple = true,
  knowledgeBaseId
}) => {
  const [files, setFiles] = useState<File[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{[key: string]: number}>({});
  const [uploadMethod, setUploadMethod] = useState<'clipboard' | 'browse' | 'url'>('clipboard');
  const [clipboardText, setClipboardText] = useState('');
  const [isPasting, setIsPasting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // 监听剪贴板粘贴事件
  useEffect(() => {
    const handlePaste = async (e: ClipboardEvent) => {
      console.log('Paste event triggered', uploadMethod); // 调试日志
      
      if (uploadMethod === 'clipboard') {
        e.preventDefault();
        setIsPasting(true);
        
        try {
          // 处理剪贴板中的文件
          if (e.clipboardData?.files.length) {
            console.log('Found files in clipboard:', e.clipboardData.files.length);
            const fileList = e.clipboardData.files;
            processFiles(fileList);
          }
          
          // 处理剪贴板中的文本
          const text = e.clipboardData?.getData('text/plain');
          if (text) {
            console.log('Found text in clipboard:', text.substring(0, 50) + '...');
            setClipboardText(text);
          }
          
          // 处理剪贴板中的图片
          const items = e.clipboardData?.items;
          if (items) {
            for (let i = 0; i < items.length; i++) {
              const item = items[i];
              console.log('Clipboard item type:', item.type);
              if (item.type.startsWith('image/')) {
                const file = item.getAsFile();
                if (file) {
                  console.log('Found image file:', file.name);
                  // 创建新的文件列表并处理
                  const newFiles = [file];
                  const newErrors: string[] = [];
                  
                  newFiles.forEach(file => {
                    const error = validateFile(file);
                    if (error) {
                      newErrors.push(error);
                    }
                  });

                  if (newErrors.length > 0) {
                    setErrors(prev => [...prev, ...newErrors]);
                  }

                  if (newFiles.length > 0) {
                    setFiles(prev => multiple ? [...prev, ...newFiles] : newFiles);
                  }
                }
              }
            }
          }
        } catch (error) {
          console.error('Error processing clipboard data:', error);
        } finally {
          setIsPasting(false);
        }
      }
    };

    // 监听整个文档的粘贴事件
    document.addEventListener('paste', handlePaste);
    
    return () => {
      document.removeEventListener('paste', handlePaste);
    };
  }, [uploadMethod, multiple]); // 添加multiple作为依赖项

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const validateFile = (file: File): string | null => {
    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      return `文件 ${file.name} 超过最大大小限制 (${maxSize}MB)`;
    }

    // Check file type if not accepting all files
    if (allowedTypes[0] !== '*/*') {
      const isValidType = allowedTypes.some(type => {
        if (type.includes('*')) {
          const baseType = type.split('/')[0];
          return file.type.startsWith(baseType);
        }
        return file.type === type;
      });
      
      if (!isValidType) {
        return `文件 ${file.name} 格式不支持`;
      }
    }

    return null;
  };

  const processFiles = (fileList: FileList) => {
    const newFiles: File[] = [];
    const newErrors: string[] = [];

    Array.from(fileList).forEach(file => {
      const error = validateFile(file);
      if (error) {
        newErrors.push(error);
      } else {
        newFiles.push(file);
      }
    });

    if (newErrors.length > 0) {
      setErrors(prev => [...prev, ...newErrors]);
    }

    if (newFiles.length > 0) {
      setFiles(prev => multiple ? [...prev, ...newFiles] : newFiles);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFiles(e.dataTransfer.files);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      processFiles(e.target.files);
    }
  };

  const handleButtonClick = () => {
    inputRef.current?.click();
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
    setErrors([]);
  };



  const handleUpload = async () => {
    if (files.length === 0) return;

    setUploading(true);
    setUploadProgress({});

    try {
      // Simulate upload progress for each file
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileName = file.name;
        
        // Simulate progress updates
        for (let progress = 0; progress <= 100; progress += 10) {
          setUploadProgress(prev => ({ ...prev, [fileName]: progress }));
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      }

      // Call the completion callback
      if (onUploadComplete) {
        onUploadComplete(files);
      }
      
      // Close the modal
      if (onClose) {
        onClose();
      }
    } catch (error) {
      console.error('Upload failed:', error);
      setErrors(['上传失败，请重试']);
    } finally {
      setUploading(false);
      setUploadProgress({});
    }
  };

  const getFileIcon = (type: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      'image': <Image className="h-5 w-5 text-green-500" />,
      'video': <Video className="h-5 w-5 text-purple-500" />,
      'audio': <Music className="h-5 w-5 text-pink-500" />,
      'application/pdf': <FileText className="h-5 w-5 text-red-500" />,
      'application/msword': <FileText className="h-5 w-5 text-blue-500" />,
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': <FileText className="h-5 w-5 text-blue-500" />,
      'application/vnd.ms-excel': <Presentation className="h-5 w-5 text-green-500" />,
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': <Presentation className="h-5 w-5 text-green-500" />,
      'application/zip': <Archive className="h-5 w-5 text-orange-500" />,
      'text/plain': <FileText className="h-5 w-5 text-gray-500" />,
      'text/javascript': <Code className="h-5 w-5 text-yellow-500" />,
      'text/css': <Code className="h-5 w-5 text-blue-500" />,
    };

    const baseType = type.split('/')[0];
    return iconMap[type] || iconMap[baseType] || <File className="h-5 w-5 text-gray-500" />;
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };

  const getFileStatus = (fileName: string) => {
    const progress = uploadProgress[fileName];
    if (progress === undefined) return 'pending';
    if (progress === 100) return 'completed';
    return 'uploading';
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[99999]">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden relative z-[100000]">
        {/* Clean Header */}
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-white">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
              <Upload className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">上传文件</h3>
              <p className="text-gray-500 text-sm">选择您要上传的文件</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800 rounded-lg p-1.5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Content Area */}
        <div className="p-6 max-h-[calc(90vh-140px)] overflow-y-auto">
          {/* Upload Method Tabs */}
          <div className="flex space-x-1 mb-6 bg-gray-50 rounded-xl p-1">
            <button
              onClick={() => setUploadMethod('clipboard')}
              className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
                uploadMethod === 'clipboard' 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <Clipboard className="w-4 h-4" />
                <span>剪贴板上传</span>
              </div>
            </button>
            <button
              onClick={() => setUploadMethod('browse')}
              className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
                uploadMethod === 'browse' 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <FolderOpen className="w-4 h-4" />
                <span>浏览文件</span>
              </div>
            </button>
            <button
              onClick={() => setUploadMethod('url')}
              className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
                uploadMethod === 'url' 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <Link className="w-4 h-4" />
                <span>URL导入</span>
              </div>
            </button>
          </div>

          {/* Upload Area */}
          {uploadMethod === 'clipboard' && (
            <div 
              className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 ${
                isPasting 
                  ? 'border-blue-500 bg-blue-50/50 shadow-inner scale-[0.98]' 
                  : 'border-gray-200 hover:border-blue-400 hover:bg-gray-50/50'
              }`}
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
            >
              <input
                ref={inputRef}
                type="file"
                multiple={multiple}
                onChange={handleChange}
                accept={allowedTypes.join(',')}
                className="hidden"
              />
              
              {!clipboardText ? (
                // 初始状态：显示粘贴提示
                <div className="flex flex-col items-center">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-all duration-300 ${
                    isPasting ? 'bg-blue-100 scale-110' : 'bg-gray-100'
                  }`}>
                    <Clipboard className={`h-8 w-8 transition-colors duration-300 ${
                      isPasting ? 'text-blue-600' : 'text-gray-400'
                    }`} />
                  </div>
                  
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">
                    {isPasting ? '正在处理剪贴板内容...' : '从剪贴板上传'}
                  </h4>
                  <p className="text-gray-500 mb-2">复制文件后按 Ctrl+V 粘贴，或拖拽文件到此处</p>
                  <p className="text-xs text-gray-400 mb-4">支持截图、复制文件等剪贴板内容</p>
                  
                  {/* 粘贴提示区域 */}
                  <div className="w-full max-w-sm p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-700 text-center">
                      💡 提示：请确保当前页面处于焦点状态，然后按 Ctrl+V 粘贴
                    </p>
                  </div>
                </div>
              ) : (
                // 粘贴后状态：显示文本内容
                <div className="w-full h-full flex flex-col">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <FileText className="w-5 h-5 text-blue-600" />
                      <h4 className="text-lg font-semibold text-gray-900">剪贴板文本内容</h4>
                    </div>
                    <button
                      onClick={() => setClipboardText('')}
                      className="text-sm text-gray-500 hover:text-red-500 transition-colors flex items-center space-x-1"
                    >
                      <X className="w-4 h-4" />
                      <span>清除</span>
                    </button>
                  </div>
                  
                  <div className="flex-1 bg-white rounded-lg border border-gray-200 p-4 overflow-hidden">
                    <div className="h-full overflow-y-auto">
                      <p className="text-sm text-gray-700 whitespace-pre-wrap break-words leading-relaxed">
                        {clipboardText}
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-3 text-xs text-gray-500 text-center">
                    文本已成功粘贴，可以继续粘贴新内容或清除重新开始
                  </div>
                </div>
              )}
            </div>
          )}

          {uploadMethod === 'browse' && (
            <div className="border-2 border-dashed border-gray-200 rounded-2xl p-8 text-center">
              <input
                ref={inputRef}
                type="file"
                multiple={multiple}
                onChange={handleChange}
                accept={allowedTypes.join(',')}
                className="hidden"
              />
              
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
                  <FolderOpen className="h-8 w-8 text-gray-400" />
                </div>
                
                <h4 className="text-lg font-semibold text-gray-900 mb-2">从设备选择文件</h4>
                <p className="text-gray-500 mb-4">点击下方按钮浏览并选择文件</p>
                
                <button
                  type="button"
                  onClick={handleButtonClick}
                  className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5"
                >
                  <FolderOpen className="h-4 w-4 mr-2" />
                  浏览文件
                </button>
              </div>
            </div>
          )}

          {uploadMethod === 'url' && (
            <div className="border-2 border-dashed border-gray-200 rounded-2xl p-8 text-center">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
                  <Link className="h-8 w-8 text-gray-400" />
                </div>
                
                <h4 className="text-lg font-semibold text-gray-900 mb-2">从URL导入文件</h4>
                <p className="text-gray-500 mb-4">输入文件URL进行下载和上传</p>
                
                <div className="w-full max-w-md">
                  <input
                    type="url"
                    placeholder="https://example.com/file.pdf"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button className="mt-3 w-full inline-flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-200">
                    <Link className="h-4 w-4 mr-2" />
                    从URL导入
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* File Info */}
          <div className="mt-6 p-4 bg-gray-50 rounded-xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-gray-600">支持格式: {allowedTypes[0] === '*/*' ? '所有文件' : allowedTypes.join(', ')}</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-gray-600">最大文件大小: {maxSize}MB</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span className="text-gray-600">{multiple ? '支持批量上传' : '单文件上传'}</span>
              </div>
            </div>
          </div>
          
          {/* Error messages */}
          {errors.length > 0 && (
            <div className="mt-4 bg-red-50 border border-red-200 rounded-xl p-4">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                <h4 className="text-sm font-medium text-red-800">上传错误</h4>
              </div>
              <ul className="mt-2 text-sm text-red-700 space-y-1">
                {errors.map((error, index) => (
                  <li key={index} className="flex items-start">
                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                    {error}
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {/* File list */}
          {files.length > 0 && (
            <div className="mt-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold text-gray-900 flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-blue-500" />
                  已选择的文件 ({files.length})
                </h4>
                <button
                  onClick={() => setFiles([])}
                  className="text-sm text-gray-500 hover:text-red-500 transition-colors"
                >
                  清空列表
                </button>
              </div>
              
              <div className="space-y-3 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                {files.map((file, index) => {
                  const status = getFileStatus(file.name);
                  const progress = uploadProgress[file.name] || 0;
                  
                  return (
                    <div key={index} className="p-4 bg-gray-50 hover:bg-gray-100 rounded-xl border border-gray-200 transition-all duration-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center flex-1 min-w-0">
                          <div className="flex-shrink-0 mr-3">
                            {getFileIcon(file.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                            <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          {/* Status indicator */}
                          {status === 'uploading' && (
                            <div className="flex items-center text-blue-600">
                              <Clock className="h-4 w-4 mr-1" />
                              <span className="text-xs">{progress}%</span>
                            </div>
                          )}
                          {status === 'completed' && (
                            <div className="flex items-center text-green-600">
                              <CheckCircle className="h-4 w-4 mr-1" />
                              <span className="text-xs">完成</span>
                            </div>
                          )}
                          
                          <button 
                            onClick={() => removeFile(index)}
                            className="text-gray-400 hover:text-red-500 transition-colors duration-200 p-1 hover:bg-red-50 rounded-lg"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      
                      {/* Progress bar */}
                      {status === 'uploading' && (
                        <div className="mt-3">
                          <div className="w-full bg-gray-200 rounded-full h-1.5">
                            <div 
                              className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
                              style={{ width: `${progress}%` }}
                            ></div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
        
        {/* Clean Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
          <button
            onClick={onClose}
            className="px-4 py-2.5 border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 rounded-xl font-medium transition-all duration-200"
          >
            取消
          </button>
          
          <div className="flex items-center space-x-3">
            {files.length > 0 && (
              <span className="text-sm text-gray-500">
                总计: {files.reduce((acc, file) => acc + file.size, 0) < 1024 * 1024 
                  ? `${(files.reduce((acc, file) => acc + file.size, 0) / 1024).toFixed(1)} KB`
                  : `${(files.reduce((acc, file) => acc + file.size, 0) / (1024 * 1024)).toFixed(1)} MB`
                }
              </span>
            )}
            
            <button
              onClick={handleUpload}
              disabled={files.length === 0 || uploading}
              className={`px-6 py-2.5 rounded-xl font-medium flex items-center transition-all duration-200 ${
                files.length === 0 || uploading 
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
              }`}
            >
              {uploading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  上传中...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  上传 ({files.length})
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileUploader;
