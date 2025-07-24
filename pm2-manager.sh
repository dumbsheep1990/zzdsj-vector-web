#!/bin/bash

# PM2 管理脚本 - 智政大模型开发框架
# 用于管理前端和后端服务的启动、停止、重启等操作

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 日志函数
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

log_blue() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

# 检查PM2是否安装
check_pm2() {
    if ! command -v pm2 &> /dev/null; then
        log_error "PM2 未安装，请先安装 PM2: npm install -g pm2"
        exit 1
    fi
}

# 创建日志目录
create_log_dirs() {
    mkdir -p logs
    mkdir -p server/logs
    log_info "日志目录已创建"
}

# 构建服务端代码
build_server() {
    log_info "构建服务端代码..."
    cd server
    if npm run build; then
        log_info "服务端构建成功"
        cd ..
    else
        log_error "服务端构建失败"
        cd ..
        exit 1
    fi
}

# 启动所有服务
start_all() {
    log_info "启动所有服务..."
    create_log_dirs
    build_server
    pm2 start ecosystem.config.js
    log_info "所有服务已启动"
    show_status
}

# 启动开发环境
start_dev() {
    log_info "启动开发环境..."
    create_log_dirs
    pm2 start ecosystem.config.js --env development
    log_info "开发环境已启动"
    show_status
}

# 启动生产环境
start_prod() {
    log_info "启动生产环境..."
    create_log_dirs
    build_server
    pm2 start ecosystem.config.js --env production
    log_info "生产环境已启动"
    show_status
}

# 停止所有服务
stop_all() {
    log_info "停止所有服务..."
    pm2 stop ecosystem.config.js
    log_info "所有服务已停止"
}

# 重启所有服务
restart_all() {
    log_info "重启所有服务..."
    pm2 restart ecosystem.config.js
    log_info "所有服务已重启"
    show_status
}

# 删除所有服务
delete_all() {
    log_warn "删除所有PM2服务..."
    pm2 delete ecosystem.config.js
    log_info "所有服务已删除"
}

# 显示服务状态
show_status() {
    log_blue "服务状态："
    pm2 status
}

# 显示日志
show_logs() {
    if [ -z "$2" ]; then
        log_blue "显示所有服务日志："
        pm2 logs
    else
        log_blue "显示 $2 服务日志："
        pm2 logs "$2"
    fi
}

# 监控服务
monitor() {
    log_blue "启动PM2监控界面..."
    pm2 monit
}

# 重载服务（零停机重启）
reload_all() {
    log_info "重载所有服务（零停机重启）..."
    pm2 reload ecosystem.config.js
    log_info "所有服务已重载"
    show_status
}

# 显示帮助信息
show_help() {
    echo -e "${BLUE}PM2 管理脚本使用说明${NC}"
    echo ""
    echo "用法: ./pm2-manager.sh [命令]"
    echo ""
    echo "可用命令:"
    echo "  start         启动所有服务"
    echo "  start:dev     启动开发环境"
    echo "  start:prod    启动生产环境"
    echo "  stop          停止所有服务"
    echo "  restart       重启所有服务"
    echo "  reload        重载所有服务（零停机重启）"
    echo "  delete        删除所有服务"
    echo "  status        显示服务状态"
    echo "  logs [name]   显示日志（可选指定服务名）"
    echo "  monitor       启动监控界面"
    echo "  help          显示此帮助信息"
    echo ""
    echo "服务名称:"
    echo "  vector-web-frontend  前端服务"
    echo "  vector-web-server    后端服务"
    echo ""
}

# 主函数
main() {
    check_pm2
    
    case "$1" in
        "start")
            start_all
            ;;
        "start:dev")
            start_dev
            ;;
        "start:prod")
            start_prod
            ;;
        "stop")
            stop_all
            ;;
        "restart")
            restart_all
            ;;
        "reload")
            reload_all
            ;;
        "delete")
            delete_all
            ;;
        "status")
            show_status
            ;;
        "logs")
            show_logs "$@"
            ;;
        "monitor")
            monitor
            ;;
        "help"|"--help"|"-h")
            show_help
            ;;
        "")
            log_warn "请指定命令，使用 './pm2-manager.sh help' 查看帮助"
            ;;
        *)
            log_error "未知命令: $1"
            log_info "使用 './pm2-manager.sh help' 查看可用命令"
            exit 1
            ;;
    esac
}

# 执行主函数
main "$@"
