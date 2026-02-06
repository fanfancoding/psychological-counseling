# 三环境配置与部署指南

心理测评系统的完整环境配置方案，包含本地（Local）、开发（Dev）、生产（Prod）三个环境。

---

## 📋 环境概览

| 环境      | 用途         | 运行位置   | 访问地址                      | 数据库                     | Git 分支  |
| --------- | ------------ | ---------- | ----------------------------- | -------------------------- | --------- |
| **Local** | 本地开发调试 | 开发者本机 | http://localhost:5173         | `psychological_test_local` | 任意      |
| **Dev**   | 团队测试验证 | 测试服务器 | https://dev.fanfancoding.asia | `psychological_test_dev`   | `develop` |
| **Prod**  | 正式生产环境 | 生产服务器 | https://www.fanfancoding.asia | `psychological_test_prod`  | `main`    |

---

## 🚀 快速开始

### Local 环境（本地开发）

```bash
# 1. 克隆项目
git clone https://github.com/fanfancoding/psychological-counseling.git
cd psychological-counseling

# 2. 安装依赖
cd server && pnpm install
cd ../client && pnpm install

# 3. 启动服务（自动使用本地配置）
cd ..
./start.sh  # macOS/Linux
# 或
start.bat   # Windows
```

**访问地址**：

- 前端: http://localhost:5173
- 后端 API: http://localhost:3000/api
- 数据库: `psychological_test_local`

---

## 📁 环境配置文件

### 前端配置文件

```
client/
├── .env.local         # 本地环境（http://localhost:3000/api）
├── .env.development   # 开发环境（https://dev.fanfancoding.asia/api）
└── .env.production    # 生产环境（https://www.fanfancoding.asia/api）
```

### 后端配置文件

```
server/
├── .env.local         # 本地环境（psychological_test_local）
├── .env.dev           # 开发环境（psychological_test_dev）
└── .env.production    # 生产环境（psychological_test_prod）
```

### 当前使用的配置

```
server/.env  # 当前后端使用的配置（由启动脚本自动复制）
client/.env  # 当前前端使用的配置（由启动脚本自动复制）
```

---

## 🔧 本地环境配置

### 前端配置 (`client/.env.local`)

```env
VITE_API_BASE_URL=http://localhost:3000/api
VITE_ENV=local
VITE_DEBUG=true
```

### 后端配置 (`server/.env.local`)

```env
PORT=3000
NODE_ENV=development
DOMAIN=http://localhost:5173
MONGODB_URI=mongodb://localhost:27017/psychological_test_local
LOG_LEVEL=debug
```

### 启动方式

```bash
# 方式一：使用启动脚本（推荐）
./start.sh  # 自动配置环境并启动所有服务

# 方式二：手动启动
# 终端 1
docker-compose up -d

# 终端 2
cd server
cp .env.local .env
pnpm dev

# 终端 3
cd client
cp .env.local .env
pnpm dev
```

---

## 🌐 Dev 环境部署

### 服务器准备

1. **DNS 配置**
   - 添加 A 记录：`dev.fanfancoding.asia` → 服务器 IP

2. **服务器登录**

   ```bash
   ssh user@your-dev-server
   ```

3. **安装必要软件**
   ```bash
   # Node.js, pnpm, MongoDB, Nginx, PM2
   # 参考 DEPLOYMENT.md 中的安装步骤
   ```

### 部署步骤

```bash
# 1. 克隆代码到服务器
cd /var/www
sudo git clone https://github.com/fanfancoding/psychological-counseling.git psych-dev
cd psych-dev

# 2. 切换到开发分支
git checkout develop

# 3. 配置环境
cp server/.env.dev server/.env
cp client/.env.development client/.env

# 4. 安装依赖
cd server && pnpm install
cd ../client && pnpm install

# 5. 构建前端
cd client
pnpm build

# 6. 启动后端（使用 PM2）
cd ../server
pm2 start src/app.js --name psych-dev

# 7. 配置 Nginx
sudo nano /etc/nginx/sites-available/psych-dev
# 粘贴配置（见下文）

sudo ln -s /etc/nginx/sites-available/psych-dev /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

# 8. 配置 SSL
sudo certbot --nginx -d dev.fanfancoding.asia
```

### Nginx 配置

```nginx
# /etc/nginx/sites-available/psych-dev
upstream backend_dev {
    server 127.0.0.1:3001;
}

server {
    listen 80;
    server_name dev.fanfancoding.asia;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name dev.fanfancoding.asia;

    ssl_certificate /etc/letsencrypt/live/dev.fanfancoding.asia/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/dev.fanfancoding.asia/privkey.pem;

    location / {
        root /var/www/psych-dev/client/dist;
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://backend_dev/api/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /health {
        proxy_pass http://backend_dev/health;
    }
}
```

### 更新 Dev 环境

```bash
# 在服务器上执行
cd /var/www/psych-dev
./deploy-dev.sh
```

---

## 🏭 Prod 环境部署

### 服务器准备

1. **DNS 配置**
   - 添加 A 记录：`www.fanfancoding.asia` → 服务器 IP
   - 添加 A 记录：`fanfancoding.asia` → 服务器 IP

2. **服务器登录**
   ```bash
   ssh user@your-prod-server
   ```

### 部署步骤

