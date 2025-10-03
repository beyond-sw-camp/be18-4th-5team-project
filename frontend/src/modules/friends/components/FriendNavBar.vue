<template>
    <nav class="navbar bg-gray-100 shadow-md px-6 py-3 flex gap-2 border-b border-gray-300">
        <button @click="$router.push('/friends/list')" class="hover:text-blue-500">
            친구 목록
        </button>
        <button @click="$router.push('/friends/requests')" class="hover:text-blue-500">
            요청 목록
        </button>
        <button @click="$router.push('/friends/requests/send')" class="hover:text-blue-500">
            친구 찾기
        </button>
    </nav>

</template>

<script setup>

</script>

<style scoped>
    .navbar button {
        width: 200px;
        margin: 0 auto;
        font-weight: 600;
    }
</style>