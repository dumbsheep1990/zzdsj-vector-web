import React, { useEffect, useRef } from 'react';
import { Button } from 'antd';
import { Trash2 } from 'lucide-react';
import './ConfirmDeleteModal.css';

interface ConfirmDeleteModalProps {
  visible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  title?: string;
  message?: string;
  subMessage?: string;
}

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  visible,
  onConfirm,
  onCancel,
  title = '删除确认',
  message = '您确定要删除这个知识图谱吗？',
  subMessage = '删除后无法恢复。'
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && visible) {
        onCancel();
      }
    };

    if (visible) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
    };
  }, [visible, onCancel]);

  useEffect(() => {
    if (visible && modalRef.current) {
      // 添加动画类
      modalRef.current.classList.add('modal-enter');
      backdropRef.current?.classList.add('backdrop-enter');
      
      // 移除动画类（动画完成后）
      const timer = setTimeout(() => {
        modalRef.current?.classList.remove('modal-enter');
        backdropRef.current?.classList.remove('backdrop-enter');
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* 背景模糊层 */}
      <div 
        ref={backdropRef}
        className="fixed inset-0 bg-black/25 backdrop-blur-sm" 
        onClick={onCancel}
      />
      
      {/* 对话框 */}
      <div 
        ref={modalRef}
        className="bg-white rounded-lg shadow-xl w-96 overflow-hidden relative z-10"
        style={{
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}
      >
        {/* 标题栏 */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900 flex items-center">
            <Trash2 size={16} className="mr-2 text-red-500" />
            {title}
          </h3>
          <button 
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-500 focus:outline-none"
          >
            ×
          </button>
        </div>
        
        {/* 内容区 */}
        <div className="px-6 py-4">
          <p className="text-base text-gray-700 mb-1">{message}</p>
          <p className="text-sm text-gray-500">{subMessage}</p>
        </div>
        
        {/* 按钮区 */}
        <div className="px-6 py-3 bg-gray-50 flex justify-end space-x-3">
          <Button onClick={onCancel}>
            取消
          </Button>
          <Button 
            danger 
            type="primary" 
            onClick={onConfirm}
          >
            确认删除
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;
