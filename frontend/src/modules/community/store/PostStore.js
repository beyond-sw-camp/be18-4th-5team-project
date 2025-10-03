// src/modules/community/store/postStore.js
import { defineStore } from "pinia";
import { reactive, ref } from "vue";
import api from "@/api/axios";

export const usePostStore = defineStore("postStore", () => {
    const posts = ref([]);
    const post = ref(null);

    const pageInfo = reactive({
        currentPage: 1,
        totalCount: 0,
        listLimit: 10,
        pageLimit: 5,
    });

    /**
     * 게시글 목록 조회 (카테고리 필터링 가능)
     * @param {number} page - 조회할 페이지
     * @param {number} numOfRows - 한 페이지 게시글 수
     * @param {string} category - 선택된 카테고리 (없으면 전체)
     * @param {string} sortBy - 정렬 기준
     * @param {string} sortDir - 정렬 방향
     */
    const fetchPosts = async (page = 1, numOfRows = pageInfo.listLimit, category = "", sortBy = "latest", sortDir = "desc") => {
        try {
            const params = new URLSearchParams();
            params.append("page", page);
            params.append("numOfRows", numOfRows);
            params.append("sortBy", sortBy);
            params.append("sortDir", sortDir);

            // category가 빈 문자열이 아니면만 append
            if (category && category.trim() !== "") {
                params.append("category", category.trim());
            }

            const response = await api.get(`/api/v1/community/posts?${params.toString()}`);

            posts.value = response.data.items;
            pageInfo.currentPage = page;
            pageInfo.totalCount = response.data.totalCount;
            pageInfo.listLimit = numOfRows;
        } catch (error) {
            console.error("fetchPosts error:", error);
        }
    };

    const fetchPost = async (postId) => {
        const response = await api.get(`/api/v1/community/posts/${postId}`);
        post.value = response.data.item;
    };

    const createPost = async (postRequestDto, files = []) => {
        const formData = new FormData();
        formData.append("postRequestDto", new Blob([JSON.stringify(postRequestDto)], { type: "application/json" }));
        if (files.length) files.forEach(file => formData.append("files", file));

        const response = await api.post("/api/v1/community/posts", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        return response.data.item;
    };

    const updatePost = async (postId, updatePostRequestDto, files = []) => {
        const formData = new FormData();
        formData.append("updatePostRequestDto", new Blob([JSON.stringify(updatePostRequestDto)], { type: "application/json" }));
        if (files.length) files.forEach(file => formData.append("files", file));

        const response = await api.put(`/api/v1/community/posts/${postId}`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        return response.data.item;
    };

    const searchPosts = async (
        type,
        keyword,
        page = 1,
        numOfRows = 10,
        sortBy = "latest",
        sortDir = "desc"
        ) => {
        try {
            const res = await api.get("/api/v1/community/posts/search", {
                params: { type, keyword, page, numOfRows, sortBy, sortDir },
            });

            // posts와 pageInfo 직접 업데이트
            posts.value = res.data.items;
            pageInfo.currentPage = page;
            pageInfo.totalCount = res.data.totalCount;
            pageInfo.listLimit = numOfRows;
        } catch (err) {
            console.error("검색 실패:", err);
        }
    };

    const clearState = () => {
        posts.value = [];
        post.value = null;
        Object.assign(pageInfo, {
            currentPage: 1,
            totalCount: 0,
            listLimit: 10,
            pageLimit: 5,
        });
    };

    return {
        posts,
        post,
        pageInfo,
        fetchPosts,
        fetchPost,
        createPost,
        updatePost,
        searchPosts,
        clearState,
    };
});
