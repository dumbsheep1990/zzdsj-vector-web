import React, { useState } from 'react';
import {
  Search,
  Trash2,
  FilePlus,
  FolderPlus,
  FileText,
  Image,
  Video,
  Music,
  Database,
  X
} from 'lucide-react';
import { FileItem as FileItemType } from '../../../utils/types';
import FileUploader from './FileUploader';

interface FileManagementPanelProps {
  title?: string;
  onClose?: () => void;
  initialFiles?: FileItemType[];
  onFileAction?: (action: 'view' | 'edit' | 'delete', file: FileItemType) => void;
}

const FileManagementPanel: React.FC<FileManagementPanelProps> = ({ 
  title = "文件管理", 
  onClose,
  initialFiles,
  onFileAction
}) => {
  // State management
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeTab, setActiveTab] = useState<string>('全部');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [showUploader, setShowUploader] = useState<boolean>(false);

  const [files, setFiles] = useState<FileItemType[]>(initialFiles || [
    { id: '1', name: '文档', type: 'folder', size: 'NaN KB', date: '2023-10-15', category: 'folder', status: '', isFolder: true, parentId: null, path: '/文档' },
    { id: '2', name: '图片', type: 'folder', size: 'NaN KB', date: '2023-10-15', category: 'folder', status: '', isFolder: true, parentId: null, path: '/图片' },
    { id: '3', name: '报告.pdf', type: 'PDF', size: '0 KB', date: '2023-10-14', category: 'document', status: '已向量化', isFolder: false, parentId: null, path: '/报告.pdf' },
    { id: '4', name: '数据分析.xlsx', type: 'Excel', size: '0 KB', date: '2023-10-13', category: 'spreadsheet', status: '已执行', isFolder: false, parentId: null, path: '/数据分析.xlsx' },
    { id: '5', name: '会议记录.docx', type: 'Word', size: '0 KB', date: '2023-10-12', category: 'document', status: '', isFolder: false, parentId: null, path: '/会议记录.docx' },
    { id: '6', name: '产品设计', type: 'folder', size: 'NaN KB', date: '2023-10-11', category: 'folder', status: '', isFolder: true, parentId: null, path: '/产品设计' },
    { id: '7', name: '设计稿.png', type: 'PNG', size: '0 KB', date: '2023-10-10', category: 'image', status: '已向量化', isFolder: false, parentId: null, path: '/设计稿.png' },
  ]);
  
  // Filter files based on search query and active tab
  const filterFiles = () => {
    let filtered = files;
    
    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(file => 
        file.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        file.type.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply tab filter
    if (activeTab !== '全部') {
      const categoryMap: Record<string, string> = {
        '文档': 'document',
        '图片': 'image',
        '视频': 'video',
        '音频': 'audio',
      };
      
      const category = categoryMap[activeTab];
      if (category) {
        filtered = filtered.filter(file => file.category === category || file.isFolder);
      }
    }
    
    return filtered;
  };
  
  const filteredFiles = filterFiles();
  
  // Toggle selection of all items
  const toggleSelectAll = () => {
    if (selectedItems.length === filteredFiles.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredFiles.map(file => file.id || ''));
    }
  };
  
  // Toggle selection of a single item
  const toggleSelect = (itemId: string) => {
    if (selectedItems.includes(itemId)) {
      setSelectedItems(prev => prev.filter(id => id !== itemId));
    } else {
      setSelectedItems(prev => [...prev, itemId]);
    }
  };
  
  // Handle delete selected items
  const handleDeleteSelected = () => {
    if (selectedItems.length === 0) return;
    
    // Filter out selected items
    setFiles(prev => prev.filter(file => !selectedItems.includes(file.id || '')));
    setSelectedItems([]);
  };
  
  // Get icon for file type
  const getFileIcon = (item: FileItemType) => {
    if (item.isFolder) return <Database className="w-5 h-5 text-blue-500" />;
    
    switch (item.category) {
      case 'document':
        return <FileText className="w-5 h-5 text-blue-600" />;
      case 'image':
        return <Image className="w-5 h-5 text-green-500" />;
      case 'video':
        return <Video className="w-5 h-5 text-red-500" />;
      case 'audio':
        return <Music className="w-5 h-5 text-purple-500" />;
      default:
        return <FileText className="w-5 h-5 text-gray-500" />;
    }
  };

  // Handle file click - view file details or open folder
  const handleFileClick = (file: FileItemType) => {
    // If this is a direct click on a file (not folder)
    if (!file.isFolder) {
      // Logging for debugging purposes
      console.log('File clicked:', file.name);
      // In a real implementation, we would trigger detail view
      if (onFileAction) {
        onFileAction('view', file);
      }
    } else {
      // For folders, we could implement navigation into folder contents
      console.log('Folder clicked:', file.name);
    }
  };

  // Get status badge for a file
  const getStatusBadge = (status: string) => {
    if (!status) return null;
    
    let bgColor = 'bg-gray-100';
    let textColor = 'text-gray-800';
    
    if (status === '已向量化') {
      bgColor = 'bg-green-100';
      textColor = 'text-green-800';
    } else if (status === '处理中') {
      bgColor = 'bg-blue-100';
      textColor = 'text-blue-800';
    } else if (status === '已执行') {
      bgColor = 'bg-purple-100';
      textColor = 'text-purple-800';
    }
    
    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${bgColor} ${textColor}`}>
        {status}
      </span>
    );
  };
  
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col h-full">
      {/* Header with close button */}
      <div className="bg-blue-600 px-6 py-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white flex items-center">
          {title}
          <span className="ml-2 bg-white bg-opacity-20 text-white text-xs px-2 py-0.5 rounded-full">
            {files.length} 个文件
          </span>
        </h2>
        {onClose && (
          <button 
            onClick={onClose} 
            className="bg-white text-blue-600 hover:bg-gray-100 rounded-full p-1 focus:outline-none"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
      
      {/* Search and controls */}
      <div className="border-b border-gray-200 px-6 py-4">
        <div className="flex justify-between items-center mb-4">
          <div className="relative w-1/3">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="搜索文件或文件夹..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div className="flex items-center space-x-2 ml-auto">
            <button
              onClick={() => setShowUploader(true)}
              className="flex items-center space-x-1 px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
            >
              <FilePlus size={16} />
              <span>上传文件</span>
            </button>
            <button
              className="flex items-center space-x-1 px-3 py-1.5 border border-gray-300 bg-white text-gray-700 rounded-md hover:bg-gray-50 transition-colors text-sm"
            >
              <FolderPlus size={16} />
              <span>新建文件夹</span>
            </button>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="flex items-center space-x-1">
          {['全部', '文档', '图片', '视频', '音频'].map((tab) => (
            <button
              key={tab}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                activeTab === tab
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>
      
      {/* Selection controls */}
      <div className="px-6 py-2 border-b border-gray-200 flex justify-between items-center">
        <div className="flex items-center">
          <input 
            type="checkbox" 
            checked={selectedItems.length === filteredFiles.length && filteredFiles.length > 0} 
            onChange={toggleSelectAll}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <span className="ml-2 text-sm text-gray-600">
            {selectedItems.length > 0 ? `已选择 ${selectedItems.length} 项` : '全选'}
          </span>
        </div>
        <button
          onClick={handleDeleteSelected}
          disabled={selectedItems.length === 0}
          className={`inline-flex items-center px-3 py-1.5 text-sm font-medium rounded ${
            selectedItems.length > 0
              ? 'bg-red-50 text-red-600 hover:bg-red-100'
              : 'bg-gray-50 text-gray-400 cursor-not-allowed'
          }`}
        >
          <Trash2 className="w-4 h-4 mr-1" />
          删除所选
        </button>
      </div>
      
      {/* File list */}
      <div className="flex-grow overflow-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50 sticky top-0">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                选择
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                名称
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                类型
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                大小
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                日期
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                状态
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                操作
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredFiles.length > 0 ? (
              filteredFiles.map((file) => (
                <tr 
                  key={file.id} 
                  className={`hover:bg-gray-50 ${selectedItems.includes(file.id || '') ? 'bg-blue-50' : ''}`}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(file.id || '')}
                      onChange={() => toggleSelect(file.id || '')}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className="flex-shrink-0 h-10 w-10 rounded-md bg-gray-50 flex items-center justify-center">
                        {getFileIcon(file)}
                      </span>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {file.name}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{file.type}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{file.size}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{file.date}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(file.status || '')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button 
                      className="text-indigo-600 hover:text-indigo-900 mr-3"
                      onClick={() => onFileAction ? onFileAction('view', file) : handleFileClick(file)}
                    >
                      查看
                    </button>
                    <button
                      className="text-red-600 hover:text-red-900"
                      onClick={() => {
                        if (onFileAction) {
                          onFileAction('delete', file);
                        } else {
                          setFiles(prev => prev.filter(f => f.id !== file.id));
                          if (selectedItems.includes(file.id || '')) {
                            setSelectedItems(prev => prev.filter(id => id !== file.id));
                          }
                        }
                      }}
                    >
                      删除
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="px-6 py-16 text-center">
                  <div className="flex flex-col items-center justify-center text-gray-500">
                    <Search className="h-12 w-12 mb-2 opacity-25" />
                    <p className="text-lg font-medium">未找到文件</p>
                    <p className="text-sm max-w-sm mt-1">尝试修改搜索条件或上传新文件</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              显示第 <span className="font-medium">1</span> 到 <span className="font-medium">{filteredFiles.length}</span> 项，共 <span className="font-medium">{filteredFiles.length}</span> 项
            </p>
          </div>
          <div>
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                上一页
              </button>
              <button className="bg-blue-50 border-blue-500 text-blue-600 relative inline-flex items-center px-4 py-2 border text-sm font-medium">
                1
              </button>
              <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                下一页
              </button>
            </nav>
          </div>
        </div>
      </div>
      
      {/* File Uploader */}
      {showUploader && (
        <FileUploader 
          onUploadComplete={(uploadedFiles) => {
            // In a real implementation, we would process the uploaded files
            // and add them to our file list after server confirms
            console.log('Files uploaded:', uploadedFiles);
            // Add the uploaded files to our list with mock IDs
            const newFiles = uploadedFiles.map((file, index) => ({
              id: `uploaded-${Date.now()}-${index}`,
              name: file.name,
              type: file.type,
              size: `${Math.round(file.size / 1024)} KB`,
              date: new Date().toISOString().split('T')[0],
              category: file.type.split('/')[0],
              status: '',
              isFolder: false,
              parentId: null,
              path: `/${file.name}`
            }));
            setFiles([...files, ...newFiles]);
            setShowUploader(false);
          }}
          onClose={() => setShowUploader(false)}
          allowedTypes={['*/*']} // Allow all file types
          maxSize={50} // 50MB max size
          multiple={true}
        />
      )}
    </div>
  );
};

export default FileManagementPanel;
