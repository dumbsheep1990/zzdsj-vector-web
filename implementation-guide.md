# 智能体助手系统功能增强实现指南

本文档详细说明了对智能体构建页面的增强功能实现方案，包括以下核心需求：

1. 智能体助手配置工具的逻辑控制（if-else 支持）
2. 工具分类中增加"知识库"和"智能体"标签（Tab 分类）
3. 提示词设置支持导入系统提示词模板
4. 提示词自定义变量功能（使用 {{}} 语法）

## 1. 智能体助手配置流程中的逻辑控制实现

### 1.1 需求描述

在智能体助手配置工具的流程中增加逻辑控制功能，支持 if-else 条件判断，使配置过程更加灵活和智能。

### 1.2 技术实现方案

#### 1.2.1 数据结构设计

创建一个新的 `LogicControl` 组件，用于实现条件逻辑控制。首先，定义条件逻辑的数据结构：

```typescript
// 逻辑控制类型定义
interface LogicCondition {
  id: string;
  type: 'if' | 'elseif' | 'else';
  condition?: string; // if 和 elseif 需要条件表达式，else 不需要
  actions: Action[];  // 满足条件时执行的动作
}

interface Action {
  id: string;
  type: 'setVariable' | 'callTool' | 'executeCode';
  config: {
    // 根据不同的 action 类型，配置不同的属性
    [key: string]: any;
  };
}

// 在 Tool 接口中添加逻辑控制属性
interface Tool {
  // 现有属性保持不变
  id: string;
  name: string;
  description: string;
  category: string;
  icon: React.ReactNode;
  
  // 新增逻辑控制相关属性
  logicFlow?: LogicCondition[];
  outputVariable?: string; // 工具输出可以存储到的变量名
}
```

#### 1.2.2 组件设计

1. 创建 `LogicControlEditor` 组件，用于可视化编辑逻辑流程：

```jsx
// src/pages/agent/components/LogicControlEditor.tsx
import React, { useState } from 'react';
import {
  Box, Typography, Button, Paper, Divider,
  TextField, MenuItem, IconButton, Card, CardContent
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { LogicCondition, Action } from '../types';

interface LogicControlEditorProps {
  logicFlow: LogicCondition[];
  onLogicFlowChange: (logicFlow: LogicCondition[]) => void;
  availableVariables: string[];
  availableTools: Tool[];
}

export default function LogicControlEditor({
  logicFlow,
  onLogicFlowChange,
  availableVariables,
  availableTools
}: LogicControlEditorProps) {
  // 实现逻辑流程编辑的界面和功能
  // ...
}
```

2. 在 `ToolsCard` 组件中整合逻辑控制功能：

```jsx
// 修改 src/pages/agent/components/ToolsCard.tsx
// 添加逻辑控制编辑功能
```

### 1.3 UI/UX 设计

- 使用树形结构或流程图的视觉表现形式，清晰展示 if-else 逻辑
- 为逻辑块添加不同的背景色（保持蓝色系调），帮助用户区分不同的条件分支
- 使用简洁的接口允许用户轻松添加、编辑和删除条件和动作
- 提供条件表达式的帮助提示和示例，降低用户学习成本

## 2. 增加知识库和智能体标签分类

### 2.1 需求描述

在工具类别中增加"知识库"和"智能体"的标签，与当前工具类别分开，使用 Tab 分类样式进行区分。

### 2.2 技术实现方案

#### 2.2.1 数据结构设计

扩展当前的分类系统，增加顶层分类：

```typescript
// 顶层分类定义
type TabCategory = 'tools' | 'knowledge' | 'agents';

// 修改现有的工具分类结构
interface CategoryDefinition {
  id: string;
  name: string;
  tabCategory: TabCategory; // 新增属性，指定所属顶层分类
  color: {
    bg: string;
    text: string;
    dark: string;
  };
}

// 预定义分类
const CATEGORIES: Record<string, CategoryDefinition> = {
  // 现有工具分类
  utility: {
    id: 'utility',
    name: '实用工具',
    tabCategory: 'tools',
    color: { bg: '#e3f2fd', text: '#1565c0', dark: '#0d47a1' }
  },
  development: {
    id: 'development',
    name: '开发工具',
    tabCategory: 'tools',
    color: { bg: '#e8f5e9', text: '#2e7d32', dark: '#1b5e20' }
  },
  // ... 其他现有分类
  
  // 新增知识库相关分类
  document: {
    id: 'document',
    name: '文档知识库',
    tabCategory: 'knowledge',
    color: { bg: '#e0f7fa', text: '#00838f', dark: '#006064' }
  },
  database: {
    id: 'database',
    name: '数据库知识',
    tabCategory: 'knowledge',
    color: { bg: '#f3e5f5', text: '#7b1fa2', dark: '#4a148c' }
  },
  
  // 新增智能体分类
  assistant: {
    id: 'assistant',
    name: '助手型智能体',
    tabCategory: 'agents',
    color: { bg: '#e8eaf6', text: '#3949ab', dark: '#1a237e' }
  },
  specialist: {
    id: 'specialist',
    name: '专家型智能体',
    tabCategory: 'agents',
    color: { bg: '#e0f2f1', text: '#00796b', dark: '#004d40' }
  }
};
```

