import React, { useState, useCallback } from 'react';
import { Box, Typography, Switch, FormControlLabel, Card, CardContent, Chip, Button, Divider, Alert, IconButton } from '@mui/material';
import { ArrowLeft, Settings, Brain, DollarSign, Zap, CheckCircle } from 'lucide-react';
import { AgentTeam, AgentMember } from '../types/agentTeam';
import { ScenarioConfig } from './ScenarioSelectionStep';
import { AgentTemplate } from './BasicInfoStep';

interface ModelConfigurationStepProps {
  selectedScenario: ScenarioConfig;
  selectedTemplate: AgentTemplate;
  agentTeam: AgentTeam;
  onModelConfigChange: (modelConfig: any) => void;
  onBack: () => void;
  onComplete: () => void;
}

// 模型提供商数据
const MODEL_PROVIDERS = [
  {
    id: 'zhipu',
    name: '智谱AI',
    logo: 'https://open.bigmodel.cn/static/img/logo.png',
    description: '智谱AI大模型，支持GLM系列',
    models: [
      { id: 'glm-4', name: 'GLM-4', description: '智谱AI最新模型', recommended: true, cost: 0.1, performance: 95 },
      { id: 'glm-3-turbo', name: 'GLM-3-Turbo', description: '高效版本', recommended: false, cost: 0.05, performance: 85 },
      { id: 'glm-embedding', name: 'GLM-Embedding', description: '文本嵌入模型', recommended: false, cost: 0.02, performance: 90 }
    ]
  },
  {
    id: 'baidu',
    name: '百度文心',
    logo: 'https://nlp-eb.cdn.bcebos.com/logo/favicon.ico',
    description: '百度文心大模型，知识增强',
    models: [
      { id: 'ernie-bot-4', name: '文心一言4.0', description: '百度最新旗舰模型', recommended: true, cost: 0.12, performance: 92 },
      { id: 'ernie-bot-turbo', name: '文心一言Turbo', description: '高性价比选择', recommended: false, cost: 0.06, performance: 80 },
      { id: 'ernie-embedding', name: '文心Embedding', description: '向量化模型', recommended: false, cost: 0.03, performance: 88 }
    ]
  },
  {
    id: 'alibaba',
    name: '阿里通义',
    logo: 'https://img.alicdn.com/imgextra/i3/O1CN01Iq3p2U1qQU6H4rJKN_!!6000000005492-2-tps-512-512.png',
    description: '阿里云通义千问大模型',
    models: [
      { id: 'qwen-max', name: '通义千问Max', description: '最强性能模型', recommended: true, cost: 0.15, performance: 96 },
      { id: 'qwen-turbo', name: '通义千问Turbo', description: '快速响应版本', recommended: false, cost: 0.08, performance: 82 },
      { id: 'qwen-plus', name: '通义千问Plus', description: '平衡版本', recommended: false, cost: 0.10, performance: 88 }
    ]
  },
  {
    id: 'moonshot',
    name: 'Moonshot',
    logo: 'https://kimi.moonshot.cn/favicon.ico',
    description: 'Moonshot AI Kimi大模型',
    models: [
      { id: 'moonshot-v1-8k', name: 'Moonshot v1 8K', description: '标准上下文模型', recommended: false, cost: 0.08, performance: 85 },
      { id: 'moonshot-v1-32k', name: 'Moonshot v1 32K', description: '长上下文模型', recommended: true, cost: 0.12, performance: 90 },
      { id: 'moonshot-v1-128k', name: 'Moonshot v1 128K', description: '超长上下文模型', recommended: false, cost: 0.20, performance: 92 }
    ]
  }
];

