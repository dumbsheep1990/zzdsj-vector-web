import { useState, useCallback, useRef } from 'react';
import { FileItem } from '../../utils/types';
import { useAPI } from '../common/useAPI';
import { v4 as uuidv4 } from 'uuid';
import { message } from 'antd';
import { FileCategory } from './useFilesData';

// 定义上传文件参数
export interface UploadFileParams {
  file: File;
  parentId: string | null;
  autoVectorize?: boolean;
}

// 定义批量上传参数
export interface BatchUploadParams {
  files: File[];
  parentId: string | null;
  autoVectorize?: boolean;
}

// 定义上传进度信息
export interface UploadProgress {
  fileId: string;
  fileName: string;
  progress: number;
  status: 'uploading' | 'success' | 'error' | 'canceled';
  error?: string;
}

// 模拟上传文件的API函数
const uploadFileAPI = async (params: UploadFileParams): Promise<FileItem> => {
  const { file, parentId } = params;
  
  // 创建一个新的Promise以模拟上传过程
  return new Promise((resolve, reject) => {
    // 模拟上传耗时，根据文件大小变化
    const uploadTime = Math.min(file.size / 10000, 3000);
    
    setTimeout(() => {
      // 判断文件类型
      const fileExt = file.name.split('.').pop()?.toLowerCase() || '';
      let category: FileCategory = 'other';
      
      if (['pdf', 'doc', 'docx', 'txt', 'md'].includes(fileExt)) {
        category = 'document';
      } else if (['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'].includes(fileExt)) {
        category = 'image';
      } else if (['mp4', 'mov', 'avi', 'webm'].includes(fileExt)) {
        category = 'video';
      } else if (['mp3', 'wav', 'ogg', 'flac'].includes(fileExt)) {
        category = 'audio';
      } else if (['xls', 'xlsx', 'csv'].includes(fileExt)) {
        category = 'spreadsheet';
      }
      
      // 模拟偶尔失败
      if (Math.random() > 0.95) {
        reject(new Error('上传失败，服务器错误'));
        return;
      }
      
      // 创建文件项
      const newFile: FileItem = {
        id: uuidv4(),
        name: file.name,
        type: fileExt.toUpperCase(),
        size: formatFileSize(file.size),
        date: new Date().toISOString().split('T')[0],
        category,
        status: '',
        isFolder: false,
        parentId,
        path: parentId ? `/某文件夹/${file.name}` : `/${file.name}`
      };
      
      resolve(newFile);
    }, uploadTime);
  });
};

// 辅助函数：格式化文件大小
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0B';
  
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + sizes[i];
};

// 获取文件类型图标
export const getFileTypeIcon = (fileName: string): string => {
  const fileExt = fileName.split('.').pop()?.toLowerCase() || '';
  
  if (['pdf'].includes(fileExt)) {
    return 'pdf';
  } else if (['doc', 'docx'].includes(fileExt)) {
    return 'word';
  } else if (['xls', 'xlsx'].includes(fileExt)) {
    return 'excel';
  } else if (['ppt', 'pptx'].includes(fileExt)) {
    return 'powerpoint';
  } else if (['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'].includes(fileExt)) {
    return 'image';
  } else if (['mp4', 'mov', 'avi', 'webm'].includes(fileExt)) {
    return 'video';
  } else if (['mp3', 'wav', 'ogg', 'flac'].includes(fileExt)) {
    return 'audio';
  } else if (['zip', 'rar', '7z', 'tar', 'gz'].includes(fileExt)) {
    return 'archive';
  } else if (['txt', 'md'].includes(fileExt)) {
    return 'text';
  } else if (['html', 'css', 'js', 'ts', 'jsx', 'tsx'].includes(fileExt)) {
    return 'code';
  }
  
  return 'unknown';
};

/**
 * 文件上传管理Hook
 * 
 * 负责文件的上传、进度跟踪和批量处理
 * 
 * @param addFile 添加文件到列表的回调函数
 * @returns {object} 包含文件上传方法和状态的对象
 */
