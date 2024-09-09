<template>
  <div class="flex justify-end my-5">
    <Search
      v-model="componentQuery"
      :suggestions="filteredComponents"
      @change="debouncedSearch"
      placeholder="Search..."
      class="block border-4 border-violet-800 rounded-lg"
      :minLength="1"
      :delay="300"
      optionLabel="name"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch, defineEmits } from "vue";
import { debounce } from "lodash";
import Search from "../components/SearchableSelector.vue";

const componentQuery = ref("");
const filteredComponents = ref<any[]>([]);
const emit = defineEmits<{ (event: "search", query: string): void }>();

const debouncedSearch = debounce((query: string) => {
  emit("search", query);
});

watch(componentQuery, (newQuery) => {
  debouncedSearch(newQuery);
});
</script>
