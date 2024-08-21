<template>
  <div
    class="components-list text-white"
    :style="{ margin: '10px', padding: '20px' }"
  >
    <ul v-if="!loading && !error && collectionNames.length">
      <li v-for="name in collectionNames" :key="name">
        <router-link :to="`/components/${name}`">{{ name }}</router-link>
      </li>
    </ul>

    <p v-if="error" class="text-red-500">Hiba történt: {{ error }}</p>
    <p v-if="loading">Betöltés...</p>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";

const collectionNames = ref<string[]>([]);
const error = ref<string | null>(null);
const loading = ref(true);

const fetchCollectionNames = async () => {
  try {
    const response = await fetch("http://localhost:5000/api/collections");
    if (response.ok) {
      collectionNames.value = await response.json();
    } else {
      throw new Error("Failed to fetch collection names");
    }
  } catch (err) {
    error.value = (err as Error).message;
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchCollectionNames();
});
</script>
