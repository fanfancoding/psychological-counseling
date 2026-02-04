function matchResult(answers, resultsConfig) {
  // 统计用户选择的关键词
  const keywordCount = {};
  answers.forEach((answer) => {
    const key = answer.selectedKey;
    keywordCount[key] = (keywordCount[key] || 0) + 1;
  });

  // 计算每个结果的匹配分数
  const scores = resultsConfig.map((result) => {
    const matchCount = result.keywords.reduce((count, keyword) => {
      return count + (keywordCount[keyword] || 0);
    }, 0);

    return {
      result,
      score: matchCount,
      matched: matchCount >= (result.minMatch || 1),
    };
  });

  // 按分数降序排序，返回分数最高且满足最小匹配数的结果
  const matched = scores
    .filter((s) => s.matched)
    .sort((a, b) => b.score - a.score);

  // 如果没有匹配的，返回默认结果（第一个）
  return matched.length > 0 ? matched[0].result : resultsConfig[0];
}

module.exports = { matchResult };
