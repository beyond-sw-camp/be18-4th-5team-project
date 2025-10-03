<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <main class="common-back">
    <match-table 
      :matches="matchStore.matches"
      @cancel-click="cancelClick"/>
    <page-nation 
      :page-info="matchStore.pageInfo"
      @change-page="changePage"/>
  </main>
</template>

<script setup>
import { onMounted } from 'vue';
import { useRoute, useRouter, onBeforeRouteUpdate } from 'vue-router';
import { useMatchStore } from '../stores/matchStore';
import MatchTable from '../tables/MatchTable.vue';
import PageNation from '../common/PageNation.vue';
import { useMatchApplicationStore } from '../stores/matchApplicationStore';

  const matchStore = useMatchStore();
  const matchApplicationStore = useMatchApplicationStore();
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
            
      await matchStore.fetchMatches(matchStore.pageInfo.currentPage, 10);
    } catch (error) {
      console.log(error.response.data);
      const {status, message} = error.response.data;
      
      if(status === 'MATCH_NOT_FOUND') {
        alert(message);

        router.push({name: 'matches'});
      } else if(status === 'REFRESH_TOKEN_INVALID') {
        router.push({name: 'login'});
      } else if(status === 'INTERNAL_SERVER_ERROR') {
        alert('에러가 발생했습니다.')
      }
    }
  });

  const cancelClick = async (no) => {
    try {
      if(confirm('정말로 취소하시겠습니까?')) {
        const result = await matchApplicationStore.cancelMatchApplication(no);

      if(result.code === 200) {
        alert('정상적으로 취소되었습니다.');

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

  onBeforeRouteUpdate(async (to) => {
    try {
      matchStore.pageInfo.currentPage = parseInt(to.query.page) || 1;

      await matchStore.fetchMatches(matchStore.pageInfo.currentPage, 10);
    } catch (error) {
      const {status, message} = error.response.data;

      if(status === 'MATCH_APPLICATION_NOT_FOUND') {
        alert(message);

        router.push({name: 'Matches'});
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