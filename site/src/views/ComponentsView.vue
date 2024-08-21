<template>
  <div class="components text-white p-5">
    <ul v-if="!loading && !error && paginatedData.length">
      <div class="bg-violet-800 p-10">
        <p class="text-3xl font-bold text-white text-center">
          Select from {{ props.type }}
        </p>
      </div>
      <p class="mb-20"></p>
      <table
        class="m-10 w-11/12 bg-gray-800 text-white border-separate border-spacing-0"
      >
        <thead>
          <tr>
            <th
              v-for="(key, index) in sortedKeys"
              :key="index"
              class="border-b px-6 py-3 text-left bg-gray-700"
            >
              {{ key }}
            </th>
            <th class="border-b px-6 py-3 text-left bg-gray-700">Action</th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="item in paginatedData"
            :key="item._id"
            class="hover:bg-gray-700"
          >
            <td v-for="key in sortedKeys" :key="key" class="border-b px-6 py-4">
              {{ item[key] }}
            </td>
            <td class="border-b px-6 py-4">
              <BaseButton
                v-if="sortedKeys[sortedKeys.length - 1] === 'price'"
                @click="handleAddClick(item)"
                class="bg-blue-500 text-white hover:bg-blue-600"
              >
                Add
              </BaseButton>
            </td>
          </tr>
        </tbody>
      </table>
    </ul>
    <p v-if="error" class="text-red-500 mt-4">Error: {{ error }}</p>
    <p v-if="loading" class="mt-4">Loading...</p>

    <div v-if="totalPages > 1" class="flex justify-center items-center mt-5">
      <BaseButton
        @click="prevPage"
        :disabled="currentPage === 1"
        class="w-15 h-8"
      >
        Back
      </BaseButton>
      <span class="p-5">{{ currentPage }} / {{ totalPages }}</span>
      <BaseButton
        @click="nextPage"
        :disabled="currentPage === totalPages"
        class="w-15 h-8"
      >
        Next
      </BaseButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watchEffect } from "vue";
import BaseButton from "../components/BaseButton.vue";
import { PaginatedResponse } from "../types/paginatedResponse";

const props = defineProps<{ type: string }>();

const currentPage = ref(1);
const itemsPerPage = ref(15);
const data = ref<PaginatedResponse<any> | null>(null);
const error = ref<string | null>(null);
const loading = ref(true);

const fetchPage = async () => {
  loading.value = true;
  try {
    const response = await fetch(
      `http://localhost:5000/api/${props.type}?page=${currentPage.value}&limit=${itemsPerPage.value}`
    );
    if (response.ok) {
      const result: PaginatedResponse<any> = await response.json();
      data.value = result;
      error.value = null;
    } else {
      throw new Error("Failed to fetch data");
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : "Unknown error occurred";
    data.value = null;
  } finally {
    loading.value = false;
  }
};

const allKeys = computed(() => {
  if (paginatedData.value.length === 0) return [];
  const keys = Object.keys(paginatedData.value[0]);
  return keys;
});

const sortedKeys = computed(() => {
  const keys = allKeys.value;
  const priceIndex = keys.indexOf("price");
  if (priceIndex === -1) return keys;
  const filteredKeys = keys.filter((key) => key !== "price");
  filteredKeys.push("price");
  return filteredKeys;
});

const handleAddClick = (item: any) => {
  console.log("Add button clicked for item:", item);
};

const totalPages = computed(() =>
  Math.ceil((data.value?.total || 0) / itemsPerPage.value)
);
const paginatedData = computed(() => data.value?.data || []);

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value += 1;
  }
};

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value -= 1;
  }
};

watchEffect(() => {
  fetchPage();
});
</script>
