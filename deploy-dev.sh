#!/bin/bash
set -e

echo "========================================="
echo "  部署到 Dev 环境"
echo "========================================="

cd /var/www/psych-dev

# 1. 拉取最新代码
echo "[1/6] 拉取最新代码..."
git pull origin develop

# 2. 配置环境变量
echo "[2/6] 配置环境变量..."
cp server/.env.dev server/.env
cp client/.env.development client/.env

# 3. 更新后端
echo "[3/6] 更新后端..."
cd server
pnpm install
pm2 restart psych-dev || pm2 start src/app.js --name psych-dev

# 4. 更新前端
echo "[4/6] 构建前端..."
cd ../client
pnpm install
pnpm build

# 5. 重启 Nginx
echo "[5/6] 重启 Nginx..."
sudo systemctl reload nginx

# 6. 验证
echo "[6/6] 验证部署..."
sleep 3
curl -f https://dev.fanfancoding.asia/health || echo "❌ 健康检查失败"

echo "========================================="
echo "  ✅ Dev 环境部署完成！"
echo "  前端: https://dev.fanfancoding.asia"
echo "  API: https://dev.fanfancoding.asia/api"
echo "========================================="
