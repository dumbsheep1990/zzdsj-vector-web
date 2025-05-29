# 条件执行设计方案

## 1. 概述

条件执行是工作流编排系统中的高级功能，允许用户基于特定条件动态决定工具或模块的执行路径。本设计方案详细描述了条件执行的UI表现形式和实现逻辑。

## 2. 用户界面设计

### 2.1 条件执行的视觉表示

条件执行应在界面上通过以下元素表现：

1. **条件分支区域**：以特殊的边框和背景色突出显示，使用虚线分隔不同分支
2. **条件判断节点**：使用菱形图标表示条件判断点
3. **条件表达式编辑器**：提供输入和编辑条件表达式的界面
4. **分支路径**：显示不同条件结果下的执行路径

### 2.2 具体UI组件设计

#### 条件分支卡片

```jsx
<Box sx={{ 
  border: '1px dashed', 
  borderColor: theme.palette.warning.main,
  borderRadius: '12px',
  p: 2,
  bgcolor: alpha(theme.palette.warning.main, 0.05)
}}>
  {/* 条件表达式区域 */}
  <Box sx={{ mb: 2 }}>
    <Typography variant="subtitle2">条件判断</Typography>
    <TextField 
      fullWidth
      size="small"
      placeholder="例如: result.contains('error') || score < 0.5"
      value={condition}
      onChange={handleConditionChange}
      sx={{ mt: 1 }}
    />
  </Box>
  
  {/* 分支路径区域 */}
  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
    {/* 满足条件分支 */}
    <Box>
      <Typography variant="caption" sx={{ 
        display: 'flex', 
        alignItems: 'center',
        color: theme.palette.success.main
      }}>
        <CheckCircleOutlined style={{ fontSize: 14, marginRight: 4 }} />
        满足条件时执行
      </Typography>
      <Box sx={{ 
        border: '1px solid',
        borderColor: alpha(theme.palette.success.main, 0.3),
        borderRadius: '8px',
        p: 1.5,
        mt: 1
      }}>
        {/* 此处放置满足条件时要执行的工具列表 */}
        <ToolsList tools={trueBranchTools} />
      </Box>
    </Box>
    
    {/* 不满足条件分支 */}
    <Box>
      <Typography variant="caption" sx={{ 
        display: 'flex', 
        alignItems: 'center',
        color: theme.palette.error.main
      }}>
        <CloseCircleOutlined style={{ fontSize: 14, marginRight: 4 }} />
        不满足条件时执行
      </Typography>
      <Box sx={{ 
        border: '1px solid',
        borderColor: alpha(theme.palette.error.main, 0.3),
        borderRadius: '8px',
        p: 1.5,
        mt: 1
      }}>
        {/* 此处放置不满足条件时要执行的工具列表 */}
        <ToolsList tools={falseBranchTools} />
      </Box>
    </Box>
  </Box>
</Box>
```

#### 条件执行流程图示

```jsx
<Box sx={{ position: 'relative', py: 4 }}>
  {/* 条件判断节点 */}
  <Box sx={{ 
    width: 40, 
    height: 40, 
    transform: 'rotate(45deg)',
    bgcolor: theme.palette.warning.main,
    position: 'absolute',
    left: '50%',
    top: 0,
    marginLeft: -20,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }}>
    <QuestionOutlined style={{ 
      transform: 'rotate(-45deg)', 
      color: '#fff' 
    }} />
  </Box>
  
  {/* 连接线 */}
  <Box sx={{ 
    width: '50%', 
    height: 30, 
    borderRight: '2px solid',
    borderTop: '2px solid',
    borderColor: theme.palette.success.main,
    position: 'absolute',
    left: 0,
    top: 40
  }} />
  
  <Box sx={{ 
    width: '50%', 
    height: 30, 
    borderLeft: '2px solid',
    borderTop: '2px solid',
    borderColor: theme.palette.error.main,
    position: 'absolute',
    right: 0,
    top: 40
  }} />
  
  {/* 分支节点 */}
  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 60 }}>
    <Box sx={{ 
      width: '45%', 
      p: 2, 
      border: '1px solid', 
      borderColor: theme.palette.success.main,
      borderRadius: 2
    }}>
      <Typography>满足条件</Typography>
      {/* 真分支内容 */}
    </Box>
    
    <Box sx={{ 
      width: '45%', 
      p: 2, 
      border: '1px solid', 
      borderColor: theme.palette.error.main,
      borderRadius: 2
    }}>
      <Typography>不满足条件</Typography>
      {/* 假分支内容 */}
    </Box>
  </Box>
</Box>
```

## 3. 数据结构设计

### 3.1 条件节点数据结构

```typescript
interface ConditionNode {
  id: string;                        // 节点唯一ID
  type: 'condition';                 // 节点类型标识
  expression: string;                // 条件表达式
  trueBranch: Array<Tool | ConditionNode>; // 条件为真时执行的工具或嵌套条件
  falseBranch: Array<Tool | ConditionNode>; // 条件为假时执行的工具或嵌套条件
  evaluationContext?: string[];      // 条件评估上下文（可引用的变量列表）
}

// 工具类型定义（简化版）
interface Tool {
  id: string;
  type: 'tool';
  name: string;
  // 其他工具属性
}
```

### 3.2 模块内条件执行配置

