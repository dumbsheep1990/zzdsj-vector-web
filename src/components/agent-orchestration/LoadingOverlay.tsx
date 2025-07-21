import React from 'react';

interface LoadingOverlayProps {
  isVisible: boolean;
  message?: string;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ 
  isVisible, 
  message = "正在加载智能体编排界面..." 
}) => {
  if (!isVisible) return null;

  return (
    <div className="absolute inset-0 bg-white flex items-center justify-center z-50">
      <div className="text-center">
        {/* 现代化的加载动画 */}
        <div className="relative mb-6 flex justify-center">
          <div className="relative">
            {/* 外圈 */}
            <div className="w-16 h-16 border-4 border-blue-200 rounded-full animate-spin"></div>
            {/* 内圈 */}
            <div className="absolute top-2 left-2 w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" 
                 style={{ animationDirection: 'reverse', animationDuration: '1s' }}></div>
            {/* 中心点 */}
            <div className="absolute top-6 left-6 w-4 h-4 bg-blue-500 rounded-full animate-pulse"></div>
          </div>
        </div>

        {/* 加载文本 */}
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          启动智能体编排服务
        </h3>
        <p className="text-gray-500 text-sm max-w-md">
          {message}
        </p>
        
        {/* 进度指示器 */}
        <div className="mt-4 w-64 bg-gray-200 rounded-full h-1.5 mx-auto">
          <div className="bg-blue-500 h-1.5 rounded-full animate-pulse" 
               style={{ width: '70%' }}></div>
        </div>

        {/* 提示信息 */}
        <div className="mt-6 text-xs text-gray-400 space-y-1">
          <p>• 正在连接智能体编排服务...</p>
          <p>• 初始化可视化界面...</p>
          <p>• 建立实时通信连接...</p>
        </div>
      </div>
    </div>
  );
};