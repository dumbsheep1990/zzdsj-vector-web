import React, { useState } from 'react';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '../../../components/ui/Table';
import { FileItem as FileItemType } from '../../../utils/types';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '../../../components/ui/Pagination';
import { Checkbox } from '../../../components/ui/Checkbox';
import FileItemComponent from './FileItem';
import EmptyState from './EmptyState';
import PauseConfirmDialog from './PauseConfirmDialog';
import FileDetailPanel from './FileDetailPanel';

interface FilesListProps {
  files: FileItemType[];
  selectedItem: FileItemType | null;
  setSelectedItem: (item: FileItemType | null) => void;
  selectedItems: string[];
  setSelectedItems: React.Dispatch<React.SetStateAction<string[]>>;
}

const FilesList: React.FC<FilesListProps> = ({ files, selectedItem, setSelectedItem, selectedItems, setSelectedItems }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedFolders, setExpandedFolders] = useState<string[]>([]);
  const [vectorizeSettingsChanged, setVectorizeSettingsChanged] = useState<Record<string, boolean>>({});
  const [showPauseConfirm, setShowPauseConfirm] = useState<string | null>(null);
  const [fileStatuses, setFileStatuses] = useState<Record<string, string>>({});
  const [activeDetailFile, setActiveDetailFile] = useState<FileItemType | null>(null);
  const itemsPerPage = 10;

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

  // Handle item selection
  const handleItemSelection = (itemId: string, isSelected: boolean) => {
    if (isSelected) {
      setSelectedItems(prev => [...prev, itemId]);
    } else {
      setSelectedItems(prev => prev.filter(id => id !== itemId));
    }
  };

  // Handle select all
  const handleSelectAll = () => {
    if (selectedItems.length === filteredFiles.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredFiles.map(file => file.id || ''));
    }
  };

  // Filter files based on active tab
  const filterFilesByType = (files: FileItemType[]): FileItemType[] => {
    // Removed activeTab variable and its usage
    return files;
  };

  const filteredFiles = filterFilesByType(files);

  // Update file status
  const updateFileStatus = (fileId: string, status: string) => {
    setFileStatuses(prev => ({
      ...prev,
      [fileId]: status
    }));
  };

  const getFileStatus = (fileId: string | null) => {
    if (!fileId) return 'pending';
    return fileStatuses[fileId] || 'pending';
  };

  // Start vectorization for a file
  const handleStartVectorize = (fileId: string) => {
    updateFileStatus(fileId, 'processing');
    
    // Simulate vectorization process
    setTimeout(() => {
      updateFileStatus(fileId, 'completed');
    }, 3000);
  };

  // Pause vectorization for a file
  const handlePauseVectorize = (fileId: string) => {
    setShowPauseConfirm(fileId);
  };

  // Toggle vectorize settings
  const handleToggleSettings = (fileId: string) => {
    setVectorizeSettingsChanged(prev => ({
      ...prev,
      [fileId]: !prev[fileId]
    }));
  };

  // Render a file or folder item
  const renderFileItem = (item: FileItemType, depth = 0) => {
    const isExpanded = expandedFolders.includes(item.id || '');
    const isSelected = selectedItems.includes(item.id || '');
    
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
        handleStartVectorize={handleStartVectorize}
        handlePauseVectorize={handlePauseVectorize}
        toggleVectorizeSettings={handleToggleSettings}
        renderFileItem={renderFileItem}
        isSelected={isSelected}
        onSelectionChange={handleItemSelection}
        onShowDetails={(file) => setActiveDetailFile(file)}
      />
    );
  };

  // Calculate pagination
  const totalPages = Math.ceil(filteredFiles.length / itemsPerPage);
  const paginatedFiles = filteredFiles.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // If there are no files to display
  if (files.length === 0) {
    return (
      <EmptyState />
    );
  }

  return (
    <div className="flex flex-col h-full relative">
      {/* Overlay when detail panel is open */}
      {activeDetailFile && (
        <div 
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-10"
          onClick={() => setActiveDetailFile(null)}
        />
      )}
      
      {/* Main Content */}
      <div className={`flex h-full relative ${activeDetailFile ? 'opacity-70' : ''}`}>
        {/* Files List */}
        <div 
          className="overflow-auto w-full"
        >
          <Table>
            <TableHeader className="bg-gray-50 sticky top-0 z-10">
              <TableRow>
                <TableHead className="w-5/12 text-left pl-4 py-4 h-14">
                  <span>名称</span>
                </TableHead>
                <TableHead className="w-1/12 text-center py-4 h-14">类型</TableHead>
                <TableHead className="w-1/12 text-center py-4 h-14">大小</TableHead>
                <TableHead className="w-2/12 text-center py-4 h-14">日期</TableHead>
                <TableHead className="w-1/12 text-center py-4 h-14">状态</TableHead>
                <TableHead className="w-1/12 text-center py-4 h-14">操作</TableHead>
                <TableHead className="w-1/12 text-center py-4 h-14">
                  <Checkbox 
                    checked={selectedItems.length === filteredFiles.length && filteredFiles.length > 0}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedFiles.map(item => renderFileItem(item))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* File Detail Panel (Fixed Positioned) */}
      {activeDetailFile && (
        <div className="fixed top-0 right-0 h-full w-1/2 z-20 shadow-2xl rounded-l-2xl overflow-hidden">
          <FileDetailPanel 
            file={activeDetailFile} 
            onClose={() => setActiveDetailFile(null)} 
            fileStatus={getFileStatus(activeDetailFile.id)}
            onStartVectorize={handleStartVectorize}
            onPauseVectorize={handlePauseVectorize}
            onToggleSettings={handleToggleSettings}
          />
        </div>
      )}

      {/* Pagination */}
      <div className="mt-auto pt-4 border-t border-gray-200">
        {totalPages > 1 && (
          <div className="p-2 border-t bg-white">
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
                      onClick={() => setCurrentPage(page)}
                      isActive={currentPage === page}
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
      </div>

      {/* Pause Confirmation Dialog */}
      {showPauseConfirm && (
        <PauseConfirmDialog 
          isOpen={!!showPauseConfirm}
          onClose={() => setShowPauseConfirm(null)}
          onConfirm={() => {
            if (showPauseConfirm) {
              updateFileStatus(showPauseConfirm, 'paused');
              setShowPauseConfirm(null);
            }
          }}
        />
      )}
    </div>
  );
};

export default FilesList;