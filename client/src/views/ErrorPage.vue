<template>
  <div class="error-page">
    <div class="error-container">
      <div class="error-icon">😔</div>
      <h1>链接无效或已过期</h1>
      <p>请确认您的测评链接是否正确</p>
      <p class="hint">温馨提示：测评链接有效期为7天</p>
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
.error-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.error-container {
  text-align: center;
  color: white;
  animation: fadeInUp 0.6s ease-out;
}

.error-icon {
  font-size: 80px;
  margin-bottom: 24px;
  animation: bounce 2s infinite;
}

.error-container h1 {
  font-size: 28px;
  margin-bottom: 16px;
  font-weight: 600;
}

.error-container p {
  font-size: 16px;
  opacity: 0.9;
  margin-bottom: 8px;
}

.hint {
  font-size: 14px !important;
  opacity: 0.7 !important;
  margin-top: 24px;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes bounce {

  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-10px);
  }
}
</style>
