<template>
  <template v-if="part.multiple">
    <!-- <tr v-for="p in selected[part.type]" class=""> -->
    <td class="px-1 py-2 md:p-3 w-1/12">
      <Parts :type="part.type">
        <div class="text-xs md:text-base">
          {{ part.label }}
        </div>
      </Parts>
    </td>
    <td
      class="px-1 py-2 md:p-3 max-w-2 md:max-w-none text-xs md:text-base text-white text-center"
    >
      <div v-for="p in selected[part.type]" class="my-8">
        {{ p.name || "" }}
      </div>
    </td>

    <td
      class="px-1 py-2 md:p-3 max-w-2 md:max-w-none text-xs md:text-base text-white text-center"
    >
      <div v-for="p in selected[part.type]" class="my-8">
        <div v-if="p?.price_data">{{ p?.price_data[0].price }} lei</div>
        <div v-else>N/A</div>
      </div>
    </td>
    <td
      class="px-1 py-2 md:p-3 max-w-2 md:max-w-none text-xs md:text-base text-center"
    >
      <div v-for="p in selected[part.type]" class="my-8">
        <div v-if="p?.price_data" class="text-nowrap">
          <a :href="p.price_data[0]?.url">
            <img
              :src="p.price_data[0]?.logo"
              :alt="p.price_data[0]?.shop"
              class="h-12 w-20 object-contain inline"
            />
          </a>
          <CaretIcon
            @click="modalData = p"
            class="h-12 text-neutral-500 hover:text-neutral-200 inline rotate-90 p-3 transition-all"
          />
        </div>
        <div v-else-if="p">N/A</div>
      </div>
    </td>
    <td class="text-right">
      <div v-for="p in selected[part.type]" class="my-8">
        <Delete :type="part.type" @delete="handleDelete(part.type, p)" />
      </div>
    </td>
    <!-- </tr> -->
  </template>
  <template v-else>
    <td class="px-1 py-2 md:p-3 w-1/12">
      <Parts :type="part.type">
        <div class="text-xs md:text-base">
          {{ part.label }}
        </div>
      </Parts>
    </td>
    <td
      class="px-1 py-2 md:p-3 max-w-2 md:max-w-none text-xs md:text-base text-white text-center"
    >
      {{ selected[part.type]?.name || "" }}
    </td>

    <td
      class="px-1 py-2 md:p-3 max-w-2 md:max-w-none text-xs md:text-base text-white text-center"
    >
      <div v-if="selected[part.type]?.price">
        {{ selected[part.type].price[0]?.price }} lei
      </div>
      <div v-else-if="selected[part.type]">N/A</div>
    </td>
    <td class="px-1 py-2 md:p-3 w-12 md:w-48 text-xs md:text-base text-center">
      <div v-if="selected[part.type]?.price" class="text-nowrap">
        <a :href="selected[part.type].price[0]?.url">
          <img
            :src="selected[part.type].price[0]?.logo"
            :alt="selected[part.type].price[0]?.shop"
            class="h-12 w-20 object-contain inline"
          />
        </a>
        <CaretIcon
          @click="modalData = selected[part.type]"
          class="h-12 text-neutral-500 hover:text-neutral-200 inline rotate-90 p-3 transition-all"
        />
      </div>
      <div v-else-if="selected[part.type]">N/A</div>
    </td>
    <td class="text-right">
      <Delete
        v-if="selected[part.type]"
        :type="part.type"
        @delete="handleDelete"
      />
    </td>
  </template>
  <Modal
    v-model="modalData"
    :breakpoints="{ '1199px': '50vw', '575px': '75vw' }"
  >
    <template #header>
      <h1 class="text-2xl">Prices for {{ modalData.name }}</h1>
    </template>
    <div v-if="modalData">
      <a
        :href="offer.url"
        v-for="offer in modalData.price_data || modalData.price"
        class="flex content-between w-full my-2"
      >
        <img
          :src="offer.logo"
          :alt="offer.shop"
          class="h-12 w-20 object-contain"
        />
        <p class="flex-1 text-right text-xl font-bold self-center">
          {{ offer.price }} lei
        </p>
      </a>
    </div>
    <template #footer>
      <BaseButton
        severity="secondary"
        label="Close"
        @click="modalData = null"
      />
    </template>
  </Modal>
</template>

<script setup lang="ts">
import Parts from "../components/Parts.vue";
import Delete from "../components/DeleteButton.vue";
import { PartListItem } from "../types/partListItem";
import { onMounted, ref } from "vue";
import CaretIcon from "@/assets/icons/caret.svg";
import Modal from "./Modal.vue";
import BaseButton from "./BaseButton.vue";

type Props = {
  part: PartListItem;
};

defineProps<Props>();

const selected = ref<{
  [key: string]: any;
}>({});

const modalData = ref<any>(null);
const emit = defineEmits(["delete-part"]);

function removeItem(type: any) {
  const currentItems = JSON.parse(
    localStorage.getItem("selectedComponents") || "{}"
  );
  const newItems = { ...currentItems };
  delete newItems[type];
  localStorage.setItem("selectedComponents", JSON.stringify(newItems));
  selected.value = newItems;
}

const handleDelete = (type: string, part?: any) => {
  selected.value = JSON.parse(
    localStorage.getItem("selectedComponents") || "{}"
  );
  if (part) {
    const index = selected.value[type].findIndex(
      (p: any) => p._id === part._id
    );
    if (index !== -1) {
      selected.value[type].splice(index, 1);
    }
  } else {
    removeItem(type);
  }
  localStorage.setItem("selectedComponents", JSON.stringify(selected.value));
  emit("delete-part", selected.value);
};

onMounted(() => {
  const storedData = localStorage.getItem("selectedComponents");
  if (storedData) {
    selected.value = JSON.parse(storedData);
  }
});
</script>
