<template>
  <div class="result-page" :style="{ background: pageGradient }">
    <div class="container">
      <!-- 结果卡片（用于生成图片） -->
      <div class="result-card" ref="resultCardRef">
        <div class="result-header" :style="{ background: resultColor }">
          <h1 class="result-type">{{ result?.type }}</h1>
          <div class="result-tags">
            <span v-for="tag in result?.tags" :key="tag" class="tag">{{ tag }}</span>
          </div>
        </div>

        <div class="result-content">
          <p class="result-description">{{ result?.description }}</p>

          <div class="personality-section">
            <h3>性格特质</h3>
            <p>{{ result?.personality }}</p>
          </div>

          <div class="recommendation-section">
            <h3>香水推荐</h3>
            <p class="recommendation-text">{{ result?.recommendation }}</p>
            <div class="perfume-list">
              <div v-for="perfume in result?.perfumeList" :key="perfume" class="perfume-item">
                <span class="perfume-icon">🌸</span>
                <span>{{ perfume }}</span>
              </div>
            </div>
          </div>

          <div class="share-text">
            {{ result?.shareText }}
          </div>
        </div>

        <div class="result-footer">
          <p>长按保存图片，分享给朋友</p>
        </div>
      </div>

      <!-- 操作按钮 -->
      <div class="actions">
        <button class="action-button primary" @click="exportImage" :disabled="exporting">
          <span class="icon">📸</span>
          <span>{{ exporting ? '生成中...' : '保存结果图片' }}</span>
        </button>
      </div>

      <!-- 底部提示 -->
      <div class="footer-hint">
        本测评仅供娱乐参考，不作为专业建议
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useTestStore } from '../stores/testStore'
import html2canvas from 'html2canvas'

const router = useRouter()
const store = useTestStore()

const resultCardRef = ref(null)
const exporting = ref(false)

const result = computed(() => store.result)

const resultColor = computed(() => {
  return result.value?.color || '#667eea'
})

const pageGradient = computed(() => {
  const color = result.value?.color || '#667eea'
  return `linear-gradient(135deg, ${color}20 0%, ${color}05 100%)`
})

onMounted(() => {
  if (!store.result) {
    router.push('/error')
  }
})

async function exportImage () {
  if (!resultCardRef.value) return

  exporting.value = true

  try {
    const canvas = await html2canvas(resultCardRef.value, {
      backgroundColor: '#ffffff',
      scale: 2,
      useCORS: true,
      logging: false,
      windowWidth: 750,
      windowHeight: resultCardRef.value.scrollHeight
    })

    // 转换为图片并下载
    const dataURL = canvas.toDataURL('image/png')
    const link = document.createElement('a')
    link.download = `我的香水性格-${result.value.type}.png`
    link.href = dataURL
    link.click()

    // 显示成功提示
    alert('✅ 图片已保存到下载文件夹！')
  } catch (error) {
    console.error('图片导出失败:', error)
    alert('❌ 图片生成失败，请重试')
  } finally {
    exporting.value = false
  }
}
</script>

<style scoped>
.result-page {
  min-height: 100vh;
  padding: 40px 20px;
}

.container {
  max-width: 600px;
  margin: 0 auto;
}

.result-card {
  background: white;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
  margin-bottom: 24px;
  animation: scaleIn 0.6s ease-out;
}

.result-header {
  padding: 50px 30px;
  text-align: center;
  color: white;
  position: relative;
  overflow: hidden;
}

.result-header::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0) 100%);
}

.result-type {
  position: relative;
  font-size: 36px;
  font-weight: 700;
  margin-bottom: 16px;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.result-tags {
  position: relative;
  display: flex;
  gap: 8px;
  justify-content: center;
  flex-wrap: wrap;
}

.tag {
  padding: 6px 16px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 20px;
  font-size: 14px;
  backdrop-filter: blur(10px);
}

.result-content {
  padding: 40px 30px;
}

.result-description {
  font-size: 16px;
  line-height: 1.8;
  color: #333;
  margin-bottom: 32px;
  text-align: justify;
}

.personality-section,
.recommendation-section {
  margin-bottom: 32px;
}

.personality-section h3,
.recommendation-section h3 {
  font-size: 18px;
  color: #333;
  margin-bottom: 12px;
  font-weight: 600;
  display: flex;
  align-items: center;
}

.personality-section h3::before {
  content: '✨';
  margin-right: 8px;
}

.recommendation-section h3::before {
  content: '🌸';
  margin-right: 8px;
}

.personality-section p {
  font-size: 15px;
  color: #666;
  line-height: 1.6;
}

.recommendation-text {
  font-size: 15px;
  color: #667eea;
  margin-bottom: 16px;
  font-weight: 500;
}

.perfume-list {
  display: grid;
  gap: 12px;
}

.perfume-item {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  background: #f8f9fa;
  border-radius: 12px;
  font-size: 14px;
  color: #333;
}

.perfume-icon {
  margin-right: 12px;
  font-size: 18px;
}

.share-text {
  text-align: center;
  padding: 24px;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%);
  border-radius: 16px;
  font-size: 16px;
  color: #667eea;
  font-weight: 500;
}

.result-footer {
  padding: 20px;
  text-align: center;
  background: #f8f9fa;
  color: #999;
  font-size: 13px;
}

.actions {
  display: flex;
  gap: 12px;
  justify-content: center;
  animation: fadeInUp 0.6s ease-out 0.3s both;
}

.action-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 16px 32px;
  border: none;
  border-radius: 16px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.action-button.primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
}

.action-button.primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 12px 30px rgba(102, 126, 234, 0.4);
}

.action-button.primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.icon {
  font-size: 20px;
}

.footer-hint {
  text-align: center;
  margin-top: 24px;
  color: #999;
  font-size: 13px;
  animation: fadeIn 0.6s ease-out 0.6s both;
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.95) translateY(20px);
  }

  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

/* 响应式 */
@media (max-width: 768px) {
  .result-page {
    padding: 20px 16px;
  }

  .result-header {
    padding: 40px 24px;
  }

  .result-type {
    font-size: 30px;
  }

  .result-content {
    padding: 32px 24px;
  }

  .result-description {
    font-size: 15px;
  }
}
</style>
