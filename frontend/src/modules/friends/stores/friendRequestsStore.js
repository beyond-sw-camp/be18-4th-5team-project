import { defineStore } from "pinia";
import { ref } from "vue";
import api from "@/api/axios";


export const useFriendRequestsStore = defineStore('friend_request', () => {
    const sentRequests = ref([]);
    const receivedRequests = ref([]);

    const getReceivedFriendRequests = async () => {
        const response = await api.get('/api/v1/friends/requests/received');

        receivedRequests.value = response.data.items;
    };

    const getSentFriendRequests = async () => {
        const response = await api.get('/api/v1/friends/requests/sent');

        sentRequests.value = response.data.items;
    };

    const deleteSentFriendRequests = async (userId) => {
        const response = await api.delete('/api/v1/friends/requests/sent', { params: { receiverUserId: userId } });

        return response.data;
    };
    
    const deleteReceivedFriendRequests = async (userId) => {
        const response = await api.delete('/api/v1/friends/requests/received', { params: { senderUserId: userId } });

        return response.data;
    };

    const acceptReceivedFriendRequests = async (userId) => {
        const response = await api.patch('/api/v1/friends/requests/received', {}, { params: { senderUserId: userId } });

        return response.data;
    };

    const sendFriendRequest = async (userId) => {
        const response = await api.post('/api/v1/friends/requests', null, { params: { receiverUserId: userId } })
        console.log(response);

        return response.data;
    };

    
    
    return { receivedRequests, sentRequests, 
        getReceivedFriendRequests, getSentFriendRequests, 
        deleteSentFriendRequests, deleteReceivedFriendRequests, 
        acceptReceivedFriendRequests, sendFriendRequest };
});