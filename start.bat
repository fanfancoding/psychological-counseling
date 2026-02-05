@echo off
chcp 65001 >nul
echo ========================================
echo   心理测评系统 - 启动脚本 (Windows)
echo ========================================
echo.

echo [1/4] 启动 MongoDB...
docker compose up -d
if %errorlevel% neq 0 (
    echo ❌ MongoDB 启动失败，请检查 Docker 是否安装并运行
    pause
    exit /b 1
)

echo [2/4] 等待 MongoDB 就绪...
timeout /t 3 /nobreak >nul

echo [3/4] 启动后端服务...
cd server
start "心理测评-后端" cmd /k "pnpm dev"
cd ..

echo [4/4] 启动前端服务...
cd client
start "心理测评-前端" cmd /k "pnpm dev"
cd ..

echo.
echo ========================================
echo   ✅ 所有服务已启动！
echo ========================================
echo   后端地址: http://localhost:3000
echo   前端地址: http://localhost:5173
echo ========================================
echo.
pause
