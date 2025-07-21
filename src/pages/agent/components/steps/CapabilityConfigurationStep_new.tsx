import React, { useCallback, useMemo } from 'react';
// 图标 - 保留MUI图标组件以保持一致的图标集
import CodeIcon from '@mui/icons-material/Code';
import PsychologyIcon from '@mui/icons-material/Psychology';
import DataObjectIcon from '@mui/icons-material/DataObject';
import SearchIcon from '@mui/icons-material/Search';
import LanguageIcon from '@mui/icons-material/Language';
import ImageIcon from '@mui/icons-material/Image';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import SecurityIcon from '@mui/icons-material/Security';
import SpeedIcon from '@mui/icons-material/Speed';
import ApiIcon from '@mui/icons-material/Api';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import CodeTwoToneIcon from '@mui/icons-material/CodeTwoTone';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import StarIcon from '@mui/icons-material/Star';

// 能力配置接口
export interface CapabilityConfiguration {
  tools: string[];
  integrations: string[];
  customInstructions: string;
}

interface CapabilityConfigurationStepProps {
  config: CapabilityConfiguration;
  onConfigChange: (config: CapabilityConfiguration) => void;
}

// 工具数据 - 参考工具广场的设计
// 工具分类数据定义
const TOOL_CATEGORIES = [
  {
    id: 'data-processing',
    name: '数据处理',
    description: '数据爬取、清洗、格式化工具',
    // Tailwind CSS 渐变色和样式类
    gradientClass: 'from-blue-500 to-blue-700',
    bgClass: 'bg-blue-50',
    textClass: 'text-blue-600',
    borderClass: 'border-blue-200',
    hoverClass: 'hover:bg-blue-100',
    darkHoverClass: 'group-hover:text-blue-100',
    selectedClass: 'bg-blue-700',
    lightTextClass: 'text-blue-200',
    icon: <DataObjectIcon className="h-5 w-5" />,
    tools: [
      {
        id: 'web-scraper',
        name: 'Web 爬虫',
        description: '智能网页数据抓取工具',
        icon: <SearchIcon className="h-5 w-5" />,
        tags: ['爬虫', '数据采集'],
        usageCount: 1247,
        recommended: true
      },
      {
        id: 'data-cleaner',
        name: '数据清洗',
        description: '自动清理和标准化数据',
        icon: <AnalyticsIcon className="h-5 w-5" />,
        tags: ['清洗', '标准化'],
        usageCount: 892
      },
      {
        id: 'format-converter',
        name: '格式转换',
        description: '多种数据格式互转',
        icon: <CodeIcon className="h-5 w-5" />,
        tags: ['转换', '格式化'],
        usageCount: 634
      }
    ]
  },
  {
    id: 'ai-tools',
    name: 'AI 工具',
    description: '人工智能增强功能',
    // Tailwind CSS 渐变色和样式类
    gradientClass: 'from-purple-600 to-purple-800',
    bgClass: 'bg-purple-50',
    textClass: 'text-purple-600',
    borderClass: 'border-purple-200',
    hoverClass: 'hover:bg-purple-100',
    darkHoverClass: 'group-hover:text-purple-100',
    selectedClass: 'bg-purple-700',
    lightTextClass: 'text-purple-200',
    icon: <PsychologyIcon className="h-5 w-5" />,
    tools: [
      {
        id: 'text-analyzer',
        name: '文本分析',
        description: '智能文本理解和分析',
        icon: <LanguageIcon className="h-5 w-5" />,
        tags: ['NLP', '分析'],
        usageCount: 2156,
        recommended: true
      },
      {
        id: 'image-processor',
        name: '图像处理',
        description: 'AI驱动的图像识别和处理',
        icon: <ImageIcon className="h-5 w-5" />,
        tags: ['图像', 'AI'],
        usageCount: 987
      },
      {
        id: 'code-generator',
        name: '代码生成',
        description: '智能代码生成和优化',
        icon: <CodeIcon className="h-5 w-5" />,
        tags: ['代码', '生成'],
        usageCount: 1543
      }
    ]
  },
  {
    id: 'api-integrations',
    name: 'API 集成',
    description: '第三方服务集成',
    // Tailwind CSS 渐变色和样式类
    gradientClass: 'from-green-500 to-green-700',
    bgClass: 'bg-green-50',
    textClass: 'text-green-600',
    borderClass: 'border-green-200',
    hoverClass: 'hover:bg-green-100',
    darkHoverClass: 'group-hover:text-green-100',
    selectedClass: 'bg-green-700',
    lightTextClass: 'text-green-200',
    icon: <ApiIcon className="h-5 w-5" />,
    tools: [
      {
        id: 'cloud-storage',
        name: '云存储',
        description: '多平台云存储集成',
        icon: <CloudUploadIcon className="h-5 w-5" />,
        tags: ['存储', '云服务'],
        usageCount: 756
      },
      {
        id: 'payment-gateway',
        name: '支付网关',
        description: '多种支付方式集成',
        icon: <SecurityIcon className="h-5 w-5" />,
        tags: ['支付', '安全'],
        usageCount: 435
      },
      {
        id: 'notification-service',
        name: '通知服务',
        description: '多渠道消息推送',
        icon: <SpeedIcon className="h-5 w-5" />,
        tags: ['通知', '推送'],
        usageCount: 612,
        recommended: true
      }
    ]
  }
];

