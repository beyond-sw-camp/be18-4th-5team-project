<!-- eslint-disable vue/multi-word-component-names -->
<template>
    <nav aria-label="Post Pagination">
        <ul class="pagination justify-content-center">
            <!-- 이전으로 -->
            <li class="page-item" :class="{ disabled: pageInfo.currentPage === 1 }">
                <button class="page-link" aria-label="Previous"
                    @click="changePage(pageInfo.currentPage - 1)"
                    :disabled="pageInfo.currentPage === 1">
                    <span aria-hidden="true">&laquo;</span>
                </button>
            </li>
            <!-- 페이지 번호 -->
            <li class="page-item" v-for="page in generateSequence" :key="page"
                :class="{ active: page === pageInfo.currentPage }">
                <button class="page-link" @click="changePage(page)">
                    {{ page }}
                </button>

            </li>
            <!-- 다음으로 -->
            <li class="page-item" :class="{ disabled: pageInfo.currentPage === pageInfo.totalPages }">
                <button class="page-link" aria-label="Next"
                    @click="changePage(pageInfo.currentPage + 1)"
                    :disabled="pageInfo.currentPage === pageInfo.totalPages">
                    <span aria-hidden="true">&raquo;</span>
                </button>
            </li>
        </ul>
    </nav>
</template>

<script setup>
    import { defineProps, defineEmits, computed } from "vue";

    const props = defineProps({
        pageInfo: {
            type: Object,
            required: true,
        },
    });

    const emit = defineEmits(["change-page"]);

    const totalPages = computed(() =>
        props.pageInfo?.listLimit
            ? Math.ceil(props.pageInfo.totalCount / props.pageInfo.listLimit)
            : 1
    );

    const startPage = computed(() => {
        const pageLimit = props.pageInfo.pageLimit;
        const currentPage = props.pageInfo.currentPage;
        return pageLimit * Math.floor((currentPage - 1) / pageLimit) + 1;
    });

    const endPage = computed(() => {
        const end = startPage.value + props.pageInfo.pageLimit - 1;
        return end > totalPages.value ? totalPages.value : end;
    });

    const generateSequence = computed(() => {
        const sequence = [];
        for (let i = startPage.value; i <= endPage.value; i++) {
            sequence.push(i);
        }
        return sequence;
    });

    const changePage = (page) => {
        if (page < 1 || page > totalPages.value) return;
        emit("change-page", { page, totalPages: totalPages.value });
    };
</script>

<style scoped>
    .pagination {
    display: flex;
    gap: 6px;
    margin: 20px 0;

    .page-item {
        &.active .page-link {
        background-color: #007bff;
        color: #fff;
        border-color: #007bff;
        }

        &.disabled .page-link {
        pointer-events: none;
        opacity: 0.5;
        }
    }

    .page-link {
        padding: 6px 12px;
        border: 1px solid #ccc;
        border-radius: 4px;
        background: #fff;
        cursor: pointer;
        font-size: 14px;
        transition: all 0.2s;

        &:hover:not(:disabled) {
        background-color: #f0f0f0;
        }
    }
    }

</style>