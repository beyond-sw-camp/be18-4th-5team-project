<template>
  <div class="cards">
    <h3 class="section-title">매칭 결과 조회</h3>

    <div v-for="m in completedMatches" :key="m.id" class="card">
      <!-- 헤더: 아바타 / 제목 / 종목칩 / 상태배지 -->
      <div class="head">
        <div class="head-left">
          <div class="title-wrap">
            <div class="title">{{ (m.region || '-') + ' ' + (m.sport || '-') }}</div>
            <span class="chip">{{ m.sport }}</span>
          </div>
        </div>
      </div>

      <!-- 한 줄 메타: 날짜 / 시간 / 지역 / 인원 / 성별 -->
      <div class="meta">
        <div class="meta-item">
          <i class="mdi mdi-calendar-blank-outline"></i>
          <span>{{ m.matchDate }}</span>
        </div>
        <div class="meta-item">
          <i class="mdi mdi-clock-outline"></i>
          <span>{{ m.matchTime }}</span>
        </div>
        <div class="meta-item">
          <i class="mdi mdi-map-marker-outline"></i>
          <span>{{ m.region }}</span>
        </div>
        <div class="meta-item">
          <i class="mdi mdi-account-multiple-outline"></i>
          <span>{{ m.playerCount }}</span>
        </div>
        <div class="meta-item">
          <i class="mdi mdi-account-multiple-outline"></i>
          <span>{{ getGenderText(m.genderOption) }}</span>
        </div>
      </div>

      <div class="divider"></div>

      <!-- 하단: 취소 버튼 우하단 정렬 -->
      <div class="foot">
        <button
          v-if="isResultRecordable(m.matchDate)"
          type="button"
          class="btn-add-result"
          @click="$emit('add-result-click', m.id)">
          <i class="mdi mdi-file-document-outline"></i> 결과 등록
        </button>
        <button 
          v-if="isCancellable(m.matchDate)" 
          type="button" 
          class="btn-cancel" 
          @click="$emit('cancel-click', m.id,  m.roomId)">
          <i class="mdi mdi-close"></i> 취소
        </button>
        
      </div>
    </div>

    <div v-if="!completedMatches?.length" class="empty">표시할 매칭이 없습니다.</div>
  </div>
</template>

<script setup>
  defineProps({
    completedMatches: { type: Array, required: true }
  })

  defineEmits(['cancel-click', 'add-result-click'])

  const getGenderText = (g) => {
    if (g === 'A') return '상관없음'
    if (g === 'F') return '여자만'
    if (g === 'M') return '남자만'
    return g
  }

  const isCancellable = (dateString) => {
    const today = new Date(); today.setHours(0,0,0,0)
    const md = new Date(dateString)
    return md >= today
  }

  const isResultRecordable = (dateString) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); 
    const matchDate = new Date(dateString);
    matchDate.setHours(0, 0, 0, 0); 

    return today > matchDate;
}
</script>

<style scoped>
.cards { display: grid; gap: 16px; }

/* 카드 박스 (스샷 느낌: 라운드+옅은 그림자) */
.card{
  background:#fff;
  border:1px solid #e9edf3;
  border-radius:18px;
  padding:16px 18px;
  box-shadow:0 3px 12px rgba(20,40,80,.07);
}

/* 상단 헤더 */
.head{
  display:flex; justify-content:space-between; align-items:center; gap:12px;
}
.head-left{ display:flex; align-items:center; gap:12px; }
.avatar{
  width:42px; height:42px; border-radius:50%;
  display:inline-flex; align-items:center; justify-content:center;
  background:#f1f5f9; color:#94a3b8; border:1px solid #e2e8f0; font-size:20px;
}
.title-wrap{ display:flex; align-items:center; gap:10px; }
.title{ font-size:18px; font-weight:700; color:#111827; }
.chip{
  font-size:12px; padding:4px 10px; border-radius:16px;
  background:#f3f4f6; color:#374151; border:1px solid #e5e7eb;
}
.status{
  font-size:12px; padding:6px 10px; border-radius:16px;
  background:#f3f4f6; color:#111827; font-weight:700;
}

/* 메타 한 줄: 5등분, 아이콘+텍스트 */
.meta{
  display:grid;
  grid-template-columns: repeat(5, minmax(120px, 1fr));
  gap:10px 18px;
  margin-top:14px;
  color:#4b5563; font-size:14px;
}
@media (max-width: 1200px){ .meta{ grid-template-columns: repeat(3, minmax(120px,1fr)); } }
@media (max-width: 720px){ .meta{ grid-template-columns: repeat(2, minmax(120px,1fr)); } }

.meta-item{ display:flex; align-items:center; gap:8px; white-space:nowrap; }
.meta-item .mdi{ font-size:18px; color:#6b7280; }

/* 구분선 */
.divider{ height:1px; background:#e5e7eb; margin:12px 0; }

/* 제목 */
.section-title{ font-size:20px; font-weight:800; margin:6px 0 8px; }

.empty{ padding:20px; text-align:center; color:#6b7280; }

/* 하단 버튼 우측 정렬 */
.foot{ display:flex; justify-content:flex-end; gap: 8px; }
.btn-cancel, .btn-add-result {
  display:inline-flex; align-items:center; gap:6px;
  border:1px solid #e5e7eb;
  border-radius:12px; padding:8px 14px; font-size:14px; cursor:pointer;
}

.btn-cancel {
  background:#ef4444; color:#fff;
}
.btn-cancel:hover{ filter:brightness(.95); }

.btn-add-result {
  background: #3b82f6; color: #fff;
}
.btn-add-result:hover { filter:brightness(.95); }
</style>
