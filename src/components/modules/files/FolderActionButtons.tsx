import React from 'react';
import { Button } from '../../../components/ui/Button';
import { Plus, Settings, Trash2 } from 'lucide-react';
import { FileItem } from '../../../utils/types';

interface FolderActionButtonsProps {
  folder: FileItem;
}

const FolderActionButtons: React.FC<FolderActionButtonsProps> = ({}) => {
  return (
    <div className="flex items-center space-x-1">
      {/* 新建文件夹按钮 */}
      <Button 
        variant="ghost" 
        size="sm" 
        className="h-8 w-8 p-0 rounded-full hover:bg-blue-100 hover:text-blue-600 transition-colors" 
        title="新建文件夹"
        onClick={(e) => e.stopPropagation()}
      >
        <Plus className="h-4 w-4" />
      </Button>
      
      {/* 向量化设置按钮 */}
      <Button 
        variant="ghost" 
        size="sm" 
        className="h-8 w-8 p-0 rounded-full hover:bg-gray-100 transition-colors" 
        title="向量化设置"
        onClick={(e) => e.stopPropagation()}
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
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default FolderActionButtons;
