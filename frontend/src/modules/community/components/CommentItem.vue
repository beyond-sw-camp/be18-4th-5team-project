<template>
  <li>
    <div class="comment-main">
      <strong>{{ comment.userNickname }}</strong>:
      <span>{{ comment.content }}</span>
      <small>{{ formatDate(comment.createdAt) }}</small>
      <div class="comment-actions">
        <button @click="replying = !replying">답글</button>
        <button @click="$emit('edit-comment', comment.commentId)">수정</button>
        <button @click="$emit('delete-comment', comment.commentId)">삭제</button>
      </div>
    </div>

    <!-- 답글 입력 -->
    <div v-if="replying" class="reply-form">
      <input v-model="replyText" placeholder="답글 입력" />
      <button @click="submitReply">등록</button>
      <button @click="replying = false">취소</button>
    </div>

    <!-- 재귀적으로 대댓글 렌더링 -->
    <ul v-if="comment.replies?.length" class="replies-list">
      <CommentItem
        v-for="reply in comment.replies"
        :key="reply.commentId"
        :comment="reply"
        @add-reply="$emit('add-reply', $event)"
        @delete-comment="$emit('delete-comment', $event)"
        @edit-comment="$emit('edit-comment', $event)"
      />
    </ul>
  </li>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import CommentItem from './CommentItem.vue';
import axios from 'axios';
import { useRoute } from 'vue-router';

const { comment } = defineProps<{
  comment: {
    commentId: number;
    userNickname: string;
    content: string;
    createdAt: string;
    replies: any[];
    author: boolean;
  };
}>();

const emit = defineEmits(['add-reply', 'delete-comment', 'edit-comment']);

const replyText = ref('');
const replying = ref(false);

const route = useRoute();
const postId = route.params.postId;
const token = localStorage.getItem('accessToken');

const formatDate = (dateStr: string) => new Date(dateStr).toLocaleString();

// 답글 등록
const submitReply = async () => {
  if (!replyText.value.trim()) return;
  try {
    const res = await axios.post(
      `http://localhost:8080/api/v1/community/posts/${postId}/comments/${comment.commentId}/replies`,
      { content: replyText.value },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    emit('add-reply', { parentId: comment.commentId, reply: res.data });
    replyText.value = '';
    replying.value = false;
  } catch (err) {
    console.error('대댓글 작성 실패', err);
  }
};
</script>

<style scoped>
.comment-main {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 5px;
}

.comment-actions button {
  margin-left: 5px;
  font-size: 0.8em;
  cursor: pointer;
}

.reply-form {
  margin: 5px 0 10px 20px;
}

.replies-list {
  padding-left: 20px;
  margin-top: 5px;
}
</style>
