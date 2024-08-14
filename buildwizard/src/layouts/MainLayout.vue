<template>
  <div class="main-layout">
    <header>
      <MainHeader />
    </header>

    <main>
      <router-view />
    </main>

    <footer>
      <!-- <MainFooter /> -->
    </footer>
  </div>
</template>

<script setup lang="ts">
import MainHeader from "../components/MainHeader.vue";
</script>
