import React from 'react';
import { TableRow, TableCell } from '../../../components/ui/Table';
import { Button } from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';
import { ChevronRight, ChevronDown, AlertCircle } from 'lucide-react';
import { FileItem as FileItemType } from '../../../utils/types';
import FileStatusBadge from './FileStatusBadge';
import FileActionButtons from './FileActionButtons';
import FolderActionButtons from './FolderActionButtons';
import FileIcon from './FileIcon';

interface FileItemProps {
  item: FileItemType;
  depth?: number;
  isExpanded: boolean;
  selectedItem: FileItemType | null;
  fileStatuses: Record<string, string>;
  vectorizeSettingsChanged: Record<string, boolean>;
  toggleFolder: (folderId: string) => void;
  setSelectedItem: (item: FileItemType | null) => void;
  handleFolderClick: (folder: FileItemType, e: React.MouseEvent) => void;
  handleStartVectorize: (fileId: string, e: React.MouseEvent) => void;
  handlePauseVectorize: (fileId: string, e: React.MouseEvent) => void;
  toggleVectorizeSettings: (fileId: string, e: React.MouseEvent) => void;
  renderFileItem: (item: FileItemType, depth?: number) => React.ReactNode;
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
  handleFolderClick,
  handleStartVectorize,
  handlePauseVectorize,
  toggleVectorizeSettings,
  renderFileItem
}) => {
  const childrenExist = item.children && item.children.length > 0;

  return (
    <React.Fragment key={item.id || `temp-${Math.random()}`}>
      <TableRow 
        className={`border-b hover:bg-gray-50 transition-colors cursor-pointer ${selectedItem?.id === item.id ? 'bg-blue-50' : ''}`}
        onClick={() => setSelectedItem(item)}
      >
        <TableCell>
          <Checkbox 
            checked={selectedItem?.id === item.id}
            onCheckedChange={() => setSelectedItem(item)}
            onClick={(e) => e.stopPropagation()}
            className="border-gray-300"
          />
        </TableCell>
        <TableCell>
          <div className="flex items-center">
            <div style={{ width: `${depth * 20}px` }} className="flex items-center"></div>
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
            <div 
              className="flex items-center cursor-pointer"
              onClick={(e) => item.isFolder && handleFolderClick(item, e)}
            >
              <div className="mr-2">
                <FileIcon item={item} />
              </div>
              <div className="flex items-center">
                <span className={`${selectedItem?.id === item.id ? 'font-medium' : ''}`}>
                  {item.name}
                </span>
              </div>
            </div>
          </div>
        </TableCell>
        <TableCell className="text-gray-600">{item.type}</TableCell>
        <TableCell className="text-gray-600">{item.size}</TableCell>
        <TableCell>
          <FileStatusBadge 
            status={item.status || ''} 
            fileStatus={fileStatuses[item.id || ''] || ''} 
            isFolder={item.isFolder} 
          />
        </TableCell>
        <TableCell className="text-gray-600">{item.date}</TableCell>
        <TableCell>
          {!item.isFolder ? (
            <FileActionButtons 
              item={item}
              fileStatus={fileStatuses[item.id || ''] || ''}
              vectorizeSettingsChanged={vectorizeSettingsChanged[item.id || ''] || false}
              handleStartVectorize={handleStartVectorize}
              handlePauseVectorize={handlePauseVectorize}
              toggleVectorizeSettings={toggleVectorizeSettings}
            />
          ) : (
            <FolderActionButtons 
              onNewFolderClick={(e) => e.stopPropagation()}
              onSettingsClick={(e) => e.stopPropagation()}
              onDeleteClick={(e) => e.stopPropagation()}
            />
          )}
        </TableCell>
      </TableRow>

      {/* Render children if folder is expanded */}
      {item.isFolder && isExpanded && childrenExist && (
        item.children!.map(child => renderFileItem(child, depth + 1))
      )}

      {/* Show empty folder message */}
      {item.isFolder && isExpanded && (!item.children || item.children.length === 0) && (
        <TableRow>
          <TableCell colSpan={7} className="py-4 text-center text-gray-500">
            <div className="flex items-center justify-center">
              <AlertCircle className="h-4 w-4 mr-2 text-gray-400" />
              <span>该文件夹为空</span>
            </div>
          </TableCell>
        </TableRow>
      )}
    </React.Fragment>
  );
};

export default FileItemComponent;
