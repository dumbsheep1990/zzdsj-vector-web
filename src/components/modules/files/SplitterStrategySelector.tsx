import React, { useState, useEffect } from 'react';
import { 
  Settings,
  Layers3,
  Brain,
  Zap,
  Info,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  CheckCircle,
  RefreshCw
} from 'lucide-react';

// 切分策略选项
interface SplitterStrategy {
  id: string;
  name: string;
  description: string;
  type: 'token_based' | 'semantic' | 'smart';
  defaultChunkSize: number;
  defaultChunkOverlap: number;
  maxChunkSize: number;
  minChunkSize: number;
  recommended: boolean;
  features: string[];
  icon: React.ComponentType<any>;
}

// 预定义的切分策略
const PREDEFINED_STRATEGIES: SplitterStrategy[] = [
  {
    id: 'token_basic',
    name: '基础Token分块',
    description: '基于Token数量进行固定大小分块，速度快，适合通用文档',
    type: 'token_based',
    defaultChunkSize: 1000,
    defaultChunkOverlap: 200,
    maxChunkSize: 4000,
    minChunkSize: 100,
    recommended: true,
    features: ['快速处理', '固定大小', '通用适配'],
    icon: Layers3
  },
  {
    id: 'semantic_smart',
    name: '语义分块',
    description: '基于语义相似度进行智能分块，保持内容连贯性',
    type: 'semantic',
    defaultChunkSize: 800,
    defaultChunkOverlap: 150,
    maxChunkSize: 2000,
    minChunkSize: 200,
    recommended: false,
    features: ['语义连贯', '智能分割', '内容相关'],
    icon: Brain
  },
  {
    id: 'smart_adaptive',
    name: '智能自适应',
    description: '结合文档结构和语义，自动选择最佳分块策略',
    type: 'smart',
    defaultChunkSize: 1200,
    defaultChunkOverlap: 250,
    maxChunkSize: 3000,
    minChunkSize: 300,
    recommended: false,
    features: ['自动优化', '结构感知', '高质量分块'],
    icon: Zap
  },
  {
    id: 'custom',
    name: '自定义策略',
    description: '根据具体需求自定义分块参数和配置',
    type: 'token_based',
    defaultChunkSize: 1000,
    defaultChunkOverlap: 200,
    maxChunkSize: 4000,
    minChunkSize: 100,
    recommended: false,
    features: ['完全自定义', '灵活配置', '个性化调优'],
    icon: Settings
  }
];

// 组件属性
interface SplitterStrategySelectorProps {
  selectedStrategyId: string;
  onStrategyChange: (strategyId: string) => void;
  customSettings: {
    chunkSize: number;
    chunkOverlap: number;
    preserveStructure: boolean;
  };
  onSettingsChange: (settings: any) => void;
  knowledgeBaseId: string;
  apiBaseUrl?: string;
  className?: string;
  disabled?: boolean;
}

/**
 * 切分策略选择组件
 * 提供预定义策略选择和自定义配置
 */
