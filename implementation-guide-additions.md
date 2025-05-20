# 智能体助手系统功能增强 - 附加功能

## 8. 知识库关联和问答配置功能

### 8.1 需求描述

将知识库的关联和问答配置相关内容单独设为一项配置功能。主要包括：
- 指定问答的回答文档或相关QA数据集
- 配置知识库的首选和备选查询逻辑，支持多级按顺序查询
- 添加自定义查询策略和路由规则

### 8.2 技术实现方案

#### 8.2.1 数据结构设计

```typescript
// 知识库配置类型
interface KnowledgeBaseConfig {
  id: string;
  name: string;
  priority: number; // 优先级，用于多级查询排序
  type: 'vector' | 'qa_dataset' | 'document';
  connectionParams: {
    endpoint?: string;
    apiKey?: string;
    datasetId?: string;
    documentIds?: string[];
  };
  querySettings: {
    maxResults: number;
    similarityThreshold: number;
    filterOptions?: Record<string, any>;
  };
}

// 问答路由配置类型
interface QARoutingConfig {
  id: string;
  name: string;
  routingStrategy: 'sequential' | 'parallel' | 'conditional';
  knowledgeBases: KnowledgeBaseConfig[]; // 按优先级排序的知识库列表
  fallbackResponse?: string; // 当所有知识库都没有找到答案时的回复
  routingConditions?: {
    conditionType: 'keyword' | 'intent' | 'custom';
    conditionValue: string;
    targetKnowledgeBaseId: string;
  }[];
}
```

#### 8.2.2 组件设计

创建新的 `KnowledgeBaseConfigCard` 组件，用于知识库和问答配置：

```jsx
// src/pages/agent/components/KnowledgeBaseConfigCard.tsx
import React, { useState } from 'react';
import {
  Box, Paper, Typography, Divider, Button, IconButton,
  List, ListItem, ListItemText, ListItemIcon, ListItemSecondaryAction,
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Select, MenuItem, FormControl, InputLabel,
  Switch, FormControlLabel
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import StorageIcon from '@mui/icons-material/Storage';
import { KnowledgeBaseConfig, QARoutingConfig } from '../types';

// 组件代码实现...
```

### 8.3 UI/UX 设计

- 知识库列表采用可排序的形式，便于调整查询优先级
- 每个知识库项有明显的类型标识（向量库/QA数据集/文档库）
- 使用不同颜色区分不同优先级的知识库
- 添加可视化的知识库连接状态指示器
- 路由策略选择器使用直观的图标和说明
- 提供详细的配置说明和帮助提示

### 8.4 集成到 AgentBuilder 中

在 `AgentBuilder.tsx` 中添加知识库配置组件：

```jsx
// 在左侧区域添加知识库配置卡片
<Box sx={{ flex: 1, width: { xs: '100%', md: '50%' } }}>
  <Paper 
    elevation={0} 
    sx={{ 
      p: 3, 
      borderRadius: '12px', 
      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.05)',
      // ...其他现有样式
    }}
  >
    {/* 现有的基本信息配置 */}
    <BasicInfoCard
      agentName={agentName}
      setAgentName={setAgentName}
      // ...其他属性
    />
    
    {/* 添加知识库配置组件 */}
    <Box sx={{ mt: 4 }}>
      <KnowledgeBaseConfigCard
        knowledgeBases={knowledgeBases}
        onKnowledgeBasesChange={setKnowledgeBases}
        qaRoutingConfig={qaRoutingConfig}
        onQARoutingConfigChange={setQARoutingConfig}
      />
    </Box>
    
    {/* 其他组件... */}
  </Paper>
</Box>
```

## 9. 扩展功能选择与配置

### 9.1 需求描述

增加扩展功能的选择和配置，包括：
- 语音对话：支持 TTS（文本转语音）和 STT（语音转文本）
- 多模态检索：支持图像、音频、视频等多媒体内容的处理
- 其他扩展能力的配置选项

### 9.2 技术实现方案

#### 9.2.1 数据结构设计

```typescript
// 扩展功能类型
interface ExtensionFeature {
  id: string;
  name: string;
  type: 'voice' | 'multimodal' | 'custom';
  isEnabled: boolean;
  config: {
    // 根据不同扩展类型的特定配置
    [key: string]: any;
  };
}

// 语音对话配置
interface VoiceDialogConfig {
  voiceId: string;
  language: string;
  speed: number;
  pitch: number;
  useCustomTTS: boolean;
  customTTSEndpoint?: string;
  sttConfig?: {
    language: string;
    preferredEngine: 'built-in' | 'custom';
    customEndpoint?: string;
  };
}

// 多模态检索配置
interface MultimodalConfig {
  supportedTypes: ('image' | 'audio' | 'video')[];
  imageAnalysisLevel: 'basic' | 'detailed';
  audioTranscription: boolean;
  videoAnalysis: boolean;
  maxFileSize: number; // MB
}
```

#### 9.2.2 组件设计

