import React from 'react';
import { 
  Layers3, 
  Brain, 
  Zap, 
  Settings, 
  Clock,
  Activity,
  Database,
  FileText,
  Info,
  Target
} from 'lucide-react';

// 策略配置接口
interface StrategyConfig {
  id: string;
  name: string;
  type: 'token_based' | 'semantic' | 'smart';
  chunkSize: number;
  chunkOverlap: number;
  preserveStructure: boolean;
  description?: string;
  estimatedSpeed?: 'fast' | 'medium' | 'slow';
  accuracy?: 'high' | 'medium' | 'low';
  contextPreservation?: 'high' | 'medium' | 'low';
}

interface StrategyPreviewCardProps {
  strategy: StrategyConfig;
  showDetails?: boolean;
  className?: string;
  onEdit?: () => void;
}

/**
 * 切分策略预览卡片
 * 显示当前选中策略的配置和特性
 */
const StrategyPreviewCard: React.FC<StrategyPreviewCardProps> = ({
  strategy,
  showDetails = true,
  className = '',
  onEdit
}) => {
  // 获取策略图标和颜色
  const getStrategyIcon = () => {
    switch (strategy.type) {
      case 'semantic':
        return { icon: Brain, color: 'text-purple-600', bgColor: 'bg-purple-50' };
      case 'smart':
        return { icon: Zap, color: 'text-orange-600', bgColor: 'bg-orange-50' };
      default:
        return { icon: Layers3, color: 'text-blue-600', bgColor: 'bg-blue-50' };
    }
  };

  // 获取性能评级显示
  const getPerformanceDisplay = (level: string) => {
    switch (level) {
      case 'high':
        return { color: 'text-green-600', bg: 'bg-green-100', text: '高' };
      case 'medium':
        return { color: 'text-yellow-600', bg: 'bg-yellow-100', text: '中' };
      case 'low':
        return { color: 'text-red-600', bg: 'bg-red-100', text: '低' };
      default:
        return { color: 'text-gray-600', bg: 'bg-gray-100', text: '-' };
    }
  };

  // 计算重叠比例
  const overlapRatio = Math.round((strategy.chunkOverlap / strategy.chunkSize) * 100);

  // 预估文档处理指标
  const getProcessingEstimate = () => {
    // 基于chunk大小和策略类型估算
    let docsPerMinute = 10; // 基础值
    
    if (strategy.type === 'token_based') {
      docsPerMinute = 15;
    } else if (strategy.type === 'semantic') {
      docsPerMinute = 8;
    } else if (strategy.type === 'smart') {
      docsPerMinute = 5;
    }
    
    // 块大小影响
    const sizeMultiplier = strategy.chunkSize <= 500 ? 1.2 : 
                          strategy.chunkSize >= 2000 ? 0.8 : 1.0;
    
    return Math.round(docsPerMinute * sizeMultiplier);
  };

  const iconConfig = getStrategyIcon();
  const IconComponent = iconConfig.icon;
  const speedDisplay = getPerformanceDisplay(strategy.estimatedSpeed || 'medium');
  const accuracyDisplay = getPerformanceDisplay(strategy.accuracy || 'medium');
  const contextDisplay = getPerformanceDisplay(strategy.contextPreservation || 'medium');
  const estimatedSpeed = getProcessingEstimate();

  return (
    <div className={`bg-white rounded-lg border border-gray-200 ${className}`}>
      {/* 头部 */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg ${iconConfig.bgColor}`}>
            <IconComponent className={`w-5 h-5 ${iconConfig.color}`} />
          </div>
          <div>
            <h3 className="font-medium text-gray-900">{strategy.name}</h3>
            <p className="text-sm text-gray-500">{strategy.description || '当前选中的切分策略'}</p>
          </div>
        </div>
        
        {onEdit && (
          <button
            onClick={onEdit}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            title="编辑策略"
          >
            <Settings className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* 配置信息 */}
      <div className="p-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          {/* 分块大小 */}
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <FileText className="w-4 h-4 text-gray-500" />
            </div>
            <div className="text-lg font-semibold text-gray-900">{strategy.chunkSize}</div>
            <div className="text-xs text-gray-500">Tokens/块</div>
          </div>

          {/* 重叠设置 */}
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <Activity className="w-4 h-4 text-gray-500" />
            </div>
            <div className="text-lg font-semibold text-gray-900">{strategy.chunkOverlap}</div>
            <div className="text-xs text-gray-500">重叠 ({overlapRatio}%)</div>
          </div>

          {/* 预估速度 */}
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <Clock className="w-4 h-4 text-gray-500" />
            </div>
            <div className="text-lg font-semibold text-gray-900">{estimatedSpeed}</div>
            <div className="text-xs text-gray-500">文档/分钟</div>
          </div>

          {/* 结构保留 */}
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <Database className="w-4 h-4 text-gray-500" />
            </div>
            <div className="text-lg font-semibold text-gray-900">
              {strategy.preserveStructure ? '是' : '否'}
            </div>
            <div className="text-xs text-gray-500">保留结构</div>
          </div>
        </div>

        {/* 性能指标 */}
        {showDetails && (
          <div className="border-t border-gray-100 pt-4">
            <div className="flex items-center space-x-2 mb-3">
              <Target className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">性能指标</span>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              {/* 处理速度 */}
              <div className="text-center">
                <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${speedDisplay.bg} ${speedDisplay.color}`}>
                  {speedDisplay.text}
                </div>
                <div className="text-xs text-gray-500 mt-1">处理速度</div>
              </div>

              {/* 分块精度 */}
              <div className="text-center">
                <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${accuracyDisplay.bg} ${accuracyDisplay.color}`}>
                  {accuracyDisplay.text}
                </div>
                <div className="text-xs text-gray-500 mt-1">分块精度</div>
              </div>

              {/* 上下文保持 */}
              <div className="text-center">
                <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${contextDisplay.bg} ${contextDisplay.color}`}>
                  {contextDisplay.text}
                </div>
                <div className="text-xs text-gray-500 mt-1">上下文保持</div>
              </div>
            </div>
          </div>
        )}

        {/* 策略特点说明 */}
        {showDetails && (
          <div className="border-t border-gray-100 pt-4 mt-4">
            <div className="flex items-start space-x-2">
              <Info className="w-4 h-4 text-blue-500 mt-0.5" />
              <div className="text-sm text-gray-600">
                <div className="font-medium text-gray-700 mb-1">策略特点:</div>
                {strategy.type === 'token_based' && (
                  <ul className="text-xs space-y-1">
                    <li>• 处理速度快，资源消耗低</li>
                    <li>• 固定大小分块，便于管理</li>
                    <li>• 适合大部分通用文档类型</li>
                    <li>• 可能在语义边界处分割</li>
                  </ul>
                )}
                {strategy.type === 'semantic' && (
                  <ul className="text-xs space-y-1">
                    <li>• 保持语义完整性，提高检索质量</li>
                    <li>• 自适应分块大小，内容相关</li>
                    <li>• 适合结构化和学术文档</li>
                    <li>• 处理时间稍长，但质量更高</li>
                  </ul>
                )}
                {strategy.type === 'smart' && (
                  <ul className="text-xs space-y-1">
                    <li>• 结合文档结构和语义分析</li>
                    <li>• 自动优化分块策略</li>
                    <li>• 最佳的内容完整性</li>
                    <li>• 处理复杂，适合重要文档</li>
                  </ul>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StrategyPreviewCard;