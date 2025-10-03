<template>
  <main class="common-back">
    <completed-match-table 
      :completedMatches="matchStore.completedMatches"
      @cancel-click="cancelClick"
      @add-result-click="addResultClick"/>
    <page-nation 
      :page-info="matchStore.pageInfo"
      @change-page="changePage"/>
  </main>
</template>

<script setup>
import { onMounted } from 'vue';
import { useRoute, useRouter, onBeforeRouteUpdate } from 'vue-router';
import { useMatchStore } from '../stores/matchStore';
import CompletedMatchTable from '../tables/CompletedMatchTable.vue';
import PageNation from '../common/PageNation.vue';

  const matchStore = useMatchStore();
  const currentRoute = useRoute();
  const router = useRouter();

  const changePage = ({page, totalPages}) => {
    if(page >= 1 && page <= totalPages) {
      router.push({name: 'matches', query: {page}});
    } 
  };

  onMounted(async () => {
    try {
      matchStore.pageInfo.currentPage = parseInt(currentRoute.query.page) || 1;
            
      await matchStore.fetchCompletedMatches(matchStore.pageInfo.currentPage, 10);
    } catch (error) {
      console.log(error.response.data);
      const {status, message} = error.response.data;
      
      if(status === 'MATCH_NOT_FOUND') {
        alert(message);

        router.push({name: 'completedMatches'});
      } else if(status === 'REFRESH_TOKEN_INVALID') {
        router.push({name: 'login'});
      } else if(status === 'INTERNAL_SERVER_ERROR') {
        alert(message)
      }
    }
  });

  const cancelClick = async (matchId, roomId) => {
    try {

      if(confirm('정말로 취소하시겠습니까?')) {
      const result = await matchStore.cancelCompletedMatch(matchId, roomId);

      if(result.code === 200) {
        alert('정상적으로 취소되었습니다.');

        await matchStore.fetchCompletedMatches(matchStore.pageInfo.currentPage, 10);
        await matchStore.fetchMatches(matchStore.pageInfo.currentPage, 10);
      }
    }
    } catch (error) {
      const {status, message} = error.response.data;

      if(status === 'MATCH_APPLICATION_NOT_FOUND') {
        alert(message);

      } else if(status === 'REFRESH_TOKEN_INVALID') {
        router.push({name: 'login'});
      } else if(status === 'INTERNAL_SERVER_ERROR') {
        alert('에러가 발생했습니다.')
      }
    }
  };

  const addResultClick = (matchId) => {
    router.push({ name: 'addMatchResult', params: { matchId } });
  };

  onBeforeRouteUpdate(async (to) => {
    try {
      matchStore.pageInfo.currentPage = parseInt(to.query.page) || 1;

      await matchStore.fetchCompletedMatches(matchStore.pageInfo.currentPage, 10);
    } catch (error) {
      const {status, message} = error.response.data;

      if(status === 'MATCH_APPLICATION_NOT_FOUND') {
        alert(message);

        router.push({name: 'completedMatches'});
      } else if(status === 'REFRESH_TOKEN_INVALID') {
        router.push({name: 'login'});
      } else if(status === 'INTERNAL_SERVER_ERROR') {
        alert('에러가 발생했습니다.')
      }
    }
  });
</script>

<style lang="scss" scoped>
.common-back {
  min-height: 100vh;
  background: linear-gradient(to bottom, #FFA652, #EEA562, #F6EADF);
  font-family: 'Inter', sans-serif;
}
</style>