<template>
  <div class="settings">
    <h2 class="section-title">설정</h2>

    <div class="settings-cards">
      <!-- 계정 관리 카드 -->
      <div class="settings-card account-card">
        <h3 class="card-title">계정 관리</h3>
        <p class="card-desc">계정과 관련된 설정을 관리하세요</p>
        <div class="card-actions-row">
          <button class="action-btn primary" @click="showPasswordChange = true">
            <span class="icon-lock"></span> 비밀번호 변경
          </button>
          <button class="action-btn warning" @click="showDeleteConfirm = true">
            <span class="icon-trash"></span> 계정 삭제
          </button>
        </div>
      </div>

      <!-- 알림 설정 카드 -->
      <div class="settings-card notif-card">
        <h3 class="card-title">알림 설정</h3>
        <p class="card-desc">앱 알림을 설정하세요</p>
        <div class="notif-switch-row">
          <span>앱 알림</span>
          <label class="switch">
            <input type="checkbox" v-model="appNotif" />
            <span class="slider"></span>
          </label>
        </div>
      </div>
    </div>

    <!-- 앱 정보 -->
    <div class="appinfo-bar full">
      <div class="appinfo-bar-section">
        <span class="appinfo-label">버전</span>
        <span class="appinfo-value">1.0.0</span>
      </div>
      <div class="appinfo-bar-section">
        <span class="appinfo-label">최종 업데이트</span>
        <span class="appinfo-value">2025년 9월 23일</span>
      </div>
      <div class="appinfo-bar-section appinfo-links">
        <a href="#" class="info-link">이용약관</a>
        <a href="#" class="info-link">개인정보처리방침</a>
      </div>
    </div>

    <!-- 비밀번호 변경 모달 -->
<div v-if="showPasswordChange" class="modal-overlay" @click="showPasswordChange = false">
  <div class="modal-content" @click.stop>
    <div class="modal-header">
      <h3>🔒 비밀번호 변경</h3>
      <button class="close-btn" @click="showPasswordChange = false">×</button>
    </div>
    <div class="modal-body">
      <div class="form-group">
        <label for="currentPassword">현재 비밀번호</label>
        <input
          id="currentPassword"
          type="password"
          v-model="currentPassword"
          class="form-input"
          placeholder="현재 비밀번호 입력"
        />
      </div>
      <div class="form-group">
        <label for="newPassword">새 비밀번호</label>
        <input
          id="newPassword"
          type="password"
          v-model="newPassword"
          class="form-input"
          placeholder="8자 이상, 영문+숫자 포함"
        />
      </div>
      <div class="form-group">
        <label for="confirmPassword">새 비밀번호 확인</label>
        <input
          id="confirmPassword"
          type="password"
          v-model="confirmPassword"
          class="form-input"
          placeholder="새 비밀번호 다시 입력"
        />
      </div>
      <div class="form-actions">
        <button class="btn-cancel" @click="showPasswordChange = false">취소</button>
        <button class="btn-primary" @click="changePassword">변경하기</button>
      </div>
    </div>
  </div>
</div>


    <!-- ✅ 계정 삭제 모달 -->
    <div v-if="showDeleteConfirm" class="modal-overlay" @click="showDeleteConfirm = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>계정 삭제</h3>
          <button class="close-btn" @click="showDeleteConfirm = false">×</button>
        </div>
        <div class="modal-body">
          <div class="warning-content">
            <div class="warning-icon">⚠️</div>
            <h4>정말로 계정을 삭제하시겠습니까?</h4>
            <p>이 작업은 되돌릴 수 없으며, 모든 데이터가 영구적으로 삭제됩니다.</p>
            <ul class="delete-warning-list">
              <li>프로필 정보</li>
              <li>매치 기록</li>
              <li>통계 데이터</li>
              <li>설정 정보</li>
            </ul>
            <div class="form-group">
              <label for="deletePassword">비밀번호 입력</label>
              <input
                id="deletePassword"
                type="password"
                v-model="deletePassword"
                class="form-input"
                placeholder="비밀번호를 입력해주세요"
              />
            </div>
          </div>
          <div class="form-actions">
            <button class="btn-cancel" @click="showDeleteConfirm = false">취소</button>
            <button class="btn-delete" @click="deleteAccount">삭제</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import axios from 'axios'

const appNotif = ref(true)
const showPasswordChange = ref(false)
const showDeleteConfirm = ref(false)

const currentPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const deletePassword = ref('')

const userId = localStorage.getItem('userId') // 로그인한 사용자 ID 필요

// ✅ 비밀번호 변경
const changePassword = async () => {
  if (!currentPassword.value || !newPassword.value || !confirmPassword.value) {
    alert("모든 비밀번호를 입력해주세요.")
    return
  }
  if (newPassword.value !== confirmPassword.value) {
    alert("새 비밀번호가 일치하지 않습니다.")
    return
  }

  try {
    const token = localStorage.getItem('accessToken')
    const res = await axios.put(
      "http://localhost:8080/api/v1/auth/change-password",
      {
        currentPassword: currentPassword.value,
        newPassword: newPassword.value
      },
      { headers: { Authorization: `Bearer ${token}` } }
    )

    alert(res.data.message || "비밀번호가 변경되었습니다.")
    showPasswordChange.value = false
    currentPassword.value = ''
    newPassword.value = ''
    confirmPassword.value = ''

    // 새 토큰 저장 (백엔드가 반환한다면)
    if (res.data.data?.accessToken) {
      localStorage.setItem("accessToken", res.data.data.accessToken)
      localStorage.setItem("refreshToken", res.data.data.refreshToken)
    }
  } catch (err: any) {
    alert(err.response?.data?.message || "비밀번호 변경 실패")
  }
}

