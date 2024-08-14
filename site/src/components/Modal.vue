<template>
  <Dialog
    v-bind="$attrs"
    :visible="modelValue"
    @update:visible="updateVisibility"
    :modal="true"
  >
    <template v-if="$slots.header" #header>
      <slot name="header" />
    </template>
    <!-- Use the default slot for the content -->
    <template v-if="$slots.default" #default>
      <slot />
    </template>
    <template v-if="$slots.footer" #footer>
      <slot name="footer" />
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from "vue";
import Dialog from "primevue/dialog";

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits(["update:modelValue"]);

function updateVisibility(value: boolean) {
  emit("update:modelValue", value);
}
</script>
