<template>
<div>
    <div>
        <h1 class="text-center">요청 목록</h1>
    </div>

        <!-- 탭 메뉴 -->
<div>
    <div class="btn-group-container">
        <div class="btn-group" role="group" aria-label="Basic radio toggle button group">
            <input type="radio" class="btn-check" id="Received" value="received" v-model="activeTab">
            <label class="btn btn-outline-primary" for="Received">받은 요청</label>

            <input type="radio" class="btn-check" id="Sent" value="sent" v-model="activeTab">
            <label class="btn btn-outline-primary" for="Sent">보낸 요청</label>
        </div>
    </div>

    <div v-if="activeTab === 'sent'" class="friends-container mt-3">
        <div class="friends-grid">
            <div
                v-for="friendRequest in friendRequests"
                :key="friendRequest.request_id"
                class="friend-card"
            >
                <div class="profile-section">
                    <div class="profile-image-container">
                        <img
                            :src="resolveProfileImage(friendRequest.profileImage)"
                            :alt="`${friendRequest.nickname} 프로필`"
                            class="profile-image"
                        />
                    </div>
            
                    <div class="friend-info">
                        <h3 class="nickname">{{ friendRequest.nickname }}</h3>
                        <p class="request-date">{{ formatFriendDate(friendRequest.createdAt) }}</p>
                    </div>
                    <div class="actions">
                        <button type="button" class="btn btn-danger" 
                            @click="deleteSentFriendRequests(friendRequest.userId)"
                            title="요청 철회">취소</button>

                    </div>
                </div>
            </div>
        </div>
    </div>


    <!-- 받은 요청 목록 -->
    <div v-else class="friends-container mt-3">
        <div class="friends-grid">
            <div
                v-for="friendRequest in friendRequests"
                :key="friendRequest.request_id"
                class="friend-card"
            >
                <div class="profile-section">
                    <div class="profile-image-container">
                        <img
                            :src="resolveProfileImage(friendRequest.profileImage)"
                            :alt="`${friendRequest.nickname} 프로필`"
                            class="profile-image"
                        />
                    </div>
            
                    <div class="friend-info">
                        <h3 class="nickname">{{ friendRequest.nickname }}</h3>
                        <p class="request-date">{{ formatFriendDate(friendRequest.createdAt) }}</p>
                    </div>

                    <div class="actions">
                        <button type="button" class="btn btn-primary"
                            @click="acceptReceivedFriendRequests(friendRequest.userId)">수락</button>
                        <button type="button" class="btn btn-danger"
                            @click="deleteReceivedFriendRequests(friendRequest.userId)"
                            title="요청 거절">거절</button>

                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
</div>
</template>

<script setup>
    import { ref, computed } from 'vue';
    import { useFriendRequestsStore } from '../stores/friendRequestsStore';
    import defaultProfile from '@/assets/default_profile.png'

    const props = defineProps({
        receivedRequests: { type: Array, default: () => [] },
        sentRequests: { type: Array, default: () => [] },
    });

    const activeTab = ref("received");
    const friendRequestsStore = useFriendRequestsStore();

    const friendRequests = computed(() => {
        return activeTab.value === "sent"
            ? props.sentRequests
            : props.receivedRequests;
    });

    const formatFriendDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("ko-KR", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

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

    const deleteSentFriendRequests = async (userId) => {
        try{
            if (confirm('정말로 삭제하시겠습니까?')) {
                const result = await friendRequestsStore.deleteSentFriendRequests(userId);

                if (result.code === 200) {
                    alert('정상적으로 삭제되었습니다.');

                    await friendRequestsStore.getSentFriendRequests();
                };
            };
        } catch(error) {
            const res = error.response?.data;
            if (!res) {
            alert("서버와의 통신에 실패했습니다.");
            console.error(error);
            return;
            }

            const {status, message} = res;
            if(status === 'UNAUTHORIZED') {
                alert(message);
            }else if(status === 'REQUEST_NOT_FOUND') {
                alert(message);
            }else if(status === 'USER_NOT_FOUND') {
                alert(message);
            }else {
                alert("알 수 없는 오류가 발생했습니다.");
            }
        } 
    };

    const deleteReceivedFriendRequests = async (userId) => {
        try{
            if (confirm('정말로 삭제하시겠습니까?')) {
                const result = await friendRequestsStore.deleteReceivedFriendRequests(userId);

                if (result.code === 200) {
                    alert('정상적으로 삭제되었습니다.');

                    await friendRequestsStore.getReceivedFriendRequests();
                };
            };
        } catch(error) {
            const res = error.response?.data;
            if (!res) {
                alert("서버와의 통신에 실패했습니다.");
            console.error(error);
            return;
            } 

            const {status, message} = res;
            if(status === 'UNAUTHORIZED') {
                alert(message);
            }else if(status === 'REQUEST_NOT_FOUND') {
                alert(message);
            }else if(status === 'USER_NOT_FOUND') {
                alert(message);
            }else {
                alert("알 수 없는 오류가 발생했습니다.");
            }
        } 
    };

    const acceptReceivedFriendRequests = async (userId) => {
        try{
            const result = await friendRequestsStore.acceptReceivedFriendRequests(userId);
            console.log(result);
            if (result.code === 200) {
                    alert('친구가 추가되었습니다.');
                    await friendRequestsStore.getReceivedFriendRequests();
            };
        } catch(error) {
            const res = error.response?.data;
            if (!res) {
                alert("서버와의 통신에 실패했습니다.");
                console.error(error);
                return;
            }

            const {status, message} = res;
            if(status === 'UNAUTHORIZED') {
                alert(message);
            }else if(status === 'REQUEST_NOT_FOUND') {
                alert(message);
            }else if(status === 'USER_NOT_FOUND') {
                alert(message);
            }else if(status === 'ALREADY_FRIEND') {
                alert(message);
            }else {
                alert("알 수 없는 오류가 발생했습니다.");
            }
        }
    };

</script>

<style scoped>
    .btn-group-container {
        display: flex;
        justify-content: center; /* 가로 가운데 정렬 */
        margin-top: 1rem;        /* 위쪽 여백 */
    }
    .btn-group {
        width: 450px;
    }

    .friends-container {
        border: 2px solid;
        border-radius: 16px;
        width: 1000px;
        max-height: 500px;
        margin: 0 auto;
        padding: 1.5rem;
        overflow-y: auto;    /* 세로 스크롤 추가 */
        overflow-x: hidden;
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
    .friend-info {
        margin-left: 70px;
    }

    .btn-primary {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        right: 80px;
    }

    .btn-danger {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        right: 10px;
    }
</style>