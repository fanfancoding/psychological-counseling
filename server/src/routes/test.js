const express = require("express");
const router = express.Router();
const tokenService = require("../services/tokenService");
const templateService = require("../services/templateService");
const { matchResult } = require("../services/resultMatcher");
const validateToken = require("../middlewares/validateToken");

// 验证Token并获取模板
router.get("/validate-token", validateToken, (req, res) => {
  const { tokenData } = req;
  const template = templateService.loadTemplate(tokenData.template_id);

  if (!template) {
    return res.status(404).json({
      code: 404,
      message: "测评模板不存在",
    });
  }

  res.json({
    code: 200,
    data: {
      valid: true,
      status: tokenData.status,
      templateId: tokenData.template_id,
      template: template,
      result: tokenData.result || null,
    },
  });
});

// 提交答案
router.post("/submit-answer", validateToken, (req, res) => {
  const { tokenData } = req;
  const { answers } = req.body;

  // 检查是否已使用
  if (tokenData.status === "used") {
    return res.status(400).json({
      code: 400,
      message: "该测评已完成，不能重复提交",
    });
  }

  // 检查是否过期
  if (tokenData.status === "expired") {
    return res.status(400).json({
      code: 400,
      message: "链接已过期",
    });
  }

  // 加载模板
  const template = templateService.loadTemplate(tokenData.template_id);
  if (!template) {
    return res.status(404).json({
      code: 404,
      message: "测评模板不存在",
    });
  }

  // 匹配结果
  const result = matchResult(answers, template.results);

  // 标记为已使用并保存结果
  const success = tokenService.markAsUsed(tokenData.token, result);

  if (!success) {
    return res.status(500).json({
      code: 500,
      message: "保存结果失败",
    });
  }

  res.json({
    code: 200,
    data: {
      result: result,
    },
  });
});

module.exports = router;
