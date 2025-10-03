<template>
  <div class="profile-section">
    <!-- 프로필 헤더 + 편집 버튼 -->
    <div class="profile-header">
      <h2>프로필 정보</h2>
      <button class="edit-btn" @click="editProfileMode = !editProfileMode">
        {{ editProfileMode ? '취소' : '편집' }}
      </button>
    </div>

    <!-- 프로필 편집 모드 -->
    <div v-if="editProfileMode" class="edit-form">
      <div class="edit-form-inner">
        <div class="profile-img-edit">
          <img
            :src="displayProfileImage()"
            class="profile-img-preview"
            alt="프로필 이미지"
          />
          <label class="profile-upload-btn">
            프로필 사진 변경
            <input type="file" accept="image/*" @change="handleProfileImage" hidden />
          </label>

          <button class="reset-btn" @click="resetProfileImage">
            기본 이미지로 변경
          </button>
        </div>

        <!-- 텍스트 필드 -->
        <div class="edit-fields">
          <label>이름
            <input v-model="editableData.name" placeholder="이름을 입력하세요." />
          </label>
          <label>이메일
            <input v-model="editableData.email" placeholder="이메일을 입력하세요." />
          </label>
          <label>전화번호
            <input v-model="editableData.phone" placeholder="전화번호를 입력하세요." />
          </label>
          <label>주소
            <input v-model="editableData.address" placeholder="주소를 입력하세요." />
          </label>
          <label>나이
            <input v-model="editableData.age" placeholder="나이를 입력하세요." type="number" />
          </label>
        </div>
        <button class="save-btn" @click="saveProfile">저장</button>
      </div>
    </div>

    <!-- 기본 정보 모드 -->
    <div class="basic-info" v-else>
      <div class="profile-img-view">
        <img
          :src="resolveProfileImage(editableData.profileImage)"
          class="profile-img-preview"
          alt="프로필 이미지"
        />
      </div>

      <p><strong>이름:</strong> {{ editableData.name || '-' }}</p>
      <p><strong>이메일:</strong> {{ editableData.email || '-' }}</p>
      <p><strong>전화번호:</strong> {{ editableData.phone || '미등록' }}</p>
      <p><strong>주소:</strong> {{ editableData.address || '미등록' }}</p>
      <p><strong>나이:</strong> {{ editableData.age || '-' }}</p>

      <!-- 관심 있는 운동 -->
      <div class="profile-header">
        <h3>선호 운동</h3>
        <button class="edit-btn" @click="editLevelMode = !editLevelMode">
          {{ editLevelMode ? '취소' : '레벨 수정' }}
        </button>
      </div>

      <div class="favorite-sports">
        <ul>
          <li v-for="sport in interestedSports" :key="sport">
            {{ sport }} - 레벨: {{ localUserLevels[sport].levelName }}
          </li>
          <li v-if="!interestedSports.length">선호 운동이 없습니다.</li>
        </ul>
      </div>
    </div>

    <!-- 레벨 수정 모드 -->
    <div v-if="editLevelMode" class="edit-level-card">
      <div class="edit-level-list">
        <div v-for="sport in defaultSports" :key="sport" class="edit-level-item">
          <div class="edit-level-sport">{{ sport }}</div>
          <select v-model="editableLevels[sport].levelId" class="edit-level-select">
            <option disabled value="">레벨 선택</option>
            <option v-for="level in levelOptions" :key="level.id" :value="level.id">
              {{ level.name }}
            </option>
          </select>
          <label class="edit-level-checkbox">
            <input type="checkbox" v-model="editableLevels[sport].interest" />
            <span class="edit-level-checkbox-custom"></span>
            관심 있음
          </label>
        </div>
      </div>
      <button class="save-btn" @click="saveLevels">저장</button>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, watch, computed } from 'vue'
import axios from 'axios'
import defaultProfile from '@/assets/default_profile.png'

const props = defineProps({
  userData: Object,
  userLevels: Object
})

const emit = defineEmits(['update'])

// 기본 종목
const defaultSports = ['농구', '축구', '야구']

// 프로필 편집 모드
const editProfileMode = ref(false)
const editableData = reactive({ ...props.userData })

// 프로필 이미지 선택/미리보기
const selectedFile = ref(null)
const previewImage = ref(null)

function handleProfileImage(e) {
  const file = e.target.files[0]
  if (!file) return
  selectedFile.value = file

  const reader = new FileReader()
  reader.onload = (ev) => {
    previewImage.value = ev.target.result
  }
  reader.readAsDataURL(file)
}

async function resetProfileImage() {
  const token = localStorage.getItem("accessToken")
  try {
    const res = await axios.put(
      "http://localhost:8080/api/v1/mypage/profile/image/reset",
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    )

    previewImage.value = null
    selectedFile.value = null
    editableData.profileImage = res.data.profileImage  // 보통 null

    emit('update', { ...editableData })
    alert("프로필 이미지가 기본 이미지로 변경되었습니다.")
  } catch (err) {
    console.error(err.response?.data || err.message)
    alert("프로필 이미지 초기화 실패")
  }
}

