import React, { useState, useEffect } from 'react';
import { Settings, RotateCcw, Save, Info, Sliders, Zap, Search, Target } from 'lucide-react';
import { Button } from '../../ui/Button';
import { Switch } from '../../ui/Switch';

interface SearchConfig {
  // 基础检索参数
  searchType: 'hybrid' | 'semantic' | 'keyword';
  recallThreshold: number;
  similarityThreshold: number;
  topK: number;
  
  // 混合检索权重
  semanticWeight: number;
  keywordWeight: number;
  
  // 高级参数
  enableReranking: boolean;
  maxCandidates: number;
  
  // LlamaIndex参数
  vectorWeight: number;
  textWeight: number;
  
  // Agno参数
  agnoConfidenceThreshold: number;
}

interface SearchControlPanelProps {
  knowledgeBaseId: string;
  initialConfig?: Partial<SearchConfig>;
  onConfigChange?: (config: SearchConfig) => void;
  onSave?: (config: SearchConfig) => void;
  className?: string;
}

const defaultConfig: SearchConfig = {
  searchType: 'hybrid',
  recallThreshold: 0.8,
  similarityThreshold: 0.7,
  topK: 5,
  semanticWeight: 0.7,
  keywordWeight: 0.3,
  enableReranking: true,
  maxCandidates: 100,
  vectorWeight: 0.7,
  textWeight: 0.3,
  agnoConfidenceThreshold: 0.6
};

