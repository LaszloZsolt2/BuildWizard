<template>
  <div class="app flex flex-col min-h-screen">
    <div class="flex-1">
      <MainHeader />

      <RouterView />
    </div>
    <MainFooter />
  </div>
</template>

<script setup lang="ts">
import MainHeader from "./components/MainHeader.vue";
import MainFooter from "./components/MainFooter.vue";
import "./assets/output.css";
</script>

<style>
body {
  @apply bg-neutral-900;
}
</style>
