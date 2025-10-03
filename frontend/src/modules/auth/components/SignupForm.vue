<template>
  <form class="signup-form" @submit.prevent="onSubmit">
   
    <div class="profile-img-edit">
      <div class="profile-img-wrapper">
        <img
          :src="profileImageUrl || defaultProfile"
          class="profile-img-preview"
          alt="프로필 이미지"
        />
        <label class="profile-plus-btn">
          <input type="file" accept="image/*" @change="handleProfileImage" hidden />
          <span>+</span>
        </label>
      </div>
    </div>

    <!-- 이메일 인증 -->
    <div class="input-group">
      <label for="signup-email">이메일</label>
      <div class="row-input">
        <input
          id="signup-email"
          type="email"
          placeholder="이메일을 입력하세요."
          v-model="email"
          required
        />
        <button type="button" @click="sendVerificationCode">인증요청</button>
      </div>
    </div>

    <div class="input-group" v-if="verificationSent">
      <label for="signup-verification">인증번호 입력</label>
      <div class="row-input">
        <input
          id="signup-verification"
          type="text"
          placeholder="인증번호를 입력하세요."
          v-model="verificationCode"
        />
        <button type="button" @click="checkVerificationCode">확인</button>
      </div>
      <span v-if="verificationSuccess" style="color:green;">이메일 인증 완료</span>
      <span v-else-if="verificationError" style="color:red;">인증 실패</span>
    </div>

    <!-- 아이디 -->
    <div class="input-group">
      <label for="signup-username">아이디</label>
      <input
        id="signup-username"
        type="text"
        placeholder="아이디를 입력하세요."
        v-model="username"
        required
      />
      <div v-if="username">
        <span v-if="isUsernameAvailable === true" class="username-available">
          사용 가능한 아이디입니다.
        </span>
        <span v-else-if="isUsernameAvailable === false" class="username-taken">
          이미 사용중인 아이디입니다.
        </span>
      </div>
    </div>

    <!-- 닉네임 -->
    <div class="input-group">
      <label for="signup-nickname">닉네임</label>
      <input
        id="signup-nickname"
        type="text"
        placeholder="닉네임을 입력하세요."
        v-model="nickname"
        required
      />
    </div>

    <!-- 비밀번호 -->
    <div class="input-group">
      <label for="signup-password">비밀번호</label>
      <input
        id="signup-password"
        type="password"
        placeholder="비밀번호를 입력하세요(영문, 숫자 조합 8자 이상)."
        v-model="password"
        @input="validatePassword"
        pattern="[A-Za-z0-9@$!%*?&]*"
        required
      />
      <div v-if="passwordError" class="error-message">
        {{ passwordError }}
      </div>
    </div>

    <!-- 비밀번호 확인 -->
    <div class="input-group">
      <label for="signup-password-confirm">비밀번호 확인</label>
      <input
        id="signup-password-confirm"
        type="password"
        placeholder="비밀번호를 한번 더 입력하세요."
        v-model="passwordConfirm"
        required
      />
      <div v-if="passwordMismatch">
        <span class="password-mismatch">비밀번호가 일치하지 않습니다.</span>
      </div>
    </div>

    <!-- 이름 -->
    <div class="input-group">
      <label for="signup-name">이름</label>
      <input
        id="signup-name"
        type="text"
        placeholder="이름을 입력하세요."
        v-model="name"
        required
      />
    </div>

    <!-- 생년월일 -->
    <div class="input-group">
      <label for="signup-birthdate">생년월일</label>
      <input id="signup-birthdate" type="date" v-model="birthdate" required />
    </div>

    <!-- 성별 -->
    <div class="input-group">
      <label>성별</label>
      <div class="radio-group">
        <label class="radio-option">
          <input type="radio" value="M" v-model="gender" />
          <span class="custom-radio"></span>
          <span class="gender-icon">♂</span> 남자
        </label>
        <label class="radio-option">
          <input type="radio" value="F" v-model="gender" />
          <span class="custom-radio"></span>
          <span class="gender-icon">♀</span> 여자
        </label>
      </div>
    </div>

    <!-- 주소 -->
    <div class="input-group">
      <label for="signup-address">주소</label>
      <input
        id="signup-address"
        type="text"
        placeholder="주소를 입력하세요."
        v-model="address"
        required
      />
    </div>

    <!-- 전화번호 -->
    <div class="input-group">
      <label for="signup-phone">전화번호</label>
      <input
        id="signup-phone"
        type="tel"
        placeholder="전화번호를 입력하세요. (예: 010-1234-5678)"
        v-model="phone"
      />
    </div>

    <button type="submit" class="submit-btn">회원가입</button>

    <p class="login-text">
      이미 계정이 있으신가요?
      <router-link to="/login">로그인</router-link>
    </p>
  </form>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/api/axios'
