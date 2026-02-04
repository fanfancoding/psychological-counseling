# 心理测评 H5 项目 (Psychological Test H5)

这是一个基于 Vue 3 + Express 的心理测评 H5 应用，包含前后端完整源码，支持一次性 Token 验证机制。

## 🛠 环境要求

- **Node.js**: `v22.19.0` 或更高版本
- **包管理器**: 推荐使用 [pnpm](https://pnpm.io/) (npm 也可以)

## 🚀 快速开始

### 1. 安装依赖

请分别在 `client` 和 `server` 目录下安装依赖。

```bash
# 安装后端依赖
cd server
pnpm install

# 安装前端依赖
cd ../client
pnpm install
```

### 2. 启动服务

建议开启两个终端窗口，分别启动后端和前端服务。

**后端服务 (Server)**  
运行在 `http://localhost:3000`

```bash
cd server
pnpm dev
```

**前端服务 (Client)**  
运行在 `http://localhost:5173` (支持局域网访问)

```bash
cd client
pnpm dev
```

## 🔐 Token 管理后台

后端服务启动后，可以访问管理页面生成测评链接：

- **访问地址**: [http://localhost:3000/admin.html](http://localhost:3000/admin.html)
- **主要功能**:
  - 生成一次性测评 Token
  - 复制带 Token 的完整访问链接（支持局域网 IP）
  - 查看 Token 使用统计

## ⚠️ 注意事项

1. **端口占用**: 后端服务默认绑定 `3000` 端口。如果启动失败提示端口被占用，请务必先关闭（kill）占用该端口的其他进程。
2. **局域网访问**:
   - 确保手机和电脑连接同一 Wi-Fi。
   - 后端 `.env` 文件中的 `DOMAIN` 已配置为本机局域网 IP，以确保生成的二维码/链接在手机上可访问。