const SplitterStrategySelector: React.FC<SplitterStrategySelectorProps> = ({
  selectedStrategyId,
  onStrategyChange,
  customSettings,
  onSettingsChange,
  knowledgeBaseId,
  apiBaseUrl = 'http://localhost:8082',
  className = '',
  disabled = false
}) => {
  // 状态管理
  const [strategies, setStrategies] = useState<SplitterStrategy[]>(PREDEFINED_STRATEGIES);
  const [customStrategies, setCustomStrategies] = useState<SplitterStrategy[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [saving, setSaving] = useState(false);

  // 加载知识库的切分策略
  const loadStrategies = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `${apiBaseUrl}/api/v1/knowledge-bases/${knowledgeBaseId}/splitter-strategies`,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.ok) {
        const result = await response.json();
        if (result.success && result.strategies) {
          // 转换API响应为组件数据格式
          const apiStrategies: SplitterStrategy[] = result.strategies.map((strategy: any) => ({
            id: strategy.id,
            name: strategy.name,
            description: strategy.description,
            type: strategy.chunk_strategy,
            defaultChunkSize: strategy.chunk_size,
            defaultChunkOverlap: strategy.chunk_overlap,
            maxChunkSize: strategy.max_chunk_size || 4000,
            minChunkSize: strategy.min_chunk_size || 100,
            recommended: strategy.is_default || false,
            features: strategy.features || [],
            icon: getStrategyIcon(strategy.chunk_strategy)
          }));
          
          setCustomStrategies(apiStrategies);
        }
      }
    } catch (err) {
      console.error('加载切分策略失败:', err);
      setError('加载策略失败，使用默认策略');
    } finally {
      setLoading(false);
    }
  };

  // 获取策略图标
  const getStrategyIcon = (type: string) => {
    switch (type) {
      case 'semantic': return Brain;
      case 'smart': return Zap;
      default: return Layers3;
    }
  };

  // 组件挂载时加载策略
  useEffect(() => {
    if (knowledgeBaseId) {
      loadStrategies();
    }
  }, [knowledgeBaseId]);

  // 获取所有策略（预定义 + 自定义）
  const allStrategies = [...strategies, ...customStrategies];

  // 获取当前选中的策略
  const selectedStrategy = allStrategies.find(s => s.id === selectedStrategyId) || strategies[0];

  // 处理策略选择
  const handleStrategySelect = (strategy: SplitterStrategy) => {
    onStrategyChange(strategy.id);
    
    // 如果选中自定义策略，显示高级配置
    if (strategy.id === 'custom') {
      setShowAdvanced(true);
      // 保持当前的自定义设置不变
    } else {
      // 同时更新设置为策略的默认值
      onSettingsChange({
        ...customSettings,
        chunkSize: strategy.defaultChunkSize,
        chunkOverlap: strategy.defaultChunkOverlap,
        preserveStructure: true  // 默认保留结构
      });
      // 如果不是自定义策略，可以隐藏高级配置
      if (showAdvanced && strategy.id !== 'custom') {
        setShowAdvanced(false);
      }
    }
  };

  // 保存自定义策略
  const saveCustomStrategy = async () => {
    try {
      setSaving(true);
      setError(null);

      // 生成唯一的策略名称（包含时间戳）
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const strategyName = `自定义策略_${timestamp}`;

      const customStrategyData = {
        name: strategyName,
        description: `用户自定义切分策略 - 分块大小: ${customSettings.chunkSize}, 重叠: ${customSettings.chunkOverlap}`,
        chunk_strategy: 'token_based',
        chunk_size: customSettings.chunkSize,
        chunk_overlap: customSettings.chunkOverlap,
        preserve_structure: customSettings.preserveStructure,
        parameters: {
          chunk_size: customSettings.chunkSize,
          chunk_overlap: customSettings.chunkOverlap,
          preserve_structure: customSettings.preserveStructure,
          // 添加关联信息
          knowledge_base_id: knowledgeBaseId,
          created_for: 'file_upload',
          type: 'custom_user_defined'
        },
        is_active: true,
        category: 'custom'
      };

      const response = await fetch(
        `${apiBaseUrl}/api/v1/knowledge-bases/${knowledgeBaseId}/splitter-strategies`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(customStrategyData)
        }
      );

      if (response.ok) {
        const result = await response.json();
        if (result.success && result.strategy) {
          // 将新创建的策略添加到自定义策略列表
          const newStrategy: SplitterStrategy = {
            id: result.strategy.id,
            name: result.strategy.name,
            description: result.strategy.description,
            type: result.strategy.chunk_strategy,
            defaultChunkSize: result.strategy.chunk_size,
            defaultChunkOverlap: result.strategy.chunk_overlap,
            maxChunkSize: 4000,
            minChunkSize: 100,
            recommended: false,
            features: ['自定义配置', '用户定义', '已保存'],
            icon: Settings
          };

          setCustomStrategies(prev => [...prev, newStrategy]);
          
          // 切换到新创建的策略
          onStrategyChange(newStrategy.id);
          
          // 显示成功消息
          console.log('自定义策略保存成功:', newStrategy.name);
          
          return result.strategy.id;
        } else {
          throw new Error(result.message || '保存策略失败');
        }
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (err) {
      console.error('保存自定义策略失败:', err);
      setError(err instanceof Error ? err.message : '保存策略失败');
      return null;
    } finally {
      setSaving(false);
    }
  };

  // 处理自定义设置变化
  const handleSettingChange = (key: string, value: any) => {
    onSettingsChange({
      ...customSettings,
      [key]: value
    });
  };

  // 验证设置值
  const validateSetting = (key: string, value: number) => {
    if (key === 'chunkSize') {
      return value >= selectedStrategy.minChunkSize && value <= selectedStrategy.maxChunkSize;
    }
    if (key === 'chunkOverlap') {
      return value >= 0 && value < customSettings.chunkSize;
    }
    return true;
  };

  // 获取设置验证信息
  const getValidationMessage = (key: string, value: number) => {
    if (key === 'chunkSize') {
      if (value < selectedStrategy.minChunkSize) {
        return `最小值: ${selectedStrategy.minChunkSize}`;
      }
      if (value > selectedStrategy.maxChunkSize) {
        return `最大值: ${selectedStrategy.maxChunkSize}`;
      }
    }
    if (key === 'chunkOverlap') {
      if (value >= customSettings.chunkSize) {
        return '重叠不能大于等于块大小';
      }
    }
    return null;
  };

  return (
    <div className={`bg-white rounded-lg border border-gray-200 ${className}`}>
      {/* 头部 */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <Settings className="w-5 h-5 text-gray-600" />
          <h3 className="font-medium text-gray-900">切分策略</h3>
          {loading && <RefreshCw className="w-4 h-4 text-blue-500 animate-spin" />}
        </div>
        
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center space-x-1 text-sm text-gray-600 hover:text-gray-800"
        >
          <span>高级设置</span>
          {showAdvanced ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* 错误提示 */}
      {error && (
        <div className="p-3 bg-yellow-50 border-b border-yellow-200">
          <div className="flex items-center space-x-2 text-yellow-700">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm">{error}</span>
          </div>
        </div>
      )}

      {/* 策略选择 */}
      <div className="p-4">
        <div className="grid grid-cols-1 gap-3">
          {allStrategies.map((strategy) => {
            const Icon = strategy.icon;
            const isSelected = strategy.id === selectedStrategyId;
            
            return (
              <div
                key={strategy.id}
                className={`relative p-4 border rounded-lg cursor-pointer transition-all ${
                  isSelected 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={() => !disabled && handleStrategySelect(strategy)}
              >
                <div className="flex items-start space-x-3">
                  <div className={`p-2 rounded-lg ${
                    isSelected ? 'bg-blue-100' : 'bg-gray-100'
                  }`}>
                    <Icon className={`w-5 h-5 ${
                      isSelected ? 'text-blue-600' : 'text-gray-600'
                    }`} />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className={`font-medium ${
                        isSelected ? 'text-blue-900' : 'text-gray-900'
                      }`}>
                        {strategy.name}
                      </h4>
                      {strategy.recommended && (
                        <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                          推荐
                        </span>
                      )}
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-2">
                      {strategy.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-1">
                      {strategy.features.map((feature, index) => (
                        <span 
                          key={index}
                          className={`px-2 py-1 text-xs rounded ${
                            isSelected 
                              ? 'bg-blue-100 text-blue-700' 
                              : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                    
                    <div className="mt-2 text-xs text-gray-500">
                      默认: {strategy.defaultChunkSize} tokens, 重叠: {strategy.defaultChunkOverlap}
                    </div>
                  </div>
                  
                  {isSelected && (
                    <CheckCircle className="w-5 h-5 text-blue-600" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 高级设置 */}
      {showAdvanced && (
        <div className="border-t border-gray-200 p-4 bg-gray-50">
          <h4 className="font-medium text-gray-900 mb-3">自定义配置</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {/* 分块大小 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                分块大小 (tokens)
              </label>
              <input
                type="number"
                value={customSettings.chunkSize}
                onChange={(e) => handleSettingChange('chunkSize', parseInt(e.target.value) || 0)}
                min={selectedStrategy.minChunkSize}
                max={selectedStrategy.maxChunkSize}
                disabled={disabled}
                className={`w-full px-3 py-2 border rounded-md text-sm ${
                  validateSetting('chunkSize', customSettings.chunkSize)
                    ? 'border-gray-300'
                    : 'border-red-300 bg-red-50'
                } ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
              />
              {!validateSetting('chunkSize', customSettings.chunkSize) && (
                <p className="text-xs text-red-600 mt-1">
                  {getValidationMessage('chunkSize', customSettings.chunkSize)}
                </p>
              )}
            </div>

            {/* 重叠大小 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                重叠大小 (tokens)
              </label>
              <input
                type="number"
                value={customSettings.chunkOverlap}
                onChange={(e) => handleSettingChange('chunkOverlap', parseInt(e.target.value) || 0)}
                min={0}
                max={customSettings.chunkSize - 1}
                disabled={disabled}
                className={`w-full px-3 py-2 border rounded-md text-sm ${
                  validateSetting('chunkOverlap', customSettings.chunkOverlap)
                    ? 'border-gray-300'
                    : 'border-red-300 bg-red-50'
                } ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
              />
              {!validateSetting('chunkOverlap', customSettings.chunkOverlap) && (
                <p className="text-xs text-red-600 mt-1">
                  {getValidationMessage('chunkOverlap', customSettings.chunkOverlap)}
                </p>
              )}
            </div>

            {/* 保留结构 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                其他选项
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="preserveStructure"
                  checked={customSettings.preserveStructure}
                  onChange={(e) => handleSettingChange('preserveStructure', e.target.checked)}
                  disabled={disabled}
                  className="rounded"
                />
                <label htmlFor="preserveStructure" className="text-sm text-gray-600">
                  保留文档结构
                </label>
              </div>
              {/* 保存自定义策略按钮 */}
              {selectedStrategyId === 'custom' && (
                <div className="flex justify-end pt-3 border-t border-gray-200 mt-4">
                  <button
                    onClick={saveCustomStrategy}
                    disabled={saving || disabled}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400  text-white text-sm font-medium rounded-lg transition-colors"
                  >
                    {saving ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        保存中...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        保存并应用
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* 配置说明 */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="flex items-start space-x-2">
              <Info className="w-4 h-4 text-blue-600 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">配置建议:</p>
                <ul className="text-xs space-y-1 text-blue-700">
                  <li>• 分块大小影响检索精度，较小的块更精确但可能丢失上下文</li>
                  <li>• 重叠大小帮助保持语义连续性，建议设为分块大小的15-25%</li>
                  <li>• 保留结构选项会尽量保持文档的原始格式和层次</li>
                  <li>• 不同文档类型可能需要不同的分块策略</li>
                  {selectedStrategyId === 'custom' && (
                    <li>• <strong>点击"保存并应用"</strong>来保存当前配置并应用到文件处理中</li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SplitterStrategySelector;