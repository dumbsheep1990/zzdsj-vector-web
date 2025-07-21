import React, { useCallback } from 'react';
import { Box, Typography, Button, IconButton, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Settings, CheckCircle, ArrowLeft, Check } from 'lucide-react';

// 导入模板选择步骤组件
import BasicInfoStep, { AgentTemplate } from './components/BasicInfoStep';
import BuilderHeader from './components/BuilderHeader';

// 导入模板专用配置组件
import {
  SimpleQAFlowConfig,
  DeepThinkingFlowConfig,
  IntelligentPlanningFlowConfig,
  defaultSimpleQAConfig,
  defaultDeepThinkingConfig,
  defaultIntelligentPlanningConfig
} from './components/TemplateFlowConfigs';

// 导入简单问答模板的分解配置组件
import {
  SystemInstructionsConfig,
  defaultSimpleQAConfig as defaultConfig
} from './components/SimpleQAConfigs';

// 导入自定义钩子及其类型（使用相对路径）
import { useFlowBuilderState, FlowModule, FlowStep } from './hooks/useFlowBuilderState';

// 定义磨砂背景容器 - 与AgentBuilder相同
const GlassmorphismBackground = styled(Box)(({ theme }) => ({
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  width: '100%',
  height: '100%',
  zIndex: -1,
  background: `linear-gradient(135deg, ${theme.palette.primary.light}30, ${theme.palette.secondary.light}40, ${theme.palette.info.light}30)`,
  pointerEvents: 'none',
  '&:before': {
    content: '""',
    position: 'absolute',
    top: 0,
    right: 0,
    width: '400px',
    height: '400px',
    background: `radial-gradient(circle, ${theme.palette.primary.main}30 0%, transparent 70%)`,
    borderRadius: '50%',
    transform: 'translate(20%, -20%)',
    filter: 'blur(40px)',
    pointerEvents: 'none'
  },
  '&:after': {
    content: '""',
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '500px',
    height: '500px',
    background: `radial-gradient(circle, ${theme.palette.secondary.main}30 0%, transparent 70%)`,
    borderRadius: '50%',
    transform: 'translate(-20%, 20%)',
    filter: 'blur(40px)',
    pointerEvents: 'none'
  }
}));

// 内容容器组件 - 与AgentBuilder相同
const ContentWrapper = styled(Box)(() => ({
  position: 'relative',
  zIndex: 1,
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden'
}));

// 模型数据定义
const MODEL_PROVIDERS = [
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
    id: 'deepseek',
    name: 'DeepSeek',
    logo: 'https://api.deepseek.com/favicon.ico',
    description: 'DeepSeek深度求索大模型',
    models: [
      { id: 'deepseek-chat', name: 'DeepSeek Chat', description: '对话优化模型', recommended: true },
      { id: 'deepseek-coder', name: 'DeepSeek Coder', description: '代码生成专用' },
      { id: 'deepseek-math', name: 'DeepSeek Math', description: '数学推理专用' }
    ]
  },
  {
    id: 'kimi',
    name: 'Kimi',
    logo: 'https://kimi.moonshot.cn/favicon.ico',
    description: 'Moonshot AI Kimi大模型',
    models: [
      { id: 'moonshot-v1-8k', name: 'Moonshot v1 8K', description: '标准上下文模型' },
      { id: 'moonshot-v1-32k', name: 'Moonshot v1 32K', description: '长上下文模型', recommended: true },
      { id: 'moonshot-v1-128k', name: 'Moonshot v1 128K', description: '超长上下文模型' }
    ]
  },
  {
    id: 'local',
    name: '本地模型',
    logo: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iMTAiIGZpbGw9IiMwMDAwMDAiLz4KPGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iNiIgZmlsbD0iIzAwMDAwMCIgc3Ryb2tlPSIjZmZmZmZmIiBzdHJva2Utd2lkdGg9IjIiLz4KPGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iMiIgZmlsbD0iI2ZmZmZmZiIvPgo8L3N2Zz4K',
    description: '本地部署模型，私有化部署',
    models: [
      { id: 'llama-3-8b', name: 'Llama 3 8B', description: '轻量级开源模型' },
      { id: 'llama-3-70b', name: 'Llama 3 70B', description: '大型开源模型', recommended: true },
      { id: 'chatglm-6b', name: 'ChatGLM 6B', description: '中文优化模型' },
      { id: 'custom-model', name: '自定义模型', description: '用户自定义模型' }
    ]
  },
  {
    id: 'third-party',
    name: '第三方',
    logo: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHJ4PSI0IiBmaWxsPSIjNjM2NmYxIi8+CiAgPHRleHQgeD0iMTIiIHk9IjE1IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSJ3aGl0ZSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjgiIGZvbnQtd2VpZ2h0PSJib2xkIj5BUEk8L3RleHQ+Cjwvc3ZnPgo=',
    description: '第三方API服务提供商',
    models: [
      { id: 'openai-gpt-4', name: 'OpenAI GPT-4', description: 'OpenAI最新模型', recommended: true },
      { id: 'openai-gpt-3.5', name: 'OpenAI GPT-3.5', description: '高性价比选择' },
      { id: 'claude-3', name: 'Anthropic Claude 3', description: 'Anthropic最新模型' },
      { id: 'gemini-pro', name: 'Google Gemini Pro', description: 'Google AI模型' }
    ]
  }
];

