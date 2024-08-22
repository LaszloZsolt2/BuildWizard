<template>
  <div class="p-4">
    <BaseLabel>
      <router-link :to="{ name: 'components', query: { type: 'Cpu-coolers' } }">
        <p class="text-xl font-semibold hover:underline cursor-pointer">
          Cpu Cooler
        </p>
      </router-link>
    </BaseLabel>
  </div>
</template>
<script setup lang="ts">
import BaseLabel from "../BaseLabel.vue";
</script>
