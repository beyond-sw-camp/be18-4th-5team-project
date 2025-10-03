import api from "@/api/axios";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useUsersStore = defineStore('user', () => {
    const users = ref([]);

    const getSearchUsersByNickname = async (nickname) => {
        const response = await api.get('/api/v1/users/search', {params: {nickname}} )
        console.log(response);
        users.value = response.data.items;
    };

    const clearUsers = () => {
    users.value = []; // ✅ store를 초기화
    };

    return { users, getSearchUsersByNickname, clearUsers }
});