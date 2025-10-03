<template>
  <div class="reset-password-page">
    <div class="reset-password-center">
      <img src="@/assets/Key.png" alt="Key Icon" class="key-icon" />
      <h1>새 비밀번호 설정</h1>
      <p>새 비밀번호는 이전에<br>사용했던 비밀번호와 달라야 합니다.</p>

      <form class="reset-form" @submit.prevent="resetPassword">
        <div class="input-group">
          <label for="reset-password">비밀번호</label>
          <input
            id="reset-password"
            v-model="password"
            type="password"
            placeholder="비밀번호를 입력하세요."
            required
          />
        </div>

        <div class="input-group">
          <label for="reset-password-confirm">비밀번호 확인</label>
          <input
            id="reset-password-confirm"
            v-model="confirmPassword"
            type="password"
            placeholder="비밀번호를 다시 입력하세요."
            required
          />
          <div v-if="passwordMismatch">
            <span class="password-mismatch">비밀번호가 일치하지 않습니다.</span>
          </div>
        </div>

        <button type="submit" class="submit-btn">비밀번호 재설정</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue"
import { useRouter, useRoute } from "vue-router"
import api from "@/api/axios"

const router = useRouter()
const route = useRoute()

const password = ref("")
const confirmPassword = ref("")
const email = route.query.email || ""  // ForgotPassword.vue에서 넘겨준 이메일

const passwordMismatch = computed(() => {
  return confirmPassword.value && password.value !== confirmPassword.value
})

async function resetPassword() {
  if (passwordMismatch.value) {
    alert("비밀번호가 일치하지 않습니다.")
    return
  }

  try {
    await api.post("/api/v1/auth/reset-password", {
      email: email,
      newPassword: password.value
    })
    alert("비밀번호가 성공적으로 변경되었습니다! 다시 로그인 해주세요.")
    router.push("/login")
  } catch (err) {
    console.error("❌ 비밀번호 재설정 실패:", err)
    alert("비밀번호 재설정 실패: " + (err.response?.data?.message || err.message))
  }
}
</script>

<style scoped>
.reset-password-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
}
.reset-password-center {
  width: 100%;
  max-width: 600px;
  margin: 0.5rem auto 10rem auto;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.key-icon {
  display: block;
  margin: 0 auto 0rem;
  width: 50px;
  height: 50px;
}
h1 {
  text-align: center;
  margin: 0;
}
p {
  text-align: center;
  color: #8C8C8C;
  margin: 0.75rem 0 1.5rem;
  line-height: 1.4;
  font-size: 12px;
}
.reset-form {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: stretch;
}
.input-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 1.5rem;
}
.input-group label {
  font-size: 0.75rem;
  color: #444;
  margin-bottom: 0.3rem;
  font-weight: 500;
}
.input-group input {
  height: 40px;
  padding: 0 1rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  box-sizing: border-box;
  font-size: 1rem;
}
.password-mismatch {
  color: #e74c3c;
  font-size: 0.92rem;
  margin-top: 0.2rem;
}
.submit-btn {
  align-self: center;
  width: 30%;
  height: 40px;
  margin-top: 0.5rem;
  color: #ffffff;
  background-color: #1D61E7;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 350;
  border: none;
  cursor: pointer;
  transition: background 0.2s;
}
.submit-btn:hover {
  background-color: #5d90f5;
}
</style>
