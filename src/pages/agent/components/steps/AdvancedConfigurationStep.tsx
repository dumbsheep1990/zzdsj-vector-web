import React, { useCallback, useMemo } from 'react';
// 保留只有图标的组件，如果需要的话
// import { } from '@mui/icons-material';

// 高级配置接口 - 简化版
export interface AdvancedConfiguration {
  execution_timeout: number;
  max_iterations: number;
  enable_streaming: boolean;
  enable_citations: boolean;
  privacy_level: 'public' | 'team' | 'private';
}

interface AdvancedConfigurationStepProps {
  config: AdvancedConfiguration;
  onConfigChange: (config: AdvancedConfiguration) => void;
}

// 静态数据提取
const PRIVACY_LEVELS = [
  { value: 'public', label: '公开', description: '所有用户可见和使用' },
  { value: 'team', label: '团队', description: '仅团队成员可见' },
  { value: 'private', label: '私有', description: '仅创建者可见' }
] as const;

const TIMEOUT_MARKS = [
  { value: 30, label: '30s' },
  { value: 180, label: '3m' },
  { value: 300, label: '5m' },
  { value: 600, label: '10m' }
];

const ITERATION_MARKS = [
  { value: 5, label: '5' },
  { value: 15, label: '15' },
  { value: 25, label: '25' },
  { value: 50, label: '50' }
];

