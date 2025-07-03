<template>
  <div v-if="value && value !== -1" class="flex items-center">
    <p class="mr-2 min-w-8 font-bold text-neutral-300 text-right">
      {{ value }}
    </p>
    <ProgressBar
      :value="displayValue"
      :showValue="false"
      style="height: 0.5rem"
      class="flex-grow"
    />
  </div>
  <div v-else class="text-neutral-400 font-bold">Not available</div>
</template>

<script setup lang="ts">
import ProgressBar from "primevue/progressbar";
import { computed } from "vue";

type Props = {
  value: number;
  maxValue: number;
};

const props = defineProps<Props>();

const displayValue = computed(() => {
  return props.value === -1 ? 0 : (props.value / props.maxValue) * 100;
});
</script>
