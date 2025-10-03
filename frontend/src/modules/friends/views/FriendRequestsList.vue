<template>
    <main>
        <FriendRequestsListForm
            :receivedRequests="friendRequestsStore.receivedRequests"
            :sentRequests="friendRequestsStore.sentRequests"/>
    </main>
</template>

<script setup>
    import FriendRequestsListForm from '../components/FriendRequestsListForm.vue';
    import { onMounted } from 'vue';
    import { useFriendRequestsStore } from '../stores/friendRequestsStore';

const friendRequestsStore = useFriendRequestsStore();

    onMounted(async () => {
        await friendRequestsStore.getReceivedFriendRequests();
        await friendRequestsStore.getSentFriendRequests();
    });

</script>