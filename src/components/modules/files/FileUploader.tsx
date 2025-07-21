import React, { useState, useRef } from 'react';
import { Upload, X, FileUp, File as FileIcon, Image as ImageIcon, FileText, Music, Video } from 'lucide-react';

interface FileUploaderProps {
  onUploadComplete?: (files: File[]) => void;
  onClose?: () => void;
  allowedTypes?: string[];
  maxSize?: number; // in MB
  multiple?: boolean;
}

const FileUploader: React.FC<FileUploaderProps> = ({
  onUploadComplete,
  onClose,
  allowedTypes = ['*/*'],
  maxSize = 10,
  multiple = true
}) => {
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [files, setFiles] = useState<File[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [uploading, setUploading] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Handle drag events
  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  // Validates the file
  const validateFile = (file: File): string | null => {
    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      return `"${file.name}" 超过了最大文件大小 (${maxSize}MB)`;
    }

    // Check file type if specific types are specified
    if (allowedTypes[0] !== '*/*') {
      const fileType = file.type;
      const fileExtension = file.name.split('.').pop()?.toLowerCase();
      
      const isTypeAllowed = allowedTypes.some(type => {
        // Check MIME type or extension
        if (type.includes('*')) {
          // Handle wildcards like image/*
          const [category] = type.split('/');
          return fileType.startsWith(`${category}/`);
        }
        
        // Check by specific extension
        if (type.startsWith('.')) {
          return `.${fileExtension}` === type;
        }
        
        // Exact MIME type match
        return fileType === type;
      });
      
      if (!isTypeAllowed) {
        return `"${file.name}" 不是支持的文件类型`;
      }
    }
    
    return null;
  };

  // Process files from drop or file input
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
    
    // Update state with new files and errors
    setFiles(prevFiles => [...prevFiles, ...newFiles]);
    setErrors(prevErrors => [...prevErrors, ...newErrors]);
  };

  // Handle drop event
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };

  // Handle file input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
    }
  };

  // Open file dialog on button click
  const handleButtonClick = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  // Remove a file from the list
  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  // Handle upload action
  const handleUpload = async () => {
    setUploading(true);
    
    try {
      // In a real implementation, this would be an API call
      // For now, we'll simulate a successful upload after a delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (onUploadComplete) {
        onUploadComplete(files);
      }
      
      // Reset state after successful upload
      setFiles([]);
      setErrors([]);
    } catch (error) {
      console.error('Upload failed:', error);
      setErrors(prev => [...prev, '上传失败，请稍后重试']);
    } finally {
      setUploading(false);
    }
  };

  // Get file icon based on type
  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) {
      return <ImageIcon className="h-10 w-10 text-blue-500" />;
    } else if (type.startsWith('application/pdf')) {
      return <FileText className="h-10 w-10 text-red-500" />;
    } else if (type.startsWith('application/msword') || type.startsWith('application/vnd.openxmlformats-officedocument.wordprocessingml.document')) {
      return <FileText className="h-10 w-10 text-blue-600" />;
    } else if (type.startsWith('video/')) {
      return <Video className="h-10 w-10 text-purple-500" />;
    } else if (type.startsWith('audio/')) {
      return <Music className="h-10 w-10 text-green-500" />;
    } else {
      return <FileIcon className="h-10 w-10 text-gray-500" />;
    }
  };

  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[9999]">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden relative z-[10000]">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 bg-blue-600 text-white">
          <h3 className="text-lg font-semibold flex items-center">
            <Upload className="mr-2 h-5 w-5" />
            上传文件
          </h3>
          <button 
            onClick={onClose}
            className="bg-white text-blue-600 hover:bg-gray-100 rounded-full p-1 focus:outline-none"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        {/* Upload area */}
        <div className="p-6 max-h-[calc(90vh-120px)] overflow-y-auto">
          {/* Drag and drop area */}
          <div 
            className={`border-2 border-dashed rounded-xl p-10 text-center transition-all duration-200 ${dragActive ? 'border-blue-500 bg-blue-50 shadow-inner scale-[0.99]' : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50/30'}`}
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
            
            <div className="p-6 flex flex-col items-center">
              <div className="w-20 h-20 bg-blue-100 text-blue-500 rounded-full flex items-center justify-center mb-4">
                <FileUp className="h-10 w-10" />
              </div>
              <p className="text-base font-medium text-gray-900">将文件拖放到此处</p>
              <p className="mt-1 text-sm text-gray-500">或</p>
              
              <button
                type="button"
                onClick={handleButtonClick}
                className="mt-4 inline-flex items-center px-6 py-3 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
              >
                <Upload className="h-4 w-4 mr-2" />
                选择文件
              </button>
              
              <p className="mt-4 text-xs text-gray-500">
                支持格式: {allowedTypes[0] === '*/*' ? '所有文件' : allowedTypes.join(', ')} (最大 {maxSize}MB)
              </p>
            </div>
          </div>
          
          {/* Error messages */}
          {errors.length > 0 && (
            <div className="mt-4 bg-red-50 border border-red-100 rounded-md p-3">
              <h4 className="text-sm font-medium text-red-800">上传错误</h4>
              <ul className="mt-1 text-xs text-red-700 list-disc list-inside">
                {errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          )}
          
          {/* File list */}
          {files.length > 0 && (
            <div className="mt-6">
              <h4 className="text-sm font-medium text-gray-900 flex items-center">
                <FileText className="h-4 w-4 mr-2 text-blue-500" />
                已选择的文件 ({files.length})
              </h4>
              <ul className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                {files.map((file, index) => (
                  <li key={index} className="p-3 flex justify-between items-center bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors duration-150">
                    <div className="flex items-center flex-1 min-w-0">
                      <div className="flex-shrink-0">
                        {getFileIcon(file.type)}
                      </div>
                      <div className="ml-3 flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                        <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => removeFile(index)}
                      className="ml-2 text-gray-400 hover:text-red-500 transition-colors duration-150 p-1 hover:bg-red-50 rounded-full"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        
        {/* Footer with actions */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-150"
          >
            取消
          </button>
          
          <button
            onClick={handleUpload}
            disabled={files.length === 0 || uploading}
            className={`px-6 py-2 shadow-sm text-sm font-medium rounded-md text-white flex items-center transition-all duration-200 ${
              files.length === 0 || uploading ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 transform hover:translate-y-[-1px]'
            }`}
          >
            {uploading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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
  );
};

export default FileUploader;
