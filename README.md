# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## 🔍 自定义搜索框组件系统

### 概述
项目已完全替换了所有第三方UI框架的搜索组件，采用完全自主开发的`CustomSearchBox`组件，提供统一、美观、高性能的搜索体验。

### 核心特性
- **🎨 完全自定义设计** - 摆脱任何UI框架束缚，纯CSS实现
- **📱 响应式布局** - 完美适配各种屏幕尺寸
- **🔧 多尺寸支持** - 提供small、medium、large三种尺寸
- **✨ 丰富交互效果** - 聚焦、悬停、点击等多种状态反馈
- **🎯 高度可定制** - 支持错误、成功等状态样式
- **⚡ 性能优化** - 轻量级实现，无冗余依赖

### 组件API

#### Props参数
```typescript
interface CustomSearchBoxProps {
  value?: string;              // 受控组件的值
  placeholder?: string;        // 占位符文本，默认"搜索..."
  onSearch?: (value: string) => void;    // 搜索回调函数
  onChange?: (value: string) => void;    // 输入变化回调
  allowClear?: boolean;        // 是否显示清空按钮，默认true
  size?: 'small' | 'medium' | 'large';  // 尺寸，默认medium
  style?: React.CSSProperties; // 自定义样式
  className?: string;          // 自定义CSS类名
}
```

#### 尺寸规格
- **small**: 高度32px，适用于紧凑布局
- **medium**: 高度40px，标准尺寸，适用于大多数场景
- **large**: 高度48px，适用于突出搜索功能的场景

#### 状态样式
- **普通状态**: 灰色边框，白色背景
- **聚焦状态**: 蓝色边框，蓝色阴影
- **悬停状态**: 深灰色边框，轻微阴影
- **错误状态**: 红色边框和阴影（添加className="error"）
- **成功状态**: 绿色边框和阴影（添加className="success"）

### 使用示例

#### 基础用法
```typescript
import CustomSearchBox from '../components/common/CustomSearchBox';

const MyComponent = () => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <CustomSearchBox
      value={searchTerm}
      onChange={setSearchTerm}
      onSearch={(value) => console.log('搜索:', value)}
      placeholder="请输入搜索关键词..."
      allowClear
    />
  );
};
```

#### 不同尺寸
```typescript
{/* 小尺寸 */}
<CustomSearchBox size="small" style={{ width: '200px' }} />

{/* 中等尺寸（默认） */}
<CustomSearchBox size="medium" style={{ width: '300px' }} />

{/* 大尺寸 */}
<CustomSearchBox size="large" style={{ width: '400px' }} />
```

#### 状态样式
```typescript
{/* 错误状态 */}
<CustomSearchBox className="error" />

{/* 成功状态 */}
<CustomSearchBox className="success" />
```

### 项目中的应用
自定义搜索框已在以下页面全面应用：

1. **Agent工具页面** (`/agent-tools`) - 工具搜索与筛选
2. **MCP中心页面** (`/mcp-center`) - MCP服务搜索
3. **知识库管理** (`/knowledge-base`) - 知识库搜索
4. **AI助手列表** (`/assistants`) - 助手搜索与筛选
5. **助手筛选组件** - 多维度搜索功能

### 技术架构

#### 文件结构
```
src/components/common/
├── CustomSearchBox.tsx      # 搜索框组件主文件
└── CustomSearchBox.css      # 专用样式文件
```

#### 样式设计特点
- **渐变按钮**: 蓝色渐变背景，鼠标悬停有微动画
- **图标集成**: 使用Lucide React图标库
- **阴影效果**: 多层次阴影提升视觉层次
- **动画过渡**: 所有状态变化都有平滑过渡
- **无框架依赖**: 纯CSS实现，不依赖任何UI框架

#### 性能优化
- **轻量级设计**: 组件大小极小，加载快速
- **样式隔离**: 独立CSS文件，避免样式冲突
- **事件优化**: 合理使用React事件处理
- **状态管理**: 支持受控和非受控两种模式

### 维护指南

#### 样式修改
所有样式均在`CustomSearchBox.css`中定义，修改时注意：
- 保持各尺寸的比例协调
- 确保颜色搭配符合整体设计语言
- 测试各种状态的视觉效果

#### 功能扩展
如需添加新功能，建议：
- 保持API的简洁性
- 添加相应的TypeScript类型定义
- 更新使用示例和文档

## 知识库管理功能

### 新建知识库功能优化

#### 索引构建方式选项
系统支持多种向量数据库索引类型，根据不同需求选择最适合的索引方法：

- **HNSW (Hierarchical Navigable Small World)**
  - 分层可导航小世界图算法
  - 适合高维向量检索，精度高
  - 推荐用于需要高精度检索的场景

- **IVF_FLAT (Inverted File with Flat quantizer)**
  - 倒排文件索引
  - 平衡精度和速度
  - 适合中等规模数据集

- **IVF_PQ (Inverted File with Product Quantization)**
  - 倒排文件+乘积量化
  - 内存效率高，压缩存储
  - 适合大规模数据集且内存有限的场景

- **FLAT**
  - 暴力搜索算法
  - 精度最高但速度较慢
  - 适合小规模数据集或需要100%精度的场景

