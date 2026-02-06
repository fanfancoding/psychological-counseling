#!/bin/bash
BACKUP_DIR="/var/backups/mongodb"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR

echo "开始备份 MongoDB 数据库..."

# 备份数据库
mongodump --db psychological_test_prod --out $BACKUP_DIR/backup_$DATE

# 压缩备份
tar -czf $BACKUP_DIR/backup_$DATE.tar.gz $BACKUP_DIR/backup_$DATE
rm -rf $BACKUP_DIR/backup_$DATE

# 删除 7 天前的备份
find $BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete

echo "✅ 备份完成: $BACKUP_DIR/backup_$DATE.tar.gz"

# 显示备份列表
echo ""
echo "当前备份列表:"
ls -lh $BACKUP_DIR/*.tar.gz 2>/dev/null || echo "暂无备份文件"
