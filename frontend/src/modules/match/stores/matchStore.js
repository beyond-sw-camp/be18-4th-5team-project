import { defineStore } from "pinia";
import { reactive, ref } from "vue";
import api from "@/api/axios";

export const useMatchStore = defineStore('match', () => {
  const matches = ref([]);
  const completedMatches = ref([]);
  const imminentMatches = ref([]);
  const dailyMatches = ref([]);

  const matchResults = ref([]);

  const pageInfo = reactive({
    currentPage: 1, // 현재 페이지 번호
    totalCount: 0,  // 전체 데이터 수
    pageLimit: 5,   // 페이지네이션에 보이는 페이지 수
    listLimit: 5    // 한 페이지에 표시될 리스트의 수
  });

  const fetchMatches = async (page, numOfRows) => {
    const response = await api.get(`/api/v1/match-service/me/matches`);

    matches.value = response.data.items;
    pageInfo.totalCount = response.data.totalCount;
    pageInfo.listLimit = numOfRows;
  };

  const fetchCompletedMatches = async (page, numOfRows) => {
    const response = await api.get('/api/v1/match-service/completed-matches');

    completedMatches.value = response.data.items;
    pageInfo.totalCount = response.data.totalCount;
    pageInfo.listLimit = numOfRows;  
  }

  const fetchImminentMatches = async () => {
    const response = await api.get('/api/v1/match-service/imminent-matches');
    
    imminentMatches.value = response.data; 
  }

  const fetchDailyMatches = async (date, page, numOfRows) => {
    const response = await api.get('/api/v1/match-service/matches-by-date', {params: {date:date}});

    dailyMatches.value = response.data.items;
    pageInfo.totalCount = response.data.totalCount;
    pageInfo.listLimit = numOfRows; 
  }

  const fetchMatchResults = async () => {
    try {
      const response = await api.get('/api/v1/match-service/match-results');  

      matchResults.value = response.data.items;
    } catch (error) {
      console.error('경기 결과 불러오기 실패:', error);
      matchResults.value = null;
    }
  };


    const cancelCompletedMatch = async (matchId, roomId) => {
        

        const response = await api.delete(`/api/v1/chatrooms/group/${roomId}/leave`);
        

        
        console.log(response.data);
        
        
        return response.data
    };
  const addMatchResult = async (matchId, matchResult) => {
    const response = await api.post(`/api/v1/match-service/completed-matches/${matchId}/match-results`, matchResult);

    return response.data;
  };

  return { matches, completedMatches, imminentMatches, dailyMatches, matchResults, pageInfo, 
    fetchMatches, fetchCompletedMatches, fetchImminentMatches, fetchDailyMatches, fetchMatchResults, addMatchResult, cancelCompletedMatch };
});