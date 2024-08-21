<template>
  <div class="components text-white p-5">
    <ul v-if="!loading && !error && paginatedData.length">
      <li v-for="item in paginatedData" :key="item._id">
        <div v-for="(value, key) in item" :key="key">
          {{ key }}: {{ value }}
        </div>
        <br />
      </li>
      <br />
    </ul>

    <p v-if="error" class="text-red-500">Error: {{ error }}</p>
    <p v-if="loading">Loading...</p>

    <div v-if="totalPages > 1" class="flex justify-center align-center mt-5">
      <BaseButton
        @click="prevPage"
        :disabled="currentPage === 1"
        class="w-15 h-8 mt-4"
      >
        Back
      </BaseButton>
      <span class="p-5">{{ currentPage }} / {{ totalPages }}</span>
      <BaseButton
        @click="nextPage"
        :disabled="currentPage === totalPages"
        class="w-15 h-8 mt-4"
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
const itemsPerPage = ref(10);
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
