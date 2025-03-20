import React from 'react';
import { Button } from '../../../components/ui/Button';

interface PauseConfirmDialogProps {
  showPauseConfirm: string;
  getFileName: (fileId: string) => string;
  confirmPauseVectorize: () => void;
  cancelPauseVectorize: () => void;
}

const PauseConfirmDialog: React.FC<PauseConfirmDialogProps> = ({ 
  showPauseConfirm, 
  getFileName, 
  confirmPauseVectorize, 
  cancelPauseVectorize 
}) => {
  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-md p-4 w-96">
        <h2 className="text-lg font-bold mb-2">确认暂停向量化</h2>
        <p className="text-gray-600 mb-4">确认是否暂停文件 {getFileName(showPauseConfirm)} 的向量化?</p>
        <div className="flex justify-end space-x-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className="rounded-md hover:bg-gray-100"
            onClick={cancelPauseVectorize}
          >
            取消
          </Button>
          <Button 
            variant="default" 
            size="sm" 
            className="rounded-md bg-blue-500 hover:bg-blue-600 text-white"
            onClick={confirmPauseVectorize}
          >
            确认
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PauseConfirmDialog;