export const useFileUpload = (
  addFile: (file: FileItem) => void,
  currentFolderId: string | null,
  updateFileStatus: (fileId: string, status: string) => void
) => {
  // 上传队列
  const [uploadQueue, setUploadQueue] = useState<UploadProgress[]>([]);
  
  // 上传中的文件数
  const [uploading, setUploading] = useState(false);
  
  // 上传API
  const {
    loading: isUploading,
    error: uploadError,
    execute: executeUpload
  } = useAPI<UploadFileParams, FileItem>(uploadFileAPI);
  
  // 当前上传批次的ID
  const batchIdRef = useRef(0);
  
  // 上传单个文件
  const uploadFile = useCallback(async (file: File, parentId: string | null = currentFolderId, autoVectorize: boolean = false) => {
    if (!file) {
      message.error('请选择要上传的文件');
      return null;
    }
    
    // 生成临时ID以跟踪上传进度
    const tempId = uuidv4();
    
    // 添加到上传队列
    setUploadQueue(prev => [
      ...prev,
      {
        fileId: tempId,
        fileName: file.name,
        progress: 0,
        status: 'uploading'
      }
    ]);
    
    setUploading(true);
    
    try {
      // 更新上传进度（模拟）
      const progressInterval = setInterval(() => {
        setUploadQueue(prev => {
          const fileIndex = prev.findIndex(item => item.fileId === tempId);
          if (fileIndex === -1) return prev;
          
          const file = prev[fileIndex];
          if (file.status !== 'uploading' || file.progress >= 100) {
            clearInterval(progressInterval);
            return prev;
          }
          
          const newProgress = Math.min(file.progress + Math.random() * 20, 99);
          const newQueue = [...prev];
          newQueue[fileIndex] = { ...file, progress: newProgress };
          return newQueue;
        });
      }, 300);
      
      // 执行上传
      const uploadedFile = await executeUpload({ file, parentId, autoVectorize });
      
      // 更新上传状态为成功
      setUploadQueue(prev => {
        const fileIndex = prev.findIndex(item => item.fileId === tempId);
        if (fileIndex === -1) return prev;
        
        const newQueue = [...prev];
        newQueue[fileIndex] = { 
          ...newQueue[fileIndex], 
          progress: 100, 
          status: 'success',
          fileId: uploadedFile.id || tempId
        };
        return newQueue;
      });
      
      // 添加文件到文件列表
      addFile(uploadedFile);
      
      // 如果设置了自动向量化，更新文件状态
      if (autoVectorize) {
        updateFileStatus(uploadedFile.id || '', '处理中');
        
        // 模拟向量化过程完成
        setTimeout(() => {
          updateFileStatus(uploadedFile.id || '', '已向量化');
        }, 2000);
      }
      
      clearInterval(progressInterval);
      
      // 检查队列中是否还有上传中的文件
      setTimeout(() => {
        setUploadQueue(prev => {
          const stillUploading = prev.some(item => item.status === 'uploading');
          setUploading(stillUploading);
          
          // 移除成功的项目（可选，也可以保留一段时间）
          if (!stillUploading) {
            return prev.filter(item => item.status !== 'success');
          }
          return prev;
        });
      }, 1000);
      
      return uploadedFile;
    } catch (error) {
      console.error('上传文件失败:', error);
      
      // 更新上传状态为错误
      setUploadQueue(prev => {
        const fileIndex = prev.findIndex(item => item.fileId === tempId);
        if (fileIndex === -1) return prev;
        
        const newQueue = [...prev];
        newQueue[fileIndex] = { 
          ...newQueue[fileIndex], 
          progress: 0, 
          status: 'error',
          error: error instanceof Error ? error.message : '上传失败'
        };
        return newQueue;
      });
      
      message.error(`上传文件失败: ${file.name}`);
      return null;
    }
  }, [addFile, currentFolderId, executeUpload, updateFileStatus]);
  
  // 批量上传文件
  const uploadFiles = useCallback(async (files: File[], parentId: string | null = currentFolderId, autoVectorize: boolean = false) => {
    if (!files.length) {
      message.error('请选择要上传的文件');
      return [];
    }
    
    // 增加批次ID，用于后续识别此批次上传
    const batchId = ++batchIdRef.current;
    
    // 显示上传开始消息
    message.info(`开始上传 ${files.length} 个文件`);
    
    // 串行上传文件（可以根据需要改为并行，但要控制并发数）
    const results: (FileItem | null)[] = [];
    
    for (const file of files) {
      // 检查是否是当前批次（用户可能启动了新的上传）
      if (batchId !== batchIdRef.current) break;
      
      const result = await uploadFile(file, parentId, autoVectorize);
      results.push(result);
    }
    
    // 显示上传结果消息
    const successCount = results.filter(Boolean).length;
    
    if (successCount === files.length) {
      message.success(`成功上传 ${successCount} 个文件`);
    } else if (successCount > 0) {
      message.warning(`部分文件上传成功: ${successCount}/${files.length}`);
    } else {
      message.error('所有文件上传失败');
    }
    
    return results.filter(Boolean) as FileItem[];
  }, [uploadFile, currentFolderId]);
  
  // 取消上传
  const cancelUpload = useCallback((fileId: string) => {
    setUploadQueue(prev => {
      const fileIndex = prev.findIndex(item => item.fileId === fileId);
      if (fileIndex === -1) return prev;
      
      const newQueue = [...prev];
      newQueue[fileIndex] = { ...newQueue[fileIndex], status: 'canceled' };
      
      // 检查队列中是否还有上传中的文件
      const stillUploading = newQueue.some(item => item.status === 'uploading');
      setUploading(stillUploading);
      
      return newQueue;
    });
    
    message.info('已取消上传');
  }, []);
  
  // 清除已完成或已取消的上传
  const clearCompletedUploads = useCallback(() => {
    setUploadQueue(prev => 
      prev.filter(item => item.status === 'uploading')
    );
  }, []);
  
  // 从拖放事件中提取文件
  const extractFilesFromDropEvent = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    
    if (event.dataTransfer.items) {
      // 使用DataTransferItemList接口
      return Array.from(event.dataTransfer.items)
        .filter(item => item.kind === 'file')
        .map(item => item.getAsFile())
        .filter(Boolean) as File[];
    } else {
      // 使用DataTransfer接口
      return Array.from(event.dataTransfer.files);
    }
  }, []);
  
  return {
    // 上传方法
    uploadFile,
    uploadFiles,
    cancelUpload,
    clearCompletedUploads,
    extractFilesFromDropEvent,
    
    // 上传状态
    uploadQueue,
    uploading,
    isUploading,
    uploadError,
    
    // 辅助方法
    getFileTypeIcon,
    formatFileSize
  };
};
