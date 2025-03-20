import React from 'react';
import { Button } from '../../../components/ui/Button';
import { Plus, Settings, Trash2 } from 'lucide-react';

interface FolderActionButtonsProps {
  onNewFolderClick: (e: React.MouseEvent) => void;
  onSettingsClick: (e: React.MouseEvent) => void;
  onDeleteClick: (e: React.MouseEvent) => void;
}

const FolderActionButtons: React.FC<FolderActionButtonsProps> = ({
  onNewFolderClick,
  onSettingsClick,
  onDeleteClick
}) => {
  return (
    <div className="flex items-center space-x-1">
      {/* 新建文件夹按钮 */}
      <Button 
        variant="ghost" 
        size="sm" 
        className="h-8 w-8 p-0 rounded-full hover:bg-blue-100 hover:text-blue-600 transition-colors" 
        title="新建文件夹"
        onClick={onNewFolderClick}
      >
        <Plus className="h-4 w-4" />
      </Button>
      
      {/* 向量化设置按钮 */}
      <Button 
        variant="ghost" 
        size="sm" 
        className="h-8 w-8 p-0 rounded-full hover:bg-gray-100 transition-colors" 
        title="向量化设置"
        onClick={onSettingsClick}
      >
        <Settings className="h-4 w-4" />
      </Button>
      
      {/* 删除按钮 */}
      <Button 
        variant="ghost" 
        size="sm" 
        className="h-8 w-8 p-0 rounded-full hover:bg-red-100 hover:text-red-600 transition-colors" 
        title="删除"
        onClick={onDeleteClick}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default FolderActionButtons;
