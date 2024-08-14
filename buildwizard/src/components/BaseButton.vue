<template>
  <Button>
    <slot />
  </Button>
</template>

<script setup lang="ts">
import Button, {
  type ButtonEmits,
  type ButtonProps,
  ButtonSlots,
} from "primevue/button";
import { defineComponent } from "vue";

defineComponent<ButtonProps, ButtonEmits, ButtonSlots>({});
</script>
