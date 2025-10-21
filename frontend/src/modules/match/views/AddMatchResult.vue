<template>
  <main class="page-background">
    <div class="form-background">
      <MatchResultForm
        :init-form-data="initFormData"
        @form-submit="formSubmit"/>
    </div>
  </main>
</template>

<script setup>
import { reactive } from 'vue';
import { useMatchStore } from '../stores/matchStore';
import { useRouter, useRoute } from 'vue-router';
import MatchResultForm from '../components/MatchResultForm.vue';

    const router = useRouter();
    const route = useRoute(); 
    const matchStore = useMatchStore(); 
    const matchId = route.params.matchId; 

    const initFormData = reactive({
      score: '',
      winner: '',
      resultNote: ''
    });

    const formSubmit = async (formData) => {
      console.log(matchId);
      console.log(formData);
      
      
        if (!matchId) {
          alert('유효하지 않은 접근입니다.');
          return;
        }
        try {
            const result = await matchStore.addMatchResult(matchId, formData);

            console.log(result);
            console.log(result.code);
            
            

            if(result.code === 200) {
                alert('경기 결과 등록이 완료되었습니다!');

                router.push({name: 'completedMatches'});
            }
        } catch(error) {
            console.error('Error submitting match result:', error);
            const { status, message } = error.response?.data || {};

            if(status === 'BAD_REQUEST') {
                alert('입력 내용을 확인해주세요.');
            } else if(status === 'REFRESH_TOKEN_INVALID') {
                router.push({name: 'Login'});
            } else if (status === 'MATCH_RESULT_ALREADY_EXISTS') {
                alert(message || '이미 경기 결과가 등록되었습니다.');
            } else {
                alert('에러가 발생했습니다.');
            }
    };
  }
</script>

<style lang="scss" scoped>
.page-background {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(to bottom, #FFA652, #EEA562, #F6EADF);
  font-family: 'Inter', sans-serif;
}

.form-background {
  padding: 1em;
  border-radius: 30px;
  display: flex;
  align-content: center;
  background-color: #F6F4F2;
}

</style>