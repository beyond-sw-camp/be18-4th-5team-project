<template>
  <header class="date-selector">
    <!-- <button class="arrow">&lt;</button> -->
    <div v-for="date in dates" :key="date.day" class="date-item" :class="{ active: date.active }" @click="selectDate(date)">
      <div class="day-of-week">{{ date.dayOfWeek }}</div>
      <div class="day">{{ date.day }}</div>
    </div>
    <!-- <button class="arrow">&gt;</button> -->
  </header>
</template>

<script setup>
import { ref, onMounted } from 'vue';

  const emit = defineEmits(['date-selected']);
  const dates = ref([]);

  onMounted(() => {
    generateDates();
  });

  const generateDates = () => {
    const dateList = [];
    const today = new Date();
    const days = ['일', '월', '화', '수', '목', '금', '토'];

  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i); 
    const fullDate = date.toISOString().slice(0, 10);

    dateList.push({
      day: String(date.getDate()),
      dayOfWeek: days[date.getDay()],
      active: i === 0, 
      fullDate: fullDate
    });
    }

    dates.value = dateList;
  };

  const selectDate = (selectedDate) => {
    dates.value.forEach(date => date.active = false);
  
    selectedDate.active = true;

    emit('date-selected', selectedDate.fullDate);
};
</script>

<style scoped>
.date-selector {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  margin-left: 3em;
  margin-right: 3em;
}
.arrow {
  background: none;
  border: none;
  font-size: 24px;
  color: #888;
  cursor: pointer;
}
.date-item {
  text-align: center;
  padding: 8px 12px;
  border-radius: 20px;
  cursor: pointer;
}
.date-item.active {
  background-color: #007bff;
  color: white;
}
.day-of-week {
  font-size: 14px;
}
.day {
  font-size: 18px;
  font-weight: bold;
}
</style>