<template>
  <!-- [+] 메뉴 버튼 -->
  <v-menu v-model="actionsMenu" :close-on-content-click="true">
    <template #activator="{ props }">
      <v-btn v-bind="props" icon="mdi-plus" variant="text" class="mr-1" />
    </template>

    <v-list>
      <v-list-item @click="openCreateVote">
        <v-list-item-title>투표 만들기</v-list-item-title>
      </v-list-item>
      <v-list-item @click="openVoteList">
        <v-list-item-title>투표 목록</v-list-item-title>
      </v-list-item>
      <v-list-item disabled>
        <v-list-item-title>파일 첨부 (준비중)</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>

  <!-- [D1] 투표 만들기 -->
  <v-dialog v-model="createVoteDialog" max-width="520">
    <v-card>
      <v-card-title>투표 만들기</v-card-title>
      <v-card-text>
        <v-text-field v-model="newVote.title" label="제목" />
        <v-textarea
          v-model="newVote.optionsText"
          label="옵션 (콤마/줄바꿈 구분)"
          rows="3"
          hint="예) 오전 8시, 오후 2시, 저녁 7시"
          persistent-hint
        />
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn variant="text" @click="createVoteDialog=false">취소</v-btn>
        <v-btn color="primary" @click="createVote">생성</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- [D2] 투표 목록 -->
  <v-dialog v-model="voteListDialog" max-width="560">
    <v-card>
      <v-card-title>진행 중 투표</v-card-title>
      <v-card-text>
        <v-alert v-if="votes.length===0" type="info" variant="tonal">진행 중인 투표가 없습니다.</v-alert>
        <v-list v-else>
          <v-list-item
            v-for="v in votes"
            :key="v.voteId"
            :title="v.title"
            :subtitle="formatDate(v.createdAt)"
          >
            <template #append>
              <v-btn size="small" class="mr-2" @click="openCastVote(v)">투표</v-btn>
              <v-btn size="small" variant="tonal" @click="openResult(v)">결과 보기</v-btn>
            </template>
          </v-list-item>
        </v-list>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn @click="voteListDialog=false">닫기</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- [D3] 투표하기 -->
  <v-dialog v-model="castDialog" max-width="520">
    <v-card>
      <v-card-title>{{ activeVote?.title }}</v-card-title>
      <v-card-text>
        <v-radio-group v-model="selectedOption">
          <v-radio v-for="opt in parsedOptions(activeVote)" :key="opt" :label="opt" :value="opt" />
        </v-radio-group>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn variant="text" @click="castDialog=false">취소</v-btn>
        <v-btn color="primary" :disabled="!selectedOption" @click="castVote">투표하기</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- [D4] 결과 보기 -->
  <v-dialog v-model="resultDialog" max-width="520">
    <v-card>
      <v-card-title>{{ activeVote?.title }} - 결과</v-card-title>
      <v-card-text>
        <div v-if="Object.keys(voteResult).length===0">아직 결과가 없습니다.</div>
        <div v-else>
          <div v-for="opt in parsedOptions(activeVote)" :key="opt" class="mb-3">
            <div class="d-flex align-center justify-space-between mb-1">
              <span>{{ opt }}</span><b>{{ voteResult[opt] || 0 }}</b>
            </div>
            <v-progress-linear :model-value="percent(opt)" height="10" rounded />
          </div>
        </div>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn @click="resultDialog=false">닫기</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import api from '@/api/axios'
const API = 'http://localhost:8080'

export default {
  name: 'VotePanel',
  props: { roomId: { type: [String, Number], required: true } },
  data() {
    return {
      actionsMenu: false,
      createVoteDialog: false,
      voteListDialog: false,
      castDialog: false,
      resultDialog: false,

      newVote: { title: '', optionsText: '' },
      votes: [],
      activeVote: null,
      selectedOption: null,
      voteResult: {},
    }
  },
  computed: { apiBase() { return API } },
  methods: {
    openCreateVote() { this.actionsMenu=false; this.createVoteDialog=true },
    async createVote() {
      const options = this.newVote.optionsText.split(/[\n,]/).map(s=>s.trim()).filter(Boolean)
      if (!this.newVote.title || options.length===0) return
      try {
        await api.post(`/api/v1/vote/chatrooms/${this.roomId}`, { title: this.newVote.title, options });
        this.createVoteDialog=false;
        this.newVote={ title:'', optionsText:'' };
        this.openVoteList();
      } catch (error) {
        const {status, message} = error.response.data;

        if(status === 'CHATROOM_NOT_FOUND'){
          alert(message);
          this.$router.push('/chatrooms/lis');
        }else if(status === 'VOTE_INVALID_INPUT'){
          alert(message);
        }
      }
      
      
    },
    async openVoteList() {
      this.actionsMenu=false
      const { data } = await api.get(`/api/v1/vote/chatrooms/${this.roomId}`)
      this.votes = data.items?.[0] || []
      this.voteListDialog=true
    },
    openCastVote(v) { this.activeVote=v; this.selectedOption=null; this.castDialog=true },
    async castVote() {
      try {
        await api.post(`/api/v1/vote/${this.activeVote.voteId}/vote`, { selectedOption: this.selectedOption })
        this.castDialog=false
        await this.openResult(this.activeVote)
      } catch (error) {
        const {status, message} = error.response.data;

        if(status === 'VOTE_NOT_FOUND'){
          alert(message);
        }else if(status === 'ALREADY_CASTED_VOTE'){
          alert(message);
        }
      }
      
    },
    async openResult(v) {
      this.activeVote=v
      try {
        const { data } = await api.get(`/api/v1/vote/${v.voteId}/results`)
        this.voteResult = data.items?.[0] || {}
        this.resultDialog=true
      } catch (error) {
        const {status, message} = error.response.data;

        if(status === 'VOTE_NOT_FOUND'){
          alert(message);
        }
      }
      
    },
    parsedOptions(vote) {
      if (!vote || !vote.options) return []
      if (Array.isArray(vote.options)) return vote.options
      try { return JSON.parse(vote.options) } catch { return [] }
    },
    percent(opt) {
      const total = Object.values(this.voteResult||{}).reduce((a,b)=>a+b,0)
      return total ? Math.round(((this.voteResult[opt]||0)/total)*100) : 0
    },
    formatDate(dt) { try { return new Date(dt).toLocaleString() } catch { return dt } },
  }
}
</script>
