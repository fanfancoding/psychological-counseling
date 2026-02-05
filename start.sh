#!/bin/bash

echo "========================================"
echo "  心理测评系统 - 启动脚本 (macOS/Linux)"
echo "========================================"
echo ""

echo "[1/4] 启动 MongoDB..."
docker compose up -d
if [ $? -ne 0 ]; then
    echo "❌ MongoDB 启动失败，请检查 Docker 是否安装并运行"
    exit 1
fi

echo "[2/4] 等待 MongoDB 就绪..."
sleep 3

echo "[3/4] 启动后端服务..."
cd server
osascript -e 'tell app "Terminal" to do script "cd '"$(pwd)"' && pnpm dev"' 2>/dev/null || \
gnome-terminal -- bash -c "cd $(pwd) && pnpm dev; exec bash" 2>/dev/null || \
(pnpm dev &)
cd ..

echo "[4/4] 启动前端服务..."
cd client
osascript -e 'tell app "Terminal" to do script "cd '"$(pwd)"' && pnpm dev"' 2>/dev/null || \
gnome-terminal -- bash -c "cd $(pwd) && pnpm dev; exec bash" 2>/dev/null || \
(pnpm dev &)
cd ..

echo ""
echo "========================================"
echo "  ✅ 所有服务已启动！"
echo "========================================"
echo "  后端地址: http://localhost:3000"
echo "  前端地址: http://localhost:5173"
echo "========================================"
echo ""
