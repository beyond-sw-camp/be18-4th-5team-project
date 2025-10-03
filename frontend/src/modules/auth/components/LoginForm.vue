<template>
  <form @submit.prevent="onSubmit">
    <input type="text" placeholder="아이디" v-model="loginId" />

    <div class="password-container">
      <input
        :type="showPassword ? 'text' : 'password'"
        placeholder="비밀번호"
        v-model="password"
      />
      <img
        src="@/assets/show_password.png"
        alt="비밀번호 보기"
        class="toggle-password"
        @click="togglePassword"
      />
    </div>

    <div class="forgot-password-container">
      <router-link to="/forgot-password" class="forgot-password">
        Forgot password?
      </router-link>
    </div>

    <button type="submit">로그인</button>

    <div class="or-divider">
      <span class="line"></span>
      <span class="or-text">Or login with</span>
      <span class="line"></span>
    </div>

    <div class="social-login">
      <button type="button" class="social-btn fancy-btn" @click="redirectToKakao">
        <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
          <rect class="border" width="100%" height="100%" />
        </svg>
        <img src="@/assets/KakaoIcon.png" alt="Kakao" class="kakao-icon" />
      </button>
    </div>

    <p class="signup-text">
      Don’t have an account? <router-link to="/signup">Sign up</router-link>
    </p>
  </form>
</template>

<script setup>
import { ref } from "vue"
import { useRouter } from "vue-router"
import api from '@/api/axios'
import { useNotificationStore } from "@/stores/notifications"

const router = useRouter()

const loginId = ref("")
const password = ref("")
const showPassword = ref(false)   

const togglePassword = () => {
  showPassword.value = !showPassword.value
}

const onSubmit = async () => {
  try {
    const res = await api.post("/api/v1/auth/login", {
      loginId: loginId.value,
      password: password.value
    })

    console.log("로그인 성공:", res.data)

    localStorage.setItem("accessToken", res.data.accessToken)
    localStorage.setItem("refreshToken", res.data.refreshToken)
    localStorage.setItem("nickname", res.data.nickname)

    await useNotificationStore().refreshConnectionAfterTokenChange()

    alert("로그인 성공!")
    router.push("/") 
  } catch (err) {
    console.error("로그인 실패:", err.response?.data || err.message)
    alert("로그인 실패: " + (err.response?.data?.message || err.message))
  }
}

const redirectToKakao = () => {
  const clientId = "ce2fb7ac1fb573cfb323ede04caab4d5"
  const redirectUri = "http://localhost:5173/oauth/callback" 
  const kakaoUrl = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}`

  window.location.href = kakaoUrl
}
</script>

<style scoped>
form {
  display: flex;
  flex-direction: column;
  width: 80%;
  max-width: 300px;
}

input {
  margin-bottom: 1rem;
  padding: 0.7rem;
  border: 1px solid #ccc;
  border-radius: 6px;
}

.password-container {
  position: relative;
  display: flex;
  align-items: center;
}
.password-container input {
  flex: 1;
  padding-right: 40px; 
}
.toggle-password {
  position: absolute;
  right: 13px;
  top: 25px;                   
  transform: translateY(-50%);
  width: 16px;
  height: 16px;
  cursor: pointer;
}

button[type="submit"] {
  padding: 0.7rem;
  background-color: #FFA047;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}
button[type="submit"]:hover {
  background-color: #ff8614;
}

.forgot-password-container {
  display: flex;
  justify-content: flex-end;
  margin-top: -0.8rem;
  margin-bottom: 1rem;
}
.forgot-password {
  font-size: 0.9rem;
  color: #ff6600;
  text-decoration: none;
  transition: color 0.2s;
}
.forgot-password:hover {
  color: #FFA047;
  text-decoration: underline;
}

.or-divider {
  display: flex;
  align-items: center;
  margin: 1rem 0 0.5rem 0;
}
.or-divider .line {
  flex: 1;
  height: 1px;
  background: #e0e0e0;
  margin: 5px 10px;
  position: relative;
  top: 0.5em;
}
.or-divider .or-text {
  color: #888;
  font-size: 0.95rem;
  white-space: nowrap;
}

.social-login {
  display: flex;
  justify-content: center;
  margin-top: 1rem;
}

.fancy-btn {
  position: relative;
  width: 300px;   
  height: 40px;
  background: #fff;
  border-radius: 8px;
  cursor: pointer;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0;
}

.kakao-icon {
  width: 24px;
  height: 24px;
  z-index: 1; 
}

.fancy-btn svg {
  position: absolute;
  top: 0;
  left: 0;
}

.fancy-btn .border {
  stroke: #000;
  stroke-width: 1;          
  fill: none;
  rx: 8; ry: 8;             
  stroke-dasharray: 680;    
  stroke-dashoffset: 680;   
  transition: stroke-dashoffset 0.7s ease, stroke-width 0.3s ease;
}

.fancy-btn:hover .border {
  stroke-dashoffset: 0;     
  stroke-width: 2;         
}

.signup-text {
  font-size: 0.9rem;
  color: #444;
}
.signup-text a {
  color: #ff6600;
  font-weight: 600;
}
.signup-text a:hover {
  color: #FFA047;
  text-decoration: underline;
}
</style>
