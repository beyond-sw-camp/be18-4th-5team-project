import api from "@/api/axios";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useFriendsStore = defineStore('friend_list', () => {
    const friend_list = ref([]);


    const getFriendsList = async () => {
        const response = await api.get('/api/v1/friends/list');

        friend_list.value = response.data.items;
    };

    const deleteFriend = async (userId) => {
        const response = await api.delete('/api/v1/friends/list',{ params: { friendUserId: userId } });

        return response.data
    };

    return { friend_list, getFriendsList, deleteFriend }
});