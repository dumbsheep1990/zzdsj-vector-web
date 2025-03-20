import React from 'react';
import { Folder, FileText, Image, File, FileSpreadsheet } from 'lucide-react';
import { FileItem } from '../../../utils/types';

interface FileIconProps {
  item?: FileItem;
  type?: string;
}

const FileIcon: React.FC<FileIconProps> = ({ item, type }) => {
  // 如果提供了item，根据item的类型显示图标
  if (item) {
    if (item.isFolder) {
      return <Folder className="h-5 w-5 text-blue-500" />;
    }
    
    // Based on file type
    switch(item.type?.toLowerCase()) {
      case 'pdf':
        return <File className="h-5 w-5 text-red-500" />;
      case 'word':
      case 'docx':
        return <FileText className="h-5 w-5 text-blue-600" />;
      case 'excel':
      case 'xlsx':
        return <FileSpreadsheet className="h-5 w-5 text-green-600" />;
      case 'png':
      case 'jpg':
      case 'jpeg':
      case 'gif':
        return <Image className="h-5 w-5 text-purple-500" />;
      default:
        return <FileText className="h-5 w-5 text-gray-500" />;
    }
  }
  
  // 如果提供了type，根据type显示图标
  if (type) {
    switch(type) {
      case 'folder':
        return <Folder className="h-5 w-5 text-blue-500" />;
      case 'pdf':
        return <File className="h-5 w-5 text-red-500" />;
      case 'word':
        return <FileText className="h-5 w-5 text-blue-600" />;
      case 'excel':
        return <FileSpreadsheet className="h-5 w-5 text-green-600" />;
      case 'image':
        return <Image className="h-5 w-5 text-purple-500" />;
      default:
        return <FileText className="h-5 w-5 text-gray-500" />;
    }
  }
  
  // 默认图标
  return <FileText className="h-5 w-5 text-gray-500" />;
};

export default FileIcon;
