import { useEffect, useState, useCallback, useRef } from 'react';

/**
 * 智能体构建器全屏控制钩子
 * 使用原生Fullscreen API实现全屏功能，并保留渐变背景样式
 * @param containerId 要全屏的容器ID
 */
const useAgentFullscreen = (containerId: string) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  // 用于跟踪重复按钮观察器
  const duplicateButtonObserverRef = useRef<MutationObserver | null>(null);
  
  // 检测并移除重复的“下一步”按钮 - 深度强化版
  const detectAndRemoveDuplicateButtons = () => {
    // 给全屏渲染足够的时间再进行操作
    setTimeout(() => {
      // 直接选择所有文本包含"下一步"的按钮
      const allNextButtons = document.querySelectorAll('button');
      let buttonFound = false; // 记录是否已找到并保留了一个按钮
      
      console.log(`全屏模式下发现 ${allNextButtons.length} 个按钮`);
      
      // 首先清除所有带有相关class的按钮
      document.querySelectorAll('.agent-builder-nav-button').forEach(button => {
        (button as HTMLElement).style.cssText = 'display: none !important; visibility: hidden !important;';
        console.log('隐藏了类名指定的按钮');
      });
      
      // 检查所有按钮
      allNextButtons.forEach(button => {
        // 检查是否包含"下一步"文本
        if (button.textContent?.includes('下一步')) {
          const rect = button.getBoundingClientRect();
          
          // 特别处理位于页面右侧的按钮
          if (rect.right > window.innerWidth * 0.7) {
            if (!buttonFound) {
              // 第一个发现的按钮设为可见但禁用
              (button as HTMLElement).style.opacity = '0.1';
              buttonFound = true;
              console.log('保留了第一个下一步按钮');
            } else {
              // 其他相似按钮全部隐藏
              (button as HTMLElement).style.cssText = 'display: none !important; visibility: hidden !important;';
              console.log('隐藏了重复的下一步按钮');
            }
          }
          
          // 特别处理响应长度附近的按钮
          if (button.closest('[class*="QuickConfig"]') || button.closest('[data-testid*="response"]')) {
            (button as HTMLElement).style.cssText = 'display: none !important; visibility: hidden !important;';
            console.log('隐藏了响应长度附近的按钮');
          }
        }
      });
    }, 300);
  };
  
  // 创建全屏样式元素
  const createFullscreenStyles = () => {
    // 移除已存在的样式
    const existingStyle = document.getElementById('agent-fullscreen-custom-styles');
    if (existingStyle) existingStyle.remove();
    
    // 创建新的样式元素
    const styleEl = document.createElement('style');
    styleEl.id = 'agent-fullscreen-custom-styles';
    
    // 获取原始容器的渐变背景样式
    const getGradientBackground = () => {
      const bodyStyle = window.getComputedStyle(document.body);
      return bodyStyle.background || 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)';
    };
    
    // 设置全屏样式 - 渐变背景 + 模糊效果
    styleEl.textContent = `
      /* 页面背景 - 防止全屏黑色 */
      :fullscreen, ::backdrop {
        background: ${getGradientBackground()} !important;
      }
      
      /* 隐藏响应长度区域附近的下一步按钮 - 精确选择器 */
      :fullscreen .agent-builder-nav-button,
      :-webkit-full-screen .agent-builder-nav-button,
      :-moz-full-screen .agent-builder-nav-button,
      :-ms-fullscreen .agent-builder-nav-button {
        display: none !important;
        visibility: hidden !important;
        pointer-events: none !important;
        opacity: 0 !important;
        position: absolute !important;
        z-index: -1 !important;
        transform: translateX(-9999px) !important;
      }
      
      /* 全屏模式下隐藏所有含有下一步文本的按钮 */
      :fullscreen button:not([data-fullscreen-allowed]),
      :-webkit-full-screen button:not([data-fullscreen-allowed]) {
        position: relative !important;
      }
      
      /* 原生全屏样式覆盖 - Webkit */
      #${containerId}:-webkit-full-screen {
        background: rgba(255, 255, 255, 0.65) !important;
        backdrop-filter: blur(8px) !important;
        -webkit-backdrop-filter: blur(8px) !important;
        border-radius: 16px !important;
        width: 100% !important;
        height: 100% !important;
        margin: 0 !important;
        padding: 16px !important;
        display: flex !important;
        flex-direction: row !important; /* 保持原始的左右布局 */
        overflow: auto !important;
        box-sizing: border-box !important;
      }
      
      /* 原生全屏样式覆盖 - Mozilla */
      #${containerId}:-moz-full-screen {
        background: rgba(255, 255, 255, 0.65) !important;
        backdrop-filter: blur(8px) !important;
        border-radius: 16px !important;
        width: 100% !important;
        height: 100% !important;
        margin: 0 !important;
        padding: 16px !important;
        display: flex !important;
        flex-direction: row !important; /* 保持原始的左右布局 */
        overflow: auto !important;
        box-sizing: border-box !important;
      }
      
      /* 原生全屏样式覆盖 - MS */
      #${containerId}:-ms-fullscreen {
        background: rgba(255, 255, 255, 0.65) !important;
        backdrop-filter: blur(8px) !important;
        border-radius: 16px !important;
        width: 100% !important;
        height: 100% !important;
        margin: 0 !important;
        padding: 16px !important;
        display: flex !important;
        flex-direction: row !important; /* 保持原始的左右布局 */
        overflow: auto !important;
        box-sizing: border-box !important;
      }
      
      /* 原生全屏样式覆盖 - 标准 */
      #${containerId}:fullscreen {
        background: rgba(255, 255, 255, 0.65) !important;
        backdrop-filter: blur(8px) !important;
        border-radius: 16px !important;
        width: 100% !important;
        height: 100% !important;
        margin: 0 !important;
        padding: 16px !important;
        display: flex !important;
        flex-direction: row !important; /* 保持原始的左右布局 */
        overflow: auto !important;
        box-sizing: border-box !important;
      }
      
      /* 全屏时内部元素样式调整 */
      #${containerId}:fullscreen [data-agent-builder-main],
      #${containerId}:-webkit-full-screen [data-agent-builder-main],
      #${containerId}:-moz-full-screen [data-agent-builder-main],
      #${containerId}:-ms-fullscreen [data-agent-builder-main] {
        height: calc(100vh - 32px) !important;
        margin: 0 !important;
        border-radius: 16px !important;
        overflow: auto !important;
      }
      
      /* 修复全屏时重叠问题 */
      /* 隐藏可能引起重叠的“下一步”按钮 */
      :fullscreen button:nth-of-type(1):not(:only-of-type),
      :-webkit-full-screen button:nth-of-type(1):not(:only-of-type) {
        z-index: 1 !important;
      }
      
      /* 修复响应长度选择器时的重叠问题 */
      :fullscreen [role="button"] + div:not([class]),
      :-webkit-full-screen [role="button"] + div:not([class]) {
        position: relative !important;
        z-index: 10 !important;
      }
      
      /* 确保全屏模式下组件正确堆叠 */
      :fullscreen button,
      :-webkit-full-screen button {
        position: relative !important;
      }
    `;
    
    document.head.appendChild(styleEl);
    return styleEl;
  };
  
  // 初始化DOM观察器来检测重复按钮
  const setupDuplicateButtonObserver = () => {
    const container = document.getElementById(containerId);
    if (!container || duplicateButtonObserverRef.current) return;
    
    // 创建新的观察器
    duplicateButtonObserverRef.current = new MutationObserver(() => {
      // 当DOM变化时检测重复按钮
      if (isFullscreen) {
        detectAndRemoveDuplicateButtons();
      }
    });
    
    // 开始观察容器的DOM变化
    duplicateButtonObserverRef.current.observe(container, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['style', 'class']
    });
  };
  
  // 清除DOM观察器
  const cleanupDuplicateButtonObserver = () => {
    if (duplicateButtonObserverRef.current) {
      duplicateButtonObserverRef.current.disconnect();
      duplicateButtonObserverRef.current = null;
    }
  };

  // 切换全屏状态
  const toggleFullscreen = useCallback(() => {
    const container = document.getElementById(containerId);
    if (!container) {
      console.error(`找不到ID为${containerId}的容器`);
      return;
    }
    
    // 创建或更新自定义全屏样式
    createFullscreenStyles();
    
    // 进入全屏
    const enterFullscreen = () => {
      if (container.requestFullscreen) {
        container.requestFullscreen().catch(err => {
          console.error('全屏失败:', err);
        });
      } else if ((container as any).webkitRequestFullscreen) {
        (container as any).webkitRequestFullscreen();
      } else if ((container as any).mozRequestFullScreen) {
        (container as any).mozRequestFullScreen();
      } else if ((container as any).msRequestFullscreen) {
        (container as any).msRequestFullscreen();
      }
      // 启动重复按钮观察器
      setTimeout(() => {
        setupDuplicateButtonObserver();
        // 进入全屏后立即检测并移除重复按钮
        detectAndRemoveDuplicateButtons();
      }, 300); // 给全屏渲染一点时间
    };
    
    // 退出全屏
    const exitFullscreen = () => {
      // 在退出全屏前清除观察器
      cleanupDuplicateButtonObserver();
      
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(err => {
          console.error('退出全屏失败:', err);
        });
      } else if ((document as any).webkitExitFullscreen) {
        (document as any).webkitExitFullscreen();
      } else if ((document as any).mozCancelFullScreen) {
        (document as any).mozCancelFullScreen();
      } else if ((document as any).msExitFullscreen) {
        (document as any).msExitFullscreen();
      }
    };
    
    // 检查是否已在全屏状态
    if (!isFullscreen) {
      enterFullscreen();
    } else {
      exitFullscreen();
    }
  }, [containerId]);
  
  useEffect(() => {
    console.log(`[全屏钩子] 初始化，容器ID: ${containerId}`);
    
    const container = document.getElementById(containerId);
    if (!container) {
      console.error(`找不到ID为${containerId}的容器`);
      return;
    }
    
    // 创建全屏按钮
    const createFullscreenButton = () => {
      const existingButton = document.getElementById('agent-fullscreen-btn');
      if (existingButton) existingButton.remove();
      
      const button = document.createElement('button');
      button.id = 'agent-fullscreen-btn';
      
      // 设置按钮样式
      Object.assign(button.style, {
        position: 'fixed',
        top: '15px',
        right: '15px',
        zIndex: '9999',
        width: '36px',
        height: '36px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.85)',
        border: 'none',
        borderRadius: '4px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        cursor: 'pointer',
        color: '#1976d2',
        transition: 'all 0.2s ease'
      });
      
      // 设置按钮图标和标题
      button.innerHTML = isFullscreen 
        ? '<svg viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z"></path></svg>'
        : '<svg viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"></path></svg>';
      
      button.title = isFullscreen ? '退出全屏' : '进入全屏';
      
      // 添加悬停效果
      button.addEventListener('mouseover', () => {
        button.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
        button.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
      });
      
      button.addEventListener('mouseout', () => {
        button.style.backgroundColor = 'rgba(255, 255, 255, 0.85)';
        button.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
      });
      
      // 绑定点击事件
      button.addEventListener('click', toggleFullscreen);
      
      document.body.appendChild(button);
      return button;
    };
    
    // 处理全屏变化事件
    const handleFullscreenChange = () => {
      const isCurrentlyFullscreen = 
        !!document.fullscreenElement || 
        !!(document as any).webkitFullscreenElement || 
        !!(document as any).mozFullScreenElement || 
        !!(document as any).msFullscreenElement;
      
      console.log(`全屏状态变化: ${isCurrentlyFullscreen ? '进入全屏' : '退出全屏'}`);
      setIsFullscreen(isCurrentlyFullscreen);
      
      // 更新按钮图标
      const button = document.getElementById('agent-fullscreen-btn');
      if (button) {
        button.innerHTML = isCurrentlyFullscreen 
          ? '<svg viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z"></path></svg>'
          : '<svg viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"></path></svg>';
        button.title = isCurrentlyFullscreen ? '退出全屏' : '进入全屏';
      }
    };
    
    // 禁用ESC键退出全屏
    const preventEscKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    };
    
    // F11快捷键支持
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'F11') {
        e.preventDefault();
        toggleFullscreen();
      }
    };
    
    // 创建按钮
    const fullscreenButton = createFullscreenButton();
    
    // 添加事件监听
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);
    
    document.addEventListener('keydown', preventEscKey, true);
    document.addEventListener('keydown', handleKeyDown);
    
    // 清理函数
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
      
      document.removeEventListener('keydown', preventEscKey, true);
      document.removeEventListener('keydown', handleKeyDown);
      
      if (fullscreenButton) fullscreenButton.remove();
      
      // 如果处于全屏状态，退出全屏
      if (isFullscreen) {
        if (document.exitFullscreen) {
          document.exitFullscreen().catch(() => {});
        } else if ((document as any).webkitExitFullscreen) {
          (document as any).webkitExitFullscreen();
        } else if ((document as any).mozCancelFullScreen) {
          (document as any).mozCancelFullScreen();
        } else if ((document as any).msExitFullscreen) {
          (document as any).msExitFullscreen();
        }
      }
    };
  }, [containerId, isFullscreen, toggleFullscreen]);
  
  return { isFullscreen, toggleFullscreen };
};

export default useAgentFullscreen;
