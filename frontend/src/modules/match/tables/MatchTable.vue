<template>
  <div class="applied-wrap">
    <h3 class="section-title">매칭 중 조회</h3>

    <div
      v-for="m in matches"
      :key="m.id"
      class="match-card"
    >
      <!-- 헤더 -->
      <div class="card-head">
        <div class="left">
          <div class="avatar">
            <i class="mdi mdi-account"></i>
          </div>
          <div class="title-box">
            <div class="title">{{ m.title || `${m.region} ${m.sport}` }}</div>
            <span class="chip">{{ m.sport }}</span>
          </div>
        </div>

        <div class="right">
          <span
            class="status"
            :class="m.status === 'APPROVED' ? 'approved' : 'pending'"
          >
            {{ m.status === 'APPROVED' ? '승인됨' : '대기 중' }}
          </span>
        </div>
      </div>

      <!-- 본문 (메타) -->
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
          <span>{{ m.place || m.region }}</span>
        </div>
        <div class="meta-item">
          <i class="mdi mdi-account-multiple-outline"></i>
          <span>{{ m.currentCount }}/{{ m.requiredCount }}</span>
        </div>
        <div class="meta-item">
          <i class="mdi mdi-account-multiple-outline"></i>
          <span>{{ getGenderText(m.genderOption) }}</span>
        </div>
      </div>

      <div class="divider"></div>

      <!-- 푸터 -->
      <div class="card-foot">
        
        <div class="spacer"></div>

        <button
          type="button"
          class="btn btn-sm btn-danger"
          @click="$emit('cancel-click', m.id)"
        >
          <i class="mdi mdi-close"></i> 취소
        </button>
      </div>
    </div>

    <div v-if="!matches?.length" class="empty">
      아직 신청한 매칭이 없어요.
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  matches: { type: Array, required: true }
})
defineEmits(['cancel-click', 'message-click'])

const pad = (n) => String(n).padStart(2, '0')

const getGenderText = (genderOption) => {
    if (genderOption === 'A') {
      return '상관없음';
    } else if (genderOption === 'F') {
      return '여자만';
    } else if (genderOption === 'M') {
      return '남자만';
    }
    
    return genderOption;
  };
</script>

<style scoped>
.applied-wrap {
  padding: 8px;
}
.section-title {
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 12px;
}

.match-card {
  background: #fff;
  border: 1px solid #e9edf3;
  border-radius: 16px;
  padding: 14px 16px;
  margin-bottom: 14px;
  box-shadow: 0 2px 8px rgba(20, 40, 80, 0.06);
}

.card-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}
.left { display: flex; align-items: center; gap: 12px; }

.avatar {
  width: 44px; height: 44px; border-radius: 50%;
  background: #f1f5f9; color: #94a3b8;
  display: inline-flex; align-items: center; justify-content: center;
  font-size: 22px;
  border: 1px solid #e2e8f0;
}

.title-box { display: flex; align-items: center; gap: 10px; }
.title {
  font-size: 16px; font-weight: 700; color: #111827;
  line-height: 1.2;
}
.chip {
  font-size: 12px; padding: 4px 8px; border-radius: 14px;
  background: #f3f4f6; color: #374151; border: 1px solid #e5e7eb;
}

.status {
  font-size: 12px; padding: 6px 10px; border-radius: 16px;
  font-weight: 700;
}
.status.pending { background: #f3f4f6; color: #111827; }
.status.approved { background: #111827; color: #fff; }

.meta {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
  gap: 10px 16px;
  margin-top: 12px;
  color: #4b5563;
  font-size: 13px;
}
.meta-item { display: flex; align-items: center; gap: 8px; }
.meta-item .mdi { font-size: 18px; color: #6b7280; }

.divider {
  height: 1px; background: #e5e7eb; margin: 12px 0;
}

.card-foot {
  display: flex; align-items: center; gap: 10px;
}
.spacer { flex: 1; }

.btn {
  border: 1px solid transparent;
  border-radius: 10px;
  padding: 6px 12px;
  font-size: 13px;
  cursor: pointer;
  display: inline-flex; align-items: center; gap: 6px;
}
.btn.msg {
  background: #f8fafc; color: #0f172a; border-color: #e2e8f0;
}
.btn.msg:hover { background: #eef2f7; }
.btn.cancel {
  background: #fff; color: #374151; border-color: #e5e7eb;
}
.btn.cancel:hover { background: #f9fafb; }
.empty {
  padding: 24px; color: #6b7280; text-align: center;
}
</style>
