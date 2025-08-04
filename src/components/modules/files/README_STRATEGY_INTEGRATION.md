# 文档上传界面切分策略集成

本文档介绍前端文档上传界面中切分策略选择功能的完整集成实现。

## 核心组件

### 1. SplitterStrategySelector.tsx
切分策略选择组件，提供完整的策略配置功能：

```tsx
import SplitterStrategySelector from './SplitterStrategySelector';

<SplitterStrategySelector
  selectedStrategyId={strategyId}
  onStrategyChange={setStrategyId}
  customSettings={settings}
  onSettingsChange={setSettings}
  knowledgeBaseId="kb_123"
  apiBaseUrl="http://localhost:8082"
/>
```

**主要功能：**
- 预定义策略选择（基础Token、语义分块、智能自适应）
- 自定义策略加载（从知识库API）
- 高级参数配置（块大小、重叠、结构保留）
- 实时验证和错误提示
- 配置说明和建议

### 2. StrategyPreviewCard.tsx
策略预览卡片，显示当前选中策略的详细信息：

```tsx
import StrategyPreviewCard from './StrategyPreviewCard';

<StrategyPreviewCard
  strategy={{
    id: 'token_basic',
    name: '基础Token分块',
    type: 'token_based',
    chunkSize: 1000,
    chunkOverlap: 200,
    preserveStructure: true
  }}
  showDetails={true}
  onEdit={() => openStrategyEditor()}
/>
```

**功能特性：**
- 策略配置概览
- 性能指标显示（速度、精度、上下文保持）
- 预估处理速度
- 策略特点说明

### 3. EnhancedDocumentUploader.tsx
增强版文档上传器，完整集成所有新功能：

```tsx
import EnhancedDocumentUploader from './EnhancedDocumentUploader';

<EnhancedDocumentUploader
  knowledgeBaseId="kb_123"
  userId="user_456"
  messageServiceUrl="http://localhost:8089"
  apiBaseUrl="http://localhost:8082"
  onUploadComplete={handleComplete}
  onClose={handleClose}
/>
```

**核心特性：**
- 三标签页界面（文件上传、策略配置、进度监控）
- 切分策略选择与预览
- 实时SSE进度监控
- 详细处理信息显示
- 批量文件处理

## 预定义切分策略

### 1. 基础Token分块 (token_basic)
```typescript
{
  name: '基础Token分块',
  type: 'token_based',
  defaultChunkSize: 1000,
  defaultChunkOverlap: 200,
  features: ['快速处理', '固定大小', '通用适配'],
  recommended: true
}
```

**适用场景：**
- 通用文档处理
- 快速批量上传
- 资源受限环境

**优势：**
- 处理速度快
- 资源消耗低
- 稳定可靠

### 2. 语义分块 (semantic_smart)
```typescript
{
  name: '语义分块',
  type: 'semantic',
  defaultChunkSize: 800,
  defaultChunkOverlap: 150,
  features: ['语义连贯', '智能分割', '内容相关']
}
```

**适用场景：**
- 学术文档
- 结构化内容
- 高质量检索需求

**优势：**
- 保持语义完整性
- 提高检索质量
- 自适应分块大小

### 3. 智能自适应 (smart_adaptive)
```typescript
{
  name: '智能自适应',
  type: 'smart',
  defaultChunkSize: 1200,
  defaultChunkOverlap: 250,
  features: ['自动优化', '结构感知', '高质量分块']
}
```

**适用场景：**
- 重要文档
- 复杂结构内容
- 最高质量要求

**优势：**
- 结合文档结构和语义
- 自动优化分块策略
- 最佳内容完整性

## 配置参数说明

### 分块大小 (Chunk Size)
控制每个文档块的token数量：
- **推荐范围**: 500-2000 tokens
- **影响因素**: 检索精度、处理速度、内存占用
- **调优建议**: 
  - 较小块（500-800）：高精度检索，适合问答
  - 中等块（800-1500）：平衡性能和质量
  - 较大块（1500-2000）：保持更多上下文

### 重叠大小 (Chunk Overlap)
控制相邻块之间的重叠token数：
- **推荐比例**: 15-25% 的分块大小
- **作用**: 保持语义连续性，避免信息断裂
- **注意**: 过大重叠会增加存储开销

### 结构保留 (Preserve Structure)
是否保持文档的原始格式和层次：
- **启用**: 保留标题、段落、列表等结构
- **禁用**: 纯文本处理，忽略格式
- **建议**: 结构化文档建议启用

## API集成

