<template>
  <div class="sample">
    <BaseLabel class="m-4"> Primary message </BaseLabel>
    <BaseLabel severity="warn" class="m-4"> Warn message </BaseLabel>
    <BaseLabel severity="error" class="m-4" :life="5000">
      Error message
    </BaseLabel>
    <BaseLabel severity="contrast" class="m-4"> Contrast message </BaseLabel>
    <BaseLabel severity="success" class="m-4"> Success message </BaseLabel>
    <BaseLabel
      severity="secondary"
      class="m-4"
      :closable="true"
      @close="() => console.log('closed')"
    >
      Secondary message
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
      :invalid="inputValue.length"
      class="block m-4"
    />
    <BaseInput type="text" v-model="inputValue" disabled class="block m-4" />

    <br />
    <BaseToggle v-model="isToggled" class="m-4" />
    <BaseToggle v-model="isToggled" :invalid="!isToggled" class="m-4" />
    <BaseToggle v-model="isToggled" disabled class="m-4" />

    <br />
    <BaseButton label="Primary button" class="m-4" />
    <BaseButton label="Loading button" :loading="isLoading" class="m-4" />
    <BaseButton label="Rounded button" rounded class="m-4" />
    <BaseButton label="Text button" text class="m-4" />
    <BaseButton label="Outlined button" outlined class="m-4" />
    <br />
    <BaseButton label="Secondary button" severity="secondary" class="m-4" />
    <BaseButton label="Success button" severity="success" class="m-4" />
    <BaseButton label="Warn button" severity="warn" class="m-4" />
    <BaseButton label="Danger button" severity="danger" class="m-4" />
    <BaseButton label="Contrast button" severity="contrast" class="m-4" />
  </div>
</template>

<script setup lang="ts">
import BaseLabel from "@/components/BaseLabel.vue";
import BaseInput from "@/components/BaseInput.vue";
import BaseToggle from "@/components/BaseToggle.vue";
import BaseButton from "@/components/BaseButton.vue";
import { ref } from "vue";

const inputValue = ref("");
const isToggled = ref(false);
const isLoading = ref(true);

setInterval(() => {
  isLoading.value = !isLoading.value;
}, 5000);
</script>