// 최종 표시할 이미지 (미리보기 > DB > 기본값)
function displayProfileImage() {
  if (previewImage.value) return previewImage.value
  return resolveProfileImage(editableData.profileImage)
}

// 프로필 이미지 경로 처리
function resolveProfileImage(path) {
  if (!path || path.trim() === '') {
    return defaultProfile
  }
  if (path.startsWith('http') || path.startsWith('data:image')) {
    return path
  }
  return `http://localhost:8080${path}`
}

// 레벨 편집 모드
const editLevelMode = ref(false)
const editableLevels = reactive({})
const localUserLevels = reactive({})

// 레벨 옵션
const levelOptions = [
  { id: 1, name: 'Beginner' },
  { id: 2, name: 'Intermediate' },
  { id: 3, name: 'Advanced' }
]

// 초기 레벨 세팅
const initLevels = (userLevels) => {
  for (const sport of defaultSports) {
    const interest = userLevels?.[sport]?.interest ?? false
    localUserLevels[sport] = {
      levelId: userLevels?.[sport]?.levelId || 1,
      levelName: userLevels?.[sport]?.levelName || 'Beginner',
      interest
    }
    editableLevels[sport] = {
      levelId: userLevels?.[sport]?.levelId || 1,
      interest
    }
  }
}

// props 변경 시 초기화
watch(
  () => props.userLevels,
  (newVal) => initLevels(newVal),
  { immediate: true, deep: true }
)

// 관심 있는 운동만 계산
const interestedSports = computed(() => {
  return defaultSports.filter(sport => localUserLevels[sport]?.interest)
})

const saveProfile = async () => {
  try {
    const token = localStorage.getItem('accessToken')

    // 1) 일반 정보 업데이트
    const res = await axios.put(
      'http://localhost:8080/api/v1/mypage/profile',
      {
        name: editableData.name,
        email: editableData.email,
        phoneNumber: editableData.phone,
        address: editableData.address,
        age: editableData.age
      },
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    )

    // 2) 파일이 선택된 경우 업로드
    if (selectedFile.value) {
      const formData = new FormData()
      formData.append("profileImage", selectedFile.value)

      const imageRes = await axios.put(
        "http://localhost:8080/api/v1/mypage/profile/image",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data"
          }
        }
      )

      // 서버에서 내려준 이미지 경로 반영
      editableData.profileImage = imageRes.data.profileImage
    }

    // 3) UI 업데이트
    Object.assign(editableData, res.data)
    alert('프로필이 업데이트되었습니다.')
    window.location.reload()
  } catch (err) {
    console.error(err.response?.data || err.message)
    alert('프로필 업데이트 실패')
  }
}


// 레벨 저장
const saveLevels = async () => {
  const token = localStorage.getItem('accessToken')

  for (const sport of defaultSports) {
    const data = {
      sportName: sport,
      levelId: editableLevels[sport].levelId,
      interest: editableLevels[sport].interest
    }

    try {
      await axios.post('http://localhost:8080/api/v1/mypage/levels', data, {
        headers: { Authorization: `Bearer ${token}` }
      })

      localUserLevels[sport] = {
        levelId: editableLevels[sport].levelId,
        levelName: levelOptions.find(l => l.id === editableLevels[sport].levelId)?.name || 'Unknown',
        interest: editableLevels[sport].interest
      }
    } catch (err) {
      console.error(`레벨 업데이트 실패: ${sport}`, err)
    }
  }
  editLevelMode.value = false
  alert('레벨 정보가 업데이트되었습니다.')
}
</script>

