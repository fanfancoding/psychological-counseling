<template>
  <div class="question-page">
    <!-- 顶部进度条 -->
    <div class="progress-bar">
      <div class="progress-fill" :style="{ width: progressPercent + '%' }"></div>
    </div>

    <div class="container">
      <!-- 头部 -->
      <div class="header">
        <div class="question-number">{{ currentIndex + 1 }} / {{ totalQuestions }}</div>
        <h1 class="template-title">{{ template?.title }}</h1>
      </div>

      <!-- 问题卡片 -->
      <div class="question-card" v-if="currentQuestion">
        <h2 class="question-text">{{ currentQuestion.question }}</h2>

        <div class="options-container">
          <button v-for="option in currentQuestion.options" :key="option.key" class="option-button"
            :class="{ selected: isSelected(option.key) }" @click="selectOption(option.key)">
            <span class="option-icon">{{ option.icon }}</span>
            <span class="option-text">{{ option.text }}</span>
            <span class="check-icon" v-if="isSelected(option.key)">✓</span>
          </button>
        </div>
      </div>

      <!-- 底部按钮 -->
      <div class="bottom-actions">
        <button class="action-btn secondary" @click="previous" :disabled="currentIndex === 0">
          上一题
        </button>

        <button class="action-btn primary" @click="next" :disabled="!currentAnswer">
          {{ isLastQuestion ? '查看结果' : '下一题' }}
        </button>
      </div>
    </div>

    <!-- 提交确认弹窗 -->
    <div class="modal-overlay" v-if="showSubmitModal" @click="showSubmitModal = false">
      <div class="modal-content" @click.stop>
        <h3>确认提交？</h3>
        <p>您已完成所有{{ totalQuestions }}道题目</p>
        <p class="hint">提交后将无法修改答案</p>
        <div class="modal-actions">
          <button class="modal-btn cancel" @click="showSubmitModal = false">取消</button>
          <button class="modal-btn confirm" @click="submitAnswers" :disabled="submitting">
            {{ submitting ? '提交中...' : '确认提交' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useTestStore } from '../stores/testStore'
import { submitAnswer } from '../api'

const router = useRouter()
const store = useTestStore()

const showSubmitModal = ref(false)
const submitting = ref(false)

const template = computed(() => store.template)
const currentQuestion = computed(() => store.currentQuestion)
const currentIndex = computed(() => store.currentQuestionIndex)
const totalQuestions = computed(() => template.value?.totalQuestions || 0)
const progressPercent = computed(() => store.progress)
const isLastQuestion = computed(() => store.isLastQuestion)

const currentAnswer = computed(() => {
  if (!currentQuestion.value) return null
  const answer = store.answers.find(a => a.questionId === currentQuestion.value.id)
  return answer?.selectedKey
})

onMounted(() => {
  if (!store.template) {
    router.push('/error')
  }
})

function isSelected (key) {
  return currentAnswer.value === key
}

function selectOption (key) {
  store.selectAnswer(currentQuestion.value.id, key)
}

function previous () {
  if (currentIndex.value > 0) {
    store.previousQuestion()
  }
}

function next () {
  if (!currentAnswer.value) return

  if (isLastQuestion.value) {
    showSubmitModal.value = true
  } else {
    store.nextQuestion()
  }
}

async function submitAnswers () {
  submitting.value = true
  try {
    const res = await submitAnswer(store.token, store.answers)
    store.setResult(res?.result)
    router.push('/result')
  } catch (error) {
    alert('提交失败: ' + error.message)
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
.question-page {
  height: 100vh;
  background-color: #F9F5F1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-sizing: border-box;
}

/* 顶部进度条容器 */
.progress-bar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background: rgba(139, 94, 60, 0.1);
  z-index: 100;
}

.progress-fill {
  height: 100%;
  background: #D4A373;
  /* 暖色调进度条 */
  transition: width 0.3s ease;
  border-radius: 0 2px 2px 0;
}

.container {
  max-width: 600px;
  width: 100%;
  margin: 0 auto;
  padding: 20px 20px 80px;
  flex: 1;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  overflow: hidden;
}

/* 问题卡片 - 对应图中白色区域 */
.question-card {
  background: white;
  border-radius: 20px;
  padding: 40px 30px;
  box-shadow: 0 4px 20px rgba(139, 94, 60, 0.05);
  /* 暖色阴影 */
  border: 1px solid rgba(255, 255, 255, 0.8);
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  overflow-y: auto;
}

/* 头部信息 Question 1/30 */
.header {
  margin-bottom: 20px;
  /* border-bottom: 1px solid #F0E6D8;  移除分割线，减少视觉阻断 */
  /* padding-bottom: 20px; */
  position: absolute;
  /* 将进度挪到卡片左上角之外或内部，这里先保持在外部但做调整 */
  top: 30px;
  /* 调整位置 */
  left: 0;
  right: 0;
  z-index: 10;
  pointer-events: none;
}

.question-number {
  color: #9C8975;
  /* 浅棕灰色 */
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 1px;
  opacity: 0.8;
  text-align: center;
  /* 居中显示 */
}

.template-title {
  display: none;
  /* 图中未显示标题，暂时隐藏或移除非必要元素 */
}

/* 问题文本 */
.question-text {
  font-family: "Songti SC", "SimSun", "STSong", serif;
  /* 宋体/衬线体 */
  font-size: 26px;
  /* 稍微加大字号 */
  color: #4A3B32;
  /* 深棕色 */
  line-height: 1.5;
  text-align: center;
  margin: 0 0 40px;
  /* 调整间距 */
  font-weight: 600;
  position: relative;
  padding: 0 20px;
}

/* 装饰性引号 */
.question-text::before,
.question-text::after {
  content: '"';
  font-family: serif;
  font-size: 60px;
  color: #E6D8C8;
  /* 浅色装饰 */
  position: absolute;
  opacity: 0.5;
  line-height: 0;
}

.question-text::before {
  top: 10px;
  left: -10px;
}

.question-text::after {
  bottom: 0;
  right: -10px;
  transform: rotate(180deg);
}

.options-container {
  display: grid;
  gap: 16px;
  margin-top: 20px;
  /* 固定间距，不再推到底部 */
  width: 100%;
}

/* 选项按钮 */
.option-button {
  position: relative;
  display: flex;
  align-items: center;
  padding: 18px 24px;
  background: transparent;
  border: 1px solid #E6D8C8;
  /* 浅米色边框 */
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: left;
  outline: none;
  /* 移除焦点边框 */
  -webkit-tap-highlight-color: transparent;
  /* 移除移动端点击高亮 */
}

.option-button:focus {
  outline: none;
  /* 确保获取焦点时无边框 */
}

.option-button:hover {
  background: #FAF5F0;
  border-color: #D4A373;
}

.option-button.selected {
  background: #FAF5F0;
  border-color: #D4A373;
  box-shadow: 0 0 0 1px #D4A373 inset;
}

.option-icon {
  display: none;
  /* 图中似乎没有图标，如果需要可以开启 */
}

.option-text {
  flex: 1;
  font-size: 16px;
  color: #5C4E42;
  line-height: 1.5;
  text-align: center;
  /* 图中选项文字似乎是居中的，如果不居中可改为 left */
}

/* 选中对勾 */
.check-icon {
  position: absolute;
  right: 15px;
  color: #D4A373;
  font-weight: bold;
}

/* 底部操作栏 */
.bottom-actions {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: white;
  /* 或者 #F9F5F1 */
  padding: 15px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.02);
  z-index: 90;
}

.action-btn {
  padding: 12px 30px;
  border: none;
  border-radius: 25px;
  /* 圆角按钮 */
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  -webkit-tap-highlight-color: transparent;
}

.action-btn.primary {
  background: #D4A373;
  color: white;
  box-shadow: 0 4px 12px rgba(212, 163, 115, 0.3);
}

.action-btn.primary:hover:not(:disabled) {
  background: #C69260;
  transform: translateY(-1px);
}

.action-btn.primary:disabled {
  background: #E6D8C8;
  box-shadow: none;
  cursor: not-allowed;
}

.action-btn.secondary {
  background: transparent;
  color: #9C8975;
}

.action-btn.secondary:hover:not(:disabled) {
  color: #8B735B;
  background: rgba(0, 0, 0, 0.02);
}

.action-btn.secondary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* 弹窗样式调整 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(74, 59, 50, 0.4);
  /* 深棕色遮罩 */
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
  animation: fadeIn 0.3s;
}

