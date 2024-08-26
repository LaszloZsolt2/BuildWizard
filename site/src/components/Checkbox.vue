<template>
  <Checkbox v-model="model" />
</template>

<script setup lang="ts">
import { defineModel } from "vue";
import Checkbox from "primevue/checkbox";

const model = defineModel({
  type: Boolean,
  default: false,
});
</script>
