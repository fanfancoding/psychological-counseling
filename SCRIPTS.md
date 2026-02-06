# 脚本使用说明

本文档详细说明项目中所有脚本的用途、使用方法和注意事项。

---

## 📋 脚本总览

| 脚本名称              | 平台        | 用途                 | 使用频率        |
| --------------------- | ----------- | -------------------- | --------------- |
| `start.sh`            | macOS/Linux | 启动本地开发环境     | ⭐⭐⭐⭐⭐ 每天 |
| `start.bat`           | Windows     | 启动本地开发环境     | ⭐⭐⭐⭐⭐ 每天 |
| `switch-env.sh`       | macOS/Linux | 切换环境配置         | ⭐⭐⭐⭐ 经常   |
| `switch-env.bat`      | Windows     | 切换环境配置         | ⭐⭐⭐⭐ 经常   |
| `deploy-to-server.sh` | macOS/Linux | 一键部署到生产服务器 | ⭐⭐⭐ 发布时   |
| `deploy-dev.sh`       | 服务器      | 更新开发环境         | ⭐⭐⭐ 测试时   |
| `deploy-prod.sh`      | 服务器      | 更新生产环境         | ⭐⭐⭐ 发布时   |
| `backup.sh`           | 服务器      | 备份 MongoDB 数据库  | ⭐⭐ 定期       |

---

## 🚀 本地开发脚本

### 1. start.sh / start.bat

**用途**: 一键启动本地开发环境

**功能**:

- 自动配置本地环境变量
- 启动 MongoDB（Docker）
- 启动后端服务（端口 3000）
- 启动前端服务（端口 5173）

**使用方法**:

```bash
# macOS/Linux
./start.sh

# Windows
start.bat
# 或双击 start.bat 文件
```

**执行流程**:

1. 复制 `.env.local` 到 `.env`（前后端）
2. 启动 Docker Compose（MongoDB）
3. 等待 MongoDB 就绪（3秒）
4. 在新终端窗口启动后端 `pnpm dev`
5. 在新终端窗口启动前端 `pnpm dev`

**输出信息**:

```
========================================
  ✅ 本地环境已启动！
========================================
  前端地址: http://localhost:5173
  后端地址: http://localhost:3000
  数据库: psychological_test_local
========================================
```

**注意事项**:

- 需要先安装 Docker
- 需要先安装 pnpm
- 确保端口 3000 和 5173 未被占用

---

### 2. switch-env.sh / switch-env.bat

**用途**: 交互式切换开发环境

**功能**:

- 快速切换 Local、Dev、Prod 环境
- 自动复制对应的环境配置文件

**使用方法**:

```bash
# macOS/Linux
./switch-env.sh

# Windows
switch-env.bat
# 或双击 switch-env.bat 文件
```

**交互界面**:

```
=========================================
  环境切换工具
=========================================

请选择要切换的环境：
  1) Local   - 本地开发环境
  2) Dev     - 开发测试环境
  3) Prod    - 生产环境

请输入选项 (1-3): _
```

**选项说明**:

| 选项 | 环境  | 前端 API                            | 后端端口 | 数据库                   |
| ---- | ----- | ----------------------------------- | -------- | ------------------------ |
| 1    | Local | `http://localhost:3000/api`         | 3000     | psychological_test_local |
| 2    | Dev   | `https://dev.fanfancoding.asia/api` | 3001     | psychological_test_dev   |
| 3    | Prod  | `https://www.fanfancoding.asia/api` | 3000     | psychological_test_prod  |

**执行操作**:

- 复制 `server/.env.{环境}` → `server/.env`
- 复制 `client/.env.{环境}` → `client/.env`

**使用场景**:

- 本地开发时连接测试环境 API
- 本地调试生产环境问题
- 切换回本地环境

---

## 🌐 服务器部署脚本

### 3. deploy-to-server.sh

**用途**: 一键部署项目到生产服务器

**功能**:

- 打包前端生产环境代码
- 压缩项目文件
- 上传到服务器
- 自动部署和启动服务

**使用方法**:

```bash
./deploy-to-server.sh
```

**前置条件**:

- 已配置 SSH 密钥认证（推荐）
- 服务器已安装 pnpm、PM2、Docker

