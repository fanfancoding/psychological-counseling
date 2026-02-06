# 心理测评系统

基于 Vue 3 + Express + MongoDB 的心理测评 H5 应用，支持多环境部署和一键打包。

## ✨ 特性

- 🎯 **单次付费访问** - 通过唯一 Token 控制访问权限
- 📱 **移动端优先** - 响应式设计，完美适配手机端
- 🎨 **香水性格测试** - 基于 MBTI 的趣味性格测评
- 📊 **结果分析** - 详细的性格分析和香水推荐
- 🖼️ **结果分享** - 支持生成图片分享到社交平台
- 🔒 **Token 管理** - 完善的 Token 生成、验证和过期机制
- 🌐 **多环境支持** - Local、Dev、Prod 三环境配置

## 🚀 快速开始

### 环境要求

- Node.js 18+
- pnpm
- Docker（用于 MongoDB）

### 本地开发

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

访问地址：

- 前端: http://localhost:5173
- 后端: http://localhost:3000

### 环境切换

使用环境切换工具：

```bash
./switch-env.sh  # macOS/Linux
# 或
switch-env.bat   # Windows
```

## 📦 项目结构

```
psychological-counseling/
├── client/                 # 前端项目（Vue 3 + Vite）
│   ├── src/
│   │   ├── views/         # 页面组件
│   │   ├── stores/        # Pinia 状态管理
│   │   ├── router/        # 路由配置
│   │   └── assets/        # 静态资源
│   ├── .env.local         # 本地环境配置
│   ├── .env.development   # 开发环境配置
│   └── .env.production    # 生产环境配置
├── server/                # 后端项目（Express + MongoDB）
│   ├── src/
│   │   ├── routes/        # API 路由
│   │   ├── services/      # 业务逻辑
│   │   ├── middlewares/   # 中间件
│   │   ├── config/        # 配置文件
│   │   └── data/          # 测评数据
│   ├── .env.local         # 本地环境配置
│   ├── .env.dev           # 开发环境配置
│   └── .env.production    # 生产环境配置
├── docker-compose.yml     # MongoDB 配置
├── start.sh / start.bat   # 启动脚本
├── switch-env.sh/bat      # 环境切换脚本
├── deploy-to-server.sh    # 服务器部署脚本
└── docs/                  ## 📚 文档

- [快速开始指南](./QUICK_START.md) - 快速上手和常用命令
- [脚本使用说明](./SCRIPTS.md) - 所有脚本的详细说明
- [环境配置详解](./ENVIRONMENTS.md) - 三环境配置和管理
- [服务器部署指南](./SERVER_DEPLOY.md) - 生产环境部署步骤
- [MongoDB 配置 (macOS)](./server/MONGODB_SETUP.md) - macOS 数据库配置
- [MongoDB 配置 (Windows)](./server/MONGODB_SETUP_WINDOWS.md) - Windows 数据库配置
```

## 🌐 环境配置

| 环境      | 前端地址                      | 后端地址                          | 数据库                   | 打包命令           |
| --------- | ----------------------------- | --------------------------------- | ------------------------ | ------------------ |
| **Local** | http://localhost:5173         | http://localhost:3000             | psychological_test_local | `pnpm build:local` |
| **Dev**   | https://dev.fanfancoding.asia | https://dev.fanfancoding.asia/api | psychological_test_dev   | `pnpm build:dev`   |
| **Prod**  | https://www.fanfancoding.asia | https://www.fanfancoding.asia/api | psychological_test_prod  | `pnpm build:prod`  |

## 📦 打包部署

### 打包不同环境

```bash
cd client
   - 确保手机和电脑连接同一 Wi-Fi。
   - 后端 `.env` 文件中的 `DOMAIN` 已配置为本机局域网 IP，以确保生成的二维码/链接在手机上可访问。
```