```typescript
interface ModuleConfig {
  // 其他模块配置...
  executionStrategy: 'sequential' | 'parallel' | 'conditional';
  conditionalExecution?: {
    rootCondition: ConditionNode;
    defaultBranch: 'true' | 'false' | 'none'; // 条件无法评估时的默认行为
  };
}
```

## 4. 实现逻辑

### 4.1 条件表达式解析与评估

条件表达式需要支持以下功能：

1. **变量引用**：引用上下文中的变量，如 `result`、`score` 等
2. **比较操作**：支持 `>`, `<`, `>=`, `<=`, `==`, `!=` 等比较操作符
3. **逻辑操作**：支持 `&&` (与)、`||` (或)、`!` (非) 等逻辑操作符
4. **函数调用**：支持内置函数，如 `contains()`, `startsWith()`, `length()` 等

```javascript
// 条件表达式评估函数（示例）
function evaluateCondition(expression, context) {
  try {
    // 构建安全的评估环境
    const safeEval = new Function(...Object.keys(context), 
      `"use strict"; return (${expression});`);
    
    // 执行条件评估
    return safeEval(...Object.values(context));
  } catch (error) {
    console.error('条件评估错误:', error);
    return false; // 默认返回false
  }
}
```

### 4.2 条件节点UI管理

用户应该能够通过以下操作管理条件节点：

1. **添加条件**：允许在模块内添加条件节点
2. **编辑条件**：修改条件表达式
3. **添加分支工具**：向真/假分支添加工具
4. **删除分支工具**：从分支中移除工具
5. **嵌套条件**：在分支内添加新的条件节点（高级功能）

```javascript
// 添加条件节点（示例）
const addConditionNode = () => {
  const newCondition = {
    id: generateUniqueId(),
    type: 'condition',
    expression: '',
    trueBranch: [],
    falseBranch: []
  };
  
  setConditionNodes(prev => [...prev, newCondition]);
};

// 更新条件表达式（示例）
const updateConditionExpression = (conditionId, expression) => {
  setConditionNodes(prev => 
    prev.map(node => 
      node.id === conditionId 
        ? { ...node, expression } 
        : node
    )
  );
};
```

## 5. 用户交互流程

### 5.1 创建条件执行流程

1. 用户选择模块的执行策略为"条件执行"
2. 系统显示条件配置界面
3. 用户输入条件表达式
4. 用户向真分支和假分支添加工具
5. 用户可以预览条件执行流程

### 5.2 条件表达式辅助编辑

为提高用户体验，可提供以下辅助功能：

1. **表达式构建器**：通过UI组件构建条件表达式，避免语法错误
2. **变量提示**：显示可用于条件表达式的变量列表
3. **语法验证**：实时验证条件表达式的语法是否正确
4. **表达式模板**：提供常用条件表达式模板供用户选择

```jsx
<Box>
  <Typography variant="subtitle2">条件构建器</Typography>
  <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', my: 1 }}>
    <Select value={variable} onChange={e => setVariable(e.target.value)}>
      <MenuItem value="result">result</MenuItem>
      <MenuItem value="score">score</MenuItem>
      <MenuItem value="status">status</MenuItem>
    </Select>
    
    <Select value={operator} onChange={e => setOperator(e.target.value)}>
      <MenuItem value="==">等于 (==)</MenuItem>
      <MenuItem value="!=">不等于 (!=)</MenuItem>
      <MenuItem value=">">大于 (>)</MenuItem>
      <MenuItem value="<">小于 (<)</MenuItem>
      <MenuItem value="contains">包含</MenuItem>
    </Select>
    
    <TextField 
      size="small" 
      value={value}
      onChange={e => setValue(e.target.value)}
      placeholder="值"
    />
    
    <Button 
      variant="contained" 
      size="small"
      onClick={addConditionPart}
    >
      添加
    </Button>
  </Box>
</Box>
```

## 6. 实现注意事项

1. **性能考虑**：条件表达式的评估应该高效，避免复杂表达式导致性能问题
2. **安全性**：防止恶意代码注入，限制条件表达式的能力范围
3. **错误处理**：提供友好的错误提示，帮助用户排查条件表达式问题
4. **可扩展性**：设计应支持未来添加更复杂的条件逻辑和表达式函数
5. **状态持久化**：确保条件配置能正确序列化和反序列化

## 7. UI实现示意图

```
    ┌──────────────────────────────────┐
    │         条件执行模块             │
    └───────────────┬──────────────────┘
                    ▼
    ┌──────────────────────────────────┐
    │ 条件: result.score > 0.5         │
    └───────────────┬──────────────────┘
                    │
        ┌───────────┴───────────┐
        ▼                       ▼
┌───────────────┐      ┌──────────────┐
│  满足条件时   │      │ 不满足条件时 │
├───────────────┤      ├──────────────┤
│  工具 A       │      │  工具 C      │
│  工具 B       │      │  工具 D      │
└───────────────┘      └──────────────┘
```

## 8. 后续优化方向

1. **可视化条件编辑器**：开发更直观的条件表达式编辑界面
2. **条件模板库**：建立常用条件模板库，方便用户快速配置
3. **条件测试工具**：允许用户使用测试数据验证条件表达式
4. **条件分支预览**：提供更清晰的条件分支执行流程可视化
5. **多级条件嵌套**：支持在条件分支内继续添加条件节点，构建复杂决策树 