#### 2.2.2 组件设计

修改 `ToolsCard` 组件，添加 Tab 分类功能：

```jsx
// src/pages/agent/components/ToolsCard.tsx
import React, { useState } from 'react';
import {
  Box, Paper, Typography, Tabs, Tab, Divider,
  Grid, Chip, Avatar, IconButton, Tooltip
} from '@mui/material';
import { Tool, CATEGORIES, TabCategory } from '../types';

interface ToolsCardProps {
  // 现有属性保持不变
  // 添加新属性
  defaultTabCategory?: TabCategory;
}

export default function ToolsCard({
  selectedTools,
  toggleToolSelection,
  renderToolChips,
  defaultTabCategory = 'tools'
}: ToolsCardProps) {
  const [activeTabCategory, setActiveTabCategory] = useState<TabCategory>(defaultTabCategory);
  const [activeSubCategory, setActiveSubCategory] = useState<string>('all');
  
  // 根据当前活动的 Tab 类别过滤工具和子分类
  // ...
  
  return (
    <Paper elevation={0} sx={{/* 样式保持现有设计语言 */}}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs 
          value={activeTabCategory} 
          onChange={(_, newValue) => setActiveTabCategory(newValue)}
          sx={{
            '& .MuiTab-root': {
              // 保持现有设计风格，使用科技感渐变
              // ...
            }
          }}
        >
          <Tab label="工具" value="tools" />
          <Tab label="知识库" value="knowledge" />
          <Tab label="智能体" value="agents" />
        </Tabs>
      </Box>
      
      {/* 子分类和工具展示区域 */}
      {/* ... */}
    </Paper>
  );
}
```

### 2.3 UI/UX 设计

- 使用现代化的 Tab 设计，保持现有的科技感渐变风格
- 每个 Tab 内容区域使用统一的设计语言，但可使用不同的色彩方案进行区分：
  - 工具：蓝色系
  - 知识库：紫色系
  - 智能体：青色系
- 确保所有 Tab 内容有一致的高度和视觉平衡
- 添加平滑的过渡动画，提升用户体验

## 3. 提示词设置支持导入系统提示词模板

### 3.1 需求描述

在提示词设置区域增加支持导入当前系统提示词模板的功能，对接 `prompt-template.ts` 服务中的相关数据。

### 3.2 技术实现方案

#### 3.2.1 前端服务封装

创建一个前端服务来调用后端的提示词模板服务：

```typescript
// src/services/promptTemplateService.ts
import axios from 'axios';
import { PromptTemplate, PromptCategory } from '../../shared/types/prompt-template';

class PromptTemplateService {
  private apiUrl: string;
  
  constructor() {
    this.apiUrl = process.env.REACT_APP_API_URL || '/api';
  }
  
  // 获取提示词模板列表
  async getPromptTemplates(filters: {
    categoryId?: string;
    search?: string;
    tags?: string[];
  } = {}): Promise<PromptTemplate[]> {
    const params = new URLSearchParams();
    if (filters.categoryId) params.append('categoryId', filters.categoryId);
    if (filters.search) params.append('search', filters.search);
    if (filters.tags && filters.tags.length > 0) {
      filters.tags.forEach(tag => params.append('tags', tag));
    }
    
    try {
      const response = await axios.get<PromptTemplate[]>(
        `${this.apiUrl}/prompt-templates?${params.toString()}`
      );
      return response.data;
    } catch (error) {
      console.error('获取提示词模板列表失败:', error);
      throw new Error('获取提示词模板列表失败');
    }
  }
  
  // 获取提示词模板分类
  async getPromptCategories(): Promise<PromptCategory[]> {
    try {
      const response = await axios.get<PromptCategory[]>(`${this.apiUrl}/prompt-categories`);
      return response.data;
    } catch (error) {
      console.error('获取提示词模板分类失败:', error);
      throw new Error('获取提示词模板分类失败');
    }
  }
  
  // 获取提示词模板详情
  async getPromptTemplateById(id: string): Promise<PromptTemplate | null> {
    try {
      const response = await axios.get<PromptTemplate>(`${this.apiUrl}/prompt-templates/${id}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return null;
      }
      console.error(`获取提示词模板详情失败, ID: ${id}:`, error);
      throw new Error('获取提示词模板详情失败');
    }
  }
}

