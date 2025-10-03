import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from "@/api/axios";

export const useSportStore = defineStore('sport', () => {
  const sports = ref([])

  const fetchSports = async () => {
    try {
      const response = await api.get('/api/v1/match-service/sport')
      sports.value = response.data
    } catch (err) {
      console.error('스포츠 목록 불러오기 실패:', err)
    }
  }

  return { sports, fetchSports }
})
