import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Box, Typography, Switch, FormControlLabel, Button, IconButton, Collapse, Alert } from '@mui/material';
import { ArrowLeft, Check, Settings, Brain, Database, Wrench, ChevronDown, ChevronUp } from 'lucide-react';
import { AgentTeam, AgentMember, AGENT_TYPE_DEFINITIONS } from '../types/agentTeam';
import { POLICY_QA_TEAM_CONFIGS } from '../config/policyQATeams';
import { ScenarioConfig } from './ScenarioSelectionStep';
import { AgentTemplate } from './BasicInfoStep';

// 工具函数 - 类名合并
function cn(...classes: (string | undefined | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

interface AgentTeamConfigStepProps {
  selectedScenario: ScenarioConfig;
  selectedTemplate: AgentTemplate;
  onTeamConfigChange: (teamConfig: AgentTeam) => void;
  onBack?: () => void;
  onComplete?: () => void;
}

const AgentTeamConfigStep: React.FC<AgentTeamConfigStepProps> = ({
  selectedScenario,
  selectedTemplate,
  onTeamConfigChange,
  onBack,
  onComplete
}) => {
  // 根据场景和模板获取对应的团队配置
  const getTeamConfig = useMemo(() => {
    if (selectedScenario.id === 'policy_qa') {
      switch (selectedTemplate.id) {
        case 'simple-qa':
          return POLICY_QA_TEAM_CONFIGS.simpleQA;
        case 'deep-thinking':
          return POLICY_QA_TEAM_CONFIGS.knowledgeQA;
        case 'intelligent-planning':
          return POLICY_QA_TEAM_CONFIGS.deepThinking;
        default:
          return POLICY_QA_TEAM_CONFIGS.simpleQA;
      }
    }
    return POLICY_QA_TEAM_CONFIGS.simpleQA;
  }, [selectedScenario, selectedTemplate]);

  const [teamConfig, setTeamConfig] = useState<AgentTeam>(getTeamConfig);
  const [expandedAgents, setExpandedAgents] = useState<{ [key: string]: boolean }>({});
  const [useUnifiedModel, setUseUnifiedModel] = useState(true);
  const [selectedAgent, setSelectedAgent] = useState<string>('');

  // 当选择的场景或模板改变时，更新团队配置
  useEffect(() => {
    const newConfig = getTeamConfig;
    setTeamConfig(newConfig);
    onTeamConfigChange(newConfig);
  }, [getTeamConfig, onTeamConfigChange]);

  // 获取智能体类型图标
  const getAgentTypeIcon = (type: AgentMember['type']) => {
    switch (type) {
      case 'intent_recognition':
      case 'question_decomposition':
        return <Brain className="h-5 w-5" />;
      case 'web_search':
      case 'knowledge_retrieval':
      case 'metadata_search':
        return <Database className="h-5 w-5" />;
      case 'qa_summary':
      case 'data_verification':
      case 'result_optimization':
        return <Wrench className="h-5 w-5" />;
      default:
        return <Settings className="h-5 w-5" />;
    }
  };

  // 获取智能体类型颜色
  const getAgentTypeColor = (type: AgentMember['type']) => {
    switch (type) {
      case 'intent_recognition':
      case 'question_decomposition':
        return '#6366f1';
      case 'web_search':
      case 'knowledge_retrieval':
      case 'metadata_search':
        return '#059669';
      case 'qa_summary':
      case 'data_verification':
      case 'result_optimization':
        return '#f59e0b';
      default:
        return '#64748b';
    }
  };

  const handleAgentSelect = useCallback((agentId: string) => {
    setSelectedAgent(agentId);
    // 可以在这里处理智能体选择逻辑
  }, []);

  const toggleUnifiedModel = useCallback((enabled: boolean) => {
    setUseUnifiedModel(enabled);
    
    const updatedMembers = teamConfig.members.map(member => ({
      ...member,
      modelConfig: {
        ...member.modelConfig,
        useUnifiedModel: enabled
      }
    }));

    const updatedConfig = {
      ...teamConfig,
      members: updatedMembers
    };
    setTeamConfig(updatedConfig);
    onTeamConfigChange(updatedConfig);
  }, [teamConfig, onTeamConfigChange]);

  const toggleAgentExpansion = useCallback((agentId: string) => {
    setExpandedAgents(prev => ({
      ...prev,
      [agentId]: !prev[agentId]
    }));
  }, []);

  return (
    <div className="h-full overflow-auto">
      {/* 返回按钮 - 参考模板选择页面样式 */}
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
            返回模板选择
          </Typography>
        </Box>
      )}
      
      <div className="space-y-6 p-2 max-w-7xl mx-auto pb-20">

        {/* 顶部标签 - 参考原始设计 */}
        <div className="flex justify-center mb-6">
        <div 
          className="px-10 py-2 rounded-full shadow-sm text-base font-medium text-gray-800 border border-gray-100"
          style={{
            background: 'linear-gradient(135deg, #F5F3FF 0%, #EDE9FE 50%, #DDD6FE 100%)',
            boxShadow: '0 4px 12px rgba(192, 132, 252, 0.15)'
          }}
        >
          智能体团队配置
        </div>
      </div>
      
              {/* 标题 - 参考原始设计 */}
        <div className="mb-4">
          <h2 className="text-xl font-semibold">
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              {selectedScenario.name} - {selectedTemplate.name}
            </span>
          </h2>
          <p className="text-sm text-gray-600 mt-2">
            已为您配置了包含 {teamConfig.members.length} 个专业智能体的团队，点击智能体可查看详细配置
          </p>
        </div>

        {/* 统一模型配置开关 - 精致设计 */}
        <div className="mb-6">
          <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-gradient-to-br from-white to-gray-50/50 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 hover:opacity-100 transition-opacity duration-300" />
            <div className="relative p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-sm">
                    <Settings className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg">统一模型配置</h3>
                    <p className="text-sm text-gray-600">所有智能体使用相同的模型配置，确保团队协作一致性</p>
                  </div>
                </div>
                <FormControlLabel
                  control={
                    <Switch
                      checked={useUnifiedModel}
                      onChange={(e) => toggleUnifiedModel(e.target.checked)}
                      sx={{
                        '& .MuiSwitch-switchBase.Mui-checked': {
                          color: '#6366f1',
                          '&:hover': {
                            backgroundColor: 'rgba(99, 102, 241, 0.08)',
                          },
                        },
                        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                          backgroundColor: '#6366f1',
                        },
                      }}
                    />
                  }
                  label=""
                />
              </div>
              
              {useUnifiedModel && teamConfig.teamConfig.unifiedModelConfig && (
                <div className="mt-4 p-4 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/50">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-blue-900 flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                      当前统一模型
                    </h4>
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">
                      已启用
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="flex items-center gap-2 p-2 bg-white rounded-lg border border-blue-100">
                      <div className="w-2 h-2 rounded-full bg-blue-500" />
                      <span className="text-sm font-medium text-blue-900">模型</span>
                      <span className="text-sm text-blue-700 font-mono ml-auto">
                        {teamConfig.teamConfig.unifiedModelConfig.providerId} - {teamConfig.teamConfig.unifiedModelConfig.modelId}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 p-2 bg-white rounded-lg border border-blue-100">
                      <div className="w-2 h-2 rounded-full bg-green-500" />
                      <span className="text-sm font-medium text-green-900">温度</span>
                      <span className="text-sm text-green-700 font-mono ml-auto">
                        {teamConfig.teamConfig.unifiedModelConfig.temperature}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 p-2 bg-white rounded-lg border border-blue-100">
                      <div className="w-2 h-2 rounded-full bg-purple-500" />
                      <span className="text-sm font-medium text-purple-900">Token</span>
                      <span className="text-sm text-purple-700 font-mono ml-auto">
                        {teamConfig.teamConfig.unifiedModelConfig.maxTokens}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 智能体团队选择 - 精致设计 */}
        <div>
          <h2 className="text-xl font-semibold mb-5 flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-sm">
              <Brain className="h-5 w-5 text-white" />
            </div>
            <span className="bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent">智能体团队成员</span>
            <span className="ml-auto px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full font-medium">
              {teamConfig.members.length} 个智能体
            </span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {teamConfig.members.map((agent, index) => {
            const isSelected = selectedAgent === agent.id;
            const agentColor = getAgentTypeColor(agent.type);
            
            return (
              <div
                key={agent.id}
                style={{
                  background: isSelected 
                    ? `linear-gradient(135deg, ${agentColor}15 0%, ${agentColor}08 100%)` 
                    : 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                  boxShadow: isSelected 
                    ? `0 8px 25px -4px ${agentColor}40, 0 4px 6px -2px ${agentColor}20` 
                    : '0 2px 8px rgba(0, 0, 0, 0.04)'
                }}
                className={cn(
                  "relative p-5 rounded-2xl cursor-pointer transition-all duration-300 group",
                  "hover:shadow-xl hover:scale-[1.02] hover:-translate-y-1",
                  isSelected 
                    ? "border-0 ring-2 ring-blue-400/30 ring-offset-2" 
                    : "border border-gray-200 hover:border-blue-300 hover:bg-gradient-to-br hover:from-blue-50/30 hover:to-purple-50/30"
                )}
                onClick={() => handleAgentSelect(agent.id)}
              >
                {/* 选中状态指示器 */}
                {isSelected && (
                  <div 
                    className="absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center shadow-lg ring-2 ring-white transform transition-all duration-300 ease-out"
                    style={{
                      background: `linear-gradient(135deg, ${agentColor}, ${agentColor}dd)`
                    }}
                  >
                    <Check className="h-4 w-4 text-white drop-shadow-sm" />
                  </div>
                )}
                
                <div className="flex items-start gap-4">
                  {/* 智能体类型图标 */}
                  <div 
                    className="w-14 h-14 rounded-2xl flex items-center justify-center overflow-hidden flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300"
                    style={{
                      background: `linear-gradient(135deg, ${agentColor}20 0%, ${agentColor}10 100%)`,
                      color: agentColor,
                      border: `2px solid ${agentColor}30`
                    }}
                  >
                    {getAgentTypeIcon(agent.type)}
                  </div>
                  
                  {/* 内容 */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-bold text-gray-900 text-base truncate">{agent.name}</h3>
                      <span 
                        className="px-3 py-1 text-xs rounded-full font-bold text-white shadow-sm"
                        style={{ 
                          backgroundColor: agentColor,
                          boxShadow: `0 2px 8px ${agentColor}40`
                        }}
                      >
                        第{index + 1}步
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed mb-3 line-clamp-2">
                      {agent.description}
                    </p>
                    
                    {/* 配置状态指示 */}
                    <div className="flex gap-2 flex-wrap">
                      <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium flex items-center gap-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                        ✓ 模型已配置
                      </span>
                      {agent.toolsConfig.enabledTools.length > 0 && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium flex items-center gap-1">
                          <Wrench className="h-3 w-3" />
                          {agent.toolsConfig.enabledTools.length} 工具
                        </span>
                      )}
                      {agent.knowledgeConfig.enabledKnowledgeBases.length > 0 && (
                        <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full font-medium flex items-center gap-1">
                          <Database className="h-3 w-3" />
                          {agent.knowledgeConfig.enabledKnowledgeBases.length} 知识库
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* 展开按钮 */}
                <div className="absolute bottom-4 right-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleAgentExpansion(agent.id);
                    }}
                    className="p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white shadow-sm border border-gray-200 hover:border-blue-300 transition-all duration-200 group/expand"
                  >
                    {expandedAgents[agent.id] ? 
                      <ChevronUp className="h-4 w-4 text-gray-600 group-hover/expand:text-blue-600 transition-colors" /> : 
                      <ChevronDown className="h-4 w-4 text-gray-600 group-hover/expand:text-blue-600 transition-colors" />
                    }
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 展开的智能体详细配置 */}
      {Object.keys(expandedAgents).map(agentId => {
        if (!expandedAgents[agentId]) return null;
        
        const currentAgent = teamConfig.members.find(m => m.id === agentId);
        if (!currentAgent) return null;
        
        return (
          <div key={agentId}>
            <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-indigo-100 text-indigo-600">
                <Settings className="h-5 w-5" />
              </div>
              <span className="bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent">
                {currentAgent.name} - 详细配置
              </span>
            </h2>
            
            <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm">
              <div className="space-y-6">
                {/* 基本信息 */}
                <div>
                  <h3 className="font-medium text-gray-900 mb-3">{currentAgent.name}</h3>
                  <p className="text-sm text-gray-600 mb-4">{currentAgent.description}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* 模型配置 */}
                    <div>
                      <h4 className="font-medium text-gray-800 mb-2">模型配置</h4>
                      {currentAgent.modelConfig.useUnifiedModel ? (
                        <div className="p-3 bg-blue-50 rounded-lg border">
                          <span className="text-sm text-blue-700">使用团队统一模型配置</span>
                        </div>
                      ) : (
                        <div className="p-3 bg-gray-50 rounded-lg border">
                          <span className="text-sm text-gray-600">独立模型配置（功能开发中）</span>
                        </div>
                      )}
                    </div>
                    
                    {/* 工具配置 */}
                    <div>
                      <h4 className="font-medium text-gray-800 mb-2">
                        工具配置 ({currentAgent.toolsConfig.enabledTools.length})
                      </h4>
                      <div className="flex flex-wrap gap-1">
                        {currentAgent.toolsConfig.enabledTools.map((tool) => (
                          <span
                            key={tool}
                            className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full border border-green-200"
                          >
                            {tool}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    {/* 知识库配置 */}
                    <div className="md:col-span-2">
                      <h4 className="font-medium text-gray-800 mb-2">
                        知识库配置 ({currentAgent.knowledgeConfig.enabledKnowledgeBases.length})
                      </h4>
                      {currentAgent.knowledgeConfig.enabledKnowledgeBases.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {currentAgent.knowledgeConfig.enabledKnowledgeBases.map((kb) => (
                            <span
                              key={kb}
                              className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full border border-orange-200"
                            >
                              {kb}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-sm text-gray-500">未配置知识库</span>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* 系统提示词预览 */}
                <div>
                  <h4 className="font-medium text-gray-800 mb-2">系统提示词预览</h4>
                  <div className="p-4 bg-gray-50 rounded-lg border max-h-40 overflow-auto">
                    <pre className="text-xs text-gray-700 whitespace-pre-wrap font-mono">
                      {currentAgent.systemPrompt.substring(0, 300)}...
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {/* 工作流程预览 - 简化版本 */}
      <div>
        <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-purple-100 text-purple-600">
            <Database className="h-5 w-5" />
          </div>
          <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">执行工作流程</span>
        </h2>
        
        <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm">
          <div className="flex items-center flex-wrap gap-2">
            {teamConfig.workflow.steps.map((step, index) => {
              const agent = teamConfig.members.find(m => m.id === step.agentId);
              const agentColor = agent ? getAgentTypeColor(agent.type) : '#64748b';
              
              return (
                <React.Fragment key={step.stepId}>
                  {index > 0 && (
                    <span className="text-gray-400 text-xl mx-2">→</span>
                  )}
                  <span
                    className="px-3 py-1.5 rounded-lg text-sm font-medium text-white shadow-sm"
                    style={{ backgroundColor: agentColor }}
                  >
                    {agent?.name || step.agentId}
                  </span>
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </div>
    </div>

    {/* 完成按钮 - 简洁版本 */}
    {onComplete && (
      <div className="mt-6 flex justify-center">
        <button
          onClick={onComplete}
          className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transform hover:-translate-y-1 transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          完成配置，进入流程构建
        </button>
      </div>
    )}
    </div>
  );
};

export default AgentTeamConfigStep; 