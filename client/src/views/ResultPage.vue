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

          <!-- <div class="share-text">
            {{ result?.shareText }}
          </div> -->
        </div>
      </div>



      <!-- 底部提示 -->
      <div class="footer-hint">
        本测评仅供娱乐参考，不作为专业建议
      </div>

    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useTestStore } from '../stores/testStore'

const router = useRouter()
const store = useTestStore()


const result = computed(() => store.result)

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
  padding: 10px 0 40px;
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



@keyframes fadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
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
