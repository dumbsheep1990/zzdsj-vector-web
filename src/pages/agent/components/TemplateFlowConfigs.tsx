import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  FormControl,
  FormLabel,
  Switch,
  Slider,
  TextField,
  Select,
  MenuItem,
  Chip,
  Grid,
  FormControlLabel,
  RadioGroup,
  Radio,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
  Alert
} from '@mui/material';
import { ExpandMore, Settings, Memory, Speed, Psychology } from '@mui/icons-material';

// 三种模板的流程配置接口
interface SimpleQAConfig {
  responseSpeed: 'fast' | 'balanced' | 'accurate';
  contextWindow: number;
  enableCache: boolean;
  maxRetries: number;
  tools: string[];
  outputFormat: 'text' | 'markdown' | 'json';
}

interface DeepThinkingConfig {
  reasoning_depth: number;
  analysis_steps: string[];
  collaboration_mode: 'sequential' | 'parallel' | 'adaptive';
  knowledge_integration: boolean;
  memory_persistence: boolean;
  quality_threshold: number;
  review_cycles: number;
  tools: string[];
}

interface IntelligentPlanningConfig {
  planning_horizon: 'short' | 'medium' | 'long';
  resource_allocation: 'conservative' | 'balanced' | 'aggressive';
  uncertainty_handling: 'low' | 'medium' | 'high';
  team_coordination: boolean;
  execution_monitoring: boolean;
  adaptive_replanning: boolean;
  optimization_level: number;
  tools: string[];
}

// 可用工具配置
const AVAILABLE_TOOLS = {
  'simple-qa': [
    { id: 'search', name: '网络搜索', description: '实时信息检索' },
    { id: 'calculator', name: '计算器', description: '数学计算' },
    { id: 'datetime', name: '时间日期', description: '时间相关操作' },
    { id: 'weather', name: '天气查询', description: '天气信息获取' },
    { id: 'currency', name: '汇率转换', description: '货币汇率计算' }
  ],
  'deep-thinking': [
    { id: 'reasoning', name: '逻辑推理', description: '复杂逻辑分析' },
    { id: 'research', name: '深度研究', description: '信息深度挖掘' },
    { id: 'data_analysis', name: '数据分析', description: '数据处理和分析' },
    { id: 'collaboration', name: '协作工具', description: '团队协作支持' },
    { id: 'memory', name: '记忆管理', description: '长期记忆存储' },
    { id: 'fact_checker', name: '事实核查', description: '信息准确性验证' }
  ],
  'intelligent-planning': [
    { id: 'planning', name: '策略规划', description: '制定执行策略' },
    { id: 'resource_mgmt', name: '资源管理', description: '资源分配优化' },
    { id: 'risk_assessment', name: '风险评估', description: '风险分析和预测' },
    { id: 'team_coordination', name: '团队协调', description: '多智能体协调' },
    { id: 'monitoring', name: '执行监控', description: '实时执行监控' },
    { id: 'optimization', name: '优化引擎', description: '自动优化调整' }
  ]
};

