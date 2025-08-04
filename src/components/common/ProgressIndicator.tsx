import React from 'react';
import { 
  CheckCircle, 
  AlertCircle, 
  XCircle, 
  Loader2, 
  FileText,
  Database,
  Zap,
  Clock,
  Activity
} from 'lucide-react';

// 进度状态类型
export type ProgressStatus = 'idle' | 'processing' | 'completed' | 'error';

// 进度阶段类型
export type ProgressStage = 'extract' | 'chunk' | 'embed' | 'store' | 'finalize' | '';

// 组件属性
interface ProgressIndicatorProps {
  progress: number; // 0-100
  status: ProgressStatus;
  stage: ProgressStage;
  message?: string;
  showDetails?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

/**
 * 进度指示器组件
 * 显示任务进度条、状态和阶段信息
 */
const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  progress,
  status,
  stage,
  message = '',
  showDetails = true,
  size = 'md',
  className = ''
}) => {
  // 获取阶段信息
  const getStageInfo = (stage: ProgressStage) => {
    switch (stage) {
      case 'extract':
        return { icon: FileText, name: '提取', color: 'text-blue-500' };
      case 'chunk':
        return { icon: Activity, name: '分块', color: 'text-purple-500' };
      case 'embed':
        return { icon: Database, name: '向量化', color: 'text-green-500' };
      case 'store':
        return { icon: Zap, name: '存储', color: 'text-orange-500' };
      case 'finalize':
        return { icon: CheckCircle, name: '完成', color: 'text-green-600' };
      default:
        return { icon: Clock, name: '准备', color: 'text-gray-500' };
    }
  };

  // 获取状态信息
  const getStatusInfo = (status: ProgressStatus) => {
    switch (status) {
      case 'processing':
        return { 
          icon: Loader2, 
          color: 'text-blue-500', 
          bgColor: 'bg-blue-500',
          name: '处理中',
          animate: 'animate-spin'
        };
      case 'completed':
        return { 
          icon: CheckCircle, 
          color: 'text-green-500', 
          bgColor: 'bg-green-500',
          name: '已完成',
          animate: ''
        };
      case 'error':
        return { 
          icon: XCircle, 
          color: 'text-red-500', 
          bgColor: 'bg-red-500',
          name: '错误',
          animate: ''
        };
      default:
        return { 
          icon: Clock, 
          color: 'text-gray-500', 
          bgColor: 'bg-gray-500',
          name: '待处理',
          animate: ''
        };
    }
  };

  const stageInfo = getStageInfo(stage);
  const statusInfo = getStatusInfo(status);
  const StageIcon = stageInfo.icon;
  const StatusIcon = statusInfo.icon;

  // 大小配置
  const sizeConfig = {
    sm: {
      container: 'p-2',
      progressHeight: 'h-1',
      iconSize: 'w-3 h-3',
      textSize: 'text-xs',
      titleSize: 'text-sm'
    },
    md: {
      container: 'p-3',
      progressHeight: 'h-2',
      iconSize: 'w-4 h-4',
      textSize: 'text-sm',
      titleSize: 'text-base'
    },
    lg: {
      container: 'p-4',
      progressHeight: 'h-3',
      iconSize: 'w-5 h-5',
      textSize: 'text-base',
      titleSize: 'text-lg'
    }
  };

  const config = sizeConfig[size];

  return (
    <div className={`bg-white rounded-lg border shadow-sm ${config.container} ${className}`}>
      {/* 头部信息 */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <StatusIcon className={`${config.iconSize} ${statusInfo.color} ${statusInfo.animate}`} />
          <span className={`font-medium ${config.titleSize}`}>
            {statusInfo.name}
          </span>
          
          {showDetails && stage && (
            <>
              <span className="text-gray-300">•</span>
              <div className="flex items-center space-x-1">
                <StageIcon className={`${config.iconSize} ${stageInfo.color}`} />
                <span className={`${config.textSize} ${stageInfo.color}`}>
                  {stageInfo.name}
                </span>
              </div>
            </>
          )}
        </div>
        
        <span className={`font-semibold ${config.textSize}`}>
          {Math.round(progress)}%
        </span>
      </div>

      {/* 进度条 */}
      <div className={`w-full bg-gray-200 rounded-full ${config.progressHeight} mb-2`}>
        <div 
          className={`${config.progressHeight} rounded-full transition-all duration-300 ease-out ${statusInfo.bgColor}`}
          style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
        />
      </div>

      {/* 消息文本 */}
      {showDetails && message && (
        <p className={`${config.textSize} text-gray-600 mt-1`}>
          {message}
        </p>
      )}

      {/* 状态指示点 */}
      {showDetails && (
        <div className="flex items-center space-x-4 mt-3">
          {(['extract', 'chunk', 'embed', 'store', 'finalize'] as ProgressStage[]).map((stageItem, index) => {
            const stageItemInfo = getStageInfo(stageItem);
            const StageItemIcon = stageItemInfo.icon;
            const isActive = stage === stageItem;
            const isPassed = ['extract', 'chunk', 'embed', 'store'].slice(0, 
              ['extract', 'chunk', 'embed', 'store', 'finalize'].indexOf(stage) + 1
            ).includes(stageItem);
            
            return (
              <div key={stageItem} className="flex flex-col items-center space-y-1">
                <div className={`p-1 rounded-full ${
                  isActive ? 'bg-blue-100' : isPassed ? 'bg-green-100' : 'bg-gray-100'
                }`}>
                  <StageItemIcon className={`w-3 h-3 ${
                    isActive ? 'text-blue-500' : isPassed ? 'text-green-500' : 'text-gray-400'
                  }`} />
                </div>
                <span className={`text-xs ${
                  isActive ? 'text-blue-600 font-medium' : 
                  isPassed ? 'text-green-600' : 'text-gray-400'
                }`}>
                  {stageItemInfo.name}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

/**
 * 迷你进度指示器组件
 * 适用于空间受限的场景
 */
export const MiniProgressIndicator: React.FC<{
  progress: number;
  status: ProgressStatus;
  className?: string;
}> = ({ progress, status, className = '' }) => {
  const statusInfo = getStatusInfo(status);
  const StatusIcon = statusInfo.icon;

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <StatusIcon className={`w-3 h-3 ${statusInfo.color} ${statusInfo.animate}`} />
      <div className="flex-1 bg-gray-200 rounded-full h-1">
        <div 
          className={`h-1 rounded-full transition-all duration-300 ${statusInfo.bgColor}`}
          style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
        />
      </div>
      <span className="text-xs font-medium">
        {Math.round(progress)}%
      </span>
    </div>
  );
};

// 导出辅助函数
export const getStatusInfo = (status: ProgressStatus) => {
  switch (status) {
    case 'processing':
      return { 
        icon: Loader2, 
        color: 'text-blue-500', 
        bgColor: 'bg-blue-500',
        name: '处理中',
        animate: 'animate-spin'
      };
    case 'completed':
      return { 
        icon: CheckCircle, 
        color: 'text-green-500', 
        bgColor: 'bg-green-500',
        name: '已完成',
        animate: ''
      };
    case 'error':
      return { 
        icon: XCircle, 
        color: 'text-red-500', 
        bgColor: 'bg-red-500',
        name: '错误',
        animate: ''
      };
    default:
      return { 
        icon: Clock, 
        color: 'text-gray-500', 
        bgColor: 'bg-gray-500',
        name: '待处理',
        animate: ''
      };
  }
};

export default ProgressIndicator;