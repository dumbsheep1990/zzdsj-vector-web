import React, { useState } from 'react';
import { X, Download, Trash2, Edit, CheckCircle, AlertCircle, Clock, FileText, Image, Video, Music, Database, Play, Pause } from 'lucide-react';
import { FileItem as FileItemType } from '../../../utils/types';

interface FileDetailDrawerProps {
  file: FileItemType;
  onClose: () => void;
  onDelete?: (fileId: string) => void;
  onToggleStatus?: (fileId: string, status: string) => void;
}

const FileDetailDrawer: React.FC<FileDetailDrawerProps> = ({
  file,
  onClose,
  onDelete,
  onToggleStatus,
}) => {
  const [processingStatus, setProcessingStatus] = useState<string>(file.status || '');
  
  // Get file icon based on type
  const getFileIcon = () => {
    if (file.isFolder) return <Database className="h-16 w-16 text-blue-500" />;
    
    switch (file.category) {
      case 'document':
        return <FileText className="h-16 w-16 text-blue-600" />;
      case 'image':
        return <Image className="h-16 w-16 text-green-500" />;
      case 'video':
        return <Video className="h-16 w-16 text-red-500" />;
      case 'audio':
        return <Music className="h-16 w-16 text-purple-500" />;
      default:
        return <FileText className="h-16 w-16 text-gray-500" />;
    }
  };
  
  // Handle processing toggle (start/pause vectorization)
  const handleProcessingToggle = () => {
    let newStatus = '';
    
    if (!processingStatus || processingStatus === '失败') {
      newStatus = '处理中';
      setProcessingStatus('处理中');
      
      // Simulate processing completion after 3 seconds
      setTimeout(() => {
        setProcessingStatus('已向量化');
        if (onToggleStatus) onToggleStatus(file.id || '', '已向量化');
      }, 3000);
    } else if (processingStatus === '处理中') {
      newStatus = '暂停';
      setProcessingStatus('暂停');
    } else if (processingStatus === '暂停') {
      newStatus = '处理中';
      setProcessingStatus('处理中');
      
      // Simulate processing completion after 3 seconds
      setTimeout(() => {
        setProcessingStatus('已向量化');
        if (onToggleStatus) onToggleStatus(file.id || '', '已向量化');
      }, 3000);
    }
    
    if (onToggleStatus) onToggleStatus(file.id || '', newStatus);
  };
  
  // Get processing button text and icon
  const getProcessingButton = () => {
    if (processingStatus === '处理中') {
      return (
        <button 
          className="flex items-center px-3 py-2 bg-amber-50 border border-amber-200 rounded-md hover:bg-amber-100 text-amber-700 text-sm font-medium"
          onClick={handleProcessingToggle}
        >
          <Pause className="w-4 h-4 mr-2" />
          暂停向量化
        </button>
      );
    }
    
    if (processingStatus === '已向量化') {
      return (
        <button 
          className="flex items-center px-3 py-2 bg-green-50 border border-green-200 rounded-md text-green-700 text-sm font-medium cursor-default"
          disabled
        >
          <CheckCircle className="w-4 h-4 mr-2" />
          已完成向量化
        </button>
      );
    }
    
    return (
      <button 
        className="flex items-center px-3 py-2 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 text-blue-700 text-sm font-medium"
        onClick={handleProcessingToggle}
      >
        <Play className="w-4 h-4 mr-2" />
        开始向量化
      </button>
    );
  };
  
  // Get status component
  const getStatusComponent = () => {
    switch (processingStatus) {
      case '已向量化':
        return (
          <div className="flex items-center space-x-2 text-green-700 bg-green-50 px-3 py-1.5 rounded-full text-sm">
            <CheckCircle className="w-4 h-4" />
            <span>已向量化</span>
          </div>
        );
      case '处理中':
        return (
          <div className="flex items-center space-x-2 text-blue-700 bg-blue-50 px-3 py-1.5 rounded-full text-sm">
            <Clock className="w-4 h-4 animate-spin" />
            <span>处理中</span>
          </div>
        );
      case '失败':
        return (
          <div className="flex items-center space-x-2 text-red-700 bg-red-50 px-3 py-1.5 rounded-full text-sm">
            <AlertCircle className="w-4 h-4" />
            <span>处理失败</span>
          </div>
        );
      default:
        return (
          <div className="flex items-center space-x-2 text-gray-700 bg-gray-50 px-3 py-1.5 rounded-full text-sm">
            <Clock className="w-4 h-4" />
            <span>未处理</span>
          </div>
        );
    }
  };

  // Animation state
  const [animationClass, setAnimationClass] = useState<string>('slide-in-right');
  
  // Handle close with animation
  const handleClose = () => {
    setAnimationClass('slide-out-right');
    setTimeout(() => {
      if (onClose) onClose();
    }, 300); // Match animation duration
  };

  return (
    <div className="fixed inset-0 flex items-center justify-end z-50 bg-black bg-opacity-50">
      <div className={`w-full max-w-md h-full bg-white shadow-lg flex flex-col overflow-hidden ${animationClass}`}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">文件详情</h3>
          <button 
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        {/* Content */}
        <div className="flex-grow overflow-y-auto p-6">
          {/* File preview */}
          <div className="flex justify-center mb-6">
            <div className="w-32 h-32 bg-gray-50 rounded-lg flex items-center justify-center">
              {getFileIcon()}
            </div>
          </div>
          
          {/* File details */}
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 text-center mb-1">{file.name}</h2>
              <div className="flex justify-center">
                {getStatusComponent()}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500 mb-1">类型</p>
                <p className="font-medium">{file.type}</p>
              </div>
              <div>
                <p className="text-gray-500 mb-1">大小</p>
                <p className="font-medium">{file.size}</p>
              </div>
              <div>
                <p className="text-gray-500 mb-1">创建日期</p>
                <p className="font-medium">{file.date}</p>
              </div>
              <div>
                <p className="text-gray-500 mb-1">路径</p>
                <p className="font-medium truncate">{file.path}</p>
              </div>
            </div>
            
            {/* Processing section */}
            {!file.isFolder && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium mb-3">向量化状态</h4>
                <div className="flex items-center justify-between">
                  {getProcessingButton()}
                  
                  {processingStatus === '处理中' && (
                    <div className="flex items-center text-sm text-blue-700">
                      <div className="w-16 bg-blue-100 rounded-full h-2.5 mr-2">
                        <div className="bg-blue-600 h-2.5 rounded-full w-1/3 animate-progress"></div>
                      </div>
                      <span>33%</span>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {/* Statistics (if vectorized) */}
            {processingStatus === '已向量化' && !file.isFolder && (
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-medium mb-3 text-green-800">向量化信息</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500 mb-1">向量数量</p>
                    <p className="font-medium">1,248 个</p>
                  </div>
                  <div>
                    <p className="text-gray-500 mb-1">向量维度</p>
                    <p className="font-medium">1,536</p>
                  </div>
                  <div>
                    <p className="text-gray-500 mb-1">完成时间</p>
                    <p className="font-medium">2023-10-16 14:30</p>
                  </div>
                  <div>
                    <p className="text-gray-500 mb-1">模型</p>
                    <p className="font-medium">text-embedding-ada-002</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Footer with actions */}
        <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
          <div className="flex space-x-2">
            <button className="flex-1 flex justify-center items-center px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 text-gray-700 text-sm font-medium">
              <Download className="w-4 h-4 mr-2" />
              下载
            </button>
            <button className="flex-1 flex justify-center items-center px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 text-gray-700 text-sm font-medium">
              <Edit className="w-4 h-4 mr-2" />
              编辑
            </button>
            <button 
              className="flex-1 flex justify-center items-center px-4 py-2 bg-red-50 border border-red-200 rounded-md hover:bg-red-100 text-red-700 text-sm font-medium"
              onClick={() => onDelete && onDelete(file.id || '')}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              删除
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileDetailDrawer;
