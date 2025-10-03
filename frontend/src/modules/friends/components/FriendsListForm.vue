<template>
    <div class="app-background">
            <header class="header">
                <h1 class="title">친구 목록</h1>
                
            </header>
        <div class="friends-container">


        <!-- 검색창 -->
        <div class="search-container">
            <input
                v-model="searchQuery"
                type="text"
                placeholder="친구 검색..."
                class="search-input"
            />
        </div>

            <!-- 친구 카드 -->
        <p class="subtitle">{{ (friendsStore.friend_list?.length) ?? 0 }}명의 친구</p>
        <div class="friends-grid">
            <div
                v-for="friend in filteredFriends"
                :key="friend.friend_id"
                class="friend-card"
            >
                <div class="profile-section">
                    <div class="profile-image-container">
                        <img
                            :src="resolveProfileImage(friend.profileImage)"
                            :alt="`${friend.nickname} 프로필`"
                            class="profile-image"
                        />
                    </div>
                
                    <div class="friend-info">
                        <h3 class="nickname">{{ friend.nickname }}</h3>
                        <p class="friend-date">{{ formatFriendDate(friend.createdAt) }}</p>
                    </div>
                </div>

            <div class="actions">

                <button
                    class="btn-with-img"
                    @click="startChat(friend.nickname)"
                    title="1:1 채팅"
                >
                    <img src="@/assets/chatIcon.png" alt="채팅"/>
                </button>

                <button
                    type="button" class="btn-close" aria-label="Close"
                    @click="deleteChat(friend.nickname); deleteFriend(friend.userId);"
                    title="친구 삭제"
                >
                </button>
                </div>
            </div>
        </div>

        <!-- 검색 결과 없음 -->
            <div v-if="(filteredFriends?.length ?? 0) === 0" class="empty-state">
                <p>검색 결과가 없습니다.</p>
            </div>
        </div>
    </div>
</template>

<script setup>
    import { ref, computed, onMounted } from "vue";
    import { useFriendsStore } from "../stores/friendsStore";
    import api from "@/api/axios";
    import defaultProfile from '@/assets/default_profile.png'
    import { useRouter } from "vue-router";

    const friendsStore = useFriendsStore();
    const searchQuery = ref("");
    const router = useRouter();

// 스토어에서 친구 데이터 가져오기
    onMounted(async () => {
        await friendsStore.getFriendsList();
    });

// store 데이터 참조
    const friends = computed(() => friendsStore.friend_list || []);

// 검색 필터
    const filteredFriends = computed(() => {
        if (!searchQuery.value.trim()) return friends.value;
            return friends.value.filter(f =>
        f.nickname.includes(searchQuery.value.trim())
        );
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

// 날짜 포맷
    const formatFriendDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("ko-KR", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

// 친구 삭제
    const deleteFriend = async (userId) => {
        try {
            if (confirm('해당 친구를 정말로 삭제하시겠습니까?')) {
                const result = await friendsStore.deleteFriend(userId);

                if (result.code === 200) {
                    alert('정상적으로 삭제되었습니다.');

                    await friendsStore.getFriendsList();
                };
            };
        } catch(error) {
            const {status, message} = error.response.data;
            if(status === 'ALREADY_DELETE_FRIEND') {
                alert(message);
            }else if(status === 'USER_NOT_FOUND') {
                alert(message);
            }else if(status === 'UNAUTHORIZED') {
                alert(message);
            }
        }
    };

// 1:1 채팅
    async function startChat(otherNickname){
        try {
            const {data} = await api.post(`/api/v1/chatrooms/private/create`, null, { params: {otherNickname}});

            const roomId = data?.items?.[0];
            if(!roomId) throw new Error('roomId가 없습니다.');
            router.push({ path: '/chatrooms/list', query: { roomId } });
        } catch (error) {
            const res = error.response?.data;
            if (res?.status === 'USER_NOT_FOUND') {
            alert(res.message);
            } else {
            console.error("채팅방 생성 실패:", error);
            alert("채팅방을 생성할 수 없습니다.");
            }
        }
    };

// 채팅방 삭제
    async function deleteChat(otherNickname){
        try {
            const {data} = await api.post(`/api/v1/chatrooms/private/create`, null, { params: {otherNickname}});
            const roomId = data?.items?.[0];
            if(!roomId) throw new Error('roomId가 없습니다.');

            const result = await api.delete(`/api/v1/chatrooms/private/${roomId}/leave`);

            console.log('성공!');
            return result.data;
        } catch (error) {
            const res = error.response?.data;
            if (res?.status === 'USER_NOT_FOUND') {
            alert(res.message);
            } else {
            console.error("채팅방 삭제 실패:", error);
            alert("채팅방을 삭제할 수 없습니다.");
            }
        }
    }
</script>

<style scoped>
/* 간단한 스타일 (예시) */

    .friends-container {
        background: linear-gradient(to bottom, #ffe6cf, #f9f9f9);;
        border-radius: 16px;
        width: 1000px;
        max-height: 500px;
        border: 2px solid;
        margin: 0 auto;
        padding: 1.5rem;
        overflow-y: auto;    /* 세로 스크롤 추가 */
        overflow-x: hidden;
    }

    .friends-container::-webkit-scrollbar {
        width: 1px;    /* ✅ 스크롤바 두께 */
    }

    .header {
        text-align: center;
        margin-bottom: 1rem;
    }
    .search-container {
        border: 2px solid;
        border-radius: 16px;
        margin-bottom: 1rem;
    }
    .search-input {
        border-radius: 16px;
        background-color: #f9f9f9;
        width: 100%;
        padding: 0.5rem;
    }
    .friends-grid {
        display: grid;
        gap: 1rem;
    }
    .friend-card {
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
    .actions {
        display: flex;
        gap: 0.5rem;
    }
    .btn-with-img {
        border: none;
        background: transparent;
        padding: 0;  /* 버튼 기본 여백 제거 */
        cursor: pointer;
        margin-right: 20px;
    }
    .btn-with-img img {
        width: 35px;   /* 이미지 크기 */
        height: 35px;
    }
    .btn-close {
        position: absolute;
        top: 8px;
        right: 8px;
        width: 5px;   /* 이미지 크기 */
        height: 5px;
        --bs-btn-close-color: red;
    }
    .empty-state {
        text-align: center;
        margin-top: 1rem;
        color: gray;
    }
</style>