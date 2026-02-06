# 服务器部署快速指南

## 📦 部署到生产服务器

### 方式一：使用自动部署脚本（推荐）

```bash
# 1. 确保已配置 SSH 密钥（避免多次输入密码）
ssh-copy-id root@45.76.216.101

# 2. 运行部署脚本
chmod +x deploy-to-server.sh
./deploy-to-server.sh
```

### 方式二：手动部署

#### 1. 本地打包

```bash
# 打包生产环境前端
cd client
pnpm install
pnpm build:prod
cd ..

# 打包项目
tar -czf psychological-deploy.tar.gz \
  --exclude='node_modules' \
  --exclude='.git' \
  --exclude='server/data' \
  client/dist \
  server \
  docker-compose.yml
```

#### 2. 上传到服务器

```bash
scp psychological-deploy.tar.gz root@45.76.216.101:/tmp/
```

#### 3. 在服务器上部署

```bash
# SSH 登录服务器
ssh root@45.76.216.101

# 创建项目目录
mkdir -p /root/psychological
cd /root/psychological

# 解压文件
tar -xzf /tmp/psychological-deploy.tar.gz

# 配置后端环境变量
cd server
cat > .env << 'EOF'
PORT=3000
NODE_ENV=production
DOMAIN=https://www.fanfancoding.asia
MONGODB_URI=mongodb://localhost:27017/psychological_test_prod
LOG_LEVEL=info
EOF

# 安装依赖
npm install -g pnpm pm2
pnpm install --prod

# 启动 MongoDB
cd ..
docker-compose up -d

# 启动后端
cd server
pm2 start src/app.js --name psych-prod --env production
pm2 save
pm2 startup  # 设置开机自启
```

#### 4. 配置 Nginx

```bash
# 复制 Nginx 配置
sudo cp /root/psychological/nginx-prod.conf /etc/nginx/sites-available/psychological

# 创建软链接
sudo ln -s /etc/nginx/sites-available/psychological /etc/nginx/sites-enabled/

# 测试配置
sudo nginx -t

# 重启 Nginx
sudo systemctl reload nginx
```

#### 5. 配置 SSL 证书

```bash
# 使用 Let's Encrypt
sudo certbot --nginx -d www.fanfancoding.asia -d fanfancoding.asia
```

---

## 🔄 更新部署

### 快速更新

```bash
# 本地执行
./deploy-to-server.sh
```

### 手动更新

```bash
# 在服务器上
cd /root/psychological
git pull origin main  # 如果使用 Git

# 或重新上传并解压

# 重启服务
cd server
pnpm install --prod
pm2 restart psych-prod

# 如果前端有更新
cd ../client
# 重新构建并上传 dist 目录
```

---

## 📊 监控与管理

### 查看服务状态

```bash
# PM2 进程
pm2 list
pm2 logs psych-prod
pm2 monit

# Nginx 状态
sudo systemctl status nginx

# MongoDB 状态
docker ps | grep mongo
```

### 重启服务

```bash
# 重启后端
pm2 restart psych-prod

# 重启 Nginx
sudo systemctl reload nginx

# 重启 MongoDB
docker-compose restart
```

---

## 🌐 本地环境切换

### 访问不同环境

修改 `client/.env` 文件：

**访问本地环境**：

```bash
cp client/.env.local client/.env
pnpm dev
```

**访问开发环境**：

```bash
cp client/.env.development client/.env
pnpm dev
```

**访问生产环境**：

```bash
cp client/.env.production client/.env
pnpm dev
```

### 打包不同环境

```bash
# 打包本地环境
pnpm build:local

# 打包开发环境
pnpm build:dev

# 打包生产环境
pnpm build:prod
```

---

## ✅ 验证部署

```bash
# 健康检查
curl https://www.fanfancoding.asia/health

# 测试 API
curl https://www.fanfancoding.asia/api/admin/stats

# 访问前端
open https://www.fanfancoding.asia
```

---

## 🔒 安全检查清单

- [ ] 已配置 SSL 证书
- [ ] 已启用 HTTPS 强制跳转
- [ ] 已配置防火墙（仅开放 80, 443, 22）
- [ ] 已配置 SSH 密钥认证
- [ ] 已禁用 root 密码登录
- [ ] 已配置 MongoDB 数据库备份
- [ ] 已设置 PM2 开机自启

---

## 📞 故障排查

### 问题：502 Bad Gateway

```bash
# 检查后端服务
pm2 logs psych-prod
pm2 restart psych-prod
```

### 问题：MongoDB 连接失败

```bash
# 检查 MongoDB 状态
docker ps | grep mongo
docker-compose up -d
```

### 问题：前端 404

```bash
# 检查 Nginx 配置
sudo nginx -t
sudo systemctl reload nginx

# 检查文件路径
ls -la /root/psychological/client/dist
```
