import React from 'react';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { AgentMetrics, AgentStatus } from '../../types/agent-orchestration';

interface EnhancedHeaderProps {
  metrics?: AgentMetrics;
  status?: AgentStatus;
  isServiceReady: boolean;
  currentRoute?: string;
  onRefresh: () => void;
  onThemeToggle?: () => void;
  currentTheme?: 'light' | 'dark';
}

export const EnhancedHeader: React.FC<EnhancedHeaderProps> = ({
  metrics,
  status,
  isServiceReady,
  currentRoute,
  onRefresh,
  onThemeToggle,
  currentTheme = 'light'
}) => {
  const getStatusColor = () => {
    if (!isServiceReady) return 'bg-red-400';
    if (!status) return 'bg-yellow-400';
    
    switch (status.status) {
      case 'running': return 'bg-green-400';
      case 'error': return 'bg-red-400';
      case 'paused': return 'bg-yellow-400';
      default: return 'bg-gray-400';
    }
  };

  const getStatusText = () => {
    if (!isServiceReady) return '服务离线';
    if (!status) return '连接中';
    
    switch (status.status) {
      case 'running': return '运行中';
      case 'error': return '错误';
      case 'paused': return '暂停';
      case 'idle': return '空闲';
      default: return '未知';
    }
  };

  return (
    <div className="bg-white shadow-sm border-b px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">智能体编排监控</h1>
              <div className="flex items-center space-x-2 mt-1">
                <p className="text-gray-600">多智能体协作流程实时可视化</p>
                {currentRoute && (
                  <>
                    <span className="text-gray-400">•</span>
                    <span className="text-sm text-blue-600">{currentRoute}</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 状态和指标面板 */}
        <div className="flex items-center space-x-6">
          {/* 实时指标 */}
          {metrics && (
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-1">
                <span className="text-gray-500">活跃:</span>
                <Badge variant="outline">{metrics.activeAgents}</Badge>
              </div>
              <div className="flex items-center space-x-1">
                <span className="text-gray-500">任务:</span>
                <Badge variant="outline">{metrics.completedTasks}/{metrics.totalTasks}</Badge>
              </div>
              {metrics.errorCount > 0 && (
                <div className="flex items-center space-x-1">
                  <span className="text-red-500">错误:</span>
                  <Badge variant="destructive">{metrics.errorCount}</Badge>
                </div>
              )}
            </div>
          )}

          {/* 状态指示器 */}
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 ${getStatusColor()} rounded-full`}></div>
            <span className="text-sm text-gray-600">{getStatusText()}</span>
          </div>

          {/* 操作按钮 */}
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onRefresh}
              className="text-xs"
            >
              刷新
            </Button>
            
            {onThemeToggle && (
              <Button
                variant="outline"
                size="sm"
                onClick={onThemeToggle}
                className="text-xs"
              >
                {currentTheme === 'light' ? '🌙' : '☀️'}
              </Button>
            )}
            
            <a 
              href="http://localhost:8000" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 text-sm px-2 py-1 rounded border hover:bg-blue-50 transition-colors"
            >
              新窗口 ↗
            </a>
          </div>
        </div>
      </div>

      {/* 当前任务信息 */}
      {status?.currentTask && (
        <div className="mt-3 px-3 py-2 bg-blue-50 rounded-md">
          <div className="flex items-center space-x-2">
            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-blue-800">
              当前任务: {status.currentTask}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};