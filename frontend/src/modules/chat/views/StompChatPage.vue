<template>
  <div class="chat-layout">
    <!-- 좌측 참여자 목록 -->
    <aside class="members">
      <div class="members-header">참여자</div>
      <ul class="members-list">
        <li v-for="nick in members" :key="nick" :class="{ me: nick === senderNickname }">
          <div class="avatar">{{ initials(nick) }}</div>
          <div class="nick">
            {{ nick }}
            <span v-if="nick === senderNickname" class="me-badge">나</span>
          </div>
        </li>
        <li v-if="members.length === 0" class="empty">참여자 정보가 없습니다.</li>
      </ul>
    </aside>

    <!-- 우측 대화 영역 -->
    <section class="conversation">
      <div class="chat-box">
        <div
          v-for="(m, i) in messages"
          :key="i"
          class="msg"
          :class="{ me: isMe(m), other: !isMe(m) }"
        >
          <div v-if="!isMe(m)" class="avatar">{{ initials(m.senderNickname) }}</div>

          <div class="msg-body">
            <div v-if="!isMe(m)" class="name">{{ m.senderNickname }}</div>
            <div class="bubble">{{ m.message }}</div>
            <div class="time">{{ formatTime(m.createdAt) }}</div>
          </div>
        </div>
      </div>

      <div class="input-row">
        <VotePanel :room-id="effectiveRoomId" />
        <input
          class="input flex1"
          v-model="newMessage"
          placeholder="메시지를 입력하세요"
          @keyup.enter="sendMessage"
        />
        <button class="btn primary" @click="sendMessage">전송</button>
      </div>
    </section>
  </div>
</template>


<script>
import SockJS from 'sockjs-client'
import Stomp from 'webstomp-client'
import api from '@/api/axios'
import VotePanel from '../components/VotePanel.vue'
const API = 'http://localhost:8080'

