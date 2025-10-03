<template>
  <main class="common-back">
  <div class="create-post-container">
    <h1>게시글 작성</h1>

    <!-- 카테고리 선택 -->
    <div class="form-group">
      <label for="category">카테고리</label>
      <select id="category" v-model="categoryId">
        <option value="">카테고리를 선택하세요</option>
        <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
      </select>
    </div>

    <!-- 제목 -->
    <div class="form-group">
      <label for="title">제목</label>
      <input id="title" v-model="title" type="text" placeholder="제목을 입력하세요" />
    </div>

    <!-- 내용 -->
    <div class="form-group">
      <label for="content">내용</label>
      <textarea id="content" v-model="content" placeholder="내용을 입력하세요"></textarea>
    </div>

    <!-- 첨부파일 -->
    <div class="form-group">
      <label>첨부파일</label>
      <input type="file" multiple @change="handleFilesUpload" />
      <ul class="file-list">
        <li v-for="(file, index) in newFiles" :key="index">
          <span class="file-name">{{ file.name }}</span>
          <button type="button" class="delete-file-btn" @click="removeFile(index)">✕</button>
        </li>
      </ul>
    </div>

    <!-- 작성/취소 버튼 -->
    <div class="form-actions">
      <button class="submit-btn" @click="submitPost">작성 완료</button>
      <button class="cancel-btn" type="button" @click="cancelPost">취소</button>
    </div>
  </div>
  </main>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";

const router = useRouter();
const token = localStorage.getItem("accessToken");

const title = ref("");
const content = ref("");
const categoryId = ref("");
const categories = ref([
  { id: 1, name: "자유게시판" },
  { id: 2, name: "질문게시판" },
  { id: 3, name: "정보공유게시판" },
]);
const newFiles = ref([]);

const handleFilesUpload = (e) => {
  newFiles.value = [...newFiles.value, ...Array.from(e.target.files)];
};

const removeFile = (index) => {
  newFiles.value.splice(index, 1);
};

const submitPost = async () => {
  if (!title.value.trim() || !content.value.trim() || !categoryId.value) {
    alert("제목, 내용, 카테고리를 모두 입력해주세요.");
    return;
  }

  try {
    const formData = new FormData();
    const postData = {
      title: title.value,
      content: content.value,
      categoryId: categoryId.value
    };

    formData.append(
      "postRequestDto",
      new Blob([JSON.stringify(postData)], { type: "application/json" })
    );

    newFiles.value.forEach(file => formData.append("files", file));

    await axios.post(
      "http://localhost:8080/api/v1/community/posts",
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data"
        }
      }
    );

    alert("게시글이 작성되었습니다.");
    router.push("/community/posts");

  } catch (err) {
    console.error("게시글 작성 실패", err);
    alert("게시글 작성에 실패했습니다.");
  }
};

const cancelPost = () => {
  if (confirm("작성 중인 내용을 취소하시겠습니까?")) {
    router.push("/community/posts");
  }
};
</script>

<style scoped>
.create-post-container {
  max-width: 700px;
  margin: 1px auto;
  padding: 30px;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 8px 20px rgba(0,0,0,0.1);
}

h1 {
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 30px;
  color: #333;
  text-align: center;
}

.form-group {
  margin-bottom: 25px;
}

label {
  display: block;
  font-weight: 500;
  margin-bottom: 8px;
  color: #555;
}

input[type="text"],
textarea,
select {
  width: 100%;
  padding: 12px 14px;
  font-size: 15px;
  border-radius: 8px;
  border: 1px solid #ccc;
  transition: all 0.2s;
}

input[type="text"]:focus,
textarea:focus,
select:focus {
  border-color: #1a73e8;
  box-shadow: 0 0 0 2px rgba(26, 115, 232, 0.2);
  outline: none;
}

textarea {
  min-height: 140px;
  resize: vertical;
}

.file-list {
  list-style: none;
  padding: 0;
  margin-top: 8px;
}

.file-list li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f9f9f9;
  padding: 6px 10px;
  border-radius: 6px;
  margin-bottom: 6px;
  font-size: 14px;
}

.delete-file-btn {
  border: none;
  background: none;
  color: #e74c3c;
  font-weight: bold;
  cursor: pointer;
  transition: color 0.2s;
}

.delete-file-btn:hover {
  color: #c0392b;
}

.form-actions {
  display: flex;
  gap: 15px;
  justify-content: flex-end;
  margin-top: 20px;
}

.submit-btn {
  padding: 10px 25px;
  background: linear-gradient(90deg, #1a73e8, #4285f4);
  color: #fff;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.submit-btn:hover {
  background: linear-gradient(90deg, #1558b0, #1a49a0);
}

.cancel-btn {
  padding: 10px 25px;
  background-color: #e0e0e0;
  color: #555;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.cancel-btn:hover {
  background-color: #bdbdbd;
  color: #333;
}

.common-back {
  min-height: 100vh;
  background: linear-gradient(to bottom, #FFA652, #EEA562, #F6EADF);
  font-family: 'Inter', sans-serif;
}

</style>
