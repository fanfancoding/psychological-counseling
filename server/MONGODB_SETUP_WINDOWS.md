# MongoDB 启动指引 (Windows)

本文档提供 Windows 平台上启动 MongoDB 的详细步骤。

---

## 方式一：使用 Docker（推荐）⭐

### 1. 安装 Docker Desktop for Windows

访问 [Docker 官网](https://www.docker.com/products/docker-desktop) 下载并安装 Docker Desktop。

**系统要求**：

- Windows 10 64-bit: Pro, Enterprise, or Education (Build 19041 或更高)
- 或 Windows 11 64-bit
- 启用 WSL 2 功能

### 2. 启动 MongoDB

打开 **PowerShell** 或 **命令提示符**，执行：

```powershell
cd C:\path\to\psychological-counseling
docker compose up -d
```

> 💡 **提示**：将 `C:\path\to\psychological-counseling` 替换为您的实际项目路径

### 3. 验证 MongoDB 运行状态

```powershell
docker ps | findstr psychological-mongo
```

**预期输出**：

```
CONTAINER ID   IMAGE              STATUS         PORTS
xxxxx          mongo:7.0-alpine   Up 2 minutes   0.0.0.0:27017->27017/tcp
```

### 4. 停止 MongoDB

```powershell
docker compose down
```

---

## 方式二：本地安装 MongoDB

### 1. 下载 MongoDB Community Edition

访问 [MongoDB 下载页面](https://www.mongodb.com/try/download/community)：

- 选择 **Version**: 7.0.x (Current)
- 选择 **Platform**: Windows x64
- 选择 **Package**: MSI

### 2. 安装 MongoDB

1. 运行下载的 `.msi` 安装程序
2. 选择 **Complete** 安装类型
3. 勾选 **Install MongoDB as a Service**（作为 Windows 服务安装）
4. 勾选 **Install MongoDB Compass**（可选，图形化管理工具）

### 3. 启动 MongoDB 服务

**方法 A：通过 Windows 服务**

1. 按 `Win + R`，输入 `services.msc`
2. 找到 **MongoDB Server**
3. 右键 → **启动**

**方法 B：通过命令行**（以管理员身份运行 PowerShell）

```powershell
net start MongoDB
```

### 4. 验证服务运行

```powershell
mongosh --eval "db.adminCommand('ping')"
```

**预期输出**：

```json
{ "ok": 1 }
```

### 5. 停止 MongoDB 服务

```powershell
net stop MongoDB
```

---

## 启动后端服务

MongoDB 启动后，打开 **PowerShell** 或 **命令提示符**：

```powershell
cd C:\path\to\psychological-counseling\server
pnpm dev
```

**预期输出**：

```
✅ MongoDB 数据库连接成功
📦 数据库: psychological_test

🚀 服务器启动成功
📍 地址: http://localhost:3000
🌍 环境: development

✅ 已预加载 1 个模板
```

---

## 环境变量配置

确保 `server\.env` 文件包含正确的 MongoDB 连接字符串：

```env
# MongoDB 配置
MONGODB_URI=mongodb://localhost:27017/psychological_test
```

> 💡 **提示**：Windows 路径使用反斜杠 `\`，但在代码中使用正斜杠 `/` 或双反斜杠 `\\`

---

## 常见问题

### Q: Docker 提示 "WSL 2 installation is incomplete"

**A**: 需要安装 WSL 2，执行以下命令（以管理员身份运行 PowerShell）：

```powershell
wsl --install
wsl --set-default-version 2
```

然后重启电脑。

### Q: 连接失败 "MongoServerError: connect ECONNREFUSED"

**A**: MongoDB 服务未启动，请按照上述方式启动 MongoDB。

### Q: 端口 27017 被占用

**A**: 修改 `.env` 文件中的 `MONGODB_URI`，使用其他端口：

```env
MONGODB_URI=mongodb://localhost:27018/psychological_test
```

同时修改 `docker-compose.yml` 端口映射为 `27018:27017`。

### Q: PowerShell 提示 "无法加载文件，因为在此系统上禁止运行脚本"

**A**: 以管理员身份运行 PowerShell，执行：

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Q: pnpm 命令未找到

**A**: 安装 pnpm：

```powershell
npm install -g pnpm
```

---

## 使用 MongoDB Compass（图形化工具）

1. 打开 **MongoDB Compass**
2. 连接字符串输入：`mongodb://localhost:27017`
3. 点击 **Connect**
4. 查看 `psychological_test` 数据库和 `tokens` 集合

---

## 团队协作建议

### 推荐使用 Docker 方式

- ✅ 环境一致性：macOS 和 Windows 使用相同的 MongoDB 版本
- ✅ 快速启动：一条命令启动所有服务
- ✅ 数据隔离：不影响系统其他 MongoDB 实例

### 项目启动流程（推荐）

创建一个 `start.bat` 脚本（Windows）：

```batch
@echo off
echo 启动 MongoDB...
docker compose up -d

echo 等待 MongoDB 就绪...
timeout /t 3

echo 启动后端服务...
cd server
start cmd /k pnpm dev

echo 启动前端服务...
cd ..\client
start cmd /k pnpm dev

echo 所有服务已启动！
```

使用方法：双击 `start.bat` 即可启动所有服务。

---

## 数据持久化

Docker 方式的数据存储在：

```
项目根目录\server\data\mongodb
```

本地安装方式的数据存储在：

```
C:\Program Files\MongoDB\Server\7.0\data
```

---

## 技术支持

如遇到问题，请检查：

1. MongoDB 服务是否正常运行
2. 端口 27017 是否被占用
3. `.env` 文件配置是否正确
4. 防火墙是否阻止了 MongoDB 连接
