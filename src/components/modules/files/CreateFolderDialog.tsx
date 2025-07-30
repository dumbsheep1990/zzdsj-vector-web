import React, { useState } from 'react';
import { X, Folder } from 'lucide-react';

interface CreateFolderDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateFolder: (folderName: string, parentId: string | null) => void;
  currentFolderId: string | null;
}

const CreateFolderDialog: React.FC<CreateFolderDialogProps> = ({
  isOpen,
  onClose,
  onCreateFolder,
  currentFolderId
}) => {
  const [folderName, setFolderName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!folderName.trim()) {
      setError('文件夹名称不能为空');
      return;
    }
    
    // Validate folder name (no special characters except - and _)
    if (!/^[\w\u4e00-\u9fa5\-_]+$/.test(folderName)) {
      setError('文件夹名称只能包含字母、数字、中文、下划线和连字符');
      return;
    }
    
    onCreateFolder(folderName, currentFolderId);
    setFolderName('');
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[99999]">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md relative z-[100000]">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-medium">创建新文件夹</h3>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4">
          {/* Show current location information */}
          <div className="mb-4 p-3 bg-gray-50 rounded-md border border-gray-200">
            <p className="text-sm text-gray-600 mb-1">当前位置：</p>
            <div className="flex items-center">
              <Folder className="h-4 w-4 text-blue-500 mr-2" />
              <span className="text-sm font-medium">
                {currentFolderId ? '选中的文件夹内' : '根目录'}
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {currentFolderId 
                ? '新文件夹将创建在当前选中的文件夹内' 
                : '新文件夹将创建在根目录下'}
            </p>
          </div>

          <div className="mb-4">
            <label htmlFor="folderName" className="block text-sm font-medium text-gray-700 mb-1">
              文件夹名称
            </label>
            <input
              type="text"
              id="folderName"
              value={folderName}
              onChange={(e) => {
                setFolderName(e.target.value);
                setError('');
              }}
              className={`w-full p-2 border rounded-md ${error ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="请输入文件夹名称"
              autoFocus
            />
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
          </div>
          
          <div className="flex justify-end space-x-2 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              取消
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700"
            >
              创建
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateFolderDialog;