const ModelConfigurationStep: React.FC<ModelConfigurationStepProps> = ({
  selectedScenario,
  selectedTemplate,
  agentTeam,
  onModelConfigChange,
  onBack,
  onComplete
}) => {
  const [useUnifiedModel, setUseUnifiedModel] = useState(true);
  const [unifiedModel, setUnifiedModel] = useState('glm-4');
  const [agentModels, setAgentModels] = useState<{ [key: string]: string }>({});
  const [selectedProvider, setSelectedProvider] = useState('zhipu');

  // 获取推荐模型
  const getRecommendedModel = useCallback((agentType: string) => {
    switch (agentType) {
      case 'intent_recognition':
      case 'question_decomposition':
        return 'glm-4'; // 需要理解能力的模型
      case 'web_search':
      case 'knowledge_retrieval':
        return 'qwen-max'; // 需要知识检索能力的模型
      case 'qa_summary':
      case 'data_verification':
        return 'ernie-bot-4'; // 需要总结和验证能力的模型
      default:
        return 'glm-4';
    }
  }, []);

  // 初始化智能体模型配置
  React.useEffect(() => {
    const initialAgentModels: { [key: string]: string } = {};
    agentTeam.members.forEach(agent => {
      initialAgentModels[agent.id] = getRecommendedModel(agent.type);
    });
    setAgentModels(initialAgentModels);
  }, [agentTeam.members, getRecommendedModel]);

  // 处理统一模型切换
  const handleUnifiedModelToggle = (enabled: boolean) => {
    setUseUnifiedModel(enabled);
    if (enabled) {
      // 切换到统一模型时，所有智能体使用相同模型
      const newAgentModels: { [key: string]: string } = {};
      agentTeam.members.forEach(agent => {
        newAgentModels[agent.id] = unifiedModel;
      });
      setAgentModels(newAgentModels);
    }
  };

  // 处理统一模型选择
  const handleUnifiedModelChange = (modelId: string) => {
    setUnifiedModel(modelId);
    if (useUnifiedModel) {
      // 更新所有智能体的模型
      const newAgentModels: { [key: string]: string } = {};
      agentTeam.members.forEach(agent => {
        newAgentModels[agent.id] = modelId;
      });
      setAgentModels(newAgentModels);
    }
  };

  // 处理单个智能体模型选择
  const handleAgentModelChange = (agentId: string, modelId: string) => {
    setAgentModels(prev => ({
      ...prev,
      [agentId]: modelId
    }));
  };

  // 获取模型信息
  const getModelInfo = (modelId: string) => {
    for (const provider of MODEL_PROVIDERS) {
      const model = provider.models.find(m => m.id === modelId);
      if (model) {
        return { ...model, provider: provider.name };
      }
    }
    return null;
  };

  // 计算总成本
  const calculateTotalCost = () => {
    let totalCost = 0;
    Object.values(agentModels).forEach(modelId => {
      const modelInfo = getModelInfo(modelId);
      if (modelInfo) {
        totalCost += modelInfo.cost;
      }
    });
    return totalCost;
  };

  // 获取智能体类型颜色
  const getAgentTypeColor = (type: string) => {
    switch (type) {
      case 'intent_recognition':
      case 'question_decomposition':
        return '#6366f1';
      case 'web_search':
      case 'knowledge_retrieval':
        return '#059669';
      case 'qa_summary':
      case 'data_verification':
        return '#f59e0b';
      default:
        return '#64748b';
    }
  };

  return (
    <div className="h-full overflow-auto">
      {/* 返回按钮 */}
      {onBack && (
        <Box sx={{
          display: 'flex', 
          alignItems: 'center',
          p: 2,
          borderBottom: '1px solid rgba(255, 255, 255, 0.2)'
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
            onClick={onBack}
          >
            <ArrowLeft size={20} />
          </IconButton>
          <Typography variant="h6" sx={{ 
            fontSize: '16px', 
            color: '#334155', 
            fontWeight: 600 
          }}>
            返回团队配置
          </Typography>
        </Box>
      )}

      <div className="space-y-6 p-2 max-w-7xl mx-auto pb-20">
        {/* 页面标题 */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ mb: 2, fontWeight: 700 }}>
            模型配置
          </Typography>
          <Typography variant="body1" color="text.secondary">
            为您的智能体团队配置合适的模型，平衡性能与成本
          </Typography>
        </Box>

        {/* 统一模型配置开关 */}
        <Card sx={{ p: 3, background: 'linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{
                width: 40,
                height: 40,
                borderRadius: 2,
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white'
              }}>
                <Settings size={20} />
              </Box>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  统一模型配置
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  所有智能体使用相同的模型，简化配置并降低成本
                </Typography>
              </Box>
            </Box>
            <FormControlLabel
              control={
                <Switch
                  checked={useUnifiedModel}
                  onChange={(e) => handleUnifiedModelToggle(e.target.checked)}
                  sx={{
                    '& .MuiSwitch-switchBase.Mui-checked': {
                      color: '#6366f1',
                    },
                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                      backgroundColor: '#6366f1',
                    },
                  }}
                />
              }
              label=""
            />
          </Box>

          {useUnifiedModel && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                选择统一模型
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                {MODEL_PROVIDERS.map((provider) => (
                  <Box key={provider.id} sx={{ width: 'calc(25% - 16px)', minWidth: 200 }}>
                    <Card
                      sx={{
                        p: 2,
                        cursor: 'pointer',
                        border: 2,
                        borderColor: selectedProvider === provider.id ? '#6366f1' : 'transparent',
                        background: selectedProvider === provider.id 
                          ? 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)' 
                          : '#ffffff',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
                        }
                      }}
                      onClick={() => setSelectedProvider(provider.id)}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                        <img
                          src={provider.logo}
                          alt={provider.name}
                          style={{ width: 32, height: 32, borderRadius: 4 }}
                        />
                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                          {provider.name}
                        </Typography>
                      </Box>
                      <Typography variant="caption" color="text.secondary">
                        {provider.description}
                      </Typography>
                    </Card>
                  </Box>
                ))}
              </Box>

              {/* 模型选择 */}
              <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                  选择具体模型
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                  {MODEL_PROVIDERS.find(p => p.id === selectedProvider)?.models.map((model) => (
                    <Box key={model.id} sx={{ width: 'calc(33.33% - 16px)', minWidth: 250 }}>
                      <Card
                        sx={{
                          p: 2,
                          cursor: 'pointer',
                          border: 2,
                          borderColor: unifiedModel === model.id ? '#6366f1' : 'transparent',
                          background: unifiedModel === model.id 
                            ? 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)' 
                            : '#ffffff',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            transform: 'translateY(-2px)',
                            boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
                          }
                        }}
                        onClick={() => handleUnifiedModelChange(model.id)}
                      >
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                            {model.name}
                          </Typography>
                          {model.recommended && (
                            <Chip label="推荐" size="small" color="primary" />
                          )}
                        </Box>
                        <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: 'block' }}>
                          {model.description}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Chip
                            icon={<DollarSign size={12} />}
                            label={`$${model.cost}/token`}
                            size="small"
                            variant="outlined"
                          />
                          <Chip
                            icon={<Zap size={12} />}
                            label={`${model.performance}%`}
                            size="small"
                            variant="outlined"
                          />
                        </Box>
                      </Card>
                    </Box>
                  ))}
                </Box>
              </Box>
            </Box>
          )}
        </Card>

        {/* 分角色模型配置 */}
        {!useUnifiedModel && (
          <Card sx={{ p: 3, background: 'linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)' }}>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
              <Brain size={20} />
              分角色模型配置
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              为每个智能体角色选择最适合的模型，优化性能和成本
            </Typography>

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
              {agentTeam.members.map((agent, index) => {
                const currentModel = agentModels[agent.id];
                const modelInfo = getModelInfo(currentModel);
                const agentColor = getAgentTypeColor(agent.type);

                return (
                  <Box key={agent.id} sx={{ width: 'calc(50% - 24px)', minWidth: 300 }}>
                    <Card sx={{ p: 3, border: `2px solid ${agentColor}20` }}>
                      {/* 智能体头部 */}
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                        <Box sx={{
                          width: 48,
                          height: 48,
                          borderRadius: 2,
                          background: `linear-gradient(135deg, ${agentColor}20 0%, ${agentColor}10 100%)`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: agentColor
                        }}>
                          <Brain size={24} />
                        </Box>
                        <Box sx={{ flexGrow: 1 }}>
                          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                            {agent.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {agent.role}
                          </Typography>
                        </Box>
                      </Box>

                      {/* 当前模型信息 */}
                      {modelInfo && (
                        <Box sx={{ mb: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                            当前模型: {modelInfo.name}
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                            <Chip
                              icon={<DollarSign size={12} />}
                              label={`$${modelInfo.cost}/token`}
                              size="small"
                              variant="outlined"
                            />
                            <Chip
                              icon={<Zap size={12} />}
                              label={`${modelInfo.performance}%`}
                              size="small"
                              variant="outlined"
                            />
                            <Chip
                              label={modelInfo.provider}
                              size="small"
                              variant="outlined"
                            />
                          </Box>
                        </Box>
                      )}

                      {/* 模型选择 */}
                      <Box>
                        <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                          选择模型
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                          {MODEL_PROVIDERS.map((provider) => (
                            <Box key={provider.id} sx={{ width: 'calc(50% - 8px)' }}>
                              <Card
                                sx={{
                                  p: 1.5,
                                  cursor: 'pointer',
                                  border: 2,
                                  borderColor: currentModel?.startsWith(provider.id) ? agentColor : 'transparent',
                                  background: currentModel?.startsWith(provider.id) 
                                    ? `linear-gradient(135deg, ${agentColor}10 0%, ${agentColor}05 100%)` 
                                    : '#ffffff',
                                  transition: 'all 0.3s ease',
                                  '&:hover': {
                                    transform: 'translateY(-1px)',
                                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                                  }
                                }}
                                onClick={() => {
                                  const recommendedModel = provider.models.find(m => m.recommended)?.id || provider.models[0].id;
                                  handleAgentModelChange(agent.id, recommendedModel);
                                }}
                              >
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                  <img
                                    src={provider.logo}
                                    alt={provider.name}
                                    style={{ width: 20, height: 20, borderRadius: 2 }}
                                  />
                                  <Typography variant="caption" sx={{ fontWeight: 600 }}>
                                    {provider.name}
                                  </Typography>
                                </Box>
                                <Typography variant="caption" color="text.secondary">
                                  {provider.models.find(m => m.recommended)?.name || provider.models[0].name}
                                </Typography>
                              </Card>
                            </Box>
                          ))}
                        </Box>
                      </Box>
                    </Card>
                  </Box>
                );
              })}
            </Box>
          </Card>
        )}

        {/* 成本估算 */}
        <Card sx={{ p: 3, background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)' }}>
          <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
            <DollarSign size={20} />
            成本估算
          </Typography>
          
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
            <Box sx={{ width: 'calc(33.33% - 16px)', minWidth: 200 }}>
              <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'white', borderRadius: 2 }}>
                <Typography variant="h4" color="primary.main" sx={{ fontWeight: 700 }}>
                  ${calculateTotalCost().toFixed(2)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  每1000 tokens成本
                </Typography>
              </Box>
            </Box>
            <Box sx={{ width: 'calc(33.33% - 16px)', minWidth: 200 }}>
              <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'white', borderRadius: 2 }}>
                <Typography variant="h4" color="success.main" sx={{ fontWeight: 700 }}>
                  {agentTeam.members.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  智能体数量
                </Typography>
              </Box>
            </Box>
            <Box sx={{ width: 'calc(33.33% - 16px)', minWidth: 200 }}>
              <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'white', borderRadius: 2 }}>
                <Typography variant="h4" color="info.main" sx={{ fontWeight: 700 }}>
                  {useUnifiedModel ? '统一' : '分角色'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  配置模式
                </Typography>
              </Box>
            </Box>
          </Box>

          <Alert severity="info" sx={{ mt: 3 }}>
            <Typography variant="body2">
              成本估算基于标准使用场景，实际成本可能因使用量和使用模式而有所不同。
            </Typography>
          </Alert>
        </Card>

        {/* 底部操作按钮 */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pt: 3 }}>
          <Button variant="outlined" onClick={onBack}>
            返回团队配置
          </Button>
          <Button 
            variant="contained" 
            onClick={onComplete}
            startIcon={<CheckCircle size={18} />}
            sx={{
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #5856eb 0%, #7c3aed 100%)',
              }
            }}
          >
            完成模型配置
          </Button>
        </Box>
      </div>
    </div>
  );
};

export default ModelConfigurationStep; 