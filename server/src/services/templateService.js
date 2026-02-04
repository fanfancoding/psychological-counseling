const fs = require("fs");
const path = require("path");

// 内存缓存模板
const templateCache = {};

class TemplateService {
  // 加载模板
  loadTemplate(templateId) {
    // 先检查缓存
    if (templateCache[templateId]) {
      return templateCache[templateId];
    }

    // 从文件读取
    const templatePath = path.join(
      __dirname,
      `../../templates/${templateId}.json`,
    );

    if (!fs.existsSync(templatePath)) {
      return null;
    }

    try {
      const content = fs.readFileSync(templatePath, "utf8");
      const template = JSON.parse(content);

      // 存入缓存
      templateCache[templateId] = template;

      return template;
    } catch (error) {
      console.error(`读取模板失败: ${templateId}`, error);
      return null;
    }
  }

  // 预加载所有模板（启动时调用）
  preloadTemplates() {
    const templatesDir = path.join(__dirname, "../../templates");

    if (!fs.existsSync(templatesDir)) {
      console.warn("模板目录不存在");
      return;
    }

    const files = fs.readdirSync(templatesDir);
    const jsonFiles = files.filter((f) => f.endsWith(".json"));

    jsonFiles.forEach((file) => {
      const templateId = file.replace(".json", "");
      this.loadTemplate(templateId);
    });

    console.log(`✅ 已预加载 ${jsonFiles.length} 个模板`);
  }
}

module.exports = new TemplateService();
