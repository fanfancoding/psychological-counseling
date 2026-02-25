const express = require("express");
const router = express.Router();
const tokenService = require("../services/tokenService");

// 批量生成Token
router.post("/generate-token", async (req, res) => {
  try {
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

    const tokens = await tokenService.generateTokens(templateId, count);
    const domain = (process.env.DOMAIN || "http://192.168.0.105:5173").replace(
      /\/$/,
      "",
    );
    const urls = tokens.map((t) => `${domain}/test?token=${t}`);

    res.json({
      code: 200,
      data: {
        tokens: urls,
      },
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      message: "生成Token失败",
      error: error.message,
    });
  }
});

// 获取统计数据
router.get("/stats", async (req, res) => {
  try {
    const stats = await tokenService.getStats();

    res.json({
      code: 200,
      data: stats,
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      message: "获取统计数据失败",
      error: error.message,
    });
  }
});

// 查询Token列表（支持按状态筛选 + 分页）
router.get("/tokens", async (req, res) => {
  try {
    const { status = "all", page = 1, pageSize = 20 } = req.query;
    const tokens = await tokenService.getTokenList(
      status,
      parseInt(page),
      parseInt(pageSize),
    );
    res.json({ code: 200, data: tokens });
  } catch (error) {
    res
      .status(500)
      .json({ code: 500, message: "获取Token列表失败", error: error.message });
  }
});

// 清理过期Token
router.post("/clean-expired", async (req, res) => {
  try {
    const count = await tokenService.cleanExpiredTokens();

    res.json({
      code: 200,
      data: {
        cleanedCount: count,
      },
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      message: "清理失败",
      error: error.message,
    });
  }
});

module.exports = router;
