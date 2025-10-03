import { defineStore } from "pinia";
import { reactive, ref } from "vue";
import api from "@/api/axios";

export const useMatchApplicationStore = defineStore('matchApplication', () => {
    const matchApplications = ref([]);
    const pageInfo = reactive({
        currentPage: 1, // 현재 페이지 번호
        totalCount: 0,  // 전체 데이터 수
        pageLimit: 5,   // 페이지네이션에 보이는 페이지 수
        listLimit: 5    // 한 페이지에 표시될 리스트의 수
    });

    const fetchMatchApplications = async (page, numOfRows) => {
        const response = await api.get(`/api/v1/match-service/me/match-applications?page=${page}&numOfRows=${numOfRows}`);

        matchApplications.value = response.data.items;
        pageInfo.totalCount = response.data.totalCount;
        pageInfo.listLimit = numOfRows;
    };

    const addMatchApplication = async (matchApplication) => {
        const response = await api.post('/api/v1/match-service/match-applications', matchApplication);

        return response.data;
    };

    const cancelMatchApplication = async (applicationId) => {
        const response = await api.delete(`/api/v1/match-service/match-applications/${applicationId}`);
        
        return response.data;
    };

    return { matchApplications, pageInfo, fetchMatchApplications, addMatchApplication, cancelMatchApplication };
});