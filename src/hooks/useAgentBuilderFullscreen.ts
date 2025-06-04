import { useEffect, useState } from 'react';

/**
 * 智能体构建器全屏控制钩子
 * 实现右上角全屏按钮，支持完整界面全屏、禁用ESC退出
 * @param containerId 要全屏的容器ID
 */
const useAgentBuilderFullscreen = (containerId: string = 'agent-builder-fullscreen-container') => {
  // 跟踪全屏状态
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  useEffect(() => {
    // 检查容器是否存在
    const container = document.getElementById(containerId);
    if (!container) {
      console.error(`找不到ID为${containerId}的容器`);
      return;
    }

    // 禁用ESC键退出全屏
    const preventEscKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    };

    // 创建全屏按钮
    const createFullscreenButton = () => {
      // 移除已存在的按钮
      const existingButton = document.getElementById('agent-fullscreen-button');
      if (existingButton) {
        existingButton.remove();
      }

      // 创建新按钮
      const button = document.createElement('button');
      button.id = 'agent-fullscreen-button';
      button.title = isFullscreen ? '退出全屏' : '进入全屏';
      
      // 使用SVG图标
      button.innerHTML = isFullscreen 
        ? '<svg viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z"></path></svg>'
        : '<svg viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"></path></svg>';
      
      // 按钮样式
      button.style.position = 'fixed';
      button.style.top = '12px';
      button.style.right = '12px';
      button.style.zIndex = '9999';
      button.style.width = '32px';
      button.style.height = '32px';
      button.style.display = 'flex';
      button.style.alignItems = 'center';
      button.style.justifyContent = 'center';
      button.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
      button.style.borderRadius = '6px';
      button.style.border = 'none';
      button.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
      button.style.cursor = 'pointer';
      button.style.color = '#1976d2';
      
      // 鼠标悬停效果
      button.onmouseover = () => {
        button.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
        button.style.boxShadow = '0 2px 12px rgba(0, 0, 0, 0.15)';
      };
      
      button.onmouseout = () => {
        button.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
        button.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
      };
      
      // 全屏切换处理
      button.onclick = () => {
        toggleFullscreen();
      };
      
      document.body.appendChild(button);
      return button;
    };

    // 全屏切换逻辑
    const toggleFullscreen = () => {
      if (!isFullscreen) {
        // 进入全屏模式
        setIsFullscreen(true);
        
        // 添加CSS
        if (!document.getElementById('agent-fullscreen-styles')) {
          const styleEl = document.createElement('style');
          styleEl.id = 'agent-fullscreen-styles';
          styleEl.textContent = `
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
              margin: 0 !important;
              padding: 0 !important;
              border-radius: 0 !important;
              border: none !important;
              z-index: 9990 !important;
              background-color: white !important;
            }
          `;
          document.head.appendChild(styleEl);
        }
        
        document.body.classList.add('agent-fullscreen-mode');
        container.dataset.fullscreen = 'true';
      } else {
        // 退出全屏模式
        setIsFullscreen(false);
        document.body.classList.remove('agent-fullscreen-mode');
        delete container.dataset.fullscreen;
      }
    };
    
    // F11快捷键支持
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'F11') {
        e.preventDefault();
        toggleFullscreen();
      }
    };

    // 创建全屏按钮
    const fullscreenButton = createFullscreenButton();
    
    // 添加事件监听
    document.addEventListener('keydown', preventEscKey, true);
    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      // 清理
      document.removeEventListener('keydown', preventEscKey, true);
      document.removeEventListener('keydown', handleKeyDown);
      
      // 如果处于全屏，先退出
      if (isFullscreen) {
        document.body.classList.remove('agent-fullscreen-mode');
      }
      
      // 移除按钮和样式
      if (fullscreenButton) fullscreenButton.remove();
      const styleEl = document.getElementById('agent-fullscreen-styles');
      if (styleEl) styleEl.remove();
    };
  }, [containerId, isFullscreen]);
  
  return { isFullscreen };
};

export default useAgentBuilderFullscreen;
