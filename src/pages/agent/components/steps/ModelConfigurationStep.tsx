import React, { useCallback, useMemo } from 'react';
import { cn } from '@/lib/utils';
import {
  Memory,
  Tune,
  AutoAwesome,
  Psychology,
  Speed,
  Bolt,
  AutoAwesomeMotion,
  Check
} from '@mui/icons-material';

// 模型配置接口 - 实用版
export interface ModelConfiguration {
  provider: string;
  model: string;
  temperature: number;
  max_tokens: number;
  top_p: number;
  frequency_penalty: number;
}

interface ModelConfigurationStepProps {
  config: ModelConfiguration;
  onConfigChange: (config: ModelConfiguration) => void;
}

// 静态数据移出组件 - 基于系统配置的中国厂商模型
const PROVIDERS = [
  {
    id: 'zhipu',
    name: '智谱AI',
    logo: 'https://open.bigmodel.cn/static/img/logo.png',
    description: '智谱AI大模型，支持GLM系列',
    models: [
      { id: 'glm-4', name: 'GLM-4', description: '智谱AI最新模型', recommended: true },
      { id: 'glm-3-turbo', name: 'GLM-3-Turbo', description: '高效版本' },
      { id: 'glm-embedding', name: 'GLM-Embedding', description: '文本嵌入模型' }
    ]
  },
  {
    id: 'baidu',
    name: '百度文心',
    logo: 'https://nlp-eb.cdn.bcebos.com/logo/favicon.ico',
    description: '百度文心大模型，知识增强',
    models: [
      { id: 'ernie-bot-4', name: '文心一言4.0', description: '百度最新旗舰模型', recommended: true },
      { id: 'ernie-bot-turbo', name: '文心一言Turbo', description: '高性价比选择' },
      { id: 'ernie-embedding', name: '文心Embedding', description: '向量化模型' }
    ]
  },
  {
    id: 'alibaba',
    name: '阿里通义',
    logo: 'https://img.alicdn.com/imgextra/i3/O1CN01Iq3p2U1qQU6H4rJKN_!!6000000005492-2-tps-512-512.png',
    description: '阿里云通义千问大模型',
    models: [
      { id: 'qwen-max', name: '通义千问Max', description: '最强性能模型', recommended: true },
      { id: 'qwen-turbo', name: '通义千问Turbo', description: '快速响应版本' },
      { id: 'qwen-plus', name: '通义千问Plus', description: '平衡版本' }
    ]
  },
  {
    id: 'tencent',
    name: '腾讯混元',
    logo: 'https://cloud.tencent.com/favicon.ico',
    description: '腾讯混元大模型',
    models: [
      { id: 'hunyuan-lite', name: '混元Lite', description: '轻量级模型' },
      { id: 'hunyuan-standard', name: '混元标准版', description: '标准功能模型', recommended: true },
      { id: 'hunyuan-pro', name: '混元Pro', description: '专业版模型' }
    ]
  },
  {
    id: 'xunfei',
    name: '讯飞星火',
    logo: 'https://xinghuo.xfyun.cn/static/img/logo.png',
    description: '科大讯飞星火认知大模型',
    models: [
      { id: 'spark-max', name: '星火Max', description: '讯飞最新模型', recommended: true },
      { id: 'spark-pro', name: '星火Pro', description: '专业版本' },
      { id: 'spark-lite', name: '星火Lite', description: '轻量版本' }
    ]
  },
  {
    id: 'cohere',
    name: 'Cohere',
    logo: 'https://cohere.com/favicon-32x32.png',
    description: '专业的企业级AI模型',
    models: [
      { id: 'command-r-plus', name: 'Command R+', description: '最新旗舰模型', recommended: true },
      { id: 'command-r', name: 'Command R', description: '标准版本' },
      { id: 'command-light', name: 'Command Light', description: '轻量版本' }
    ]
  }
];

