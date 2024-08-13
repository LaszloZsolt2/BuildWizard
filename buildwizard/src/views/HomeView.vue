<template>
  <div class="home">
    <Checkbox v-model="checked" @change="console.log(checked)" :binary="true" />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const checked = ref(false);
</script>
