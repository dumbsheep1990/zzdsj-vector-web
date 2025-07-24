# PM2 服务管理文档

本文档介绍如何使用PM2管理智政大模型开发框架的前端和后端服务。

## 前置要求

1. **安装PM2**
   ```bash
   npm install -g pm2
   ```

2. **安装项目依赖**
   ```bash
   # 安装前端依赖
   npm install
   
   # 安装后端依赖
   cd server
   npm install
   cd ..
   ```

## 服务配置

项目包含两个服务：

- **vector-web-frontend**: 前端Vite开发服务器 (端口: 5173)
- **vector-web-server**: 后端Express服务器 (端口: 3001)

两个服务都配置为监听IPv4地址 `0.0.0.0`，确保在各种网络环境下都能正常访问。

## 使用方法

### 方法一：使用管理脚本（推荐）

#### Linux/macOS
```bash
# 给脚本添加执行权限（首次使用）
chmod +x pm2-manager.sh

# 启动所有服务
./pm2-manager.sh start

# 启动开发环境
./pm2-manager.sh start:dev

# 启动生产环境
./pm2-manager.sh start:prod

# 查看服务状态
./pm2-manager.sh status

# 查看日志
./pm2-manager.sh logs

# 重启服务
./pm2-manager.sh restart

# 停止服务
./pm2-manager.sh stop

# 查看帮助
./pm2-manager.sh help
```

#### Windows
```cmd
# 启动所有服务
pm2-manager.bat start

# 启动开发环境
pm2-manager.bat start:dev

# 启动生产环境
pm2-manager.bat start:prod

# 查看服务状态
pm2-manager.bat status

# 查看日志
pm2-manager.bat logs

# 重启服务
pm2-manager.bat restart

# 停止服务
pm2-manager.bat stop

# 查看帮助
pm2-manager.bat help
```

### 方法二：使用npm脚本

```bash
# 启动所有服务
npm run pm2:start

# 启动开发环境
npm run pm2:start:dev

# 启动生产环境
npm run pm2:start:prod

# 查看服务状态
npm run pm2:status

# 查看日志
npm run pm2:logs

# 重启服务
npm run pm2:restart

# 重载服务（零停机重启）
npm run pm2:reload

# 停止服务
npm run pm2:stop

# 删除服务
npm run pm2:delete

# 监控界面
npm run pm2:monitor
```

### 方法三：直接使用PM2命令

```bash
# 启动服务
pm2 start ecosystem.config.js

# 启动开发环境
pm2 start ecosystem.config.js --env development

# 启动生产环境
pm2 start ecosystem.config.js --env production

# 查看状态
pm2 status

# 查看日志
pm2 logs

# 重启服务
pm2 restart ecosystem.config.js

# 停止服务
pm2 stop ecosystem.config.js
```

## 日志管理

日志文件位置：
- 前端日志: `logs/frontend-*.log`
- 后端日志: `logs/server-*.log`
- 服务端日志: `server/logs/`

日志类型：
- `*-error.log`: 错误日志
- `*-out.log`: 标准输出日志
- `*-combined.log`: 合并日志

## 监控和调试

1. **实时监控**
   ```bash
   pm2 monit
   ```

2. **查看特定服务日志**
   ```bash
   pm2 logs vector-web-frontend
   pm2 logs vector-web-server
   ```

3. **查看服务详细信息**
   ```bash
   pm2 show vector-web-frontend
   pm2 show vector-web-server
   ```

## 环境配置

### 开发环境
- 前端: Vite开发服务器，支持热重载
- 后端: 使用模拟数据，开启调试日志

### 生产环境
- 前端: 构建后的静态文件服务
- 后端: 集群模式，连接真实API

## 网络配置

所有服务都配置为监听IPv4地址：
- 前端: `http://0.0.0.0:5173`
- 后端: `http://0.0.0.0:3001`

这确保了服务可以通过以下方式访问：
- `http://localhost:5173` (本地访问)
- `http://[服务器IP]:5173` (远程访问)

## 故障排除

1. **服务启动失败**
   - 检查端口是否被占用
   - 确认依赖是否正确安装
   - 查看错误日志

2. **无法访问服务**
   - 检查防火墙设置
   - 确认服务监听地址配置
   - 验证网络连接

3. **性能问题**
   - 使用 `pm2 monit` 监控资源使用
   - 检查日志中的错误信息
   - 考虑调整集群实例数量

## 自动启动

设置系统启动时自动启动PM2服务：

```bash
# 保存当前PM2进程列表
pm2 save

# 生成启动脚本
pm2 startup

# 按照提示执行生成的命令
```

这样系统重启后，PM2会自动启动所有保存的服务。