export default {
  name: 'ChatRoom',
  components: { VotePanel },
  props: { roomId: { type: [String, Number], default: null },
           initialUnread: { type: Number, default: 0 }
          },

  data() {
    return {
      messages: [],
      newMessage: '',
      stompClient: null,
      subscription: null,
      token: '',
      senderNickname: null,
      roomDeleted: false,   
      cleaned: false,       
      members: [],
      _didInitialScroll: false,
    }
  },
  computed: {
    // 드로어에서 props로 주거나, 라우팅으로 들어오는 경우 모두 지원
    effectiveRoomId() {
      return this.roomId || this.$route.params.roomId
    },
  },
  async created() {
    this.senderNickname = localStorage.getItem('nickname') || ''
    const { data } = await api.get(
      `/api/v1/chatrooms/history/${this.effectiveRoomId}`
    )
    this.messages = data.items || []
    await this.loadMembers().catch(() => {})
    if(this.members.length === 0) this.buildMembersFromMessages();

    this.$nextTick(() => this.scrollToInitial())

    this.connectWebsocket()
  },
  beforeRouteLeave(to, from, next) {
    this.cleanup().finally(() => next())
  },
  beforeUnmount() {
    this.cleanup()
  },
  methods: {
    isMe(m) {
      return m.senderNickname === this.senderNickname
    },
    scrollToInitial() {
      if (this._didInitialScroll) return;
      const box = this.$el.querySelector('.chat-box');
      if (!box) return;
 
      const unread = Math.max(0, this.initialUnread || 0);
      if (unread > 0 && this.messages.length >= unread) {
        const targetIndex = this.messages.length - unread; // 첫 unread의 index
        const nodes = box.querySelectorAll('.msg');
        const target = nodes[targetIndex];
        if (target) {
          target.scrollIntoView({ block: 'start' });
          this._didInitialScroll = true;
          return;
        }
      }
      // unread가 없거나 타겟을 못 찾으면 기본: 맨 아래
      box.scrollTop = box.scrollHeight;
      this._didInitialScroll = true;
    },
    isNearBottom(box, threshold = 40) {
      return box.scrollHeight - (box.scrollTop + box.clientHeight) <= threshold;
    },
    connectWebsocket() {
      if (this.stompClient?.connected) return
      const sockJs = new SockJS(`${API}/ws/chat`)
      this.stompClient = Stomp.over(sockJs)
      this.token = localStorage.getItem('accessToken') || ''

      this.stompClient.connect(
        { Authorization: `Bearer ${this.token}` },
        () => {
          const topic = `/sub/chat/${this.effectiveRoomId}`
          this.subscription = this.stompClient.subscribe(
            topic,
            (message) => {
              let body
              try {
                body = JSON.parse(message.body)
              } catch {
                body = { senderNickname: '시스템', message: message.body }
              }
              if (body.type === 'ROOM_DELETED') {
                this.roomDeleted = true;
                const msg = body.message || '매칭이 취소되어 채팅방이 사라졌습니다.';
                sessionStorage.setItem('global_notice', msg);
                this.$router.replace('/');
                return;
              }
              this.messages.push(body)
              if(body.senderNickname && !this.members.includes(body.senderNickname)){
                this.members.push(body.senderNickname);
              }
              this.$nextTick(() => {
                const box = this.$el.querySelector('.chat-box');
                if (!box) return;
                // 초기 스크롤이 아직이면 초기 규칙 우선
                if (!this._didInitialScroll) {
                  this.scrollToInitial();
                  return;
                }
                // 이후에는: 내가 보낸 메시지거나, 사용자가 거의 바닥이라면 자동 스틱
                if (this.isMe(body) || this.isNearBottom(box)) {
                  box.scrollTop = box.scrollHeight;
                }
              })
            },
            { Authorization: `Bearer ${this.token}` }
          )
        }
      )
    },
    sendMessage() {
      const text = this.newMessage.trim()
      if (!text) return
      const payload = { senderNickname: this.senderNickname, message: text }
      this.stompClient?.send(
        `/pub/chat/${this.effectiveRoomId}`,
        JSON.stringify(payload)
      )
      this.newMessage = ''
    },
    async cleanup() {
      if(this.cleaned) return
      this.cleaned = true;
      try {
        if (!this.roomDeleted) {
          await api.post(`/api/v1/chatrooms/${this.effectiveRoomId}/read`)
        }
      } catch (e) {const s = e?.response?.status
        if (s !== 404 && s !== 410) {
          // console.debug('mark read failed', e)
        };}
      try {
        this.subscription?.unsubscribe()
      } catch {
        //
      }
      try {
        this.stompClient?.disconnect()
      } catch {
        //
      }
    },
    initials(name) {
      return (name || '?').trim().charAt(0).toUpperCase();
    },
    formatTime(iso) {
      if (!iso) return '';
      const d = new Date(iso);
      if (Number.isNaN(d.getTime())) return '';
      const h = d.getHours(), m = `${d.getMinutes()}`.padStart(2,'0');
      const ampm = h >= 12 ? 'PM' : 'AM'; const hh = h % 12 || 12;
      return `${ampm} ${hh}:${m}`;
    },
    async loadMembers() {
      const {data} = await api.get(`/api/v1/chatrooms/${this.effectiveRoomId}/users`);
      const arr = data.items || data.item || data || []
      this.members = arr.map(m => m.nickname ?? m).filter(Boolean);
    },
    buildMembersFromMessages() {
      const set = new Set(this.messages.map(m => m.senderNickname).filter(Boolean))
      this.members = Array.from(set)
    },
  },
}
</script>

