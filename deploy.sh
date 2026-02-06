#!/bin/bash
set -e

echo "========================================="
echo "  心理测评系统 - 部署更新脚本"
echo "========================================="

cd /var/www/psychological-counseling

# 1. 拉取最新代码
echo "[1/5] 拉取最新代码..."
git pull origin main

# 2. 更新后端
echo "[2/5] 更新后端..."
cd server
pnpm install
pm2 restart psych-backend

# 3. 更新前端
echo "[3/5] 构建前端..."
cd ../client
pnpm install
pnpm build

# 4. 重启 Nginx
echo "[4/5] 重启 Nginx..."
sudo systemctl reload nginx

# 5. 验证
echo "[5/5] 验证部署..."
sleep 3
curl -f https://test.fanfancoding.asia/health || echo "❌ 健康检查失败"

echo "========================================="
echo "  ✅ 部署完成！"
echo "  前端: https://test.fanfancoding.asia"
echo "  API: https://test.fanfancoding.asia/api"
echo "========================================="