import defaultProfile from '@/assets/user-icon.png'

const router = useRouter()

// 프로필 이미지 관련
const profileImageUrl = ref('')
const selectedFile = ref(null)
function handleProfileImage(e) {
  const file = e.target.files[0]
  if (!file) return
  selectedFile.value = file
  const reader = new FileReader()
  reader.onload = (ev) => {
    profileImageUrl.value = ev.target.result
  }
  reader.readAsDataURL(file)
}

// 입력 값 상태
const email = ref('')
const username = ref('')
const nickname = ref('')
const password = ref('')
const passwordConfirm = ref('')
const name = ref('')
const birthdate = ref('')
const gender = ref('M')
const address = ref('')
const phone = ref('')

// 비밀번호 검증 관련 (여기에 추가!)
const passwordError = ref('')

const validatePassword = () => {
  const korean = /[ㄱ-ㅎㅏ-ㅣ가-힣]/
  const validPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/
  
  if (korean.test(password.value)) {
    passwordError.value = '비밀번호는 영문으로 입력해주세요 (한/영 키 확인)'
  } else if (!validPattern.test(password.value) && password.value.length > 0) {
    passwordError.value = '영문, 숫자 조합으로 8자 이상 입력해주세요'
  } else {
    passwordError.value = ''
  }
}

// 이메일 인증 관련
const verificationCode = ref('')
const verificationSent = ref(false)
const verificationSuccess = ref(false)
const verificationError = ref(false)

// 아이디 중복 체크
const isUsernameAvailable = ref(null)
let debounceTimer = null
watch(username, (val) => {
  clearTimeout(debounceTimer)
  if (!val) {
    isUsernameAvailable.value = null
    return
  }
  debounceTimer = setTimeout(async () => {
    try {
      const res = await api.get(`/api/v1/auth/check-id`, {
        params: { loginId: val },
      })
      isUsernameAvailable.value = res.data.available
    } catch (err) {
      console.error('아이디 체크 실패:', err)
    }
  }, 500)
})

// 비밀번호 불일치 체크
const passwordMismatch = computed(() => {
  return passwordConfirm.value && password.value !== passwordConfirm.value
})

// 이메일 인증 코드 요청
const sendVerificationCode = async () => {
  if (!email.value) {
    alert('이메일을 입력해주세요.')
    return
  }
  try {
    await api.post('/api/v1/auth/send-email-code', { email: email.value })
    verificationSent.value = true
    verificationSuccess.value = false
    verificationError.value = false
    alert(`인증번호가 ${email.value}로 전송되었습니다.`)
  } catch (err) {
    alert('이메일 인증 요청 실패: ' + (err.response?.data?.message || err.message))
  }
}

// 이메일 인증 확인
const checkVerificationCode = async () => {
  try {
    const res = await api.post('/api/v1/auth/verify-email-code', {
      email: email.value,
      code: verificationCode.value,
    })
    if (res.data.success) {
      verificationSuccess.value = true
      verificationError.value = false
      alert('이메일 인증 성공!')
    } else {
      verificationSuccess.value = false
      verificationError.value = true
      alert('인증번호가 올바르지 않습니다.')
    }
  } catch (err) {
    alert('이메일 인증 확인 실패: ' + (err.response?.data?.message || err.message))
  }
}

