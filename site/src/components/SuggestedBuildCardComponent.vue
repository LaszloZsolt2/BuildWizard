<template>
  <div
    v-if="component.name"
    class="bg-neutral-700 bg-opacity-20 my-2 p-3 rounded-lg flex items-center"
  >
    <div class="h-12 w-12 flex mr-5 items-center">
      <img
        :src="component.image"
        :alt="type"
        class="object-contain rounded-md"
      />
    </div>
    <div class="flex-grow text-neutral-100">
      {{ component.name }}
      <span v-if="type === 'gpus'">({{ component.chipset }})</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PartType } from "../types/partType";

type Props = {
  component: any;
  type: PartType;
};

const props = defineProps<Props>();
</script>
