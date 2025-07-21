import React, { useState, useEffect } from 'react';
import { Database, Zap, Clock, Cpu, HardDrive, CheckCircle, AlertTriangle, Info, Settings } from 'lucide-react';
import { Button } from '../../ui/Button';

export type VectorIndexType = 'hnsw' | 'flat' | 'ivf_flat' | 'ivf_pq' | 'ivf_hnsw';

interface IndexConfig {
  indexType: VectorIndexType;
  parameters: Record<string, any>;
}

interface IndexOption {
  id: VectorIndexType;
  name: string;
  displayName: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  performance: {
    speed: number;      // 1-5 (5最快)
    accuracy: number;   // 1-5 (5最准确)
    memory: number;     // 1-5 (5最省内存)
    buildTime: number;  // 1-5 (5最快构建)
  };
  recommended: {
    dataSize: string;
    useCase: string[];
  };
  defaultParams: Record<string, any>;
  parameterSchema: Array<{
    key: string;
    label: string;
    type: 'number' | 'select';
    min?: number;
    max?: number;
    step?: number;
    options?: Array<{ value: any; label: string }>;
    description: string;
    required?: boolean;
  }>;
}

interface IndexConfigSelectorProps {
  value?: IndexConfig;
  onChange?: (config: IndexConfig) => void;
  disabled?: boolean;
  showRecommendations?: boolean;
  className?: string;
}

const indexOptions: IndexOption[] = [
  {
    id: 'hnsw',
    name: 'HNSW',
    displayName: '分层导航小世界图',
    description: '基于图的近似最近邻搜索，平衡了速度和精度，适合大多数场景',
    icon: <Database size={20} className="text-blue-600" />,
    color: 'border-blue-200 bg-blue-50',
    performance: {
      speed: 5,
      accuracy: 4,
      memory: 3,
      buildTime: 3
    },
    recommended: {
      dataSize: '中大型数据集 (10K-10M+ 向量)',
      useCase: ['通用搜索', '实时查询', '生产环境']
    },
    defaultParams: {
      M: 16,
      efConstruction: 200,
      ef: 100
    },
    parameterSchema: [
      {
        key: 'M',
        label: 'M (邻居数量)',
        type: 'number',
        min: 4,
        max: 64,
        step: 2,
        description: '每个节点的最大连接数，影响精度和内存使用',
        required: true
      },
      {
        key: 'efConstruction',
        label: 'ef Construction',
        type: 'number',
        min: 100,
        max: 1000,
        step: 50,
        description: '构建时的搜索范围，影响构建质量和时间',
        required: true
      },
      {
        key: 'ef',
        label: 'ef (搜索范围)',
        type: 'number',
        min: 50,
        max: 500,
        step: 25,
        description: '搜索时的候选范围，影响召回率和速度',
        required: true
      }
    ]
  },
  {
    id: 'flat',
    name: 'FLAT',
    displayName: '暴力搜索',
    description: '精确搜索，保证100%召回率，适合小型数据集或要求极高精度的场景',
    icon: <Zap size={20} className="text-green-600" />,
    color: 'border-green-200 bg-green-50',
    performance: {
      speed: 2,
      accuracy: 5,
      memory: 5,
      buildTime: 5
    },
    recommended: {
      dataSize: '小型数据集 (<10K 向量)',
      useCase: ['高精度要求', '基准测试', '小规模应用']
    },
    defaultParams: {},
    parameterSchema: []
  },
  {
    id: 'ivf_flat',
    name: 'IVF_FLAT',
    displayName: '倒排文件 + 暴力搜索',
    description: '使用聚类减少搜索空间，在中型数据集上平衡速度和精度',
    icon: <Cpu size={20} className="text-purple-600" />,
    color: 'border-purple-200 bg-purple-50',
    performance: {
      speed: 4,
      accuracy: 4,
      memory: 4,
      buildTime: 4
    },
    recommended: {
      dataSize: '中型数据集 (10K-1M 向量)',
      useCase: ['批量搜索', '离线分析', '中等精度要求']
    },
    defaultParams: {
      nlist: 100,
      nprobe: 10
    },
    parameterSchema: [
      {
        key: 'nlist',
        label: 'nlist (聚类数量)',
        type: 'number',
        min: 50,
        max: 2000,
        step: 50,
        description: '聚类中心数量，影响搜索精度和速度',
        required: true
      },
      {
        key: 'nprobe',
        label: 'nprobe (搜索聚类数)',
        type: 'number',
        min: 1,
        max: 100,
        step: 1,
        description: '搜索时检查的聚类数量，影响召回率',
        required: true
      }
    ]
  },
  {
    id: 'ivf_pq',
    name: 'IVF_PQ',
    displayName: '倒排文件 + 乘积量化',
    description: '使用乘积量化压缩向量，大幅减少内存使用，适合大规模数据',
    icon: <HardDrive size={20} className="text-orange-600" />,
    color: 'border-orange-200 bg-orange-50',
    performance: {
      speed: 4,
      accuracy: 3,
      memory: 5,
      buildTime: 3
    },
    recommended: {
      dataSize: '大型数据集 (1M+ 向量)',
      useCase: ['内存受限', '大规模检索', '压缩存储']
    },
    defaultParams: {
      nlist: 100,
      m: 8,
      nbits: 8,
      nprobe: 10
    },
    parameterSchema: [
      {
        key: 'nlist',
        label: 'nlist (聚类数量)',
        type: 'number',
        min: 50,
        max: 2000,
        step: 50,
        description: '聚类中心数量',
        required: true
      },
      {
        key: 'm',
        label: 'm (子向量数)',
        type: 'select',
        options: [
          { value: 4, label: '4' },
          { value: 8, label: '8' },
          { value: 16, label: '16' },
          { value: 32, label: '32' }
        ],
        description: '向量分割的子向量数量，必须整除向量维度',
        required: true
      },
      {
        key: 'nbits',
        label: 'nbits (量化位数)',
        type: 'select',
        options: [
          { value: 4, label: '4 bits' },
          { value: 6, label: '6 bits' },
          { value: 8, label: '8 bits' }
        ],
        description: '每个子向量的量化位数',
        required: true
      },
      {
        key: 'nprobe',
        label: 'nprobe (搜索聚类数)',
        type: 'number',
        min: 1,
        max: 100,
        step: 1,
        description: '搜索时检查的聚类数量',
        required: true
      }
    ]
  },
  {
    id: 'ivf_hnsw',
    name: 'IVF_HNSW',
    displayName: '倒排文件 + HNSW',
    description: '结合IVF和HNSW的优势，适合超大规模高性能搜索',
    icon: <Settings size={20} className="text-red-600" />,
    color: 'border-red-200 bg-red-50',
    performance: {
      speed: 5,
      accuracy: 5,
      memory: 2,
      buildTime: 2
    },
    recommended: {
      dataSize: '超大型数据集 (10M+ 向量)',
      useCase: ['高性能搜索', '企业级应用', '超大规模']
    },
    defaultParams: {
      nlist: 100,
      M: 16,
      efConstruction: 200,
      nprobe: 10
    },
    parameterSchema: [
      {
        key: 'nlist',
        label: 'nlist (聚类数量)',
        type: 'number',
        min: 50,
        max: 2000,
        step: 50,
        description: '第一层聚类中心数量',
        required: true
      },
      {
        key: 'M',
        label: 'M (HNSW邻居数)',
        type: 'number',
        min: 4,
        max: 64,
        step: 2,
        description: 'HNSW图中每个节点的最大连接数',
        required: true
      },
      {
        key: 'efConstruction',
        label: 'ef Construction',
        type: 'number',
        min: 100,
        max: 1000,
        step: 50,
        description: 'HNSW构建时的搜索范围',
        required: true
      },
      {
        key: 'nprobe',
        label: 'nprobe (搜索聚类数)',
        type: 'number',
        min: 1,
        max: 100,
        step: 1,
        description: '搜索时检查的聚类数量',
        required: true
      }
    ]
  }
];

