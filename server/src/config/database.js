const Database = require("better-sqlite3");
const path = require("path");

// 创建数据库连接
const dbPath = path.join(__dirname, "../../data/tokens.db");
const db = new Database(dbPath);

// 启用WAL模式（提升并发性能）
db.pragma("journal_mode = WAL");
db.pragma("cache_size = -8000"); // 8MB缓存

// 创建表结构
db.exec(`
  CREATE TABLE IF NOT EXISTS tokens (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    token TEXT UNIQUE NOT NULL,
    template_id TEXT NOT NULL,
    status TEXT DEFAULT 'unused',
    created_at INTEGER NOT NULL,
    expires_at INTEGER NOT NULL,
    used_at INTEGER,
    result TEXT
  );
  
  CREATE INDEX IF NOT EXISTS idx_token ON tokens(token);
  CREATE INDEX IF NOT EXISTS idx_expires_at ON tokens(expires_at);
`);

console.log("✅ SQLite数据库初始化完成");

module.exports = db;
