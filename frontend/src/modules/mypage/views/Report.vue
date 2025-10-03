<template>
  <div class="report-section">
    <h2>사용자 신고</h2>

    <!-- 신고 폼 -->
    <form @submit.prevent="submitReport">
      <label>
        신고 대상:
        <input v-model="targetUserNickname" placeholder="닉네임 입력" required />
      </label>

      <label>
        이유:
        <select v-model="reason" required>
          <option disabled value="">선택</option>
          <option>욕설/비속어 사용</option>
          <option>폭력/위협적 행동</option>
          <option>사기/금전 요구</option>
          <option>스팸/광고</option>
          <option>비매너/불친절</option>
          <option>기타</option>
        </select>
      </label>

      <label>
        상세 설명:
        <textarea v-model="description" placeholder="상세 내용을 작성하세요"></textarea>
      </label>

      <div class="form-buttons">
        <button type="submit">신고 제출</button>
        <button type="button" @click="toggleReports">
          {{ showReports ? '내 신고 내역 숨기기' : '내 신고 내역 보기' }}
        </button>
      </div>
    </form>

    <!-- 내 신고 내역 -->
    <div v-if="showReports" class="report-list">
      <template v-if="paginatedReports.length > 0">
        <div v-for="report in paginatedReports" :key="report.reportId" class="report-card">
          <div class="report-header">
            <h3>{{ report.targetUserNickname }}</h3>
            <span :class="'status ' + report.status.toLowerCase()">{{ report.status }}</span>
          </div>
          <p><strong>이유:</strong> {{ report.reason }}</p>
          <p v-if="report.description"><strong>설명:</strong> {{ report.description }}</p>
          <p class="report-date">{{ formatDate(report.createTime) }}</p>
        </div>
      </template>
      <p v-else>신고 내역이 없습니다.</p>

      <!-- ✅ 페이지네이션 -->
      <div class="pagination" v-if="totalPages > 1">
        <button 
          :disabled="currentPage === 1" 
          @click="currentPage--">이전</button>

        <span>{{ currentPage }} / {{ totalPages }}</span>

        <button 
          :disabled="currentPage === totalPages" 
          @click="currentPage++">다음</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import axios from 'axios'

const targetUserNickname = ref('')
const reason = ref('')
const description = ref('')

const reports = ref([])
const showReports = ref(false)

// ✅ 페이지네이션 상태
const currentPage = ref(1)
const pageSize = ref(5) // 한 페이지에 5개
const totalPages = computed(() => Math.ceil(reports.value.length / pageSize.value))

// ✅ 현재 페이지 데이터
const paginatedReports = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return reports.value.slice(start, end)
})

// 신고 제출
const submitReport = async () => {
  try {
    const token = localStorage.getItem('accessToken')
    const formData = new FormData()
    formData.append('targetUserNickname', targetUserNickname.value)
    formData.append('reason', reason.value)
    formData.append('description', description.value || '')

    await axios.post('http://localhost:8080/api/v1/mypage/reports', formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    })

    alert('신고가 접수되었습니다.')
    targetUserNickname.value = ''
    reason.value = ''
    description.value = ''

    if (showReports.value) fetchReports()
  } catch (err) {
    console.error('신고 실패:', err)
    alert('신고 제출 중 오류가 발생했습니다.')
  }
}

// 내 신고 내역 가져오기
const fetchReports = async () => {
  try {
    const token = localStorage.getItem('accessToken')
    const res = await axios.get('http://localhost:8080/api/v1/mypage/reports/submitted', {
      headers: { Authorization: `Bearer ${token}` }
    })
    reports.value = res.data.items || []
    currentPage.value = 1 // ✅ 새로 불러올 때 첫 페이지로
  } catch (err) {
    console.error('내 신고 내역 불러오기 실패:', err)
  }
}

// 내 신고 내역 토글
const toggleReports = () => {
  showReports.value = !showReports.value
  if (showReports.value) fetchReports()
}

// 날짜 포맷
const formatDate = (isoStr) => new Date(isoStr).toLocaleString()
</script>

<style scoped>
.report-section {
  padding: 1rem;
  background: #f9fafb;
  border-radius: 8px;
}

form label {
  display: block;
  margin-bottom: 0.8rem;
}

form input,
form select,
form textarea {
  width: 100%;
  padding: 0.4rem 0.6rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  margin-top: 0.2rem;
}

.form-buttons {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

form button {
  padding: 0.5rem 1rem;
  border-radius: 6px;
  border: none;
  cursor: pointer;
}

form button[type="submit"] {
  background-color: #ef4444;
  color: white;
}

form button[type="button"] {
  background-color: #3b82f6;
  color: white;
}

/* 신고 카드 */
.report-list {
  margin-top: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.report-card {
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 1rem;
  background: #fff;
}

.report-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.status {
  padding: 0.2rem 0.6rem;
  border-radius: 6px;
  color: white;
  font-weight: 500;
  text-transform: uppercase;
  font-size: 0.8rem;
}

.status.pending { background-color: #64748b; }
.status.resolved { background-color: #10b981; }
.status.rejected { background-color: #ef4444; }

.report-date {
  margin-top: 0.5rem;
  font-size: 0.8rem;
  color: #64748b;
}

/* 페이지네이션 */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 1rem;
}

.pagination button {
  padding: 0.4rem 0.8rem;
  border: 1px solid #d1d5db;
  background: #fff;
  border-radius: 6px;
  cursor: pointer;
}

.pagination button:disabled {
  background: #e5e7eb;
  cursor: not-allowed;
}
</style>
