<template>
  <div class="flex">
    <div class="components text-white p-5 flex-grow">
      <div class="bg-violet-800 p-10">
        <p class="text-3xl font-bold text-white text-center">
          Select from {{ props.type }}
        </p>
      </div>
      <Search :type="props.type" @search="handleSearch" />
      <ul v-if="!fetchError && paginatedData.length">
        <table
          class="mx-16 my-5 w-11/12 bg-neutral-800 text-white border-separate border-spacing-0"
        >
          <thead>
            <tr>
              <th
                class="border-b border-neutral-400 px-6 py-3 text-left bg-neutral-700"
              ></th>
              <th
                v-for="(key, index) in sortedKeys"
                :key="index"
                class="border-b border-neutral-400 px-6 py-3 text-left bg-neutral-700 capitalize text-nowrap"
              >
                <div>
                  {{ formatKey(key) }}
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
                  <div
                    v-else-if="key === 'image'"
                    class="h-12 w-12 flex items-center"
                  >
                    <img :src="item[key]" class="object-contain rounded-md" />
                  </div>
                  <BenchmarkBar
                    v-else-if="key === 'benchmark'"
                    :value="item[key]"
                    :maxValue="type === 'cpus' ? 133 : 370"
                  />
                  <div v-else>
                    {{ formatValue(item[key], key) }}
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
      <p v-if="isLoading" class="mt-4"></p>

      <div class="flex justify-center items-center mt-5">
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
import { ref, computed, watch } from "vue";
import BaseButton from "../components/BaseButton.vue";
import Checkbox from "../components/Checkbox.vue";
import { useRouter } from "vue-router";
import useFetch from "../composables/useFetch";
import { ComponentBase } from "../types/componentBase";
import SystemRequirementsSidebar from "../components/SystemRequirementsSidebar.vue";
import CaretIcon from "@/assets/icons/caret.svg";
import Modal from "../components/Modal.vue";
import BenchmarkBar from "../components/BenchmarkBar.vue";
import Search from "../components/SearchComponents.vue";

const props = defineProps<{ type: string }>();
const router = useRouter();
const emit = defineEmits<{
  (event: "add", data: { name: string; price: number }): void;
}>();

const currentPage = ref(1);
const itemsPerPage = ref(10);
const searchQuery = ref("");
const data = ref<any>(0);

const fetchUrl = computed(() => {
  return searchQuery.value
    ? `http://localhost:5000/api/${props.type}/search?q=${encodeURIComponent(
        searchQuery.value
      )}&page=${currentPage.value}&limit=${itemsPerPage.value}`
    : `http://localhost:5000/api/${props.type}?page=${currentPage.value}&limit=${itemsPerPage.value}`;
});

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

  const powerConsumptionIndex = keys.indexOf("power_consumption");
  if (powerConsumptionIndex !== -1) {
    keys.splice(powerConsumptionIndex, 1);
  }

  const selectedIndex = keys.indexOf("selected");
  if (selectedIndex !== -1) {
    keys.splice(selectedIndex, 1);
  }

  const priceIndex = keys.indexOf("price");
  if (priceIndex !== -1) {
    keys.splice(priceIndex, 1);
  }

  const pricePerGbIndex = keys.indexOf("price_per_gb");
  if (pricePerGbIndex !== -1) {
    keys.splice(pricePerGbIndex, 1);
  }

  const imageIndex = keys.indexOf("image");
  if (imageIndex !== -1) {
    keys.splice(imageIndex, 1);
    keys.unshift("image");
  }

  keys.push("store");

  return keys;
});

const formatKey = (key: string) => {
  const aliases: { [key: string]: string } = {
    price_data: "price",
    tdp: "TDP",
    smt: "SMT",
    rpm: "RPM",
    psu: "PSU",
    internal_35_bays: "internal 3.5 bays",
    pwm: "PWM",
  };

  if (aliases[key]) {
    key = aliases[key];
  }
  return key.replace(/_/g, " ");
};

const formatValue = (value: any, key: string) => {
  const formatArrayValue = (suffix: string) => {
    if (!value.length) {
      return "N/A";
    } else if (value.length === 1) {
      return `${value[0]} ${suffix}`;
    } else {
      return `${value[0]} - ${value[1]} ${suffix}`;
    }
  };

  if (!value) {
    return "N/A";
  }

  if (key === "tdp" || key === "psu" || key === "wattage") {
    return `${value} W`;
  }

  if (key === "smt" || key === "pwm") {
    return value ? "Yes" : "No";
  }

  if (key === "boost_clock" || key === "core_clock") {
    return `${value} ${props.type === "cpus" ? "GHz" : "MHz"}`;
  }

  if (key === "rpm") {
    return formatArrayValue("RPM");
  }

  if (key === "noise_level") {
    return formatArrayValue("dB");
  }

  if (key === "size" || key === "length") {
    return `${value} mm`;
  }

  if (key === "memory" || key === "capacity" || key === "max_memory") {
    return `${value} GB`;
  }

  if (key === "external_volume") {
    return `${value} L`;
  }

  if (key === "airflow") {
    return formatArrayValue("CFM");
  }

  if (key === "cache") {
    return `${value} MB`;
  }

  if (key === "speed") {
    if (!value.length || value.length !== 2) {
      return "N/A";
    } else {
      return `DDR${value[0]} ${value[1]} MHz`;
    }
  }

  if (key === "modules") {
    if (!value.length || value.length !== 2) {
      return "N/A";
    } else {
      return `${value[0]} x ${value[1]} GB`;
    }
  }

  if (key === "first_word_latency") {
    return `${value} ns`;
  }

  return value;
};

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

    if (props.type === "gpus") {
      selectedComponents["gpus"].chipset = (item as any).chipset;
    }
  }

  localStorage.setItem(
    "selectedComponents",
    JSON.stringify(selectedComponents)
  );

  router.push({
    name: "home",
  });
};

const totalPages = computed(() =>
  Math.ceil((data.value?.total || 0) / itemsPerPage.value)
);
const paginatedData = computed(() => data.value?.data || []);

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
const handleSearch = (query: string) => {
  searchQuery.value = query;
  currentPage.value = 1;
};

watch(fetchedData, (newValue) => {
  if (newValue) {
    console.log(newValue);
    data.value = newValue;
  }
});
</script>
