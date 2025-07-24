#!/bin/bash

# 快速启动开发环境脚本
# 用于一键启动前端和后端开发服务

# 颜色定义
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}智政大模型开发框架 - 开发环境启动${NC}"
echo "=================================="

# 检查PM2是否安装
if ! command -v pm2 &> /dev/null; then
    echo -e "${YELLOW}PM2 未安装，使用传统方式启动...${NC}"
    
    # 创建日志目录
    mkdir -p logs
    
    # 启动后端服务
    echo -e "${GREEN}启动后端服务...${NC}"
    cd server
    npm run dev > ../logs/server-dev.log 2>&1 &
    SERVER_PID=$!
    cd ..
    
    # 等待后端服务启动
    sleep 3
    
    # 启动前端服务
    echo -e "${GREEN}启动前端服务...${NC}"
    npm run dev > logs/frontend-dev.log 2>&1 &
    FRONTEND_PID=$!
    
    echo -e "${GREEN}服务启动完成！${NC}"
    echo "前端服务: http://localhost:5173"
    echo "后端服务: http://localhost:3001"
    echo ""
    echo "进程ID:"
    echo "  前端: $FRONTEND_PID"
    echo "  后端: $SERVER_PID"
    echo ""
    echo "按 Ctrl+C 停止所有服务"
    
    # 等待用户中断
    trap "echo -e '\n${YELLOW}正在停止服务...${NC}'; kill $FRONTEND_PID $SERVER_PID 2>/dev/null; exit 0" INT
    wait
    
else
    echo -e "${GREEN}使用PM2启动开发环境...${NC}"
    ./pm2-manager.sh start:dev
fi
