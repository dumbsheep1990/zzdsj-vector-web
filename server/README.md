# 智政大模型开发框架 - 服务端文档

## 目录结构

```
server/
├── src/                  # 源代码目录
│   ├── api/              # API路由定义
│   ├── middleware/       # 中间件组件
│   ├── services/         # 服务模块实现
│   └── utils/            # 工具函数
├── .env                  # 环境变量配置
└── tsconfig.json         # TypeScript配置
```

## 核心服务模块

服务端实现了多个服务模块，每个模块负责特定领域的功能：

## 接口实现详细说明

以下是各服务模块的详细实现说明，包括具体接口方法、参数、返回类型和实现细节。

### 提示模板服务 (prompt-template.ts)

提供提示词模板的创建、检索、更新和删除功能。支持模板分类管理和与助手的绑定。

#### 数据模型

- **前端共享类型**：
  - `PromptTemplate`: 提示模板基本类型，包含`id`、`title`、`content`、`category`等字段
  - `PromptCategory`: 提示模板分类类型，包含`id`、`name`、`description`、`count`等字段
  - `PromptAssistantBinding`: 提示模板与助手的绑定关系，包含`promptId`、`assistantId`、`createdAt`等字段

- **服务端类型**：
  - `ServerPromptTemplate`: 与后端交互的提示模板类型，字段使用下划线命名法
  - `ServerPromptCategory`: 与后端交互的分类类型
  - `ServerPromptBinding`: 与后端交互的绑定关系类型

#### 模板管理接口

```typescript
// 创建提示模板
async createPromptTemplate(template: Omit<PromptTemplate, 'id' | 'createdAt' | 'updatedAt' | 'usageCount'>): Promise<PromptTemplate>

// 获取所有提示模板
async getPromptTemplates(filters: { categoryId?: string; createdBy?: string; isPublic?: boolean; tags?: string[]; search?: string; } = {}): Promise<PromptTemplate[]>

// 根据ID获取模板详情
async getPromptTemplateById(id: string): Promise<PromptTemplate | null>

// 更新提示模板
async updatePromptTemplate(id: string, template: Partial<PromptTemplate>): Promise<PromptTemplate | null>

// 删除提示模板
async deletePromptTemplate(id: string): Promise<boolean>
```

#### 分类管理接口

```typescript
// 获取所有提示模板分类
async getPromptCategories(): Promise<PromptCategory[]>

// 创建提示模板分类
async createPromptCategory(category: Omit<PromptCategory, 'id' | 'count'>): Promise<PromptCategory>

// 更新提示模板分类
async updatePromptCategory(id: string, category: Partial<PromptCategory>): Promise<PromptCategory | null>

// 删除提示模板分类
async deletePromptCategory(id: string): Promise<boolean>
```

#### 绑定管理接口

```typescript
// 获取助手的提示模板绑定
async getAssistantPromptBindings(assistantId: string): Promise<PromptAssistantBinding[]>

// 创建提示模板绑定
async createPromptBinding(binding: Omit<PromptAssistantBinding, 'createdAt'>): Promise<PromptAssistantBinding>

// 更新提示模板绑定
async updatePromptBinding(id: string, isActive: boolean): Promise<PromptAssistantBinding | null>

// 删除提示模板绑定
async deletePromptBinding(id: string): Promise<boolean>
```

#### 类型转换机制

为了确保前端和服务端类型之间的无缝转换，实现了一系列类型转换函数：

```typescript
// 前端共享类型到服务端类型
function toServerPromptTemplate(template: PromptTemplate): ServerPromptTemplate
function toServerPromptCategory(category: PromptCategory): ServerPromptCategory
function toServerPromptBinding(binding: PromptAssistantBinding): ServerPromptBinding

// 服务端类型到前端共享类型
function toSharedPromptTemplate(template: ServerPromptTemplate): PromptTemplate
function toSharedPromptCategory(category: ServerPromptCategory): PromptCategory
function toSharedPromptBinding(binding: ServerPromptBinding): PromptAssistantBinding
```

#### 模拟数据实现

在开发和测试环境下，服务能够使用模拟数据：

```typescript
// 模拟数据存储
const mockServerPromptTemplates: ServerPromptTemplate[] = [...]
const mockServerPromptCategories: ServerPromptCategory[] = [...]
const mockServerPromptBindings: ServerPromptBinding[] = [...]

// 通过环境变量控制是否使用模拟数据
const useMock = process.env.USE_MOCK_DATA === 'true'

// 每个方法都实现了模拟数据模式和API调用模式
if (this.useMock) {
  // 使用模拟数据实现
} else {
  // 使用axios调用远程后端API
}
```

#### 异常处理

所有接口方法都实现了统一的异常处理机制：

```typescript
try {
  // 方法实现
} catch (error) {
  // 记录日志
  logger.error(`操作失败:`, error);
  // 抛出可读性强的错误信息
  throw new Error(`操作失败: ${error}`);
}
```

### 验证服务 (auth.ts)

处理用户认证、授权和会话管理。

#### 数据模型