export default new PromptTemplateService();
```

#### 3.2.2 组件设计

修改 `SystemPromptCard` 组件，添加导入模板功能：

```jsx
// src/pages/agent/components/SystemPromptCard.tsx
import React, { useState, useEffect } from 'react';
import {
  Box, Paper, Typography, TextField, Button, IconButton,
  Tooltip, Dialog, DialogTitle, DialogContent, DialogActions,
  List, ListItem, ListItemText, Divider, Chip, InputAdornment
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import DownloadIcon from '@mui/icons-material/Download';
import promptTemplateService from '../../../services/promptTemplateService';
import { PromptTemplate, PromptCategory } from '../../../../shared/types/prompt-template';

interface SystemPromptCardProps {
  systemPrompt: string;
  setSystemPrompt: (value: string) => void;
}

export default function SystemPromptCard({
  systemPrompt,
  setSystemPrompt
}: SystemPromptCardProps) {
  // 状态管理
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [promptTemplates, setPromptTemplates] = useState<PromptTemplate[]>([]);
  const [promptCategories, setPromptCategories] = useState<PromptCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // 加载模板数据
  useEffect(() => {
    const loadTemplates = async () => {
      try {
        const categories = await promptTemplateService.getPromptCategories();
        setPromptCategories(categories);
        
        const templates = await promptTemplateService.getPromptTemplates();
        setPromptTemplates(templates);
      } catch (error) {
        console.error('加载提示词模板数据失败:', error);
      }
    };
    
    loadTemplates();
  }, []);
  
  // 处理模板搜索和筛选
  const handleSearch = async () => {
    try {
      const templates = await promptTemplateService.getPromptTemplates({
        categoryId: selectedCategory || undefined,
        search: searchQuery || undefined
      });
      setPromptTemplates(templates);
    } catch (error) {
      console.error('搜索提示词模板失败:', error);
    }
  };
  
  // 处理模板应用
  const applyTemplate = (template: PromptTemplate) => {
    setSystemPrompt(template.content);
    setImportDialogOpen(false);
  };
  
  // UI 渲染
  // ...
}
```

### 3.3 UI/UX 设计

- 在 `SystemPromptCard` 组件中添加一个"导入模板"按钮，采用与现有设计一致的蓝色渐变风格
- 点击后弹出一个模态框，显示可选的提示词模板列表
- 模板列表支持分类查看和搜索功能
- 每个模板项目应显示标题、简短描述和标签
- 模板列表使用卡片式设计，保持现有的视觉风格

## 4. 提示词自定义变量功能

### 4.1 需求描述

在提示词设置中支持自定义变量的输入，使用 `{{}}` 语法进行标记，同时支持选择系统内置的变量。

### 4.2 技术实现方案

#### 4.2.1 数据结构设计

定义变量类型和系统内置变量：

```typescript
// src/pages/agent/types.ts
// 变量类型定义
interface PromptVariable {
  id: string;
  name: string;
  description: string;
  defaultValue?: string;
  type: 'text' | 'number' | 'boolean' | 'select';
  options?: string[]; // 仅当 type 为 'select' 时使用
  isBuiltIn: boolean; // 是否为系统内置变量
}

// 系统内置变量
const SYSTEM_VARIABLES: PromptVariable[] = [
  {
    id: 'user_name',
    name: 'user_name',
    description: '当前用户名称',
    type: 'text',
    isBuiltIn: true
  },
  {
    id: 'current_date',
    name: 'current_date',
    description: '当前日期',
    type: 'text',
    isBuiltIn: true
  },
  {
    id: 'agent_name',
    name: 'agent_name',
    description: '智能体名称',
    type: 'text',
    isBuiltIn: true
  },
  {
    id: 'conversation_history',
    name: 'conversation_history',
    description: '对话历史记录',
    type: 'text',
    isBuiltIn: true
  },
  {
    id: 'knowledge_context',
    name: 'knowledge_context',
    description: '知识库上下文',
    type: 'text',
    isBuiltIn: true
  }
];
```

#### 4.2.2 组件设计

1. 创建变量选择和管理组件：

```jsx
// src/pages/agent/components/VariableManager.tsx
import React, { useState } from 'react';
import {
  Box, Typography, TextField, Button, IconButton,
  Dialog, DialogTitle, DialogContent, DialogActions,
  List, ListItem, ListItemText, Divider, Chip
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { PromptVariable } from '../types';

interface VariableManagerProps {
  variables: PromptVariable[];
  onVariablesChange: (variables: PromptVariable[]) => void;
  systemVariables: PromptVariable[];
  onInsertVariable: (variable: PromptVariable) => void;
}

export default function VariableManager({
  variables,
  onVariablesChange,
  systemVariables,
  onInsertVariable
}: VariableManagerProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newVariable, setNewVariable] = useState<Partial<PromptVariable>>({
    name: '',
    description: '',
    type: 'text',
    isBuiltIn: false
  });
  
  // 处理添加自定义变量
  const handleAddVariable = () => {
    if (newVariable.name) {
      const variable: PromptVariable = {
        id: `custom_${Date.now()}`,
        name: newVariable.name,
        description: newVariable.description || '',
        type: newVariable.type as 'text' | 'number' | 'boolean' | 'select',
        defaultValue: newVariable.defaultValue,
        options: newVariable.options,
        isBuiltIn: false
      };
      
      onVariablesChange([...variables, variable]);
      setNewVariable({
        name: '',
        description: '',
        type: 'text',
        isBuiltIn: false
      });
      setDialogOpen(false);
    }
  };
  
  return (
    <>
      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 500 }}>
          可用变量
        </Typography>
        
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {/* 系统变量展示 */}
          {systemVariables.map(variable => (
            <Chip
              key={variable.id}
              label={`{{${variable.name}}}`}
              onClick={() => onInsertVariable(variable)}
              sx={{
                bgcolor: '#e3f2fd',
                color: '#1565c0',
                '&:hover': { bgcolor: '#bbdefb' }
              }}
            />
          ))}
          
          {/* 自定义变量展示 */}
          {variables.map(variable => (
            <Chip
              key={variable.id}
              label={`{{${variable.name}}}`}
              onClick={() => onInsertVariable(variable)}
              onDelete={() => {/* 删除变量的处理 */}}
              sx={{
                bgcolor: '#e8f5e9',
                color: '#2e7d32',
                '&:hover': { bgcolor: '#c8e6c9' }
              }}
            />
          ))}
          
          {/* 添加变量按钮 */}
          <Chip
            icon={<AddIcon />}
            label="添加变量"
            onClick={() => setDialogOpen(true)}
            sx={{
              bgcolor: '#f5f5f5',
              '&:hover': { bgcolor: '#e0e0e0' }
            }}
          />
        </Box>
      </Box>
      
      {/* 添加变量对话框 */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        {/* 变量添加表单 */}
        {/* ... */}
      </Dialog>
    </>
  );
}
```

2. 在 `SystemPromptCard` 组件中整合变量功能：

```jsx
// 修改 src/pages/agent/components/SystemPromptCard.tsx
// 添加变量支持
```

### 4.3 UI/UX 设计

- 在提示词编辑器添加一个变量工具栏，显示系统变量和自定义变量
- 变量以 `{{变量名}}` 的形式显示在提示词中，使用特殊样式高亮显示
- 提供变量提示和自动完成功能，当用户输入 `{{` 时显示变量列表
- 对提示词进行语法高亮，使用轻微的背景色区分变量和普通文本
- 添加一个"测试"功能，允许用户预览变量替换后的实际提示词效果

## 5. 实现步骤与时间线

### 5.1 阶段一：基础架构设计与数据结构定义（2-3天）

1. 定义所有需要的数据类型和接口
2. 设计并实现前端与 prompt-template 服务的集成
3. 创建所需的工具函数和辅助方法

### 5.2 阶段二：UI 组件开发（5-7天）

1. 实现逻辑控制相关组件（2天）
2. 实现知识库和智能体标签分类（1-2天）
3. 实现提示词模板导入功能（1-2天）
4. 实现提示词自定义变量功能（1-2天）

### 5.3 阶段三：集成测试与优化（2-3天）

1. 组件集成并测试功能完整性
2. UI/UX 优化，确保视觉一致性
3. 性能优化和代码重构

## 6. 注意事项与最佳实践

1. **设计一致性**：保持与现有界面的视觉设计一致，使用相同的颜色系统和组件风格
2. **性能考量**：
   - 避免不必要的重渲染，特别是在处理变量和逻辑控制时
   - 针对大量数据的情况（如大量提示词模板）进行分页处理
3. **错误处理**：对所有 API 调用添加适当的错误处理和用户友好的错误提示
4. **可访问性**：确保所有新增组件符合可访问性标准，提供键盘导航支持
5. **国际化支持**：为所有文本提供国际化支持，便于未来的多语言扩展

## 7. 附录

### 7.1 涉及的关键文件

- `src/pages/agent/AgentBuilder.tsx`（主组件）
- `src/pages/agent/components/SystemPromptCard.tsx`（提示词设置组件）
- `src/pages/agent/components/ToolsCard.tsx`（工具选择组件）
- `src/pages/agent/components/LogicControlEditor.tsx`（新增：逻辑控制编辑器）
- `src/pages/agent/components/VariableManager.tsx`（新增：变量管理器）
- `src/services/promptTemplateService.ts`（新增：前端提示词模板服务）
- `src/pages/agent/types.ts`（更新：类型定义）

### 7.2 API 接口说明

详细说明与后端 `prompt-template.ts` 服务交互的 API 接口，包括请求参数、响应格式等。
