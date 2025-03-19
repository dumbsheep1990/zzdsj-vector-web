import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/Table';
import { Button } from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';
import { Badge } from '../../../components/ui/Badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../../../components/ui/DropdownMenu';
import { MoreHorizontal, ChevronRight, ChevronDown, Folder, FileText } from 'lucide-react';
import { FileItem } from '../../../utils/types';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '../../../components/ui/Pagination';

interface FilesListProps {
  files: FileItem[];
  selectedItem: FileItem | null;
  setSelectedItem: (item: FileItem | null) => void;
  onFolderClick: (folderId: string | null) => void;
}

const FilesList: React.FC<FilesListProps> = ({ files, selectedItem, setSelectedItem, onFolderClick }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({});
  const itemsPerPage = 10;

  // Build a hierarchical structure from the flat files list
  const buildFileHierarchy = (files: FileItem[]): FileItem[] => {
    const fileMap = new Map<string, FileItem>();
    const rootItems: FileItem[] = [];

    // First pass: create a map of all items by ID
    files.forEach(item => {
      if (item.id !== null) {
        fileMap.set(item.id, {...item, children: []});
      }
    });

    // Second pass: build the hierarchy
    files.forEach(item => {
      if (item.parentId === null) {
        if (item.id !== null) {
          rootItems.push(fileMap.get(item.id)!);
        }
      } else {
        const parent = fileMap.get(item.parentId);
        if (parent && item.id !== null) {
          parent.children = parent.children || [];
          parent.children.push(fileMap.get(item.id)!);
        }
      }
    });

    return rootItems;
  };

  // Toggle folder expansion
  const toggleFolder = (folderId: string | null, e: React.MouseEvent) => {
    e.stopPropagation();
    if (folderId !== null) {
      setExpandedFolders(prev => ({
        ...prev,
        [folderId]: !prev[folderId]
      }));
    }
  };

  // Handle folder click
  const handleFolderClick = (folder: FileItem, e: React.MouseEvent) => {
    e.stopPropagation();
    onFolderClick(folder.id);
  };

  // Flatten the hierarchy for display based on expanded state
  const getFlattenedItems = (items: FileItem[], depth = 0, result: {item: FileItem, depth: number}[] = []) => {
    items.forEach(item => {
      result.push({item, depth});
      
      if (item.isFolder && item.id !== null && expandedFolders[item.id] && item.children && item.children.length > 0) {
        getFlattenedItems(item.children, depth + 1, result);
      }
    });
    
    return result;
  };

  const hierarchicalFiles = buildFileHierarchy(files);
  const flattenedItems = getFlattenedItems(hierarchicalFiles);
  
  // Pagination logic
  const totalPages = Math.ceil(flattenedItems.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedItems = flattenedItems.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="flex flex-col h-full rounded-lg overflow-hidden">
      <div className="overflow-auto flex-grow">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead className="w-12"></TableHead>
              <TableHead>文件名</TableHead>
              <TableHead>类型</TableHead>
              <TableHead>大小</TableHead>
              <TableHead>日期</TableHead>
              <TableHead>状态</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedItems.map(({item, depth}) => (
              <TableRow 
                key={item.id || `temp-${Math.random()}`}
                className={`${selectedItem?.id === item.id ? 'bg-blue-50' : ''} hover:bg-gray-50 cursor-pointer`}
                onClick={() => setSelectedItem(item)}
              >
                <TableCell>
                  <Checkbox 
                    checked={selectedItem?.id === item.id} 
                    onCheckedChange={() => setSelectedItem(item)}
                    onClick={(e) => e.stopPropagation()}
                  />
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <div style={{ width: `${depth * 20}px` }}></div>
                    {item.isFolder && item.children && item.children.length > 0 && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="p-0 mr-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFolder(item.id, e);
                        }}
                      >
                        {item.id !== null && expandedFolders[item.id] ? 
                          <ChevronDown className="h-4 w-4" /> : 
                          <ChevronRight className="h-4 w-4" />}
                      </Button>
                    )}
                    <div 
                      className="flex items-center"
                      onClick={(e) => item.isFolder && handleFolderClick(item, e)}
                    >
                      {item.isFolder ? 
                        <Folder className="h-5 w-5 mr-2 text-blue-500" /> : 
                        <FileText className="h-5 w-5 mr-2 text-gray-500" />}
                      <span className="font-medium">{item.name}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{item.type}</TableCell>
                <TableCell>{item.size}</TableCell>
                <TableCell>{item.date}</TableCell>
                <TableCell>
                  {!item.isFolder && (
                    <Badge variant={item.status === '已向量化' ? 'default' : 
                                  item.status === '处理中' ? 'secondary' : 'outline'}
                    >
                      {item.status}
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0" onClick={(e) => e.stopPropagation()}>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {item.isFolder ? (
                        <>
                          <DropdownMenuItem>新建文件夹</DropdownMenuItem>
                          <DropdownMenuItem>上传文件</DropdownMenuItem>
                          <DropdownMenuItem>重命名</DropdownMenuItem>
                          <DropdownMenuItem>删除</DropdownMenuItem>
                        </>
                      ) : (
                        <>
                          <DropdownMenuItem>查看详情</DropdownMenuItem>
                          <DropdownMenuItem>下载</DropdownMenuItem>
                          <DropdownMenuItem>向量化</DropdownMenuItem>
                          <DropdownMenuItem>删除</DropdownMenuItem>
                        </>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      <div className="py-4 bg-white border-t">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
              />
            </PaginationItem>
            
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNumber;
              if (totalPages <= 5) {
                pageNumber = i + 1;
              } else if (currentPage <= 3) {
                pageNumber = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNumber = totalPages - 4 + i;
              } else {
                pageNumber = currentPage - 2 + i;
              }
              
              return (
                <PaginationItem key={pageNumber}>
                  <PaginationLink 
                    isActive={currentPage === pageNumber}
                    onClick={() => setCurrentPage(pageNumber)}
                  >
                    {pageNumber}
                  </PaginationLink>
                </PaginationItem>
              );
            })}
            
            <PaginationItem>
              <PaginationNext 
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
};

export default FilesList;