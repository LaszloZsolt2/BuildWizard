<template>
  <AutoComplete />
</template>

<script setup lang="ts">
import AutoComplete, {
  type AutoCompleteEmits,
  type AutoCompleteProps,
  AutoCompleteSlots,
} from "primevue/autocomplete";
import { defineComponent } from "vue";

defineComponent<AutoCompleteProps, AutoCompleteEmits, AutoCompleteSlots>({});
</script>
