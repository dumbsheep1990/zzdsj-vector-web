# SSE集成文件管理组件

本目录包含了集成SSE实时进度监控的增强版文件管理组件，用于显示文档处理的切分块数和实时进度。

## 核心组件

### 1. EnhancedFilesList.tsx
增强版文件列表组件，主要特性：
- **实时进度监控**: 通过SSE显示文档处理的实时进度
- **切分块信息**: 显示文档的总块数、已处理块数、分块策略等
- **状态过滤**: 支持按处理状态过滤文件（处理中、已完成、错误等）
- **批量操作**: 支持批量选择和处理文件

```tsx
import EnhancedFilesList from './EnhancedFilesList';

<EnhancedFilesList
  files={files}
  selectedItem={selectedItem}
  setSelectedItem={setSelectedItem}
  selectedItems={selectedItems}
  setSelectedItems={setSelectedItems}
  knowledgeBaseId="kb_123"
  userId="user_456"
  messageServiceUrl="http://localhost:8089"
  apiBaseUrl="http://localhost:8082"
/>
```

### 2. EnhancedFileItem.tsx
增强版文件项组件，显示单个文件的详细信息：
- **处理进度**: 实时显示文档处理进度和当前阶段
- **块信息**: 显示分块数量、策略、大小等配置
- **向量化状态**: 显示向量化信息（模型、维度等）
- **时间统计**: 显示处理开始时间、任务ID等

### 3. DocumentProcessingCard.tsx
文档处理卡片组件，用于详细展示单个文档的处理信息：
- **完整进度**: 包含进度条、阶段指示、时间统计
- **配置信息**: 显示分块策略、模型配置等
- **质量统计**: 显示重复块、空块、错误块等质量指标
- **操作控制**: 支持取消、重试、查看详情等操作

```tsx
import DocumentProcessingCard from './DocumentProcessingCard';

<DocumentProcessingCard
  processingInfo={{
    documentId: "doc_123",
    documentName: "示例文档.pdf",
    progress: 75,
    stage: "embed",
    status: "processing",
    // ... 其他配置
  }}
  onCancel={handleCancel}
  onRetry={handleRetry}
  showMiniView={false}
/>
```

### 4. BatchProcessingMonitor.tsx
批量处理监控面板，用于监控多个文档的处理状态：
- **总体统计**: 显示处理中、已完成、错误文档的数量统计
- **进度预测**: 基于处理速度预测完成时间
- **分类查看**: 按状态分组查看文档列表
- **批量控制**: 支持暂停、恢复批量处理

```tsx
import BatchProcessingMonitor from './BatchProcessingMonitor';

<BatchProcessingMonitor
  knowledgeBaseId="kb_123"
  userId="user_456"
  initialFiles={["doc1", "doc2", "doc3"]}
  onClose={() => setShowMonitor(false)}
/>
```

### 5. FilesPageWithSSE.tsx
完整的文件管理页面示例，展示如何集成所有组件：
- **视图切换**: 在文件列表和处理监控之间切换
- **批量操作**: 选择文件并启动批量处理
- **实时更新**: 集成SSE实时更新文件状态

## 数据流和架构

### SSE消息处理流程
```
1. 用户上传文件或启动处理
   ↓
2. 后端创建异步任务并返回task_id
   ↓
3. 前端通过useSSEConnection建立SSE连接
   ↓
4. 后端推送处理进度消息
   ↓
5. 前端组件实时更新UI显示
```

### 消息格式
```typescript
interface SSEMessage {
  id: string;
  timestamp: string;
  type: 'progress' | 'status' | 'error' | 'success';
  service: string;
  source: string;
  data: {
    task_id?: string;
    progress?: number;
    stage?: string;
    message?: string;
    details?: {
      total_chunks?: number;
      processed_chunks?: number;
      chunk_strategy?: string;
      chunk_size?: number;
      embedding_model?: string;
      // ...其他详细信息
    };
    result?: Record<string, any>;
    error_message?: string;
  };
}
```

## 使用指南

### 1. 基础集成
```tsx
import { FilesPageWithSSE } from './components/modules/files/FilesPageWithSSE';

function App() {
  return (
    <FilesPageWithSSE
      knowledgeBaseId="your_kb_id"
      userId="your_user_id"
      messageServiceUrl="http://localhost:8089"
      apiBaseUrl="http://localhost:8082"
    />
  );
}
```