const CapabilityConfigurationStep: React.FC<CapabilityConfigurationStepProps> = React.memo(({
  config,
  onConfigChange
}) => {
  const handleToolToggle = useCallback((toolId: string) => {
    const isSelected = config.tools.includes(toolId);
    const newTools = isSelected
      ? config.tools.filter(id => id !== toolId)
      : [...config.tools, toolId];
    
    onConfigChange({
      ...config,
      tools: newTools
    });
  }, [config, onConfigChange]);

  const handleInstructionsChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onConfigChange({
      ...config,
      customInstructions: e.target.value
    });
  }, [config, onConfigChange]);

  const selectedToolsCount = useMemo(() => config.tools.length, [config.tools]);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8 pb-24">
      {/* 标题区域 - 现代简洁设计 */}
      <div className="flex flex-col items-center mb-6">
        <div className="inline-flex justify-center items-center mb-4">
          <span className="bg-gradient-to-r from-purple-100 to-blue-100 text-center text-sm font-medium text-purple-800 px-4 py-1.5 rounded-full shadow-sm">
            智能体能力
          </span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-gray-800 to-gray-900 bg-clip-text text-transparent">
          配置智能体能力
        </h1>
      </div>

      {/* 工具选择区域 */}
      <div className="bg-white rounded-2xl shadow-md mb-6 overflow-hidden">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 text-white">
                <AutoAwesomeIcon className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-1">工具广场</h2>
                <p className="text-sm text-gray-500">从工具广场选择适合的工具增强智能体能力</p>
              </div>
            </div>
            <div className="relative">
              <span className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-100 text-blue-600 py-1 px-3 text-sm font-medium rounded-full">
                已选工具
                <span className="ml-1 inline-flex items-center justify-center w-5 h-5 text-xs bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full">
                  {selectedToolsCount}
                </span>
              </span>
            </div>
          </div>

          {/* 工具分类 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {TOOL_CATEGORIES.map((category) => (
              <div 
                key={category.id} 
                className={`rounded-xl border ${category.borderClass} ${category.bgClass} overflow-hidden group transition-all duration-200 hover:shadow-md`}
              >
                <div className="p-5">
                  {/* 分类头部 */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`p-2 rounded-lg bg-gradient-to-br ${category.gradientClass} text-white flex items-center justify-center`}>
                      {category.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className={`font-bold ${category.textClass}`}>
                        {category.name}
                      </h3>
                      <p className="text-xs text-gray-500">
                        {category.description}
                      </p>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${category.bgClass} ${category.textClass} border ${category.borderClass}`}>
                      {category.tools.length} 工具
                    </span>
                  </div>

                  <div className="h-px bg-gray-100 mb-4"></div>

                  {/* 工具列表 */}
                  <div className="flex flex-col gap-3">
                    {category.tools.map((tool) => {
                      const isSelected = config.tools.includes(tool.id);
                      return (
                        <div 
                          key={tool.id}
                          onClick={() => handleToolToggle(tool.id)}
                          className={`p-3 rounded-lg border ${isSelected ? `${category.selectedClass} text-white` : `${category.borderClass} ${category.bgClass}`} cursor-pointer transition-all duration-200 ${category.hoverClass} relative overflow-hidden`}
                        >
                          <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-2">
                              <div className={`p-1.5 rounded-md ${isSelected ? 'bg-white/20' : `${category.bgClass}`} ${isSelected ? 'text-white' : category.textClass} flex items-center justify-center`}>
                                {tool.icon}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-1">
                                  <h4 className={`text-sm font-semibold ${isSelected ? 'text-white' : 'text-gray-800'}`}>
                                    {tool.name}
                                  </h4>
                                  {tool.recommended && (
                                    <StarIcon className="h-4 w-4 text-amber-400" />
                                  )}
                                </div>
                                <p className={`text-xs ${isSelected ? 'text-white/90' : 'text-gray-500'}`}>
                                  {tool.description}
                                </p>
                              </div>
                              <div className={`rounded-full w-5 h-5 flex items-center justify-center ${isSelected ? 'bg-white/20' : 'bg-white'} border ${isSelected ? 'border-white/30' : category.borderClass}`}>
                                {isSelected ? <CheckCircleIcon className="h-4 w-4 text-white" /> : <RadioButtonUncheckedIcon className={`h-4 w-4 ${category.textClass}`} />}
                              </div>
                            </div>

                            <div className="flex items-center justify-between">
                              <div className="flex flex-wrap gap-1">
                                {tool.tags.map((tag) => (
                                  <span
                                    key={tag}
                                    className={`text-[10px] py-0.5 px-1.5 rounded-full ${isSelected ? 'bg-white/20 text-white/90' : `${category.bgClass} ${category.textClass}`} ${isSelected ? 'border-white/10' : category.borderClass} border`}
                                  >
                                    {tag}
                                  </span>
                                ))}
                              </div>
                              <span className={`text-[10px] ${isSelected ? 'text-white/70' : 'text-gray-400'}`}>
                                {tool.usageCount} 次使用
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 自定义指令 */}
      <div className="bg-white rounded-2xl shadow-md overflow-hidden">
        <div className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
              <CodeTwoToneIcon className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-1">自定义指令</h2>
              <p className="text-sm text-gray-500">为智能体添加特定的行为指令和约束条件</p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 backdrop-blur-sm bg-opacity-70">
            <textarea
              className="w-full p-4 rounded-xl bg-white/80 backdrop-blur-sm border border-indigo-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-300 transition-all resize-none min-h-[160px]"
              value={config.customInstructions}
              onChange={handleInstructionsChange}
              placeholder="请输入自定义指令，例如：
• 始终以友好和专业的语气回复
• 在回答技术问题时提供代码示例
• 对于敏感话题保持中立立场
• 优先使用中文回复，除非用户明确要求其他语言"
              rows={6}
            />
            
            <div className="mt-4 flex items-center justify-between">
              <p className="text-xs text-gray-500">
                提示：清晰的指令能帮助智能体更好地理解您的需求
              </p>
              <span className="text-xs text-gray-400">
                {config.customInstructions.length} / 2000 字符
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

CapabilityConfigurationStep.displayName = 'CapabilityConfigurationStep';

export default CapabilityConfigurationStep;
