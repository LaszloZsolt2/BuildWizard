<template>
  <div class="bg-neutral-800 my-2 p-4 rounded-lg" :style="{ width: '80vw' }">
    <div class="flex items-center mb-4">
      <Checkbox
        v-model="part.selected"
        binary="true"
        @change="() => emit('select')"
        class="mr-4"
      />
      <div class="w-10 h-10 flex mr-3 items-center">
        <img
          v-if="part.image"
          :src="part.image"
          class="object-contain rounded-md"
        />
      </div>
      <span class="text-sm">
        {{ part.name }}
      </span>
    </div>
    <div class="flex flex-wrap">
      <div v-for="key in displayedKeys" class="capitalize pr-4 pb-2">
        <div class="text-2xs text-neutral-400">
          {{ formatKey(key) }}
        </div>
        <div
          v-if="key === 'store' && part['price_data']"
          class="text-nowrap -mt-3"
        >
          <a :href="part['price_data'][0].url">
            <img
              :src="part['price_data'][0].logo"
              :alt="part['price_data'][0].shop"
              class="h-8 w-12 object-contain inline"
            />
          </a>
          <CaretIcon
            @click="() => emit('store-modal-open', part)"
            class="h-10 text-neutral-500 hover:text-neutral-200 inline rotate-90 p-3 transition-all"
          />
        </div>
        <div v-else class="text-xs my-1">
          {{ formatValue(part[key], key, type) }}
        </div>
      </div>
    </div>
    <div class="flex items-center">
      <div class="ml-auto">
        <span class="text-violet-400 font-bold">
          {{ part.price_data[0].price }}
        </span>
        <span class="text-sm text-neutral-300 mr-3"> lei</span>
      </div>
      <BaseButton @click="emit('add', part)">
        <span class="text-sm -m-1 font-bold"> Add </span>
      </BaseButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import Checkbox from "primevue/checkbox";
import { computed } from "vue";
import { formatKey, formatValue } from "../utils/formatValues";
import CaretIcon from "@/assets/icons/caret.svg";
import BaseButton from "./BaseButton.vue";
type Props = {
  part: any;
  keys: any[];
  type: string;
};

const props = defineProps<Props>();
const emit = defineEmits(["select", "store-modal-open", "add"]);

const displayedKeys = computed(() => {
  let keys = props.keys;
  const removedKeys = ["selected", "image", "name", "price_data"];
  keys = keys.filter((key) => !removedKeys.includes(key));
  return keys;
});
</script>
