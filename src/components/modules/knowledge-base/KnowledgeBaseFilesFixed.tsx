import React, { useState, useEffect } from 'react';
import '../../../styles/fileManager.css';
import { FileItem } from '../../../utils/types';
import IntegratedFileManager from '../files/IntegratedFileManager';
import FileDetailDrawer from '../files/FileDetailDrawer';

interface KnowledgeBaseFilesProps {
  knowledgeBaseId?: string;
  userId?: string;
  title?: string;
  onClose?: () => void;
  messageServiceUrl?: string;
  apiBaseUrl?: string;
}

const KnowledgeBaseFilesFixed: React.FC<KnowledgeBaseFilesProps> = ({
  knowledgeBaseId = 'default',  // 实际应用中应该传入真实的知识库ID
  userId = 'user-123',          // 实际应用中应该从用户上下文获取
  title = "知识库文件列表",
  onClose,
  messageServiceUrl = 'http://localhost:8089',
  apiBaseUrl = 'http://localhost:8082'
}) => {
  console.log(`Knowledge base files for ID: ${knowledgeBaseId}`);
  
  // 状态管理 - 简化的状态，因为IntegratedFileManager内部管理了大部分状态
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);
  const [showDetailDrawer, setShowDetailDrawer] = useState<boolean>(false);
  
  // 处理文件选择 - 用于显示详情抽屉
  const handleFileSelect = (file: FileItem) => {
    setSelectedFile(file);
    setShowDetailDrawer(true);
  };
  
  // 处理文件操作 - 集成到IntegratedFileManager的回调
  const handleFileAction = (action: 'view' | 'edit' | 'delete', file: FileItem) => {
    if (action === 'view' || action === 'edit') {
      handleFileSelect(file);
    }
    // 删除操作由IntegratedFileManager内部处理，不需要额外处理
  };
  
  // 动画状态
  const [animationClass, setAnimationClass] = useState<string>('fade-in');
  
  // 组件挂载时添加动画
  useEffect(() => {
    setAnimationClass('fade-in');
    
    // 添加自定义滚动条样式
    document.body.classList.add('overflow-hidden');
    
    // 清理函数
    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, []);
  
  // 带动画的关闭处理
  const handleClose = () => {
    setAnimationClass('fade-out');
    setTimeout(() => {
      if (onClose) onClose();
    }, 200); // 匹配动画持续时间
  };
  
  return (
    <div className={`relative h-full ${animationClass}`}>
      {/* 主要的文件管理面板 - 使用IntegratedFileManager替代FileManagementPanel */}
      <div className="h-full">
        <IntegratedFileManager
          knowledgeBaseId={knowledgeBaseId}
          userId={userId}
          title={title}
          onClose={handleClose}
          onFileAction={handleFileAction}
          messageServiceUrl={messageServiceUrl}
          apiBaseUrl={apiBaseUrl}
        />
      </div>
      
      {/* 文件详情抽屉（覆盖层）- 保持原有功能 */}
      {showDetailDrawer && selectedFile && (
        <FileDetailDrawer 
          file={selectedFile}
          onClose={() => setShowDetailDrawer(false)}
          onDelete={(fileId: string) => {
            // 删除后关闭抽屉，IntegratedFileManager会自动刷新列表
            setShowDetailDrawer(false);
          }}
          onToggleStatus={(fileId: string, status: string) => {
            // 状态更新由IntegratedFileManager通过SSE自动处理
            console.log(`状态更新: ${fileId} -> ${status}`);
          }}
        />
      )}
    </div>
  );
};

export default KnowledgeBaseFilesFixed;