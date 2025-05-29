# 工作流编排增强设计方案

## 1. 功能需求分析

根据用户需求，需要对现有的工具编排系统进行两方面的增强：

1. **工具执行顺序自定义**：让用户能够灵活定义工具和模块的执行顺序
2. **模块命名优化**：对现有模块名称进行更新，使其更准确地反映功能

## 2. 模块命名优化方案

### 现有模块命名问题

当前模块命名存在一定的模糊性，例如"文本处理"实际上更类似于"输出处理"。需要更精确的命名以反映各模块的实际功能。

### 优化后的模块名称方案

| 原模块名称 | 优化后名称 | 功能说明 |
|-----------|-----------|---------|
| 检索增强 | 信息获取 (Information Retrieval) | 负责从各种来源获取信息的模块，包括知识库检索、网络搜索等 |
| 文本处理 | 内容处理 (Content Processing) | 负责对获取的信息进行处理，包括翻译、摘要、格式化等 |
| 数据分析 | 数据分析与推理 (Data Analysis & Reasoning) | 负责数据计算、统计分析、逻辑推理等功能 |
| 内容生成 | 输出生成 (Output Generation) | 负责最终内容的生成，包括文本生成、图表创建等 |

## 3. 工具执行顺序自定义方案

### 3.1 模块级顺序调整

在现有的嵌套卡片编排系统中，添加模块拖拽排序功能，实现模块间执行顺序的自定义。

#### 实现方式

1. 为每个模块卡片添加拖拽手柄和排序指示器
2. 使用React DnD库实现拖拽功能
3. 在卡片头部添加序号指示器，显示当前执行顺序
4. 提供快捷按钮实现模块上移/下移

### 3.2 模块内工具顺序调整

在每个模块内部，为工具和知识库添加排序功能，允许用户自定义同一模块内的工具执行顺序。

#### 实现方式

1. 将工具选择区改为有序列表形式
2. 添加拖拽功能，允许调整工具顺序
3. 显示执行顺序指示器
4. 为每个工具提供上移/下移按钮

### 3.3 执行策略增强

改进现有的执行策略选择，增加更多的执行控制能力：

1. **串行执行**：按顺序依次执行工具，前一个工具的输出作为后一个工具的输入
2. **并行执行**：同时执行所有工具，合并结果
3. **条件执行**：根据条件判断是否执行某个工具
4. **优先级执行**：为工具分配优先级，按优先级顺序执行

### 3.4 数据结构设计

```typescript
// 增强后的模块数据结构
interface OrchestrationModule {
  id: string;                // 模块唯一标识
  type: ModuleType;          // 模块类型
  name: string;              // 模块名称
  order: number;             // 模块执行顺序
  tools: OrderedTool[];      // 模块内工具列表
  knowledgeBases: OrderedKnowledgeBase[]; // 模块内知识库列表
  config: {
    executionStrategy: 'sequential' | 'parallel' | 'conditional' | 'priority';
    timeout: number;
    retries: number;
    conditions?: Condition[]; // 条件执行的条件设置
  };
}

// 有序工具
interface OrderedTool {
  toolId: string;
  order: number;         // 工具执行顺序
  priority?: number;     // 工具优先级
  enabled: boolean;      // 是否启用
  conditions?: Condition[]; // 工具执行条件
}

// 有序知识库
interface OrderedKnowledgeBase {
  knowledgeBaseId: string;
  order: number;
  priority?: number;
  enabled: boolean;
}
```

## 4. 用户界面设计

### 4.1 模块排序界面

1. 每个模块卡片左上角添加序号标识
2. 在卡片右侧添加上移/下移按钮
3. 卡片头部添加拖拽手柄图标
4. 拖拽时显示虚线指示目标位置

### 4.2 工具排序界面

1. 将工具选择区改为列表形式，每个工具项左侧显示序号
2. 工具项右侧添加拖拽手柄和上移/下移按钮
3. 增加工具启用/禁用开关
4. 对于条件执行，提供条件设置界面

### 4.3 执行流程可视化

1. 在界面右下角添加"流程预览"按钮
2. 点击后显示当前配置的执行流程图
3. 使用不同颜色和连接线表示模块间和模块内的执行顺序
4. 提供缩放和平移功能

## 5. 技术实现要点

### 5.1 拖拽排序实现

使用React DnD或React Beautiful DnD实现拖拽排序功能：

```javascript
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

// 模块拖拽排序处理函数
const handleModuleDragEnd = (result) => {
  if (!result.destination) return;
  
  const items = Array.from(modules);
  const [reorderedItem] = items.splice(result.source.index, 1);
  items.splice(result.destination.index, 0, reorderedItem);
  
  // 重新计算顺序号
  const reorderedItems = items.map((item, index) => ({
    ...item,
    order: index + 1
  }));
  
  setModules(reorderedItems);
};
```

### 5.2 执行策略配置

增强执行策略选择组件，支持更多策略和配置选项：

```javascript
const ExecutionStrategySelector = ({ strategy, onChange }) => {
  return (
    <Box>
      <Typography variant="body2" fontWeight={600}>执行策略</Typography>
      <Box sx={{ display: 'flex', gap: 1 }}>
        {['串行执行', '并行执行', '条件执行', '优先级执行'].map((s) => (
          <Chip
            key={s}
            label={s}
            variant={strategy === s ? "filled" : "outlined"}
            onClick={() => onChange(s)}
          />
        ))}
      </Box>
      
      {strategy === '条件执行' && (
        <ConditionConfigPanel />
      )}
      
      {strategy === '优先级执行' && (
        <PriorityConfigPanel />
      )}
    </Box>
  );
};
```

## 6. 实施计划

1. **阶段一**: 更新模块命名和相关文案
2. **阶段二**: 实现模块间排序功能
3. **阶段三**: 实现模块内工具排序功能
4. **阶段四**: 增强执行策略选项
5. **阶段五**: 实现执行流程可视化
6. **阶段六**: 测试与优化

## 7. 注意事项

1. 保持与现有系统的兼容性，不影响已有配置
2. 确保拖拽排序的性能，尤其是在工具数量较多时
3. 提供清晰的视觉反馈，帮助用户理解执行顺序
4. 考虑移动设备上的使用体验 