const AdvancedConfigurationStep: React.FC<AdvancedConfigurationStepProps> = React.memo(({
  config,
  onConfigChange
}) => {
  const handleToggle = useCallback((field: keyof AdvancedConfiguration) => () => {
    onConfigChange({
      ...config,
      [field]: !config[field]
    });
  }, [config, onConfigChange]);

  const handleSliderChange = useCallback((field: keyof AdvancedConfiguration) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    onConfigChange({
      ...config,
      [field]: Number(event.target.value)
    });
  }, [config, onConfigChange]);

  const handleSelectChange = useCallback((field: keyof AdvancedConfiguration) => (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    onConfigChange({
      ...config,
      [field]: event.target.value
    });
  }, [config, onConfigChange]);

  const timeoutDescription = useMemo(() => {
    const timeout = config.execution_timeout;
    if (timeout <= 60) return '快速响应';
    if (timeout <= 180) return '标准等待';
    if (timeout <= 300) return '长时间处理';
    return '超长等待';
  }, [config.execution_timeout]);

  const iterationDescription = useMemo(() => {
    const iterations = config.max_iterations;
    if (iterations <= 5) return '快速执行';
    if (iterations <= 15) return '标准处理';
    if (iterations <= 25) return '深度处理';
    return '极致处理';
  }, [config.max_iterations]);

  return (
    <div className="w-full max-w-4xl mx-auto px-6 py-8 pb-24">
      {/* 标题区域 - 现代简洁设计 */}
      <div className="flex flex-col items-center mb-8">
        <div className="inline-flex justify-center items-center mb-4">
          <span className="bg-gradient-to-r from-indigo-100 to-blue-100 text-center text-sm font-medium text-indigo-800 px-4 py-1.5 rounded-full shadow-sm">
            高级设置
          </span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-gray-800 to-gray-900 bg-clip-text text-transparent">
          高级配置
        </h1>
        <p className="text-gray-500 mt-2 text-center">
          调整执行参数和隐私设置，优化智能体行为
        </p>
      </div>

      {/* 执行参数卡片 */}
      <div className="bg-white rounded-2xl shadow-md mb-6 overflow-hidden">
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6">执行参数</h2>

          <div className="space-y-8">
            {/* 执行超时时间 */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <div>
                  <h3 className="text-base font-medium text-gray-800">执行超时时间</h3>
                  <p className="text-sm text-gray-500">{timeoutDescription}</p>
                </div>
                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
                  {config.execution_timeout}秒
                </span>
              </div>

              <div className="relative pt-1">
                <input
                  type="range"
                  min="30"
                  max="600"
                  step="30"
                  value={config.execution_timeout}
                  onChange={handleSliderChange('execution_timeout')}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  {TIMEOUT_MARKS.map((mark) => (
                    <span key={mark.value}>
                      {mark.label}
                    </span>
                  ))}
                </div>
              </div>
              
              <p className="text-xs text-gray-500 mt-2">
                任务执行的最大等待时间，超过此时间将自动终止
              </p>
            </div>

            {/* 最大迭代次数 */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <div>
                  <h3 className="text-base font-medium text-gray-800">最大迭代次数</h3>
                  <p className="text-sm text-gray-500">{iterationDescription}</p>
                </div>
                <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
                  {config.max_iterations}次
                </span>
              </div>

              <div className="relative pt-1">
                <input
                  type="range"
                  min="1"
                  max="50"
                  step="1"
                  value={config.max_iterations}
                  onChange={handleSliderChange('max_iterations')}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                />
                
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  {ITERATION_MARKS.map((mark) => (
                    <span key={mark.value}>
                      {mark.label}
                    </span>
                  ))}
                </div>
              </div>
              
              <p className="text-xs text-gray-500 mt-2">
                复杂任务的最大处理轮次，影响答案质量和响应时间
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 功能设置卡片 */}
      <div className="bg-white rounded-2xl shadow-md mb-6 overflow-hidden">
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6">功能设置</h2>

          <div className="space-y-4">
            {/* 流式输出设置 */}
            <div 
              className={`p-4 rounded-xl border transition-all ${
                config.enable_streaming 
                  ? 'bg-blue-50 border-blue-200' 
                  : 'bg-white border-gray-200'
              }`}
            >
              <label className="flex items-center justify-between cursor-pointer">
                <div className="flex-1">
                  <h3 className="text-base font-medium text-gray-800">流式输出</h3>
                  <p className="text-sm text-gray-500 mt-1">实时显示AI生成的回答内容</p>
                </div>
                
                <div className="relative inline-block w-12 align-middle">
                  <input 
                    type="checkbox" 
                    id="enable_streaming"
                    checked={config.enable_streaming}
                    onChange={handleToggle('enable_streaming')}
                    className="sr-only peer"
                  />
                  <div className="h-6 w-12 rounded-full bg-gray-200 peer-checked:bg-blue-600 peer-focus:outline-none transition-colors"></div>
                  <div className="absolute left-1 top-1 bg-white h-4 w-4 rounded-full transition peer-checked:translate-x-6"></div>
                </div>
              </label>
            </div>

            {/* 引用功能设置 */}
            <div 
              className={`p-4 rounded-xl border transition-all ${
                config.enable_citations 
                  ? 'bg-blue-50 border-blue-200' 
                  : 'bg-white border-gray-200'
              }`}
            >
              <label className="flex items-center justify-between cursor-pointer">
                <div className="flex-1">
                  <h3 className="text-base font-medium text-gray-800">引用功能</h3>
                  <p className="text-sm text-gray-500 mt-1">自动标注信息来源和引用</p>
                </div>
                
                <div className="relative inline-block w-12 align-middle">
                  <input 
                    type="checkbox" 
                    id="enable_citations"
                    checked={config.enable_citations}
                    onChange={handleToggle('enable_citations')}
                    className="sr-only peer"
                  />
                  <div className="h-6 w-12 rounded-full bg-gray-200 peer-checked:bg-blue-600 peer-focus:outline-none transition-colors"></div>
                  <div className="absolute left-1 top-1 bg-white h-4 w-4 rounded-full transition peer-checked:translate-x-6"></div>
                </div>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* 隐私设置卡片 */}
      <div className="bg-white rounded-2xl shadow-md overflow-hidden">
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6">隐私级别</h2>

          <div className="mb-6">
            <label htmlFor="privacy-level" className="block text-sm font-medium text-gray-700 mb-2">
              选择隐私级别
            </label>
            <select
              id="privacy-level"
              value={config.privacy_level}
              onChange={handleSelectChange('privacy_level')}
              className="block w-full px-4 py-3 bg-white border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              {PRIVACY_LEVELS.map((level) => (
                <option key={level.value} value={level.value}>
                  {level.label} - {level.description}
                </option>
              ))}
            </select>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-blue-700">
                  隐私级别决定了智能体的可见性和使用权限。选择适合您团队的设置。
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

AdvancedConfigurationStep.displayName = 'AdvancedConfigurationStep';

export default AdvancedConfigurationStep;