**执行流程**:

```
[1/6] 打包前端（生产环境）...
  → cd client && pnpm build:prod

[2/6] 压缩项目文件...
  → 创建 psychological-deploy.tar.gz
  → 排除 node_modules, .git, 旧数据

[3/6] 上传到服务器...
  → scp psychological-deploy.tar.gz root@45.76.216.101:/tmp/

[4/6] 在服务器上部署...
  → 创建 /root/psychological 目录
  → 解压文件
  → 配置生产环境变量
  → 安装依赖 (pnpm install --prod)
  → 启动 MongoDB (docker-compose up -d)
  → 启动后端 (pm2 start)

[5/6] Nginx 配置...
  → 提示手动配置（参考文档）

[6/6] 清理临时文件...
  → 删除本地和服务器的压缩包
```

**输出信息**:

```
=========================================
  ✅ 部署完成！
=========================================
  前端: https://www.fanfancoding.asia
  后端: https://www.fanfancoding.asia/api
=========================================

下一步：
1. 配置 Nginx（参考 ENVIRONMENTS.md）
2. 配置 SSL 证书：sudo certbot --nginx -d www.fanfancoding.asia
3. 测试访问：curl https://www.fanfancoding.asia/health
```

**注意事项**:

- 首次部署需要手动配置 Nginx
- 需要配置 SSL 证书
- 确保服务器防火墙开放 80、443 端口

---

### 4. deploy-dev.sh

**用途**: 更新开发测试环境

**运行位置**: 在服务器上执行

**功能**:

- 拉取最新代码
- 配置开发环境变量
- 更新依赖
- 重启服务

**使用方法**:

```bash
# SSH 登录到服务器
ssh root@45.76.216.101

# 执行部署脚本
cd /var/www/psych-dev
./deploy-dev.sh
```

**执行流程**:

```
[1/6] 拉取最新代码...
  → git pull origin develop

[2/6] 配置环境变量...
  → cp server/.env.dev server/.env
  → cp client/.env.development client/.env

[3/6] 更新后端...
  → pnpm install
  → pm2 restart psych-dev

[4/6] 构建前端...
  → pnpm install
  → pnpm build

[5/6] 重启 Nginx...
  → sudo systemctl reload nginx

[6/6] 验证部署...
  → curl https://dev.fanfancoding.asia/health
```

**使用场景**:

- 测试新功能
- 团队协作测试
- 发布前验证

---

### 5. deploy-prod.sh

**用途**: 更新生产环境

**运行位置**: 在服务器上执行

**功能**:

- 拉取主分支代码
- 配置生产环境变量
- 安装生产依赖
- 重启服务

**使用方法**:

```bash
# SSH 登录到服务器
ssh root@45.76.216.101

# 执行部署脚本
cd /var/www/psych-prod
./deploy-prod.sh
```

**执行流程**:

```
[1/6] 拉取最新代码...
  → git pull origin main

[2/6] 配置环境变量...
  → cp server/.env.production server/.env
  → cp client/.env.production client/.env

[3/6] 更新后端...
  → pnpm install --prod  # 仅生产依赖
  → pm2 restart psych-prod

[4/6] 构建前端...
  → pnpm install
  → pnpm build

[5/6] 重启 Nginx...
  → sudo systemctl reload nginx

[6/6] 验证部署...
  → curl https://www.fanfancoding.asia/health
```

**注意事项**:

- ⚠️ 生产环境操作需谨慎
- 建议先在 Dev 环境测试
- 部署前做好数据库备份

---

## 🗄️ 数据库管理脚本

### 6. backup.sh

**用途**: 备份 MongoDB 数据库

**运行位置**: 在服务器上执行

**功能**:

- 导出 MongoDB 数据
- 压缩备份文件
- 自动清理旧备份（保留 7 天）

**使用方法**:

```bash
# 手动执行备份
./backup.sh

# 或设置定时任务（每天凌晨 2 点）
sudo crontab -e
# 添加：0 2 * * * /root/psychological/backup.sh
```

**执行流程**:

