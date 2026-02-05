const tokenService = require("../services/tokenService");

async function validateToken(req, res, next) {
  try {
    const token = req.query.token || req.body.token;

    if (!token) {
      return res.status(400).json({
        code: 400,
        message: "Token不能为空",
      });
    }

    const tokenData = await tokenService.getToken(token);

    if (!tokenData) {
      return res.status(404).json({
        code: 404,
        message: "链接无效或已过期",
      });
    }

    // 将token数据挂载到request对象
    req.tokenData = tokenData;
    next();
  } catch (error) {
    next(error);
  }
}

module.exports = validateToken;
