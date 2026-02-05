# MongoDB 启动指引

由于您的系统未安装 Docker，这里提供两种启动 MongoDB 的方式：

## 方式一：安装 Docker（推荐）

### 1. 安装 Docker Desktop for Mac

访问 [Docker 官网](https://www.docker.com/products/docker-desktop) 下载并安装 Docker Desktop。

### 2. 启动 MongoDB

```bash
cd /Users/fanfan/business/psychological-counseling
docker compose up -d
```

### 3. 验证 MongoDB 运行状态

```bash
docker ps | grep psychological-mongo
```

---

## 方式二：使用 Homebrew 安装 MongoDB

### 1. 安装 MongoDB Community Edition

```bash
brew tap mongodb/brew
brew install mongodb-community@7.0
```

### 2. 启动 MongoDB 服务

```bash
brew services start mongodb-community@7.0
```

### 3. 验证服务运行

```bash
mongosh --eval "db.adminCommand('ping')"
```

---

## 启动后端服务

MongoDB 启动后，运行以下命令启动后端：

```bash
cd /Users/fanfan/business/psychological-counseling/server
pnpm dev
```

**预期输出**：

```
✅ MongoDB 数据库连接成功
📦 数据库: psychological_test

🚀 服务器启动成功
📍 地址: http://localhost:3000
🌍 环境: development
```

---

## 常见问题

### Q: 连接失败 "MongoServerError: connect ECONNREFUSED"

**A**: MongoDB 服务未启动，请按照上述方式启动 MongoDB。

### Q: 端口 27017 被占用

**A**: 修改 `.env` 文件中的 `MONGODB_URI`，使用其他端口：

```env
MONGODB_URI=mongodb://localhost:27018/psychological_test
```

同时修改 `docker-compose.yml` 端口映射为 `27018:27017`。

### Q: Docker 命令找不到

**A**: 使用方式二通过 Homebrew 安装 MongoDB。
