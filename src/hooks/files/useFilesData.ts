import { useState, useEffect, useCallback, useMemo } from 'react';
import { FileItem } from '../../utils/types';
import { useAPI } from '../common/useAPI';
import { useList } from '../common/useList';
import { message } from 'antd';

// 定义文件分类类型
export type FileCategory = 'document' | 'image' | 'video' | 'audio' | 'spreadsheet' | 'folder' | 'other';

// 定义文件状态类型
export type FileStatus = '已向量化' | '处理中' | '待处理' | '暂停' | '失败' | '';

// 定义文件筛选选项
export interface FileFilterOptions {
  searchQuery: string;
  category: FileCategory | 'all';
  parentId: string | null;
  status?: FileStatus;
  dateRange?: [Date, Date];
}

// 模拟获取文件列表的API函数
const fetchFilesAPI = async (): Promise<FileItem[]> => {
  // 模拟网络请求延迟
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // 返回模拟数据
  return [
    { id: '1', name: '文档', type: 'folder', size: '-', date: '2023-10-15', category: 'folder', status: '', isFolder: true, parentId: null, path: '/文档' },
    { id: '2', name: '图片', type: 'folder', size: '-', date: '2023-10-15', category: 'folder', status: '', isFolder: true, parentId: null, path: '/图片' },
    { id: '3', name: '报告.pdf', type: 'PDF', size: '2.5MB', date: '2023-10-14', category: 'document', status: '已向量化', isFolder: false, parentId: null, path: '/报告.pdf' },
    { id: '4', name: '数据分析.xlsx', type: 'Excel', size: '1.8MB', date: '2023-10-13', category: 'spreadsheet', status: '处理中', isFolder: false, parentId: null, path: '/数据分析.xlsx' },
    { id: '5', name: '会议记录.docx', type: 'Word', size: '500KB', date: '2023-10-12', category: 'document', status: '', isFolder: false, parentId: '1', path: '/文档/会议记录.docx' },
    { id: '6', name: '产品设计', type: 'folder', size: '-', date: '2023-10-11', category: 'folder', status: '', isFolder: true, parentId: '1', path: '/文档/产品设计' },
    { id: '7', name: '设计稿.png', type: 'PNG', size: '3.2MB', date: '2023-10-10', category: 'image', status: '已向量化', isFolder: false, parentId: '2', path: '/图片/设计稿.png' },
  ];
};

/**
 * 文件数据管理Hook
 * 
 * 负责文件数据的加载、筛选和状态管理
 * 
 * @returns {object} 包含文件数据和操作方法的对象
 */
