<template>
  <ToggleSwitch />
</template>

<script setup lang="ts">
import ToggleSwitch, {
  type ToggleSwitchEmits,
  type ToggleSwitchProps,
  ToggleSwitchSlots,
} from "primevue/toggleswitch";
import { defineComponent } from "vue";

defineComponent<ToggleSwitchProps, ToggleSwitchEmits, ToggleSwitchSlots>({});
</script>