// 响应参数配置组件 - 重新设计
const ResponseParametersConfig: React.FC = () => {
  const [temperature, setTemperature] = React.useState(0.7);
  const [maxTokens, setMaxTokens] = React.useState(1000);
  const [topP, setTopP] = React.useState(0.9);
  const [frequencyPenalty, setFrequencyPenalty] = React.useState(0);
  const [presencePenalty, setPresencePenalty] = React.useState(0);

  const parameterCards = [
    {
      title: '创造性',
      subtitle: 'Temperature',
      value: temperature,
      setter: setTemperature,
      min: 0,
      max: 2,
      step: 0.1,
      color: '#6366f1',
      leftLabel: '保守',
      rightLabel: '创造',
      icon: '🎨',
      description: '控制AI回答的随机性和创造性'
    },
    {
      title: '最大长度',
      subtitle: 'Max Tokens',
      value: maxTokens,
      setter: setMaxTokens,
      min: 100,
      max: 4000,
      step: 100,
      color: '#8b5cf6',
      leftLabel: '100',
      rightLabel: '4000',
      icon: '📏',
      description: '设置AI回答的最大字符长度'
    },
    {
      title: '核采样',
      subtitle: 'Top P',
      value: topP,
      setter: setTopP,
      min: 0,
      max: 1,
      step: 0.1,
      color: '#10b981',
      leftLabel: '0.0',
      rightLabel: '1.0',
      icon: '🎯',
      description: '控制词汇选择的多样性'
    },
    {
      title: '频率惩罚',
      subtitle: 'Frequency Penalty',
      value: frequencyPenalty,
      setter: setFrequencyPenalty,
      min: -2,
      max: 2,
      step: 0.1,
      color: '#f59e0b',
      leftLabel: '-2.0',
      rightLabel: '2.0',
      icon: '🔄',
      description: '减少重复词汇的出现频率'
    },
    {
      title: '存在惩罚',
      subtitle: 'Presence Penalty',
      value: presencePenalty,
      setter: setPresencePenalty,
      min: -2,
      max: 2,
      step: 0.1,
      color: '#ef4444',
      leftLabel: '-2.0',
      rightLabel: '2.0',
      icon: '🚫',
      description: '鼓励AI谈论新话题'
    }
  ];

  const calculateProgress = (value: number, min: number, max: number) => {
    return ((value - min) / (max - min)) * 100;
  };

  return (
    <Box sx={{ 
      background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.9) 100%)',
      borderRadius: 3,
      p: 2,
      border: '1px solid rgba(0, 0, 0, 0.06)',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)'
    }}>
      {/* 参数配置区域 */}
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', 
        gap: 2, 
        mb: 0 
      }}>
        {parameterCards.map((param, index) => (
          <Box key={index} sx={{
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.85) 100%)',
            borderRadius: 2.5,
            p: 2,
            border: '1px solid rgba(0, 0, 0, 0.06)',
            boxShadow: '0 2px 12px rgba(0, 0, 0, 0.04)',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: `0 8px 25px ${param.color}15`,
              borderColor: `${param.color}30`
            }
          }}>
            {/* 参数头部 */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box sx={{
                  width: 32,
                  height: 32,
                  borderRadius: 2,
                  background: `linear-gradient(135deg, ${param.color}15 0%, ${param.color}25 100%)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '16px'
                }}>
                  {param.icon}
                </Box>
                <Box>
                  <Typography variant="subtitle2" sx={{ 
                    fontWeight: 700, 
                    color: 'text.primary',
                    fontSize: '15px'
                  }}>
                    {param.title}
                  </Typography>
                  <Typography variant="caption" sx={{ 
                    color: 'text.secondary',
                    fontSize: '12px',
                    fontWeight: 500
                  }}>
                    {param.subtitle}
                  </Typography>
                </Box>
              </Box>
              
              {/* 数值显示 */}
              <Box sx={{
                px: 2,
                py: 1,
                borderRadius: 2,
                background: `linear-gradient(135deg, ${param.color} 0%, ${param.color}dd 100%)`,
                color: 'white',
                fontWeight: 700,
                fontSize: '14px',
                minWidth: '60px',
                textAlign: 'center',
                boxShadow: `0 2px 8px ${param.color}30`
              }}>
                {typeof param.value === 'number' ? param.value.toFixed(param.step < 1 ? 1 : 0) : param.value}
              </Box>
            </Box>

            {/* 滑块 */}
            <Box sx={{ px: 0.5, mb: 1.5 }}>
              <Box 
                component="input"
                type="range"
                min={param.min}
                max={param.max}
                step={param.step}
                value={param.value}
                onChange={(e) => param.setter(param.step < 1 ? parseFloat((e.target as HTMLInputElement).value) : parseInt((e.target as HTMLInputElement).value))}
                sx={{
                  width: '100%',
                  height: '8px',
                  borderRadius: '4px',
                  background: `linear-gradient(to right, ${param.color} 0%, ${param.color} ${calculateProgress(param.value, param.min, param.max)}%, #e5e7eb ${calculateProgress(param.value, param.min, param.max)}%, #e5e7eb 100%)`,
                  outline: 'none',
                  WebkitAppearance: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  '&::-webkit-slider-thumb': {
                    WebkitAppearance: 'none',
                    appearance: 'none',
                    height: '20px',
                    width: '20px',
                    borderRadius: '50%',
                    background: `linear-gradient(135deg, ${param.color} 0%, ${param.color}dd 100%)`,
                    cursor: 'pointer',
                    border: '3px solid white',
                    boxShadow: `0 3px 12px ${param.color}40`,
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      transform: 'scale(1.1)',
                      boxShadow: `0 4px 16px ${param.color}50`
                    }
                  },
                  '&::-moz-range-thumb': {
                    height: '20px',
                    width: '20px',
                    borderRadius: '50%',
                    background: `linear-gradient(135deg, ${param.color} 0%, ${param.color}dd 100%)`,
                    cursor: 'pointer',
                    border: '3px solid white',
                    boxShadow: `0 3px 12px ${param.color}40`
                  },
                  '&:hover': {
                    background: `linear-gradient(to right, ${param.color} 0%, ${param.color} ${calculateProgress(param.value, param.min, param.max)}%, #d1d5db ${calculateProgress(param.value, param.min, param.max)}%, #d1d5db 100%)`
                  }
                }}
              />
            </Box>

            {/* 标签和描述 */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
              <Typography variant="caption" sx={{ 
                color: 'text.secondary',
                fontSize: '11px',
                fontWeight: 600
              }}>
                {param.leftLabel}
              </Typography>
              <Typography variant="caption" sx={{ 
                color: 'text.secondary',
                fontSize: '11px',
                fontWeight: 600
              }}>
                {param.rightLabel}
              </Typography>
            </Box>

            <Typography variant="caption" sx={{ 
              color: 'text.secondary',
              fontSize: '12px',
              lineHeight: 1.4,
              display: 'block'
            }}>
              {param.description}
            </Typography>
          </Box>
        ))}
      </Box>


    </Box>
  );
};

