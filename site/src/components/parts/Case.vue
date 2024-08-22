<template>
  <div class="p-4">
    <BaseLabel>
      <router-link :to="{ name: 'components', query: { type: 'Cases' } }">
        <p class="text-xl font-semibold hover:underline cursor-pointer">Case</p>
      </router-link>
    </BaseLabel>
  </div>
</template>
<script setup lang="ts">
import BaseLabel from "../BaseLabel.vue";
</script>
