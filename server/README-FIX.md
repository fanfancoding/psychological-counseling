# better-sqlite3 启动错误修复指南

## 问题现象

运行 `pnpm dev` 时报错:

```
Error: Could not locate the bindings file.
```

## 快速修复(推荐)

在 `server` 目录下执行:

```bash
bash fix-sqlite.sh
```

然后重新启动:

```bash
pnpm dev
```

## 手动修复步骤

如果脚本执行失败,按以下步骤操作:

### 1. 升级依赖

```bash
pnpm add better-sqlite3@latest
```

### 2. 编译原生模块

```bash
cd node_modules/.pnpm/better-sqlite3@*/node_modules/better-sqlite3
npm run build-release
cd ../../../../..
```

### 3. 复制绑定文件

```bash
mkdir -p node_modules/.pnpm/better-sqlite3@*/node_modules/better-sqlite3/lib/binding/node-v127-darwin-arm64
cp node_modules/.pnpm/better-sqlite3@*/node_modules/better-sqlite3/build/Release/better_sqlite3.node \
   node_modules/.pnpm/better-sqlite3@*/node_modules/better-sqlite3/lib/binding/node-v127-darwin-arm64/
```

### 4. 重启服务

```bash
pnpm dev
```

## 前置条件

macOS 需要安装 Xcode Command Line Tools:

```bash
xcode-select --install
```

## 成功标志

启动后看到:

```
✅ SQLite数据库初始化完成
🚀 服务器启动成功
📍 地址: http://localhost:3000
```

## 原因说明

- `better-sqlite3@9.2.2` 与 Node.js v22+ 不兼容
- pnpm 默认忽略构建脚本,需要手动编译原生模块
- 已升级到 `better-sqlite3@12.6.2` 解决兼容性问题

## 遇到问题?

1. 确认 Node.js 版本: `node -v` (应该是 v22.x)
2. 确认已安装 Xcode Command Line Tools
3. 尝试删除 `node_modules` 后重新安装: `rm -rf node_modules && pnpm install`
