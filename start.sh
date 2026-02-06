echo "========================================"
echo "  心理测评系统 - 本地环境启动"
echo "========================================"
echo ""

echo "[1/5] 配置本地环境..."
cp server/.env.local server/.env 2>/dev/null || echo "使用现有配置"
cp client/.env.local client/.env 2>/dev/null || echo "使用现有配置"

echo "[2/5] 启动 MongoDB..."
docker compose up -d
if [ $? -ne 0 ]; then
    echo "❌ MongoDB 启动失败，请检查 Docker 是否安装并运行"
    exit 1
fi

echo "[3/5] 等待 MongoDB 就绪..."
sleep 3

echo "[4/5] 启动后端服务..."
cd server
osascript -e 'tell app "Terminal" to do script "cd '"$(pwd)"' && pnpm dev"' 2>/dev/null || \
gnome-terminal -- bash -c "cd $(pwd) && pnpm dev; exec bash" 2>/dev/null || \
(pnpm dev &)
cd ..

echo "[5/5] 启动前端服务..."
cd client
osascript -e 'tell app "Terminal" to do script "cd '"$(pwd)"' && pnpm dev"' 2>/dev/null || \
gnome-terminal -- bash -c "cd $(pwd) && pnpm dev; exec bash" 2>/dev/null || \
(pnpm dev &)
cd ..

echo ""
echo "========================================"
echo "  ✅ 本地环境已启动！"
echo "========================================"
echo "  前端地址: http://localhost:5173"
echo "  后端地址: http://localhost:3000"
echo "  数据库: psychological_test_local"
echo "========================================"
echo ""
