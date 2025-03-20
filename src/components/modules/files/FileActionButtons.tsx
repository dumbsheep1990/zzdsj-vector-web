import React from 'react';
import { Button } from '../../../components/ui/Button';
import { Play, Check, Zap, Settings, Trash2 } from 'lucide-react';
import { FileItem } from '../../../utils/types';

interface FileActionButtonsProps {
  file: FileItem;
  status: string;
  settingsChanged: boolean;
  onStartVectorize: () => void;
  onPauseVectorize: () => void;
  onToggleSettings: () => void;
}

const FileActionButtons: React.FC<FileActionButtonsProps> = ({
  // 我们在组件中不直接使用file参数，但保留它以符合接口要求
  status,
  settingsChanged,
  onStartVectorize,
  onPauseVectorize,
  onToggleSettings
}) => {
  // 根据状态确定显示哪个操作按钮
  const renderActionButton = () => {
    // 处理中状态优先
    if (status === 'processing') {
      return (
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 w-8 p-0 rounded-full bg-amber-100 text-amber-800 transition-colors" 
          title="暂停向量化"
          onClick={(e) => {
            e.stopPropagation();
            onPauseVectorize();
          }}
        >
          <Zap className="h-4 w-4 animate-pulse" />
        </Button>
      );
    }
    
    // 暂停状态
    if (status === 'paused') {
      return (
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 w-8 p-0 rounded-full bg-blue-100 text-blue-800 transition-colors" 
          title="继续向量化"
          onClick={(e) => {
            e.stopPropagation();
            onStartVectorize();
          }}
        >
          <Play className="h-4 w-4" />
        </Button>
      );
    }
    
    // 完成状态
    if (status === 'completed') {
      return (
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 w-8 p-0 rounded-full bg-green-100 text-green-800 transition-colors" 
          title="已完成"
          disabled
        >
          <Check className="h-4 w-4" />
        </Button>
      );
    }
    
    // 默认状态（待处理或其他）
    return (
      <Button 
        variant="ghost" 
        size="sm" 
        className="h-8 w-8 p-0 rounded-full hover:bg-blue-100 hover:text-blue-600 transition-colors" 
        title="启动向量化"
        onClick={(e) => {
          e.stopPropagation();
          onStartVectorize();
        }}
      >
        <Play className="h-4 w-4" />
      </Button>
    );
  };

  return (
    <div className="flex items-center space-x-1">
      {/* 主要操作按钮（开始/暂停/恢复） */}
      {renderActionButton()}
      
      {/* 设置按钮 */}
      <Button 
        variant="ghost" 
        size="sm" 
        className={`h-8 w-8 p-0 rounded-full ${settingsChanged ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'} transition-colors`}
        title="向量化设置"
        onClick={(e) => {
          e.stopPropagation();
          onToggleSettings();
        }}
        disabled={status === 'processing'}
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
        disabled={status === 'processing'}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default FileActionButtons;
