<template>
  <div class="flex justify-end my-5">
    <Search
      key="searchable-selector"
      v-model="componentQuery"
      :suggestions="filteredComponents"
      placeholder="Search..."
      class="block border-4 border-violet-800 rounded-lg"
      :minLength="1"
      :delay="300"
      optionLabel="name"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch, defineProps, defineEmits, computed } from "vue";
import useFetch from "../composables/useFetch";
import Search from "../components/SearchableSelector.vue";

const componentQuery = ref("");
const filteredComponents = ref<any[]>([]);
const props = defineProps<{ type: string }>();
const emit = defineEmits<{ (event: "search", query: string): void }>();

const fetchUrl = computed(() => {
  if (!props.type) {
    console.error("Type is not defined.");
    return "";
  }
  const queryParam = componentQuery.value
    ? `q=${encodeURIComponent(componentQuery.value)}`
    : "";
  return `http://localhost:5000/api/${props.type}/search?${queryParam}`;
});

const { fetchedData } = useFetch(fetchUrl);

watch(fetchedData, (data) => {
  filteredComponents.value = data || [];
});

watch(componentQuery, () => {
  emit("search", componentQuery.value);
});
</script>
