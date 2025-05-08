import { useState, useCallback } from 'react';

export interface ModalOptions {
  initialVisible?: boolean;
  onOpen?: () => void;
  onClose?: () => void;
}

/**
 * 模态窗口管理Hook
 * 
 * 统一管理模态窗口的打开/关闭状态，提供通用对话框操作方法
 * 
 * @param options 配置选项
 * @returns {object} 包含visible状态和open、close、toggle方法的对象
 */
export const useModal = (options: ModalOptions = {}) => {
  const { initialVisible = false, onOpen, onClose } = options;
  
  const [visible, setVisible] = useState<boolean>(initialVisible);
  
  const open = useCallback(() => {
    setVisible(true);
    onOpen?.();
  }, [onOpen]);
  
  const close = useCallback(() => {
    setVisible(false);
    onClose?.();
  }, [onClose]);
  
  return {
    visible,
    open,
    close,
    toggle: useCallback(() => {
      if (visible) {
        close();
      } else {
        open();
      }
    }, [visible, open, close])
  };
};