<style scoped>
/* 레벨 수정 카드 스타일 */
.edit-level-card {
  background: #f9fafb;
  border-radius: 16px;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.06);
  padding: 2rem 1.5rem 1.5rem 1.5rem;
  margin: 2rem auto 1.5rem auto;
  max-width: 420px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.edit-level-list {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
  margin-bottom: 1.2rem;
}
.edit-level-item {
  display: flex;
  align-items: center;
  gap: 1.2rem;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 1px 4px 0 rgba(0,0,0,0.04);
  padding: 1rem 1.2rem;
}
.edit-level-sport {
  min-width: 54px;
  font-weight: 600;
  color: #1d61e7;
  font-size: 1.05rem;
}
.edit-level-select {
  flex: 1;
  padding: 0.6rem 1rem;
  border-radius: 8px;
  border: 1px solid #d1d5db;
  background: #fafbfc;
  font-size: 1rem;
  transition: border 0.2s, box-shadow 0.2s;
  outline: none;
}
.edit-level-select:focus {
  border: 1.5px solid #1D61E7;
  background: #fff;
  box-shadow: 0 0 0 2px #e3edff;
}
.edit-level-checkbox {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.97rem;
  color: #222;
  font-weight: 500;
  cursor: pointer;
  position: relative;
}
.edit-level-checkbox input {
  opacity: 0;
  width: 0;
  height: 0;
  position: absolute;
}
.edit-level-checkbox-custom {
  width: 18px;
  height: 18px;
  border-radius: 4px;
  border: 1.5px solid #d1d5db;
  background: #f3f4f6;
  display: inline-block;
  margin-right: 2px;
  transition: background 0.18s, border 0.18s;
  position: relative;
}
.edit-level-checkbox input:checked + .edit-level-checkbox-custom {
  background: #1d61e7;
  border-color: #1d61e7;
}
.edit-level-checkbox input:checked + .edit-level-checkbox-custom:after {
  content: '';
  position: absolute;
  left: 5px;
  top: 2px;
  width: 5px;
  height: 10px;
  border: solid #fff;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
  display: block;
}
.profile-section {
  margin-top: 2.5rem;
  max-width: 480px;
  margin-left: auto;
  margin-right: auto;
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 4px 24px 0 rgba(0,0,0,0.08);
  padding: 2.5rem 2rem 2rem 2rem;
}
.profile-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}
.profile-header h2,
.profile-header h3 {
  margin: 0;
  padding: 0;
  line-height: 1.2;
  font-weight: 600;
  font-size: 1.25rem;
}
.edit-form {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 420px;
}
.edit-form-inner {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
}
.profile-img-edit {
  display: flex;
  flex-direction: row;   /* 👉 버튼들을 가로로 배치 */
  align-items: center;
  gap: 0.5rem;           /* 버튼 사이 간격 */
}
.profile-img-preview {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #e5e7eb;
  background: #f3f4f6;
}
.profile-upload-btn,
.reset-btn {
  display: inline-block;
  margin-top: 0.3rem;
  padding: 0.3rem 0.8rem; 
  background: #f3f4f6;
  color: #1d61e7;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  border: 1px solid #e5e7eb;
  transition: background 0.18s, color 0.18s;
}
.profile-upload-btn:hover,
.reset-btn:hover {
  background: #e3edff;
  color: #174bb3;
}
.edit-fields {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
}
.edit-fields label {
  font-size: 0.97rem;
  color: #222;
  font-weight: 500;
  margin-bottom: 0.2rem;
}
.edit-fields input {
  width: 100%;
  padding: 0.7rem 1rem;
  border-radius: 8px;
  border: 1px solid #d1d5db;
  background: #fafbfc;
  font-size: 1rem;
  margin-top: 0.2rem;
  transition: border 0.2s, box-shadow 0.2s;
  outline: none;
  box-sizing: border-box;
}
.edit-fields input:focus {
  border: 1.5px solid #1D61E7;
  background: #fff;
  box-shadow: 0 0 0 2px #e3edff;
}
.save-btn {
  margin-top: 1.2rem;
  padding: 0.7rem 2.2rem;
  background: #1D61E7;
  color: #fff;
  border: none;
  border-radius: 12px;
  font-size: 1.08rem;
  font-weight: 700;
  box-shadow: 0 2px 8px 0 rgba(29,97,231,0.08);
  transition: background 0.18s, box-shadow 0.18s;
  cursor: pointer;
}
.save-btn:hover {
  background: #174bb3;
  box-shadow: 0 4px 16px 0 rgba(29,97,231,0.13);
}
.edit-btn {
  padding: 0.3rem 0.8rem;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}
.basic-info {
  background: #f9fafb;
  padding: 1rem;
  border-radius: 12px;
  font-size: 0.95rem;
}
.basic-info p { margin: 0.25rem 0; }
.basic-info strong { color: #3b82f6; }
.favorite-sports h3 { margin-top: 1rem; margin-bottom: 1rem; font-weight: 600; }
.favorite-sports ul { list-style: disc; padding-left: 1.2rem; }

.checkbox-container {
  display: inline-block;
  position: relative;
  padding-left: 25px;
  margin-right: 10px;
  cursor: pointer;
  font-size: 0.95rem;
  user-select: none;
  color: #1e293b;
}
.checkbox-container input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}
.checkmark {
  position: absolute;
  top: 0;
  left: 0;
  height: 18px;
  width: 18px;
  background-color: #eee;
  border-radius: 4px;
  border: 1px solid #d1d5db;
  transition: all 0.2s ease;
}
.checkbox-container input:checked ~ .checkmark {
  background-color: #3b82f6;
  border-color: #3b82f6;
}
.checkmark:after {
  content: "";
  position: absolute;
  display: none;
}
.checkbox-container input:checked ~ .checkmark:after {
  display: block;
}
.checkbox-container .checkmark:after {
  left: 5px;
  top: 1px;
  width: 5px;
  height: 10px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}
</style>