```
开始备份 MongoDB 数据库...

1. 导出数据库
  → mongodump --db psychological_test_prod
  → 输出到 /var/backups/mongodb/backup_20260205_020000

2. 压缩备份
  → tar -czf backup_20260205_020000.tar.gz
  → 删除临时目录

3. 清理旧备份
  → 删除 7 天前的备份文件

✅ 备份完成: /var/backups/mongodb/backup_20260205_020000.tar.gz

当前备份列表:
-rw-r--r-- 1 root root 1.2M Feb  5 02:00 backup_20260205_020000.tar.gz
-rw-r--r-- 1 root root 1.1M Feb  4 02:00 backup_20260204_020000.tar.gz
```

**备份策略**:

- 开发环境：每天 1 次，保留 7 天
- 生产环境：每天 2 次（凌晨 2 点、下午 2 点），保留 30 天

**恢复备份**:

```bash
# 解压备份
tar -xzf /var/backups/mongodb/backup_20260205_020000.tar.gz

# 恢复数据库
mongorestore --db psychological_test_prod backup_20260205_020000/psychological_test_prod
```

---

## 📊 脚本使用流程图

### 本地开发流程

```
开始开发
   ↓
运行 start.sh
   ↓
MongoDB + 后端 + 前端 启动
   ↓
开发和调试
   ↓
需要连接测试环境？
   ↓ 是
运行 switch-env.sh → 选择 Dev
   ↓
继续开发
```

### 部署流程

```
本地开发完成
   ↓
提交代码到 Git
   ↓
运行 deploy-to-server.sh
   ↓
自动打包、上传、部署
   ↓
配置 Nginx（首次）
   ↓
配置 SSL（首次）
   ↓
访问测试
   ↓
部署完成
```

### 更新流程

```
代码有更新
   ↓
推送到 Git
   ↓
SSH 登录服务器
   ↓
运行 deploy-dev.sh 或 deploy-prod.sh
   ↓
自动拉取、构建、重启
   ↓
验证功能
   ↓
更新完成
```

---

## 🔧 常见问题

### Q1: start.sh 提示 "MongoDB 启动失败"

**原因**: Docker 未安装或未运行

**解决**:

```bash
# 检查 Docker 状态
docker --version
docker ps

# 启动 Docker Desktop（macOS/Windows）
# 或启动 Docker 服务（Linux）
sudo systemctl start docker
```

### Q2: switch-env.sh 切换后没有生效

**原因**: 需要重启开发服务器

**解决**:

```bash
# 停止当前服务（Ctrl+C）
# 重新运行
./start.sh
```

### Q3: deploy-to-server.sh 提示 "Permission denied"

**原因**: 需要 SSH 密钥认证或输入密码

**解决**:

```bash
# 配置 SSH 密钥
ssh-copy-id root@45.76.216.101

# 或每次输入密码
```

### Q4: 部署脚本执行到一半失败

**原因**: 服务器环境未准备好

**检查清单**:

- [ ] 已安装 Node.js
- [ ] 已安装 pnpm (`npm install -g pnpm`)
- [ ] 已安装 PM2 (`npm install -g pm2`)
- [ ] 已安装 Docker
- [ ] 已安装 Nginx

---

## 📝 脚本维护

### 修改脚本

所有脚本都是纯文本文件，可以直接编辑：

```bash
# 编辑脚本
nano start.sh
# 或
vim start.sh

# 保存后添加执行权限
chmod +x start.sh
```

### 添加新脚本

1. 创建脚本文件
2. 添加执行权限
3. 更新本文档

```bash
# 创建新脚本
touch my-script.sh

# 添加执行权限
chmod +x my-script.sh

# 编辑脚本
nano my-script.sh
```

---

## ✅ 快速参考

### 日常开发

```bash
# 启动开发环境
./start.sh

# 切换环境
./switch-env.sh
```

### 部署发布

```bash
# 部署到生产服务器
./deploy-to-server.sh

# 或在服务器上更新
ssh root@45.76.216.101
cd /var/www/psych-prod
./deploy-prod.sh
```

### 数据库备份

```bash
# 在服务器上执行
./backup.sh
```

---

## 📚 相关文档

- [快速开始指南](./QUICK_START.md)
- [环境配置详解](./ENVIRONMENTS.md)
- [服务器部署指南](./SERVER_DEPLOY.md)

---

**最后更新**: 2026-02-05  
**维护者**: fanfan
