<template>
    <form @submit.prevent="submitClick">
        <div class="mb-3">
            <label for="score" class="form-label">score</label>
            <input type="text" class="form-control" id="score" v-model="formData.score">
        </div>
        <div class="mb-3">
            <label for="winner" class="form-label">winner</label>
            <input type="text" class="form-control" id="winner" v-model="formData.winner">
        </div>
        <div class="mb-3">
            <label for="note" class="form-label">note</label>
            <input type="text" class="form-control" id="note" v-model="formData.resultNote">
        </div>
        <div>
            <button type="submit" class="btn btn-primary m-2">등록</button>
        </div>
    </form>
</template>

<script setup>
import { reactive, toRaw } from 'vue';

    const props = defineProps({
        initFormData: Object,
        formType: {
            type: String,
            required: true
        }
    });

    const formData = reactive({ ...props.initFormData });

    const emit = defineEmits(['form-submit']);

    const submitClick = () => {
        emit('form-submit', toRaw(formData))
    };
</script>

<style lang="scss" scoped>
</style>