import React, { useState } from 'react';
import { 
  Box,
  Tab,
  Tabs
} from '@mui/material';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import ExtensionIcon from '@mui/icons-material/Extension';
import BuildIcon from '@mui/icons-material/Build';
import StorageIcon from '@mui/icons-material/Storage';
import SettingsIcon from '@mui/icons-material/Settings';

import BasicInfoCard from './components/BasicInfoCard';
import SystemPromptCard from './components/SystemPromptCard';
import ToolsCard from './components/ToolsCard';
import KnowledgeBaseConfigCard from './components/KnowledgeBaseConfigCard';

// 使用这些组件修复AgentBuilder.tsx中的问题
// 1. 主标签页结构: 基本信息, 系统提示词, 功能配置
// 2. 功能配置下的子标签页: 工具组件, 知识库, 高级功能

// 主要标签组件
export const MainTabs = ({ configTab, handleTabChange }) => (
  <Tabs
    value={configTab}
    onChange={handleTabChange}
    variant="fullWidth"
    sx={{
      '& .MuiTab-root': {
        textTransform: 'none',
        fontWeight: 500,
        fontSize: '0.95rem',
        py: 1.5
      }
    }}
  >
    <Tab label="基本信息" icon={<SmartToyIcon fontSize="small" />} iconPosition="start" />
    <Tab label="系统提示词" icon={<AutoAwesomeIcon fontSize="small" />} iconPosition="start" />
    <Tab label="功能配置" icon={<ExtensionIcon fontSize="small" />} iconPosition="start" />
  </Tabs>
);

// 功能配置子标签组件
export const FunctionSubTabs = ({ functionSubTab, handleFunctionSubTabChange }) => (
  <Tabs
    value={functionSubTab}
    onChange={handleFunctionSubTabChange}
    variant="standard"
    sx={{
      '& .MuiTab-root': {
        textTransform: 'none',
        fontWeight: 500,
        fontSize: '0.9rem',
        py: 1
      }
    }}
  >
    <Tab label="工具组件" icon={<BuildIcon fontSize="small" />} iconPosition="start" />
    <Tab label="知识库" icon={<StorageIcon fontSize="small" />} iconPosition="start" />
    <Tab label="高级功能" icon={<SettingsIcon fontSize="small" />} iconPosition="start" />
  </Tabs>
);

// 内容区域组件 - 根据选中的标签页显示不同内容
export const ContentArea = ({ 
  configTab, 
  functionSubTab,
  basicInfoProps, 
  systemPromptProps,
  toolsProps,
  knowledgeBaseProps,
  advancedFeaturesProps 
}) => (
  <Box sx={{ flex: 1, overflow: 'auto', p: 3 }}>
    {/* 1. 基本信息标签页 */}
    <Box sx={{ display: configTab === 0 ? 'block' : 'none', height: '100%' }}>
      <BasicInfoCard {...basicInfoProps} />
    </Box>
    
    {/* 2. 系统提示词标签页 */}
    <Box sx={{ display: configTab === 1 ? 'block' : 'none', height: '100%' }}>
      <SystemPromptCard {...systemPromptProps} />
    </Box>
    
    {/* 3. 功能配置标签页 */}
    <Box sx={{ display: configTab === 2 ? 'block' : 'none', height: '100%' }}>
      {/* 功能配置子标签页容器 */}
      <Box sx={{ borderBottom: '1px solid rgba(0,0,0,0.08)', mb: 3 }}>
        <FunctionSubTabs 
          functionSubTab={functionSubTab} 
          handleFunctionSubTabChange={handleFunctionSubTabChange} 
        />
      </Box>
      
      {/* 工具组件子标签页内容 */}
      <Box sx={{ display: functionSubTab === 0 ? 'block' : 'none', height: 'calc(100% - 48px)' }}>
        <ToolsCard {...toolsProps} />
      </Box>
      
      {/* 知识库子标签页内容 */}
      <Box sx={{ display: functionSubTab === 1 ? 'block' : 'none', height: 'calc(100% - 48px)' }}>
        <KnowledgeBaseConfigCard {...knowledgeBaseProps} />
      </Box>
      
      {/* 高级功能子标签页内容 */}
      <Box sx={{ display: functionSubTab === 2 ? 'block' : 'none', height: 'calc(100% - 48px)' }}>
        {/* 高级功能内容 */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {advancedFeaturesProps.logicControlComponent}
          {advancedFeaturesProps.extensionFeaturesComponent}
        </Box>
      </Box>
    </Box>
  </Box>
);
