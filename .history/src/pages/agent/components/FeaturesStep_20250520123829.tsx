import React from 'react';
import { Box, Tabs, Tab, Fade } from '@mui/material';
import ToolsCard from './ToolsCard';
import KnowledgeBaseCard from './KnowledgeBaseCard';
import AdvancedSettingsCard from './AdvancedSettingsCard';
import { Tool, KnowledgeBase } from './types';
import { AdvancedSettings } from '../AgentBuilder';

interface FeaturesStepProps {
  tabValue: number;
  onTabChange: (newValue: number) => void;
  selectedTools: Tool[];
  toggleToolSelection: (tool: Tool) => void;
  renderToolChips: () => React.ReactNode;
  selectedKnowledgeBases: KnowledgeBase[];
  toggleKnowledgeBaseSelection: (kb: KnowledgeBase) => void;
  advancedSettings: AdvancedSettings;
  onAdvancedSettingsChange: (settings: AdvancedSettings) => void;
}

const FeaturesStep: React.FC<FeaturesStepProps> = ({
  tabValue,
  onTabChange,
  selectedTools,
  toggleToolSelection,
  renderToolChips,
  selectedKnowledgeBases,
  toggleKnowledgeBaseSelection,
  advancedSettings,
  onAdvancedSettingsChange
}) => {
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    onTabChange(newValue);
  };

  return (
    <Fade in={true}>
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        {/* 功能配置子标签 */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: 'white', mb: 3 }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange}
          >
            <Tab label="工具组件" />
            <Tab label="知识库" />
            <Tab label="高级功能" />
          </Tabs>
        </Box>
        
        {/* 功能配置子标签内容 */}
        <Box>
          {/* 工具组件标签页 */}
          {tabValue === 0 && (
            <Box>
              <ToolsCard 
                selectedTools={selectedTools}
                toggleToolSelection={toggleToolSelection}
                renderToolChips={renderToolChips}
              />
            </Box>
          )}
          
          {/* 知识库标签页 */}
          {tabValue === 1 && (
            <Box>
              <KnowledgeBaseCard 
                selectedKnowledgeBases={selectedKnowledgeBases}
                toggleKnowledgeBaseSelection={toggleKnowledgeBaseSelection}
              />
            </Box>
          )}
          
          {/* 高级功能标签页 */}
          {tabValue === 2 && (
            <Box>
              <AdvancedSettingsCard 
                settings={advancedSettings}
                onChange={onAdvancedSettingsChange}
              />
            </Box>
          )}
        </Box>
      </Box>
    </Fade>
  );
};

export default FeaturesStep;
