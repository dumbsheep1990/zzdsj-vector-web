import React from 'react';
import { Button } from '../../../components/ui/Button';

interface PauseConfirmDialogProps {
  isOpen: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

const PauseConfirmDialog: React.FC<PauseConfirmDialogProps> = ({ 
  isOpen, 
  onConfirm, 
  onClose 
}) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-md p-4 w-96">
        <h2 className="text-lg font-bold mb-2">确认暂停向量化</h2>
        <p className="text-gray-600 mb-4">确认是否暂停该文件的向量化?</p>
        <div className="flex justify-end space-x-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className="rounded-md hover:bg-gray-100"
            onClick={onClose}
          >
            取消
          </Button>
          <Button 
            variant="default" 
            size="sm" 
            className="rounded-md bg-blue-500 hover:bg-blue-600 text-white"
            onClick={onConfirm}
          >
            确认
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PauseConfirmDialog;
