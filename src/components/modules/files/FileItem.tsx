import React from 'react';
import { TableRow, TableCell } from '../../../components/ui/Table';
import { Button } from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';
import { ChevronRight, ChevronDown } from 'lucide-react';
import { FileItem as FileItemType } from '../../../utils/types';
import FileStatusBadge from './FileStatusBadge';
import FileActionButtons from './FileActionButtons';
import FolderActionButtons from './FolderActionButtons';
import FileIcon from './FileIcon';

interface FileItemProps {
  item: FileItemType;
  depth?: number;
  isExpanded?: boolean;
  selectedItem: FileItemType | null;
  fileStatuses: Record<string, string>;
  vectorizeSettingsChanged: Record<string, boolean>;
  toggleFolder: (folderId: string) => void;
  setSelectedItem: (item: FileItemType | null) => void;
  handleStartVectorize: (fileId: string) => void;
  handlePauseVectorize: (fileId: string) => void;
  toggleVectorizeSettings: (fileId: string) => void;
  renderFileItem: (item: FileItemType, depth?: number) => React.ReactNode;
  isSelected?: boolean;
  onSelectionChange: (itemId: string, isSelected: boolean) => void;
  onShowDetails?: (file: FileItemType) => void;
}

const FileItemComponent: React.FC<FileItemProps> = ({
  item,
  depth = 0,
  isExpanded,
  selectedItem,
  fileStatuses,
  vectorizeSettingsChanged,
  toggleFolder,
  setSelectedItem,
  handleStartVectorize,
  handlePauseVectorize,
  toggleVectorizeSettings,
  renderFileItem,
  isSelected = false,
  onSelectionChange,
  onShowDetails
}) => {
  // Handle row click based on item type
  const handleRowClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (item.isFolder) {
      // For folders, toggle expansion
      toggleFolder(item.id || '');
    } else {
      // For files, show details in the side panel
      if (onShowDetails) {
        onShowDetails(item);
      }
    }
  };

  // Handle checkbox change
  const handleCheckboxChange = (checked: boolean) => {
    if (onSelectionChange && item.id) {
      onSelectionChange(item.id, checked);
    }
    // Still keep the legacy selection for compatibility
    if (checked) {
      setSelectedItem(item);
    } else if (selectedItem?.id === item.id) {
      setSelectedItem(null);
    }
  };

  // Calculate file size in KB
  const getFileSizeInKB = (sizeInBytes: number | string | undefined): string => {
    if (!sizeInBytes) return '-';
    // 确保 sizeInBytes 是数字类型
    const size = typeof sizeInBytes === 'string' ? parseInt(sizeInBytes, 10) : sizeInBytes;
    return `${Math.floor(size / 1024)} KB`;
  };

  return (
    <React.Fragment key={item.id || `temp-${Math.random()}`}>
      <TableRow 
        className={`border-b hover:bg-gray-50 transition-colors cursor-pointer ${selectedItem?.id === item.id ? 'bg-blue-50' : ''} ${isSelected ? 'bg-blue-50' : ''}`}
        onClick={handleRowClick}
      >
        <TableCell className="p-0 w-5/12">
          <div className="flex items-center justify-start pl-2">
            <div style={{ width: `${depth * 20}px` }} className="flex-shrink-0"></div>
            {item.isFolder && (
              <Button 
                variant="ghost" 
                size="sm"
                className="p-0 mr-2 rounded-full hover:bg-gray-200 transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFolder(item.id || '');
                }}
              >
                {isExpanded ? 
                  <ChevronDown className="h-4 w-4 text-gray-500" /> : 
                  <ChevronRight className="h-4 w-4 text-gray-500" />}
              </Button>
            )}
            <div className="flex items-center">
              <div className="mr-2 flex-shrink-0">
                <FileIcon item={item} />
              </div>
              <span className="font-medium truncate">{item.name}</span>
            </div>
          </div>
        </TableCell>
        <TableCell className="text-center w-1/12">{item.type || '-'}</TableCell>
        <TableCell className="text-center w-1/12">{getFileSizeInKB(item.size)}</TableCell>
        <TableCell className="text-center w-2/12">{item.date || '-'}</TableCell>
        <TableCell className="text-center w-1/12">
          {!item.isFolder && (
            <FileStatusBadge status={fileStatuses[item.id || ''] || 'pending'} />
          )}
        </TableCell>
        <TableCell className="text-center w-1/12">
          {item.isFolder ? (
            <FolderActionButtons folder={item} />
          ) : (
            <FileActionButtons 
              file={item} 
              status={fileStatuses[item.id || ''] || 'pending'}
              settingsChanged={vectorizeSettingsChanged[item.id || ''] || false}
              onStartVectorize={() => handleStartVectorize(item.id || '')}
              onPauseVectorize={() => handlePauseVectorize(item.id || '')}
              onToggleSettings={() => toggleVectorizeSettings(item.id || '')}
            />
          )}
        </TableCell>
        <TableCell className="text-center w-1/12">
          <Checkbox 
            id={`select-${item.id}`}
            checked={isSelected}
            onCheckedChange={handleCheckboxChange}
            onClick={(e) => e.stopPropagation()}
            className="flex-shrink-0 mx-auto"
          />
        </TableCell>
      </TableRow>

      {/* Render children if folder is expanded */}
      {item.isFolder && isExpanded && item.children && item.children.map(child => (
        renderFileItem(child, depth + 1)
      ))}
    </React.Fragment>
  );
};

export default FileItemComponent;
