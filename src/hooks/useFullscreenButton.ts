import { useEffect, useState } from 'react';

/**
 * 添加全屏控制按钮的自定义Hook
 * 在组件右上角创建一个全屏切换按钮，实现更完整的全屏体验
 * @param containerId 要进行全屏操作的容器ID，默认为整个AgentBuilder容器
 */
const useFullscreenButton = (containerId: string = 'agent-builder-fullscreen-container') => {
  // 追踪全屏状态
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    // 创建一个直接的DOM按钮绑定到页面上
    const createDirectFullscreenButton = () => {
      // 首先移除已存在的按钮（如果有）
      const existingButton = document.getElementById('direct-fullscreen-button');
      if (existingButton) {
        existingButton.remove();
      }
      
      // 创建新按钮
      const button = document.createElement('button');
      button.id = 'direct-fullscreen-button';
      button.innerHTML = '<svg viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"></path></svg>';
      button.style.position = 'fixed';
      button.style.top = '16px';
      button.style.right = '16px';
      button.style.zIndex = '10001';
      button.style.width = '36px';
      button.style.height = '36px';
      button.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
      button.style.border = 'none';
      button.style.borderRadius = '8px';
      button.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
      button.style.cursor = 'pointer';
      button.style.display = 'flex';
      button.style.alignItems = 'center';
      button.style.justifyContent = 'center';
      button.style.color = '#1976d2'; // 主色调
      
      // 添加悬停效果
      button.onmouseover = () => {
        button.style.backgroundColor = 'rgba(255, 255, 255, 1)';
        button.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
      };
      
      button.onmouseout = () => {
        button.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
        button.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
      };

      // 处理自定义全屏逻辑
      const handleToggleFullscreen = () => {
        console.log('全屏按钮被点击');
        
        // 找到要全屏显示的内容区容器
        const contentContainer = document.getElementById(containerId);
        
        if (!contentContainer) {
          console.error('找不到内容区容器');
          return;
        }

        // 切换全屏状态
        if (!isFullscreen) {
          // 进入自定义全屏模式
          setIsFullscreen(true);
          
          // 保存原始样式
          contentContainer.dataset.originalStyle = contentContainer.getAttribute('style') || '';
          
          // 应用全屏样式
          document.body.classList.add('agent-fullscreen-mode');
          
          // 创建并应用全屏CSS
          if (!document.getElementById('fullscreen-styles')) {
            const style = document.createElement('style');
            style.id = 'fullscreen-styles';
            style.textContent = `
              body.agent-fullscreen-mode {
                overflow: hidden !important;
              }
              body.agent-fullscreen-mode #${containerId} {
                position: fixed !important;
                top: 0 !important;
                left: 0 !important;
                right: 0 !important;
                bottom: 0 !important;
                width: 100vw !important;
                height: 100vh !important;
                z-index: 9999 !important;
                margin: 0 !important;
                padding: 0 !important;
                border-radius: 0 !important;
                border: none !important;
                overflow: auto !important;
              }
              body.agent-fullscreen-mode .MuiContainer-root {
                max-width: 100% !important;
                padding: 0 !important;
              }
              body.agent-fullscreen-mode #direct-fullscreen-button {
                top: 10px !important;
                right: 10px !important;
              }
            `;
            document.head.appendChild(style);
          }

          // 更新按钮图标
          button.innerHTML = '<svg viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z"></path></svg>';
          
        } else {
          // 退出自定义全屏模式
          setIsFullscreen(false);
          document.body.classList.remove('agent-fullscreen-mode');
          
          // 恢复原始样式
          if (contentContainer.dataset.originalStyle) {
            contentContainer.setAttribute('style', contentContainer.dataset.originalStyle);
            delete contentContainer.dataset.originalStyle;
          }

          // 更新按钮图标
          button.innerHTML = '<svg viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"></path></svg>';
        }
      };
      
      // 直接绑定点击事件
      button.onclick = handleToggleFullscreen;
      
      // 添加到文档中
      document.body.appendChild(button);
      
      return button;
    };
    
    // 创建按钮
    const fullscreenButton = createDirectFullscreenButton();
    
    // 添加键盘快捷键监听 - F11键
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'F11') {
        e.preventDefault();
        document.getElementById('direct-fullscreen-button')?.click();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);

    // 拦截ESC键退出
    const preventEscKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    };

    document.addEventListener('keydown', preventEscKey, true);
    
    return () => {
      // 如果处于全屏状态，退出全屏
      if (isFullscreen) {
        document.body.classList.remove('agent-fullscreen-mode');
        const contentContainer = document.getElementById(containerId);
        if (contentContainer?.dataset.originalStyle) {
          contentContainer.setAttribute('style', contentContainer.dataset.originalStyle);
          delete contentContainer.dataset.originalStyle;
        }
      }

      // 清理事件监听
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keydown', preventEscKey, true);
      
      // 移除样式表
      const fullscreenStyles = document.getElementById('fullscreen-styles');
      if (fullscreenStyles) {
        fullscreenStyles.remove();
      }

      // 移除按钮
      if (fullscreenButton) {
        fullscreenButton.remove();
      }
    };
  }, [containerId, isFullscreen]);

  return { isFullscreen, containerId };
};

export default useFullscreenButton;