const SearchControlPanel: React.FC<SearchControlPanelProps> = ({
  knowledgeBaseId,
  initialConfig = {},
  onConfigChange,
  onSave,
  className = ''
}) => {
  const [config, setConfig] = useState<SearchConfig>({
    ...defaultConfig,
    ...initialConfig
  });
  const [hasChanges, setHasChanges] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  // 监听配置变化
  useEffect(() => {
    onConfigChange?.(config);
  }, [config, onConfigChange]);

  // 更新配置并标记为有变化
  const updateConfig = (updates: Partial<SearchConfig>) => {
    setConfig(prev => {
      const newConfig = { ...prev, ...updates };
      
      // 自动调整权重使其总和为1.0
      if ('semanticWeight' in updates) {
        newConfig.keywordWeight = 1.0 - newConfig.semanticWeight;
      } else if ('keywordWeight' in updates) {
        newConfig.semanticWeight = 1.0 - newConfig.keywordWeight;
      }
      
      if ('vectorWeight' in updates) {
        newConfig.textWeight = 1.0 - newConfig.vectorWeight;
      } else if ('textWeight' in updates) {
        newConfig.vectorWeight = 1.0 - newConfig.textWeight;
      }
      
      return newConfig;
    });
    setHasChanges(true);
  };

  // 重置配置
  const handleReset = () => {
    setConfig({ ...defaultConfig, ...initialConfig });
    setHasChanges(false);
  };

  // 保存配置
  const handleSave = () => {
    onSave?.(config);
    setHasChanges(false);
  };

  // 检索类型配置项
  const searchTypeOptions = [
    {
      id: 'hybrid' as const,
      title: '混合检索',
      description: '结合语义理解和关键词匹配',
      icon: <Zap size={16} className="text-blue-600" />,
      color: 'border-blue-200 bg-blue-50'
    },
    {
      id: 'semantic' as const,
      title: '语义检索',
      description: '基于向量相似度的语义理解',
      icon: <Target size={16} className="text-green-600" />,
      color: 'border-green-200 bg-green-50'
    },
    {
      id: 'keyword' as const,
      title: '关键词检索',
      description: '传统的关键词精确匹配',
      icon: <Search size={16} className="text-orange-600" />,
      color: 'border-orange-200 bg-orange-50'
    }
  ];

  // 获取权重显示颜色
  const getWeightColor = (weight: number) => {
    if (weight >= 0.7) return 'text-blue-600';
    if (weight >= 0.4) return 'text-green-600';
    return 'text-orange-600';
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* 面板标题 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="p-2 bg-blue-50 rounded-lg mr-3">
            <Sliders size={18} className="text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800">高精度检索控制</h3>
            <p className="text-sm text-gray-500">配置知识库的检索参数和精度控制</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {hasChanges && (
            <span className="text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded-md">
              有未保存的更改
            </span>
          )}
          <Button
            size="sm"
            variant="secondary"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="text-sm"
          >
            <Settings size={14} className="mr-1" />
            {showAdvanced ? '简化' : '高级'}
          </Button>
        </div>
      </div>

      {/* 检索方式选择 */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <h4 className="text-md font-semibold text-gray-800 mb-4 flex items-center">
          <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
          检索方式
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {searchTypeOptions.map(option => (
            <button
              key={option.id}
              onClick={() => updateConfig({ searchType: option.id })}
              className={`p-4 border-2 rounded-lg transition-all duration-200 text-left ${
                config.searchType === option.id
                  ? `${option.color} border-opacity-100`
                  : 'border-gray-200 bg-white hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center mb-2">
                {option.icon}
                <span className="ml-2 font-medium text-gray-800">{option.title}</span>
              </div>
              <p className="text-xs text-gray-600">{option.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* 召回率和相似度控制 */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <h4 className="text-md font-semibold text-gray-800 mb-4 flex items-center">
          <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
          精度控制
        </h4>
        <div className="space-y-4">
          {/* 召回率阈值 */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium text-gray-700">召回率阈值</label>
              <span className={`text-sm font-mono ${getWeightColor(config.recallThreshold)}`}>
                {config.recallThreshold.toFixed(2)}
              </span>
            </div>
            <input
              type="range"
              min="0.1"
              max="1.0"
              step="0.05"
              value={config.recallThreshold}
              onChange={(e) => updateConfig({ recallThreshold: parseFloat(e.target.value) })}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>0.1 (宽松)</span>
              <span>1.0 (严格)</span>
            </div>
          </div>

          {/* 相似度阈值 */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium text-gray-700">相似度阈值</label>
              <span className={`text-sm font-mono ${getWeightColor(config.similarityThreshold)}`}>
                {config.similarityThreshold.toFixed(2)}
              </span>
            </div>
            <input
              type="range"
              min="0.1"
              max="1.0"
              step="0.05"
              value={config.similarityThreshold}
              onChange={(e) => updateConfig({ similarityThreshold: parseFloat(e.target.value) })}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>0.1 (相关)</span>
              <span>1.0 (精确)</span>
            </div>
          </div>

          {/* 返回结果数量 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              返回结果数量: {config.topK}
            </label>
            <select
              value={config.topK}
              onChange={(e) => updateConfig({ topK: parseInt(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            >
              <option value={3}>3</option>
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>
        </div>
      </div>

      {/* 混合检索权重配置 - 仅在混合模式时显示 */}
      {config.searchType === 'hybrid' && (
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <h4 className="text-md font-semibold text-gray-800 mb-4 flex items-center">
            <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
            混合检索权重
          </h4>
          <div className="space-y-4">
            {/* 语义权重 */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium text-gray-700">语义检索权重</label>
                <span className={`text-sm font-mono ${getWeightColor(config.semanticWeight)}`}>
                  {config.semanticWeight.toFixed(1)}
                </span>
              </div>
              <input
                type="range"
                min="0.0"
                max="1.0"
                step="0.1"
                value={config.semanticWeight}
                onChange={(e) => updateConfig({ semanticWeight: parseFloat(e.target.value) })}
                className="w-full h-2 bg-blue-300 rounded-lg appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #dbeafe 0%, #3b82f6 ${config.semanticWeight * 100}%, #e5e7eb ${config.semanticWeight * 100}%, #e5e7eb 100%)`
                }}
              />
            </div>

            {/* 关键词权重 */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium text-gray-700">关键词检索权重</label>
                <span className={`text-sm font-mono ${getWeightColor(config.keywordWeight)}`}>
                  {config.keywordWeight.toFixed(1)}
                </span>
              </div>
              <input
                type="range"
                min="0.0"
                max="1.0"
                step="0.1"
                value={config.keywordWeight}
                onChange={(e) => updateConfig({ keywordWeight: parseFloat(e.target.value) })}
                className="w-full h-2 bg-orange-300 rounded-lg appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #fed7aa 0%, #f97316 ${config.keywordWeight * 100}%, #e5e7eb ${config.keywordWeight * 100}%, #e5e7eb 100%)`
                }}
              />
            </div>

            {/* 权重比例可视化 */}
            <div className="mt-3 p-3 bg-gray-50 rounded-lg">
              <div className="flex justify-between text-xs text-gray-600 mb-1">
                <span>语义: {(config.semanticWeight * 100).toFixed(0)}%</span>
                <span>关键词: {(config.keywordWeight * 100).toFixed(0)}%</span>
              </div>
              <div className="flex h-2 rounded-full overflow-hidden bg-gray-200">
                <div
                  className="bg-blue-500 transition-all duration-300"
                  style={{ width: `${config.semanticWeight * 100}%` }}
                ></div>
                <div
                  className="bg-orange-500 transition-all duration-300"
                  style={{ width: `${config.keywordWeight * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 高级配置 */}
      {showAdvanced && (
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <h4 className="text-md font-semibold text-gray-800 mb-4 flex items-center">
            <div className="w-2 h-2 bg-gray-500 rounded-full mr-2"></div>
            高级配置
          </h4>
          <div className="space-y-4">
            {/* 重排序开关 */}
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="text-sm font-medium text-gray-700">启用重排序</p>
                <p className="text-xs text-gray-500">对搜索结果进行二次排序优化</p>
              </div>
              <Switch
                checked={config.enableReranking}
                onChange={(checked) => updateConfig({ enableReranking: checked })}
              />
            </div>

            {/* 最大候选数量 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                最大候选数量: {config.maxCandidates}
              </label>
              <input
                type="range"
                min="10"
                max="500"
                step="10"
                value={config.maxCandidates}
                onChange={(e) => updateConfig({ maxCandidates: parseInt(e.target.value) })}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>10 (快速)</span>
                <span>500 (全面)</span>
              </div>
            </div>

            {/* LlamaIndex参数 */}
            <div className="border-t pt-4">
              <h5 className="text-sm font-medium text-gray-700 mb-3">LlamaIndex 参数</h5>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    向量权重: {config.vectorWeight.toFixed(1)}
                  </label>
                  <input
                    type="range"
                    min="0.0"
                    max="1.0"
                    step="0.1"
                    value={config.vectorWeight}
                    onChange={(e) => updateConfig({ vectorWeight: parseFloat(e.target.value) })}
                    className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    文本权重: {config.textWeight.toFixed(1)}
                  </label>
                  <input
                    type="range"
                    min="0.0"
                    max="1.0"
                    step="0.1"
                    value={config.textWeight}
                    onChange={(e) => updateConfig({ textWeight: parseFloat(e.target.value) })}
                    className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Agno参数 */}
            <div className="border-t pt-4">
              <h5 className="text-sm font-medium text-gray-700 mb-3">Agno 参数</h5>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  置信度阈值: {config.agnoConfidenceThreshold.toFixed(2)}
                </label>
                <input
                  type="range"
                  min="0.0"
                  max="1.0"
                  step="0.05"
                  value={config.agnoConfidenceThreshold}
                  onChange={(e) => updateConfig({ agnoConfidenceThreshold: parseFloat(e.target.value) })}
                  className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 操作按钮 */}
      <div className="flex justify-between items-center">
        <div className="flex items-center text-xs text-gray-500">
          <Info size={12} className="mr-1" />
          配置会实时应用到搜索测试
        </div>
        <div className="flex space-x-2">
          <Button
            size="sm"
            variant="secondary"
            onClick={handleReset}
            disabled={!hasChanges}
            className="text-sm"
          >
            <RotateCcw size={14} className="mr-1" />
            重置
          </Button>
          <Button
            size="sm"
            variant="default"
            onClick={handleSave}
            disabled={!hasChanges}
            className="text-sm"
          >
            <Save size={14} className="mr-1" />
            保存配置
          </Button>
        </div>
      </div>

    </div>
  );
};

export default SearchControlPanel;