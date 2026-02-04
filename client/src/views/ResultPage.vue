<template>
  <div class="result-page">
    <div class="container">
      <!-- 结果卡片（用于生成图片） -->
      <div class="result-card" ref="resultCardRef">
        <div class="result-header">
          <div class="decorative-icon">✨</div>
          <h1 class="result-type">{{ result?.type }}</h1>
          <div class="result-tags">
            <span v-for="tag in result?.tags" :key="tag" class="tag">{{ tag }}</span>
          </div>
        </div>

        <div class="result-content">
          <p class="result-description">{{ result?.description }}</p>

          <div class="section-divider"></div>

          <div class="personality-section">
            <h3>性格特质</h3>
            <p>{{ result?.personality }}</p>
          </div>

          <div class="recommendation-section">
            <h3>香水推荐</h3>
            <p class="recommendation-text">{{ result?.recommendation }}</p>
            <div class="perfume-list">
              <div v-for="perfume in result?.perfumeList" :key="perfume" class="perfume-item">
                <span>{{ perfume }}</span>
              </div>
            </div>
          </div>

          <div class="share-text">
            {{ result?.shareText }}
          </div>
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
      <div class="footer-hint" v-if="!exporting">
        本测评仅供娱乐参考，不作为专业建议
      </div>

      <!-- 自定义 Toast 提示 -->
      <Transition name="fade">
        <div class="toast" v-if="toast.show">
          <span>{{ toast.message }}</span>
        </div>
      </Transition>
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
const toast = ref({ show: false, message: '', type: 'success' })

const result = computed(() => store.result)

onMounted(() => {
  if (!store.result) {
    router.push('/error')
  }
})

function showToastMsg (msg, type = 'success') {
  toast.value = { show: true, message: msg, type }
  setTimeout(() => {
    toast.value.show = false
  }, 3000)
}

async function exportImage () {
  if (!resultCardRef.value) return

  exporting.value = true

  try {
    const canvas = await html2canvas(resultCardRef.value, {
      backgroundColor: '#F9F5F1', // 使用暖色背景，解决“过曝”感
      scale: 3, // 恢复高清晰度，解决文字模糊
      useCORS: true,
      logging: false,
      windowWidth: 700,
    })

    // 转换为图片并下载
    const dataURL = canvas.toDataURL('image/png')
    const link = document.createElement('a')
    link.download = `我的香水性格-${result.value.type}.png`
    link.href = dataURL
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    showToastMsg('图片已保存，请查看相册或下载文件', 'success')
  } catch (error) {
    console.error('图片导出失 败:', error)
    showToastMsg('生成失败，请重试', 'error')
  } finally {
    exporting.value = false
  }
}
</script>

<style scoped>
.result-page {
  min-height: 100vh;
  background-color: #F9F5F1;
  display: flex;
  flex-direction: column;
  padding: 20px;
  box-sizing: border-box;
}

.container {
  max-width: 600px;
  width: 100%;
  margin: 0 auto;
  padding: 20px 0 40px;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.result-card {
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(139, 94, 60, 0.05);
  /* 暖色阴影 */
  border: 1px solid rgba(255, 255, 255, 0.8);
  margin-bottom: 30px;
  animation: scaleIn 0.6s ease-out;
}

.result-header {
  padding: 40px 30px 20px;
  text-align: center;
  /* 去掉原有深色背景，改用暖色文字 */
  background: transparent;
}

.decorative-icon {
  font-size: 32px;
  margin-bottom: 10px;
  opacity: 0.8;
}

.result-type {
  font-family: "Songti SC", "SimSun", "STSong", serif;
  font-size: 32px;
  font-weight: 700;
  color: #4A3B32;
  /* 深棕色 */
  margin-bottom: 20px;
  letter-spacing: 2px;
}

.result-tags {
  display: flex;
  gap: 10px;
  justify-content: center;
  flex-wrap: wrap;
}

.tag {
  padding: 6px 16px;
  background: #FAF5F0;
  border: 1px solid #E6D8C8;
  border-radius: 20px;
  font-size: 14px;
  color: #8B735B;
}

.result-content {
  padding: 20px 30px 40px;
}

.result-description {
  font-size: 16px;
  line-height: 1.8;
  color: #5C4E42;
  margin-bottom: 20px;
  text-align: justify;
  font-weight: 400;
}

.section-divider {
  height: 1px;
  background: #F0E6D8;
  margin: 30px 0;
  width: 100%;
}

.personality-section h3,
.recommendation-section h3 {
  font-size: 18px;
  color: #8B735B;
  margin-bottom: 6px;
  font-weight: 600;
  display: flex;
  align-items: center;
  font-family: "Songti SC", serif;
}

.personality-section p {
  font-size: 15px;
  color: #5C4E42;
  line-height: 1.6;
  margin-bottom: 4px;
}

.recommendation-text {
  font-size: 15px;
  color: #8B735B;
  margin-bottom: 20px;
}

.perfume-list {
  display: grid;
  gap: 12px;
}

.perfume-item {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  background: #FAF5F0;
  border: 1px solid #E6D8C8;
  border-radius: 12px;
  font-size: 14px;
  color: #5C4E42;
}

.perfume-icon {
  margin-right: 12px;
  font-size: 16px;
}

.share-text {
  margin-top: 30px;
  text-align: center;
  padding: 20px;
  background: #FDFBF8;
  border: 1px dashed #D4A373;
  border-radius: 12px;
  font-size: 15px;
  color: #8B735B;
  font-weight: 500;
}

.result-footer {
  padding: 15px;
  text-align: center;
  background: #FAF5F0;
  color: #9C8975;
  font-size: 12px;
  border-top: 1px solid #F0E6D8;
}

.actions {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
  animation: fadeInUp 0.6s ease-out 0.3s both;
}

.action-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 14px 40px;
  border: none;
  border-radius: 25px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  background: #D4A373;
  color: white;
  box-shadow: 0 4px 12px rgba(212, 163, 115, 0.3);
}

.action-button:hover:not(:disabled) {
  background: #C69260;
  transform: translateY(-2px);
}

.action-button:disabled {
  background: #E6D8C8;
  cursor: not-allowed;
}

.footer-hint {
  text-align: center;
  color: #9C8975;
  font-size: 12px;
  opacity: 0.8;
  animation: fadeIn 0.6s ease-out 0.6s both;
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.98) translateY(20px);
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

/* Toast 样式 */
.toast {
  position: fixed;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(74, 59, 50, 0.95);
  color: #FFFDF9;
  padding: 16px 24px;
  border-radius: 16px;
  font-size: 15px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 10px;
  box-shadow: 0 8px 30px rgba(74, 59, 50, 0.25);
  z-index: 2000;
  backdrop-filter: blur(4px);
  min-width: 200px;
  justify-content: center;
}


/* 渐变过渡 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s, transform 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translate(-50%, -40%);
  /* 稍微向下偏移一点 */
}

/* 响应式 */
@media (max-width: 600px) {
  .result-page {
    padding: 15px;
  }

  .result-header {
    padding: 30px 20px 10px;
  }

  .result-type {
    font-size: 28px;
  }

  .result-content {
    padding: 10px 20px 30px;
  }
}
</style>
