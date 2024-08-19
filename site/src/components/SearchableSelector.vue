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

function filterItems(event: { query: string }) {
  query.value = event.query;
}

function onInput(value: Item | null) {
  emit("update:modelValue", value);
}

function onSelect(value: Item) {
  emit("update:modelValue", value);
}
</script>

<template>
  <div class="searchable-selector">
    <AutoComplete
      v-model="query"
      :suggestions="filteredItems"
      complete-method="filterItems"
      @input="onInput"
      @select="onSelect"
      placeholder="Search..."
      class="w-full"
    >
      <template #itemTemplate="{ item }">
        <div class="item">
          {{ item.label }}
        </div>
      </template>
    </AutoComplete>
  </div>
</template>
