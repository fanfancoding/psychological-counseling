@echo off
chcp 65001 >nul
echo ========================================
echo   心理测评系统 - 本地环境启动 (Windows)
echo ========================================
echo.

echo [1/5] 配置本地环境...
copy /Y server\.env.local server\.env >nul 2>&1 || echo 使用现有配置
copy /Y client\.env.local client\.env >nul 2>&1 || echo 使用现有配置

echo [2/5] 启动 MongoDB...
docker compose up -d
if %errorlevel% neq 0 (
    echo ❌ MongoDB 启动失败，请检查 Docker 是否安装并运行
    pause
    exit /b 1
)

echo [3/5] 等待 MongoDB 就绪...
timeout /t 3 /nobreak >nul

echo [4/5] 启动后端服务...
cd server
start "心理测评-后端" cmd /k "pnpm dev"
cd ..

echo [5/5] 启动前端服务...
cd client
start "心理测评-前端" cmd /k "pnpm dev"
cd ..

echo.
echo ========================================
echo   ✅ 本地环境已启动！
echo ========================================
echo   前端地址: http://localhost:5173
echo   后端地址: http://localhost:3000
echo   数据库: psychological_test_local
echo ========================================
echo.
pause