const ModelConfigurationStep: React.FC<ModelConfigurationStepProps> = React.memo(({
  config,
  onConfigChange
}) => {
  const handleChange = useCallback((field: keyof ModelConfiguration) => (
    event: any
  ) => {
    const value = event.target ? event.target.value : event;
    onConfigChange({
      ...config,
      [field]: value
    });
  }, [config, onConfigChange]);

  const selectedProvider = useMemo(() => 
    PROVIDERS.find(p => p.id === config.provider), 
    [config.provider]
  );

  const availableModels = useMemo(() => 
    selectedProvider?.models || [], 
    [selectedProvider]
  );

  const selectedModel = useMemo(() => 
    availableModels.find(m => m.id === config.model), 
    [availableModels, config.model]
  );

  return (
    <div className="space-y-10 p-6 max-w-7xl mx-auto">
      {/* 顶部标签 */}
      <div className="flex justify-center mb-8">
        <div 
          className="px-10 py-2 rounded-full shadow-sm text-base font-medium text-gray-800 border border-gray-100"
          style={{
            background: 'linear-gradient(135deg, #F5F3FF 0%, #EDE9FE 50%, #DDD6FE 100%)',
            boxShadow: '0 4px 12px rgba(192, 132, 252, 0.15)'
          }}
        >
          选择模型
        </div>
      </div>
      
      {/* 标题 - 简化为单行 */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold">
          <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">模型配置与参数调整</span>
        </h2>
      </div>

      {/* 模型提供商选择 */}
      <div>
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-blue-100 text-blue-600">
            <Psychology className="h-5 w-5" />
          </div>
          <span className="bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent">选择模型提供商</span>
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {PROVIDERS.map((provider) => {
            const isSelected = config.provider === provider.id;
            
            return (
              <div
                key={provider.id}
                style={{
                  background: isSelected ? 'linear-gradient(135deg, #EFF6FF 0%, #E0EAFC 100%)' : '#ffffff',
                  boxShadow: isSelected ? '0 8px 16px -4px rgba(59, 130, 246, 0.15), 0 4px 6px -2px rgba(59, 130, 246, 0.1)' : 'none'
                }}
                className={cn(
                  "relative p-5 rounded-2xl cursor-pointer transition-all duration-300",
                  "hover:shadow-xl hover:scale-[1.02]",
                  isSelected 
                    ? "border-0 ring-2 ring-blue-400/30 ring-offset-2" 
                    : "!bg-white hover:bg-gray-50/70 border border-gray-200 hover:border-blue-300"
                )}
                onClick={() => handleChange('provider')({ target: { value: provider.id } })}
              >
                {/* 选中状态指示器 */}
                {isSelected && (
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full flex items-center justify-center shadow-lg ring-2 ring-blue-300 transform transition-all duration-300 ease-out animate-fadeIn">
                    <Check className="h-5 w-5 text-blue-900 drop-shadow-sm animate-checkmark" />
                  </div>
                )}
                
                <div className="flex items-start gap-3">
                  {/* Logo */}
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 flex items-center justify-center overflow-hidden flex-shrink-0 shadow-sm">
                    <img
                      src={provider.logo}
                      alt={provider.name}
                      className="w-9 h-9 object-contain"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        target.nextElementSibling!.textContent = provider.name.charAt(0);
                      }}
                    />
                    <span className="text-lg font-bold text-gray-600 hidden">
                      {provider.name.charAt(0)}
                    </span>
                  </div>
                  
                  {/* 内容 */}
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-2">{provider.name}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {provider.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 模型选择 */}
      {selectedProvider && (
        <div>
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-indigo-100 text-indigo-600">
            <Bolt className="h-5 w-5" />
          </div>
          <span className="bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent">选择具体模型</span>
        </h2>
          
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-5">
              {availableModels.map((model) => {
                const isSelected = config.model === model.id;
                
                return (
                  <button
                    key={model.id}
                    style={{
                      background: isSelected 
                        ? 'linear-gradient(135deg, #F5F3FF 0%, #E0E7FF 100%)' 
                        : '#ffffff',
                      color: isSelected ? '#4338CA' : '#111827',
                      boxShadow: isSelected 
                        ? '0 8px 16px -4px rgba(99, 102, 241, 0.15), 0 4px 6px -2px rgba(99, 102, 241, 0.08)' 
                        : 'none'
                    }}
                    className={cn(
                      "relative p-5 rounded-xl text-left transition-all duration-300",
                      "hover:shadow-lg hover:scale-[1.02] hover:border-indigo-300",
                      isSelected
                        ? "border-2 border-indigo-400/30 shadow-lg"
                        : "!bg-white text-gray-900 border border-gray-200 hover:bg-indigo-50/40"
                    )}
                    onClick={() => handleChange('model')({ target: { value: model.id } })}
                  >

                    <div className="mb-1.5">
                      <span className={cn("font-medium text-base", isSelected ? "text-indigo-800" : "text-gray-900")}>{model.name}</span>
                    </div>
                    <p className={cn("text-sm leading-relaxed", isSelected ? "text-indigo-700" : "text-gray-600")}> 
                      {model.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 参数调整 */}
      {selectedModel && (
        <div className="pb-24">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-purple-100 text-purple-600">
            <Tune className="h-5 w-5" />
          </div>
          <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">参数调整</span>
        </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Temperature */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-5">
                <div className="p-1.5 rounded-lg bg-orange-100 text-orange-500">
                  <AutoAwesome className="h-5 w-5" />
                </div>
                <h3 className="font-semibold text-gray-800">创造性 (Temperature)</h3>
              </div>
              <div className="space-y-3">
                <input
                  type="range"
                  min="0"
                  max="2"
                  step="0.1"
                  value={config.temperature}
                  onChange={handleChange('temperature')}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-sm text-gray-600">
                  <span>保守 (0)</span>
                  <span className="font-medium text-orange-600">{config.temperature}</span>
                  <span>创新 (2)</span>
                </div>
                <p className="text-sm text-gray-600 bg-gray-50/80 p-3.5 rounded-xl border border-gray-100">
                  控制回答的创造性程度。较低值产生更确定的回答，较高值产生更有创意的回答。
                </p>
              </div>
            </div>

            {/* Max Tokens */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-5">
                <div className="p-1.5 rounded-lg bg-green-100 text-green-500">
                  <Memory className="h-5 w-5" />
                </div>
                <h3 className="font-semibold text-gray-800">最大令牌数</h3>
              </div>
              <div className="space-y-3">
                <input
                  type="range"
                  min="1"
                  max="4096"
                  step="1"
                  value={config.max_tokens}
                  onChange={handleChange('max_tokens')}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-sm text-gray-600">
                  <span>简短 (1)</span>
                  <span className="font-medium text-green-600">{config.max_tokens}</span>
                  <span>详细 (4096)</span>
                </div>
                <p className="text-sm text-gray-600 bg-gray-50/80 p-3.5 rounded-xl border border-gray-100">
                  限制生成回答的长度。更多令牌允许更长的回答，但会消耗更多资源。
                </p>
              </div>
            </div>

            {/* Top P */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-5">
                <div className="p-1.5 rounded-lg bg-purple-100 text-purple-500">
                  <Speed className="h-5 w-5" />
                </div>
                <h3 className="font-semibold text-gray-800">核采样 (Top P)</h3>
              </div>
              <div className="space-y-3">
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={config.top_p}
                  onChange={handleChange('top_p')}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-sm text-gray-600">
                  <span>聚焦 (0)</span>
                  <span className="font-medium text-purple-600">{config.top_p}</span>
                  <span>多样 (1)</span>
                </div>
                <p className="text-sm text-gray-600 bg-gray-50/80 p-3.5 rounded-xl border border-gray-100">
                  控制词汇选择的多样性。较低值使模型更聚焦，较高值增加随机性。
                </p>
              </div>
            </div>

            {/* Frequency Penalty */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-5">
                <div className="p-1.5 rounded-lg bg-pink-100 text-pink-500">
                  <AutoAwesomeMotion className="h-5 w-5" />
                </div>
                <h3 className="font-semibold text-gray-800">频率惩罚</h3>
              </div>
              <div className="space-y-3">
                <input
                  type="range"
                  min="0"
                  max="2"
                  step="0.01"
                  value={config.frequency_penalty}
                  onChange={handleChange('frequency_penalty')}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-sm text-gray-600">
                  <span>重复 (0)</span>
                  <span className="font-medium text-pink-600">{config.frequency_penalty}</span>
                  <span>新颖 (2)</span>
                </div>
                <p className="text-sm text-gray-600 bg-gray-50/80 p-3.5 rounded-xl border border-gray-100">
                  减少重复内容的出现。较高值鼓励模型使用不同的词汇和表达方式。
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>
        {`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        
        .slider::-webkit-slider-thumb:hover {
          transform: scale(1.1);
          box-shadow: 0 4px 8px rgba(0,0,0,0.3);
        }
        
        .slider::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        
        @keyframes fadeIn {
          0% { opacity: 0; transform: scale(0.8) translate(5px, -5px); }
          70% { opacity: 1; transform: scale(1.1) translate(0, 0); }
          100% { opacity: 1; transform: scale(1); }
        }
        
        @keyframes checkmark {
          0% { transform: scale(0); }
          50% { transform: scale(1.2); }
          100% { transform: scale(1); }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out forwards;
        }
        
        .animate-checkmark {
          animation: checkmark 0.3s ease-out forwards;
          animation-delay: 0.1s;
          transform-origin: center;
        }
        `}
      </style>
    </div>
  );
});

ModelConfigurationStep.displayName = 'ModelConfigurationStep';

export default ModelConfigurationStep;