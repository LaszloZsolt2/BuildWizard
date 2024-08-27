<template>
  <div class="flex">
    <div class="home flex-grow">
      <GameSelector />
    </div>
    <SystemRequirementsSidebar class="flex-1" />
  </div>
</template>

<script setup lang="ts">
import GameSelector from "../components/GameSelector.vue";
import SystemRequirementsSidebar from "../components/SystemRequirementsSidebar.vue";
</script>
