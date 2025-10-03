<!-- HeaderComponent.vue -->
<template>
  <header class="header">
    <nav class="nav">
      <!-- 왼쪽: 로고 -->
      <div class="nav-left">
        <router-link to="/" class="logo-link">
          <img src="@/assets/logoTransparent.png" alt="메인 로고" class="logo" />
        </router-link>
      </div>

      <!-- 가운데: 탭 -->
      <div class="nav-center">
        <!-- Match 탭 -->
        <router-link :to="{name: 'matchApplication/add'}" class="tab">Quick Match</router-link>

        <!-- Match List 탭 -->
        <div class="tab dropdown-parent">
          <router-link to="/" class="tab-link">My Match List</router-link>
          <div class="dropdown">
            <router-link :to="{name: 'matches'}">매칭 대기</router-link>
            <router-link :to="{name: 'completedMatches'}">성사된 매칭</router-link>
            <router-link :to="{name: 'matchApplications'}">매칭 신청 이력</router-link>
          </div>
        </div>

        <!-- Community 탭 -->
        <div class="tab dropdown-parent">
          <router-link to="/" class="tab-link">Community</router-link>
          <div class="dropdown">
            <router-link :to="{name: 'posts'}">게시판</router-link>
            <router-link to="/friends/list">친구</router-link>
          </div>
        </div>
      </div>

      <!-- 오른쪽: 로그인 상태별 -->
      <div class="nav-right">
        <!-- 알림 아이콘 -->
        <router-link v-if="isLogin" to="/notification" class="icon-btn" title="알림">
          <i class="mdi mdi-bell-outline"></i>
          <span v-if="bootstrapped" class="badge">{{ unreadCount }}</span>
        </router-link>

        <!-- 채팅 아이콘 -->
        <router-link v-if="isLogin" to="/chatrooms/list" class="icon-btn" title="MYCHATPAGE">
          <i class="mdi mdi-send-outline"></i>
        </router-link>

        <!-- 마이페이지 + 닉네임 + 로그아웃 -->
        <div v-if="isLogin" class="mypage-hover-area">
          <span class="nickname">{{ nickname }}</span>
          <router-link to="/mypage" class="icon-btn" title="마이페이지">
            <i class="mdi mdi-account-circle-outline"></i>
          </router-link>
          <button class="text-btn logout logout-hover-btn" @click="doLogout">
            로그아웃
          </button>
        </div>

        <!-- 비로그인 상태 -->
        <template v-else>
          <router-link to="/Signup" class="text-btn">회원가입</router-link>
          <router-link to="/Login" class="text-btn">로그인</router-link>
        </template>
      </div>
    </nav>
  </header>
</template>

<script setup>
import api from "@/api/axios"
import { useNotificationStore } from "@/stores/notifications"
import { storeToRefs } from "pinia"
import { onMounted, ref } from "vue"
import { useRouter } from "vue-router"

const router = useRouter()
const notif = useNotificationStore()
const { unreadCount, bootstrapped } = storeToRefs(notif)

const isLogin = ref(false)
const nickname = ref("")

onMounted(() => {
  const token = localStorage.getItem("accessToken")
  if (token) {
    isLogin.value = true
    nickname.value = localStorage.getItem("nickname") || ""
  }
})

async function doLogout() {
  try {
    await api.post("/api/v1/auth/logout") // 쿠키도 서버에서 만료됨

    localStorage.removeItem("accessToken")
    localStorage.removeItem("refreshToken")
    localStorage.removeItem("nickname") 
    useNotificationStore().resetState()

    isLogin.value = false
    nickname.value = ""

    alert("로그아웃 되었습니다.")
    router.push("/")
  } catch (err) {
    console.error("로그아웃 실패:", err.response?.data || err.message)
    alert("로그아웃 실패: " + (err.response?.data?.message || err.message))
  }
}
</script>

<style scoped>
/* ===== 공통 레이아웃 ===== */
.header {
  background: #fff;
  border-bottom: 1px solid #e9e9e9;
}
.nav {
  height: 64px;
  display: flex;
  align-items: center;
  padding: 0 20px;
  justify-content: space-between;
}
.nav-left,
.nav-right {
  display: flex;
  align-items: center;
  gap: 18px;
}
.nav-center {
  display: flex;
  align-items: center;
  gap: 50px;
  position: relative;
}

/* ===== 로고 ===== */
.logo-link {
  display: inline-flex;
  align-items: center;
}
.logo {
  width: 60px;
  height: 60px;
  object-fit: contain;
}

/* ===== 탭 메뉴 ===== */
.tab-link,
.tab {
  font-weight: 700;
  color: #111;
  text-decoration: none;
  padding: 8px 14px;
  position: relative;
}
.tab-link:hover,
.tab:hover {
  color: #000;
}

/* ===== 드롭다운 ===== */
.dropdown-parent {
  position: relative;
}
.dropdown {
  display: none;
  position: absolute;
  top: 100%;
  left: 0;
  background: #fff;
  border: 1px solid #ddd;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  flex-direction: column;
  min-width: 180px;
  z-index: 1000;
}
.dropdown a {
  padding: 10px 16px;
  color: #111;
  text-decoration: none;
  font-weight: 500;
  display: block;
}
.dropdown a:hover {
  background: #f5f5f5;
}
.dropdown-parent:hover .dropdown {
  display: flex;
}

/* ===== 아이콘 버튼 ===== */
.icon-btn {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  color: #111;
  text-decoration: none;
}
.icon-btn i {
  font-size: 22px;
  line-height: 1;
}
.icon-btn:hover {
  opacity: 0.8;
}

/* ===== 알림 배지 ===== */
.badge {
  position: absolute;
  top: -4px;
  right: -6px;
  min-width: 16px;
  height: 16px;
  padding: 0 4px;
  border-radius: 8px;
  background: #ff3b30;
  color: #fff;
  font-size: 11px;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

/* ===== 텍스트 버튼 ===== */
.text-btn {
  background: transparent;
  border: none;
  padding: 4px 6px;
  color: #111;
  font-weight: 700;
  cursor: pointer;
  text-decoration: none;
}
.text-btn:hover {
  opacity: 0.8;
}

/* ===== 마이페이지 hover 시 로그아웃 버튼 ===== */
.mypage-hover-area {
  position: relative;
  display: inline-block;
  margin-right: 15px;
}
.logout-hover-btn {
  display: none;
  position: absolute;
  top: 110%;
  left: 50%;
  transform: translateX(-50%);
  background: #f5f5f5;
  border: none;
  border-radius: 10px;
  padding: 10px 20px;
  min-width: 100px;
  font-size: 14px;
  font-weight: 700;
  color: #333;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
  cursor: pointer;
  transition: all 0.25s ease;
  z-index: 100;
}
.logout-hover-btn:hover,
.logout-hover-btn:focus {
  background: #e53935;
  color: #fff;
  transform: translateX(-50%) translateY(-2px);
  box-shadow: 0 6px 14px rgba(0, 0, 0, 0.25);
}
.mypage-hover-area:hover .logout-hover-btn,
.logout-hover-btn:focus {
  display: block;
}

.nickname {
  margin-right: 8px;
  font-weight: 700;
  color: #333;
}
</style>
