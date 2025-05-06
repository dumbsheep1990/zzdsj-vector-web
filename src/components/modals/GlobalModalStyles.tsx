import React from 'react';
import { zIndexLevels } from '../../styles/zIndexLevels';

/**
 * 全局Modal样式组件
 * 提供一致的Modal样式和正确的z-index设置
 */
interface GlobalModalProps {
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  width?: string | number;
  height?: string | number;
  showClose?: boolean;
}

const GlobalModal: React.FC<GlobalModalProps> = ({
  children,
  isOpen,
  onClose,
  title,
  width = '80%',
  height = '80%',
  showClose = true
}) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center" 
      style={{ zIndex: zIndexLevels.MODAL }}
    >
      {/* 遮罩层 */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        style={{ zIndex: zIndexLevels.MODAL_BACKDROP }}
        onClick={onClose}
      />
      
      {/* 模态框内容 */}
      <div 
        className="bg-white rounded-lg shadow-xl overflow-hidden flex flex-col"
        style={{ 
          zIndex: zIndexLevels.MODAL,
          width: width,
          height: height,
          maxWidth: '95vw',
          maxHeight: '95vh',
          position: 'relative',
          backdropFilter: 'none', 
          filter: 'none' 
        }}
      >
        {/* 标题栏 */}
        {title && (
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
            {showClose && (
              <button 
                className="text-gray-500 hover:text-gray-700 focus:outline-none"
                onClick={onClose}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        )}
        
        {/* 内容区域 */}
        <div className="flex-1 overflow-auto p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default GlobalModal;
