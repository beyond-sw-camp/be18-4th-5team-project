<template>
    <div>
        <FriendNavBar />
        <main class="p-4">
            <router-view />
        </main>
    </div>
</template>

<script setup>
    import FriendNavBar from '../components/FriendNavBar.vue';
</script>

<style lang="scss" scoped>

</style>