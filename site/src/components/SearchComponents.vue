<template>
  <div class="flex justify-end">
    <Search
      v-model="componentQuery"
      :suggestions="filteredComponents"
      @change="debouncedSearch"
      placeholder="Search..."
      class="block rounded-lg"
      :minLength="1"
      :delay="300"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch, defineProps, defineEmits, computed } from "vue";
import useFetch from "../composables/useFetch";
import { debounce } from "lodash";
import Search from "../components/SearchableSelector.vue";
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

const componentQuery = ref("");
const filteredComponents = ref<any[]>([]);
const emit = defineEmits<{ (event: "search", query: string): void }>();
const props = defineProps<{ type: string }>();

const debouncedSearch = debounce((query: string) => {
  emit("search", query);
});

watch(componentQuery, (newQuery) => {
  debouncedSearch(newQuery);
});

const fetchUrl = computed(() => {
  if (!props.type) {
    console.error("no type.");
    return "";
  }
  return `${apiBaseUrl}/${props.type}/search?q=${encodeURIComponent(
    componentQuery.value
  )}&suggestions=true`;
});

const { fetchedData, fetchError, isLoading } = useFetch(fetchUrl);

watch(fetchedData, (data) => {
  if (data && data.suggestions) {
    filteredComponents.value = data.suggestions;
  } else {
    filteredComponents.value = [];
  }
});
</script>
