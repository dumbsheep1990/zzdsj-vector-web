@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

:: PM2 管理脚本 - 智政大模型开发框架 (Windows版本)
:: 用于管理前端和后端服务的启动、停止、重启等操作

:: 颜色定义（Windows 10+）
set "RED=[91m"
set "GREEN=[92m"
set "YELLOW=[93m"
set "BLUE=[94m"
set "NC=[0m"

:: 检查PM2是否安装
where pm2 >nul 2>&1
if %errorlevel% neq 0 (
    echo %RED%[ERROR]%NC% PM2 未安装，请先安装 PM2: npm install -g pm2
    exit /b 1
)

:: 创建日志目录
if not exist "logs" mkdir logs
if not exist "server\logs" mkdir server\logs

:: 根据参数执行相应操作
if "%1"=="" (
    echo %YELLOW%[WARN]%NC% 请指定命令，使用 'pm2-manager.bat help' 查看帮助
    goto :eof
)

if /i "%1"=="start" goto start_all
if /i "%1"=="start:dev" goto start_dev
if /i "%1"=="start:prod" goto start_prod
if /i "%1"=="stop" goto stop_all
if /i "%1"=="restart" goto restart_all
if /i "%1"=="reload" goto reload_all
if /i "%1"=="delete" goto delete_all
if /i "%1"=="status" goto show_status
if /i "%1"=="logs" goto show_logs
if /i "%1"=="monitor" goto monitor
if /i "%1"=="help" goto show_help
if /i "%1"=="--help" goto show_help
if /i "%1"=="-h" goto show_help

echo %RED%[ERROR]%NC% 未知命令: %1
echo %GREEN%[INFO]%NC% 使用 'pm2-manager.bat help' 查看可用命令
exit /b 1

:start_all
echo %GREEN%[INFO]%NC% 启动所有服务...
call :build_server
pm2 start ecosystem.config.js
echo %GREEN%[INFO]%NC% 所有服务已启动
call :show_status
goto :eof

:start_dev
echo %GREEN%[INFO]%NC% 启动开发环境...
pm2 start ecosystem.config.js --env development
echo %GREEN%[INFO]%NC% 开发环境已启动
call :show_status
goto :eof

:start_prod
echo %GREEN%[INFO]%NC% 启动生产环境...
call :build_server
pm2 start ecosystem.config.js --env production
echo %GREEN%[INFO]%NC% 生产环境已启动
call :show_status
goto :eof

:stop_all
echo %GREEN%[INFO]%NC% 停止所有服务...
pm2 stop ecosystem.config.js
echo %GREEN%[INFO]%NC% 所有服务已停止
goto :eof

:restart_all
echo %GREEN%[INFO]%NC% 重启所有服务...
pm2 restart ecosystem.config.js
echo %GREEN%[INFO]%NC% 所有服务已重启
call :show_status
goto :eof

:reload_all
echo %GREEN%[INFO]%NC% 重载所有服务（零停机重启）...
pm2 reload ecosystem.config.js
echo %GREEN%[INFO]%NC% 所有服务已重载
call :show_status
goto :eof

:delete_all
echo %YELLOW%[WARN]%NC% 删除所有PM2服务...
pm2 delete ecosystem.config.js
echo %GREEN%[INFO]%NC% 所有服务已删除
goto :eof

:show_status
echo %BLUE%[INFO]%NC% 服务状态：
pm2 status
goto :eof

:show_logs
if "%2"=="" (
    echo %BLUE%[INFO]%NC% 显示所有服务日志：
    pm2 logs
) else (
    echo %BLUE%[INFO]%NC% 显示 %2 服务日志：
    pm2 logs %2
)
goto :eof

:monitor
echo %BLUE%[INFO]%NC% 启动PM2监控界面...
pm2 monit
goto :eof

:build_server
echo %GREEN%[INFO]%NC% 构建服务端代码...
cd server
npm run build
if %errorlevel% neq 0 (
    echo %RED%[ERROR]%NC% 服务端构建失败
    cd ..
    exit /b 1
)
echo %GREEN%[INFO]%NC% 服务端构建成功
cd ..
goto :eof

:show_help
echo %BLUE%PM2 管理脚本使用说明 (Windows版本)%NC%
echo.
echo 用法: pm2-manager.bat [命令]
echo.
echo 可用命令:
echo   start         启动所有服务
echo   start:dev     启动开发环境
echo   start:prod    启动生产环境
echo   stop          停止所有服务
echo   restart       重启所有服务
echo   reload        重载所有服务（零停机重启）
echo   delete        删除所有服务
echo   status        显示服务状态
echo   logs [name]   显示日志（可选指定服务名）
echo   monitor       启动监控界面
echo   help          显示此帮助信息
echo.
echo 服务名称:
echo   vector-web-frontend  前端服务
echo   vector-web-server    后端服务
echo.
goto :eof
