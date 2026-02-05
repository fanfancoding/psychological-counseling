#!/bin/bash

echo "🔧 开始修复 better-sqlite3..."

# 升级到最新版本
echo "📦 升级 better-sqlite3 到最新版本..."
pnpm add better-sqlite3@latest

# 查找 better-sqlite3 版本
SQLITE_VERSION=$(ls node_modules/.pnpm | grep "better-sqlite3@" | head -n 1)

if [ -z "$SQLITE_VERSION" ]; then
    echo "❌ 未找到 better-sqlite3 包"
    exit 1
fi

echo "📍 找到版本: $SQLITE_VERSION"

# 编译原生模块
echo "🔨 编译原生模块..."
cd "node_modules/.pnpm/$SQLITE_VERSION/node_modules/better-sqlite3"
npm run build-release

if [ $? -ne 0 ]; then
    echo "❌ 编译失败,请检查是否安装了 Xcode Command Line Tools"
    echo "💡 运行: xcode-select --install"
    exit 1
fi

# 返回项目根目录
cd ../../../../..

# 创建绑定目录并复制文件
echo "📋 复制绑定文件..."
BINDING_DIR="node_modules/.pnpm/$SQLITE_VERSION/node_modules/better-sqlite3/lib/binding/node-v127-darwin-arm64"
mkdir -p "$BINDING_DIR"
cp "node_modules/.pnpm/$SQLITE_VERSION/node_modules/better-sqlite3/build/Release/better_sqlite3.node" \
   "$BINDING_DIR/better_sqlite3.node"

if [ $? -eq 0 ]; then
    echo "✅ 修复完成!"
    echo "🚀 现在可以运行: pnpm dev"
else
    echo "❌ 复制文件失败"
    exit 1
fi
