import React, { useState } from 'react';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '../../../components/ui/Table';
import { FileItem as FileItemType } from '../../../utils/types';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '../../../components/ui/Pagination';
import FileItemComponent from './FileItem';
import EmptyState from './EmptyState';
import PauseConfirmDialog from './PauseConfirmDialog';

interface FilesListProps {
  files: FileItemType[];
  selectedItem: FileItemType | null;
  setSelectedItem: (item: FileItemType | null) => void;
}

const FilesList: React.FC<FilesListProps> = ({ files, selectedItem, setSelectedItem }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedFolders, setExpandedFolders] = useState<string[]>([]);
  const [vectorizeSettingsChanged, setVectorizeSettingsChanged] = useState<Record<string, boolean>>({});
  const [showPauseConfirm, setShowPauseConfirm] = useState<string | null>(null);
  const [fileStatuses, setFileStatuses] = useState<Record<string, string>>({});
  const itemsPerPage = 10;

  // Build a hierarchical structure from the flat files list
  const buildFileHierarchy = (files: FileItemType[]): FileItemType[] => {
    const fileMap = new Map<string, FileItemType>();
    const rootItems: FileItemType[] = [];

    // First pass: create a map of all items by ID
    files.forEach(item => {
      fileMap.set(item.id || '', { ...item, children: [] });
    });

    // Second pass: build the hierarchy
    files.forEach(item => {
      const itemWithChildren = fileMap.get(item.id || '');
      if (!itemWithChildren) return;

      if (item.parentId) {
        const parent = fileMap.get(item.parentId);
        if (parent) {
          if (!parent.children) parent.children = [];
          parent.children.push(itemWithChildren);
        } else {
          rootItems.push(itemWithChildren);
        }
      } else {
        rootItems.push(itemWithChildren);
      }
    });

    return rootItems;
  };

  const hierarchicalFiles = buildFileHierarchy(files);

  // Toggle folder expansion
  const toggleFolder = (folderId: string) => {
    setExpandedFolders(prev => {
      if (prev.includes(folderId)) {
        return prev.filter(id => id !== folderId);
      } else {
        return [...prev, folderId];
      }
    });
  };

  // Handle folder click
  const handleFolderClick = (folder: FileItemType, e: React.MouseEvent) => {
    e.stopPropagation();
    if (folder.id !== null) {
      toggleFolder(folder.id);
    }
  };

  const totalPages = Math.ceil(files.length / itemsPerPage);

  // Render a file or folder item
  const renderFileItem = (item: FileItemType, depth = 0) => {
    const isExpanded = expandedFolders.includes(item.id || '');
    
    return (
      <FileItemComponent 
        key={item.id || `temp-${Math.random()}`}
        item={item}
        depth={depth}
        isExpanded={isExpanded}
        selectedItem={selectedItem}
        fileStatuses={fileStatuses}
        vectorizeSettingsChanged={vectorizeSettingsChanged}
        toggleFolder={toggleFolder}
        setSelectedItem={setSelectedItem}
        handleFolderClick={handleFolderClick}
        handleStartVectorize={handleStartVectorize}
        handlePauseVectorize={handlePauseVectorize}
        toggleVectorizeSettings={toggleVectorizeSettings}
        renderFileItem={renderFileItem}
      />
    );
  };

  // Start vectorization for a file
  const handleStartVectorize = (fileId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    console.log(`Starting vectorization for file ${fileId}`);
    // Simulating API call
    setFileStatuses(prev => ({
      ...prev,
      [fileId]: 'vectorizing'
    }));
  };

  // Pause vectorization for a file
  const handlePauseVectorize = (fileId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setShowPauseConfirm(fileId);
  };

  // Confirm pause vectorization
  const confirmPauseVectorize = () => {
    if (showPauseConfirm) {
      console.log(`Pausing vectorization for file ${showPauseConfirm}`);
      // Simulating API call
      setFileStatuses(prev => ({
        ...prev,
        [showPauseConfirm]: 'paused'
      }));
      setShowPauseConfirm(null);
    }
  };

  // Cancel pause vectorization
  const cancelPauseVectorize = () => {
    setShowPauseConfirm(null);
  };

  // Toggle vectorize settings for a file
  const toggleVectorizeSettings = (fileId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    console.log(`Toggling vectorize settings for file ${fileId}`);
    // Simulating settings change
    setVectorizeSettingsChanged(prev => ({
      ...prev,
      [fileId]: !prev[fileId]
    }));
  };

  // Get file name by ID
  const getFileName = (fileId: string): string => {
    const file = files.find(f => f.id === fileId);
    return file ? file.name : '';
  };

  // If there are no files to display
  if (files.length === 0) {
    return (
      <EmptyState />
    );
  }

  return (
    <div className="flex flex-col h-full rounded-lg overflow-hidden transition-all duration-300">
      <div className="flex-grow overflow-auto">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead className="w-10">
                <span className="sr-only">选择</span>
              </TableHead>
              <TableHead className="w-1/3">名称</TableHead>
              <TableHead>类型</TableHead>
              <TableHead>大小</TableHead>
              <TableHead>状态</TableHead>
              <TableHead>日期</TableHead>
              <TableHead className="w-32">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {hierarchicalFiles
              .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
              .map(item => renderFileItem(item))
            }
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="py-4 border-t">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                />
              </PaginationItem>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <PaginationItem key={page}>
                  <PaginationLink 
                    isActive={currentPage === page}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}
              
              <PaginationItem>
                <PaginationNext 
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
      
      {/* 确认暂停向量化 */}
      {showPauseConfirm && (
        <PauseConfirmDialog 
          confirmPauseVectorize={confirmPauseVectorize}
          cancelPauseVectorize={cancelPauseVectorize}
          getFileName={getFileName}
          showPauseConfirm={showPauseConfirm}
        />
      )}
    </div>
  );
};

export default FilesList;