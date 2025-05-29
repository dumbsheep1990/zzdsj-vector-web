# 依赖使用指南

## 当前依赖问题总结

### 🚨 严重问题
1. **UI 框架冗余**：同时安装了 Ant Design、Chakra UI、Material UI 和 Radix UI
2. **包体积过大**：预计打包后体积超过 10MB
3. **样式系统混乱**：Emotion、Tailwind CSS 和各UI框架样式系统共存
4. **可视化库重复**：多个图形库功能重叠

### 📊 依赖分类

#### 1. UI 组件库（需要选择其一）
- **Ant Design** (`antd` + `@ant-design/x`)
  - 优点：企业级组件完善、中文文档友好
  - 缺点：体积较大、样式定制较复杂
  - 适用：企业级后台管理系统

- **Chakra UI** (`@chakra-ui/react`)
  - 优点：现代化设计、模块化、支持暗色模式
  - 缺点：需要 Emotion 作为依赖
  - 适用：现代化 Web 应用

- **Material UI** (`@mui/material`)
  - 优点：Material Design 规范、组件丰富
  - 缺点：样式较为固定、体积大
  - 适用：遵循 Material Design 的应用

- **Radix UI** (`@radix-ui/*`)
  - 优点：无样式、可访问性好、体积小
  - 缺点：需要自己编写样式
  - 适用：需要完全自定义样式的项目

#### 2. 可视化库（根据需求选择）
- **知识图谱**：`react-force-graph-2d`
- **流程图编辑**：`@xyflow/react`
- **大规模图形**：`graphology` + `sigma`

#### 3. 编辑器
- **代码编辑**：`@monaco-editor/react`
- **富文本编辑**：`react-quill`

## 推荐方案

### 方案一：Ant Design + Tailwind（推荐）
```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^7.3.0",
    "antd": "^5.24.4",
    "lucide-react": "^0.288.0",
    "react-force-graph-2d": "^1.27.0",
    "@monaco-editor/react": "^4.7.0",
    "clsx": "^2.1.1",
    "tailwind-merge": "^3.0.2"
  }
}
```

### 方案二：Radix UI + Tailwind（轻量级）
```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^7.3.0",
    "@radix-ui/react-dialog": "^1.1.6",
    "@radix-ui/react-dropdown-menu": "^2.1.6",
    "@radix-ui/react-checkbox": "^1.1.4",
    "lucide-react": "^0.288.0",
    "react-force-graph-2d": "^1.27.0",
    "framer-motion": "^12.9.2",
    "clsx": "^2.1.1",
    "tailwind-merge": "^3.0.2"
  }
}
```

## 迁移步骤

### 1. 审计当前使用情况
```bash
# 安装依赖检查工具
npm install -g depcheck

# 检查未使用的依赖
depcheck

# 查看包大小
npm list --depth=0
```

### 2. 确定UI框架
- 统计各UI框架组件的使用情况
- 评估迁移成本
- 选择主框架

### 3. 逐步迁移
```bash
# 1. 创建新分支
git checkout -b refactor/optimize-dependencies

# 2. 移除未使用的依赖
npm uninstall @chakra-ui/react @emotion/react @emotion/styled
npm uninstall @mui/material @mui/icons-material

# 3. 更新导入语句
# 将所有 import 统一到选定的UI框架

# 4. 测试功能
npm run dev
npm run build
```

### 4. 性能对比
- 记录优化前的包大小
- 记录优化后的包大小
- 对比首屏加载时间

## 最佳实践

### 1. 添加新依赖前
- [ ] 确认是否有现有依赖可以满足需求
- [ ] 评估依赖的大小和维护状态
- [ ] 检查是否有更轻量的替代方案
- [ ] 在团队内部讨论和评审

### 2. 定期维护
- 每月运行 `npm audit` 检查安全问题
- 每季度运行 `npm outdated` 检查更新
- 每半年评估依赖使用情况

### 3. 文档化
- 在 README 中说明为什么选择某个依赖
- 记录依赖的主要用途
- 保持 package.json 中的注释更新

## 依赖选择决策树

```
需要UI组件？
├─ 是 → 需要完整设计系统？
│   ├─ 是 → Ant Design
│   └─ 否 → Radix UI + Tailwind
└─ 否 → 只用 Tailwind CSS

需要图表？
├─ 是 → 什么类型？
│   ├─ 知识图谱 → react-force-graph-2d
│   ├─ 流程图 → @xyflow/react
│   └─ 统计图表 → recharts
└─ 否 → 不安装

需要编辑器？
├─ 是 → 什么类型？
│   ├─ 代码 → @monaco-editor/react
│   └─ 富文本 → react-quill
└─ 否 → 不安装
```

## 紧急行动项

1. **立即**：确定主UI框架，避免进一步的样式冲突
2. **本周**：移除未使用的依赖，减少包体积
3. **本月**：完成UI框架统一，建立依赖管理规范 