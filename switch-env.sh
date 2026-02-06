#!/bin/bash

echo "========================================="
echo "  环境切换工具"
echo "========================================="
echo ""
echo "请选择要切换的环境："
echo "  1) Local   - 本地开发环境"
echo "  2) Dev     - 开发测试环境"
echo "  3) Prod    - 生产环境"
echo ""
read -p "请输入选项 (1-3): " choice

case $choice in
  1)
    echo "切换到 Local 环境..."
    cp server/.env.local server/.env
    cp client/.env.local client/.env
    echo "✅ 已切换到 Local 环境"
    echo "   前端: http://localhost:5173"
    echo "   后端: http://localhost:3000"
    ;;
  2)
    echo "切换到 Dev 环境..."
    cp server/.env.dev server/.env
    cp client/.env.development client/.env
    echo "✅ 已切换到 Dev 环境"
    echo "   前端: https://dev.fanfancoding.asia"
    echo "   后端: https://dev.fanfancoding.asia/api"
    ;;
  3)
    echo "切换到 Prod 环境..."
    cp server/.env.production server/.env
    cp client/.env.production client/.env
    echo "✅ 已切换到 Prod 环境"
    echo "   前端: https://www.fanfancoding.asia"
    echo "   后端: https://www.fanfancoding.asia/api"
    ;;
  *)
    echo "❌ 无效选项"
    exit 1
    ;;
esac

echo ""
echo "提示: 运行 'pnpm dev' 启动开发服务器"
