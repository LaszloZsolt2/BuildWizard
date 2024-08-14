<template>
  <Message :severity="props.severity">
    <slot></slot>
  </Message>
</template>

<script setup lang="ts">
import { defineProps } from "vue";
interface MessageProps {
  severity?: "info" | "warn" | "error" | "success" | "secondary";
}

const props = defineProps<MessageProps>();
</script>
