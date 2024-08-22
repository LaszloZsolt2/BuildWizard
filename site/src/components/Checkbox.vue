<template>
  <Checkbox :binary="true" v-model="modelValue" />
</template>

<script setup lang="ts">
import { defineProps, defineEmits, ref, watch } from "vue";
import Checkbox from "primevue/checkbox";

const props = defineProps<{
  modelValue: boolean;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
}>();

const modelValue = ref(props.modelValue);

const updateValue = (value: boolean) => {
  modelValue.value = value;
  emit("update:modelValue", value);
};

watch(
  () => props.modelValue,
  (newValue) => {
    modelValue.value = newValue;
  }
);
</script>