// 模型选择组件
const ModelSelector: React.FC<{
  selectedProvider?: string;
  selectedModel?: string;
  onProviderChange: (providerId: string) => void;
  onModelChange: (modelId: string) => void;
}> = ({ selectedProvider, selectedModel, onProviderChange, onModelChange }) => {
  const [showModels, setShowModels] = React.useState(false);
  
  const currentProvider = MODEL_PROVIDERS.find(p => p.id === selectedProvider);
  const availableModels = currentProvider?.models || [];

  React.useEffect(() => {
    if (selectedProvider) {
      setShowModels(true);
    }
  }, [selectedProvider]);

  return (
    <Box sx={{ mt: 2 }}>
      {/* 模型提供商选择 */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600, color: 'text.primary' }}>
          选择模型提供商
        </Typography>
        
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(5, 1fr)', 
          gap: 2,
          '@media (max-width: 1400px)': {
            gridTemplateColumns: 'repeat(4, 1fr)'
          },
          '@media (max-width: 1100px)': {
            gridTemplateColumns: 'repeat(3, 1fr)'
          },
          '@media (max-width: 800px)': {
            gridTemplateColumns: 'repeat(2, 1fr)'
          }
        }}>
          {MODEL_PROVIDERS.map((provider) => {
            const isSelected = selectedProvider === provider.id;
            
            return (
              <Box
                key={provider.id}
                onClick={() => {
                  onProviderChange(provider.id);
                  setShowModels(true);
                }}
                sx={{
                  position: 'relative',
                  p: 2,
                  borderRadius: 2,
                  cursor: 'pointer',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  background: isSelected 
                    ? 'linear-gradient(135deg, #EFF6FF 0%, #E0EAFC 100%)' 
                    : '#ffffff',
                  border: isSelected 
                    ? '2px solid rgba(59, 130, 246, 0.3)' 
                    : '1px solid rgba(0, 0, 0, 0.08)',
                  boxShadow: isSelected 
                    ? '0 8px 16px -4px rgba(59, 130, 246, 0.15), 0 4px 6px -2px rgba(59, 130, 246, 0.1)' 
                    : '0 2px 4px rgba(0, 0, 0, 0.02)',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: isSelected 
                      ? '0 12px 24px -4px rgba(59, 130, 246, 0.2), 0 6px 8px -2px rgba(59, 130, 246, 0.15)' 
                      : '0 8px 16px rgba(0, 0, 0, 0.1)',
                    borderColor: isSelected ? 'rgba(59, 130, 246, 0.4)' : 'rgba(59, 130, 246, 0.2)'
                  }
                }}
              >
                {/* 选中状态指示器 */}
                {isSelected && (
                  <Box sx={{
                    position: 'absolute',
                    top: -8,
                    right: -8,
                    width: 24,
                    height: 24,
                    background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 12px rgba(59, 130, 246, 0.4)',
                    border: '2px solid white'
                  }}>
                    <Check size={14} color="white" />
                  </Box>
                )}
                
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                  {/* Logo */}
                  <Box sx={{
                    width: 40,
                    height: 40,
                    borderRadius: 1.5,
                    background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.02) 0%, rgba(0, 0, 0, 0.05) 100%)',
                    border: '1px solid rgba(0, 0, 0, 0.08)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                    flexShrink: 0
                  }}>
                    <img
                      src={provider.logo}
                      alt={provider.name}
                      style={{ width: 24, height: 24, objectFit: 'contain' }}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                      }}
                    />
                    <Typography variant="h6" sx={{ 
                      fontSize: 16, 
                      fontWeight: 'bold', 
                      color: 'text.secondary',
                      display: 'none' 
                    }}>
                      {provider.name.charAt(0)}
                    </Typography>
                  </Box>
                  
                  {/* 内容 */}
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="subtitle2" sx={{ 
                      fontWeight: 600, 
                      color: isSelected ? '#1d4ed8' : 'text.primary',
                      mb: 0.5,
                      fontSize: '13px'
                    }}>
                      {provider.name}
                    </Typography>
                    <Typography variant="caption" sx={{ 
                      color: isSelected ? '#3b82f6' : 'text.secondary',
                      fontSize: '11px',
                      lineHeight: 1.3
                    }}>
                      {provider.description}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            );
          })}
        </Box>
      </Box>

      {/* 具体模型选择 */}
      {showModels && currentProvider && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600, color: 'text.primary' }}>
            选择具体模型
          </Typography>
          
          <Box sx={{
            background: '#ffffff',
            borderRadius: 2,
            border: '1px solid rgba(0, 0, 0, 0.08)',
            p: 3,
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)'
          }}>
            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', 
              gap: 2 
            }}>
              {availableModels.map((model) => {
                const isSelected = selectedModel === model.id;
                
                return (
                  <Box
                    key={model.id}
                    onClick={() => onModelChange(model.id)}
                    sx={{
                      position: 'relative',
                      p: 2.5,
                      borderRadius: 1.5,
                      cursor: 'pointer',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      background: isSelected 
                        ? 'linear-gradient(135deg, #F5F3FF 0%, #E0E7FF 100%)' 
                        : '#ffffff',
                      border: isSelected 
                        ? '2px solid rgba(99, 102, 241, 0.3)' 
                        : '1px solid rgba(0, 0, 0, 0.08)',
                      boxShadow: isSelected 
                        ? '0 6px 12px -2px rgba(99, 102, 241, 0.15)' 
                        : 'none',
                      '&:hover': {
                        transform: 'translateY(-1px)',
                        boxShadow: isSelected 
                          ? '0 8px 16px -2px rgba(99, 102, 241, 0.2)' 
                          : '0 4px 8px rgba(0, 0, 0, 0.1)',
                        borderColor: isSelected ? 'rgba(99, 102, 241, 0.4)' : 'rgba(99, 102, 241, 0.2)'
                      }
                    }}
                  >
                    {/* 使用标签 */}
                    {model.recommended && (
                      <Box sx={{
                        position: 'absolute',
                        top: -8,
                        left: 12,
                        px: 1.5,
                        py: 0.5,
                        background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                        color: 'white',
                        borderRadius: 1,
                        fontSize: '10px',
                        fontWeight: 'bold',
                        boxShadow: '0 2px 8px rgba(245, 158, 11, 0.3)'
                      }}>
                        使用
                      </Box>
                    )}
                    
                    <Typography variant="subtitle2" sx={{ 
                      fontWeight: 600, 
                      color: isSelected ? '#4338ca' : 'text.primary',
                      mb: 1 
                    }}>
                      {model.name}
                    </Typography>
                    <Typography variant="caption" sx={{ 
                      color: isSelected ? '#6366f1' : 'text.secondary',
                      fontSize: '12px',
                      lineHeight: 1.4
                    }}>
                      {model.description}
                    </Typography>
                  </Box>
                );
              })}
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
};

// FlowEditorPanel 样式移除，改为直接在组件中使用

// TAB配置卡片样式
const TabConfigCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: '12px',
  border: '1px solid rgba(0, 0, 0, 0.08)',
  backgroundColor: '#fff',
  marginTop: theme.spacing(1),
  maxHeight: 'calc(100vh - 400px)',
  overflowY: 'auto'
}));

