# 前端API地址配置指南

## 环境变量说明

前端项目支持通过环境变量配置所有API地址，避免硬编码问题。

### 环境变量列表

| 变量名 | 描述 | 默认值 | 对应服务 |
|--------|------|--------|----------|
| `VITE_API_BASE_URL` | 网关服务API地址 | `http://localhost:8080/api/v1` | gateway-service |
| `VITE_KNOWLEDGE_SERVICE_URL` | 知识库服务API地址 | `http://localhost:8082/api/v1` | knowledge-service |
| `VITE_AGENT_SERVICE_URL` | 智能体服务API地址 | `http://localhost:8081/api/v1` | agent-service |
| `VITE_MODEL_SERVICE_URL` | 模型服务API地址 | `http://localhost:8088/api/v1` | model-service |
| `VITE_GRAPH_SERVICE_URL` | 知识图谱服务API地址 | `http://localhost:8087/api/v1/graphs` | knowledge-graph-service |
| `VITE_KAIBAN_SERVICE_URL` | 看板服务API地址 | `http://localhost:8092/api/v1` | kaiban-service |
| `VITE_REPORTS_SERVICE_URL` | 智能报告服务API地址 | `http://localhost:8091/api/v1` | intelligent-reports-service |
| `VITE_AGENT_ORCHESTRATION_URL` | 智能体编排服务地址 | `http://localhost:8000` | 特殊服务 |
| `VITE_AGENT_ORCHESTRATION_IFRAME_URL` | 智能体编排iframe地址 | `http://localhost:3000` | 特殊服务 |

### 配置文件

#### 开发环境 (.env)
```bash
# 网关服务（推荐）
VITE_API_BASE_URL=http://localhost:8080/api/v1

# 微服务直连（开发调试）
VITE_KNOWLEDGE_SERVICE_URL=http://localhost:8082/api/v1
VITE_AGENT_SERVICE_URL=http://localhost:8081/api/v1
# ... 其他服务
```

#### 生产环境 (.env.production)
```bash
# 使用实际域名或IP
VITE_API_BASE_URL=http://your-domain.com:8080/api/v1
VITE_KNOWLEDGE_SERVICE_URL=http://your-domain.com:8082/api/v1
# ... 其他服务
```

### 使用方式

#### 1. 通过网关访问（推荐）
所有API请求通过网关服务统一转发：
```typescript
import { API_CONFIG } from '@/utils/envConfig';

const response = await fetch(`${API_CONFIG.GATEWAY_URL}/knowledge-bases`);
```

#### 2. 直连微服务（开发调试）
直接访问特定微服务：
```typescript
import { API_CONFIG } from '@/utils/envConfig';

const response = await fetch(`${API_CONFIG.KNOWLEDGE_SERVICE}/knowledge-bases`);
```

### 部署配置

#### Docker部署
```dockerfile
# 构建时传入环境变量
ARG VITE_API_BASE_URL=http://production-domain.com:8080/api/v1
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
```

#### Nginx代理
```nginx
# 代理后端服务
location /api/ {
    proxy_pass http://backend-gateway:8080/api/;
}
```

### 开发调试

#### 查看当前配置
打开浏览器控制台，在开发环境下会自动输出API配置信息。

#### 切换环境
```bash
# 开发环境启动
npm run dev

# 生产环境构建
npm run build

# 使用自定义环境变量
VITE_API_BASE_URL=http://test-server:8080/api/v1 npm run dev
```

### 故障排除

1. **API请求失败**：检查对应的环境变量是否正确设置
2. **服务无法访问**：确认微服务是否正常启动
3. **跨域问题**：检查后端CORS配置
4. **环境变量不生效**：重启开发服务器

