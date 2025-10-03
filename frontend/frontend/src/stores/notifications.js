// src/stores/notification.js
import { defineStore } from 'pinia'
import api from '@/api/axios'

const CACHE_KEY = 'notif:lastCount'

const SSE_URL = (token) =>
  `http://localhost:8080/api/v1/sse/notifications?token=${encodeURIComponent(token)}`

export const useNotificationStore = defineStore('notifications', {
  state: () => ({
    unreadCount: Number(localStorage.getItem(CACHE_KEY) ?? 0),
    es: null,                 // EventSource
    connected: false,
    bootstrapped: false,
    reconnectTimer: null,
    reconnectDelay: 2000,     // 2s → 4s → 8s … 최대 30s
    maxReconnectDelay: 30000,
  }),

  getters: {
    hasUnread: (s) => s.unreadCount > 0,
  },

  actions: {
    _setCount(n){
      this.unreadCount = Number(n || 0)
      localStorage.setItem(CACHE_KEY, String(this.unreadCount))
    },
    /** 앱 시작/로그인 직후 호출: 서버 truth로 카운트 싱크 + SSE 연결 */
    async init() {
      const token = localStorage.getItem('accessToken')
      if (!token) { this.disconnectSSE(false); return }
      await this.bootstrapBadge()
      this.connectSSE()
    },

    /** 서버에서 읽지 않은 개수 가져옴 (앱 시작/재로그인/재연결 시) */
    async bootstrapBadge() {
      try {
        const { data } = await api.get('/api/v1/notifications/unread-count')
        if (typeof data?.count === 'number') this._setCount(data.count)
      } catch (e) {
        console.warn('unread-count 실패:', e)
      } finally{
        this.bootstrapped = true;
      }
    },

    /** SSE 연결 (이미 연결돼 있으면 스킵) */
    connectSSE() {
      const token = localStorage.getItem('accessToken')
      if (!token || this.es) return

      if (this.es) {
        try { this.es.close() } catch {alert('오류')}
        this.es = null
      }

      const es = new EventSource(SSE_URL(token))
      this.es = es

      es.onopen = () => {
        this.connected = true
        this._clearReconnect()
        // 연결/재연결 때 서버 truth로 싱크 (선택)
        this.bootstrapBadge()
      }

      const onNew = (e) => {
        try {
          const payload = JSON.parse(e.data)
          this._setCount(this.unreadCount + 1)
          window.dispatchEvent(new CustomEvent('notifications:new', { detail: payload }))
        } catch {
          // no-op
        }
      }
      es.addEventListener('match-confirmed', onNew)
      es.addEventListener('match-cancelled', onNew)
      es.addEventListener('toggle-like', onNew)
      es.addEventListener('post-commented', onNew)
      es.addEventListener('comment-replied', onNew)
      es.addEventListener('request-match-result', onNew)
      es.addEventListener('friend-request', onNew)

      es.onerror = () => {
        this.connected = false
        this._scheduleReconnect()
      }
    },

    /** 수동 종료(로그아웃 등). reset=true면 배지도 0으로 */
    disconnectSSE() {
      if (this.es) {
        try { this.es.close() } catch { alert('')}
        this.es = null
      }
      this.connected = false
      this._clearReconnect()
      this.bootstrapped = false
    },

    resetState() {
      this.disconnectSSE()
      // this._setCount(0)
      // bootstrapped은 false로 유지 → 다음 init에서 정상 플로우
      localStorage.removeItem('notif:lastCount')
    },

    /** 모든 알림 읽음 처리(있으면 사용) */
    async markAllRead() {
      try {
        await api.post('/api/v1/notifications/read-all')
        this._setCount(0)
      } catch (e) {
        console.error('markAllRead 실패:', e)
      }
    },

    /** 토큰이 갱신되면 새 토큰으로 재연결하고 카운트 재동기화 */
    async refreshConnectionAfterTokenChange() {
      this.disconnectSSE()
      await this.init()
    },

    // ----- 내부: 재연결 로직 -----
    _scheduleReconnect() {
      if (this.reconnectTimer) return
      const delay = this.reconnectDelay
      this.reconnectTimer = setTimeout(() => {
        this.reconnectTimer = null
        this.reconnectDelay = Math.min(this.reconnectDelay * 2, this.maxReconnectDelay)
        this.connectSSE()
      }, delay)
    },
    _clearReconnect() {
      if (this.reconnectTimer) {
        clearTimeout(this.reconnectTimer)
        this.reconnectTimer = null
      }
      this.reconnectDelay = 2000
    },
  },
})
