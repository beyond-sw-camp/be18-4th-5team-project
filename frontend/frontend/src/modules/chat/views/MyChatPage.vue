<template>
  <div class="page-wrap">
    <div class="gradient-bg"></div>

    <div class="card">
      <h2 class="card-title">내 채팅 목록</h2>

      <!-- 탭 -->
      <div class="tabs">
        <button class="tab" :class="{ active: tab === 'friend' }" @click="tab = 'friend'">친구 채팅</button>
        <button class="tab" :class="{ active: tab === 'group' }" @click="tab = 'group'">매칭 그룹</button>
      </div>

      <!-- 테이블 -->
      <div class="table-wrap">
        <table class="table">
          <thead>
            <tr>
              <th>채팅방 이름</th>
              <th class="center">읽지 않은 메시지</th>
            </tr>
          </thead>

          <tbody v-if="tab === 'friend'">
            <tr v-for="chat in friendRooms" :key="chat.roomId">
              <td class="name-cell"><span class="room-name">{{ chat.roomName }}</span></td>
              <td class="center">
                <span class="badge" v-if="chat.unReadCount > 0">{{ chat.unReadCount }}</span>
                <span v-else class="muted">0</span>
              </td>
              <td class="center actions">
                <button class="btn primary" @click="openDrawer(chat.roomId)">입장</button>
                <button class="btn" disabled>나가기</button>
              </td>
            </tr>
            <tr v-if="friendRooms.length === 0">
              <td colspan="3" class="empty">친구 채팅방이 없습니다.</td>
            </tr>
          </tbody>

          <tbody v-else>
            <tr v-for="chat in groupRooms" :key="chat.roomId">
              <td class="name-cell"><span class="room-name">{{ chat.roomName }}</span></td>
              <td class="center">
                <span class="badge" v-if="chat.unReadCount > 0">{{ chat.unReadCount }}</span>
                <span v-else class="muted">0</span>
              </td>
              <td class="center actions">
                <button class="btn primary" @click="openDrawer(chat.roomId)">입장</button>
                <button class="btn danger outline" @click="leaveChatRoom(chat.roomId)">나가기</button>
              </td>
            </tr>
            <tr v-if="groupRooms.length === 0">
              <td colspan="3" class="empty">매칭 그룹 채팅방이 없습니다.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- 👉 오른쪽 드로어 -->
    <div v-if="drawerOpen" class="drawer-root">
      <div class="drawer-scrim" @click="closeDrawer"></div>

      <aside class="drawer-panel" role="dialog" aria-modal="true">
        <header class="drawer-header">
          <div class="drawer-title">{{selectedRoomName}}</div>
          <button class="icon-btn" @click="closeDrawer">×</button>
        </header>
        <ChatRoom v-if="selectedRoomId" :key="selectedRoomId" :room-id="selectedRoomId" :initial-unread="selectedUnread" />
      </aside>
    </div>
  </div>
</template>

<script>
import ChatRoom from "./StompChatPage.vue";
import api from "@/api/axios";

export default {
  name: "MyChatPage",
  components: {ChatRoom},
  data() {
    return {
      tab: "friend",
      friendRooms: [],
      groupRooms: [],
      drawerOpen: false,
      selectedRoomId: null,
      selectedRoomName: "",
      selectedUnread: 0,
    };
  },
  async created() {
    const response = await api.get(
      `/api/v1/chatrooms/my/rooms`
    );
    const allRooms = response.data.items || [];

    this.friendRooms = allRooms.filter(
      (chat) => chat.isGroupChat === "N" || chat.isGroupChat === false
    );
    this.groupRooms = allRooms.filter(
      (chat) => chat.isGroupChat === "Y" || chat.isGroupChat === true
    );

    const qid = this.$route.query.roomId;
    if (qid) this.openDrawer(qid);

    window.addEventListener("keydown", this.onKeydown);
  },
  beforeUnmount() {
    window.removeEventListener("keydown", this.onKeydown);
  },
  methods: {
    openDrawer(roomId) {
      const chat = [...this.friendRooms, ...this.groupRooms].find(c => c.roomId === roomId);
      this.selectedRoomId = roomId;
      this.selectedRoomName = chat ? chat.roomName : "채팅";
      this.selectedUnread = chat?.unReadCount || 0;
      this.drawerOpen = true;
      document.body.style.overflow = "hidden"; // 스크롤 잠금
      if (chat) {
        chat.unReadCount = 0;
      }
    },
    closeDrawer() {
      this.drawerOpen = false;
      this.selectedRoomId = null; // 언마운트 → 소켓 정리
      this.selectedRoomName = "";
      document.body.style.overflow = "";
    },
    onKeydown(e) {
      if (e.key === "Escape" && this.drawerOpen) this.closeDrawer();
    },
    async leaveChatRoom(roomId) {
      const ok = window.confirm("정말로 나가시겠습니까?\n나가면 매칭이 취소됩니다.");
      if (!ok) return;
      try {
        await api.delete(`/api/v1/chatrooms/group/${roomId}/leave`);
        this.groupRooms = this.groupRooms.filter(c => c.roomId !== roomId);
        if (this.selectedRoomId === roomId) this.closeDrawer();
      } catch (error) {
        const {status, message} = error.response.data;

        if(status === 'USER_NOT_FOUND'){
          alert(message);
        }else if(status === 'CHATROOM_NOT_GROUP'){
          alert(message);
        }else if(status === 'COMPLETED_MATCH_NOT_FOUND') {
          alert(message);
        }
      }
      
    },
  },
};
</script>

