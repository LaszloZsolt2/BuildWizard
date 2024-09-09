<template>
  <div
    class="flex-1 bg-neutral-800 bg-opacity-70 my-3 mx-1 p-6 rounded-xl cursor-pointer transition-all duration-500"
    :style="{
      height: '70vh',
      width: screenWidth < 1280 ? '85vw' : '25vw',
    }"
  >
    <Loader
      height="2rem"
      :width="`calc(7vw * ${widthMultiplier})`"
      borderRadius="12px"
      class="mb-4"
    />
    <Loader
      height="1rem"
      :width="`calc(14vw * ${widthMultiplier})`"
      borderRadius="12px"
      class="mb-8"
    />
    <Loader
      v-for="n in 5"
      height="4rem"
      :width="`calc(21vw * ${widthMultiplier * 0.8})`"
      borderRadius="12px"
      class="mb-4"
    />
    <Loader
      height="2rem"
      :width="`calc(18vw * ${widthMultiplier * 0.8})`"
      borderRadius="12px"
      class="mb-4 mt-4"
    />
    <Loader
      height="3rem"
      :width="`calc(5vw * ${widthMultiplier})`"
      borderRadius="12px"
      class="mb-4 mt-4"
    />
  </div>
</template>

<script setup lang="ts">
import Loader from "../Loader.vue";
import { useScreenSize } from "../../composables/useScreenSize";
import { computed } from "vue";

const { screenWidth } = useScreenSize();
const widthMultiplier = computed(() => (screenWidth.value < 1280 ? 4 : 1));
</script>