<style scoped>
.chat-room { display: flex; flex-direction: column; height: 100%; background: #fff; min-height:0; }

/* 메시지 영역 */
.chat-box {
  flex: 1;
  min-height:0;
  overflow-y: auto;
  padding: 12px;
  border-bottom: 1px solid #eee;
}
.msg{
  display:flex; gap:10px; align-items:flex-end; margin:14px 0;
}
.msg.other{ justify-content:flex-start; }
.msg.me{ justify-content:flex-end; }

/* 아바타(이니셜) */
.avatar{
  width:36px; height:36px; border-radius:50%;
  display:flex; align-items:center; justify-content:center;
  background:#f0f2f5; color:#555; font-weight:800; font-size:14px;
  border:1px solid #e5e7eb;
}

/* 본문 스택 */
.msg-body{ max-width:min(65%, 560px); display:flex; flex-direction:column; }
.msg.me .msg-body{ align-items:flex-end; }

/* 보낸이 이름/시간 */
.name{ font-size:12px; color:#6b7280; margin:0 0 4px 4px; }
.time{ font-size:11px; color:#9ca3af; margin-top:4px; }

/* 말풍선 */
.bubble{
  position:relative;
  padding:10px 14px; line-height:1.5; word-break:break-word;
  border-radius:14px; box-shadow:0 1px 1.5px rgba(0,0,0,.06);
}
.msg.other .bubble{
  background:#fff; border:1px solid #e5e7eb;
}
.msg.me .bubble{
  background:#eef1f4; border:1px solid #e3e6ea;
}

/* 꼬리(Tail) */
.msg.other .bubble::after{
  content:''; position:absolute; left:-6px; bottom:0;
  width:12px; height:12px; background:#fff;
  border-left:1px solid #e5e7eb; border-bottom:1px solid #e5e7eb;
  transform:rotate(45deg);
}
.msg.me .bubble::after{
  content:''; position:absolute; right:-6px; bottom:0;
  width:12px; height:12px; background:#eef1f4;
  border-right:1px solid #e3e6ea; border-bottom:1px solid #e3e6ea;
  transform:rotate(45deg);
}

/* 입력줄 */
.input-row {
  display: flex; align-items: center; gap: 8px;
  padding: 12px; border-top: 1px solid #eee;
  position: sticky;
  bottom: 0;
  background: #fff;        /* 뒤 내용 비치지 않게 */
  z-index: 1;
}
.input { border: 1px solid #e5e7eb; border-radius: 10px; padding: 10px 12px; }
.input:focus { outline: none; border-color: #f59b44; box-shadow: 0 0 0 3px #f59b4444; }
.flex1 { flex: 1; }

/* 버튼 */
.btn { border: 1px solid #e5e7eb; border-radius: 10px; padding: 8px 14px; font-weight: 700; cursor: pointer; }
.btn.primary { border-color: transparent; background: linear-gradient(180deg,#ffb467,#f59b44); color: #fff; }

/* 전체 2열 레이아웃 */
.chat-layout{
  display: grid;
  grid-template-columns: 240px 1fr; /* 좌측 패널 240px */
  height: 100%;
  min-height: 0;
  background: #fff;
}

/* 좌측 참여자 패널 */
.members{
  border-right: 1px solid #eee;
  padding: 12px;
  overflow-y: auto;
  min-height: 0;
}
.members-header{
  font-weight: 800;
  margin: 4px 0 10px;
}
.members-list{
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 6px;
}
.members-list li{
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 8px;
  border-radius: 10px;
}
.members-list li.me{
  background: #fff6ef; /* 내 닉네임 하이라이트 */
}
.members-list .nick{
  font-weight: 600;
  color: #111827;
}
.me-badge{
  margin-left: 6px;
  font-size: 11px;
  padding: 2px 6px;
  border-radius: 999px;
  background: #ffd8b0;
  color: #7a3a00;
}
.members-list .empty{
  color: #9ca3af;
}

/* 우측 대화 영역 */
.conversation{
  display: flex;
  flex-direction: column;
  min-width: 0;
  min-height: 0;
}

/* 반응형: 작은 화면에서는 참여자 패널 숨김 */
@media (max-width: 860px){
  .chat-layout{ grid-template-columns: 1fr; }
  .members{ display: none; }
}

</style>
