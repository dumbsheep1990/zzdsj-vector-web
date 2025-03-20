import React from 'react';
import { Button } from '../../../components/ui/Button';
import { Play, Check, Zap, Settings, Trash2 } from 'lucide-react';
import { FileItem } from '../../../utils/types';

interface FileActionButtonsProps {
  item: FileItem;
  fileStatus: string;
  vectorizeSettingsChanged: boolean;
  handleStartVectorize: (fileId: string, e: React.MouseEvent) => void;
  handlePauseVectorize: (fileId: string, e: React.MouseEvent) => void;
  toggleVectorizeSettings: (fileId: string, e: React.MouseEvent) => void;
}

const FileActionButtons: React.FC<FileActionButtonsProps> = ({
  item,
  fileStatus,
  vectorizeSettingsChanged,
  handleStartVectorize,
  handlePauseVectorize,
  toggleVectorizeSettings
}) => {
  // Determine which action button to show based on status
  const renderActionButton = () => {
    // Processing state takes precedence
    if ((item.status === '处理中' || fileStatus === 'vectorizing') && fileStatus !== 'paused') {
      return (
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 w-8 p-0 rounded-full bg-amber-100 text-amber-800 transition-colors" 
          title="暂停向量化"
          onClick={(e) => handlePauseVectorize(item.id || '', e)}
        >
          <Zap className="h-4 w-4 animate-pulse" />
        </Button>
      );
    }
    
    // Paused state
    if (fileStatus === 'paused') {
      return (
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 w-8 p-0 rounded-full bg-blue-100 text-blue-800 transition-colors" 
          title="继续向量化"
          onClick={(e) => handleStartVectorize(item.id || '', e)}
        >
          <Play className="h-4 w-4" />
        </Button>
      );
    }
    
    // Completed state with settings changed
    if ((item.status === '已完成向量化' || item.status === '已向量化') && vectorizeSettingsChanged && 
        fileStatus !== 'vectorizing' && fileStatus !== 'paused') {
      return (
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 w-8 p-0 rounded-full hover:bg-blue-100 hover:text-blue-600 transition-colors" 
          title="启动向量化"
          onClick={(e) => handleStartVectorize(item.id || '', e)}
        >
          <Play className="h-4 w-4" />
        </Button>
      );
    }
    
    // Completed state without settings changed
    if ((item.status === '已完成向量化' || item.status === '已向量化') && !vectorizeSettingsChanged) {
      return (
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 w-8 p-0 rounded-full bg-green-100 text-green-700 hover:bg-green-200 hover:text-green-800 transition-colors" 
          title="已完成"
          onClick={(e) => e.stopPropagation()}
          disabled
        >
          <Check className="h-4 w-4 font-bold" />
        </Button>
      );
    }
    
    // Default: Not started or other states
    if (fileStatus !== 'vectorizing' && fileStatus !== 'paused') {
      return (
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 w-8 p-0 rounded-full hover:bg-blue-100 hover:text-blue-600 transition-colors" 
          title="启动向量化"
          onClick={(e) => handleStartVectorize(item.id || '', e)}
        >
          <Play className="h-4 w-4" />
        </Button>
      );
    }
    
    // Fallback (should not reach here)
    return null;
  };

  return (
    <div className="flex items-center space-x-1">
      {/* Action button based on current state */}
      {renderActionButton()}
      
      {/* 向量化设置按钮 */}
      <Button 
        variant="ghost" 
        size="sm" 
        className={`h-8 w-8 p-0 rounded-full ${vectorizeSettingsChanged ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'} transition-colors`}
        title="向量化设置"
        onClick={(e) => {
          e.stopPropagation();
          if (item.id) toggleVectorizeSettings(item.id, e);
        }}
        disabled={item.status === '处理中' || fileStatus === 'vectorizing'}
      >
        <Settings className="h-4 w-4" />
      </Button>
      
      {/* 删除按钮 */}
      <Button 
        variant="ghost" 
        size="sm" 
        className="h-8 w-8 p-0 rounded-full hover:bg-red-100 hover:text-red-600 transition-colors" 
        title="删除"
        onClick={(e) => e.stopPropagation()}
        disabled={item.status === '处理中' || fileStatus === 'vectorizing'}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default FileActionButtons;
