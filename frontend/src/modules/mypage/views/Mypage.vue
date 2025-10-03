<template>
  <div class="mypage-wrapper">
    <!-- 상단 헤더 -->
    <header class="page-header">
      <div class="header-content">
        <div class="header-left">
          <h2 class="page-title">마이페이지</h2>
          <p class="page-subtitle">운동 활동과 성과를 한눈에 확인하세요</p>
        </div>
      </div>
    </header>

    <!-- 본문 컨테이너 -->
    <div class="mypage-container">
      <!-- 탭 -->
      <div class="tabs">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          :class="{ active: activeTab === tab.id }"
          @click="activeTab = tab.id"
        >
          {{ tab.label }}
        </button>
      </div>

      <!-- 사용자 배지 -->
    <div class="user-badge" v-if="userData">
      <div class="avatar">
        <img :src="resolveProfileImage(userData.profileImage)" :alt="userData.name" />
      </div>
      <div class="user-info">
        <span class="welcome-text">{{ userData.name }}님</span>
        <span class="nickname-text">{{ profile?.nickname }}님</span>
      </div>
    </div>


      <!-- 프로필 섹션 -->
      <ProfileSection
        v-if="activeTab === 'profile' && userData"
        :user-data="userData"
        :user-levels="userLevels"
        @update="updateUserData"
      />
      <!-- 신고 섹션 -->
      <ReportSection v-if="activeTab === 'report'" />
      <Matching v-if="activeTab === 'matching'" :active-tab="activeTab" />
      <Setting v-if="activeTab === 'settings'" />
      <MatchResults
        v-if="activeTab === 'matches'"
        :matchResults="matchStore.matchResults"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import defaultProfile from '@/assets/default_profile.png'
import ProfileSection from './ProfileSection.vue'
import MatchResults from '@/modules/match/components/MatchResults.vue'
import ReportSection from './Report.vue'
import Setting from './Setting.vue'
import { useMatchStore } from '@/modules/match/stores/matchStore'
import Matching from './Matching.vue'

const matchStore = useMatchStore()

const profile = ref(null)
const userData = ref(null)
const userLevels = ref({})
const activeTab = ref('profile')

const tabs = [
  { id: 'profile', label: '프로필' },
  { id: 'matches', label: '경기 결과' },
  { id: 'matching', label: '매칭 대기' },
  { id: 'report', label: '신고' },
  { id: 'settings', label: '설정' }
]

// ✅ 프로필 이미지 변환 함수
function resolveProfileImage(path) {
  if (!path) return defaultProfile
  if (path.startsWith('http')) {
    return path // 카카오 CDN 같은 경우
  }
  return `http://localhost:8080${path}` // 서버 업로드 이미지
}

onMounted(async () => {
  try {
    const token = localStorage.getItem('accessToken')

    await matchStore.fetchMatchResults()

    const profileRes = await axios.get('http://localhost:8080/api/v1/mypage/profile', {
      headers: { Authorization: `Bearer ${token}` }
    })

    const profileData = profileRes.data
    if (profileData) {
      profile.value = profileData
      userData.value = {
        ...profileData,
        phone: profileData.phoneNumber || '미등록',
        profileImage: profileData.profileImage, // 경로 원본 그대로 저장
        favoriteSports: profileData.favoriteSports || []
      }
    }

    const levelsRes = await axios.get('http://localhost:8080/api/v1/mypage/levels', {
      headers: { Authorization: `Bearer ${token}` }
    })

    let levelsData = levelsRes.data
    if (typeof levelsData === 'string') {
      levelsData = JSON.parse(levelsData)
    }

    userLevels.value = levelsData.reduce((acc, item) => {
      acc[item.sportName] = {
        levelId: item.levelId,
        levelName: item.levelName,
        interest: item.interest
      }
      return acc
    }, {})
  } catch (err) {
    console.error('마이페이지 호출 에러:', err)
    userData.value = {
      name: '사용자',
      email: '-',
      phone: '-',
      address: '-',
      age: '-',
      profileImage: defaultProfile,
      favoriteSports: []
    }
  }
})

const updateUserData = (data) => {
  userData.value = { ...userData.value, ...data }
}
</script>

<style scoped>
/* 공통 래퍼 */
.mypage-wrapper {
  width: 100%;
  overflow-x: hidden;
}

/* 본문 컨테이너 */
.mypage-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

/* 헤더 */
.page-header {
  position: relative;
  align-items: center;
  width: 100vw;                        /* 화면 전체 넓이 */
  margin-left: calc(-50vw + 50%);      /* 부모 max-width 영향 제거 */
  background: linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%);
  color: white;
  min-height: 60px;
  display: flex;
  padding: 0 1.5rem 0 4rem;  
  box-shadow: 0 4px 20px rgba(59, 130, 246, 0.2);
}

.page-header h2 {
  font-size: 1.1rem;
  margin: 0;
  line-height: 1.3;
}

.page-header p {
  font-size: 0.8rem;
  margin: 0.25rem 0 0;
  line-height: 1.4;
}

/* 탭 */
.tabs {
  margin-top: 1.5rem;
  margin-bottom: 2rem;
  display: flex;
  gap: 1rem;
}

.tabs button {
  padding: 0.5rem 1rem;
  border-radius: 6px;
  border: 1px solid #e2e8f0;
  background: white;
  cursor: pointer;
}

.tabs button.active {
  background: #3b82f6;
  color: white;
  border-color: #3b82f6;
}

/* 사용자 배지 */
.user-badge {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  margin-top: 1rem;
  margin-bottom: 1.5rem;
}

.avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid rgba(0, 0, 0, 0.1);
  background: #f0f0f0;
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.user-info {
  display: flex;
  flex-direction: column;
}

.welcome-text {
  font-weight: 600;
  font-size: 1.2rem;
  color: #1e293b;
}

.nickname-text {
  font-weight: 500;
  color: #64748b;
  margin-top: 0.25rem;
}
</style>