```bash
# 1. 克隆代码到服务器
cd /var/www
sudo git clone https://github.com/fanfancoding/psychological-counseling.git psych-prod
cd psych-prod

# 2. 切换到主分支
git checkout main

# 3. 配置环境
cp server/.env.production server/.env
cp client/.env.production client/.env

# 4. 安装依赖（生产模式）
cd server && pnpm install --prod
cd ../client && pnpm install

# 5. 构建前端
cd client
pnpm build

# 6. 启动后端（使用 PM2）
cd ../server
pm2 start src/app.js --name psych-prod --env production

# 7. 配置 Nginx
sudo nano /etc/nginx/sites-available/psych-prod
# 粘贴配置（见下文）

sudo ln -s /etc/nginx/sites-available/psych-prod /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

# 8. 配置 SSL
sudo certbot --nginx -d www.fanfancoding.asia -d fanfancoding.asia
```

### Nginx 配置

```nginx
# /etc/nginx/sites-available/psych-prod
upstream backend_prod {
    server 127.0.0.1:3000;
}

server {
    listen 80;
    server_name www.fanfancoding.asia fanfancoding.asia;
    return 301 https://www.fanfancoding.asia$request_uri;
}

server {
    listen 443 ssl http2;
    server_name www.fanfancoding.asia fanfancoding.asia;

    ssl_certificate /etc/letsencrypt/live/www.fanfancoding.asia/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/www.fanfancoding.asia/privkey.pem;

    location / {
        root /var/www/psych-prod/client/dist;
        try_files $uri $uri/ /index.html;

        # 缓存静态资源
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }

    location /api/ {
        proxy_pass http://backend_prod/api/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /health {
        proxy_pass http://backend_prod/health;
    }
}
```

### 更新 Prod 环境

```bash
# 在服务器上执行
cd /var/www/psych-prod
./deploy-prod.sh
```

---

## 🔄 开发工作流

### 1. 本地开发

```bash
# 创建功能分支
git checkout -b feature/new-feature

# 本地开发和测试
./start.sh

# 提交代码
git add .
git commit -m "feat: 添加新功能"
git push origin feature/new-feature
```

### 2. 部署到 Dev 环境

```bash
# 合并到 develop 分支
git checkout develop
git merge feature/new-feature
git push origin develop

# SSH 到 Dev 服务器
ssh user@dev-server
cd /var/www/psych-dev
./deploy-dev.sh
```

### 3. 部署到 Prod 环境

```bash
# 合并到 main 分支
git checkout main
git merge develop
git push origin main

# SSH 到 Prod 服务器
ssh user@prod-server
cd /var/www/psych-prod
./deploy-prod.sh
```

---

## 📊 环境管理

### 查看运行状态

```bash
# 查看 PM2 进程
pm2 list

# 查看日志
pm2 logs psych-dev    # Dev 环境
pm2 logs psych-prod   # Prod 环境

# 查看 Nginx 状态
sudo systemctl status nginx

# 查看 MongoDB 状态
docker ps | grep mongo
```

### 重启服务

```bash
# 重启后端
pm2 restart psych-dev
pm2 restart psych-prod

# 重启 Nginx
sudo systemctl reload nginx

# 重启 MongoDB
docker-compose restart
```

---

## 🗄️ 数据库管理

### 备份数据库

```bash
# Dev 环境备份
mongodump --db psychological_test_dev --out /tmp/dev-backup

# Prod 环境备份
mongodump --db psychological_test_prod --out /tmp/prod-backup
```

### 恢复数据库

```bash
# 恢复到 Dev 环境
mongorestore --db psychological_test_dev /tmp/dev-backup/psychological_test_dev

# 恢复到 Prod 环境（谨慎操作！）
mongorestore --db psychological_test_prod /tmp/prod-backup/psychological_test_prod
```

---

## 🔒 安全建议

1. **环境隔离**
   - 不同环境使用不同的数据库
   - 不同环境使用不同的域名

2. **访问控制**
   - Dev 环境可添加 HTTP Basic Auth
   - Prod 环境启用 HTTPS 强制跳转

3. **密钥管理**
   - 不要将 `.env` 文件提交到 Git
   - 使用环境变量管理敏感信息

---

## 📞 故障排查

### 问题：服务无法启动

```bash
# 检查端口占用
lsof -ti:3000
lsof -ti:3001

# 检查日志
pm2 logs
tail -f /var/log/nginx/error.log
```

### 问题：MongoDB 连接失败

```bash
# 检查 MongoDB 状态
docker ps | grep mongo
sudo systemctl status mongod

# 测试连接
mongosh --eval "db.adminCommand('ping')"
```

### 问题：前端无法访问后端

```bash
# 检查 Nginx 配置
sudo nginx -t

# 检查防火墙
sudo ufw status

# 检查后端健康状态
curl http://localhost:3000/health
```

---

## 📚 相关文档

- [MongoDB 启动指引 (macOS)](./server/MONGODB_SETUP.md)
- [MongoDB 启动指引 (Windows)](./server/MONGODB_SETUP_WINDOWS.md)
- [完整部署文档](./DEPLOYMENT.md)

---

## ✅ 检查清单

### Local 环境

- [ ] MongoDB 正常运行
- [ ] 后端服务启动成功（http://localhost:3000）
- [ ] 前端服务启动成功（http://localhost:5173）
- [ ] API 调用正常

### Dev 环境

- [ ] DNS 解析正确（dev.fanfancoding.asia）
- [ ] SSL 证书配置成功
- [ ] 后端服务运行（PM2）
- [ ] 前端构建完成
- [ ] Nginx 配置正确
- [ ] API 调用正常

### Prod 环境

- [ ] DNS 解析正确（www.fanfancoding.asia）
- [ ] SSL 证书配置成功
- [ ] 后端服务运行（PM2）
- [ ] 前端构建完成（生产模式）
- [ ] Nginx 配置正确
- [ ] 缓存策略配置
- [ ] 数据库备份策略
- [ ] 监控和日志配置
