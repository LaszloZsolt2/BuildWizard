<template>
  <div class="sample">
    <BaseLabel class="m-4"> Test message </BaseLabel>
    <BaseLabel severity="warn" class="m-4"> Test message </BaseLabel>
    <BaseLabel severity="error" class="m-4"> Test message </BaseLabel>
    <BaseLabel severity="success" class="m-4"> Test message </BaseLabel>
    <BaseLabel severity="secondary" class="m-4"> Test message </BaseLabel>
  </div>
</template>

<script setup lang="ts">
import BaseLabel from "@/components/BaseLabel.vue";
</script>
