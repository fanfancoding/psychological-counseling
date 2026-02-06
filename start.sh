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

echo "[4/5] 启动服务 (前后端同时启动)..."
npx concurrently --kill-others \
  --prefix "[{name}]" \
  --names "SERVER,CLIENT" \
  --prefix-colors "blue,green" \
  "cd server && pnpm dev" \
  "cd client && pnpm dev"


echo ""
echo "========================================"
echo "  ✅ 本地环境已启动！"
echo "========================================"
echo "  前端地址: http://localhost:5173"
echo "  后端地址: http://localhost:3000"
echo "  数据库: psychological_test_local"
echo "========================================"
echo ""
