import React from 'react';
import { Badge } from '../../../components/ui/Badge';

interface FileStatusBadgeProps {
  status: string;
}

const FileStatusBadge: React.FC<FileStatusBadgeProps> = ({ status }) => {
  // Map status values to display text
  const getDisplayStatus = () => {
    switch(status) {
      case 'processing':
        return '处理中';
      case 'paused':
        return '已暂停';
      case 'completed':
        return '已完成';
      case 'pending':
        return '待处理';
      case 'error':
        return '错误';
      default:
        return status;
    }
  };
  
  const displayStatus = getDisplayStatus();
  
  // 已完成向量化
  if (displayStatus === '已完成' || status === 'completed') {
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
  if (displayStatus === '处理中' || status === 'processing') {
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
  if (displayStatus === '已暂停' || status === 'paused') {
    return (
      <Badge 
        variant="outline" 
        className="px-2.5 py-1 text-xs rounded-full bg-blue-100 text-blue-800 border-blue-200 shadow-sm"
      >
        已暂停
      </Badge>
    );
  }

  // 错误
  if (displayStatus === '错误' || status === 'error') {
    return (
      <Badge 
        variant="destructive" 
        className="px-2.5 py-1 text-xs rounded-full shadow-sm"
      >
        错误
      </Badge>
    );
  }

  // 默认状态：待处理
  return (
    <Badge 
      variant="outline" 
      className="px-2.5 py-1 text-xs rounded-full bg-gray-100 text-gray-600 border-gray-200 shadow-sm"
    >
      待处理
    </Badge>
  );
};

export default FileStatusBadge;
