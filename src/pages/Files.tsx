import React, { useState } from 'react';
import { Button } from '../components/ui/Button';
import { Search, Plus, Upload, FileText, Image, Video, Music, Filter } from 'lucide-react';
import FilesList from '../components/modules/files/FilesList';
import CreateFolderDialog from '../components/modules/files/CreateFolderDialog';
import { FileItem } from '../utils/types';
import { v4 as uuidv4 } from 'uuid';

const Files: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [files, setFiles] = useState<FileItem[]>([
        { id: '1', name: '文档', type: 'folder', size: '-', date: '2023-10-15', category: 'folder', status: '', isFolder: true, parentId: null, path: '/文档' },
        { id: '2', name: '图片', type: 'folder', size: '-', date: '2023-10-15', category: 'folder', status: '', isFolder: true, parentId: null, path: '/图片' },
        { id: '3', name: '报告.pdf', type: 'PDF', size: '2.5MB', date: '2023-10-14', category: 'document', status: '已向量化', isFolder: false, parentId: null, path: '/报告.pdf' },
        { id: '4', name: '数据分析.xlsx', type: 'Excel', size: '1.8MB', date: '2023-10-13', category: 'spreadsheet', status: '处理中', isFolder: false, parentId: null, path: '/数据分析.xlsx' },
        { id: '5', name: '会议记录.docx', type: 'Word', size: '500KB', date: '2023-10-12', category: 'document', status: '', isFolder: false, parentId: '1', path: '/文档/会议记录.docx' },
        { id: '6', name: '产品设计', type: 'folder', size: '-', date: '2023-10-11', category: 'folder', status: '', isFolder: true, parentId: '1', path: '/文档/产品设计' },
        { id: '7', name: '设计稿.png', type: 'PNG', size: '3.2MB', date: '2023-10-10', category: 'image', status: '已向量化', isFolder: false, parentId: '2', path: '/图片/设计稿.png' },
    ]);
    
    const [selectedItem, setSelectedItem] = useState<FileItem | null>(null);
    const [showCreateFolderDialog, setShowCreateFolderDialog] = useState<boolean>(false);
    const [activeTab, setActiveTab] = useState<string>('all');

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

    // Filter files based on search query
    const filteredFiles = searchQuery
        ? files.filter(file => 
            file.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            file.type.toLowerCase().includes(searchQuery.toLowerCase()))
        : files;

    return (
        <div className="container mx-auto py-4 h-full flex flex-col">
            <div className="flex justify-between items-center mb-5 px-4">
                <h1 className="text-2xl font-bold text-gray-800">文件管理</h1>
                <div className="flex space-x-2">
                    <Button 
                        variant="outline" 
                        onClick={() => setShowCreateFolderDialog(true)}
                        className="shadow-sm border-gray-300 hover:bg-gray-50"
                    >
                        <Plus className="h-4 w-4 mr-2 text-gray-600" />
                        新建文件夹
                    </Button>
                    <Button className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 shadow-md">
                        <Upload className="h-4 w-4 mr-2" />
                        上传文件
                    </Button>
                </div>
            </div>

            <div className="mb-5 px-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        className="w-full pl-10 p-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        placeholder="搜索文件名或类型..."
                        value={searchQuery}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            <div className="flex border-b mb-4 px-4 overflow-x-auto">
                <button 
                    className={`px-4 py-2.5 font-medium flex items-center ${activeTab === 'all' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'}`}
                    onClick={() => setActiveTab('all')}
                >
                    <Filter className="h-4 w-4 mr-1.5" />
                    全部
                </button>
                <button 
                    className={`px-4 py-2.5 font-medium flex items-center ${activeTab === 'documents' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'}`}
                    onClick={() => setActiveTab('documents')}
                >
                    <FileText className="h-4 w-4 mr-1.5" />
                    文档
                </button>
                <button 
                    className={`px-4 py-2.5 font-medium flex items-center ${activeTab === 'images' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'}`}
                    onClick={() => setActiveTab('images')}
                >
                    <Image className="h-4 w-4 mr-1.5" />
                    图片
                </button>
                <button 
                    className={`px-4 py-2.5 font-medium flex items-center ${activeTab === 'videos' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'}`}
                    onClick={() => setActiveTab('videos')}
                >
                    <Video className="h-4 w-4 mr-1.5" />
                    视频
                </button>
                <button 
                    className={`px-4 py-2.5 font-medium flex items-center ${activeTab === 'audio' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'}`}
                    onClick={() => setActiveTab('audio')}
                >
                    <Music className="h-4 w-4 mr-1.5" />
                    音频
                </button>
            </div>
            
            <div className="flex-grow px-4 pb-4">
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm h-full overflow-hidden">
                    {activeTab === 'all' && (
                        <FilesList 
                            files={filteredFiles} 
                            selectedItem={selectedItem} 
                            setSelectedItem={handleItemSelect}
                        />
                    )}
                    
                    {activeTab === 'documents' && (
                        <FilesList 
                            files={filteredFiles.filter(file => file.category === 'document' || file.isFolder)} 
                            selectedItem={selectedItem} 
                            setSelectedItem={handleItemSelect}
                        />
                    )}
                    
                    {activeTab === 'images' && (
                        <FilesList 
                            files={filteredFiles.filter(file => file.category === 'image' || file.isFolder)} 
                            selectedItem={selectedItem} 
                            setSelectedItem={handleItemSelect}
                        />
                    )}
                    
                    {activeTab === 'videos' && (
                        <FilesList 
                            files={filteredFiles.filter(file => file.category === 'video' || file.isFolder)} 
                            selectedItem={selectedItem} 
                            setSelectedItem={handleItemSelect}
                        />
                    )}
                    
                    {activeTab === 'audio' && (
                        <FilesList 
                            files={filteredFiles.filter(file => file.category === 'audio' || file.isFolder)} 
                            selectedItem={selectedItem} 
                            setSelectedItem={handleItemSelect}
                        />
                    )}
                </div>
            </div>

            <CreateFolderDialog 
                isOpen={showCreateFolderDialog}
                onClose={() => setShowCreateFolderDialog(false)}
                onCreateFolder={handleCreateFolder}
                currentFolderId={selectedItem?.isFolder ? selectedItem.id : null}
            />
        </div>
    );
};

export default Files;