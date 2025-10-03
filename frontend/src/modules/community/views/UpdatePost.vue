<template>
  <div class="update-post-container">
    <h1>게시글 수정</h1>

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
        <!-- 기존 첨부파일 -->
        <li v-for="(file, index) in existingAttachments" :key="file.attachmentId">
          <a :href="file.fileUrl" target="_blank" class="file-name">{{ file.originalName }}</a>
          <button type="button" class="delete-file-btn" @click="removeExistingAttachment(index)">✕</button>
        </li>
        <!-- 새로 추가된 파일 -->
        <li v-for="(file, index) in newFiles" :key="index">
          <span class="file-name">{{ file.name }}</span>
          <button type="button" class="delete-file-btn" @click="newFiles.splice(index,1)">✕</button>
        </li>
      </ul>
    </div>

    <!-- 버튼 -->
    <div class="form-actions">
      <button class="submit-btn" @click="updatePost">저장</button>
      <button class="cancel-btn" type="button" @click="$router.push(`/community/posts/${postId}`)">취소</button>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";

export default {
  setup() {
    const route = useRoute();
    const router = useRouter();
    const postId = route.params.postId;
    const token = localStorage.getItem("accessToken");

    const title = ref("");
    const content = ref("");
    const categoryId = ref("");
    const categories = ref([
      { id: 1, name: "자유게시판" },
      { id: 2, name: "질문게시판" },
      { id: 3, name: "정보공유게시판" },
    ]);
    const existingAttachments = ref([]);
    const newFiles = ref([]);
    const deletedAttachmentIds = ref([]);

    const fetchPost = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8080/api/v1/community/posts/${postId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const post = Array.isArray(res.data.items) ? res.data.items[0] : res.data.items;
        title.value = post.title;
        content.value = post.content;
        categoryId.value = post.categoryId;
        existingAttachments.value = post.attachments || [];
      } catch (err) {
        console.error("게시글 로딩 실패", err);
      }
    };

    const handleFilesUpload = (e) => {
      newFiles.value = [...newFiles.value, ...Array.from(e.target.files)];
    };

    const removeExistingAttachment = (index) => {
      deletedAttachmentIds.value.push(existingAttachments.value[index].attachmentId);
      existingAttachments.value.splice(index, 1);
    };

    const updatePost = async () => {
      try {
        const formData = new FormData();
        const updateData = {
          title: title.value,
          content: content.value,
          categoryId: categoryId.value,
          attachmentIds: existingAttachments.value.map(f => f.attachmentId),
          deleteAttachmentIds: deletedAttachmentIds.value
        };
        formData.append(
          "updatePostRequestDto",
          new Blob([JSON.stringify(updateData)], { type: "application/json" })
        );
        newFiles.value.forEach(file => formData.append("files", file));

        await axios.put(
          `http://localhost:8080/api/v1/community/posts/${postId}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data"
            }
          }
        );
        alert("게시글이 수정되었습니다.");
        router.push(`/community/posts/${postId}`);
      } catch (err) {
        console.error("게시글 수정 실패", err);
        alert("게시글 수정에 실패했습니다.");
      }
    };

    onMounted(fetchPost);

    return {
      title,
      content,
      categoryId,
      categories,
      existingAttachments,
      newFiles,
      deletedAttachmentIds,
      handleFilesUpload,
      removeExistingAttachment,
      updatePost,
      postId
    };
  }
};
</script>

<style scoped>
.update-post-container {
  max-width: 700px;
  margin: 40px auto;
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
  box-shadow: 0 0 0 2px rgba(26,115,232,0.2);
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

.file-name {
  word-break: break-all;
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
</style>
