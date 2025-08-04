import React from 'react';
import { TableRow, TableCell } from '../../../components/ui/Table';
import { Button } from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';
import { ChevronRight, ChevronDown, Database, FileText, Layers3, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { FileItem as FileItemType } from '../../../utils/types';
import FileStatusBadge from './FileStatusBadge';
import FileActionButtons from './FileActionButtons';
import FolderActionButtons from './FolderActionButtons';
import FileIcon from './FileIcon';
import { MiniProgressIndicator, ProgressStatus } from '../../common/ProgressIndicator';

// 扩展的文件项接口
interface EnhancedFileItem extends FileItemType {
  processingProgress?: number;
  processingStage?: string;
  processingMessage?: string;
  processingStatus?: 'idle' | 'processing' | 'completed' | 'error';
  taskId?: string;
  totalChunks?: number;
  processedChunks?: number;
  chunkStrategy?: string;
  chunkSize?: number;
  chunkOverlap?: number;
  vectorized?: boolean;
  vectorDimensions?: number;
  embeddingModel?: string;
  processingStartTime?: Date;
  processingEndTime?: Date;
  estimatedTimeRemaining?: number;
}

interface EnhancedFileItemProps {
  item: EnhancedFileItem;
  depth?: number;
  isExpanded?: boolean;
  selectedItem: FileItemType | null;
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
  isProcessing?: boolean;
}

/**
 * 增强版文件项组件
 * 显示切分块数、处理进度和实时状态
 */
const EnhancedFileItem: React.FC<EnhancedFileItemProps> = ({
  item,
  depth = 0,
  isExpanded,
  selectedItem,
  vectorizeSettingsChanged,
  toggleFolder,
  setSelectedItem,
  handleStartVectorize,
  handlePauseVectorize,
  toggleVectorizeSettings,
  renderFileItem,
  isSelected = false,
  onSelectionChange,
  onShowDetails,
  isProcessing = false
}) => {
  // 处理行点击
  const handleRowClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (item.isFolder) {
      toggleFolder(item.id || '');
    } else {
      if (onShowDetails) {
        onShowDetails(item);
      }
    }
  };

  // 处理复选框变化
  const handleCheckboxChange = (checked: boolean) => {
    if (onSelectionChange && item.id) {
      onSelectionChange(item.id, checked);
    }
    if (checked) {
      setSelectedItem(item);
    } else if (selectedItem?.id === item.id) {
      setSelectedItem(null);
    }
  };

  // 计算文件大小
  const getFileSizeInKB = (sizeInBytes: number | string | undefined): string => {
    if (!sizeInBytes) return '-';
    const size = typeof sizeInBytes === 'string' ? parseInt(sizeInBytes, 10) : sizeInBytes;
    return `${Math.floor(size / 1024)} KB`;
  };

  // 格式化块信息
  const getChunkInfo = () => {
    if (item.isFolder) return '-';
    
    const { totalChunks = 0, processedChunks = 0, chunkStrategy, chunkSize } = item;
    
    if (totalChunks === 0) {
      return (
        <div className="text-gray-400 text-xs">
          未处理
        </div>
      );
    }
    
    return (
      <div className="text-center">
        <div className="flex items-center justify-center space-x-1">
          <Layers3 className="w-3 h-3 text-blue-500" />
          <span className="text-sm font-medium">
            {processedChunks}/{totalChunks}
          </span>
        </div>
        
        {chunkStrategy && (
          <div className="text-xs text-gray-500 mt-1">
            {chunkStrategy === 'token_based' ? 'Token分块' : 
             chunkStrategy === 'semantic' ? '语义分块' : 
             chunkStrategy === 'smart' ? '智能分块' : chunkStrategy}
          </div>
        )}
        
        {chunkSize && (
          <div className="text-xs text-gray-400">
            {chunkSize} tokens
          </div>
        )}
      </div>
    );
  };

  // 获取进度信息
  const getProgressInfo = () => {
    if (item.isFolder) return null;
    
    const { 
      processingStatus = 'idle', 
      processingProgress = 0, 
      processingStage, 
      processingMessage 
    } = item;
    
    if (processingStatus === 'idle') {
      return (
        <div className="text-center text-gray-400 text-xs">
          等待处理
        </div>
      );
    }
    
    const progressStatus: ProgressStatus = 
      processingStatus === 'completed' ? 'completed' :
      processingStatus === 'error' ? 'error' :
      processingStatus === 'processing' ? 'processing' : 'idle';
    
    return (
      <div className="space-y-1">
        <MiniProgressIndicator
          progress={processingProgress}
          status={progressStatus}
          className="w-full"
        />
        
        {processingStage && (
          <div className="flex items-center justify-center space-x-1">
            {processingStage === 'extract' && <FileText className="w-3 h-3 text-blue-500" />}
            {processingStage === 'chunk' && <Layers3 className="w-3 h-3 text-purple-500" />}
            {processingStage === 'embed' && <Database className="w-3 h-3 text-green-500" />}
            {processingStage === 'store' && <Database className="w-3 h-3 text-orange-500" />}
            {processingStage === 'finalize' && <CheckCircle2 className="w-3 h-3 text-green-600" />}
            <span className="text-xs text-gray-600">
              {processingStage === 'extract' ? '提取' :
               processingStage === 'chunk' ? '分块' :
               processingStage === 'embed' ? '向量化' :
               processingStage === 'store' ? '存储' :
               processingStage === 'finalize' ? '完成' : processingStage}
            </span>
          </div>
        )}
        
        {processingMessage && (
          <div className="text-xs text-gray-500 text-center truncate">
            {processingMessage}
          </div>
        )}
      </div>
    );
  };

  // 获取文件状态显示
  const getStatusDisplay = () => {
    if (item.isFolder) return null;
    
    const { processingStatus = 'idle', vectorized = false } = item;
    
    if (processingStatus === 'processing') {
      return (
        <div className="flex items-center justify-center">
          <div className="flex items-center space-x-1 text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
            <Clock className="w-3 h-3 animate-pulse" />
            <span className="text-xs">处理中</span>
          </div>
        </div>
      );
    }
    
    if (processingStatus === 'completed' && vectorized) {
      return (
        <div className="flex items-center justify-center">
          <div className="flex items-center space-x-1 text-green-600 bg-green-50 px-2 py-1 rounded-full">
            <CheckCircle2 className="w-3 h-3" />
            <span className="text-xs">已完成</span>
          </div>
        </div>
      );
    }
    
    if (processingStatus === 'error') {
      return (
        <div className="flex items-center justify-center">
          <div className="flex items-center space-x-1 text-red-600 bg-red-50 px-2 py-1 rounded-full">
            <AlertCircle className="w-3 h-3" />
            <span className="text-xs">错误</span>
          </div>
        </div>
      );
    }
    
    return (
      <div className="flex items-center justify-center">
        <FileStatusBadge status="pending" />
      </div>
    );
  };

  // 行样式
  const rowClassName = `
    border-b hover:bg-gray-50 transition-colors cursor-pointer 
    ${selectedItem?.id === item.id ? 'bg-blue-50' : ''} 
    ${isSelected ? 'bg-blue-50' : ''}
    ${isProcessing ? 'bg-blue-25 border-l-4 border-l-blue-500' : ''}
  `.trim();

  return (
    <React.Fragment key={item.id || `temp-${Math.random()}`}>
      <TableRow className={rowClassName} onClick={handleRowClick}>
        {/* 名称列 */}
        <TableCell className="p-0 w-4/12">
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
              <div className="flex flex-col">
                <span className="font-medium truncate">{item.name}</span>
                
                {/* 显示任务ID和处理时间 */}
                {!item.isFolder && item.taskId && (
                  <div className="text-xs text-gray-400">
                    任务: {item.taskId.slice(-8)}
                    {item.processingStartTime && (
                      <span className="ml-2">
                        开始: {item.processingStartTime.toLocaleTimeString()}
                      </span>
                    )}
                  </div>
                )}
                
                {/* 显示向量化信息 */}
                {!item.isFolder && item.vectorized && item.embeddingModel && (
                  <div className="text-xs text-gray-500 flex items-center space-x-1">
                    <Database className="w-3 h-3" />
                    <span>{item.embeddingModel}</span>
                    {item.vectorDimensions && (
                      <span>({item.vectorDimensions}D)</span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </TableCell>

        {/* 类型列 */}
        <TableCell className="text-center w-1/12">
          {item.type || '-'}
        </TableCell>

        {/* 大小列 */}
        <TableCell className="text-center w-1/12">
          {getFileSizeInKB(item.size)}
        </TableCell>

        {/* 块数列 */}
        <TableCell className="text-center w-1/12">
          {getChunkInfo()}
        </TableCell>

        {/* 进度列 */}
        <TableCell className="text-center w-2/12">
          {getProgressInfo()}
        </TableCell>

        {/* 状态列 */}
        <TableCell className="text-center w-1/12">
          {getStatusDisplay()}
        </TableCell>

        {/* 操作列 */}
        <TableCell className="text-center w-1/12">
          {item.isFolder ? (
            <FolderActionButtons folder={item} />
          ) : (
            <FileActionButtons 
              file={item} 
              status={item.processingStatus || 'pending'}
              settingsChanged={vectorizeSettingsChanged[item.id || ''] || false}
              onStartVectorize={() => handleStartVectorize(item.id || '')}
              onPauseVectorize={() => handlePauseVectorize(item.id || '')}
              onToggleSettings={() => toggleVectorizeSettings(item.id || '')}
            />
          )}
        </TableCell>

        {/* 选择列 */}
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

      {/* 渲染子项 */}
      {item.isFolder && isExpanded && item.children && item.children.map(child => (
        renderFileItem(child, depth + 1)
      ))}
    </React.Fragment>
  );
};

export default EnhancedFileItem;