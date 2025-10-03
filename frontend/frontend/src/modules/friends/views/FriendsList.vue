<template>
    <main>
        <FriendsListForm
            :friend_list="friensStore.friend_list"/>
    </main>
</template>

<script setup>
    import { onMounted } from 'vue';
    import FriendsListForm from '../components/FriendsListForm.vue';
    import { useFriendsStore } from '../stores/friendsStore';

    const friensStore = useFriendsStore();

    try{
        onMounted(async () => {
            await friensStore.getFriendsList();
        });
    } catch(error) {
        const {status, message} = error.response.data;
        if(status === 'FRIEND_LIST_NOT_FOUND') {
            alert(message);
        }else if(status === 'UNAUTHORIZED') {
            alert(message);
        }
    }
    
</script>

<style lang="scss" scoped>

</style>