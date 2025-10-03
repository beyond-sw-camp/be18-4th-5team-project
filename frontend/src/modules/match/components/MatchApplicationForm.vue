<template>
  <form @submit.prevent="submitClick">
    <p>당일 신청은 2시간 이후부터 가능합니다!</p>

    <!-- 종목 -->
    <div class="mb-3">
      <label for="sport" class="form-label">종목</label>
      <select class="form-select" v-model="formData.sport">
        <option disabled value="">종목 선택</option>
        <option v-for="sport in sports" :key="sport.id" :value="sport.name">
          {{ sport.name }}
        </option>
      </select>
    </div>

    <!-- 지역 (자동완성) -->
    <div class="mb-3" style="position:relative;">
      <label for="region" class="form-label">지역</label>
      <input
        type="text"
        class="form-control"
        id="region"
        v-model="query"
        @input="searchRegion"
        placeholder="예: 서초구"
        autocomplete="off"
      />
      <ul v-if="suggestions.length" class="suggest-list">
        <li
          v-for="(item, index) in suggestions"
          :key="index"
          @click="selectRegion(item)"
        >
          {{ item }}
        </li>
      </ul>
    </div>

    <!-- 날짜 -->
    <div class="mb-3">
      <label for="date" class="form-label">날짜</label>
      <input type="date" class="form-control" id="date" v-model="formData.matchDate" />
    </div>

    <!-- 시작 시간 -->
    <div class="mb-3">
      <label for="startTime" class="form-label">시작 시간</label>
      <select class="form-select time-select" id="startTime" v-model="formData.startTime">
        <option disabled value="">시작 시간 선택</option>
        <option v-for="h in 24" :key="'start-' + h" :value="`${String(h).padStart(2,'0')}:00`">
          {{ String(h).padStart(2,'0') }}:00
        </option>
      </select>
    </div>

    <!-- 종료 시간 -->
    <div class="mb-3">
      <label for="endTime" class="form-label">종료 시간</label>
      <select class="form-select time-select" id="endTime" v-model="formData.endTime">
        <option disabled value="">종료 시간 선택</option>
        <option v-for="h in 24" :key="'end-' + h" :value="`${String(h).padStart(2,'0')}:00`">
          {{ String(h).padStart(2,'0') }}:00
        </option>
      </select>
    </div>

    <!-- 성별 -->
    <div class="mb-3">
      <label for="genderOption" class="form-label">성별</label>
      <select class="form-select" v-model="formData.genderOption">
        <option value="A">상관없음</option>
        <option value="F">여자만</option>
        <option value="M">남자만</option>
      </select>
    </div>

    <!-- 버튼 -->
    <div class="btn-wrapper">
      <button type="submit" class="btn btn-primary m-2">신청</button>
    </div>
  </form>
</template>

<script setup>
import { reactive, toRaw, ref } from "vue";

const props = defineProps({
  initFormData: Object,
  formType: { type: String, required: true },
  sports: { type: Array, required: true },
});

const formData = reactive({ ...props.initFormData });
const emit = defineEmits(["form-submit"]);

const USE_MOCK = true; 
const query = ref("");
const suggestions = ref([]);

const mockGuList = ["동작구", "서초구", "종로구", "관악구", "강남구", "마포구", "용산구", "성동구", "광진구", "중구"];

const searchRegion = async () => {
  if (!query.value) {
    suggestions.value = [];
    return;
  }

  if (USE_MOCK) {
    suggestions.value = mockGuList.filter((gu) =>
      gu.startsWith(query.value)
    );
  } else {
    // const res = await axios.get("https://nominatim.openstreetmap.org/search", {
    //   params: {
    //     q: query.value,
    //     format: "json",
    //     addressdetails: 1,
    //     countrycodes: "kr",
    //     extratags: 1,
    //     limit: 5,
    //   },
    // });
    // suggestions.value = res.data
    //   .filter((item) =>
    //     item.class === "boundary" &&
    //     item.type === "administrative" &&
    //     item.extratags?.admin_level === "6"
    //   )
    //   .map((item) => {
    //     const addr = item.address;
    //     return `${addr.state || ""} ${addr.county || addr.city || ""}`.trim();
    //   });
  }
};

const selectRegion = (item) => {
  formData.region = item;
  query.value = item;
  suggestions.value = [];
};

// ----------------------------
// 제출
// ----------------------------
const submitClick = () => {
  if (!formData.region) {
    alert("지역을 선택해주세요!");
    return;
  }
  emit("form-submit", toRaw(formData));
};
</script>

<style scoped>
form {
  background: #fff;
  padding: 24px;
  border-radius: 16px;
  box-shadow: 0 6px 20px rgba(0,0,0,0.08);
  animation: fadeIn 0.5s ease;
}

.form-label {
  font-weight: 600;
  color: #444;
  margin-bottom: 6px;
  display: block;
}

.form-control,
.form-select {
  border-radius: 10px;
  border: 1px solid #ddd;
  padding: 10px 14px;
  transition: all 0.25s ease;
  background: #fafafa;
}

.form-control:focus,
.form-select:focus {
  border-color: #4a90e2;
  box-shadow: 0 0 8px rgba(74,144,226,0.4);
  background: #fff;
}

.mb-3 {
  margin-bottom: 20px;
}

.time-select {
  padding: 10px 14px;
  border-radius: 10px;
  background: #fafafa;
  transition: all 0.25s ease;
}

.time-select:hover {
  border-color: #4a90e2;
  background: #f0f7ff;
}

.btn-wrapper {
  display: flex;
  justify-content: center;
}

.btn-primary {
  background: linear-gradient(135deg, #4a90e2, #357ABD);
  border: none;
  padding: 10px 24px;
  border-radius: 12px;
  font-weight: 600;
  letter-spacing: 0.5px;
  transition: all 0.3s ease;
}

.btn-primary:hover {
  background: linear-gradient(135deg, #5aa3f2, #4a90e2);
  transform: translateY(-2px);
  box-shadow: 0 6px 14px rgba(74,144,226,0.4);
}

.btn-primary:active {
  transform: scale(0.97);
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.suggest-list {
  list-style: none;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 0;
  margin-top: 4px;
  background: #fff;
  max-height: 150px;
  overflow-y: auto;
  z-index: 100;
  position: absolute;
  width: 100%;
}
.suggest-list li {
  padding: 8px 12px;
  cursor: pointer;
}
.suggest-list li:hover {
  background: #f0f7ff;
}
</style>