// 회원가입 요청
const onSubmit = async () => {
  if (passwordMismatch.value) {
    alert('비밀번호가 일치하지 않습니다.')
    return
  }
  if (isUsernameAvailable.value === false) {
    alert('이미 사용중인 아이디입니다.')
    return
  }
  if (!verificationSuccess.value) {
    alert('이메일 인증을 완료해주세요.')
    return
  }

  try {
    const formData = new FormData()

    const dto = {
      loginId: username.value,
      email: email.value,
      password: password.value,
      nickname: nickname.value,
      name: name.value,
      birthdate: birthdate.value,
      gender: gender.value,
      address: address.value,
      phoneNumber: phone.value,
      dmOption: true,
      status: "ACTIVE"
    }
    formData.append("dto", new Blob([JSON.stringify(dto)], { type: "application/json" }))

    if (selectedFile.value) {
      formData.append("profileImage", selectedFile.value)
    }

    const res = await api.post('/api/v1/auth/signup', formData)

    console.log('회원가입 성공:', res.data)
    alert('회원가입이 완료되었습니다. 로그인 페이지로 이동합니다.')
    router.push('/login')
  } catch (err) {
    console.error('회원가입 실패:', err.response?.data || err.message)
    alert('회원가입 실패: ' + (err.response?.data?.message || err.message))
  }
}
</script>

<style scoped>
.profile-img-edit {
  margin-top: 3.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 1.5rem;
}
.profile-img-wrapper {
  position: relative;
  width: 100px;
  height: 100px;
}
.profile-img-preview {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #e5e7eb;
  background: #f3f4f6;
}
.profile-plus-btn {
  position: absolute;
  right: 0;
  bottom: 0;
  width: 32px;
  height: 32px;
  background: #bfbfbf;
  color: #ffffff;
  border-radius: 50%;
  border: 2px solid #5b5b5b;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 2px 8px 0 rgba(29,97,231,0.13);
  transition: background 0.18s;
  z-index: 2;
}
.profile-plus-btn:hover {
  background: #7b7b7b;
}
.profile-plus-btn input {
  display: none;
}
.username-available {
  color: #1abc1a;
  font-size: 0.92rem;
  margin-top: 0.2rem;
}
.username-taken,
.password-mismatch {
  color: #e74c3c;
  font-size: 0.92rem;
  margin-top: 0.2rem;
}

.signup-form {
  display: flex;
  flex-direction: column;
  width: 80%;
  max-width: 600px;
  margin: 0 auto;
}

input {
  height: 40px;
  padding: 0 1rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  box-sizing: border-box;
  font-size: 1rem;
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

.row-input {
  display: flex;
  gap: 0.5rem;
}
.row-input input {
  flex: 3;
}
.row-input button {
  flex: 1;
  height: 40px;
  border-radius: 6px;
  background-color: #1D61E7;
  color: white;
  border: none;
  cursor: pointer;
}
.row-input button:hover {
  background-color: #5d90f5;
}


.radio-group {
  display: flex;
  gap: 2rem;
  margin-top: 0.5rem;
}

.radio-option {
  position: relative;
  display: flex;
  align-items: center;
  font-size: 1rem;
  cursor: pointer;
  user-select: none;
  font-weight: 500;
}

.radio-option input[type="radio"] {
  display: none; /* 기본 라디오 숨김 */
}

.custom-radio {
  width: 18px;
  height: 18px;
  border: 2px solid #1D61E7;
  border-radius: 50%;
  margin-right: 8px;
  box-sizing: border-box;
  display: inline-block;
  position: relative;
  transition: all 0.2s ease;
}

.radio-option input[type="radio"]:checked + .custom-radio {
  background-color: #1D61E7;
  border-color: #1D61E7;
}

.gender-icon {
  font-size: 1.2rem;
  margin: 0 5px;
}



.submit-btn {
  align-self: center;
  width: 30%;
  height: 44px;
  margin-top: 1rem;
  color: #ffffff;
  background-color: #1D61E7;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 400;
}
.submit-btn:hover {
  background-color: #5d90f5;
}

.login-text {
  margin-top: 1rem;
  font-size: 0.9rem;
  color: #444;
  text-align: center;
}
.login-text a {
  color: #1D61E7;
  font-weight: 600;
  text-decoration: none;
}
.login-text a:hover {
  color: #5d90f5;
  text-decoration: underline;
}
</style>
