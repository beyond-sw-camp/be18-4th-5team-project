<template>
    <main class="common-back">
        <match-application-table 
            :matchApplications="matchApplicationStore.matchApplications"
            @item-click="itemClick"
            @cancel-click="cancelClick"/>
        <page-nation 
            :page-info="matchApplicationStore.pageInfo"
            @change-page="changePage"/>
    </main>
</template>

<script setup>
import { onMounted } from 'vue';
import MatchApplicationTable from '../tables/MatchApplicationTable.vue';
import PageNation from '../common/PageNation.vue';
import { onBeforeRouteUpdate, useRoute, useRouter } from 'vue-router';
import { useMatchApplicationStore } from '../stores/matchApplicationStore';

    const matchApplicationStore = useMatchApplicationStore();
    const currentRoute = useRoute();
    const router = useRouter();

    const changePage = ({page, totalPages}) => {
        if(page >= 1 && page <= totalPages) {
            router.push({name: 'matchApplications', query: {page}});
        } 
    };

    // const itemClick = (no) => {
    //     router.push({name: 'departments/no', params: {no}});
    // };

    const cancelClick = async (no) => {
        try {
            if(confirm('정말로 취소하시겠습니까?')) {
                const result = await matchApplicationStore.cancelMatchApplication(no);

                if(result.code === 200) {
                    alert('정상적으로 취소되었습니다.');

                    await matchApplicationStore.fetchMatchApplications(matchApplicationStore.pageInfo.currentPage, 10);
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

    onMounted(async () => {
        try {
            matchApplicationStore.pageInfo.currentPage = parseInt(currentRoute.query.page) || 1;
            
            await matchApplicationStore.fetchMatchApplications(matchApplicationStore.pageInfo.currentPage, 10);
        } catch (error) {
            const {status, message} = error.response.data;

            if(status === 'MATCH_APPLICATION_NOT_FOUND') {
                alert(message);

                router.push({name: 'MatchApplications'});
            } else if(status === 'REFRESH_TOKEN_INVALID') {
                router.push({name: 'login'});
            } else if(status === 'INTERNAL_SERVER_ERROR') {
                alert('에러가 발생했습니다.')
            }
        }
    });

    onBeforeRouteUpdate(async (to) => {
        try {
            matchApplicationStore.pageInfo.currentPage = parseInt(to.query.page) || 1;

            await matchApplicationStore.fetchMatchApplications(matchApplicationStore.pageInfo.currentPage, 10);
        } catch (error) {
            const {status, message} = error.response.data;

            if(status === 'DEPARTMENT_NOT_FOUND') {
                alert(message);

                router.push({name: 'MatchApplications'});
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