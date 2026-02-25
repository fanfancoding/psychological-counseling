<template>
  <div class="validate-page">
    <div class="loading-container">
      <div class="perfume-bottle">
        <div class="bottle-body"></div>
        <div class="bottle-cap"></div>
        <div class="sparkles">
          <span v-for="i in 6" :key="i" class="sparkle"></span>
        </div>
      </div>

      <h2 class="title">{{ statusText }}</h2>
      <p class="subtitle">{{ subtitleText }}</p>

      <div v-if="error" class="error-message">
        {{ error }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTestStore } from '../stores/testStore'
import { validateToken } from '../api'

const route = useRoute()
const router = useRouter()
const store = useTestStore()

const statusText = ref('验证链接中...')
const subtitleText = ref('请稍候')
const error = ref('')

onMounted(async () => {
  const token = route.query.token

  if (!token) {
    error.value = '缺少必要的参数'
    setTimeout(() => {
      router.push('/error')
    }, 2000)
    return
  }

  try {
    store.setToken(token)
    const data = await validateToken(token)

    if (data.status === 'used') {
      // 已完成测评，直接显示结果
      statusText.value = '欢迎回来'
      subtitleText.value = '正在为您加载测评结果...'
      store.setTemplate(data.template)
      store.setResult(data.result)

      setTimeout(() => {
        router.push('/result')
      }, 1500)
    } else if (data.status === 'unused') {
      // 未完成，进入问答
      statusText.value = '验证成功'
      subtitleText.value = '即将开始您的性格探索之旅...'
      store.setTemplate(data.template)

      setTimeout(() => {
        router.push('/question')
      }, 1500)
    } else {
      throw new Error('链接已过期')
    }
  } catch (err) {
    error.value = err.message || '验证失败，请检查链接'
    setTimeout(() => {
      router.push('/error')
    }, 2000)
  }
})
</script>

<style scoped>
.validate-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #F9F5F1;
  /* 暖米色背景,与问题页和结果页一致 */
  padding: 20px;
}

.loading-container {
  text-align: center;
  color: #4A3B32;
  /* 深棕色文字 */
  max-width: 500px;
  background: white;
  border-radius: 20px;
  padding: 60px 40px;
  box-shadow: 0 4px 20px rgba(139, 94, 60, 0.05);
  /* 暖色阴影 */
  border: 1px solid rgba(255, 255, 255, 0.8);
}

.perfume-bottle {
  position: relative;
  width: 100px;
  height: 140px;
  margin: 0 auto 40px;
  animation: float 3s ease-in-out infinite;
}

.bottle-body {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 80px;
  height: 100px;
  background: rgba(212, 163, 115, 0.1);
  /* 暖色调香水瓶身 */
  border: 3px solid rgba(212, 163, 115, 0.3);
  border-radius: 15px;
  backdrop-filter: blur(10px);
}

.bottle-cap {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 40px;
  height: 30px;
  background: rgba(212, 163, 115, 0.2);
  border: 3px solid rgba(212, 163, 115, 0.4);
  border-radius: 8px 8px 0 0;
}

.sparkles {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 120px;
  height: 120px;
}

.sparkle {
  position: absolute;
  width: 6px;
  height: 6px;
  background: #D4A373;
  /* 暖棕色闪光 */
  border-radius: 50%;
  animation: sparkle 2s ease-in-out infinite;
}

.sparkle:nth-child(1) {
  top: 0;
  left: 50%;
  animation-delay: 0s;
}

.sparkle:nth-child(2) {
  top: 25%;
  right: 10%;
  animation-delay: 0.3s;
}

.sparkle:nth-child(3) {
  top: 50%;
  right: 0;
  animation-delay: 0.6s;
}

.sparkle:nth-child(4) {
  bottom: 25%;
  right: 10%;
  animation-delay: 0.9s;
}

.sparkle:nth-child(5) {
  bottom: 0;
  left: 50%;
  animation-delay: 1.2s;
}

.sparkle:nth-child(6) {
  top: 25%;
  left: 10%;
  animation-delay: 1.5s;
}

.title {
  font-family: "Songti SC", "SimSun", "STSong", serif;
  /* 宋体,与问题页一致 */
  font-size: 28px;
  font-weight: 600;
  margin-bottom: 12px;
  color: #4A3B32;
  /* 深棕色 */
  animation: fadeInUp 0.6s ease-out;
}

.subtitle {
  font-size: 16px;
  color: #8B735B;
  /* 中棕色 */
  opacity: 0.9;
  animation: fadeInUp 0.6s ease-out 0.2s both;
}

.error-message {
  margin-top: 20px;
  padding: 12px 24px;
  background: #FAF5F0;
  /* 浅暖色背景 */
  border: 1px solid #E6D8C8;
  border-radius: 12px;
  font-size: 14px;
  color: #C69260;
  /* 错误提示使用较深的暖色 */
  animation: shake 0.5s;
}

@keyframes float {

  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-20px);
  }
}

@keyframes sparkle {

  0%,
  100% {
    opacity: 0;
    transform: scale(0);
  }

  50% {
    opacity: 1;
    transform: scale(1);
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

@keyframes shake {

  0%,
  100% {
    transform: translateX(0);
  }

  25% {
    transform: translateX(-10px);
  }

  75% {
    transform: translateX(10px);
  }
}

/* 响应式 */
@media (max-width: 768px) {
  .loading-container {
    padding: 40px 30px;
  }

  .title {
    font-size: 24px;
  }

  .subtitle {
    font-size: 14px;
  }

  .perfume-bottle {
    width: 80px;
    height: 120px;
  }

  .bottle-body {
    width: 60px;
    height: 80px;
  }
}
</style>
