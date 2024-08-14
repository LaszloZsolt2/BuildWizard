<template>
  <div class="sample">
    <BaseLabel class="m-4"> Test message </BaseLabel>
    <BaseLabel severity="warn" class="m-4"> Test message </BaseLabel>
    <BaseLabel severity="error" class="m-4"> Test message </BaseLabel>
    <BaseLabel severity="contrast" class="m-4"> Test message </BaseLabel>
    <BaseLabel severity="success" class="m-4" :life="5000">
      Test message
    </BaseLabel>
    <BaseLabel
      severity="secondary"
      class="m-4"
      :closable="true"
      @close="() => console.log('closed')"
    >
      Test message
    </BaseLabel>

    <BaseInput type="text" v-model="value" />
    <BaseInput type="text" v-model="value" variant="filled" />
    <BaseInput type="text" v-model="value" :invalid="!value" />
    <BaseInput type="text" v-model="value" disabled />
  </div>
</template>

<script setup lang="ts">
import BaseLabel from "@/components/BaseLabel.vue";
import BaseInput from "@/components/BaseInput.vue";
import { ref } from "vue";

const value = ref("");
</script>