### 2. 自定义文件列表
```tsx
import { EnhancedFilesList } from './components/modules/files/EnhancedFilesList';

function CustomFileManager() {
  const [files, setFiles] = useState([]);
  // ... 其他状态

  return (
    <EnhancedFilesList
      files={files}
      // ... 其他props
    />
  );
}
```

### 3. 独立的处理监控
```tsx
import { BatchProcessingMonitor } from './components/modules/files/BatchProcessingMonitor';

function ProcessingDashboard() {
  return (
    <BatchProcessingMonitor
      knowledgeBaseId="kb_123"
      userId="user_456"
      initialFiles={selectedFileIds}
    />
  );
}
```

## 状态管理

### 文件状态
- `idle`: 未开始处理
- `processing`: 处理中
- `completed`: 处理完成
- `error`: 处理出错
- `paused`: 已暂停

### 处理阶段
- `extract`: 文档提取阶段
- `chunk`: 文档分块阶段
- `embed`: 向量化阶段
- `store`: 存储阶段
- `finalize`: 完成阶段

## 配置选项

### SSE连接配置
```typescript
const sseConfig = {
  userId: "user_123",
  messageServiceUrl: "http://localhost:8089",
  autoConnect: true,
  maxReconnectAttempts: 5,
  reconnectDelay: 1000
};
```

### API配置
```typescript
const apiConfig = {
  baseUrl: "http://localhost:8082",
  knowledgeBaseId: "kb_123",
  timeout: 30000
};
```

## 性能优化

### 1. 虚拟滚动
对于大量文件，建议使用虚拟滚动：
```tsx
import { VirtualizedList } from 'react-virtualized';

// 在大文件列表中使用虚拟滚动
```

### 2. 消息缓存
SSE消息自动缓存最新100条，避免内存泄漏：
```typescript
setMessages(prev => [message, ...prev.slice(0, 99)]);
```

### 3. 连接管理
自动处理网络断开重连、页面可见性变化等场景。

## 样式定制

### 主题配置
```css
/* 自定义进度条颜色 */
.progress-bar-processing {
  background: linear-gradient(90deg, #3b82f6, #1d4ed8);
}

.progress-bar-completed {
  background: linear-gradient(90deg, #10b981, #059669);
}

.progress-bar-error {
  background: linear-gradient(90deg, #ef4444, #dc2626);
}
```

### 响应式设计
组件已支持响应式设计，在不同屏幕尺寸下自动调整布局。

## 错误处理

### 连接错误
- 自动重连机制
- 指数退避策略
- 用户友好的错误提示

### 处理错误
- 详细的错误信息显示
- 重试机制
- 错误分类和建议

## 测试

### 单元测试
```bash
npm test -- EnhancedFilesList
npm test -- DocumentProcessingCard
npm test -- BatchProcessingMonitor
```

### 集成测试
```bash
# 启动SSE服务
npm run start:sse-service

# 运行集成测试
npm test -- --integration
```

## 故障排除

### 常见问题

1. **SSE连接失败**
   - 检查messageServiceUrl是否正确
   - 确认SSE服务是否运行
   - 检查CORS配置

2. **进度不更新**
   - 确认task_id是否正确
   - 检查SSE消息格式
   - 验证userId匹配

3. **性能问题**
   - 减少同时处理的文件数量
   - 启用虚拟滚动
   - 优化SSE消息频率

### 调试技巧
```typescript
// 启用详细日志
const { messages, connectionStatus } = useSSEConnection({
  // ... 配置
  onMessage: (message) => {
    console.log('SSE Message:', message);
  },
  onConnectionChange: (status) => {
    console.log('Connection Status:', status);
  }
});
```

## 更新日志

### v1.0.0
- 初始版本发布
- 基础SSE集成功能
- 文件列表增强
- 批量处理监控

### v1.1.0
- 添加DocumentProcessingCard组件
- 优化性能和内存使用
- 改进错误处理机制

### v1.2.0
- 添加质量统计功能
- 支持处理速度预测
- 增强响应式设计

## 贡献指南

欢迎提交Issue和Pull Request来改进这些组件。

### 开发环境
```bash
npm install
npm run dev
```

### 代码规范
```bash
npm run lint
npm run format
```