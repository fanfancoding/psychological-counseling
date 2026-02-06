# 项目文件总览

本文档提供项目所有重要文件的快速索引和说明。

---

## 📂 文件结构

```
psychological-counseling/
├── 📄 文档文件 (6个)
├── 🔧 脚本文件 (9个)
├── ⚙️ 配置文件 (1个)
├── 📁 client/ (前端项目)
└── 📁 server/ (后端项目)
```

---

## 📄 文档文件

### 核心文档

| 文件名                               | 用途                     | 阅读顺序            |
| ------------------------------------ | ------------------------ | ------------------- |
| [`README.md`](./README.md)           | 项目主文档，快速了解项目 | ⭐ 首先阅读         |
| [`QUICK_START.md`](./QUICK_START.md) | 快速开始指南，常用命令   | ⭐⭐ 开发必读       |
| [`SCRIPTS.md`](./SCRIPTS.md)         | 所有脚本的详细说明       | ⭐⭐ 使用脚本前阅读 |

### 部署文档

| 文件名                                   | 用途               | 适用场景       |
| ---------------------------------------- | ------------------ | -------------- |
| [`ENVIRONMENTS.md`](./ENVIRONMENTS.md)   | 三环境配置详解     | 环境配置和管理 |
| [`SERVER_DEPLOY.md`](./SERVER_DEPLOY.md) | 服务器部署详细步骤 | 首次部署服务器 |
| [`DEPLOYMENT.md`](./DEPLOYMENT.md)       | 通用部署文档       | 参考文档       |

### 子目录文档

| 文件名                     | 位置      | 用途                 |
| -------------------------- | --------- | -------------------- |
| `MONGODB_SETUP.md`         | `server/` | macOS MongoDB 配置   |
| `MONGODB_SETUP_WINDOWS.md` | `server/` | Windows MongoDB 配置 |
| `.env.README.md`           | `server/` | 环境变量说明         |

---

## 🔧 脚本文件

### 本地开发脚本

| 文件名                               | 平台        | 用途             | 使用频率        |
| ------------------------------------ | ----------- | ---------------- | --------------- |
| [`start.sh`](./start.sh)             | macOS/Linux | 启动本地开发环境 | ⭐⭐⭐⭐⭐ 每天 |
| [`start.bat`](./start.bat)           | Windows     | 启动本地开发环境 | ⭐⭐⭐⭐⭐ 每天 |
| [`switch-env.sh`](./switch-env.sh)   | macOS/Linux | 切换环境配置     | ⭐⭐⭐⭐ 经常   |
| [`switch-env.bat`](./switch-env.bat) | Windows     | 切换环境配置     | ⭐⭐⭐⭐ 经常   |

