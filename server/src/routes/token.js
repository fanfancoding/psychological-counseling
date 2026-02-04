const express = require("express");
const router = express.Router();
const tokenService = require("../services/tokenService");

// 批量生成Token
router.post("/generate-token", (req, res) => {
  const { templateId, count = 1 } = req.body;

  if (!templateId) {
    return res.status(400).json({
      code: 400,
      message: "templateId不能为空",
    });
  }

  if (count < 1 || count > 100) {
    return res.status(400).json({
      code: 400,
      message: "生成数量必须在1-100之间",
    });
  }

  const tokens = tokenService.generateTokens(templateId, count);
  const domain = process.env.DOMAIN || "http://localhost:5173";
  const urls = tokens.map((t) => `${domain}/test?token=${t}`);

  res.json({
    code: 200,
    data: {
      tokens: urls,
    },
  });
});

// 获取统计数据
router.get("/stats", (req, res) => {
  const stats = tokenService.getStats();

  res.json({
    code: 200,
    data: stats,
  });
});

// 清理过期Token
router.post("/clean-expired", (req, res) => {
  const count = tokenService.cleanExpiredTokens();

  res.json({
    code: 200,
    data: {
      cleanedCount: count,
    },
  });
});

module.exports = router;
