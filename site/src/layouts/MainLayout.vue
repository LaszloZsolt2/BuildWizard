<template>
  <div class="main-layout">
    <header>
      <MainHeader />
    </header>

    <main class="min-h-screen pt-28">
      <RouterView />
    </main>

    <footer>
      <MainFooter />
    </footer>
  </div>
</template>

<script setup lang="ts">
import MainHeader from "../components/MainHeader.vue";
import MainFooter from "../components/MainFooter.vue";
</script>
