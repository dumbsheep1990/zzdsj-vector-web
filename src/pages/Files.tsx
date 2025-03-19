import React, { useState } from 'react';
import { fileData } from '../utils/mockData';
import { FileItem } from '../utils/types';
import { Search, Plus, Filter, SlidersHorizontal, FolderPlus } from 'lucide-react';
import FilesList from '../components/modules/files/FilesList';
import DetailPanel from '../components/layout/DetailPanel';
import CreateFolderDialog from '../components/modules/files/CreateFolderDialog';
import { v4 as uuidv4 } from 'uuid';

interface FilesProps {}

const Files: React.FC<FilesProps> = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedItem, setSelectedItem] = useState<FileItem | null>(null);
    const [files, setFiles] = useState<FileItem[]>(fileData);
    const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
    const [breadcrumbs, setBreadcrumbs] = useState<{ id: string | null; name: string }[]>([{ id: null, name: '全部文件' }]);
    const [createFolderDialogOpen, setCreateFolderDialogOpen] = useState(false);

    // Filter files based on search term
    const filteredFiles = files.filter(file => 
        file.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        file.type.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Create a new folder
    const handleCreateFolder = (folderName: string, parentId: string | null) => {
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
    };

    // Get the path of a parent folder
    const getParentPath = (parentId: string): string => {
        const parent = files.find(file => file.id === parentId);
        return parent ? parent.path : '';
    };

    // Handle folder click to navigate
    const handleFolderClick = (folderId: string | null) => {
        setCurrentFolderId(folderId);
        
        if (folderId === null) {
            // Reset to root
            setBreadcrumbs([{ id: null, name: '全部文件' }]);
        } else {
            // Find the folder
            const clickedFolder = files.find(f => f.id === folderId);
            
            if (clickedFolder && clickedFolder.path) {
                // Build breadcrumbs from path
                const folderPath = clickedFolder.path.split('/').filter(p => p);
                const newBreadcrumbs: { id: string | null; name: string }[] = [{ id: null, name: '全部文件' }];
                
                let currentPath = '';
                
                for (let i = 0; i <folderPath.length; i++) {
                    const pathSegment = folderPath[i];
                    currentPath += `/${pathSegment}`;
                    
                    // Find the folder with this path
                    const pathFolder = files.find(f => f.path === currentPath && f.isFolder);
                    if (pathFolder) {
                        newBreadcrumbs.push({ id: pathFolder.id, name: pathSegment });
                    }
                }
                
                setBreadcrumbs(newBreadcrumbs);
            }
        }
    };

    // Get current folder's files and subfolders
    const getCurrentFolderContents = () => {
        return filteredFiles.filter(file => file.parentId === currentFolderId);
    };

    return (
        <div className="flex flex-col h-screen">
            <div className="bg-white border-b p-4">
                <div className="flex justify-between items-center">
                    <h1 className="text-xl font-bold">&#x6587;&#x4ef6;&#x7ba1;&#x7406;</h1>
                    <div className="flex space-x-2">
                        <button 
                            className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-md text-sm"
                            onClick={() => setCreateFolderDialogOpen(true)}
                        >
                            <FolderPlus className="mr-2 h-4 w-4" />
                            &#x65b0;&#x5efa;&#x6587;&#x4ef6;&#x5939;
                        </button>
                        <button className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-md text-sm">
                            <Plus className="mr-2 h-4 w-4" />
                            &#x4e0a;&#x4f20;&#x6587;&#x4ef6;
                        </button>
                    </div>
                </div>

                <div className="flex items-center mt-4 space-x-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                        <input
                            type="search"
                            placeholder="&#x641c;&#x7d22;&#x6587;&#x4ef6;"
                            className="pl-8 w-full p-2 border rounded-md"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <button className="p-2 border rounded-md">
                        <Filter className="h-4 w-4" />
                    </button>
                    <button className="p-2 border rounded-md">
                        <SlidersHorizontal className="h-4 w-4" />
                    </button>
                </div>

                {/* Breadcrumbs */}
                <div className="flex items-center mt-4 text-sm">
                    <div className="flex items-center space-x-2">
                        {breadcrumbs.map((crumb, index) => (
                            <React.Fragment key={crumb.id || 'root'}>
                                {index > 0 && <span className="text-gray-500">/</span>}
                                <button 
                                    className={`hover:text-blue-600 ${index === breadcrumbs.length - 1 ? 'font-medium text-blue-600' : 'text-gray-600'}`}
                                    onClick={() => handleFolderClick(crumb.id)}
                                >
                                    {crumb.name}
                                </button>
                            </React.Fragment>
                        ))}
                    </div>
                </div>
            </div>

            <div className="flex-1 flex overflow-hidden">
                <div style={{ width: selectedItem ? 'calc(65% - 0.75rem)' : '100%' }} className="overflow-auto transition-all duration-300">
                    <FilesList 
                        files={getCurrentFolderContents()} 
                        selectedItem={selectedItem} 
                        setSelectedItem={setSelectedItem}
                        onFolderClick={handleFolderClick}
                    />
                </div>

                {selectedItem && (
                    <DetailPanel 
                        title={selectedItem.name}
                        onClose={() => setSelectedItem(null)}
                        className="w-[35%] border-l"
                    >
                        <div className="p-6">
                            <h2 className="text-xl font-bold mb-4">{selectedItem.name}</h2>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-500">&#x7c7b;&#x578b;</p>
                                    <p className="font-medium">{selectedItem.type.toUpperCase()}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">&#x5927;&#x5c0f;</p>
                                    <p className="font-medium">{selectedItem.size}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">&#x65e5;&#x671f;</p>
                                    <p className="font-medium">{selectedItem.date}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">&#x72b6;&#x6001;</p>
                                    <p className="font-medium">{selectedItem.status}</p>
                                </div>
                                <div className="col-span-2">
                                    <p className="text-sm text-gray-500">&#x8def;&#x5f84;</p>
                                    <p className="font-medium">{selectedItem.path}</p>
                                </div>
                            </div>
                            
                            {/* Additional file details can be added here */}
                        </div>
                    </DetailPanel>
                )}
            </div>

            <CreateFolderDialog 
                isOpen={createFolderDialogOpen}
                onClose={() => setCreateFolderDialogOpen(false)}
                onCreateFolder={handleCreateFolder}
                currentFolderId={currentFolderId}
            />
        </div>
    );
};

export default Files;