const IndexConfigSelector: React.FC<IndexConfigSelectorProps> = ({
  value,
  onChange,
  disabled = false,
  showRecommendations = true,
  className = ''
}) => {
  const [selectedOption, setSelectedOption] = useState<IndexOption>(
    indexOptions.find(opt => opt.id === value?.indexType) || indexOptions[0]
  );
  const [parameters, setParameters] = useState<Record<string, any>>(
    value?.parameters || selectedOption.defaultParams
  );
  const [showAdvanced, setShowAdvanced] = useState(false);

  // 当选择的索引类型改变时，重置参数
  useEffect(() => {
    if (value?.indexType !== selectedOption.id) {
      const newOption = indexOptions.find(opt => opt.id === value?.indexType) || selectedOption;
      setSelectedOption(newOption);
      setParameters(value?.parameters || newOption.defaultParams);
    }
  }, [value]);

  // 当配置变化时通知父组件
  useEffect(() => {
    onChange?.({
      indexType: selectedOption.id,
      parameters
    });
  }, [selectedOption, parameters, onChange]);

  // 更新参数
  const updateParameter = (key: string, value: any) => {
    setParameters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // 重置为默认参数
  const resetToDefaults = () => {
    setParameters(selectedOption.defaultParams);
  };

  // 性能指标显示
  const renderPerformanceBar = (label: string, value: number, color: string) => (
    <div className="flex items-center justify-between mb-2">
      <span className="text-xs text-gray-600 w-16">{label}</span>
      <div className="flex-1 mx-2">
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-300 ${color}`}
            style={{ width: `${(value / 5) * 100}%` }}
          ></div>
        </div>
      </div>
      <span className="text-xs text-gray-500 w-8 text-right">{value}/5</span>
    </div>
  );

  return (
    <div className={`space-y-6 select-none ${className}`}>
      {/* 标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">向量索引配置</h3>
          <p className="text-sm text-gray-500">选择适合您数据规模和性能需求的索引类型</p>
        </div>
        <Button
          size="sm"
          variant="secondary"
          onClick={() => setShowAdvanced(!showAdvanced)}
          disabled={disabled}
        >
          {showAdvanced ? '简化视图' : '高级配置'}
        </Button>
      </div>

      {/* 索引类型选择 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {indexOptions.map((option) => (
          <div
            key={option.id}
            onClick={() => !disabled && setSelectedOption(option)}
            className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 select-none ${
              selectedOption.id === option.id
                ? `${option.color} border-opacity-100 shadow-sm`
                : 'border-gray-200 bg-white hover:bg-gray-50'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <div className="flex items-center mb-3">
              {option.icon}
              <div className="ml-3">
                <h4 className="font-semibold text-gray-800 text-sm">{option.name}</h4>
                <p className="text-xs text-gray-600">{option.displayName}</p>
              </div>
              {selectedOption.id === option.id && (
                <CheckCircle size={16} className="ml-auto text-green-600" />
              )}
            </div>
            
            <p className="text-xs text-gray-600 mb-3 line-clamp-2">{option.description}</p>
            
            {/* 性能指标概览 */}
            <div className="space-y-1">
              {renderPerformanceBar('速度', option.performance.speed, 'bg-blue-500')}
              {renderPerformanceBar('精度', option.performance.accuracy, 'bg-green-500')}
              {renderPerformanceBar('内存', option.performance.memory, 'bg-purple-500')}
            </div>
          </div>
        ))}
      </div>

      {/* 选中索引的详细信息 */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center">
            {selectedOption.icon}
            <div className="ml-3">
              <h4 className="text-lg font-semibold text-gray-800">{selectedOption.name}</h4>
              <p className="text-sm text-gray-600">{selectedOption.displayName}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-gray-500">推荐数据规模</div>
            <div className="text-sm font-medium text-gray-700">{selectedOption.recommended.dataSize}</div>
          </div>
        </div>

        <p className="text-gray-600 mb-4">{selectedOption.description}</p>

        {/* 性能详细指标 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <Clock size={16} className="mx-auto mb-1 text-blue-600" />
            <div className="text-xs text-gray-600">查询速度</div>
            <div className="text-sm font-semibold text-gray-800">{selectedOption.performance.speed}/5</div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <CheckCircle size={16} className="mx-auto mb-1 text-green-600" />
            <div className="text-xs text-gray-600">搜索精度</div>
            <div className="text-sm font-semibold text-gray-800">{selectedOption.performance.accuracy}/5</div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <HardDrive size={16} className="mx-auto mb-1 text-purple-600" />
            <div className="text-xs text-gray-600">内存效率</div>
            <div className="text-sm font-semibold text-gray-800">{selectedOption.performance.memory}/5</div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <Cpu size={16} className="mx-auto mb-1 text-orange-600" />
            <div className="text-xs text-gray-600">构建速度</div>
            <div className="text-sm font-semibold text-gray-800">{selectedOption.performance.buildTime}/5</div>
          </div>
        </div>

        {/* 推荐用途 */}
        {showRecommendations && (
          <div className="mb-4">
            <h5 className="text-sm font-medium text-gray-700 mb-2">推荐用途:</h5>
            <div className="flex flex-wrap gap-2">
              {selectedOption.recommended.useCase.map((useCase, index) => (
                <span
                  key={index}
                  className="px-2 py-1 text-xs bg-blue-50 text-blue-700 rounded-md border border-blue-200"
                >
                  {useCase}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* 参数配置 */}
        {selectedOption.parameterSchema.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h5 className="text-sm font-medium text-gray-700">索引参数</h5>
              <Button
                size="sm"
                variant="ghost"
                onClick={resetToDefaults}
                disabled={disabled}
                className="text-xs"
              >
                恢复默认
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {selectedOption.parameterSchema.map((param) => (
                <div key={param.key} className="space-y-2">
                  <div className="flex items-center">
                    <label className="text-sm font-medium text-gray-700">
                      {param.label}
                      {param.required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                    <div className="ml-2 group relative">
                      <Info size={12} className="text-gray-400 cursor-help" />
                      <div className="invisible group-hover:visible absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-800 rounded whitespace-nowrap z-10">
                        {param.description}
                      </div>
                    </div>
                  </div>
                  
                  {param.type === 'number' ? (
                    <input
                      type="number"
                      min={param.min}
                      max={param.max}
                      step={param.step}
                      value={parameters[param.key] || ''}
                      onChange={(e) => updateParameter(param.key, parseInt(e.target.value))}
                      disabled={disabled}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm disabled:bg-gray-100 select-text"
                    />
                  ) : (
                    <select
                      value={parameters[param.key] || ''}
                      onChange={(e) => updateParameter(param.key, param.options?.find(opt => opt.value.toString() === e.target.value)?.value)}
                      disabled={disabled}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm disabled:bg-gray-100 select-text"
                    >
                      {param.options?.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  )}
                  
                  <p className="text-xs text-gray-500">{param.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 高级配置提示 */}
        {!showAdvanced && selectedOption.parameterSchema.length > 0 && (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center">
              <AlertTriangle size={16} className="text-yellow-600 mr-2" />
              <div>
                <p className="text-sm text-yellow-800">
                  当前使用默认参数。点击"高级配置"可自定义索引参数以优化性能。
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default IndexConfigSelector;