const deleteAccount = async () => {
  if (!deletePassword.value) {
    alert("비밀번호를 입력해주세요.")
    return
  }

  try {
    const token = localStorage.getItem('accessToken')
    await axios.put(
      `http://localhost:8080/api/v1/auth/delete-user`,
      { password: deletePassword.value },
      { headers: { Authorization: `Bearer ${token}` } }
    )

    alert("계정이 삭제되었습니다.")
    localStorage.clear()
    window.location.href = "/login"
  } catch (err) {
    console.error(err)
    alert("계정 삭제에 실패했습니다. 비밀번호를 확인하세요.")
  } finally {
    showDeleteConfirm.value = false
    deletePassword.value = ''
  }
}
</script>

<style scoped>
.settings {
  padding: 2rem;
  max-width: 900px;
  margin: 0 auto;
  font-family: 'Noto Sans KR', sans-serif;
}
.section-title {
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  color: #1e293b;
}
.settings-cards {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  justify-content: center;
}
.settings-card {
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.08);
  padding: 2rem;
  flex: 1 1 300px;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
.card-title {
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 0.3rem;
}
.card-desc {
  font-size: 0.9rem;
  margin-bottom: 1rem;
  color: #64748b;
}
.card-actions-row {
  display: flex;
  gap: 1rem;
  margin-top: 1.2rem;
}
.action-btn {
  padding: 0.6rem 1.3rem;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-weight: 600;
  background: #f3f4f6;
  color: #222;
}
.action-btn.primary { background: #1d61e7; color: #fff; }
.action-btn.primary:hover { background: #174bb3; }
.action-btn.warning { background: #ef4444; color: #fff; }
.action-btn.warning:hover { background: #b91c1c; }
.icon-lock::before { content: '🔒'; }
.icon-trash::before { content: '🗑️'; }
.notif-switch-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin-top: 1.1rem;
  font-size: 1rem;
  font-weight: 500;
  color: #222;
}
.switch {
  position: relative;
  display: inline-block;
  width: 44px;
  height: 24px;
}
.switch input { opacity: 0; width: 0; height: 0; }
.slider {
  position: absolute;
  cursor: pointer;
  top: 0; left: 0; right: 0; bottom: 0;
  background-color: #e5e7eb;
  border-radius: 24px;
  transition: .3s;
}
.slider:before {
  position: absolute;
  content: "";
  height: 18px;
  width: 18px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  border-radius: 50%;
  transition: .3s;
}
.switch input:checked + .slider { background-color: #1d61e7; }
.switch input:checked + .slider:before { transform: translateX(20px); }
.appinfo-bar {
  width: 100%;
  margin-top: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 2rem;
  background: #f9fafb;
  border-radius: 14px;
  padding: 1rem 1.5rem;
  font-size: 1rem;
}
.appinfo-bar-section {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.appinfo-label { color: #64748b; font-weight: 600; }
.appinfo-value { color: #222; font-weight: 500; }
.appinfo-links { gap: 1rem; }
.info-link { color: #1d61e7; text-decoration: none; }
.modal-overlay {
  position: fixed; top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex; align-items: center; justify-content: center;
  z-index: 1000;
  padding: 1rem;
}
.modal-content {
  background: white;
  border-radius: 12px;
  max-width: 500px;
  width: 100%;
  padding: 1.5rem;
}
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #64748b;
}
.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 1.5rem;
}
.btn-cancel {
  padding: 0.5rem 1.2rem;
  border: 1px solid #e2e8f0;
  background: white;
  color: #64748b;
  border-radius: 6px;
  cursor: pointer;
}
.btn-delete {
  padding: 0.5rem 1.2rem;
  border: none;
  background: #dc2626;
  color: white;
  border-radius: 6px;
  cursor: pointer;
}
.appinfo-bar.full {
  margin-top: 2rem;
  width: 100%;
  display: flex;
  justify-content: space-between;
  background: #f9fafb;
  border-radius: 14px;
  padding: 1rem 2rem;
  box-shadow: 0 2px 12px rgba(0,0,0,0.06);
}

.form-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
}

.form-group label {
  font-size: 0.9rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.3rem;
}

.form-input {
  padding: 0.7rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.95rem;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.form-input:focus {
  border-color: #1d61e7;
  box-shadow: 0 0 0 2px rgba(29, 97, 231, 0.15);
  outline: none;
}

.btn-primary {
  padding: 0.6rem 1.3rem;
  border: none;
  border-radius: 8px;
  background: #1d61e7;
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}
.btn-primary:hover {
  background: #174bb3;
}

</style>
