<template>
  <div
    v-if="component.name"
    class="bg-neutral-700 bg-opacity-20 my-2 p-2 px-3 md:p-3 rounded-lg flex items-center"
  >
    <div class="w-10 h-10 md:h-12 md:w-12 flex mr-5 items-center">
      <img
        :src="component.image"
        :alt="type"
        class="object-contain rounded-md"
      />
    </div>
    <div class="text-sm md:text-base flex-grow text-neutral-100">
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
