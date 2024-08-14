<template>
  <Message
    :severity="props.severity"
    :closable="props.closable"
    :life="props.disappearAfter"
    @close="props.onClose"
  >
    <slot></slot>
  </Message>
</template>

<script setup lang="ts">
import { defineProps } from "vue";
interface MessageProps {
  severity?: "info" | "warn" | "error" | "success" | "secondary";
  closable?: boolean;
  disappearAfter?: number; // number of milliseconds before the message disappears
  onClose?: () => void;
}

const props = defineProps<MessageProps>();
</script>