<style scoped>
/* ==== 레이아웃 & 배경 ==== */
.page-wrap {
  min-height: 100vh;
  position: relative;
  background: linear-gradient(180deg, #fbd1a2 0%, #f3a25c 55%, #f0a460 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 32px;
}

.gradient-bg {
  position: absolute;
  inset: 0;
  background: radial-gradient(1200px 600px at 20% 20%, #ffffff55, transparent 60%),
              radial-gradient(1000px 500px at 80% 10%, #ffffff33, transparent 60%);
  pointer-events: none;
}

/* ==== 중앙 카드 ==== */
.card {
  width: min(1100px, 96vw);
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 10px 28px rgba(0, 0, 0, 0.12);
  padding: 24px;
}

.card-title {
  margin: 4px 0 16px;
  text-align: center;
  font-weight: 700;
  font-size: 22px;
}

/* ==== 탭 ==== */
.tabs {
  display: inline-flex;
  background: #f3f4f6;
  border-radius: 999px;
  padding: 4px;
  gap: 6px;
  margin-bottom: 14px;
}

.tab {
  border: none;
  background: transparent;
  padding: 8px 16px;
  border-radius: 999px;
  font-weight: 600;
  cursor: pointer;
}

.tab.active {
  background: linear-gradient(180deg, #ffb467, #f59b44);
  color: #fff;
  box-shadow: 0 6px 14px rgba(245, 155, 68, 0.35);
}

/* ==== 테이블 ==== */
.table-wrap {
  width: 100%;
  overflow-x: auto;
}

.table {
  width: 100%;
  border-collapse: collapse;
  background: #fff;
}

.table thead th {
  text-align: left;
  font-weight: 700;
  padding: 14px 12px;
  border-bottom: 2px solid #f0f0f0;
  color: #374151;
  white-space: nowrap;
}

.table tbody td {
  padding: 14px 12px;
  border-bottom: 1px solid #f3f4f6;
  vertical-align: middle;
}

.name-cell .room-name {
  font-weight: 600;
  color: #111827;
}

.center {
  text-align: center;
}

.empty {
  text-align: center;
  padding: 28px 12px;
  color: #6b7280;
}

/* ==== 뱃지 ==== */
.badge {
  display: inline-block;
  min-width: 24px;
  padding: 2px 8px;
  border-radius: 999px;
  background: #ef4444;
  color: #fff;
  font-size: 12px;
  font-weight: 700;
}

.muted {
  color: #9ca3af;
}

/* ==== 버튼 ==== */
.btn {
  appearance: none;
  border: 1px solid #e5e7eb;
  background: #fff;
  color: #111827;
  padding: 8px 14px;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  margin: 0 4px;
  transition: transform 0.03s ease-in-out, box-shadow 0.15s ease;
}

.btn:active { transform: translateY(1px); }
.btn:disabled { opacity: 0.5; cursor: not-allowed; }

.btn.primary {
  border-color: transparent;
  background: linear-gradient(180deg, #ffb467, #f59b44);
  color: #fff;
  box-shadow: 0 6px 14px rgba(245, 155, 68, 0.35);
}

.btn.danger {
  background: #ef4444;
  color: #fff;
  border-color: #ef4444;
}

.btn.outline {
  background: #fff;
  color: #ef4444;
  border-color: #ef4444;
}

.drawer-root{ position:fixed; inset:0; z-index:60; display:flex; justify-content:flex-end; }
.drawer-scrim{ position:absolute; inset:0; background:rgba(0,0,0,.35); }
.drawer-panel{
  position:relative; height:100%; width:min(860px, 92vw);
  background:#fff; box-shadow:-8px 0 24px rgba(0,0,0,.15);
  animation: slideIn .18s ease-out;
  display:flex; flex-direction:column; border-left:1px solid #eee;
  min-height: 0;
}
.drawer-panel > .chat-room {
  flex: 1;
  min-height: 0;               /* 내부 .chat-box가 스크롤을 먹도록 필수 */
}
@keyframes slideIn { from { transform: translateX(30px); opacity:.6;} to { transform:none; opacity:1;} }
.drawer-header{ display:flex; align-items:center; justify-content:space-between; padding:12px 16px; border-bottom:1px solid #eee; }
.drawer-title{ font-weight:800; }
.icon-btn{ border:none; background:transparent; font-size:24px; line-height:1; cursor:pointer; padding:4px; }

/* ==== 반응형 ==== */
@media (max-width: 720px) {
  .card { padding: 18px; }
  .table thead { display: none; }
  .table tr { display: grid; grid-template-columns: 1fr; padding: 10px 0; }
  .table tbody td { border: none; padding: 6px 0; }
  .center { text-align: left; }
}
</style>
