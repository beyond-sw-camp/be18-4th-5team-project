<template>
  <div class="post-detail-container">
    <!-- 게시글 카드 -->
    <div class="post-card">
      <h1 class="post-title">{{ post.title }}</h1>

      <div class="post-author-info">
        <div class="author-left">
          <img
            :src="resolveProfileImage(post.userProfileImage)"
            alt="프로필"
            class="profile-img"
          />
          <span class="author-name">{{ post?.userNickname || '알 수 없음' }}</span>
        </div>
        <span class="updated-time">
          {{ formatDate(post?.updatedAt) }}
          <span v-if="post?.updated" class="edited-label">(수정됨)</span>
        </span>
      </div>

      <div class="post-content">{{ post?.content || '내용이 없습니다.' }}</div>

      <div class="post-actions-author" v-if="post?.author">
        <button @click="$router.push({ name: 'update-post', params: { postId } })">✏ 수정</button>
        <button @click="deletePost" :disabled="deleting">🗑 삭제</button>
      </div>

      <div class="post-actions">
        <button @click="toggleLike" class="like-btn" :disabled="liking">
          <span :class="{'liked': post?.isLiked}">❤️</span>
          <span class="like-count">{{ post?.likeCount || 0 }}</span>
        </button>
      </div>

      <div class="attachments" v-if="post?.attachments?.length">
        <a
          v-for="file in post.attachments"
          :key="file.attachmentId"
          :href="`http://localhost:8080${file.fileUrl}`"
          target="_blank"
          rel="noopener"
        >
          📎 {{ file.originalName }}
        </a>
      </div>
    </div>

    <!-- 이전/다음 글 -->
    <div class="post-navigation">
      <div class="neighbor-card previous-post" v-if="neighbors.previous?.postId">
        <router-link
          :to="{ name: 'post-detail', params: { postId: neighbors.previous.postId }, query: route.query }"
        >
          <span class="arrow">←</span>
          <span class="label">이전 글</span>
          <span class="title">{{ neighbors.previous.title }}</span>
        </router-link>
      </div>
      <div class="neighbor-card previous-post" v-else>
        <span>이전 글이 없습니다.</span>
      </div>

      <div class="neighbor-card next-post" v-if="neighbors.next?.postId">
        <router-link
          :to="{ name: 'post-detail', params: { postId: neighbors.next.postId }, query: route.query }"
        >
          <span class="label">다음 글</span>
          <span class="title">{{ neighbors.next.title }}</span>
          <span class="arrow">→</span>
        </router-link>
      </div>
      <div class="neighbor-card next-post" v-else>
        <span>다음 글이 없습니다.</span>
      </div>
    </div>

    <!-- 댓글 입력 -->
    <div class="comment-input">
      <input v-model="newComment" placeholder="댓글을 입력해주세요." />
      <button @click="addComment" :disabled="postingComment">등록</button>
    </div>

    <!-- 댓글 리스트 -->
    <ul class="comments-section">
      <CommentNode
        v-for="comment in comments"
        :key="comment.commentId"
        :comment="comment"
        :post-id="postId || 0"
        :token="token || ''"
        @refresh-comments="fetchPost"
      />
    </ul>
  </div>
</template>