创建新的 `ExtensionFeaturesCard` 组件，用于扩展功能配置：

```jsx
// src/pages/agent/components/ExtensionFeaturesCard.tsx
import React, { useState } from 'react';
import {
  Box, Paper, Typography, Divider, Switch, FormControlLabel,
  Accordion, AccordionSummary, AccordionDetails,
  TextField, Select, MenuItem, FormControl, InputLabel,
  Slider, Grid, Chip
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MicIcon from '@mui/icons-material/Mic';
import ImageIcon from '@mui/icons-material/Image';
import ExtensionIcon from '@mui/icons-material/Extension';
import { ExtensionFeature } from '../types';

// 组件代码实现...
```

### 9.3 UI/UX 设计

- 使用折叠面板（Accordion）展示不同的扩展功能
- 每个功能有明确的开关按钮，便于快速启用/禁用
- 启用后自动展开详细配置区域
- 使用直观的图标和配色区分不同功能
- 配置项分组并使用小标题，提升可读性
- 为复杂选项提供帮助提示和默认值

## 10. 用户查询控制功能

### 10.1 需求描述

在智能体配置中增加用户查询控制功能，主要包括：
- 敏感词校验和检测
- 自定义敏感内容处理策略
- 查询限制和过滤规则

### 10.2 技术实现方案

#### 10.2.1 数据结构设计

```typescript
// 敏感词配置类型
interface SensitiveWordConfig {
  isEnabled: boolean;
  mode: 'block' | 'filter' | 'warn';
  sensitiveCategories: ('political' | 'adult' | 'violence' | 'discrimination' | 'custom')[];
  customWords: string[];
  blockResponse?: string;
  warnResponse?: string;
  logViolations: boolean;
}

// 查询控制配置类型
interface QueryControlConfig {
  sensitiveWord: SensitiveWordConfig;
  maxQueryLength: number;
  rateLimiting: {
    isEnabled: boolean;
    maxQueriesPerMinute: number;
    maxQueriesPerHour: number;
  };
}
```

#### 10.2.2 组件设计

创建新的 `QueryControlCard` 组件，用于用户查询控制配置：

```jsx
// src/pages/agent/components/QueryControlCard.tsx
import React, { useState } from 'react';
import {
  Box, Paper, Typography, Divider, Switch, FormControlLabel,
  TextField, Select, MenuItem, FormControl, InputLabel,
  Chip, Grid, Slider
} from '@mui/material';
import SecurityIcon from '@mui/icons-material/Security';
import { QueryControlConfig } from '../types';

// 组件代码实现...
```

### 10.3 UI/UX 设计

- 敏感词配置区域使用清晰的开关和模式选择
- 提供自定义敏感词添加和管理界面
- 使用标签形式展示已添加的敏感词类别和自定义词
- 对于敏感内容响应设置提供模板和变量支持
- 查询限制部分使用滑块控件，便于直观设置
- 整体保持与其他卡片一致的设计语言和样式

## 11. 实现和集成计划

### 11.1 扩展后的文件结构

```
src/
├── pages/
│   └── agent/
│       ├── AgentBuilder.tsx (更新)
│       ├── components/
│       │   ├── BasicInfoCard.tsx (现有)
│       │   ├── SystemPromptCard.tsx (更新)
│       │   ├── ToolsCard.tsx (更新)
│       │   ├── LogicControlEditor.tsx (新增)
│       │   ├── VariableManager.tsx (新增)
│       │   ├── KnowledgeBaseConfigCard.tsx (新增)
│       │   ├── ExtensionFeaturesCard.tsx (新增)
│       │   └── QueryControlCard.tsx (新增)
│       └── types.ts (扩展)
├── services/
│   └── promptTemplateService.ts (新增)
└── shared/
    └── types/
        └── prompt-template.ts (现有)
```

### 11.2 优先级与实施顺序

1. **第一阶段** (基础能力)
   - 知识库配置组件开发
   - 提示词模板导入功能
   - 工具分类与Tab实现

2. **第二阶段** (增强能力)
   - 逻辑控制功能实现
   - 提示词变量支持
   - 敏感词检测配置

3. **第三阶段** (扩展能力)
   - 语音对话配置
   - 多模态检索设置
   - 集成测试与性能优化

### 11.3 技术要点与注意事项

- 所有新增组件严格遵循现有设计系统风格指南
- 保持组件间的数据流一致性，避免状态管理混乱
- 配置数据应支持导入/导出功能，便于配置共享
- 敏感词功能需要考虑隐私和安全问题
- 扩展功能应设计为可插拔的模块化结构

### 11.4 UI/UX 设计通用原则

- 所有配置卡片使用统一的标题栏和分割线样式
- 保持蓝色系科技感渐变作为主要设计元素
- 重要操作按钮使用突出的视觉效果
- 复杂设置使用分组和折叠面板减少视觉复杂度
- 提供完整的提示和帮助信息，降低使用门槛
