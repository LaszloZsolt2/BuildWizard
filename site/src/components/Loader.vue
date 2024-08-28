<template>
  <Skeleton>
    <slot />
  </Skeleton>
</template>

<script setup lang="ts">
import Skeleton, {
  type SkeletonEmits,
  type SkeletonProps,
  SkeletonSlots,
} from "primevue/skeleton";
import { defineComponent } from "vue";

defineComponent<SkeletonProps, SkeletonEmits, SkeletonSlots>({});
</script>
