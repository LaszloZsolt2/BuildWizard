<template>
  <InputText />
</template>

<script setup lang="ts">
import InputText, {
  type InputTextEmits,
  type InputTextProps,
  InputTextSlots,
} from "primevue/inputtext";
import { defineComponent } from "vue";

defineComponent<InputTextProps, InputTextEmits, InputTextSlots>({});
</script>
