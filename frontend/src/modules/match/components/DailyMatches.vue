<template>
  <div>
    <!-- <div class="filters">
      <select class="filter-select" v-model="gender">
        <option :selected>성별</option>
        <option value="A">전체</option>
        <option value="F">여자만</option>
        <option value="M">남자만</option>
      </select>
    </div> -->

    <main class="match-list">
      <div class="match-item" v-for="match in dailyMatches" :key="match.id">
        <div class="match-time">{{ match.matchTime }}</div>
        <div class="match-info">
          <div class="match-sport">{{ match.sport }}</div>
          <div class="match-location">{{ match.region }}</div>
        </div>
        <button class="apply-button" @click="$emit('apply-click', match)" >신청</button>
      </div>
    </main>
  </div>
</template>

<script setup>
  defineProps({
    dailyMatches: {
      type: Array,
      required: true,
    },
  });

  defineEmits(['apply-click']);
</script>

<style scoped>
.filters {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
}
.filter-select {
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 16px;
  background-color: #f8f9fa;
  font-size: 14px;
}
.match-list {
  border-top: 1px solid #f0f0f0;
}
.match-item {
  display: flex;
  align-items: center;
  padding: 16px 0;
  border-bottom: 1px solid #f0f0f0;
}
.match-time {
  font-size: 16px;
  font-weight: bold;
  width: 60px;
}
.match-info {
  flex-grow: 1;
  padding-left: 16px;
}
.match-sport {
  font-size: 16px;
  font-weight: 500;
}
.match-location {
  font-size: 14px;
  color: #888;
  margin-top: 4px;
}
.apply-button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 8px 20px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: bold;
}
</style>