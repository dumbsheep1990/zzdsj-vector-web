import React, { useEffect, useRef, useState } from 'react';
import { useAgentOrchestration } from '../hooks/useAgentOrchestration';
import { LoadingOverlay } from '../components/agent-orchestration/LoadingOverlay';
import { IframeMessage } from '../types/agent-orchestration';

interface AgentOrchestrationPageProps {}

export default function AgentOrchestrationPage() {
  const {
    isServiceReady,
    metrics,
    currentStatus,
    errors,
    currentRoute,
    updateStatus,
    updateMetrics,
    updateRoute,
    addError,
    clearErrors,
    checkServiceHealth
  } = useAgentOrchestration();

  const [currentTheme, setCurrentTheme] = useState<'light' | 'dark'>('light');
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // 增强的消息处理
  useEffect(() => {
    const handleMessage = (event: MessageEvent<IframeMessage>) => {
      // 只接受来自agent-orchestration服务的消息
      if (event.origin !== 'http://localhost:3000') {
        return;
      }
      
      const { type, action, payload } = event.data;
      if (type !== 'agent-orchestration') {
        console.log('Received non-orchestration message:', event.data);
        return;
      }

      console.log('Processing orchestration message:', { action, payload });

      switch (action) {
        case 'status-update':
          if (payload.status) {
            updateStatus(payload.status);
          }
          break;
          
        case 'metrics-update':
          if (payload.metrics) {
            updateMetrics(payload.metrics);
          }
          break;
          
        case 'navigation':
          if (payload.route) {
            updateRoute(payload.route, payload.title);
          }
          break;
          
        case 'error':
          if (payload.error) {
            addError(payload.error);
          }
          break;
          
        case 'user-action':
          // 处理用户操作反馈
          console.log('User action in iframe:', payload);
          break;
          
        default:
          console.log('Unknown action:', action);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [updateStatus, updateMetrics, updateRoute, addError]);

  // 向iframe发送主题和配置信息
  useEffect(() => {
    if (iframeRef.current && iframeLoaded && isServiceReady) {
      const message: IframeMessage = {
        type: 'agent-orchestration',
        action: 'theme-change',
        payload: { 
          theme: currentTheme,
          user: { name: 'User' } // 这里可以传入实际的用户信息
        },
        timestamp: Date.now(),
        source: 'main-app'
      };
      
      try {
        iframeRef.current.contentWindow?.postMessage(message, 'http://localhost:3000');
        console.log('Sent theme update to iframe:', currentTheme);
      } catch (error) {
        console.error('Failed to send message to iframe:', error);
      }
    }
  }, [currentTheme, iframeLoaded, isServiceReady]);

  // 主题切换处理
  const handleThemeToggle = () => {
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    setCurrentTheme(newTheme);
    
    // 同步到document类名（如果主应用支持暗黑模式）
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // iframe加载完成处理
  const handleIframeLoad = () => {
    console.log('Iframe loaded successfully');
    setIframeLoaded(true);
    
    // 发送初始化消息
    setTimeout(() => {
      if (iframeRef.current) {
        const initMessage: IframeMessage = {
          type: 'agent-orchestration',
          action: 'user-action',
          payload: { 
            theme: currentTheme,
            user: { name: 'User' },
            title: '智能体编排监控'
          },
          timestamp: Date.now(),
          source: 'main-app'
        };
        
        try {
          iframeRef.current.contentWindow?.postMessage(initMessage, 'http://localhost:3000');
        } catch (error) {
          console.error('Failed to send init message:', error);
        }
      }
    }, 1000);
  };

  // 错误处理和通知
  useEffect(() => {
    if (errors.length > 0) {
      const latestError = errors[errors.length - 1];
      console.error('Agent Orchestration Error:', latestError);
      
      // 这里可以集成通知系统
      // showNotification('error', latestError);
      
      // 5秒后自动清除错误
      const timer = setTimeout(clearErrors, 5000);
      return () => clearTimeout(timer);
    }
  }, [errors, clearErrors]);

  return (
    <div style={{ 
      width: '100%',
      height: '100%',
      display: 'flex', 
      flexDirection: 'column',
      position: 'relative'
    }}>
      {/* 错误提示栏 - 移到顶部，简化样式 */}
      {errors.length > 0 && (
        <div className="bg-red-50 border-l-4 border-red-400 px-6 py-3 z-50 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="text-red-400 mr-3">⚠️</div>
              <div>
                <p className="text-red-800 font-medium">连接问题</p>
                <p className="text-red-600 text-sm">{errors[errors.length - 1]}</p>
              </div>
            </div>
            <button 
              onClick={clearErrors}
              className="text-red-600 hover:text-red-800 text-sm font-medium"
            >
              关闭
            </button>
          </div>
        </div>
      )}

      {/* 嵌入的 Agent-Orchestration 界面 - 填充剩余空间 */}
      <div style={{ 
        flex: 1, 
        position: 'relative', 
        minHeight: 0,
        width: '100%',
        height: '100%'
      }}>
        {/* 加载覆盖层 */}
        <LoadingOverlay 
          isVisible={!isServiceReady || !iframeLoaded}
          message={!isServiceReady ? "正在连接服务..." : "正在加载界面..."}
        />
        
        {/* 主要iframe - 填充容器 */}
        {isServiceReady && (
          <iframe
            ref={iframeRef}
            src="http://localhost:3000"
            title="NextBuilder 智能体编排"
            allow="clipboard-read; clipboard-write; web-share"
            sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-modals"
            onLoad={handleIframeLoad}
            style={{
              width: '100%',
              height: '100%',
              border: 0,
              visibility: iframeLoaded ? 'visible' : 'hidden',
              display: 'block'
            }}
          />
        )}
      </div>
    </div>
  );
}