export const useFilesData = () => {
  // 使用通用API hook处理数据获取
  const {
    data: filesData,
    loading: isLoading,
    error: fetchError,
    execute: fetchFiles
  } = useAPI<void, FileItem[]>(fetchFilesAPI);
  
  // 使用通用列表hook管理文件数据
  const {
    items: files,
    setItems: setFiles,
    addItem: addFile,
    updateItem: updateFileInList,
    removeItem: removeFileFromList,
    setSort,
    clearSort,
    addFilter,
    removeFilter,
    clearFilters
  } = useList<FileItem>([]);
  
  // 文件选择状态
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [selectedItemIds, setSelectedItemIds] = useState<string[]>([]);
  
  // 文件筛选选项
  const [filterOptions, setFilterOptions] = useState<FileFilterOptions>({
    searchQuery: '',
    category: 'all',
    parentId: null
  });
  
  // 文件夹展开状态
  const [expandedFolderIds, setExpandedFolderIds] = useState<string[]>([]);
  
  // 文件处理状态
  const [fileStatuses, setFileStatuses] = useState<Record<string, FileStatus>>({});
  
  // 初始加载数据
  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);
  
  // 当API数据更新时，更新列表
  useEffect(() => {
    if (filesData) {
      setFiles(filesData);
    }
  }, [filesData, setFiles]);
  
  // 获取选中的文件
  const selectedItem = useMemo(() => 
    files.find(file => file.id === selectedItemId) || null, 
    [files, selectedItemId]
  );
  
  // 获取当前文件夹的子文件
  const currentFolderChildren = useMemo(() => {
    const { parentId } = filterOptions;
    return files.filter(file => file.parentId === parentId);
  }, [files, filterOptions]);
  
  // 获取文件路径信息
  const getPathInfo = useCallback((targetFolder: string | null) => {
    if (!targetFolder) {
      return { path: '/', pathItems: [] };
    }
    
    const pathItems: FileItem[] = [];
    let currentFolder: FileItem | undefined;
    let path = '';
    
    // 查找目标文件夹
    currentFolder = files.find(file => file.id === targetFolder);
    
    if (currentFolder) {
      pathItems.unshift(currentFolder);
      path = currentFolder.path;
      
      // 向上查找父文件夹
      let parentId = currentFolder.parentId;
      while (parentId) {
        const parent = files.find(file => file.id === parentId);
        if (parent) {
          pathItems.unshift(parent);
          parentId = parent.parentId;
        } else {
          break;
        }
      }
    }
    
    return { path, pathItems };
  }, [files]);
  
  // 文件选择操作
  const selectItem = useCallback((itemId: string | null) => {
    setSelectedItemId(itemId);
  }, []);
  
  // 切换多选
  const toggleSelectItem = useCallback((itemId: string) => {
    setSelectedItemIds(prev => {
      if (prev.includes(itemId)) {
        return prev.filter(id => id !== itemId);
      } else {
        return [...prev, itemId];
      }
    });
  }, []);
  
  // 全选/取消全选
  const toggleSelectAll = useCallback(() => {
    if (selectedItemIds.length === currentFolderChildren.length) {
      setSelectedItemIds([]);
    } else {
      setSelectedItemIds(currentFolderChildren.map(file => file.id || ''));
    }
  }, [selectedItemIds, currentFolderChildren]);
  
  // 清除所有选择
  const clearSelection = useCallback(() => {
    setSelectedItemIds([]);
    setSelectedItemId(null);
  }, []);
  
  // 获取文件状态
  const getFileStatus = useCallback((fileId: string): FileStatus => {
    return fileStatuses[fileId] || '';
  }, [fileStatuses]);
  
  // 更新文件状态
  const updateFileStatus = useCallback((fileId: string, status: FileStatus) => {
    setFileStatuses(prev => ({
      ...prev,
      [fileId]: status
    }));
    
    // 同时更新文件列表中的状态
    updateFileInList(
      file => file.id === fileId,
      { status } as Partial<FileItem>
    );
  }, [updateFileInList]);
  
  // 切换文件夹展开状态
  const toggleFolderExpand = useCallback((folderId: string) => {
    setExpandedFolderIds(prev => {
      if (prev.includes(folderId)) {
        return prev.filter(id => id !== folderId);
      } else {
        return [...prev, folderId];
      }
    });
  }, []);
  
  // 展开某个文件夹
  const expandFolder = useCallback((folderId: string) => {
    setExpandedFolderIds(prev => {
      if (!prev.includes(folderId)) {
        return [...prev, folderId];
      }
      return prev;
    });
  }, []);
  
  // 导航到某个文件夹
  const navigateToFolder = useCallback((folderId: string | null) => {
    setFilterOptions(prev => ({
      ...prev,
      parentId: folderId
    }));
    
    // 如果选中了文件夹，则展开它
    if (folderId) {
      expandFolder(folderId);
    }
    
    // 清除选择
    clearSelection();
  }, [expandFolder, clearSelection]);
  
  // 获取当前面包屑导航
  const breadcrumbs = useMemo(() => {
    const { pathItems } = getPathInfo(filterOptions.parentId);
    return [
      { id: null, name: '根目录', path: '/' },
      ...pathItems
    ];
  }, [filterOptions.parentId, getPathInfo]);
  
  // 设置搜索查询
  const setSearchQuery = useCallback((query: string) => {
    setFilterOptions(prev => ({
      ...prev,
      searchQuery: query
    }));
  }, []);
  
  // 设置分类筛选
  const setCategoryFilter = useCallback((category: FileCategory | 'all') => {
    setFilterOptions(prev => ({
      ...prev,
      category
    }));
  }, []);
  
  // 应用筛选获取文件列表
  const filteredFiles = useMemo(() => {
    const { searchQuery, category, parentId } = filterOptions;
    
    return files.filter(file => {
      // 如果是当前文件夹的直接子文件或需要显示所有文件
      const matchesParent = parentId === null 
        ? file.parentId === null 
        : file.parentId === parentId;
      
      // 搜索查询匹配
      const matchesSearch = !searchQuery || 
        file.name.toLowerCase().includes(searchQuery.toLowerCase());
      
      // 分类匹配或为文件夹（文件夹始终显示）
      const matchesCategory = category === 'all' || 
        file.category === category || 
        file.isFolder;
      
      return matchesParent && matchesSearch && matchesCategory;
    });
  }, [files, filterOptions]);
  
  // 刷新文件列表
  const refreshFiles = useCallback(() => {
    return fetchFiles();
  }, [fetchFiles]);
  
  return {
    // 数据
    files,
    filteredFiles,
    currentFolderChildren,
    selectedItem,
    selectedItemId,
    selectedItemIds,
    expandedFolderIds,
    breadcrumbs,
    
    // 加载状态
    isLoading,
    error: fetchError,
    
    // 文件选择操作
    selectItem,
    toggleSelectItem,
    toggleSelectAll,
    clearSelection,
    
    // 文件状态管理
    getFileStatus,
    updateFileStatus,
    
    // 文件夹操作
    toggleFolderExpand,
    expandFolder,
    navigateToFolder,
    
    // 筛选和查询
    setSearchQuery,
    setCategoryFilter,
    
    // 其他操作
    refreshFiles,
    addFile,
    updateFileInList,
    removeFileFromList
  };
};