- **IVF_SQ8 (Inverted File with Scalar Quantization)**
  - 倒排文件+标量量化
  - 压缩存储，内存占用小
  - 适合对存储空间敏感的应用

#### 知识图谱构建功能
新增知识图谱自动构建选项，支持：

- 自动识别文档中的实体、关系和概念
- 构建可视化知识图谱
- 增强知识发现和关联分析能力
- 通过开关控制是否启用知识图谱功能

#### 使用方法
1. 在新建知识库界面中选择合适的索引构建方式
2. 根据需要开启或关闭知识图谱构建功能
3. 系统将根据选择的配置自动优化检索性能和知识发现能力

## 🔐 安全设置功能

### 概述
全新的系统级安全配置模块，提供企业级的安全管理功能，确保AI系统的安全性和可靠性。采用现代化、高端化的设计风格，提供直观的安全状态管理界面。

### 核心安全功能

#### 🔑 系统API密钥管理
- **系统密钥创建** - 创建用于访问系统API的密钥，而非第三方模型密钥
- **权限分级管理** - 支持读取、搜索、对话、上传、管理等多种权限级别
- **密钥生命周期** - 完整的创建、启用、禁用、删除生命周期管理
- **使用监控** - 跟踪API密钥的使用情况和最后使用时间
- **安全存储** - 密钥加密存储，支持一键复制功能

#### 🛡️ 内容安全过滤
智能内容安全系统，多层次保护用户安全：

- **三级过滤强度**
  - 🟢 宽松模式：仅过滤明显违规内容，保证系统可用性
  - 🟡 标准模式：平衡安全性与可用性的最佳选择
  - 🔴 严格模式：最高安全标准，适用于敏感环境

- **多种实现方式**
  - 🏠 本地过滤：使用本地规则库，响应快速
  - ☁️ 第三方API：调用专业内容安全API，准确度高
  - 🔄 混合模式：本地预筛选+API深度检测，兼顾速度与准确性

- **自定义敏感词库** - 支持企业自定义敏感词管理
- **实时监控** - 提供内容过滤实时状态监控

#### 🔧 默认系统回复设置
配置系统在特殊情况下的默认行为：

- **安全拒绝回复** - 当检测到不当内容时的标准回复模板
- **安全提示语** - 系统安全策略的用户提示信息
- **重试机制** - 可配置的最大重试次数，提高系统容错能力
- **场景定制** - 支持不同场景下的个性化回复设置

#### 🗄️ 数据源安全配置
精细化的数据源访问控制：

- **数据源管理**
  - 🌐 网络搜索：控制搜索引擎数据访问
  - 📚 本地知识库：管理内部文档数据使用
  - 🔗 第三方API：配置外部数据源接入

- **排除机制** - 支持排除特定数据源
  - 🌐 维基百科
  - 📱 社交媒体
  - 📰 新闻网站
  - 💬 论坛社区
  - 📝 个人博客

- **访问权限** - 基于角色的数据源访问控制

### 设计特色

#### 🎨 高端化视觉设计
- **渐变背景** - 动态渐变背景，营造科技感氛围
- **现代卡片** - 采用玻璃拟态设计，层次分明
- **状态指示** - 直观的安全状态颜色编码系统
- **动画效果** - 流畅的交互动画，提升用户体验

#### 🚀 交互体验优化
- **悬停效果** - 精美的卡片悬停和缩放效果
- **状态反馈** - 实时的操作状态反馈
- **响应式设计** - 完美适配各种屏幕尺寸
- **键盘导航** - 支持键盘快捷操作

#### 🔒 安全状态管理
- **实时监控** - 安全状态实时更新显示
- **风险提醒** - 智能风险识别和预警
- **操作审计** - 完整的安全操作日志记录

### 使用指南

#### 访问安全设置
1. 在侧边栏导航中选择"系统设置"
2. 点击"安全设置"子菜单
3. 进入安全配置管理界面

#### 配置系统API密钥
1. 在"系统API密钥管理"卡片中点击"创建新的API Key"
2. 填写密钥名称、描述和选择相应权限
3. 点击"生成API Key"创建新密钥
4. 复制生成的密钥用于系统访问

#### 设置内容过滤
1. 启用"内容安全过滤"开关
2. 选择合适的过滤强度级别
3. 配置过滤实现方式
4. 添加自定义敏感词库（可选）

#### 配置数据源
1. 在"数据源安全配置"中选择允许的数据源
2. 配置需要排除的特定数据源
3. 保存配置并验证生效

### 技术架构

#### 安全特性
- **端到端加密** - API密钥和敏感数据全程加密
- **权限分离** - 基于角色的访问控制(RBAC)
- **审计日志** - 完整的操作审计追踪
- **数据隔离** - 多租户数据安全隔离

#### 性能优化
- **缓存机制** - 智能缓存提升响应速度
- **异步处理** - 非阻塞的安全检查流程
- **负载均衡** - 分布式安全服务架构

### 兼容性说明
- ✅ 完全兼容现有的基础设置功能
- ✅ 与模型设置无缝集成
- ✅ 支持所有主流浏览器
- ✅ 移动端适配优化

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
})
```
