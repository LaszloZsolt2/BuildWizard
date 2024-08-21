<template>
  <Checkbox :binary="true" />
</template>

<script setup lang="ts">
import Checkbox, {
  type CheckboxEmits,
  type CheckboxProps,
  CheckboxSlots,
} from "primevue/checkbox";
import { defineComponent } from "vue";

defineComponent<CheckboxProps, CheckboxEmits, CheckboxSlots>({});
</script>
