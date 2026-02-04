function errorHandler(err, req, res, next) {
  console.error("❌ 错误:", err);

  // 默认500错误
  const status = err.status || 500;
  const message = err.message || "服务器内部错误";

  res.status(status).json({
    code: status,
    message: message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
}

module.exports = errorHandler;
