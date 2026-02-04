require("dotenv").config();
const express = require("express");
const cors = require("cors");
const compression = require("compression");
const rateLimit = require("express-rate-limit");
const path = require("path");

const templateService = require("./services/templateService");
const errorHandler = require("./middlewares/errorHandler");
const testRoutes = require("./routes/test");
const tokenRoutes = require("./routes/token");

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件
app.use(cors());
app.use(compression()); // gzip压缩
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 静态文件
app.use(express.static(path.join(__dirname, "../public")));

// 限流
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15分钟
  max: 100, // 最多100个请求
  message: "请求过于频繁，请稍后再试",
});
app.use("/api", limiter);

// 路由
app.use("/api", testRoutes);
app.use("/api/admin", tokenRoutes);

// 健康检查
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: Date.now() });
});

// 错误处理
app.use(errorHandler);

// 启动服务
app.listen(PORT, () => {
  console.log(`\n🚀 服务器启动成功`);
  console.log(`📍 地址: http://localhost:${PORT}`);
  console.log(`🌍 环境: ${process.env.NODE_ENV || "development"}`);
  console.log("");

  // 预加载模板
  templateService.preloadTemplates();
});