.modal-content {
  background: #FFFDF9;
  border: 1px solid #E6D8C8;
  border-radius: 20px;
  padding: 40px 30px;
  max-width: 400px;
  width: 100%;
  text-align: center;
  animation: scaleIn 0.3s ease-out;
  box-shadow: 0 10px 40px rgba(74, 59, 50, 0.1);
}

.modal-content h3 {
  font-size: 24px;
  color: #4A3B32;
  margin-bottom: 12px;
  font-family: "Songti SC", serif;
}

.modal-content p {
  color: #8B735B;
  font-size: 16px;
  margin-bottom: 8px;
}

.modal-content .hint {
  font-size: 14px;
  color: #9C8975;
  margin-bottom: 24px;
}

.modal-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.modal-btn {
  padding: 14px 24px;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
}

.modal-btn.cancel {
  background: transparent;
  border: 1px solid #E6D8C8;
  color: #8B735B;
}

.modal-btn.cancel:hover {
  background: #FAF5F0;
}

.modal-btn.confirm {
  background: #D4A373;
  color: white;
}

.modal-btn.confirm:hover:not(:disabled) {
  background: #C69260;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(212, 163, 115, 0.3);
}

.modal-btn.confirm:disabled {
  background: #E6D8C8;
  cursor: not-allowed;
}

/* 响应式 */
@media (max-width: 600px) {
  .question-page {
    padding: 15px;
  }

  .container {
    margin-top: 30px;
  }

  .question-card {
    padding: 30px 20px;
  }

  .question-text {
    font-size: 20px;
  }
}
</style>