// 简单问答模板配置组件
export const SimpleQAFlowConfig: React.FC<{
  config: SimpleQAConfig;
  onChange: (config: SimpleQAConfig) => void;
}> = ({ config, onChange }) => {
  const updateConfig = (field: string, value: any) => {
    onChange({ ...config, [field]: value });
  };

  const toggleTool = (toolId: string) => {
    const newTools = config.tools.includes(toolId)
      ? config.tools.filter(id => id !== toolId)
      : [...config.tools, toolId];
    updateConfig('tools', newTools);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
        <Speed color="primary" />
        简单问答配置 (Agno Level 1)
      </Typography>

      <Alert severity="info" sx={{ mb: 3 }}>
        适用于快速响应场景，毫秒级处理，线性执行流程
      </Alert>

      <Grid container spacing={3}>
        {/* 响应速度配置 */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="subtitle1" sx={{ mb: 2 }}>响应速度优化</Typography>
              <FormControl fullWidth>
                <RadioGroup
                  value={config.responseSpeed}
                  onChange={(e) => updateConfig('responseSpeed', e.target.value)}
                  row
                >
                  <FormControlLabel value="fast" control={<Radio />} label="极速 (<100ms)" />
                  <FormControlLabel value="balanced" control={<Radio />} label="平衡 (<500ms)" />
                  <FormControlLabel value="accurate" control={<Radio />} label="准确 (<1s)" />
                </RadioGroup>
              </FormControl>
            </CardContent>
          </Card>
        </Grid>

        {/* 上下文窗口 */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="subtitle1" sx={{ mb: 2 }}>上下文窗口</Typography>
              <Slider
                value={config.contextWindow}
                onChange={(_, value) => updateConfig('contextWindow', value)}
                min={1000}
                max={8000}
                step={500}
                marks={[
                  { value: 1000, label: '1K' },
                  { value: 4000, label: '4K' },
                  { value: 8000, label: '8K' }
                ]}
                valueLabelDisplay="auto"
                valueLabelFormat={(value) => `${value} tokens`}
              />
            </CardContent>
          </Card>
        </Grid>

        {/* 系统设置 */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="subtitle1" sx={{ mb: 2 }}>系统设置</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={config.enableCache}
                      onChange={(e) => updateConfig('enableCache', e.target.checked)}
                    />
                  }
                  label="启用响应缓存"
                />
                <Box>
                  <Typography variant="body2" sx={{ mb: 1 }}>最大重试次数</Typography>
                  <Slider
                    value={config.maxRetries}
                    onChange={(_, value) => updateConfig('maxRetries', value)}
                    min={1}
                    max={5}
                    step={1}
                    marks
                    valueLabelDisplay="auto"
                  />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* 工具配置 */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="subtitle1" sx={{ mb: 2 }}>可用工具</Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {AVAILABLE_TOOLS['simple-qa'].map((tool) => (
                  <Chip
                    key={tool.id}
                    label={tool.name}
                    clickable
                    color={config.tools.includes(tool.id) ? 'primary' : 'default'}
                    variant={config.tools.includes(tool.id) ? 'filled' : 'outlined'}
                    onClick={() => toggleTool(tool.id)}
                  />
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* 输出格式 */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="subtitle1" sx={{ mb: 2 }}>输出格式</Typography>
              <FormControl fullWidth>
                <Select
                  value={config.outputFormat}
                  onChange={(e) => updateConfig('outputFormat', e.target.value)}
                >
                  <MenuItem value="text">纯文本</MenuItem>
                  <MenuItem value="markdown">Markdown格式</MenuItem>
                  <MenuItem value="json">JSON结构化</MenuItem>
                </Select>
              </FormControl>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

// 深度思考模板配置组件
export const DeepThinkingFlowConfig: React.FC<{
  config: DeepThinkingConfig;
  onChange: (config: DeepThinkingConfig) => void;
}> = ({ config, onChange }) => {
  const updateConfig = (field: string, value: any) => {
    onChange({ ...config, [field]: value });
  };

  const toggleTool = (toolId: string) => {
    const newTools = config.tools.includes(toolId)
      ? config.tools.filter(id => id !== toolId)
      : [...config.tools, toolId];
    updateConfig('tools', newTools);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
        <Psychology color="primary" />
        深度思考配置 (Agno Level 4-5)
      </Typography>

      <Alert severity="info" sx={{ mb: 3 }}>
        适用于复杂推理场景，多步分析，团队协作，系统性思考
      </Alert>

      <Grid container spacing={3}>
        {/* 推理深度 */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="subtitle1" sx={{ mb: 2 }}>推理深度</Typography>
              <Slider
                value={config.reasoning_depth}
                onChange={(_, value) => updateConfig('reasoning_depth', value)}
                min={1}
                max={10}
                step={1}
                marks={[
                  { value: 1, label: '浅层' },
                  { value: 5, label: '中等' },
                  { value: 10, label: '深度' }
                ]}
                valueLabelDisplay="auto"
                valueLabelFormat={(value) => `${value}层推理`}
              />
            </CardContent>
          </Card>
        </Grid>

        {/* 协作模式 */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="subtitle1" sx={{ mb: 2 }}>协作模式</Typography>
              <FormControl fullWidth>
                <RadioGroup
                  value={config.collaboration_mode}
                  onChange={(e) => updateConfig('collaboration_mode', e.target.value)}
                >
                  <FormControlLabel value="sequential" control={<Radio />} label="顺序执行" />
                  <FormControlLabel value="parallel" control={<Radio />} label="并行处理" />
                  <FormControlLabel value="adaptive" control={<Radio />} label="自适应" />
                </RadioGroup>
              </FormControl>
            </CardContent>
          </Card>
        </Grid>

        {/* 高级设置 */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="subtitle1" sx={{ mb: 2 }}>高级设置</Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={config.knowledge_integration}
                        onChange={(e) => updateConfig('knowledge_integration', e.target.checked)}
                      />
                    }
                    label="知识库集成"
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={config.memory_persistence}
                        onChange={(e) => updateConfig('memory_persistence', e.target.checked)}
                      />
                    }
                    label="记忆持久化"
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <Box>
                    <Typography variant="body2" sx={{ mb: 1 }}>质量阈值</Typography>
                    <Slider
                      value={config.quality_threshold}
                      onChange={(_, value) => updateConfig('quality_threshold', value)}
                      min={0.1}
                      max={1.0}
                      step={0.1}
                      valueLabelDisplay="auto"
                      valueLabelFormat={(value) => `${(value * 100).toFixed(0)}%`}
                    />
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* 工具配置 */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="subtitle1" sx={{ mb: 2 }}>推理工具</Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {AVAILABLE_TOOLS['deep-thinking'].map((tool) => (
                  <Chip
                    key={tool.id}
                    label={tool.name}
                    clickable
                    color={config.tools.includes(tool.id) ? 'primary' : 'default'}
                    variant={config.tools.includes(tool.id) ? 'filled' : 'outlined'}
                    onClick={() => toggleTool(tool.id)}
                  />
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* 审查设置 */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="subtitle1" sx={{ mb: 2 }}>质量审查</Typography>
              <Box>
                <Typography variant="body2" sx={{ mb: 1 }}>审查轮次</Typography>
                <Slider
                  value={config.review_cycles}
                  onChange={(_, value) => updateConfig('review_cycles', value)}
                  min={1}
                  max={5}
                  step={1}
                  marks
                  valueLabelDisplay="auto"
                  valueLabelFormat={(value) => `${value}轮审查`}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

// 智能规划模板配置组件
export const IntelligentPlanningFlowConfig: React.FC<{
  config: IntelligentPlanningConfig;
  onChange: (config: IntelligentPlanningConfig) => void;
}> = ({ config, onChange }) => {
  const updateConfig = (field: string, value: any) => {
    onChange({ ...config, [field]: value });
  };

  const toggleTool = (toolId: string) => {
    const newTools = config.tools.includes(toolId)
      ? config.tools.filter(id => id !== toolId)
      : [...config.tools, toolId];
    updateConfig('tools', newTools);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
        <Settings color="primary" />
        智能规划配置 (Agno Level 4-5)
      </Typography>

      <Alert severity="info" sx={{ mb: 3 }}>
        适用于复杂任务规划，多智能体协调，资源优化配置
      </Alert>

      <Grid container spacing={3}>
        {/* 规划设置 */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="subtitle1" sx={{ mb: 2 }}>规划配置</Typography>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" sx={{ mb: 1 }}>规划视野</Typography>
                <FormControl fullWidth>
                  <RadioGroup
                    value={config.planning_horizon}
                    onChange={(e) => updateConfig('planning_horizon', e.target.value)}
                  >
                    <FormControlLabel value="short" control={<Radio />} label="短期 (1-7天)" />
                    <FormControlLabel value="medium" control={<Radio />} label="中期 (1-4周)" />
                    <FormControlLabel value="long" control={<Radio />} label="长期 (1-6月)" />
                  </RadioGroup>
                </FormControl>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* 资源分配 */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="subtitle1" sx={{ mb: 2 }}>资源分配策略</Typography>
              <FormControl fullWidth>
                <RadioGroup
                  value={config.resource_allocation}
                  onChange={(e) => updateConfig('resource_allocation', e.target.value)}
                >
                  <FormControlLabel value="conservative" control={<Radio />} label="保守型" />
                  <FormControlLabel value="balanced" control={<Radio />} label="平衡型" />
                  <FormControlLabel value="aggressive" control={<Radio />} label="激进型" />
                </RadioGroup>
              </FormControl>
            </CardContent>
          </Card>
        </Grid>

        {/* 不确定性处理 */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="subtitle1" sx={{ mb: 2 }}>不确定性处理</Typography>
              <FormControl fullWidth>
                <RadioGroup
                  value={config.uncertainty_handling}
                  onChange={(e) => updateConfig('uncertainty_handling', e.target.value)}
                  row
                >
                  <FormControlLabel value="low" control={<Radio />} label="低容忍度" />
                  <FormControlLabel value="medium" control={<Radio />} label="中等容忍度" />
                  <FormControlLabel value="high" control={<Radio />} label="高容忍度" />
                </RadioGroup>
              </FormControl>
            </CardContent>
          </Card>
        </Grid>

        {/* 协调设置 */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="subtitle1" sx={{ mb: 2 }}>协调设置</Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={config.team_coordination}
                        onChange={(e) => updateConfig('team_coordination', e.target.checked)}
                      />
                    }
                    label="团队协调"
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={config.execution_monitoring}
                        onChange={(e) => updateConfig('execution_monitoring', e.target.checked)}
                      />
                    }
                    label="执行监控"
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={config.adaptive_replanning}
                        onChange={(e) => updateConfig('adaptive_replanning', e.target.checked)}
                      />
                    }
                    label="自适应重规划"
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* 优化设置 */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="subtitle1" sx={{ mb: 2 }}>优化设置</Typography>
              <Box>
                <Typography variant="body2" sx={{ mb: 1 }}>优化级别</Typography>
                <Slider
                  value={config.optimization_level}
                  onChange={(_, value) => updateConfig('optimization_level', value)}
                  min={1}
                  max={10}
                  step={1}
                  marks={[
                    { value: 1, label: '基础' },
                    { value: 5, label: '标准' },
                    { value: 10, label: '极致' }
                  ]}
                  valueLabelDisplay="auto"
                  valueLabelFormat={(value) => `Level ${value}`}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* 工具配置 */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="subtitle1" sx={{ mb: 2 }}>规划工具</Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {AVAILABLE_TOOLS['intelligent-planning'].map((tool) => (
                  <Chip
                    key={tool.id}
                    label={tool.name}
                    clickable
                    color={config.tools.includes(tool.id) ? 'primary' : 'default'}
                    variant={config.tools.includes(tool.id) ? 'filled' : 'outlined'}
                    onClick={() => toggleTool(tool.id)}
                  />
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

// 默认配置
export const defaultSimpleQAConfig: SimpleQAConfig = {
  responseSpeed: 'balanced',
  contextWindow: 4000,
  enableCache: true,
  maxRetries: 3,
  tools: ['search', 'calculator'],
  outputFormat: 'text'
};

export const defaultDeepThinkingConfig: DeepThinkingConfig = {
  reasoning_depth: 5,
  analysis_steps: [],
  collaboration_mode: 'adaptive',
  knowledge_integration: true,
  memory_persistence: true,
  quality_threshold: 0.8,
  review_cycles: 2,
  tools: ['reasoning', 'research', 'collaboration']
};

export const defaultIntelligentPlanningConfig: IntelligentPlanningConfig = {
  planning_horizon: 'medium',
  resource_allocation: 'balanced',
  uncertainty_handling: 'medium',
  team_coordination: true,
  execution_monitoring: true,
  adaptive_replanning: true,
  optimization_level: 5,
  tools: ['planning', 'resource_mgmt', 'team_coordination']
};