# 测试环境部署指南

本文档提供心理测评系统在测试环境的完整部署方案。

**域名**: https://www.fanfancoding.asia/  
**环境**: 测试环境（Test/Staging）

---

## 📋 部署前准备清单

### 1. 服务器要求

**推荐配置**：

- **CPU**: 2核心或以上
- **内存**: 2GB 或以上
- **存储**: 20GB 或以上
- **操作系统**: Ubuntu 20.04/22.04 LTS 或 CentOS 7/8
- **网络**: 公网 IP，开放端口 80、443

**云服务商推荐**：

- 阿里云 ECS
- 腾讯云 CVM
- AWS EC2
- DigitalOcean Droplet

---

### 2. 域名配置

#### DNS 解析设置

在您的域名服务商（如阿里云、腾讯云）添加以下 DNS 记录：

| 类型 | 主机记录   | 记录值         | 说明               |
| ---- | ---------- | -------------- | ------------------ |
| A    | `test`     | `服务器公网IP` | 测试环境主域名     |
| A    | `api-test` | `服务器公网IP` | API 子域名（可选） |

**访问地址**：

- 前端: `https://test.fanfancoding.asia`
- 后端 API: `https://api-test.fanfancoding.asia`

或者使用路径方式：

- 前端: `https://www.fanfancoding.asia/psych-test/`
- 后端 API: `https://www.fanfancoding.asia/psych-test/api/`

---

### 3. 必需软件安装

登录服务器后，安装以下软件：

```bash
# 更新系统
sudo apt update && sudo apt upgrade -y

# 安装 Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# 安装 pnpm
npm install -g pnpm

# 安装 MongoDB
# 方式一：Docker（推荐）
sudo apt install -y docker.io docker-compose
sudo systemctl start docker
sudo systemctl enable docker

# 方式二：本地安装
wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
sudo apt update
sudo apt install -y mongodb-org
sudo systemctl start mongod
sudo systemctl enable mongod

# 安装 Nginx
sudo apt install -y nginx
sudo systemctl start nginx
sudo systemctl enable nginx

# 安装 PM2（进程管理）
npm install -g pm2

# 安装 Certbot（SSL 证书）
sudo apt install -y certbot python3-certbot-nginx
```

---

## 🚀 部署步骤

### 步骤 1: 克隆项目代码

```bash
# 创建项目目录
sudo mkdir -p /var/www
cd /var/www

# 克隆代码
sudo git clone https://github.com/fanfancoding/psychological-counseling.git
cd psychological-counseling

# 切换到测试分支（如果有）
git checkout test  # 或 main/master
```

---

### 步骤 2: 配置后端环境

```bash
cd /var/www/psychological-counseling/server

# 安装依赖
pnpm install

# 创建生产环境配置
cat > .env.production << EOF
# 服务器配置
PORT=3000
NODE_ENV=production

# 域名配置
DOMAIN=https://test.fanfancoding.asia

# MongoDB 配置
MONGODB_URI=mongodb://localhost:27017/psychological_test_prod

# 日志配置
LOG_LEVEL=info
EOF

# 复制到 .env
cp .env.production .env
```

---

### 步骤 3: 配置前端环境

```bash
cd /var/www/psychological-counseling/client

# 创建生产环境配置
cat > .env.production << EOF
# API 地址
VITE_API_BASE_URL=https://test.fanfancoding.asia/api

# 环境标识
VITE_ENV=production
EOF

# 安装依赖
pnpm install

# 构建生产版本
pnpm build
```

构建完成后，静态文件会生成在 `dist/` 目录。

---

### 步骤 4: 启动 MongoDB

#### 使用 Docker（推荐）

```bash
cd /var/www/psychological-counseling

# 启动 MongoDB
docker-compose up -d

# 验证运行状态
docker ps | grep mongo
```

#### 使用本地 MongoDB

```bash
# 确保服务运行
sudo systemctl status mongod

# 创建数据库用户（可选，增强安全性）
mongosh << EOF
use psychological_test_prod
db.createUser({
  user: "psych_user",
  pwd: "your_secure_password",
  roles: [{ role: "readWrite", db: "psychological_test_prod" }]
})
EOF
```

---

### 步骤 5: 使用 PM2 启动后端

```bash
cd /var/www/psychological-counseling/server

# 启动应用
pm2 start src/app.js --name psych-backend --env production

# 设置开机自启
pm2 startup
pm2 save

# 查看日志
pm2 logs psych-backend

# 查看状态
pm2 status
```

---

### 步骤 6: 配置 Nginx 反向代理

创建 Nginx 配置文件：

```bash
sudo nano /etc/nginx/sites-available/psych-test
```

粘贴以下配置：

```nginx
# 后端 API 服务器
upstream backend {
    server 127.0.0.1:3000;
    keepalive 64;
}

server {
    listen 80;
    server_name test.fanfancoding.asia;

    # 强制 HTTPS（稍后配置 SSL 后启用）
    # return 301 https://$server_name$request_uri;

    # 前端静态文件
    location / {
        root /var/www/psychological-counseling/client/dist;
        try_files $uri $uri/ /index.html;

        # 缓存静态资源
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }

    # 后端 API 代理
    location /api/ {
        proxy_pass http://backend/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # 健康检查
    location /health {
        proxy_pass http://backend/health;
        access_log off;
    }
}
```

