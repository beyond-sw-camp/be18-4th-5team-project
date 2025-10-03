<template>
    <main>
        <SendFriendRequestForm
            :user="usersStore.user"/>
    </main>
</template>

<script setup>
    import { onMounted } from "vue";
    import SendFriendRequestForm from '../components/SendFriendRequestForm.vue';
    import { useUsersStore } from '../stores/usersStore';

    const usersStore = useUsersStore();

    onMounted(async () => {
        await usersStore.getSearchUsersByNickname;
    });
</script>

<style lang="scss" scoped>

</style>