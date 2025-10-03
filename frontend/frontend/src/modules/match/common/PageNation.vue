<template>
    <nav aria-label="Page navigation example">
        <ul class="pagination justify-content-center">
            <li class="page-item">
                <a class="page-link" href="#" aria-label="Previous" 
                @click.prevent="changePage(pageInfo.currentPage - 1);">
                    <span aria-hidden="true">&laquo;</span>
                </a>
            </li>
            <li v-for="page in generateSequence" :key="page" class="page-item">
                <a class="page-link" :class="{active: pageInfo.currentPage === page}" href="#" 
                @click.prevent="changePage(page);">{{ page }}</a>
            </li>
            <li class="page-item">
                <a class="page-link" href="#" aria-label="Next" 
                @click.prevent="changePage(pageInfo.currentPage + 1);">
                    <span aria-hidden="true">&raquo;</span>
                </a>
            </li>
        </ul>
    </nav>
</template>

<script setup>
import { computed } from 'vue';

    const props = defineProps({
        pageInfo: {
            type: Object,
            default: () => ({
              currentPage: 1,
              totalCount: 0,
              pageLimit: 5,
              listLimit: 10 // 0이면 안 됨
            })
          }
    });

    const totalPages = computed(() => Math.ceil(props.pageInfo.totalCount / props.pageInfo.listLimit) );

    const startPage = computed(() => {
        const pageLimit = props.pageInfo.pageLimit;
        const currentPage = props.pageInfo.currentPage;

        return (pageLimit * Math.floor((currentPage - 1) / pageLimit)) + 1;
    });

    // 페이징 된 페이지 중 마지막 페이지
    const endPage = computed(() => {
        const end = startPage.value + props.pageInfo.pageLimit - 1;

        return end > totalPages.value ? totalPages.value : end;
    });

    // 페이지 리스트 생성
    const generateSequence = computed(() => {
        const sequence = [];

        for(let i = startPage.value; i <= endPage.value; i++) {
            sequence.push(i);
        }

        return sequence;
    });

    const emit = defineEmits(['change-page']);

    const changePage = (page) => { 
        emit('change-page', {page, totalPages: totalPages.value});
    };
</script>
