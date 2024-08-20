<template>
  <div class="relative">
    <AutoComplete
      v-model="query"
      :suggestions="filteredItems"
      @select="onSelect"
      placeholder="Search..."
      class="w-full"
    >
    </AutoComplete>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import AutoComplete from "primevue/autocomplete";

interface Item {
  label: string;
  value: any;
}

interface Props {
  items: Item[];
  modelValue: Item | null;
}

const props = defineProps<Props>();
const emit = defineEmits(["update:modelValue"]);

const query = ref("");

const filteredItems = computed(() => {
  const queryLower = query.value.toLowerCase();
  return props.items.filter((item) =>
    item.label.toLowerCase().includes(queryLower)
  );
});

function onSelect(value: Item) {
  emit("update:modelValue", value);
}
</script>
