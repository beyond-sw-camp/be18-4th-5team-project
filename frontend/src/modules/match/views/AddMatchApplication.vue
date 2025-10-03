<template>
  <main class="page-background">
    <div class="form-background">
      <MatchApplicationForm
        :init-form-data="initFormData"
        :sports="sportStore.sports"
        @form-submit="formSubmit"/>
    </div>
  </main>
</template>

<script setup>
import MatchApplicationForm from '../components/MatchApplicationForm.vue';
import { reactive, onMounted } from 'vue';
import { useMatchApplicationStore } from '../stores/matchApplicationStore';
import { useRouter } from 'vue-router';
import { useSportStore } from '../stores/sportStore';

    const router = useRouter();
    const sportStore = useSportStore();
    const matchApplicationStore = useMatchApplicationStore();

    const initFormData = reactive({
        sport: '',
        region: '',
        matchDate: '',
        startTime: '',
        endTime: '',
        genderOption: ''
    });

    const formSubmit = async (formData) => {
        try {
          console.log(formData);
          
            const result = await matchApplicationStore.addMatchApplication(formData);
            console.log(result);
            
            console.log(result.code);
            
            console.log(result.data);
            

            if(result.code === 201) {
                alert('신청이 완료되었습니다!.');

                router.push({name: 'matchApplications'});
            }
        } catch(error) {
            const {status, message} = error.response.data;

            if(status === 'BAD_REQUEST') {
                alert('제대로 입력해 주세요.');
            } else if(status === 'REFRESH_TOKEN_INVALID') {
                router.push({name: 'Login'});
            } else if(status === 'INTERNAL_SERVER_ERROR') {
                alert('에러가 발생했습니다.');
            } else if(status === 'SPORT_NOT_FOUND') {
                alert(message);
            } else if(status === 'CANNOT_APPLY_MATCH') {
                alert(message);
            } else if(status === 'INVALID_MATCH_TIME') {
                alert(message);
            } else if(status === 'DUPLICATE_MATCH_APPLICATION') {
                alert(message);
            } else if(status === 'INVALID_GENDER_OPTION') {
                alert(message);
            } 
    };
  }

    onMounted (async () => {
        await sportStore.fetchSports();
    });
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