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

    <BaseInput type="text" v-model="inputValue" class="block m-4" />
    <BaseInput
      type="text"
      v-model="inputValue"
      variant="filled"
      class="block m-4"
    />
    <BaseInput
      type="text"
      v-model="inputValue"
      :invalid="!inputValue"
      class="block m-4"
    />
    <BaseInput type="text" v-model="inputValue" disabled class="block m-4" />

    <br />
    <BaseToggle v-model="isToggled" class="m-4" />
    <BaseToggle v-model="isToggled" :invalid="!isToggled" class="m-4" />
    <BaseToggle v-model="isToggled" disabled class="m-4" />
  </div>
</template>

<script setup lang="ts">
import BaseLabel from "@/components/BaseLabel.vue";
import BaseInput from "@/components/BaseInput.vue";
import BaseToggle from "@/components/BaseToggle.vue";
import { ref } from "vue";

const inputValue = ref("");
const isToggled = ref(false);
</script>
