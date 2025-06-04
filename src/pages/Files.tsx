import React, { useState, ChangeEvent } from 'react';
import { Button } from '../components/ui/Button';
import { Search, Plus, Upload, FileText, Image, Trash2, X } from 'lucide-react';
import FilesList from '../components/modules/files/FilesList';
import CreateFolderDialog from '../components/modules/files/CreateFolderDialog';
import { FileItem } from '../utils/types';
import { v4 as uuidv4 } from 'uuid';

/**
 * 知识库文件管理组件
 * 提供文件列表展示、筛选、搜索、文件操作（新建文件夹、上传、删除）等功能
 */
const Files: React.FC = () => {
    // 搜索状态
    const [searchQuery, setSearchQuery] = useState<string>('');
    
    // 文件数据状态
    const [files, setFiles] = useState<FileItem[]>([
        { id: '1', name: '文档', type: 'folder', size: '-', date: '2023-10-15', category: 'folder', status: '', isFolder: true, parentId: null, path: '/文档' },
        { id: '2', name: '图片', type: 'folder', size: '-', date: '2023-10-15', category: 'folder', status: '', isFolder: true, parentId: null, path: '/图片' },
        { id: '3', name: '报告.pdf', type: 'PDF', size: '2.5MB', date: '2023-10-14', category: 'document', status: '已向量化', isFolder: false, parentId: null, path: '/报告.pdf' },
        { id: '4', name: '数据分析.xlsx', type: 'Excel', size: '1.8MB', date: '2023-10-13', category: 'document', status: '处理中', isFolder: false, parentId: null, path: '/数据分析.xlsx' },
        { id: '5', name: '会议记录.docx', type: 'Word', size: '500KB', date: '2023-10-12', category: 'document', status: '', isFolder: false, parentId: '1', path: '/文档/会议记录.docx' },
        { id: '6', name: '产品设计', type: 'folder', size: '-', date: '2023-10-11', category: 'folder', status: '', isFolder: true, parentId: '1', path: '/文档/产品设计' },
        { id: '7', name: '设计稿.png', type: 'PNG', size: '3.2MB', date: '2023-10-10', category: 'image', status: '已向量化', isFolder: false, parentId: '2', path: '/图片/设计稿.png' }
    ]);
    
    // 选择状态
    const [selectedItem, setSelectedItem] = useState<FileItem | null>(null);
    const [selectedItems, setSelectedItems] = useState<string[]>([]);
    
    // UI状态
    const [showCreateFolderDialog, setShowCreateFolderDialog] = useState<boolean>(false);
    const [activeTab, setActiveTab] = useState<string>('all');
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);

    // Get the path of a parent folder
    const getParentPath = (parentId: string): string => {
        const parent = files.find(f => f.id === parentId);
        return parent ? parent.path : '';
    };

    // Create a new folder
    const handleCreateFolder = (folderName: string, parentId: string | null) => {
        // If parentId is provided, create folder as a child of that folder
        // Otherwise, create at root level
        const newFolder: FileItem = {
            id: uuidv4(),
            name: folderName,
            type: 'folder',
            size: '-',
            date: new Date().toLocaleDateString(),
            category: 'folder',
            status: '',
            isFolder: true,
            parentId: parentId,
            path: parentId ? `${getParentPath(parentId)}/${folderName}` : `/${folderName}`
        };

        setFiles(prevFiles => [...prevFiles, newFolder]);
        
        // If we created a folder inside another folder, make sure the parent folder is expanded
        if (parentId) {
            // Here we would expand the parent folder to show the new subfolder
            // This would typically be handled in the FilesList component
        }
    };

    // Handle item selection with toggle functionality
    const handleItemSelect = (item: FileItem | null) => {
        setSelectedItem(prevSelected => {
            // If the same item is clicked again, deselect it
            if (item && prevSelected && prevSelected.id === item.id) {
                return null;
            }
            // Otherwise select the new item
            return item;
        });
    };

    // Handle select all files
    const handleSelectAll = () => {
        const filesToSelect = activeTab === 'all' 
            ? filteredFiles 
            : filteredFiles.filter(file => {
                if (activeTab === 'document') return file.category === 'document' || file.isFolder;
                if (activeTab === 'image') return file.category === 'image' || file.isFolder;
                return false;
            });

        if (selectedItems.length === filesToSelect.length) {
            setSelectedItems([]);
        } else {
            setSelectedItems(filesToSelect.map(file => file.id || ''));
        }
    };

    // Handle delete selected files
    const handleDeleteSelected = () => {
        setIsDeleteDialogOpen(true);
    };

    // Filter files based on search query
    const filteredFiles = searchQuery
        ? files.filter(file => 
            file.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            file.type.toLowerCase().includes(searchQuery.toLowerCase()))
        : files;

    // 格式化文件大小
    const formatFileSize = (bytes: number): string => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };
    
    // 文件上传处理函数
    const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
        const uploadedFiles = event.target.files;
        if (!uploadedFiles || uploadedFiles.length === 0) return;
        
        const newFiles: FileItem[] = [];
        
        Array.from(uploadedFiles).forEach(file => {
            // 判断文件类型
            let category = 'document';
            if (file.type.startsWith('image/')) {
                category = 'image';
            }
            
            // 创建新的文件项
            const newFile: FileItem = {
                id: uuidv4(),
                name: file.name,
                type: file.type || '未知类型',
                size: formatFileSize(file.size),
                category,
                isFolder: false,
                date: new Date().toISOString().split('T')[0],
                status: '已上传',
                parentId: null,
                path: '/' + file.name
            };
            
            newFiles.push(newFile);
        });
        
        // 添加到现有文件列表
        setFiles(prevFiles => [...prevFiles, ...newFiles]);
        
        // 重置文件输入框，允许再次上传相同文件
        event.target.value = '';
    };

    return (
        <div className="mx-auto h-full flex flex-col" style={{ 
            border: '2px dashed rgba(226,232,240,0.8)', 
            borderRadius: '0.75rem',
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
        }}>
            {/* 顶部蓝色渐变背景 */}
            <div 
                className="flex items-center px-6 py-3 border-b sticky top-0 z-10"
                style={{ 
                    background: 'linear-gradient(to right, #4299e1, #63b3ed)',
                    borderBottomColor: 'rgba(226,232,240,0.6)',
                }}
            >
                <div className="text-white flex items-center text-sm">
                    <FileText className="h-4 w-4 mr-2" />
                    城市规划知识库 · 文件列表
                </div>
                <button className="ml-auto text-white opacity-80 hover:opacity-100">
                    <X className="h-4 w-4" />
                </button>
            </div>

            {/* 搜索、分类与操作区域 */}
            <div className="p-6 border-b border-gray-100 flex flex-wrap items-center gap-4">
                <div className="flex flex-1 flex-wrap items-center gap-4 min-w-[300px]">
                    {/* 搜索框 */}
                    <div className="relative w-64">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                            <Search className="h-4 w-4" />
                        </span>
                        <input
                            type="text"
                            placeholder="搜索文件..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 pr-4 py-2 w-full border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/90"
                            style={{ boxShadow: '0 1px 2px rgba(0,0,0,0.03)' }}
                        />
                    </div>
                    
                    {/* 分类筛选标签 */}
                    <div className="flex space-x-1">
                        <button 
                            onClick={() => setActiveTab('all')}
                            className={`py-1.5 px-3 text-sm font-medium rounded-md transition-all ${
                                activeTab === 'all' 
                                    ? 'bg-gradient-to-r from-blue-500/10 to-indigo-500/10 text-blue-700' 
                                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100/60'
                            }`}
                        >
                            全部文件
                        </button>
                        <button 
                            onClick={() => setActiveTab('document')}
                            className={`py-1.5 px-3 text-sm font-medium rounded-md flex items-center transition-all ${
                                activeTab === 'document' 
                                    ? 'bg-gradient-to-r from-blue-500/10 to-indigo-500/10 text-blue-700' 
                                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100/60'
                            }`}
                        >
                            <FileText className="h-3.5 w-3.5 mr-1.5" />
                            文档
                        </button>
                        <button 
                            onClick={() => setActiveTab('image')}
                            className={`py-1.5 px-3 text-sm font-medium rounded-md flex items-center transition-all ${
                                activeTab === 'image' 
                                    ? 'bg-gradient-to-r from-purple-500/10 to-indigo-500/10 text-purple-700' 
                                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100/60'
                            }`}
                        >
                            <Image className="h-3.5 w-3.5 mr-1.5" />
                            图片
                        </button>
                    </div>
                </div>
                
                <div className="flex items-center gap-4 ml-auto">
                    {/* 新建文件夹按钮 */}
                    <Button 
                        variant="outline" 
                        onClick={() => setShowCreateFolderDialog(true)}
                        className="shadow-sm border-gray-300 hover:bg-gray-50 text-sm"
                        size="sm"
                    >
                        <Plus className="h-4 w-4 mr-1.5 text-gray-600" />
                        新建文件夹
                    </Button>
                    
                    {/* 上传文件按钮 */}
                    <Button 
                        className="text-sm relative overflow-hidden group"
                        onClick={() => document.getElementById('file-upload')?.click()}
                        style={{ 
                            background: 'linear-gradient(135deg, #38bdf8 0%, #818cf8 100%)',
                            boxShadow: '0 2px 4px rgba(56, 189, 248, 0.25)'
                        }}
                        size="sm"
                    >
                        <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/5 to-transparent group-hover:animate-shimmer" 
                              style={{ backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' }}></span>
                        <Upload className="h-4 w-4 mr-1.5" />
                        上传文件
                        <input 
                            type="file" 
                            id="file-upload" 
                            className="hidden" 
                            multiple 
                            onChange={handleFileUpload} 
                            accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt" 
                        />
                    </Button>
                    
                    {/* 全选复选框 */}
                    <div className="flex items-center ml-4">
                        <input
                            type="checkbox"
                            id="select-all"
                            checked={selectedItems.length > 0 && 
                                selectedItems.length === filteredFiles.filter(file => {
                                    if (activeTab === 'document') return file.category === 'document' || file.isFolder;
                                    if (activeTab === 'image') return file.category === 'image' || file.isFolder;
                                    return true; // 'all' tab
                                }).length
                            }
                            onChange={handleSelectAll}
                            className="mr-2"
                        />
                        <label htmlFor="select-all" className="text-sm cursor-pointer">全选</label>
                    </div>
                    
                    {/* 删除按钮 */}
                    {selectedItems.length > 0 && (
                        <Button 
                            variant="outline" 
                            size="sm"
                            onClick={handleDeleteSelected}
                            className="border-rose-200 text-rose-600 hover:bg-rose-50 text-sm flex items-center"
                        >
                            <Trash2 className="h-4 w-4 mr-1.5" />
                            删除选中 ({selectedItems.length})
                        </Button>
                    )}
                </div>
            </div>
            
            {/* 文件列表区域 */}
            <div className="flex-grow px-4 pb-4">
                <div 
                    className="bg-white rounded-xl h-full flex flex-col" 
                    style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}
                >
                    {/* 文件列表标题栏 */}
                    <div 
                        className="px-4 py-3 border-b flex-shrink-0 sticky top-0 z-10 flex justify-between items-center"
                        style={{ 
                            background: 'linear-gradient(to right, rgba(249,250,251,1) 0%, rgba(240,249,255,0.8) 50%, rgba(236,253,245,0.8) 100%)',
                            borderBottomColor: 'rgba(226,232,240,0.6)'
                        }}
                    >
                        <h3 className="font-medium text-sm text-gray-700">
                            {activeTab === 'all' && '所有文件'}
                            {activeTab === 'document' && '文档'}
                            {activeTab === 'image' && '图片'}
                        </h3>
                        <div className="text-xs text-gray-500">
                            {filteredFiles.length} 个项目
                        </div>
                    </div>
                    {activeTab === 'all' && (
                        <div className="overflow-auto h-full">
                            <FilesList 
                                files={filteredFiles} 
                                selectedItem={selectedItem} 
                                setSelectedItem={handleItemSelect}
                                selectedItems={selectedItems}
                                setSelectedItems={setSelectedItems}
                            />
                        </div>
                    )}
                    
                    {activeTab === 'document' && (
                        <div className="overflow-auto h-full">
                            <FilesList 
                                files={filteredFiles.filter(file => file.category === 'document' || file.isFolder)} 
                                selectedItem={selectedItem} 
                                setSelectedItem={handleItemSelect}
                                selectedItems={selectedItems}
                                setSelectedItems={setSelectedItems}
                            />
                        </div>
                    )}
                    
                    {activeTab === 'image' && (
                        <div className="overflow-auto h-full">
                            <FilesList 
                                files={filteredFiles.filter(file => file.category === 'image' || file.isFolder)} 
                                selectedItem={selectedItem} 
                                setSelectedItem={handleItemSelect}
                                selectedItems={selectedItems}
                                setSelectedItems={setSelectedItems}
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* 创建文件夹对话框 */}
            <CreateFolderDialog 
                isOpen={showCreateFolderDialog}
                onClose={() => setShowCreateFolderDialog(false)}
                onCreateFolder={handleCreateFolder}
                currentFolderId={selectedItem?.isFolder ? selectedItem.id : null}
            />
            
            {/* 删除确认对话框 */}
            {isDeleteDialogOpen && (
                <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">确认删除</h3>
                        <p className="text-gray-600 mb-6">
                            确定要删除所选{selectedItems.length > 1 ? selectedItems.length + '个' : ''}文件吗？此操作无法撤销。
                        </p>
                        <div className="flex justify-end space-x-3">
                            <Button
                                variant="outline"
                                onClick={() => setIsDeleteDialogOpen(false)}
                                className="border-gray-200"
                            >
                                取消
                            </Button>
                            <Button
                                onClick={() => {
                                    setFiles(prevFiles => prevFiles.filter(file => !selectedItems.includes(file.id || '')));
                                    setSelectedItems([]);
                                    setIsDeleteDialogOpen(false);
                                }}
                                className="bg-red-500 hover:bg-red-600 text-white"
                            >
                                删除
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Files;