- **用户相关类型**:
  - `User`: 用户基本信息，包含`id`、`username`、`email`等字段
  - `UserCredentials`: 用户登录凭证，包含`username`和`password`字段
  - `UserSession`: 用户会话信息，包含`token`、`userId`、`expiresAt`等字段

- **响应类型**:
  - `AuthResponse`: 认证响应，包含`token`、`user`信息
  - `UserProfile`: 用户资料信息

#### 认证相关接口

```typescript
// 用户登录
async login(credentials: UserCredentials): Promise<AuthResponse>

// 用户注册
async register(userData: Omit<User, 'id' | 'created_at' | 'updated_at'>): Promise<AuthResponse>

// 验证令牌
async verifyToken(token: string): Promise<User | null>

// 刷新令牌
async refreshToken(refreshToken: string): Promise<AuthResponse>

// 登出
async logout(token: string): Promise<boolean>
```

#### 用户资料接口

```typescript
// 获取用户资料
async getUserProfile(userId: string): Promise<UserProfile>

// 更新用户资料
async updateUserProfile(userId: string, profileData: Partial<UserProfile>): Promise<UserProfile>

// 更改密码
async changePassword(userId: string, oldPassword: string, newPassword: string): Promise<boolean>
```

#### JWT实现

服务使用JWT进行用户认证：

```typescript
// 生成JWT令牌
function generateToken(user: User): string {
  return jwt.sign(
    { id: user.id, username: user.username, role: user.role },
    process.env.JWT_SECRET || 'default_secret',
    { expiresIn: '24h' }
  );
}

// 验证JWT令牌
function verifyToken(token: string): UserPayload | null {
  try {
    return jwt.verify(token, process.env.JWT_SECRET || 'default_secret') as UserPayload;
  } catch (error) {
    return null;
  }
}
```

#### 会话管理

系统实现了会话管理机制：

```typescript
// 存储活跃会话
const activeSessions: Map<string, UserSession> = new Map();

// 创建新会话
function createSession(userId: string, token: string): UserSession { ... }

// 验证会话有效性
function validateSession(token: string): UserSession | null { ... }

// 结束会话
function terminateSession(token: string): boolean { ... }
```

### 审计服务 (audit.ts)

记录系统操作日志和用户活动。

- **主要功能**:
  - 操作审计日志记录
  - 用户活动跟踪
  - 系统事件监控

### 知识库服务 (knowledge.ts)

管理向量数据库中的知识文档。

- **主要功能**:
  - 文档上传与管理
  - 知识库检索
  - 向量化处理

### 模型服务 (model.ts)

提供对不同AI模型的访问和管理。

- **主要功能**:
  - 模型列表获取
  - 模型参数配置
  - 模型调用接口

### MCP服务 (mcp.ts)

MCP (Model Control Panel) 服务提供对模型的控制和监控。

- **主要功能**:
  - 模型状态监控
  - 模型负载均衡
  - 资源分配

### 权限服务 (permissions.ts)

管理用户和角色的权限。

- **主要功能**:
  - 角色定义与分配
  - 权限检查
  - 资源访问控制

### 问答服务 (qa.ts)

处理用户问题并生成回答。

- **主要功能**:
  - 对话历史管理
  - 问题处理与路由
  - 回答生成与优化

### 配额服务 (quota.ts)

管理用户资源使用配额。

- **主要功能**:
  - 用户配额跟踪
  - 使用限制实施
  - 配额更新与重置

### 向量服务 (vector.ts)

提供向量数据库的操作接口。

- **主要功能**:
  - 向量存储和检索
  - 相似度搜索
  - 向量索引管理

## 数据模型

系统采用了两套数据模型：

1. **服务端模型**: 使用下划线命名法（如`created_at`），主要用于与后端API交互和数据存储
2. **共享模型**: 使用驼峰命名法（如`createdAt`），与前端共享，定义在`shared/types/`目录

系统实现了类型转换函数，确保两套模型之间的正确转换和类型安全。

## 模拟数据模式

为了便于开发和测试，系统支持模拟数据模式：

- 通过环境变量`USE_MOCK_DATA`控制是否使用模拟数据
- 模拟数据定义在各服务模块内，如`mockServerPromptTemplates`
- 模拟模式下会模拟API响应和数据操作，而不会实际调用后端API

## 环境配置

服务端通过`.env`文件配置环境变量：

- `JWT_SECRET`: JWT令牌生成密钥
- `BACKEND_API_URL`: 后端API的基础URL
- `USE_MOCK_DATA`: 是否使用模拟数据模式
- `PORT`: 服务端监听端口
- `NODE_ENV`: 运行环境（development/production）

## 错误处理

服务实现了统一的错误处理机制：

- 使用logger记录错误信息
- 在API响应中提供清晰的错误信息
- 对不同类型的错误进行分类处理

## 开发规范

代码开发遵循以下规范：

1. 使用TypeScript确保类型安全
2. 服务模块采用单例模式
3. 接口定义与实现分离
4. 统一的错误处理和日志记录
5. 使用异步/await模式处理异步操作
