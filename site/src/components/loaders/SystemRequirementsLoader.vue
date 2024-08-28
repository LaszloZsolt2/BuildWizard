<template>
  <Loader height="2rem" width="70%" borderRadius="12px" class="mb-4" />
  <Loader height="1.5rem" width="80%" borderRadius="12px" class="mb-8" />
  <div v-for="n in 2" class="mb-8">
    <Loader height="1.5rem" width="40%" borderRadius="12px" class="mb-4" />
    <Loader
      v-for="n in 4"
      height="3.5rem"
      width="80%"
      borderRadius="12px"
      class="mb-4"
    />
  </div>
</template>

<script setup lang="ts">
import Loader from "../Loader.vue";
</script>
