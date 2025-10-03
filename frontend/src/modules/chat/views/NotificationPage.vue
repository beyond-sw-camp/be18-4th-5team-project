<!-- NotificationPage.vue -->
<template>
  <div class="page-wrap">
    <div class="gradient-bg"></div>

    <div class="container">
      <!-- 상단 헤더 -->
      <div class="header-row">
        <h2 class="title">알림</h2>
        <div class="header-actions">
        </div>
      </div>

      <!-- 비어있을 때 -->
      <div v-if="notifications.length === 0" class="empty-card">
        <div class="empty-icon">🔔</div>
        <div class="empty-text">알림이 없습니다.</div>
      </div>

      <!-- 알림 리스트 -->
      <ul v-else class="list">
        <li
          v-for="n in notifications"
          :key="n.notificationId ?? n.createdAt"
          class="notif"
          :class="{ unread: !n.readAt }"
        >
          <div class="left">
            <div v-if="!n.readAt" class="dot" aria-hidden="true"></div>
            <div class="icon">🔔</div>
          </div>

          <div class="content">
            <div class="line1">
              <h3 class="notif-title">{{ n.title }}</h3>
              <time class="time">{{ formatTime(n.createdAt) }}</time>
            </div>

            <p class="body">{{ n.body }}</p>

            <div class="actions">
              <button
                v-if="n.chatRoomId"
                class="btn primary"
                @click="openChat(n)"
              >
                채팅 열기
              </button>
              <button
                class="btn danger outline"
                @click="deleteNotification(n.notificationId)"
              >
                삭제
              </button>
            </div>
          </div>
        </li>
        <li v-if="!last" ref="sentinel" class="sentinel">
          <div v-if="loading" class="loading">불러오는 중…</div>
        </li>
      </ul>

        <!-- 폴백: 더 보기 버튼 (옵셔널) -->
        <div v-if="!last" class="load-more">
          <button class="btn" :disabled="loading" @click="loadNext">
            {{ loading ? '불러오는 중…' : '더 보기' }}
          </button>
        </div>{{ errorMsg }}</div>
    </div>
</template>

<script>
import api from '@/api/axios'
import { useNotificationStore } from '@/stores/notifications'

export default {
  name: 'NotificationPage',
  data(){ 
    return { 
      notifications: [],
      page: 0,
      size: 5,
      totalCount: 0,
      loading: false,
      last: false,
      errorMsg: '',
      io:null
    } },
  methods: {
    formatTime(iso) {
      if (!iso) return ''
      const d = new Date(iso)
      if (Number.isNaN(d.getTime())) return iso
      return d.toLocaleString('ko-KR', {
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit', hour12: false
      })
    },
    // async loadList(){
    //   const { data } = await api.get(`/api/v1/notifications`)
    //   this.notifications = data.items || []
    // },
    async loadNext(){
      if(this.loading || this.last) return
      this.loading = true
      this.errorMsg = ''
      try {
        const { data } = await api.get(`/api/v1/notifications`, {
          params: {page: this.page, size: this.size, sort: 'createdAt,DESC'}
        })
        const items = data.items ?? []
        if(typeof data?.totalCount === 'number') {
          this.totalCount = data.totalCount
        }
        const seen = new Set(this.notifications.map(n=> n.notificationId))
        for(const it of items) {
          if (!seen.has(it.notificationId)) {
           this.notifications.push(it)
           seen.add(it.notificationId)
         }
        }
        const nextPage = this.page + 1
        if (typeof this.totalCount === 'number' && this.totalCount > 0) {
         this.last = (nextPage * this.size) >= this.totalCount
       } else {
         // 백엔드 totalCount 없을 때의 안전장치
         this.last = items.length < this.size
       }
        this.page = nextPage
      } catch (error) {
        console.error('알림 페이지 로딩 실패:', error)
       this.errorMsg = error?.response?.data?.message || error.message || '로딩 실패'
      } finally {
        this.loading = false
      }
    },
    setupInfiniteScroll(){
     const target = this.$refs.sentinel
     if (!target || this.io) return
     if (!('IntersectionObserver' in window)) return
    this.io = new IntersectionObserver((entries) => {
       entries.forEach(entry => {
         if (entry.isIntersecting) this.loadNext()
       })
     }, { root: null, rootMargin: '200px 0px', threshold: 0 })
     this.io.observe(target)
   },

   teardownInfiniteScroll(){
     if (this.io) {
       this.io.disconnect()
       this.io = null
     }
   },
    async markAllRead(){
      const notif = useNotificationStore();
      await notif.markAllRead();
    },
    async openChat(n) {
      if (!n.chatRoomId) return
      try {
        await api.get(`/api/v1/chatrooms/${n.chatRoomId}/exists`);
        // 쿼리로 방 번호 전달 → MyChatPage에서 openDrawer(roomId) 자동 실행
        this.$router.push({ path: '/chatrooms/list', query: { roomId: n.chatRoomId } })
      } catch (error) {
        const {status, message} = error.response.data;

        if(status === 'USER_NOT_FOUND'){
          alert(message);
          await this.deleteNotification(n.notificationId);
        }else if(status === 'CHATROOM_NOT_FOUND'){
          alert(message);
          await this.deleteNotification(n.notificationId);
        }else if(status === 'NOT_CHAT_MEMBER') {
          alert(message);
          await this.deleteNotification(n.notificationId);
        }
      }
      
    },
    async deleteNotification(notificationId) {
      try {
        await api.delete(`/api/v1/notifications/${notificationId}`);
        this.notifications = this.notifications.filter(n => n.notificationId !== notificationId)
      } catch (error){
        const {status, message} = error.response.data;

        if(status === 'NOTIFICATION_NOT_FOUND'){
          alert(message);
        }else if(status === 'FORBIDDEN_NOTIFICATION_DELETE'){
          alert(message);
        }
      }
    }
  },
  async mounted(){
    // await this.loadList()
    // await this.markAllRead()   // ✅ 페이지 들어오면 즉시 전체 읽음
    await this.loadNext()      // 첫 페이지 로드
    this.setupInfiniteScroll() // 무한스크롤 시작
    await this.markAllRead()   // 정책: 페이지 입장 시 전체 읽음
  },
  beforeUnmount(){
   this.teardownInfiniteScroll()
 }
}
</script>

