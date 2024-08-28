<template>
  <button
    @click="handleDelete"
    class="flex items-center justify-center text-white hover:text-red-500 focus:outline-none pr-4"
    aria-label="Delete"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke-width="2"
      stroke="currentColor"
      class="w-5 h-5"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  </button>
</template>

<script setup lang="ts">
import { defineEmits, defineProps } from "vue";

const props = defineProps<{
  type: string;
}>();

const emit = defineEmits<{
  (e: "delete", type: string): void;
}>();

const handleDelete = () => {
  emit("delete", props.type);
  window.dispatchEvent(new CustomEvent("part-deleted", { detail: props.type }));
};
</script>
