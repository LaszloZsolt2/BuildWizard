<template>
  <div class="px-2 py-3 md:p-4">
    <BaseLabel>
      <router-link :to="{ name: 'components', query: { type: props.type } }">
        <p
          class="text-xl font-semibold hover:underline cursor-pointer text-nowrap"
        >
          <slot></slot>
        </p>
      </router-link>
    </BaseLabel>
  </div>
</template>

<script setup lang="ts">
import BaseLabel from "./BaseLabel.vue";

const props = defineProps<{
  type: string;
}>();
</script>
