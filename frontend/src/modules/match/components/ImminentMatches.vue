<template>
  <section class="imminent-matches">
    <h2 class="section-title">🔥 곧 마감! 빨리 신청하세요.</h2>
    <div class="cards-wrapper">
      <div class="card" v-for="match in imminentMatches" :key="match.id">
        <span class="tag">마감임박</span>
        <div class="card-content">
          <div class="time">{{ match.matchDate }} {{ getStartTime(match.matchTime) }}</div>
          <div class="details">{{ match.sport }} {{ match.region }}</div>
        </div>
        <button class="apply-button" @click="$emit('apply-click', match)">참여하기</button>
      </div>
    </div>
  </section>
</template>

<script setup>
  defineProps({
    imminentMatches: {
      type: Array,
      required: true,
    },
  });

  const getStartTime = (timeRange) => {
    const startTime = timeRange.split('-')[0];

    if (startTime && startTime.length === 4) {
      const hours = startTime.substring(0, 2);
      const minutes = startTime.substring(2, 4);
      return `${hours}:${minutes}`;
    }

    return startTime;
};
</script>

<style scoped>
.imminent-matches {
  margin-bottom: 24px;
}
.section-title {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 12px;
}
.cards-wrapper {
  display: flex;
  justify-content: space-around; 
  gap: 12px; 
  padding: 0 16px;
}
.card {
  width: 200px;
  padding: 12px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  text-align: center;
  position: relative;
  background-color: #DEE1E6;
}
.tag {
  position: absolute;
  top: 8px;
  left: 8px;
  background-color: #ffeeee;
  color: #ff4d4d;
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 4px;
  font-weight: bold;
}
.card-content .icon {
  font-size: 20px;
  display: block;
  margin-top: 10px;
}
.card-content .time {
  font-size: 16px;
  font-weight: bold;
  margin: 8px 0;
}
.card-content .details {
  font-size: 12px;
  color: #666;
}
.apply-button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 12px;
  font-weight: bold;
  margin-top: 12px;
}
</style>