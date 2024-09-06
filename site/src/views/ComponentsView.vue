<template>
  <div class="flex">
    <div class="components text-white p-5 flex-grow">
      <ul v-if="!isLoading && !fetchError && paginatedData.length">
        <div class="bg-violet-800 p-10">
          <p class="text-3xl font-bold text-white text-center">
            Select from {{ props.type }}
          </p>
        </div>
        <table
          class="mx-16 my-20 w-11/12 bg-neutral-800 text-white border-separate border-spacing-0"
        >
          <thead>
            <tr>
              <th
                class="border-b border-neutral-400 px-6 py-3 text-left bg-neutral-700"
              ></th>
              <th
                v-for="(key, index) in sortedKeys"
                :key="index"
                class="border-b border-neutral-400 px-6 py-3 text-left bg-neutral-700"
              >
                <div class="">
                  {{ key }}
                </div>
              </th>
              <th
                class="border-b border-neutral-400 px-6 py-3 text-left bg-neutral-700"
              ></th>
            </tr>
          </thead>

          <tbody>
            <tr
              v-for="item in paginatedData"
              :key="item._id"
              class="hover:bg-neutral-700"
            >
              <td class="border-b border-neutral-400 px-6 py-4">
                <Checkbox v-model="item.selected" :binary="true" />
              </td>
              <td
                v-for="key in sortedKeys"
                :key="key"
                class="border-b border-neutral-400 px-6 py-4"
              >
                <div v-if="item[key]">
                  <div v-if="key === 'price_data'">
                    {{ item[key][0].price }} lei
                  </div>
                  <div v-else-if="key === 'image'">
                    <img :src="item[key]" class="h-12 w-20 object-contain" />
                  </div>
                  <div v-else>
                    {{ item[key] }}
                  </div>
                </div>
                <div
                  v-if="key === 'store' && item['price_data']"
                  class="text-nowrap"
                >
                  <a :href="item['price_data'][0].url">
                    <img
                      :src="item['price_data'][0].logo"
                      :alt="item['price_data'][0].shop"
                      class="h-12 w-20 object-contain inline"
                    />
                  </a>
                  <CaretIcon
                    @click="modalData = item"
                    class="h-12 text-neutral-500 hover:text-neutral-200 inline rotate-90 p-3 transition-all"
                  />
                </div>
              </td>

              <td class="border-b border-neutral-400 px-6 py-4">
                <BaseButton
                  @click="handleAddClick(item)"
                  class="bg-blue-500 text-white hover:bg-blue-600"
                >
                  Add
                </BaseButton>
              </td>
            </tr>
          </tbody>
        </table>
      </ul>
      <p v-if="fetchError" class="text-red-500 mt-4">Error: {{ fetchError }}</p>
      <p v-if="isLoading" class="mt-4">Loading...</p>

      <div
        v-if="!isLoading && totalPages > 1"
        class="flex justify-center items-center mt-5"
      >
        <BaseButton
          @click="prevPage"
          :disabled="currentPage === 1"
          class="w-15 h-8"
        >
          Back
        </BaseButton>
        <span class="p-5">{{ currentPage }} / {{ totalPages }}</span>
        <BaseButton
          @click="nextPage"
          :disabled="currentPage === totalPages"
          class="w-15 h-8"
        >
          Next
        </BaseButton>
      </div>
    </div>
    <SystemRequirementsSidebar class="flex-1" />
  </div>
  <Modal
    v-model="modalData"
    :breakpoints="{ '1199px': '50vw', '575px': '75vw' }"
  >
    <template #header
      ><h1 class="text-2xl">Prices for {{ modalData.name }}</h1></template
    >
    <div>
      <a
        :href="offer.url"
        v-for="offer in modalData.price_data"
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
import { ref, computed } from "vue";
import BaseButton from "../components/BaseButton.vue";
import Checkbox from "../components/Checkbox.vue";
import { useRouter } from "vue-router";
import useFetch from "../composables/useFetch";
import { ComponentBase } from "../types/componentBase";
import SystemRequirementsSidebar from "../components/SystemRequirementsSidebar.vue";
import CaretIcon from "@/assets/icons/caret.svg";
import Modal from "../components/Modal.vue";

const props = defineProps<{ type: string }>();
const router = useRouter();
const emit = defineEmits<{
  (event: "add", data: { name: string; price: number }): void;
}>();

const currentPage = ref(1);
const itemsPerPage = ref(10);

const fetchUrl = computed(
  () =>
    `http://localhost:5000/api/${props.type}?page=${currentPage.value}&limit=${itemsPerPage.value}`
);

const { fetchedData, fetchError, isLoading } = useFetch(fetchUrl);

const allKeys = computed(() => {
  if (paginatedData.value.length === 0) return [];
  return Object.keys(paginatedData.value[0]).filter((key) => key !== "_id");
});

const modalData = ref<any>(null);

const sortedKeys = computed(() => {
  const keys = [...allKeys.value];

  const versionIndex = keys.indexOf("__v");
  if (versionIndex !== -1) {
    keys.splice(versionIndex, 1);
  }

  const selectedIndex = keys.indexOf("selected");
  if (selectedIndex !== -1) {
    keys.splice(selectedIndex, 1);
  }

  const priceIndex = keys.indexOf("price");
  if (priceIndex !== -1) {
    keys.splice(priceIndex, 1);
  }

  const imageIndex = keys.indexOf("image");
  if (imageIndex !== -1) {
    keys.splice(imageIndex, 1);
    keys.unshift("image");
  }

  keys.push("store");

  return keys;
});

const handleAddClick = (item: ComponentBase) => {
  emit("add", { name: item.name, price: item.price_data });

  const selectedComponents = JSON.parse(
    localStorage.getItem("selectedComponents") || "{}"
  );

  const allowMultiple = ["memories", "hard-drives", "case-fans"];
  if (allowMultiple.includes(props.type)) {
    if (!selectedComponents[props.type]) {
      selectedComponents[props.type] = [];
    }
    selectedComponents[props.type].push({
      name: item.name,
      price_data: item.price_data,
      _id: item._id,
    });
  } else {
    selectedComponents[props.type] = {
      name: item.name,
      price: item.price_data,
      _id: item._id,
    };
  }

  localStorage.setItem(
    "selectedComponents",
    JSON.stringify(selectedComponents)
  );

  router.push({
    name: "home",
    query: {
      type: props.type,
      name: item.name,
      price: item.price_data?.toString(),
    },
  });
};

const totalPages = computed(() =>
  Math.ceil((fetchedData.value?.total || 0) / itemsPerPage.value)
);
const paginatedData = computed(() => fetchedData.value?.data || []);

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value += 1;
  }
};

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value -= 1;
  }
};
</script>