<script>
import { ref, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import defaultProfile from '@/assets/default_profile.png'
import axios from "axios";
import CommentNode from "../components/CommentNode.vue";

export default {
  components: { CommentNode },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const postId = ref(route.params.postId);

    const post = ref({});
    const comments = ref([]);
    const newComment = ref("");
    const token = localStorage.getItem("accessToken") || "";
    const neighbors = ref({ previous: {}, next: {} });

    const liking = ref(false);
    const deleting = ref(false);
    const postingComment = ref(false);

    const formatDate = (dateStr) => {
      const date = new Date(dateStr);
      return isNaN(date) ? "" : date.toLocaleString();
    };

    function resolveProfileImage(path) {
        if (!path) {
            return defaultProfile
        }
        if (path.startsWith('http')) {
            return path
        }
        return `http://localhost:8080${path}`
    };

    // 게시글 불러오기
    const fetchPost = async (id = postId.value, query = route.query) => {
      try {
        const res = await axios.get(`http://localhost:8080/api/v1/community/posts/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
          params: query,
        });
        post.value = Array.isArray(res.data.items) ? res.data.items[0] : res.data.items || {};
        comments.value = (post.value.comments || []).map((c) => ({ ...c, replies: c.replies || [] }));
      } catch (err) {
        console.error("게시글 로딩 실패", err);
        alert("게시글을 불러오는데 실패했습니다.");
      }
    };

    // 이전/다음 글 불러오기
    const fetchNeighbors = async (id = postId.value) => {
      try {
        const category = route.query.category || null;
        const res = await axios.get(
          `http://localhost:8080/api/v1/community/posts/${id}/neighbors`,
          { headers: { Authorization: `Bearer ${token}` }, params: { category } }
        );
        neighbors.value = {
          previous: res.data?.previous || {},
          next: res.data?.next || {},
        };
      } catch (err) {
        console.error("이전/다음글 로딩 실패", err);
        neighbors.value = { previous: {}, next: {} };
      }
    };

    // 댓글 작성
    const addComment = async () => {
      if (!newComment.value.trim()) return;
      postingComment.value = true;
      try {
        const res = await axios.post(
          `http://localhost:8080/api/v1/community/posts/${postId.value}/comments`,
          { content: newComment.value },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        comments.value.push(res.data);
        newComment.value = "";
      } catch (err) {
        console.error("댓글 작성 실패", err);
        alert("댓글 작성에 실패했습니다.");
      } finally {
        postingComment.value = false;
      }
    };

    // 좋아요
    const toggleLike = async () => {
      if (liking.value) return;
      liking.value = true;
      try {
        await axios.post(
          `http://localhost:8080/api/v1/community/posts/${postId.value}/like`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        fetchPost();
      } catch (err) {
        console.error("좋아요 실패", err);
        alert("좋아요를 누르는데 실패했습니다.");
      } finally {
        liking.value = false;
      }
    };

    // 게시글 삭제
    const deletePost = async () => {
      if (!confirm("정말 삭제하시겠습니까?")) return;
      deleting.value = true;
      try {
        await axios.delete(`http://localhost:8080/api/v1/community/posts/${postId.value}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert("게시글이 삭제되었습니다.");
        router.push({ name: "posts" });
      } catch (err) {
        console.error("게시글 삭제 실패", err);
        alert("게시글 삭제에 실패했습니다.");
      } finally {
        deleting.value = false;
      }
    };

    onMounted(() => {
      fetchPost();
      fetchNeighbors();
    });

    watch(
      () => route.params.postId,
      (newId) => {
        postId.value = newId;
        fetchPost(newId, route.query);
        fetchNeighbors(newId);
      }
    );

    return {
      post,
      comments,
      newComment,
      postId,
      token,
      neighbors,
      route,
      formatDate,
      resolveProfileImage,
      fetchPost,
      addComment,
      toggleLike,
      deletePost,
      liking,
      deleting,
      postingComment,
    };
  },
};
</script>


<style scoped>
.post-detail-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Noto Sans', sans-serif;
}

.post-card {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  padding: 25px 30px;
  margin-bottom: 30px;
  transition: transform 0.2s;
}

.post-card:hover {
  transform: translateY(-2px);
}

.post-title {
  font-size: 28px;
  font-weight: 700;
  color: #222;
  border-bottom: 2px solid #eee;
  padding-bottom: 12px;
  margin-bottom: 15px;
}

/* 작성자 정보 */
.post-author-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  font-size: 14px;
  color: #888;
}

.author-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.profile-img {
  width: 35px;
  height: 35px;
  border-radius: 50%;
  object-fit: cover;
}

.author-name {
  font-weight: 500;
  color: #333;
}

.updated-time {
  font-size: 13px;
  color: #aaa;
}

/* 내용 */
.post-content {
  font-size: 16px;
  line-height: 1.6;
  color: #444;
  margin-bottom: 20px;
  min-height: 250px;
  max-height: 400px;
  overflow-y: auto;
}

/* 작성자 버튼 */
.post-actions-author {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-bottom: 15px;
}

.post-actions-author button {
  background: none;
  border: none;
  font-size: 16px;
  cursor: pointer;
  color: #555;
  transition: color 0.2s;
}

.post-actions-author button:hover {
  color: #1a73e8;
}

/* 좋아요 버튼 */
.post-actions {
  display: flex;
  justify-content: center;
  margin-bottom: 25px;
}

.like-btn {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 22px;
  background-color: #ffe6e6;
  color: #e74c3c;
  border: none;
  border-radius: 50px;
  padding: 12px 24px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s;
}

.like-btn:hover {
  transform: scale(1.1);
  background-color: #ffcccc;
}

.like-btn .liked {
  animation: heartbeat 0.3s ease;
}

.like-count {
  font-size: 16px;
}

@keyframes heartbeat {
  0% { transform: scale(1); }
  25% { transform: scale(1.3); }
  50% { transform: scale(1); }
  75% { transform: scale(1.2); }
  100% { transform: scale(1); }
}

/* 첨부파일 */
.attachments {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 25px;
}

.attachments a {
  background: #f2f2f2;
  padding: 6px 12px;
  border-radius: 6px;
  color: #555;
  text-decoration: none;
  font-size: 14px;
  transition: background 0.2s;
}

.attachments a:hover {
  background: #e0e0e0;
}

/* 댓글 입력 */
.comment-input {
  display: flex;
  gap: 12px;
  margin-bottom: 30px;
}

.comment-input input {
  flex: 1;
  padding: 12px 14px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 8px;
}

.comment-input button {
  padding: 12px 20px;
  font-size: 14px;
  border: none;
  background-color: #1a73e8;
  color: #fff;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s;
}

.comment-input button:hover {
  background-color: #1558b0;
}

.comments-section {
  list-style: none;
  padding: 0;
}

.post-navigation {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  margin: 20px 0;
  flex-wrap: wrap;
}

.neighbor-card {
  flex: 1 1 48%;
  background-color: #f9f9f9;
  border-radius: 12px;
  padding: 16px 20px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  transition: transform 0.2s, box-shadow 0.2s;
}

.neighbor-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0,0,0,0.12);
}

.neighbor-card a {
  display: flex;
  align-items: center;
  text-decoration: none;
  color: #333;
  font-weight: 500;
}

.neighbor-card .arrow {
  font-size: 20px;
  margin-right: 10px;
  color: #1a73e8;
}

.next-post .arrow {
  margin-left: 10px;
  margin-right: 0;
}

.neighbor-card .label {
  font-size: 13px;
  color: #888;
  margin-right: 6px;
}

.neighbor-card .title {
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.neighbor-card span {
  display: block;
  text-align: center;
  color: #444;              /* 연한 회색 */
  font-weight: 500;
  padding: 12px 0;
  border-radius: 8px;
  background-color: #fafafa;
  transition: background 0.2s, color 0.2s;
}

</style>