// 导航步骤圆点 - 多彩主题重设计
const NavStep = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'active' && prop !== 'completed' && prop !== 'stepIndex'
})<{ active?: boolean; completed?: boolean; stepIndex?: number }>(({ active, completed, stepIndex = 0 }) => {
  // 定义每个步骤的主题色
  const stepColors = [
    { primary: '#3b82f6', secondary: '#1d4ed8', name: 'blue' }, // 蓝色
    { primary: '#8b5cf6', secondary: '#7c3aed', name: 'purple' }, // 紫色
    { primary: '#10b981', secondary: '#059669', name: 'emerald' }, // 翠绿色
    { primary: '#f59e0b', secondary: '#d97706', name: 'amber' }, // 琥珀色
    { primary: '#ef4444', secondary: '#dc2626', name: 'red' } // 红色
  ];
  
  const currentColor = stepColors[stepIndex % stepColors.length];
  
  return {
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    cursor: 'pointer',
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    fontSize: '16px',
    fontWeight: 700,
    zIndex: 2,
    
    ...(completed && {
      background: `linear-gradient(135deg, ${currentColor.primary} 0%, ${currentColor.secondary} 100%)`,
      color: '#fff',
      boxShadow: `0 8px 25px ${currentColor.primary}40, 0 3px 10px ${currentColor.primary}30`,
      transform: 'scale(1.05)',
      '&::before': {
        content: '""',
        position: 'absolute',
        inset: '-3px',
        borderRadius: '50%',
        background: `linear-gradient(135deg, ${currentColor.primary}, ${currentColor.secondary})`,
        zIndex: -1,
        opacity: 0.2,
        filter: 'blur(8px)'
      },
      '&:hover': {
        transform: 'scale(1.1)',
        boxShadow: `0 12px 35px ${currentColor.primary}50, 0 5px 15px ${currentColor.primary}40`
      }
    }),
    
    ...(active && !completed && {
      background: `linear-gradient(135deg, ${currentColor.primary} 0%, ${currentColor.secondary} 100%)`,
      color: '#fff',
      boxShadow: `0 8px 25px ${currentColor.primary}40, 0 3px 10px ${currentColor.primary}30`,
      transform: 'scale(1.08)',
      '&::before': {
        content: '""',
        position: 'absolute',
        inset: '-3px',
        borderRadius: '50%',
        background: `linear-gradient(135deg, ${currentColor.primary}, ${currentColor.secondary})`,
        zIndex: -1,
        opacity: 0.3,
        filter: 'blur(10px)',
        animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
      },
      '&:hover': {
        transform: 'scale(1.12)',
        boxShadow: `0 12px 35px ${currentColor.primary}50, 0 5px 15px ${currentColor.primary}40`
      }
    }),
    
    ...(!active && !completed && {
      background: `linear-gradient(135deg, ${currentColor.primary}10 0%, ${currentColor.primary}05 100%)`,
      color: currentColor.primary,
      border: `2px solid ${currentColor.primary}20`,
      boxShadow: `0 4px 12px ${currentColor.primary}10`,
      '&:hover': {
        transform: 'scale(1.05)',
        background: `linear-gradient(135deg, ${currentColor.primary}20 0%, ${currentColor.primary}10 100%)`,
        border: `2px solid ${currentColor.primary}40`,
        boxShadow: `0 6px 20px ${currentColor.primary}25`,
        color: currentColor.secondary
      }
    }),
    
    '@keyframes pulse': {
      '0%, 100%': {
        opacity: 0.3
      },
      '50%': {
        opacity: 0.5
      }
    }
  }
});

// 步骤连接线 - 多彩渐变重设计
const StepConnector = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'active' && prop !== 'stepIndex'
})<{ active?: boolean; stepIndex?: number }>(({ active, stepIndex = 0 }) => {
  // 定义连接线的渐变色彩
  const connectorColors = [
    ['#3b82f6', '#8b5cf6'], // 蓝色到紫色
    ['#8b5cf6', '#10b981'], // 紫色到绿色
    ['#10b981', '#f59e0b'], // 绿色到琥珀色
    ['#f59e0b', '#ef4444'], // 琥珀色到红色
    ['#ef4444', '#3b82f6']  // 红色到蓝色
  ];
  
  const [startColor, endColor] = connectorColors[stepIndex % connectorColors.length];
  
  return {
    flex: 1,
    height: '4px',
    margin: '0 16px',
    borderRadius: '2px',
    position: 'relative',
    background: active 
      ? `linear-gradient(90deg, ${startColor} 0%, ${endColor} 100%)`
      : 'linear-gradient(90deg, rgba(0, 0, 0, 0.06) 0%, rgba(0, 0, 0, 0.08) 100%)',
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    
    ...(active && {
      boxShadow: `0 2px 8px ${startColor}30`,
      '&::after': {
        content: '""',
        position: 'absolute',
        top: '50%',
        left: 0,
        right: 0,
        height: '2px',
        transform: 'translateY(-50%)',
        background: 'linear-gradient(90deg, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0.4) 50%, rgba(255, 255, 255, 0.8) 100%)',
        borderRadius: '1px',
        animation: 'flow 2s ease-in-out infinite'
      }
    }),
    
    '@keyframes flow': {
      '0%': {
        opacity: 0.4,
        transform: 'translateY(-50%) translateX(-100%)'
      },
      '50%': {
        opacity: 0.8,
        transform: 'translateY(-50%) translateX(0%)'
      },
      '100%': {
        opacity: 0.4,
        transform: 'translateY(-50%) translateX(100%)'
      }
    }
  }
});

/**
 * 智能体流程构建器组件
 * 用于构建和配置智能体工作流
 */
