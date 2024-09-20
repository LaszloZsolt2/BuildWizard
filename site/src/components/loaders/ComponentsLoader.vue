<template>
  <div v-if="isMobile" v-for="n in 10">
    <div class="flex items-center">
      <Loader
        height="3rem"
        width="3rem"
        borderRadius="12px"
        class="mb-4 mr-2"
      />
      <Loader
        height="2rem"
        width="40vw"
        borderRadius="12px"
        class="mb-4 mr-2"
      />
    </div>
    <Loader
      v-for="n in 2"
      height="2rem"
      width="70vw"
      borderRadius="12px"
      class="mb-4 mr-2"
    />
    <Loader
      height="2rem"
      width="20vw"
      borderRadius="12px"
      class="mb-4 mr-2"
      :style="{ marginLeft: '50vw' }"
    />
  </div>
  <div v-else class="pt-4">
    <div v-for="n in 10" class="flex items-center">
      <Loader
        height="3rem"
        width="3rem"
        borderRadius="12px"
        class="mb-4 mr-2"
      />
      <Loader
        height="2rem"
        width="20vw"
        borderRadius="12px"
        class="mb-4 mr-2"
      />
      <Loader height="2rem" width="60vw" borderRadius="12px" class="mb-4" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useScreenSize } from "../../composables/useScreenSize";
import Loader from "../Loader.vue";

const { screenWidth } = useScreenSize();
const isMobile = computed(() => screenWidth.value < 768);
</script>
