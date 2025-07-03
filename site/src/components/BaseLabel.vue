<template>
  <Message>
    <slot />
  </Message>
</template>

<script setup lang="ts">
import Message, {
  type MessageEmits,
  type MessageProps,
  MessageSlots,
} from "primevue/message";
import { defineComponent } from "vue";

defineComponent<MessageProps, MessageEmits, MessageSlots>({});
</script>
