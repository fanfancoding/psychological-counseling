# 快速使用指南

## 🚀 本地开发

### 1. 环境切换

使用环境切换工具快速切换：

```bash
# macOS/Linux
./switch-env.sh

# Windows
switch-env.bat
```

或手动切换：

```bash
# 切换到本地环境
cp server/.env.local server/.env
cp client/.env.local client/.env

# 切换到开发环境
cp server/.env.dev server/.env
cp client/.env.development client/.env

# 切换到生产环境
cp server/.env.production server/.env
cp client/.env.production client/.env
```

### 2. 启动开发服务

```bash
# 使用启动脚本（推荐）
./start.sh  # macOS/Linux
start.bat   # Windows

# 或手动启动
docker-compose up -d  # 启动 MongoDB
cd server && pnpm dev  # 启动后端
cd client && pnpm dev  # 启动前端
```

---

## 📦 打包构建

### 打包不同环境

```bash
cd client

# 本地环境包
pnpm build:local

# 开发环境包
pnpm build:dev

# 生产环境包
pnpm build:prod
```

构建产物在 `client/dist/` 目录。

---

## 🌐 部署到服务器

### 一键部署

```bash
# 确保已配置 SSH 密钥
ssh-copy-id root@45.76.216.101

# 运行部署脚本
./deploy-to-server.sh
```

### 手动部署

参考 [SERVER_DEPLOY.md](./SERVER_DEPLOY.md)

---

## 📋 环境对照表

| 环境      | 前端地址                      | 后端地址                          | 数据库                   | 打包命令           |
| --------- | ----------------------------- | --------------------------------- | ------------------------ | ------------------ |
| **Local** | http://localhost:5173         | http://localhost:3000             | psychological_test_local | `pnpm build:local` |
| **Dev**   | https://dev.fanfancoding.asia | https://dev.fanfancoding.asia/api | psychological_test_dev   | `pnpm build:dev`   |
| **Prod**  | https://www.fanfancoding.asia | https://www.fanfancoding.asia/api | psychological_test_prod  | `pnpm build:prod`  |

---

## 🛠️ 常用命令

### 本地开发

```bash
# 环境切换
./switch-env.sh

# 启动服务
./start.sh

# 查看日志
pm2 logs  # 后端日志（如果使用 PM2）
```

### 打包部署

```bash
# 打包生产环境
cd client && pnpm build:prod

# 部署到服务器
./deploy-to-server.sh
```

### 服务器管理

```bash
# SSH 登录
ssh root@45.76.216.101

# 查看服务状态
pm2 list
pm2 logs psych-prod

# 重启服务
pm2 restart psych-prod
```

---

## 📚 文档索引

- [ENVIRONMENTS.md](./ENVIRONMENTS.md) - 完整的三环境配置指南
- [SERVER_DEPLOY.md](./SERVER_DEPLOY.md) - 服务器部署详细步骤
- [DEPLOYMENT.md](./DEPLOYMENT.md) - 通用部署文档

---

## ✅ 快速检查清单

### 本地开发

- [ ] 已安装 Node.js、pnpm、Docker
- [ ] 已启动 MongoDB (`docker-compose up -d`)
- [ ] 已切换到正确的环境 (`./switch-env.sh`)
- [ ] 已启动前后端服务 (`./start.sh`)

### 服务器部署

- [ ] 已配置 DNS 解析
- [ ] 已配置 SSH 密钥
- [ ] 已安装必要软件（Node.js, pnpm, PM2, Nginx, MongoDB）
- [ ] 已运行部署脚本 (`./deploy-to-server.sh`)
- [ ] 已配置 Nginx
- [ ] 已配置 SSL 证书
- [ ] 已测试访问
