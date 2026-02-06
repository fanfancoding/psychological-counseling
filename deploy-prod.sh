#!/bin/bash
set -e

echo "========================================="
echo "  部署到 Prod 环境"
echo "========================================="

cd /var/www/psych-prod

# 1. 拉取最新代码
echo "[1/6] 拉取最新代码..."
git pull origin main

# 2. 配置环境变量
echo "[2/6] 配置环境变量..."
cp server/.env.production server/.env
cp client/.env.production client/.env

# 3. 更新后端
echo "[3/6] 更新后端..."
cd server
pnpm install --prod
pm2 restart psych-prod || pm2 start src/app.js --name psych-prod --env production

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
curl -f https://www.fanfancoding.asia/health || echo "❌ 健康检查失败"

echo "========================================="
echo "  ✅ Prod 环境部署完成！"
echo "  前端: https://www.fanfancoding.asia"
echo "  API: https://www.fanfancoding.asia/api"
echo "========================================="
