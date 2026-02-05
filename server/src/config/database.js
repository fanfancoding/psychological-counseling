const { MongoClient } = require("mongodb");

// MongoDB 连接配置
const uri =
  process.env.MONGODB_URI || "mongodb://localhost:27017/psychological_test";
const client = new MongoClient(uri);

let db = null;

// 连接数据库
async function connect() {
  try {
    await client.connect();
    db = client.db();

    // 创建集合和索引
    const tokensCollection = db.collection("tokens");

    // 创建索引
    await tokensCollection.createIndex({ token: 1 }, { unique: true });
    await tokensCollection.createIndex({ expiresAt: 1 });
    await tokensCollection.createIndex({ status: 1 });

    console.log("✅ MongoDB 数据库连接成功");
    console.log(`📦 数据库: ${db.databaseName}`);
  } catch (error) {
    console.error("❌ MongoDB 连接失败:", error.message);
    process.exit(1);
  }
}

// 获取数据库实例
function getDb() {
  if (!db) {
    throw new Error("数据库未初始化，请先调用 connect()");
  }
  return db;
}

// 获取集合
function getCollection(name) {
  return getDb().collection(name);
}

// 优雅关闭
async function close() {
  if (client) {
    await client.close();
    console.log("👋 MongoDB 连接已关闭");
  }
}

// 监听进程退出信号
process.on("SIGINT", async () => {
  await close();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  await close();
  process.exit(0);
});

module.exports = {
  connect,
  getDb,
  getCollection,
  close,
};
