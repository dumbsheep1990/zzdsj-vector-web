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
  X,
  MoreVertical,
  Download,
  Share2,
  Edit3,
  Eye,
  Filter,
  Grid3X3,
  List,
  Upload,
  Plus,
  FolderOpen,
  File,
  Archive,
  Code,
  Presentation
} from 'lucide-react';
import { FileItem as FileItemType } from '../../../utils/types';
import FileUploader from './FileUploader';
import CreateFolderDialog from './CreateFolderDialog';

interface FileManagementPanelProps {
  title?: string;
  onClose?: () => void;
  initialFiles?: FileItemType[];
  onFileAction?: (action: 'view' | 'edit' | 'delete', file: FileItemType) => void;
  knowledgeBaseId?: string;
}

const FileManagementPanel: React.FC<FileManagementPanelProps> = ({ 
  title = "文件管理", 
  onClose,
  initialFiles,
  onFileAction,
  knowledgeBaseId
}) => {
  // State management
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeTab, setActiveTab] = useState<string>('全部');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [showUploader, setShowUploader] = useState<boolean>(false);
  const [showCreateFolder, setShowCreateFolder] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'size' | 'type'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const [files, setFiles] = useState<FileItemType[]>(initialFiles || [
    { id: '1', name: '文档', type: 'folder', size: 'NaN KB', date: '2023-10-15', category: 'folder', status: '', isFolder: true, parentId: null, path: '/文档' },
    { id: '2', name: '图片', type: 'folder', size: 'NaN KB', date: '2023-10-15', category: 'folder', status: '', isFolder: true, parentId: null, path: '/图片' },
    { id: '3', name: '报告.pdf', type: 'PDF', size: '0 KB', date: '2023-10-14', category: 'document', status: '已向量化', isFolder: false, parentId: null, path: '/报告.pdf' },
    { id: '4', name: '数据分析.xlsx', type: 'Excel', size: '0 KB', date: '2023-10-13', category: 'spreadsheet', status: '已执行', isFolder: false, parentId: null, path: '/数据分析.xlsx' },
    { id: '5', name: '会议记录.docx', type: 'Word', size: '0 KB', date: '2023-10-12', category: 'document', status: '', isFolder: false, parentId: null, path: '/会议记录.docx' },
    { id: '6', name: '产品设计', type: 'folder', size: 'NaN KB', date: '2023-10-11', category: 'folder', status: '', isFolder: true, parentId: null, path: '/产品设计' },
    { id: '7', name: '设计稿.png', type: 'PNG', size: '0 KB', date: '2023-10-10', category: 'image', status: '已向量化', isFolder: false, parentId: null, path: '/设计稿.png' },
  ]);

  // Filter and sort files
  const filteredFiles = (() => {
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

    // Sort files
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortBy) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'date':
          aValue = new Date(a.date).getTime();
          bValue = new Date(b.date).getTime();
          break;
        case 'size':
          aValue = parseFloat(a.size) || 0;
          bValue = parseFloat(b.size) || 0;
          break;
        case 'type':
          aValue = a.type.toLowerCase();
          bValue = b.type.toLowerCase();
          break;
        default:
          return 0;
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  })();

  const toggleSelectAll = () => {
    if (selectedItems.length === filteredFiles.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredFiles.map(file => file.id || ''));
    }
  };

  const toggleSelect = (itemId: string) => {
    setSelectedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleDeleteSelected = () => {
    setFiles(prev => prev.filter(file => !selectedItems.includes(file.id || '')));
    setSelectedItems([]);
  };

  const handleCreateFolder = (folderName: string) => {
    const newFolder: FileItemType = {
      id: `folder-${Date.now()}`,
      name: folderName,
      type: 'folder',
      size: 'NaN KB',
      date: new Date().toISOString().split('T')[0],
      category: 'folder',
      status: '',
      isFolder: true,
      parentId: null,
      path: `/${folderName}`
    };
    setFiles(prev => [newFolder, ...prev]);
    setShowCreateFolder(false);
  };

  const getFileIcon = (item: FileItemType) => {
    if (item.isFolder) {
      return <FolderOpen className="w-5 h-5 text-blue-500" />;
    }
    
    const iconMap: Record<string, React.ReactNode> = {
      'PDF': <FileText className="w-5 h-5 text-red-500" />,
      'Word': <FileText className="w-5 h-5 text-blue-500" />,
      'Excel': <Presentation className="w-5 h-5 text-green-500" />,
      'PNG': <Image className="w-5 h-5 text-purple-500" />,
      'JPG': <Image className="w-5 h-5 text-purple-500" />,
      'MP4': <Video className="w-5 h-5 text-orange-500" />,
      'MP3': <Music className="w-5 h-5 text-pink-500" />,
      'ZIP': <Archive className="w-5 h-5 text-gray-500" />,
      'TXT': <FileText className="w-5 h-5 text-gray-500" />,
      'DOC': <FileText className="w-5 h-5 text-blue-500" />,
      'DOCX': <FileText className="w-5 h-5 text-blue-500" />,
      'XLS': <Presentation className="w-5 h-5 text-green-500" />,
      'XLSX': <Presentation className="w-5 h-5 text-green-500" />,
      'PPT': <Presentation className="w-5 h-5 text-orange-500" />,
      'PPTX': <Presentation className="w-5 h-5 text-orange-500" />,
      'JS': <Code className="w-5 h-5 text-yellow-500" />,
      'TS': <Code className="w-5 h-5 text-blue-500" />,
      'PY': <Code className="w-5 h-5 text-green-500" />,
      'JSON': <Code className="w-5 h-5 text-gray-500" />,
    };
    
    return iconMap[item.type] || <File className="w-5 h-5 text-gray-500" />;
  };

  const handleFileClick = (file: FileItemType) => {
    if (file.isFolder) {
      console.log('Opening folder:', file.name);
    } else {
      console.log('Opening file:', file.name);
    }
  };

  const getStatusBadge = (status: string) => {
    if (!status) return null;
    
    const statusConfig: Record<string, { color: string; bgColor: string }> = {
      '已向量化': { color: 'text-green-700', bgColor: 'bg-green-100' },
      '已执行': { color: 'text-blue-700', bgColor: 'bg-blue-100' },
      '处理中': { color: 'text-yellow-700', bgColor: 'bg-yellow-100' },
      '失败': { color: 'text-red-700', bgColor: 'bg-red-100' },
    };
    
    const config = statusConfig[status] || { color: 'text-gray-700', bgColor: 'bg-gray-100' };
    
    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${config.bgColor} ${config.color}`}>
        {status}
      </span>
    );
  };

  const formatFileSize = (size: string) => {
    if (size === 'NaN KB' || size === '0 KB') return '-';
    return size;
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col h-full">
      {/* Compact Header */}
      <div className="bg-gray-50 border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          <span className="text-sm text-gray-500">{files.length} 个文件</span>
        </div>
        {onClose && (
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-600 p-1 rounded-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
      
      {/* Compact Controls */}
      <div className="px-4 py-3 border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between mb-3">
          {/* Search Bar */}
          <div className="relative flex-1 max-w-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="搜索文件..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-3 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>
          
          {/* Action Buttons */}
          <div className="flex items-center space-x-2 ml-4">
            {/* View Mode Toggle */}
            <div className="flex items-center bg-gray-100 rounded-md p-1">
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded transition-colors ${
                  viewMode === 'list' 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded transition-colors ${
                  viewMode === 'grid' 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
            </div>

            {/* Sort Dropdown */}
            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [newSortBy, newSortOrder] = e.target.value.split('-') as [typeof sortBy, typeof sortOrder];
                setSortBy(newSortBy);
                setSortOrder(newSortOrder);
              }}
              className="px-3 py-2 border border-gray-300 rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="name-asc">名称 A-Z</option>
              <option value="name-desc">名称 Z-A</option>
              <option value="date-desc">最新修改</option>
              <option value="date-asc">最早修改</option>
              <option value="size-desc">大小递减</option>
              <option value="size-asc">大小递增</option>
            </select>

            {/* Upload Button */}
            <button
              onClick={() => setShowUploader(true)}
              className="flex items-center space-x-1 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
            >
              <Upload className="w-4 h-4" />
              <span>上传</span>
            </button>

            {/* Create Folder Button */}
            <button
              onClick={() => setShowCreateFolder(true)}
              className="flex items-center space-x-1 px-3 py-2 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors text-sm"
            >
              <FolderPlus className="w-4 h-4" />
              <span>新建文件夹</span>
            </button>
          </div>
        </div>
        
        {/* Compact Tabs */}
        <div className="flex items-center space-x-1">
          {[
            { key: '全部', icon: <Database className="w-4 h-4" /> },
            { key: '文档', icon: <FileText className="w-4 h-4" /> },
            { key: '图片', icon: <Image className="w-4 h-4" /> },
            { key: '视频', icon: <Video className="w-4 h-4" /> },
            { key: '音频', icon: <Music className="w-4 h-4" /> }
          ].map((tab) => (
            <button
              key={tab.key}
              className={`flex items-center space-x-1 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab.key
                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
              }`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.icon}
              <span>{tab.key}</span>
            </button>
          ))}
        </div>
      </div>
      
      {/* Selection Controls */}
      {selectedItems.length > 0 && (
        <div className="px-4 py-2 bg-blue-50 border-b border-blue-100 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="flex items-center">
              <input 
                type="checkbox" 
                checked={selectedItems.length === filteredFiles.length && filteredFiles.length > 0} 
                onChange={toggleSelectAll}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="ml-2 text-sm font-medium text-blue-800">
                {selectedItems.length > 0 ? `已选择 ${selectedItems.length} 项` : '全选'}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <button className="flex items-center space-x-1 px-2 py-1 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-100 rounded transition-colors">
                <Download className="w-4 h-4" />
                <span>下载</span>
              </button>
              <button className="flex items-center space-x-1 px-2 py-1 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-100 rounded transition-colors">
                <Share2 className="w-4 h-4" />
                <span>分享</span>
              </button>
            </div>
          </div>
          <button
            onClick={handleDeleteSelected}
            className="flex items-center space-x-1 px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-md transition-colors text-sm"
          >
            <Trash2 className="w-4 h-4" />
            <span>删除所选</span>
          </button>
        </div>
      )}
      
      {/* File List */}
      <div className="flex-grow overflow-auto">
        {viewMode === 'list' ? (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 sticky top-0 z-10">
              <tr>
                <th scope="col" className="px-4 py-3 text-left">
                  <input 
                    type="checkbox" 
                    checked={selectedItems.length === filteredFiles.length && filteredFiles.length > 0} 
                    onChange={toggleSelectAll}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  名称
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  类型
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  大小
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  修改日期
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  状态
                </th>
                <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredFiles.length > 0 ? (
                filteredFiles.map((file) => (
                  <tr 
                    key={file.id} 
                    className={`hover:bg-gray-50 transition-colors duration-150 cursor-pointer ${
                      selectedItems.includes(file.id || '') ? 'bg-blue-50' : ''
                    }`}
                    onClick={() => handleFileClick(file)}
                  >
                    <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(file.id || '')}
                        onChange={() => toggleSelect(file.id || '')}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8 rounded-md bg-gray-50 flex items-center justify-center border border-gray-200">
                          {getFileIcon(file)}
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">{file.name}</div>
                          <div className="text-xs text-gray-500">{file.path}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm text-gray-600">{file.type}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm text-gray-600">{formatFileSize(file.size)}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm text-gray-600">{file.date}</div>
                    </td>
                    <td className="px-4 py-3">
                      {getStatusBadge(file.status || '')}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end space-x-1">
                        <button 
                          className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            onFileAction ? onFileAction('view', file) : handleFileClick(file);
                          }}
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button 
                          className="p-1 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            onFileAction ? onFileAction('edit', file) : console.log('Edit file:', file.name);
                          }}
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button 
                          className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
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
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center">
                    <div className="flex flex-col items-center justify-center text-gray-500">
                      <Database className="h-8 w-8 mb-2 opacity-25" />
                      <p className="text-sm font-medium">没有找到文件</p>
                      <p className="text-xs mt-1">尝试修改搜索条件或上传新文件</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        ) : (
          // Grid View
          <div className="p-4">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
              {filteredFiles.map((file) => (
                <div
                  key={file.id}
                  className={`group relative p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all duration-200 cursor-pointer ${
                    selectedItems.includes(file.id || '') ? 'border-blue-300 bg-blue-50' : 'bg-white'
                  }`}
                  onClick={() => handleFileClick(file)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(file.id || '')}
                      onChange={(e) => {
                        e.stopPropagation();
                        toggleSelect(file.id || '');
                      }}
                      className="w-3 h-3 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <button className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-gray-600 transition-opacity">
                      <MoreVertical className="w-3 h-3" />
                    </button>
                  </div>
                  
                  <div className="flex flex-col items-center text-center">
                    <div className="w-8 h-8 rounded-md bg-gray-50 flex items-center justify-center mb-2 border border-gray-200">
                      {getFileIcon(file)}
                    </div>
                    <div className="text-xs font-medium text-gray-900 truncate w-full">{file.name}</div>
                    <div className="text-xs text-gray-500 mt-1">{file.type}</div>
                    {file.status && (
                      <div className="mt-1">
                        {getStatusBadge(file.status)}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* File Uploader Modal */}
      {showUploader && (
        <FileUploader 
          onUploadComplete={(uploadedFiles) => {
            if (knowledgeBaseId) {
              console.log('Files successfully uploaded to knowledge base:', uploadedFiles);
            } else {
              console.log('Files selected:', uploadedFiles);
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
            }
            setShowUploader(false);
          }}
          onClose={() => setShowUploader(false)}
          allowedTypes={['*/*']}
          maxSize={50}
          multiple={true}
          knowledgeBaseId={knowledgeBaseId}
        />
      )}

      {/* Create Folder Dialog */}
      {showCreateFolder && (
        <CreateFolderDialog
          isOpen={showCreateFolder}
          onClose={() => setShowCreateFolder(false)}
          onCreateFolder={handleCreateFolder}
          currentFolderId={null}
        />
      )}
    </div>
  );
};

export default FileManagementPanel;