启用配置：

```bash
# 创建软链接
sudo ln -s /etc/nginx/sites-available/psych-test /etc/nginx/sites-enabled/

# 测试配置
sudo nginx -t

# 重启 Nginx
sudo systemctl reload nginx
```

---

### 步骤 7: 配置 SSL 证书（HTTPS）

```bash
# 使用 Let's Encrypt 免费证书
sudo certbot --nginx -d test.fanfancoding.asia

# 按提示输入邮箱并同意条款
# Certbot 会自动修改 Nginx 配置并启用 HTTPS

# 设置自动续期
sudo certbot renew --dry-run
```

Certbot 会自动修改 Nginx 配置，添加 SSL 相关内容。

---

### 步骤 8: 配置防火墙

```bash
# 开放必要端口
sudo ufw allow 22    # SSH
sudo ufw allow 80    # HTTP
sudo ufw allow 443   # HTTPS
sudo ufw enable

# 查看状态
sudo ufw status
```

---

## ✅ 验证部署

### 1. 检查服务状态

```bash
# MongoDB
docker ps | grep mongo
# 或
sudo systemctl status mongod

# 后端服务
pm2 status
pm2 logs psych-backend --lines 50

# Nginx
sudo systemctl status nginx
sudo nginx -t
```

### 2. 测试 API 接口

```bash
# 健康检查
curl https://test.fanfancoding.asia/health

# 生成 Token
curl -X POST https://test.fanfancoding.asia/api/admin/generate-token \
  -H "Content-Type: application/json" \
  -d '{"templateId": "perfume_test_v1", "count": 1}'

# 统计数据
curl https://test.fanfancoding.asia/api/admin/stats
```

### 3. 访问前端

浏览器打开：`https://test.fanfancoding.asia`

---

## 🔄 更新部署

创建更新脚本：

```bash
sudo nano /var/www/psychological-counseling/deploy.sh
```

```bash
#!/bin/bash
set -e

echo "========================================="
echo "  开始部署更新..."
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
echo "========================================="
```

```bash
# 添加执行权限
sudo chmod +x /var/www/psychological-counseling/deploy.sh

# 使用方法
sudo /var/www/psychological-counseling/deploy.sh
```

---

## 📊 监控与日志

### 查看日志

```bash
# 后端日志
pm2 logs psych-backend

# Nginx 访问日志
sudo tail -f /var/log/nginx/access.log

# Nginx 错误日志
sudo tail -f /var/log/nginx/error.log

# MongoDB 日志
docker logs psychological-mongo -f
# 或
sudo tail -f /var/log/mongodb/mongod.log
```

### 性能监控

```bash
# PM2 监控面板
pm2 monit

# 系统资源
htop
```

---

## 🔒 安全建议

1. **MongoDB 安全**
   - 启用认证
   - 限制外网访问（仅允许 localhost）
   - 定期备份数据

2. **服务器安全**
   - 禁用 root SSH 登录
   - 使用 SSH 密钥认证
   - 定期更新系统补丁

3. **应用安全**
   - 设置环境变量保护敏感信息
   - 启用 CORS 白名单
   - 添加 API 访问限流

---

## 🗂️ 备份策略

### MongoDB 数据备份

```bash
# 创建备份脚本
sudo nano /var/www/psychological-counseling/backup.sh
```

```bash
#!/bin/bash
BACKUP_DIR="/var/backups/mongodb"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR

# 备份数据库
mongodump --db psychological_test_prod --out $BACKUP_DIR/backup_$DATE

# 压缩备份
tar -czf $BACKUP_DIR/backup_$DATE.tar.gz $BACKUP_DIR/backup_$DATE
rm -rf $BACKUP_DIR/backup_$DATE

# 删除 7 天前的备份
find $BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete

echo "✅ 备份完成: $BACKUP_DIR/backup_$DATE.tar.gz"
```

```bash
# 添加执行权限
sudo chmod +x /var/www/psychological-counseling/backup.sh

# 设置定时任务（每天凌晨 2 点备份）
sudo crontab -e
# 添加：0 2 * * * /var/www/psychological-counseling/backup.sh
```

---

## 🆘 常见问题

### Q: 502 Bad Gateway

**A**: 检查后端服务是否运行：`pm2 status`，查看日志：`pm2 logs`

### Q: MongoDB 连接失败

**A**: 检查 MongoDB 状态：`docker ps` 或 `sudo systemctl status mongod`

### Q: SSL 证书过期

**A**: 手动续期：`sudo certbot renew`

### Q: 磁盘空间不足

**A**: 清理日志和旧备份：

```bash
pm2 flush  # 清理 PM2 日志
sudo journalctl --vacuum-time=7d  # 清理系统日志
```

---

## 📞 技术支持

部署过程中遇到问题，请检查：

1. 服务器防火墙配置
2. DNS 解析是否生效（`nslookup test.fanfancoding.asia`）
3. 各服务日志文件
4. 网络连接状态
