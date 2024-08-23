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

    <SearchableSelector
      v-model="selectedItem"
      :items="items"
      class="block m-4"
    />
    <br />
    <div>
      <Delete type="Delete" />
    </div>

    <br />
    <div>
      <h1>Checkbox Example</h1>
      <Checkbox v-model="isChecked" class="m-4" />
      <Checkbox v-model="isChecked" :invalid="!isChecked" class="m-4" />
      <p>Checkbox is {{ isChecked ? "checked" : "unchecked" }}</p>
    </div>

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

    <br />
    <BaseButton
      @click="isModalOpen = !isModalOpen"
      label="Open modal"
      class="m-4"
    />
    <Modal
      v-model="isModalOpen"
      :breakpoints="{ '1199px': '50vw', '575px': '75vw' }"
    >
      <template #header><h1 class="text-2xl">Test modal</h1></template>
      <div>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Inventore modi
        adipisci dolores optio cupiditate vel quia, error placeat ullam, eaque
        itaque quis blanditiis? Veniam adipisci saepe facilis quasi assumenda.
        Nisi?
      </div>
      <template #footer>
        <BaseButton label="Accept" @click="isModalOpen = false" />
        <BaseButton
          severity="secondary"
          label="Close"
          @click="isModalOpen = false"
        />
      </template>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import BaseLabel from "../components/BaseLabel.vue";
import BaseInput from "../components/BaseInput.vue";
import BaseToggle from "../components/BaseToggle.vue";
import BaseButton from "../components/BaseButton.vue";
import Modal from "../components/Modal.vue";
import SearchableSelector from "../components/SearchableSelector.vue";
import Checkbox from "../components/Checkbox.vue";
import Delete from "../components/Delete.vue";

import { ref } from "vue";
const items = ref([
  { label: "Apple", value: "apple" },
  { label: "Banana", value: "banana" },
  { label: "Cherry", value: "cherry" },
]);
const isDeleted = ref(false);
const isChecked = ref(false);
const inputValue = ref("");
const isToggled = ref(false);
const isLoading = ref(true);
const isModalOpen = ref(false);
const selectedItem = ref(null);

setInterval(() => {
  isLoading.value = !isLoading.value;
}, 5000);
</script>
