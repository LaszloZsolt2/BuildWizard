<template>
  <div
    class="p-3 bg-gray-400 border border-gray-800 rounded-md shadow-md flex items-center space-x-4"
  >
    <div class="flex-1">
      <input
        v-model="link"
        type="text"
        readonly
        class="w-full p-2 border border-violet-800 rounded-md bg-gray-200 text-violet-900 focus:outline-none"
      />
    </div>
    <Button @click="copyLink"> Copy Link </Button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { v4 as uuidv4 } from "uuid";
import Button from "../components/BaseButton.vue";

const generateUniqueIdentifier = () => {
  return uuidv4();
};

const generateLink = () => {
  const baseUrl = window.location.origin;
  const pagePath = window.location.pathname;
  const uniqueId = generateUniqueIdentifier();
  return `${baseUrl}${pagePath}?list=${uniqueId}`;
};

const link = ref("");

const updateLink = () => {
  link.value = generateLink();
};

const copyLink = () => {
  navigator.clipboard
    .writeText(link.value)
    .then(() => {
      alert("Link copied to clipboard!");
    })
    .catch((err) => {
      console.error("Failed to copy the link: ", err);
    });
};

onMounted(() => {
  updateLink();
});
</script>
