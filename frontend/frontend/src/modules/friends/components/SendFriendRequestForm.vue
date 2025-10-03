<template>
    <div>
        <div>
            <h1 class="text-center">친구 찾기</h1>
        </div>
        <!-- 검색창 -->
        <div class="search-container">
        <input
            v-model="searchQuery"
            type="text"
            placeholder="유저 검색..."
            class="search-input"
        />
        <p>{{ users.length }}명의 유저 발견</p>
        </div>
        
        <div class="users-container">
            <div class="users-grid">
                <div
                    v-for="user in filteredUsers"
                    :key="user.userId"
                    class="user-card"
                >
                    <div class="profile-section">
                        <div class="profile-image-container">
                            <img
                                :src="resolveProfileImage(user.profileImage)"
                                :alt="`${user.nickname} 프로필`"
                                class="profile-image"
                            />
                        </div>
                
                        <div class="user-info">
                            <h3 class="nickname">{{ user.nickname }}</h3>
                        </div>
                    </div>

                    <div class="actions">
                        <button type="button" class="btn btn-primary"
                            @click="sendFriendRequest(user.userId)">친구 요청</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
    import { ref, computed, onMounted, watch } from "vue";
    import { useUsersStore } from "../stores/usersStore";
    import { useFriendRequestsStore } from "../stores/friendRequestsStore";
    import defaultProfile from '@/assets/default_profile.png' 
    import { useRoute } from "vue-router";

    const usersStore = useUsersStore();
    const friendRequestsStore = useFriendRequestsStore();
    const searchQuery = ref("");
    const users = computed(() => usersStore.users);
    const route = useRoute();

    onMounted(async () => {
        await usersStore.getSearchUsersByNickname();
    });

    watch(searchQuery, async (newVal) => {
        if (newVal.trim()) {
            await usersStore.getSearchUsersByNickname(newVal);
        } else {
            usersStore.users = []; // 검색어 없으면 비우기
        }
    });

       // ✅ 프로필 이미지 경로 처리 함수
    function resolveProfileImage(path) {
        if (!path) {
            return defaultProfile
        }
        if (path.startsWith('http')) {
            return path
        }
        return `http://localhost:8080${path}`
    }

    watch(
        () => route.fullPath,
        () => {
            usersStore.clearUsers();
            searchQuery.value = "";
        }
    );

    onMounted(() => {
        searchQuery.value = "";
        usersStore.users = [];
    });

    const filteredUsers = computed(() => users.value);

const sendFriendRequest = async (userId) => {
        try{
            const result = await friendRequestsStore.sendFriendRequest(userId);

            if (result.code === 200) {
                alert('친구 요청을 보냈습니다.');
                
                if (searchQuery.value.trim()) {
                    await usersStore.getSearchUsersByNickname(searchQuery.value);
                }
            };
        }catch(error) {
            const res = error.response?.data;
            if (!res) {
                alert("서버와의 통신에 실패했습니다.");
            console.error(error);
            return;
            } 

            const {status, message} = res;
            if(status === 'UNAUTHORIZED') {
                alert(message);
            }else if(status === 'ALREADY_RECEIVED_REQUEST') {
                alert(message);
            }else if(status === 'USER_NOT_FOUND') {
                alert(message);
            }else {
                alert("알 수 없는 오류가 발생했습니다.");
            }
        }  
    }
</script>

<style lang="scss" scoped>
    .search-container {
        max-width: 1000px;  
        margin: 0 auto;
        margin-top: 40px;
        border-radius: 16px;
        margin-bottom: 1rem;
    }
    .search-input {
        border: 2px solid;
        width: 100%;
        border-radius: 16px;
        padding: 0.5rem;
        margin-bottom: 15px;
    }

    .users-container {
        background:#f9f9f9;
        border-radius: 16px;
        width: 1000px;
        max-height: 500px;
        border: 2px solid;
        margin: 0 auto;
        padding: 1.5rem;
        overflow-y: auto;    /* 세로 스크롤 추가 */
        overflow-x: hidden;
    }

    .users-grid {
        display: grid;
        gap: 1rem;
    }
    .user-card {
        position: relative;
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: #f9f9f9;
        padding: 0.75rem;
        border-radius: 8px;
    }
    .profile-section {
        display: flex;
        align-items: center;
    }
    .profile-image-container {
        width: 50px;
        height: 50px;
        margin-right: 0.75rem;
    }
    .profile-image {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        object-fit: cover;
    }
</style>