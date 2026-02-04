const { v4: uuidv4 } = require("uuid");
const db = require("../config/database");

const SEVEN_DAYS = 7 * 24 * 60 * 60 * 1000; // 7天（毫秒）

class TokenService {
  // 生成Token
  generateTokens(templateId, count = 1) {
    const tokens = [];
    const now = Date.now();
    const expiresAt = now + SEVEN_DAYS;

    const stmt = db.prepare(`
      INSERT INTO tokens (token, template_id, status, created_at, expires_at)
      VALUES (?, ?, 'unused', ?, ?)
    `);

    for (let i = 0; i < count; i++) {
      const token = uuidv4();
      stmt.run(token, templateId, now, expiresAt);
      tokens.push(token);
    }

    return tokens;
  }

  // 获取Token详情
  getToken(token) {
    const stmt = db.prepare(`
      SELECT * FROM tokens WHERE token = ?
    `);
    const tokenData = stmt.get(token);

    if (!tokenData) {
      return null;
    }

    // 检查是否过期
    const now = Date.now();
    if (tokenData.expires_at < now) {
      // 更新状态为过期
      db.prepare(`UPDATE tokens SET status = 'expired' WHERE id = ?`).run(
        tokenData.id,
      );
      return { ...tokenData, status: "expired" };
    }

    // 解析result字段（如果存在）
    if (tokenData.result) {
      try {
        tokenData.result = JSON.parse(tokenData.result);
      } catch (e) {
        tokenData.result = null;
      }
    }

    return tokenData;
  }

  // 标记Token为已使用并保存结果
  markAsUsed(token, result) {
    const now = Date.now();
    const stmt = db.prepare(`
      UPDATE tokens 
      SET status = 'used', used_at = ?, result = ?
      WHERE token = ? AND status = 'unused'
    `);

    const resultJSON = JSON.stringify(result);
    const info = stmt.run(now, resultJSON, token);

    return info.changes > 0; // 返回是否更新成功
  }

  // 获取统计数据
  getStats() {
    const total = db.prepare(`SELECT COUNT(*) as count FROM tokens`).get();
    const unused = db
      .prepare(`SELECT COUNT(*) as count FROM tokens WHERE status = 'unused'`)
      .get();
    const used = db
      .prepare(`SELECT COUNT(*) as count FROM tokens WHERE status = 'used'`)
      .get();
    const expired = db
      .prepare(`SELECT COUNT(*) as count FROM tokens WHERE status = 'expired'`)
      .get();

    return {
      total: total.count,
      unused: unused.count,
      used: used.count,
      expired: expired.count,
    };
  }

  // 清理过期Token（定时任务调用）
  cleanExpiredTokens() {
    const sevenDaysAgo = Date.now() - SEVEN_DAYS;
    const stmt = db.prepare(`
      DELETE FROM tokens WHERE created_at < ?
    `);
    const info = stmt.run(sevenDaysAgo);
    console.log(`🧹 清理了 ${info.changes} 个过期Token`);
    return info.changes;
  }
}

module.exports = new TokenService();