const AgentFlowBuilder: React.FC = () => {
  // 从钩子中获取状态
  const {
    // 模板选择状态
    isTemplateStep,
    setIsTemplateStep,
    selectedTemplate,
    setSelectedTemplate,
    
    // 面板控制
    configPanelOpen,
    setConfigPanelOpen,
    
    // 步骤状态
    activeStepId,
    setActiveStepId,
    
    // 流程步骤状态
    flowSteps,
    
    // 模块状态
    flowModules,
    setFlowModules,
    
    // 获取当前步骤的模块
    currentStepModules
  } = useFlowBuilderState();

  // 处理模板选择
  const handleTemplateSelect = useCallback((template: AgentTemplate) => {
    setSelectedTemplate(template);
    setIsTemplateStep(false);
    setActiveStepId('model'); // 默认选中第一个步骤
    setSelectedTab(0); // 重置选中的tab
  }, [setSelectedTemplate, setIsTemplateStep, setActiveStepId]);

  // 处理步骤点击
  const handleStepClick = useCallback((stepId: string) => {
    setActiveStepId(stepId);
    setConfigPanelOpen(false);
    setSelectedTab(0); // 重置选中的tab
  }, [setActiveStepId, setConfigPanelOpen]);

  // Tab状态管理
  const [selectedTab, setSelectedTab] = React.useState(0);
  
  // 模型选择状态管理 - 默认选中第一个厂商
  const [selectedProvider, setSelectedProvider] = React.useState<string>(MODEL_PROVIDERS[0]?.id || '');
  const [selectedModel, setSelectedModel] = React.useState<string>('');

  // 模板专用配置状态管理
  const [simpleQAConfig, setSimpleQAConfig] = React.useState(defaultConfig);
  const [deepThinkingConfig, setDeepThinkingConfig] = React.useState(defaultDeepThinkingConfig);
  const [intelligentPlanningConfig, setIntelligentPlanningConfig] = React.useState(defaultIntelligentPlanningConfig);

  // 当选中厂商时，自动选择第一个推荐模型
  React.useEffect(() => {
    if (selectedProvider && !selectedModel) {
      const provider = MODEL_PROVIDERS.find(p => p.id === selectedProvider);
      const models = provider?.models;
      if (models && models.length > 0) {
        // 优先选择推荐模型，如果没有推荐模型则选择第一个
        const recommendedModel = models.find(m => m.recommended);
        const defaultModel = recommendedModel || models[0];
        if (defaultModel) {
          setSelectedModel(defaultModel.id);
        }
      }
    }
  }, [selectedProvider, selectedModel]);
  
  const handleTabChange = useCallback((_: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  }, []);

  const handleProviderChange = useCallback((providerId: string) => {
    setSelectedProvider(providerId);
    setSelectedModel(''); // 重置模型选择
  }, []);

  const handleModelChange = useCallback((modelId: string) => {
    setSelectedModel(modelId);
  }, []);

  // 处理配置保存
  const handleConfigSave = useCallback((moduleId: string) => {
    const updatedModules = flowModules.map(module => 
      module.id === moduleId 
        ? { ...module, configured: !module.configured }
        : module
    );
    setFlowModules(updatedModules);
  }, [flowModules, setFlowModules]);

  // 渲染模块列表（用于单个模块显示）
  const renderModuleList = useCallback((modules: FlowModule[]) => {
    if (modules.length === 0) return null;
    
    return (
      <Box sx={{ mt: 2 }}>
        {modules.map((module: FlowModule) => (
          <Box key={module.id} sx={{ mb: 2, p: 2, border: '1px solid rgba(0,0,0,0.08)', borderRadius: 1 }}>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
              {module.title}
              {module.required && <span style={{ color: 'red', marginLeft: '4px' }}>*</span>}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {module.description}
            </Typography>
            
            {/* 模型选择区域 - 仅对模型相关模块显示 */}
            {(module.title.includes('模型') || 
              module.id.includes('model') ||
              activeStepId === 'model') && (
              <Box sx={{ mb: 2, minHeight: '400px' }}>
                <Typography variant="body2" sx={{ fontWeight: 500, mb: 2 }}>模型配置</Typography>
                <ModelSelector
                  selectedProvider={selectedProvider}
                  selectedModel={selectedModel}
                  onProviderChange={handleProviderChange}
                  onModelChange={handleModelChange}
                />
              </Box>
            )}

            {/* 响应参数配置区域 - 基于实际模块数据匹配 */}
            {(module.title === '响应参数' || 
              module.title === '推理参数' ||
              module.title === '决策参数' ||
              module.title === '模型参数' ||
              module.title.includes('参数') ||
              module.id === 'response-parameters' ||
              module.id === 'model-reasoning-params' ||
              module.id === 'decision-parameters' ||
              module.id === 'model-parameters' ||
              module.id.includes('parameter')) && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" sx={{ fontWeight: 500, mb: 2, color: 'primary.main' }}>
                  {module.title}配置
                </Typography>
                <ResponseParametersConfig />
              </Box>
            )}
             
            {/* 移除原来的下一步按钮，已迁移到右侧头部区域 */}
          </Box>
        ))}
      </Box>
    );
  }, [handleConfigSave, handleStepClick, flowSteps, activeStepId]);

  // 清理旧的配置相关代码
  const handleBackToTemplate = useCallback(() => {
    setIsTemplateStep(true);
    setSelectedTemplate(null);
    setActiveStepId(null);
  }, [setIsTemplateStep, setSelectedTemplate, setActiveStepId]);

  return (
    <>
      {/* 固定底层背景 - 与AgentBuilder相同 */}
      <GlassmorphismBackground />
      
      {/* 内容容器 */}
      <ContentWrapper>
        {/* 顶部灵动岛 - 使用与AgentBuilder相同的样式 */}
        <BuilderHeader
          title="流程构建器"
          agentName={selectedTemplate?.name || '智能体流程'}
          pageName="流程构建"
          canSave={true}
          onSave={() => {}}
          currentStep={1}
          totalSteps={flowSteps.length}
          isMainHeader={true}
        />

        {/* 主容器 - 与AgentBuilder相同的样式 */}
        <Box 
          sx={{
            display: 'flex', 
            flexGrow: 1,
            background: 'rgba(255, 255, 255, 0.65)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            borderRadius: '16px',
            margin: 2,
            marginTop: 4,
            marginBottom: 3,
            border: '1px solid rgba(255, 255, 255, 0.3)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.05)',
            height: 'calc(100vh - 140px)',
            overflow: 'hidden',
            position: 'relative',
            zIndex: 2
          }}
        >
          <Box sx={{
            position: 'relative',
            height: '100%',
            width: configPanelOpen ? 'calc(100% - 400px)' : '100%',
            overflow: 'hidden',
            zIndex: 1,
            display: 'flex',
            flexDirection: 'column',
            transition: 'width 0.3s ease'
          }}>
            {/* 模板选择阶段 */}
            {isTemplateStep && (
              <BasicInfoStep 
                onTemplateSelect={handleTemplateSelect}
                selectedTemplate={selectedTemplate?.id}
              />
            )}

            {/* 流程构建阶段 */}
            {!isTemplateStep && (
              <>
                {/* 返回按钮区域 */}
                <Box sx={{
                  display: 'flex', 
                  alignItems: 'center',
                  p: 3,
                  borderBottom: '1px solid rgba(255, 255, 255, 0.3)'
                }}>
                  <IconButton 
                    sx={{ 
                      mr: 2,
                      backgroundColor: 'rgba(255, 255, 255, 0.8)',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      }
                    }} 
                    size="small" 
                    onClick={handleBackToTemplate}
                  >
                    <ArrowLeft size={20} />
                  </IconButton>
                  <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', gap: 3 }}>
                    <Typography variant="h6" sx={{ 
                      fontSize: '18px', 
                      color: '#334155', 
                      fontWeight: 600 
                    }}>
                      智能体构建器
                    </Typography>
                    {selectedTemplate && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Typography variant="body2" sx={{ color: '#64748b' }}>
                          正在构建: <strong>{selectedTemplate.name}</strong>
                        </Typography>
                        <Typography 
                          variant="caption" 
                          sx={{ 
                            px: 1.5,
                            py: 0.5,
                            backgroundColor: selectedTemplate.agentType === 'simple-qa' ? '#10b981' : 
                                           selectedTemplate.agentType === 'deep-thinking' ? '#f59e0b' : '#8b5cf6',
                      color: 'white',
                      borderRadius: 1,
                      fontSize: '11px',
                      fontWeight: 500
                    }}
                  >
                    {selectedTemplate.agentType === 'simple-qa' && '简单问答'}
                    {selectedTemplate.agentType === 'deep-thinking' && '深度思考'}
                    {selectedTemplate.agentType === 'intelligent-planning' && '智能规划'}
                  </Typography>
                      </Box>
                    )}
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Button 
                      variant="contained" 
                      color="primary"
                      startIcon={<CheckCircle size={18} />}
                    >
                      完成构建
                    </Button>
                  </Box>
                </Box>
                
                {/* 步骤导航指示器 - 现代化重设计 */}
                <Box sx={{ 
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '100%',
                  maxWidth: '1200px',
                  margin: '0 auto',
                  px: 4,
                  py: 1.5,
                  minWidth: 'fit-content'
                }}>
              {flowSteps.map((step: FlowStep, index: number) => {
                const isActive = activeStepId === step.id;
                const currentOrder = activeStepId ? flowSteps.find((s: FlowStep) => s.id === activeStepId)?.order || 1 : 1;
                const isCompleted = step.order < currentOrder;
                
                return (
                  <React.Fragment key={step.id}>
                    <Box sx={{ 
                      display: 'flex', 
                      flexDirection: 'column', 
                      alignItems: 'center',
                      flex: 1,
                      minWidth: flowSteps.length > 4 ? '160px' : '180px',
                      maxWidth: flowSteps.length > 4 ? '200px' : '220px'
                    }}>
                      <NavStep 
                        active={isActive}
                        completed={isCompleted}
                        stepIndex={index}
                        onClick={() => handleStepClick(step.id)}
                      >
                        {isCompleted ? '✓' : step.order}
                      </NavStep>
                      <Typography 
                        variant="subtitle2" 
                        sx={{ 
                          mt: 1, 
                          color: isActive 
                            ? ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444'][index % 5]
                            : isCompleted 
                              ? ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444'][index % 5]
                              : 'text.primary',
                          fontWeight: isActive || isCompleted ? 700 : 600,
                          fontSize: flowSteps.length > 4 ? '13px' : '14px',
                          textAlign: 'center',
                          lineHeight: 1.3,
                          px: 0.5,
                          letterSpacing: '0.2px',
                          transition: 'all 0.3s ease'
                        }}
                      >
                        {step.title}
                      </Typography>
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          mt: 0.5,
                          color: isActive 
                            ? `rgba(${index === 0 ? '59, 130, 246' : index === 1 ? '139, 92, 246' : index === 2 ? '16, 185, 129' : index === 3 ? '245, 158, 11' : '239, 68, 68'}, 0.7)`
                            : isCompleted 
                              ? `rgba(${index === 0 ? '59, 130, 246' : index === 1 ? '139, 92, 246' : index === 2 ? '16, 185, 129' : index === 3 ? '245, 158, 11' : '239, 68, 68'}, 0.7)`
                              : 'text.disabled',
                          fontSize: '11px',
                          textAlign: 'center',
                          lineHeight: 1.2,
                          px: 1,
                          maxWidth: '140px',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          fontWeight: 500,
                          transition: 'all 0.3s ease'
                        }}
                      >
                        {step.description || ''}
                      </Typography>
                    </Box>
                    {index < flowSteps.length - 1 && (
                      <StepConnector 
                        active={isCompleted}
                        stepIndex={index}
                      />
                    )}
                  </React.Fragment>
                );
              })}  
                </Box>
                
                {/* 步骤信息头部组件 */}
                {activeStepId && (
              <Box sx={{ 
                mb: 1, 
                mx: 2,
                position: 'relative',
                background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.03) 0%, rgba(139, 69, 199, 0.03) 100%)',
                backdropFilter: 'blur(10px)',
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.04)',
                overflow: 'hidden',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '2px',
                  background: 'linear-gradient(90deg, #6366f1 0%, #8b45c7 50%, #06b6d4 100%)',
                  borderRadius: '12px 12px 0 0'
                }
              }}>
                <Box sx={{ p: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 1.5 }}>
                    {/* 左侧标题区域 - 增强设计 */}
                    <Box sx={{ flex: '0 0 auto', display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                      <Box sx={{
                        width: 32,
                        height: 32,
                        borderRadius: '8px',
                        background: 'linear-gradient(135deg, #6366f1 0%, #8b45c7 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '14px',
                        fontWeight: 'bold',
                        boxShadow: '0 2px 8px rgba(99, 102, 241, 0.3)',
                        mt: 0.25
                      }}>
                        {flowSteps.findIndex((step: FlowStep) => step.id === activeStepId) + 1}
                      </Box>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.25 }}>
                        <Typography variant="subtitle1" sx={{ 
                          fontSize: '16px', 
                          letterSpacing: '0.3px', 
                          background: 'linear-gradient(135deg, #1a1a1a 0%, #4a5568 100%)',
                          backgroundClip: 'text',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          fontWeight: 700,
                          lineHeight: 1.2
                        }}>
                          {flowSteps.find((step: FlowStep) => step.id === activeStepId)?.title}
                        </Typography>
                        <Typography variant="caption" sx={{ 
                          color: 'text.secondary',
                          fontSize: '11px',
                          fontWeight: 500,
                          lineHeight: 1.2
                        }}>
                          配置智能体核心功能
                        </Typography>
                      </Box>
                    </Box>
                    
                    {/* 中间Tab按钮区域 - 精致重设计 */}
                    {currentStepModules.length > 0 && (
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 1.5, 
                        flex: '1 1 auto',
                        justifyContent: 'center',
                        px: 3
                      }}>
                        {currentStepModules.map((module: FlowModule, index: number) => (
                          <Button
                            key={module.id}
                            variant={selectedTab === index ? "contained" : "outlined"}
                            size="small"
                            onClick={() => handleTabChange(null as any, index)}
                            sx={{
                              minWidth: 'auto',
                              px: 2.5,
                              py: 1,
                              fontSize: '13px',
                              fontWeight: 600,
                              textTransform: 'none',
                              borderRadius: '12px',
                              position: 'relative',
                              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                              ...(selectedTab === index ? {
                                background: 'linear-gradient(135deg, #6366f1 0%, #8b45c7 100%)',
                                color: 'white',
                                border: 'none',
                                boxShadow: '0 4px 20px rgba(99, 102, 241, 0.4)',
                                transform: 'translateY(-1px)',
                                '&:hover': {
                                  background: 'linear-gradient(135deg, #5856eb 0%, #7c3aed 100%)',
                                  boxShadow: '0 6px 25px rgba(99, 102, 241, 0.5)',
                                  transform: 'translateY(-2px)'
                                }
                              } : {
                                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                                borderColor: 'rgba(99, 102, 241, 0.2)',
                                color: '#6366f1',
                                backdropFilter: 'blur(10px)',
                                '&:hover': {
                                  backgroundColor: 'rgba(99, 102, 241, 0.08)',
                                  borderColor: '#6366f1',
                                  transform: 'translateY(-1px)',
                                  boxShadow: '0 4px 16px rgba(99, 102, 241, 0.15)'
                                }
                              })
                            }}
                            startIcon={
                              <Box sx={{ 
                                display: 'flex', 
                                alignItems: 'center',
                                p: 0.3,
                                borderRadius: '6px',
                                backgroundColor: selectedTab === index ? 'rgba(255, 255, 255, 0.2)' : 'rgba(99, 102, 241, 0.1)'
                              }}>
                                <Settings size={14} />
                              </Box>
                            }
                                                      >
                              {module.title}
                              {module.required && (
                                <Box component="span" sx={{ 
                                  color: '#ef4444', 
                                  ml: 0.5,
                                  fontSize: '14px',
                                  fontWeight: 'bold'
                                }}>*</Box>
                              )}
                            </Button>
                        ))}
                      </Box>
                    )}

                    {/* 右侧步骤完成提示信息框 - 替换为下一步按钮 */}
                    {(() => {
                      // 计算当前步骤内配置项的完成状态
                      const totalModules = currentStepModules.length;
                      const completedModules = currentStepModules.filter(module => module.configured).length;
                      const currentStepIndex = flowSteps.findIndex((step: FlowStep) => step.id === activeStepId);
                      const hasNextStep = currentStepIndex < flowSteps.length - 1;
                      const isCurrentStepComplete = completedModules === totalModules && totalModules > 0;
                      const canProceedToNext = hasNextStep && isCurrentStepComplete;
                      
                      return (
                        <Box sx={{ 
                          flex: '0 0 auto',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                        }}>
                          {/* 完成状态指示器 - 调整为与按钮同样高度 */}
                          <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: isCurrentStepComplete 
                              ? 'rgba(16, 185, 129, 0.08)' 
                              : 'rgba(99, 102, 241, 0.08)',
                            border: `1px solid ${isCurrentStepComplete 
                              ? 'rgba(16, 185, 129, 0.2)' 
                              : 'rgba(99, 102, 241, 0.2)'}`,
                            borderRadius: '8px',
                            px: 2,
                            py: 1.25,
                            minWidth: '80px',
                            height: '38px' // 与按钮高度一致
                          }}>
                            <Typography variant="body2" sx={{ 
                              color: isCurrentStepComplete ? '#10b981' : '#6366f1',
                              fontSize: '13px',
                              fontWeight: 600,
                              lineHeight: 1
                            }}>
                              {completedModules}/{totalModules}
                            </Typography>
                            {isCurrentStepComplete && (
                              <Box sx={{ ml: 0.5, color: '#10b981', fontSize: '14px' }}>
                                ✓
                              </Box>
                            )}
                          </Box>
                          
                          {/* 下一步按钮 - 与步骤完成状态联动 */}
                          <Button 
                            variant="contained" 
                            size="medium"
                            disabled={!canProceedToNext}
                            onClick={() => {
                              // 只有当前步骤完成且有下一步时才能点击
                              if (canProceedToNext) {
                                const nextStep = flowSteps[currentStepIndex + 1];
                                handleStepClick(nextStep.id);
                              }
                            }}
                            sx={{ 
                              minWidth: '80px',
                              height: '38px', // 与指示器高度一致
                              px: 2.5,
                              borderRadius: '8px',
                              background: canProceedToNext 
                                ? 'linear-gradient(135deg, #6366f1 0%, #8b45c7 100%)'
                                : !hasNextStep && isCurrentStepComplete
                                  ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                                  : 'rgba(156, 163, 175, 0.5)',
                              color: 'white',
                              fontSize: '13px',
                              fontWeight: 600,
                              textTransform: 'none',
                              boxShadow: canProceedToNext 
                                ? '0 4px 12px rgba(99, 102, 241, 0.3)'
                                : !hasNextStep && isCurrentStepComplete
                                  ? '0 4px 12px rgba(16, 185, 129, 0.3)'
                                  : 'none',
                              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                              '&:hover': canProceedToNext ? {
                                background: 'linear-gradient(135deg, #5856eb 0%, #7c3aed 100%)',
                                transform: 'translateY(-1px)',
                                boxShadow: '0 6px 16px rgba(99, 102, 241, 0.4)'
                              } : (!hasNextStep && isCurrentStepComplete) ? {
                                background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                                transform: 'translateY(-1px)',
                                boxShadow: '0 6px 16px rgba(16, 185, 129, 0.4)'
                              } : {},
                              '&:disabled': {
                                color: 'rgba(255, 255, 255, 0.6)',
                                cursor: 'not-allowed',
                                transform: 'none'
                              }
                            }}
                          >
                            {!hasNextStep ? '完成' : 
                             isCurrentStepComplete ? '下一步' : '请完成配置'}
                          </Button>
                        </Box>
                      );
                    })()}
                  </Box>
                  
                  {/* 必填项说明 */}
                  <Box sx={{ 
                    pt: 1.5,
                    mt: 1.5,
                    borderTop: '1px solid rgba(99, 102, 241, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}>
                    <Box sx={{
                      width: 14,
                      height: 14,
                      borderRadius: '2px',
                      backgroundColor: '#f59e0b',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '10px',
                      fontWeight: 'bold'
                    }}>
                      *
                    </Box>
                    <Typography variant="caption" sx={{ 
                      color: 'text.secondary',
                      fontSize: '11px',
                      fontWeight: 500
                    }}>
                      标有红色星号(*)的为必填配置项，请确保完成所有必填项的配置
                    </Typography>
                  </Box>
                </Box>
              </Box>
                )}
                
                {/* 模块内容区域组件 */}
                {activeStepId && (
                  <Box sx={{ mx: 2 }}>
                {currentStepModules.length > 0 ? (
                  currentStepModules.length > 1 ? (
                    // 多个模块时显示当前选中模块的内容
                    <TabConfigCard>
                      {currentStepModules[selectedTab] && (
                        <>
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            {/* 根据当前选中的Tab显示对应的配置内容 */}
                            {(() => {
                              const currentModule = currentStepModules[selectedTab];
                              
                              // 检查是否为简单问答模板的分解配置模块
                              if (selectedTemplate?.agentType === 'simple-qa') {
                                switch (currentModule.id) {
                                  case 'system-instructions':
                                    return (
                                      <SystemInstructionsConfig
                                        config={simpleQAConfig}
                                        onChange={setSimpleQAConfig}
                                      />
                                    );

                                }
                              }
                              
                              // 检查是否为模板专用配置模块
                              if (currentModule.id === 'template-flow-config' && selectedTemplate) {
                                switch (selectedTemplate.agentType) {
                                  case 'simple-qa':
                                    return (
                                      <SimpleQAFlowConfig
                                        config={simpleQAConfig}
                                        onChange={setSimpleQAConfig}
                                      />
                                    );
                                  case 'deep-thinking':
                                    return (
                                      <DeepThinkingFlowConfig
                                        config={deepThinkingConfig}
                                        onChange={setDeepThinkingConfig}
                                      />
                                    );
                                  case 'intelligent-planning':
                                    return (
                                      <IntelligentPlanningFlowConfig
                                        config={intelligentPlanningConfig}
                                        onChange={setIntelligentPlanningConfig}
                                      />
                                    );
                                  default:
                                    return (
                                      <Box sx={{ py: 4, textAlign: 'center' }}>
                                        <Typography variant="body2" color="text.secondary">
                                          未知模板类型：{selectedTemplate.agentType}
                                        </Typography>
                                      </Box>
                                    );
                                }
                              }
                              
                              // 优先检查参数配置相关模块
                              if (currentModule.title === '响应参数' ||
                                  currentModule.title === '推理参数' ||
                                  currentModule.title === '决策参数' ||
                                  currentModule.title === '模型参数' ||
                                  currentModule.title.includes('参数') ||
                                  currentModule.id === 'response-parameters' ||
                                  currentModule.id === 'model-reasoning-params' ||
                                  currentModule.id === 'decision-parameters' ||
                                  currentModule.id === 'model-parameters' ||
                                  currentModule.id.includes('parameter')) {
                                return (
                                  <Box>
                                    <Typography variant="body2" sx={{ fontWeight: 500, mb: 2, color: 'primary.main' }}>
                                      {currentModule.title}配置
                                    </Typography>
                                    <ResponseParametersConfig />
                                  </Box>
                                );
                              }
                              
                              // 如果是模型相关模块，显示模型选择
                              if (currentModule.title.includes('模型') || 
                                  currentModule.id.includes('model')) {
                                return (
                                  <Box>
                                    <Typography variant="body2" sx={{ fontWeight: 500, mb: 2 }}>模型配置</Typography>
                                    <ModelSelector
                                      selectedProvider={selectedProvider}
                                      selectedModel={selectedModel}
                                      onProviderChange={handleProviderChange}
                                      onModelChange={handleModelChange}
                                    />
                                  </Box>
                                );
                              }
                              
                              // 默认显示模块描述
                              return (
                                <Box sx={{ py: 4, textAlign: 'center' }}>
                                  <Typography variant="body2" color="text.secondary">
                                    {currentModule.description || '该模块暂无配置选项'}
                                  </Typography>
                                </Box>
                              );
                            })()}
                          </Box>
                          
                          {/* 移除下一步按钮，已迁移到头部右侧 */}
                        </>
                      )}
                    </TabConfigCard>
                  ) : (
                    // 单个模块时直接显示配置内容
                    <TabConfigCard>
                      {currentStepModules[0] && (
                        <>
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            {(() => {
                              const currentModule = currentStepModules[0];
                              
                              // 检查是否为简单问答模板的系统指令配置模块
                              if (selectedTemplate?.agentType === 'simple-qa' && currentModule.id === 'system-instructions') {
                                return (
                                  <SystemInstructionsConfig
                                    config={simpleQAConfig}
                                    onChange={setSimpleQAConfig}
                                  />
                                );
                              }
                              
                              // 默认显示模块描述
                              return (
                                <Box sx={{ py: 4, textAlign: 'center' }}>
                                  <Typography variant="body2" color="text.secondary">
                                    {currentModule.description || '该模块暂无配置选项'}
                                  </Typography>
                                </Box>
                              );
                            })()}
                          </Box>
                          
                          {/* 移除下一步按钮，已迁移到头部右侧 */}
                        </>
                      )}
                    </TabConfigCard>
                  )
                  ) : (
                    <Box sx={{ 
                      textAlign: 'center', 
                      py: 3,
                      color: 'text.secondary'
                    }}>
                      <Typography variant="body2">
                        该步骤暂无可配置模块
                      </Typography>
                    </Box>
                  )}
                  </Box>
                )}
                
                {/* 初始状态提示 */}
                {!activeStepId && (
                  <Box sx={{ 
                    textAlign: 'center', 
                    py: 4,
                    color: 'text.secondary',
                    mx: 2
                  }}>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      选择上方步骤开始配置
                    </Typography>
                  </Box>
                )}
              </>
            )}
          </Box>
        </Box>
      </ContentWrapper>
    </>
  );
};

export default AgentFlowBuilder;
