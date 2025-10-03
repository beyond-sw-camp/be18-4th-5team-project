<template>
  <div class="login-page">
    <div class="login-box">
      <!-- 왼쪽 이미지 -->
      <div class="login-left">
        <img src="@/assets/LoginPage.png" alt="스포츠 이미지" />
      </div>

      <!-- 오른쪽 로그인 -->
      <div class="login-right">
        <h2 class="title">Log In</h2>

        <LoginForm />
      </div>
    </div>
  </div>
</template>

<script setup>
import LoginForm from '../components/LoginForm.vue';
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(to bottom, #FFA652, #EEA562, #F6EADF);
  font-family: 'Inter', sans-serif;
}

.login-box {
  display: flex;
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 6px 20px rgba(0,0,0,0.1);
  width: 1000px;
  max-width: 95%;
}

.login-left {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}
.login-left img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.login-right {
  flex: 1;
  padding: 3rem 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  text-align: center;
}

.title {
  position: relative;
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 2rem;
  line-height: 1.2;
  color: #222;
}

.title::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translate(-55%, -65%);
  width: 2.2rem;
  height: 2.2rem;
  background: url('@/assets/LoginCircle.png') no-repeat center/contain;
  opacity: 0.9;

  mix-blend-mode: multiply; 
}
</style>