**详细说明**: 参考 [`SCRIPTS.md`](./SCRIPTS.md#本地开发脚本)

### 部署脚本

| 文件名                                         | 运行位置 | 用途                 | 使用频率      |
| ---------------------------------------------- | -------- | -------------------- | ------------- |
| [`deploy-to-server.sh`](./deploy-to-server.sh) | 本地     | 一键部署到生产服务器 | ⭐⭐⭐ 发布时 |
| [`deploy-dev.sh`](./deploy-dev.sh)             | 服务器   | 更新开发环境         | ⭐⭐⭐ 测试时 |
| [`deploy-prod.sh`](./deploy-prod.sh)           | 服务器   | 更新生产环境         | ⭐⭐⭐ 发布时 |
| [`deploy.sh`](./deploy.sh)                     | 服务器   | 通用部署脚本（旧版） | ⭐ 已弃用     |

**详细说明**: 参考 [`SCRIPTS.md`](./SCRIPTS.md#服务器部署脚本)

### 数据库脚本

| 文件名                     | 运行位置 | 用途                | 使用频率  |
| -------------------------- | -------- | ------------------- | --------- |
| [`backup.sh`](./backup.sh) | 服务器   | 备份 MongoDB 数据库 | ⭐⭐ 定期 |

**详细说明**: 参考 [`SCRIPTS.md`](./SCRIPTS.md#数据库管理脚本)

---

## ⚙️ 配置文件

### Docker 配置

| 文件名                                       | 用途             |
| -------------------------------------------- | ---------------- |
| [`docker-compose.yml`](./docker-compose.yml) | MongoDB 容器配置 |

### Nginx 配置

| 文件名                                 | 用途                    |
| -------------------------------------- | ----------------------- |
| [`nginx-prod.conf`](./nginx-prod.conf) | 生产环境 Nginx 配置模板 |

### Git 配置

| 文件名                       | 用途         |
| ---------------------------- | ------------ |
| [`.gitignore`](./.gitignore) | Git 忽略规则 |

---

## 📁 前端项目 (client/)

### 环境配置

| 文件名             | 环境 | API 地址                            |
| ------------------ | ---- | ----------------------------------- |
| `.env.local`       | 本地 | `http://localhost:3000/api`         |
| `.env.development` | 开发 | `https://dev.fanfancoding.asia/api` |
| `.env.production`  | 生产 | `https://www.fanfancoding.asia/api` |
| `.env`             | 当前 | 由脚本自动复制                      |

### 核心文件

| 文件/目录        | 用途                     |
| ---------------- | ------------------------ |
| `package.json`   | 依赖和脚本配置           |
| `vite.config.js` | Vite 构建配置            |
| `src/`           | 源代码目录               |
| `src/views/`     | 页面组件                 |
| `src/stores/`    | Pinia 状态管理           |
| `src/router/`    | 路由配置                 |
| `dist/`          | 构建产物（不提交到 Git） |

---

## 📁 后端项目 (server/)

### 环境配置

| 文件名            | 环境 | 数据库                     | 端口 |
| ----------------- | ---- | -------------------------- | ---- |
| `.env.local`      | 本地 | `psychological_test_local` | 3000 |
| `.env.dev`        | 开发 | `psychological_test_dev`   | 3001 |
| `.env.production` | 生产 | `psychological_test_prod`  | 3000 |
| `.env`            | 当前 | 由脚本自动复制             | -    |

### 核心文件

| 文件/目录          | 用途           |
| ------------------ | -------------- |
| `package.json`     | 依赖和脚本配置 |
| `src/app.js`       | 应用入口       |
| `src/routes/`      | API 路由       |
| `src/services/`    | 业务逻辑       |
| `src/middlewares/` | 中间件         |
| `src/config/`      | 配置文件       |
| `src/data/`        | 测评数据       |

---

## 🗂️ 文件分类索引

### 按用途分类

#### 📖 阅读文档

1. [`README.md`](./README.md) - 项目概览
2. [`QUICK_START.md`](./QUICK_START.md) - 快速开始
3. [`SCRIPTS.md`](./SCRIPTS.md) - 脚本说明

#### 🚀 本地开发

1. [`start.sh`](./start.sh) / [`start.bat`](./start.bat) - 启动服务
2. [`switch-env.sh`](./switch-env.sh) / [`switch-env.bat`](./switch-env.bat) - 切换环境
3. `client/.env.local` - 前端本地配置
4. `server/.env.local` - 后端本地配置

#### 🌐 服务器部署

1. [`ENVIRONMENTS.md`](./ENVIRONMENTS.md) - 环境配置
2. [`SERVER_DEPLOY.md`](./SERVER_DEPLOY.md) - 部署步骤
3. [`deploy-to-server.sh`](./deploy-to-server.sh) - 一键部署
4. [`nginx-prod.conf`](./nginx-prod.conf) - Nginx 配置

#### 🔧 服务器管理

1. [`deploy-dev.sh`](./deploy-dev.sh) - 更新开发环境
2. [`deploy-prod.sh`](./deploy-prod.sh) - 更新生产环境
3. [`backup.sh`](./backup.sh) - 数据库备份

---

## 📊 文件使用流程

### 新手入门流程

```
1. 阅读 README.md
   ↓
2. 阅读 QUICK_START.md
   ↓
3. 运行 start.sh
   ↓
4. 开始开发
```

### 部署流程

```
1. 阅读 ENVIRONMENTS.md
   ↓
2. 阅读 SERVER_DEPLOY.md
   ↓
3. 配置服务器环境
   ↓
4. 运行 deploy-to-server.sh
   ↓
5. 配置 Nginx 和 SSL
```

### 日常开发流程

```
1. 运行 start.sh 启动服务
   ↓
2. 需要切换环境？
   ├─ 是 → 运行 switch-env.sh
   └─ 否 → 继续开发
   ↓
3. 提交代码
   ↓
4. 部署到服务器
```

---

## 🔍 快速查找

### 我想...

- **启动本地开发** → 运行 [`start.sh`](./start.sh) 或 [`start.bat`](./start.bat)
- **切换环境** → 运行 [`switch-env.sh`](./switch-env.sh) 或 [`switch-env.bat`](./switch-env.bat)
- **了解脚本用法** → 阅读 [`SCRIPTS.md`](./SCRIPTS.md)
- **部署到服务器** → 阅读 [`SERVER_DEPLOY.md`](./SERVER_DEPLOY.md)，运行 [`deploy-to-server.sh`](./deploy-to-server.sh)
- **配置环境** → 阅读 [`ENVIRONMENTS.md`](./ENVIRONMENTS.md)
- **备份数据库** → 运行 [`backup.sh`](./backup.sh)（在服务器上）

---

## 📝 文件维护

### 添加新文件

1. 创建文件
2. 更新本文档
3. 更新 `.gitignore`（如需要）
4. 提交到 Git

### 删除文件

1. 删除文件
2. 更新本文档
3. 更新相关文档中的引用
4. 提交到 Git

---

## ✅ 文件检查清单

### 必需文件

- [x] README.md
- [x] QUICK_START.md
- [x] SCRIPTS.md
- [x] start.sh / start.bat
- [x] switch-env.sh / switch-env.bat
- [x] docker-compose.yml
- [x] client/.env.local
- [x] server/.env.local

### 部署文件

- [x] ENVIRONMENTS.md
- [x] SERVER_DEPLOY.md
- [x] deploy-to-server.sh
- [x] nginx-prod.conf

### 可选文件

- [x] backup.sh
- [x] deploy-dev.sh
- [x] deploy-prod.sh

---

**最后更新**: 2026-02-05  
**文件总数**:

- 文档: 6 个
- 脚本: 9 个
- 配置: 1 个
