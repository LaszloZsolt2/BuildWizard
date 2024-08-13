<template>
  <!-- TODO: put MainHeader in MainLayout.vue -->
  <MainHeader />
  <router-view />
</template>

<script setup lang="ts">
import MainHeader from "./components/MainHeader.vue";
import "./assets/output.css";
</script>

<style>
body {
  @apply bg-neutral-900;
}
</style>
