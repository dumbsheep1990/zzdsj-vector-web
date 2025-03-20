import React from 'react';
import { Badge } from '../../../components/ui/Badge';

interface FileStatusBadgeProps {
  status: string;
  fileStatus: string;
  isFolder: boolean;
}

const FileStatusBadge: React.FC<FileStatusBadgeProps> = ({ status, fileStatus, isFolder }) => {
  // Determine the effective status based on both status and fileStatus
  const getEffectiveStatus = () => {
    // fileStatus takes precedence over item.status since it represents the current action
    if (fileStatus === 'vectorizing') return '处理中'; // Processing
    if (fileStatus === 'paused') return '已暂停'; // Paused
    
    // If no fileStatus, use the original status
    return status;
  };
  
  const effectiveStatus = getEffectiveStatus();
  
  if (isFolder) {
    return (
      <Badge 
        variant="outline" 
        className="px-2.5 py-1 text-xs rounded-full bg-gray-100 text-gray-600 border-gray-200"
      >
        文件夹
      </Badge>
    );
  }

  // 已完成向量化
  if (effectiveStatus === '已完成向量化' || effectiveStatus === '已向量化') {
    return (
      <Badge 
        variant="default" 
        className="px-2.5 py-1 text-xs rounded-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-sm"
      >
        已完成
      </Badge>
    );
  }

  // 处理中
  if (effectiveStatus === '处理中' || fileStatus === 'vectorizing') {
    return (
      <Badge 
        variant="secondary" 
        className="px-2.5 py-1 text-xs rounded-full bg-amber-100 text-amber-800 border-amber-200 shadow-sm"
      >
        处理中
      </Badge>
    );
  }

  // 已暂停
  if (effectiveStatus === '已暂停' || fileStatus === 'paused') {
    return (
      <Badge 
        variant="outline" 
        className="px-2.5 py-1 text-xs rounded-full bg-blue-100 text-blue-800 border-blue-200"
      >
        已暂停
      </Badge>
    );
  }

  // 未处理
  return (
    <Badge 
      variant="outline" 
      className="px-2.5 py-1 text-xs rounded-full bg-rose-100 text-rose-800 border-rose-200 shadow-sm"
    >
      {effectiveStatus || '未处理'}
    </Badge>
  );
};

export default FileStatusBadge;