<style scoped>

.page-wrap{
  min-height:100vh; position:relative;
  background: linear-gradient(180deg,#fbd1a2 0%,#f3a25c 55%,#f0a460 100%);
  display:flex; align-items:center; justify-content:center; padding:32px;
}
.gradient-bg{
  position:absolute; inset:0; pointer-events:none;
  background:
    radial-gradient(1200px 600px at 20% 20%, #ffffff55, transparent 60%),
    radial-gradient(900px 500px at 80% 10%, #ffffff33, transparent 60%);
}

/* ===== 컨테이너 카드 ===== */
.container{
  width:min(1000px,96vw);
  background:#fff; border-radius:18px; padding:20px;
  box-shadow:0 12px 28px rgba(0,0,0,.15);
}

/* 상단 타이틀/액션 */
.header-row{ display:flex; align-items:center; justify-content:space-between; margin-bottom:10px; }
.title{ font-size:22px; font-weight:800; }
.header-actions{ display:flex; gap:8px; }

/* ===== 리스트 ===== */
.list{ list-style:none; padding:0; margin:0; display:grid; gap:12px; }
.notif{
  display:grid; grid-template-columns:48px 1fr; gap:12px;
  background:#fff; border:1px solid #eee; border-radius:14px; padding:14px 16px;
  box-shadow:0 6px 14px rgba(0,0,0,.05);
}
.notif.unread{
  border-color:#f59b44;
  box-shadow:0 8px 18px rgba(245,155,68,.18);
}

/* 왼쪽 아이콘/점 */
.left{ position:relative; display:flex; align-items:center; justify-content:center; }
.icon{
  width:36px; height:36px; border-radius:50%;
  display:flex; align-items:center; justify-content:center;
  background: #fff6ef; border:1px solid #ffd7b3;
  font-size:18px;
}
.dot{
  position:absolute; top:-2px; right:-2px; width:10px; height:10px; border-radius:50%;
  background:#ff5a1f; box-shadow:0 0 0 2px #fff;
}

/* 본문 */
.content{ display:flex; flex-direction:column; gap:6px; }
.line1{ display:flex; align-items:baseline; justify-content:space-between; gap:8px; }
.notif-title{ margin:0; font-size:16px; font-weight:800; color:#111827; }
.time{ font-size:12px; color:#6b7280; white-space:nowrap; }
.body{ margin:0; color:#374151; }

/* 액션 버튼 */
.actions{ display:flex; gap:8px; margin-top:6px; }
.btn{
  appearance:none; border:1px solid #e5e7eb; background:#fff; color:#111827;
  padding:8px 12px; border-radius:10px; font-weight:700; cursor:pointer;
  transition:transform .03s ease-in-out, box-shadow .15s ease;
}
.btn:active{ transform:translateY(1px); }
.btn.primary{
  border-color:transparent; background:linear-gradient(180deg,#ffb467,#f59b44); color:#fff;
  box-shadow:0 6px 14px rgba(245,155,68,.35);
}
.btn.danger{ background:#ef4444; color:#fff; border-color:#ef4444; }
.btn.outline{ background:#fff; color:#ef4444; border-color:#ef4444; }
.btn.ghost{ background:#f6f7f9; }

/* 비어있을 때 카드 */
.empty-card{
  display:flex; flex-direction:column; align-items:center; justify-content:center;
  gap:6px; padding:36px; border:1px dashed #e5e7eb; border-radius:14px; background:#fff;
}
.empty-icon{ font-size:24px; }
.empty-text{ color:#6b7280; }

/* 반응형 */
@media (max-width:640px){
  .header-row{ flex-direction:column; align-items:flex-start; gap:10px; }
  .actions{ flex-wrap:wrap; }
}
.unread{ background:#f8fbff; }
.empty{ color:#6b7280; padding:16px; }
 .sentinel { list-style:none; padding:12px; text-align:center; }
 .loading { color:#6b7280; font-size:14px; }
 .load-more { display:flex; gap:12px; align-items:center; justify-content:center; margin-top:12px; }
 .error { color:#ef4444; font-size:13px; }
</style>
