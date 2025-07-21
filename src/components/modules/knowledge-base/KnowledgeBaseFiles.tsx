import React, { useState, useEffect } from 'react';
import '../../../styles/fileManager.css';
import { FileItem } from '../../../utils/types';
import FileManagementPanel from '../files/FileManagementPanel';
import FileDetailDrawer from '../files/FileDetailDrawer';

interface KnowledgeBaseFilesProps {
  knowledgeBaseId?: string;
  title?: string;
  onClose?: () => void;
}

const KnowledgeBaseFiles: React.FC<KnowledgeBaseFilesProps> = ({
  knowledgeBaseId = 'default',
  title = "知识库文件列表",
  onClose
}) => {
  // Use knowledgeBaseId for loading/filtering files when needed
  console.log(`Knowledge base files for ID: ${knowledgeBaseId}`);
  // State management
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);
  const [showDetailDrawer, setShowDetailDrawer] = useState<boolean>(false);
  const [files, setFiles] = useState<FileItem[]>([
    { id: '1', name: '文档', type: 'folder', size: 'NaN KB', date: '2023-10-15', category: 'folder', status: '', isFolder: true, parentId: null, path: '/文档' },
    { id: '2', name: '图片', type: 'folder', size: 'NaN KB', date: '2023-10-15', category: 'folder', status: '', isFolder: true, parentId: null, path: '/图片' },
    { id: '3', name: '报告.pdf', type: 'PDF', size: '0 KB', date: '2023-10-14', category: 'document', status: '已向量化', isFolder: false, parentId: null, path: '/报告.pdf' },
    { id: '4', name: '数据分析.xlsx', type: 'Excel', size: '0 KB', date: '2023-10-13', category: 'spreadsheet', status: '处理中', isFolder: false, parentId: null, path: '/数据分析.xlsx' },
    { id: '5', name: '会议记录.docx', type: 'Word', size: '0 KB', date: '2023-10-12', category: 'document', status: '', isFolder: false, parentId: null, path: '/会议记录.docx' },
    { id: '6', name: '产品设计', type: 'folder', size: 'NaN KB', date: '2023-10-11', category: 'folder', status: '', isFolder: true, parentId: null, path: '/产品设计' },
    { id: '7', name: '设计稿.png', type: 'PNG', size: '0 KB', date: '2023-10-10', category: 'image', status: '已向量化', isFolder: false, parentId: null, path: '/设计稿.png' },
  ]);
  
  // Handle file selection
  const handleFileSelect = (file: FileItem) => {
    setSelectedFile(file);
    setShowDetailDrawer(true);
  };
  
  // Handle file deletion
  const handleDeleteFile = (fileId: string) => {
    setFiles(prevFiles => prevFiles.filter(file => file.id !== fileId));
    setShowDetailDrawer(false);
  };
  
  // Handle file status toggle
  const handleToggleStatus = (fileId: string, status: string) => {
    setFiles(prevFiles =>
      prevFiles.map(file =>
        file.id === fileId ? { ...file, status } : file
      )
    );
  };

  // Custom event handler for the FileManagementPanel
  const handleFileAction = (action: 'view' | 'edit' | 'delete', file: FileItem) => {
    if (action === 'view' || action === 'edit') {
      handleFileSelect(file);
    } else if (action === 'delete') {
      handleDeleteFile(file.id || '');
    }
  };
  
  // Animation state
  const [animationClass, setAnimationClass] = useState<string>('fade-in');
  
  // Add animation when component mounts
  useEffect(() => {
    setAnimationClass('fade-in');
    
    // Add custom scrollbar class to body when the component mounts
    document.body.classList.add('overflow-hidden');
    
    // Clean up when the component unmounts
    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, []);
  
  // Handle close with animation
  const handleClose = () => {
    setAnimationClass('fade-out');
    setTimeout(() => {
      if (onClose) onClose();
    }, 200); // Match animation duration
  };
  
  return (
    <div className={`relative h-full ${animationClass}`}>
      {/* Main File Management Panel */}
      <div className="h-full">
        <FileManagementPanel 
          title={title}
          onClose={handleClose}
          initialFiles={files}
          onFileAction={handleFileAction}
        />
      </div>
      
      {/* File Detail Drawer (Overlay) */}
      {showDetailDrawer && selectedFile && (
        <FileDetailDrawer 
          file={selectedFile}
          onClose={() => setShowDetailDrawer(false)}
          onDelete={handleDeleteFile}
          onToggleStatus={handleToggleStatus}
        />
      )}
    </div>
  );
};

export default KnowledgeBaseFiles;
