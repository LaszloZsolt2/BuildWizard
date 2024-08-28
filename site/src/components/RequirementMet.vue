<template>
  <CheckIcon
    v-if="met"
    class="inline-block w-5 h-5 text-violet-400 mr-1 mb-1"
  />
  <XMarkIcon v-else class="inline-block w-5 h-5 text-red-500 mr-1 mb-1" />
</template>

<script setup lang="ts">
import CheckIcon from "@/assets/icons/check.svg";
import XMarkIcon from "@/assets/icons/xmark.svg";

type Props = {
  met: boolean;
};
const props = defineProps<Props>();
</script>
