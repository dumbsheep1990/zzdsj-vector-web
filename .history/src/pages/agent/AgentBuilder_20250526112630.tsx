import React, { useState } from 'react';
import { Box, Button } from '@mui/material';
import { styled } from '@mui/material/styles';

// 导入布局组件
import SidebarContainer from './components/SidebarContainer';
import BuilderHeader from './components/BuilderHeader';
// 不再使用ContentContainer，直接使用Box组件

// 导入步骤组件
import BasicInfoStep from './components/BasicInfoStep';
import SystemPromptStep from './components/SystemPromptStep';
import FeaturesStep from './components/FeaturesStep';

// 导入类型
import { Tool, KnowledgeBase, AgentConfig } from './components/types';
import { defaultExtensionConfig } from './components/ExtensionToolsCard';

// 高级设置接口
export interface AdvancedSettings {
  temperature: number;
  maxTokens: number;
  topP: number;
  frequencyPenalty: number;
  presencePenalty: number;
  contextCompression: boolean;
}

// 生成默认高级设置
const defaultAdvancedSettings: AdvancedSettings = {
  temperature: 0.7,
  maxTokens: 2048,
  topP: 1,
  frequencyPenalty: 0,
  presencePenalty: 0,
  contextCompression: false
};

// 定义磨砂背景容器
const GlassmorphismBackground = styled(Box)(({ theme }) => ({
  position: 'fixed', // 修改为fixed定位，覆盖整个视口
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  width: '100%',
  height: '100%',
  zIndex: -1, // 改为-1，确保完全在内容下层且不影响用户交互
  background: `linear-gradient(135deg, ${theme.palette.primary.light}30, ${theme.palette.secondary.light}40, ${theme.palette.info.light}30)`,
  pointerEvents: 'none', // 不拦截任何鼠标事件
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

// 内容容器组件
const ContentWrapper = styled(Box)(() => ({
  position: 'relative',
  zIndex: 1,
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden'
}));

const AgentBuilder: React.FC = () => {
  // 当前未使用导航功能，但将来可能添加返回按钮等功能
  // const navigate = useNavigate();
  // const { state } = useAppContext();
  
  // 活动步骤状态
  const [activeStep, setActiveStep] = useState(0);
  
  // 已完成步骤的状态
  const [completed, setCompleted] = useState<{[k: number]: boolean}>({});
  
  // 功能配置子标签页状态
  const [featureTabValue, setFeatureTabValue] = useState(0);
  
  // 扩展工具配置状态
  const [extensionToolsConfig, setExtensionToolsConfig] = useState(defaultExtensionConfig);
  
  // 智能体配置状态
  const [agentConfig, setAgentConfig] = useState<AgentConfig>({
    name: '',
    description: '',
    systemPrompt: '你是一个由向量数据库支持的智能助手，拥有以下能力：\n1. 可以回答用户关于向量数据库的问题\n2. 可以进行代码解释和分析\n3. 可以连接网络搜索和获取最新信息\n4. 可以处理各种文档和数据',
    selectedTools: [],
    selectedKnowledgeBases: [],
    agentType: 'chat',
    icon: 'robot',
    tags: [],
    language: 'zh-CN',
    isPublic: false,
    advanced: defaultAdvancedSettings
  });
  
  // 处理名称变更
  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAgentConfig({
      ...agentConfig,
      name: event.target.value
    });
  };
  
  // 处理描述变更
  const handleDescriptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAgentConfig({
      ...agentConfig,
      description: event.target.value
    });
  };
  
  // 处理智能体类型变更
  const handleAgentTypeChange = (value: string) => {
    setAgentConfig({
      ...agentConfig,
      agentType: value
    });
  };
  
  // 处理图标变更
  const handleIconChange = (icon: string) => {
    setAgentConfig({
      ...agentConfig,
      icon: icon
    });
  };
  
  // 处理标签变更
  const handleTagsChange = (tags: string[]) => {
    setAgentConfig({
      ...agentConfig,
      tags: tags
    });
  };
  
  // 处理语言变更
  const handleLanguageChange = (language: string) => {
    setAgentConfig({
      ...agentConfig,
      language: language
    });
  };
  
  // 处理可见性变更
  const handleVisibilityChange = (isPublic: boolean) => {
    setAgentConfig({
      ...agentConfig,
      isPublic: isPublic
    });
  };
  
  // 处理系统提示词变更
  const handleSystemPromptChange = (value: string) => {
    setAgentConfig({
      ...agentConfig,
      systemPrompt: value
    });
  };
  
  // 重置系统提示词
  const handleResetSystemPrompt = () => {
    setAgentConfig({
      ...agentConfig,
      systemPrompt: '你是一个由向量数据库支持的智能助手，拥有以下能力：\n1. 可以回答用户关于向量数据库的问题\n2. 可以进行代码解释和分析\n3. 可以连接网络搜索和获取最新信息\n4. 可以处理各种文档和数据'
    });
  };
  
  // 工具选择切换
  const toggleToolSelection = (tool: Tool) => {
    const selectedTools = [...agentConfig.selectedTools];
    const index = selectedTools.findIndex(t => t.id === tool.id);
    
    if (index > -1) {
      // 如果工具已选中，则移除
      selectedTools.splice(index, 1);
    } else {
      // 否则添加到选中列表
      selectedTools.push(tool);
    }
    
    setAgentConfig({
      ...agentConfig,
      selectedTools
    });
  };
  
  // 知识库选择切换
  const toggleKnowledgeBaseSelection = (kb: KnowledgeBase) => {
    const selectedKBs = [...agentConfig.selectedKnowledgeBases];
    const index = selectedKBs.findIndex(k => k.id === kb.id);
    
    if (index > -1) {
      // 如果知识库已选中，则移除
      selectedKBs.splice(index, 1);
    } else {
      // 否则添加到选中列表
      selectedKBs.push(kb);
    }
    
    setAgentConfig({
      ...agentConfig,
      selectedKnowledgeBases: selectedKBs
    });
  };
  
  // 处理高级设置变更
  const handleAdvancedSettingsChange = (settings: AdvancedSettings) => {
    setAgentConfig({
      ...agentConfig,
      advanced: settings
    });
  };
  
  // 检查步骤是否已完成
  const isStepComplete = (step: number) => {
    return !!completed[step];
  };
  
  // 切换步骤
  const handleStepChange = (step: number) => {
    setActiveStep(step);
  };
  
  // 下一步
  const handleNext = () => {
    const newCompleted = { ...completed };
    // 标记当前步骤为已完成
    newCompleted[activeStep] = true;
    setCompleted(newCompleted);
    
    // 移动到下一步
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };
  
  // 上一步
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };
  
  // 完成步骤
  const completeStep = () => {
    const newCompleted = { ...completed };
    newCompleted[activeStep] = true;
    setCompleted(newCompleted);
  };
  
  // 保存智能体
  const handleSave = () => {
    console.log('保存智能体配置:', agentConfig);
    // TODO: 调用 API 保存智能体配置
    
    // 导航回列表页
    // navigate('/agent-list');
  };
  
  // 检查是否可以继续（是否满足最低要求）
  const canContinue = (step: number) => {
    switch(step) {
      case 0:
        return agentConfig.name.trim() !== '';
      case 1:
        return agentConfig.systemPrompt.trim() !== '';
      case 2:
        return true; // 没有特定要求
      default:
        return false;
    }
  };
  
  // 渲染工具选择芯片
  const renderToolChips = () => {
    // 这里可以渲染工具芯片组件
    return null;
  };
  
  // 检查是否可以保存（基本必填项是否已填）
  const canSave = agentConfig.name.trim() !== '' && agentConfig.systemPrompt.trim() !== '';
  
  // 步骤标题
  const stepTitles = ['基本信息设置', '系统提示词设置', '功能配置'];
  
  // 步骤配置
  const steps = [
    {
      id: 0,
      title: '基本信息',
      isRequired: true,
      isComplete: agentConfig.name.trim() !== '',
      status: agentConfig.name ? '已填写' : '必填'
    },
    {
      id: 1,
      title: '系统提示词',
      isRequired: true,
      isComplete: agentConfig.systemPrompt.trim() !== '',
      status: agentConfig.systemPrompt ? '已填写' : '必填'
    },
    {
      id: 2,
      title: '功能配置',
      isRequired: false,
      isComplete: isStepComplete(2),
      isOptional: true,
      status: '可选'
    }
  ];
  
  return (
    <>
      {/* 固定底层背景 */}
      <GlassmorphismBackground />
      
      {/* 内容容器 */}
      <ContentWrapper>
        {/* 顶部灵动岛 */}
        <BuilderHeader
          title="创建智能体"
          agentName={agentConfig.name}
          pageName="智能体管理"
          canSave={canSave}
          onSave={handleSave}
          currentStep={activeStep}
          totalSteps={stepTitles.length}
          isMainHeader={true}
        />
        <Box sx={{ 
          display: 'flex', 
          flexGrow: 1,
          background: 'rgba(255, 255, 255, 0.65)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          borderRadius: '16px',
          margin: 2,
          marginTop: 4, // 增加与顶部灵动岛的间距
          marginBottom: 3,
          border: '1px solid rgba(255, 255, 255, 0.3)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.05)',
          height: 'calc(100vh - 160px)', // 调整高度，留出更多空间给顶部灵动岛
          overflow: 'auto',
          position: 'relative',
          zIndex: 2
        }}>
          {/* 左侧步骤导航 */}
          <SidebarContainer
            agentName={agentConfig.name}
            activeStep={activeStep}
            steps={steps}
            onStepChange={handleStepChange}
            onSave={handleSave}
            canSave={canSave}
            collapsed={false /* 内容区步骤栏始终展开，不跟随全局导航折叠 */}
          />
          
          {/* 右侧内容区域 - 直接显示内容，不使用ContentContainer */}
          <Box sx={{ flex: 1, p: 2, overflow: 'auto' }}>
            {/* 基本信息页 */}
            {activeStep === 0 && (
              <BasicInfoStep
                name={agentConfig.name}
                description={agentConfig.description}
                onNameChange={handleNameChange}
                onDescriptionChange={handleDescriptionChange}
                // 新增属性
                agentType={agentConfig.agentType}
                onAgentTypeChange={handleAgentTypeChange}
                icon={agentConfig.icon}
                onIconChange={handleIconChange}
                tags={agentConfig.tags}
                onTagsChange={handleTagsChange}
                language={agentConfig.language}
                onLanguageChange={handleLanguageChange}
                isPublic={agentConfig.isPublic}
                onVisibilityChange={handleVisibilityChange}
              />
            )}
            
            {/* 系统提示词页 */}
            {activeStep === 1 && (
              <SystemPromptStep
                value={agentConfig.systemPrompt}
                onChange={handleSystemPromptChange}
                onReset={handleResetSystemPrompt}
              />
            )}
            
            {/* 功能配置页 */}
            {activeStep === 2 && (
              <>
                <FeaturesStep
                  tabValue={featureTabValue}
                  onTabChange={setFeatureTabValue}
                  selectedTools={agentConfig.selectedTools}
                  toggleToolSelection={toggleToolSelection}
                  renderToolChips={renderToolChips}
                  selectedKnowledgeBases={agentConfig.selectedKnowledgeBases}
                  toggleKnowledgeBaseSelection={toggleKnowledgeBaseSelection}
                  advancedSettings={agentConfig.advanced || defaultAdvancedSettings}
                  onAdvancedSettingsChange={handleAdvancedSettingsChange}
                  onBack={handleBack}
                  onComplete={completeStep}
                  canContinue={canContinue(activeStep)}
                />
              </>
            )}
            
            {/* 底部导航按钮 - 仅在前两步显示 */}
            {activeStep < 2 && activeStep > 0 && (
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
                <Button onClick={handleBack} variant="outlined" size="small">
                  上一步
                </Button>
                {activeStep < stepTitles.length - 1 && (
                  <Button 
                    onClick={handleNext} 
                    variant="contained" 
                    color="primary" 
                    size="small"
                    disabled={!canContinue(activeStep)}
                  >
                    下一步
                  </Button>
                )}
              </Box>
            )}
          </Box>
        </Box>
      </ContentWrapper>
    </>
  );
};

export default AgentBuilder;
