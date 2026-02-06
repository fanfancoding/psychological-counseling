#!/bin/bash
set -e

echo "========================================="
echo "  部署心理测评系统到服务器"
echo "========================================="

# 服务器信息
SERVER_IP="45.76.216.101"
SERVER_USER="root"
PROJECT_DIR="/root/psychological"

# 1. 打包前端（生产环境）
echo "[1/6] 打包前端（生产环境）..."
cd client
pnpm install
pnpm build:prod
cd ..

# 2. 压缩项目文件
echo "[2/6] 压缩项目文件..."
tar -czf psychological-deploy.tar.gz \
  --exclude='node_modules' \
  --exclude='.git' \
  --exclude='client/dist' \
  --exclude='server/data' \
  client/dist \
  server \
  docker-compose.yml \
  .gitignore

# 3. 上传到服务器
echo "[3/6] 上传到服务器..."
scp psychological-deploy.tar.gz $SERVER_USER@$SERVER_IP:/tmp/

# 4. 在服务器上解压并部署
echo "[4/6] 在服务器上部署..."
ssh $SERVER_USER@$SERVER_IP << 'ENDSSH'
  set -e
  
  # 创建项目目录
  mkdir -p /root/psychological
  cd /root/psychological
  
  # 解压文件
  tar -xzf /tmp/psychological-deploy.tar.gz
  
  # 配置环境变量
  cd server
  cat > .env << 'EOF'
PORT=3000
NODE_ENV=production
DOMAIN=https://www.fanfancoding.asia
MONGODB_URI=mongodb://localhost:27017/psychological_test_prod
LOG_LEVEL=info
EOF
  
  # 安装依赖
  npm install -g pnpm pm2 || true
  pnpm install --prod
  
  # 启动 MongoDB（如果未运行）
  cd ..
  docker-compose up -d || echo "MongoDB 可能已在运行"
  
  # 启动后端服务
  cd server
  pm2 delete psych-prod 2>/dev/null || true
  pm2 start src/app.js --name psych-prod --env production
  pm2 save
  
  # 清理临时文件
  rm -f /tmp/psychological-deploy.tar.gz
  
  echo "✅ 服务器部署完成！"
ENDSSH

# 5. 配置 Nginx（需要手动执行）
echo "[5/6] Nginx 配置..."
echo "请手动配置 Nginx，参考 ENVIRONMENTS.md"

# 6. 清理本地临时文件
echo "[6/6] 清理临时文件..."
rm -f psychological-deploy.tar.gz

echo "========================================="
echo "  ✅ 部署完成！"
echo "========================================="
echo "  前端: https://www.fanfancoding.asia"
echo "  后端: https://www.fanfancoding.asia/api"
echo "========================================="
echo ""
echo "下一步："
echo "1. 配置 Nginx（参考 ENVIRONMENTS.md）"
echo "2. 配置 SSL 证书：sudo certbot --nginx -d www.fanfancoding.asia"
echo "3. 测试访问：curl https://www.fanfancoding.asia/health"
