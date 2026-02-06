@echo off
chcp 65001 >nul

echo =========================================
echo   环境切换工具
echo =========================================
echo.
echo 请选择要切换的环境：
echo   1) Local   - 本地开发环境
echo   2) Dev     - 开发测试环境
echo   3) Prod    - 生产环境
echo.
set /p choice="请输入选项 (1-3): "

if "%choice%"=="1" (
    echo 切换到 Local 环境...
    copy /Y server\.env.local server\.env >nul
    copy /Y client\.env.local client\.env >nul
    echo ✅ 已切换到 Local 环境
    echo    前端: http://localhost:5173
    echo    后端: http://localhost:3000
) else if "%choice%"=="2" (
    echo 切换到 Dev 环境...
    copy /Y server\.env.dev server\.env >nul
    copy /Y client\.env.development client\.env >nul
    echo ✅ 已切换到 Dev 环境
    echo    前端: https://dev.fanfancoding.asia
    echo    后端: https://dev.fanfancoding.asia/api
) else if "%choice%"=="3" (
    echo 切换到 Prod 环境...
    copy /Y server\.env.production server\.env >nul
    copy /Y client\.env.production client\.env >nul
    echo ✅ 已切换到 Prod 环境
    echo    前端: https://www.fanfancoding.asia
    echo    后端: https://www.fanfancoding.asia/api
) else (
    echo ❌ 无效选项
    pause
    exit /b 1
)

echo.
echo 提示: 运行 'pnpm dev' 启动开发服务器
echo.
pause
