<template>
  <div class="cards">
    <h3 class="section-title">매칭 신청 이력 조회</h3>
    <div
      v-for="m in matchApplications"
      :key="m.id"
      class="card"
    >
      <!-- 상단: 종목/지역/경기일 -->
      <div class="head">
        <div class="title-group">
          <div class="title">{{ m.sport }} · {{ m.region }}</div>
          <div class="sub">{{ m.matchDate }} · {{ m.matchTime }}</div>
        </div>

        <!-- 상태 배지 -->
        <span class="badge" :class="m.status.toLowerCase()">
          {{ m.status }}
        </span>
      </div>

      <!-- 메타: 성별 / 신청시각 -->
      <div class="meta">
        <div class="meta-item">
          <span class="label">성별</span>
          <span class="value">{{ getGenderText(m.genderOption) }}</span>
        </div>
        <div class="meta-item">
          <span class="label">신청시각</span>
          <span class="value">{{ m.createdAt }}</span>
        </div>
      </div>

      <div class="divider"></div>

      <!-- 하단: 취소 버튼 (WAITING일 때만) -->
      <div class="foot">
        <button
          v-if="m.status === 'WAITING'"
          type="button"
          class="btn-cancel"
          @click="$emit('cancel-click', m.id)"
        >
          취소
        </button>
      </div>
    </div>

    <div v-if="!matchApplications?.length" class="empty">
      표시할 신청 내역이 없습니다.
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  matchApplications: { type: Array, required: true }
})
defineEmits(['cancel-click'])

const getGenderText = (g) => {
  if (g === 'A') return '상관없음'
  if (g === 'F') return '여자만'
  if (g === 'M') return '남자만'
  return g
}
</script>

<style scoped>
.cards { display: grid; gap: 12px; }

/* 카드 박스 */
.card{
  background:#fff;
  border:1px solid #e9edf3;
  border-radius:16px;
  padding:14px 16px;
  box-shadow:0 2px 8px rgba(20,40,80,.06);
}

/* 상단: 제목/상태 */
.head{
  display:flex; align-items:center; justify-content:space-between; gap:12px;
}
.title-group{ display:flex; flex-direction:column; gap:4px; }
.title{ font-size:16px; font-weight:700; color:#111827; }
.sub{ font-size:13px; color:#6b7280; }

/* 상태 배지 (WAITING/APPROVED/REJECTED 등) */
.badge{
  font-size:12px; padding:6px 10px; border-radius:999px; font-weight:700;
  background:#f3f4f6; color:#111827; border:1px solid #e5e7eb;
  text-transform: uppercase;
}
.badge.waiting { background:#fff7ed; color:#9a3412; border-color:#fed7aa; }   /* 주황톤 */
.badge.approved{ background:#ecfdf5; color:#065f46; border-color:#a7f3d0; }  /* 초록톤 */
.badge.rejected{ background:#fef2f2; color:#991b1b; border-color:#fecaca; }  /* 빨강톤 */

/* 메타 정보 */
.meta{
  display:grid; grid-template-columns: repeat(2, minmax(160px, 1fr));
  gap:10px 16px; margin-top:12px;
}
.meta-item{ display:flex; gap:8px; align-items:baseline; }
.label{ font-size:12px; color:#6b7280; }
.value{ font-size:14px; font-weight:600; color:#111827; }

.divider{ height:1px; background:#e5e7eb; margin:12px 0; }

/* 하단: 우측 정렬 취소 버튼 */
.foot{ display:flex; justify-content:flex-end; }
.btn-cancel{
  border:1px solid #e5e7eb;
  background:#ef4444; color:#fff;
  border-radius:10px; padding:8px 14px;
  font-size:14px; cursor:pointer;
}
.btn-cancel:hover{ filter:brightness(.95); }

/* 빈 상태 */
.empty{ padding:20px; text-align:center; color:#6b7280; }
.section-title{ font-size:20px; font-weight:800; margin:6px 0 8px; }
</style>
