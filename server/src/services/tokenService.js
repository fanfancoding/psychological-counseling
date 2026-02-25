const { v4: uuidv4 } = require("uuid");
const { getCollection } = require("../config/database");

const SEVEN_DAYS = 7 * 24 * 60 * 60 * 1000; // 7天（毫秒）

class TokenService {
  // 获取 tokens 集合
  getTokensCollection() {
    return getCollection("tokens");
  }

  // 生成Token
  async generateTokens(templateId, count = 1) {
    const tokens = [];
    const now = new Date();
    const expiresAt = new Date(now.getTime() + SEVEN_DAYS);

    const documents = [];
    for (let i = 0; i < count; i++) {
      const token = uuidv4();
      documents.push({
        token,
        templateId,
        status: "unused",
        createdAt: now,
        expiresAt,
        usedAt: null,
        result: null,
      });
      tokens.push(token);
    }

    await this.getTokensCollection().insertMany(documents);
    return tokens;
  }

  // 获取Token详情
  async getToken(token) {
    const tokenData = await this.getTokensCollection().findOne({ token });

    if (!tokenData) {
      return null;
    }

    // 检查是否过期
    const now = new Date();
    if (tokenData.expiresAt < now && tokenData.status !== "expired") {
      // 更新状态为过期
      await this.getTokensCollection().updateOne(
        { _id: tokenData._id },
        { $set: { status: "expired" } },
      );
      tokenData.status = "expired";
    }

    return tokenData;
  }

  // 标记Token为已使用并保存结果
  async markAsUsed(token, result) {
    const now = new Date();
    const updateResult = await this.getTokensCollection().updateOne(
      { token, status: "unused" },
      {
        $set: {
          status: "used",
          usedAt: now,
          result,
        },
      },
    );

    return updateResult.modifiedCount > 0; // 返回是否更新成功
  }

  // 获取统计数据
  async getStats() {
    const collection = this.getTokensCollection();

    const [total, unused, used, expired] = await Promise.all([
      collection.countDocuments(),
      collection.countDocuments({ status: "unused" }),
      collection.countDocuments({ status: "used" }),
      collection.countDocuments({ status: "expired" }),
    ]);

    return {
      total,
      unused,
      used,
      expired,
    };
  }

  // 获取Token列表（支持筛选 + 分页）
  async getTokenList(status = "all", page = 1, pageSize = 20) {
    const collection = this.getTokensCollection();
    const query = status === "all" ? {} : { status };
    const skip = (page - 1) * pageSize;

    const [list, total] = await Promise.all([
      collection
        .find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(pageSize)
        .toArray(),
      collection.countDocuments(query),
    ]);

    return { list, total, page, pageSize };
  }

  // 清理过期Token（定时任务调用）
  async cleanExpiredTokens() {
    const sevenDaysAgo = new Date(Date.now() - SEVEN_DAYS);
    const deleteResult = await this.getTokensCollection().deleteMany({
      createdAt: { $lt: sevenDaysAgo },
    });

    console.log(`🧹 清理了 ${deleteResult.deletedCount} 个过期Token`);
    return deleteResult.deletedCount;
  }
}

module.exports = new TokenService();