### 获取知识库策略
```typescript
GET /api/v1/knowledge-bases/{knowledgeBaseId}/splitter-strategies

Response:
{
  "success": true,
  "strategies": [
    {
      "id": "custom_strategy_1",
      "name": "自定义策略",
      "description": "针对特定文档类型优化",
      "chunk_strategy": "semantic",
      "chunk_size": 1200,
      "chunk_overlap": 300,
      "is_default": false,
      "features": ["高精度", "语义保持"]
    }
  ]
}
```

### 文档上传with策略
```typescript
POST /api/v1/knowledge-bases/{knowledgeBaseId}/documents/upload-async

FormData:
- files: File[]
- user_id: string
- enable_async_processing: true
- splitter_strategy_id: string (可选)
- chunk_size: number
- chunk_overlap: number
- chunk_strategy: string
- preserve_structure: boolean
```

## 用户体验优化

### 1. 智能默认值
- 根据文档类型推荐策略
- 自动调整参数范围
- 记住用户偏好设置

### 2. 实时验证
```typescript
// 参数验证示例
const validateSetting = (key: string, value: number) => {
  if (key === 'chunkSize') {
    return value >= strategy.minChunkSize && value <= strategy.maxChunkSize;
  }
  if (key === 'chunkOverlap') {
    return value >= 0 && value < settings.chunkSize;
  }
  return true;
};
```

### 3. 视觉反馈
- 策略卡片高亮选中状态
- 实时参数验证提示
- 处理性能预估显示

### 4. 分步引导
- 标签页切换流程
- 策略选择建议
- 参数调优提示

## 性能优化

### 1. 策略缓存
```typescript
// 缓存策略数据，避免重复加载
const [strategiesCache, setStrategiesCache] = useState<Map<string, Strategy[]>>(new Map());

const loadStrategies = async (knowledgeBaseId: string) => {
  if (strategiesCache.has(knowledgeBaseId)) {
    return strategiesCache.get(knowledgeBaseId);
  }
  
  const strategies = await fetchStrategies(knowledgeBaseId);
  setStrategiesCache(prev => new Map(prev).set(knowledgeBaseId, strategies));
  return strategies;
};
```

### 2. 延迟加载
- 策略详情按需加载
- 预览组件懒加载
- 大文件分片上传

### 3. 状态管理
- 减少不必要的重渲染
- 优化事件处理函数
- 合理使用useCallback和useMemo

## 错误处理

### 1. 网络错误
```typescript
try {
  const response = await fetch('/api/strategies');
  if (!response.ok) throw new Error('加载策略失败');
} catch (error) {
  setError('网络连接失败，使用默认策略');
  // 回退到预定义策略
  setStrategies(PREDEFINED_STRATEGIES);
}
```

### 2. 参数验证
```typescript
const getValidationMessage = (key: string, value: number) => {
  if (key === 'chunkSize' && value > maxChunkSize) {
    return `最大值: ${maxChunkSize}`;
  }
  if (key === 'chunkOverlap' && value >= chunkSize) {
    return '重叠不能大于等于块大小';
  }
  return null;
};
```

### 3. 用户友好提示
- 清晰的错误信息
- 操作建议提供
- 回退方案说明

## 测试策略

### 1. 单元测试
```typescript
describe('SplitterStrategySelector', () => {
  test('应该正确验证块大小', () => {
    const isValid = validateChunkSize(1000, { min: 100, max: 4000 });
    expect(isValid).toBe(true);
  });

  test('应该正确计算重叠比例', () => {
    const ratio = calculateOverlapRatio(200, 1000);
    expect(ratio).toBe(20);
  });
});
```

### 2. 集成测试
- 策略选择流程
- API接口对接
- SSE消息处理

### 3. 用户体验测试
- 策略切换响应性
- 参数调整体验
- 错误处理有效性

## 最佳实践

### 1. 组件设计
- 单一职责原则
- 可复用性考虑
- 类型安全保证

### 2. 状态管理
- 合理的状态提升
- 避免prop drilling
- 使用自定义hooks

### 3. 用户体验
- 渐进式disclosure
- 即时反馈机制
- 容错性设计

### 4. 性能考虑
- 组件懒加载
- 数据缓存策略
- 事件防抖处理

## 扩展方向

### 1. 高级功能
- 策略模板管理
- 批量配置应用
- 历史设置回滚

### 2. 智能化
- 文档类型自动识别
- 参数智能推荐
- 处理效果预测

### 3. 可视化
- 分块效果预览
- 处理流程图
- 性能指标图表

## 总结

通过完整的切分策略集成，文档上传界面现在提供了：

1. **灵活的策略选择** - 预定义+自定义策略
2. **直观的配置界面** - 可视化参数调整
3. **实时的反馈机制** - 验证提示和预览
4. **完整的用户体验** - 从选择到上传的闭环

这套解决方案为用户提供了专业级的文档处理配置能力，同时保持了良好的易用性和可维护性。