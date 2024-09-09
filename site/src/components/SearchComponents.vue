<template>
  <div class="flex justify-end my-5 border-violet-800">
    <Search
      key="searchable-selector"
      v-model="componentQuery"
      :suggestions="filteredComponents"
      @option-select="componentSelect"
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

const filteredComponents = ref<any[]>([]);
const componentQuery = ref("");
const selectedComponent = ref<any[]>([]);
const props = defineProps<{ type: string }>();

const emit = defineEmits(["component-data-changed"]);

const fetchUrl = computed(() => {
  if (!props.type) {
    console.error("no type.");
    return "";
  }
  return `http://localhost:5000/api/${props.type}/search?q=${encodeURIComponent(
    componentQuery.value
  )}`;
});

function componentSelect(component: any) {
  console.log("Component selected:", component);
  componentQuery.value = "";
  let currentComponents = JSON.parse(
    localStorage.getItem("components") || "[]"
  );
  if (
    currentComponents.filter((g: any) => g._id === component._id).length > 0
  ) {
    return;
  }

  currentComponents.push(component);
  selectedComponent.value.push(component);
  localStorage.setItem("components", JSON.stringify(currentComponents));

  emit("component-data-changed", currentComponents);
}

const { fetchedData, fetchError, isLoading } = useFetch(fetchUrl);

watch(fetchedData, (data) => {
  console.log("Fetched data:", data);
  filteredComponents.value = data || [];
});
</script>
