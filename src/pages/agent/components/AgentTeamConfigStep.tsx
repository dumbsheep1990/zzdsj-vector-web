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
}

const AgentTeamConfigStep: React.FC<AgentTeamConfigStepProps> = ({
  selectedScenario,
  selectedTemplate,
  onTeamConfigChange,
  onBack
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
    <div className="space-y-10 p-6 max-w-7xl mx-auto">
      {/* 返回按钮 */}
      {onBack && (
        <div className="flex items-center mb-6">
          <IconButton 
            onClick={onBack}
            sx={{ 
              mr: 2,
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
              }
            }}
            size="small"
          >
            <ArrowLeft size={20} />
          </IconButton>
          <Typography variant="body2" color="text.secondary">
            返回模板选择
          </Typography>
        </div>
      )}

      {/* 顶部标签 - 参考原始设计 */}
      <div className="flex justify-center mb-8">
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
      <div className="mb-6">
        <h2 className="text-xl font-semibold">
          <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            {selectedScenario.name} - {selectedTemplate.name}
          </span>
        </h2>
        <p className="text-sm text-gray-600 mt-2">
          已为您配置了包含 {teamConfig.members.length} 个专业智能体的团队，点击智能体可查看详细配置
        </p>
      </div>

      {/* 统一模型配置开关 */}
      <div className="mb-8">
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div>
            <h3 className="font-medium text-gray-900">统一模型配置</h3>
            <p className="text-sm text-gray-600">所有智能体使用相同的模型配置</p>
          </div>
          <FormControlLabel
            control={
              <Switch
                checked={useUnifiedModel}
                onChange={(e) => toggleUnifiedModel(e.target.checked)}
                color="primary"
              />
            }
            label=""
          />
        </div>
        
        {useUnifiedModel && teamConfig.teamConfig.unifiedModelConfig && (
          <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="font-medium text-blue-900 mb-2">当前统一模型</h4>
            <div className="flex items-center gap-4 text-sm">
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full font-mono">
                {teamConfig.teamConfig.unifiedModelConfig.providerId} - {teamConfig.teamConfig.unifiedModelConfig.modelId}
              </span>
              <span className="text-blue-600">
                温度: {teamConfig.teamConfig.unifiedModelConfig.temperature}
              </span>
              <span className="text-blue-600">
                Token: {teamConfig.teamConfig.unifiedModelConfig.maxTokens}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* 智能体团队选择 - 参考原始模型提供商选择设计 */}
      <div>
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-blue-100 text-blue-600">
            <Brain className="h-5 w-5" />
          </div>
          <span className="bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent">智能体团队成员</span>
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {teamConfig.members.map((agent, index) => {
            const isSelected = selectedAgent === agent.id;
            const agentColor = getAgentTypeColor(agent.type);
            
            return (
              <div
                key={agent.id}
                style={{
                  background: isSelected ? `linear-gradient(135deg, ${agentColor}15 0%, ${agentColor}08 100%)` : '#ffffff',
                  boxShadow: isSelected ? `0 8px 16px -4px ${agentColor}40, 0 4px 6px -2px ${agentColor}20` : 'none'
                }}
                className={cn(
                  "relative p-5 rounded-2xl cursor-pointer transition-all duration-300",
                  "hover:shadow-xl hover:scale-[1.02]",
                  isSelected 
                    ? "border-0 ring-2 ring-blue-400/30 ring-offset-2" 
                    : "!bg-white hover:bg-gray-50/70 border border-gray-200 hover:border-blue-300"
                )}
                onClick={() => handleAgentSelect(agent.id)}
              >
                {/* 选中状态指示器 */}
                {isSelected && (
                  <div 
                    className="absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center shadow-lg ring-2 ring-blue-300 transform transition-all duration-300 ease-out"
                    style={{
                      background: `linear-gradient(to right, ${agentColor}, ${agentColor}dd)`
                    }}
                  >
                    <Check className="h-5 w-5 text-white drop-shadow-sm" />
                  </div>
                )}
                
                <div className="flex items-start gap-3">
                  {/* 智能体类型图标 */}
                  <div 
                    className="w-14 h-14 rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0 shadow-sm"
                    style={{
                      background: `linear-gradient(135deg, ${agentColor}20 0%, ${agentColor}10 100%)`,
                      color: agentColor,
                      border: `1px solid ${agentColor}30`
                    }}
                  >
                    {getAgentTypeIcon(agent.type)}
                  </div>
                  
                  {/* 内容 */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900">{agent.name}</h3>
                      <span 
                        className="px-2 py-0.5 text-xs rounded-full font-medium text-white"
                        style={{ backgroundColor: agentColor }}
                      >
                        第{index + 1}步
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed mb-2">
                      {agent.description}
                    </p>
                    
                    {/* 配置状态指示 */}
                    <div className="flex gap-2 flex-wrap">
                      <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">
                        ✓ 模型已配置
                      </span>
                      {agent.toolsConfig.enabledTools.length > 0 && (
                        <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">
                          {agent.toolsConfig.enabledTools.length} 工具
                        </span>
                      )}
                      {agent.knowledgeConfig.enabledKnowledgeBases.length > 0 && (
                        <span className="px-2 py-0.5 bg-orange-100 text-orange-700 text-xs rounded-full">
                          {agent.knowledgeConfig.enabledKnowledgeBases.length} 知识库
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* 展开按钮 */}
                <div className="absolute bottom-3 right-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleAgentExpansion(agent.id);
                    }}
                    className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    {expandedAgents[agent.id] ? 
                      <ChevronUp className="h-4 w-4 text-gray-500" /> : 
                      <ChevronDown className="h-4 w-4 text-gray-500" />
                    }
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 选中智能体的详细配置 - 参考原始模型选择后的配置区域 */}
      {selectedAgent && (
        <div>
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-indigo-100 text-indigo-600">
              <Settings className="h-5 w-5" />
            </div>
            <span className="bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent">智能体详细配置</span>
          </h2>
          
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            {(() => {
              const currentAgent = teamConfig.members.find(m => m.id === selectedAgent);
              if (!currentAgent) return null;
              
              return (
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
              );
            })()}
          </div>
        </div>
      )}

      {/* 工作流程预览 - 简化版本 */}
      <div className="pb-24">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-purple-100 text-purple-600">
            <Database className="h-5 w-5" />
          </div>
          <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">执行工作流程</span>
        </h2>
        
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
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
  );
};

export default AgentTeamConfigStep; 