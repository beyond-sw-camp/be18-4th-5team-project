<template>
  <div class="matching-section">
    <div v-if="matches.length === 0">진행 중인 매치가 없습니다.</div>

    <div v-else>
      <div v-for="match in paginatedMatches" :key="match.id" class="match-card">
        <h3>{{ match.sport }} 경기</h3>

        <p v-if="match.opponentNickname"><strong>상대:</strong> {{ match.opponentNickname }}</p>

        <p v-if="match.matchDate || match.matchTime">
          <strong>경기 일시:</strong> {{ formatDate(match.matchDate) }} {{ match.matchTime || '' }}
        </p>

        <p><strong>장소:</strong> {{ match.region }}</p>
      </div>

      <div class="pagination" v-if="totalPages > 1">
        <button :disabled="currentPage === 1" @click="prevPage">이전</button>
        <span>{{ currentPage }} / {{ totalPages }}</span>
        <button :disabled="currentPage === totalPages" @click="nextPage">다음</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useMatchStore } from '@/modules/match/stores/matchStore'

const matchStore = useMatchStore()
const currentPage = ref(1)
const pageSize = 5

// computed로 store matches 가져오기
const matches = computed(() => matchStore.matches)

// props로 activeTab 받기
const props = defineProps({ activeTab: String })

// 서버에서 매칭 중 경기 fetch
const fetchMatchesPage = async () => {
  try {
    await matchStore.fetchMatches(currentPage.value, pageSize)
    console.log('matches loaded:', matchStore.matches)
  } catch (err) {
    console.error(err)
  }
}

// activeTab이 'matching'일 때만 fetch
watch(() => props.activeTab, (newTab) => {
  if (newTab === 'matching') fetchMatchesPage()
})

// 페이지네이션 계산
const totalPages = computed(() => Math.ceil(matches.value.length / pageSize))
const paginatedMatches = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return matches.value.slice(start, start + pageSize)
})

// 페이지 이동
const prevPage = () => { if (currentPage.value > 1) currentPage.value-- }
const nextPage = () => { if (currentPage.value < totalPages.value) currentPage.value++ }

// currentPage 변경 시 fetch
watch(currentPage, fetchMatchesPage)

// 초기 마운트 시 fetch
onMounted(() => {
  if (props.activeTab === 'matching') fetchMatchesPage()
})

// 날짜 포맷 함수
const formatDate = isoStr => {
  const date = new Date(isoStr)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}
</script>

<style scoped>
.matching-section {
  padding: 1rem;
  background: #f9fafb;
  border-radius: 8px;
}

.match-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1rem;
}

.match-card {
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 1rem;
  background: #fff;
}

.pagination {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 1rem;
}

.pagination button {
  padding: 0.4rem 0.8rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  cursor: pointer;
}

.pagination button:disabled {
  background: #e5e7eb;
  cursor: not-allowed;
}
</style>
