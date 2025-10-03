<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="home-page">
    <DateSelector @date-selected="handleDateSelected" />
    <ImminentMatches
      :imminentMatches="matchStore.imminentMatches"
      @apply-click="handleApplyClick"
    />

    <!-- dailyMatches가 비어있을 때 -->
    <div v-if="matchStore.dailyMatches.length === 0" class="no-matches">
      <img src="@/assets/pokemon(1).png" alt="경기 없음" />
      <p>아직 등록된 경기가 없습니다.</p>
    </div>

    <!-- dailyMatches가 있을 때 -->
    <DailyMatches
      v-else
      :dailyMatches="matchStore.dailyMatches"
      @apply-click="handleApplyClick"
      @change-page="changePage"
    />
  </div>
</template>


<script setup>
import DailyMatches from '@/modules/match/components/DailyMatches.vue';
import DateSelector from '@/modules/match/components/DateSelector.vue';
import ImminentMatches from '@/modules/match/components/ImminentMatches.vue';
import { useMatchApplicationStore } from '@/modules/match/stores/matchApplicationStore';
import { useMatchStore } from '@/modules/match/stores/matchStore';
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

  const matchStore = useMatchStore();
  const matchApplicationStore = useMatchApplicationStore();
  const currentRoute = useRoute();
  const router = useRouter();
  const today = new Date().toISOString().slice(0, 10);
  const selectedDate = ref(today); 

  const handleDateSelected = (newDate) => {
    console.log('자식에게서 받은 날짜:', newDate); // 'YYYY-MM-DD'
    
    selectedDate.value = newDate;

    matchStore.fetchDailyMatches(selectedDate.value, 1, 10);
  };

  const changePage = ({page, totalPages}) => {
    if(page >= 1 && page <= totalPages) {
      router.push({name: 'matches', query: {page}});
    } 
  };

  const handleApplyClick = async (match) => {
    try {
        if (!confirm('경기에 신청하시겠습니까?')) {
            return;
        }
        console.log(match);

        const [startTime, endTime] = match.matchTime
          .split('-')
          .map(time => time.trim().replace(/(\d{2})(\d{2})/, '$1:$2'));
        
        const applicationData = {
            sport: match.sport,
            region: match.region,
            matchDate: match.matchDate,
            startTime,
            endTime,
            genderOption: match.genderOption
        };

        console.log(applicationData);
        
        const result = await matchApplicationStore.addMatchApplication(applicationData);

        if (result.code === 201) {
            alert('정상적으로 신청되었습니다.');

            router.push({ name: 'matchApplications' });
        }
    } catch (error) {
        const { status, message } = error.response.data;
        if (status === 'DUPLICATE_MATCH_APPLICATION') {
            alert(message);
        } else if (status === 'REFRESH_TOKEN_INVALID') {
            router.push({ name: 'login' });
        } else {
            alert('로그인이 필요합니다!');
        }
    }
  };

  onMounted (async () => {
    try {
      matchStore.pageInfo.currentPage = parseInt(currentRoute.query.page) || 1;
      
      await matchStore.fetchImminentMatches();      
      await matchStore.fetchDailyMatches(today, matchStore.pageInfo.currentPage, 10);
    } catch (error) {
      console.log(error.response.data);
      const {status, message} = error.response.data;
      
      if(status === 'MATCH_NOT_FOUND') {
        alert(message);

      } else if(status === 'REFRESH_TOKEN_INVALID') {
        router.push({name: 'login'});
      } else if(status === 'INTERNAL_SERVER_ERROR') {
        alert('에러가 발생했습니다.')
      }
    }
  });
</script>

<style scoped>
.home-page {
  margin-left: 4em;
  margin-right: 4em;
  margin-top: 2em;
}

/* 없을 때 보여줄 박스 */
.no-matches {
  margin-top: 4rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

/* 이미지 크기 */
.no-matches img {
  max-width: 150px;
  opacity: 0.9;
  margin-bottom: 1rem;
}

/* 텍스트 */
.no-matches p {
  font-size: 1rem;
  font-weight: 500;
  color: #555;
}
</style>

