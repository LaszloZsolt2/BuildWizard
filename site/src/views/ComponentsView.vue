<template>
  <div class="flex">
    <div class="components text-white p-5 flex-grow">
      <BaseButton
        label="Secondary button"
        severity="secondary"
        class="my-4 mr-5"
        v-if="isCompareButtonVisible && isMobile"
        @click="goToComparePage"
      >
        Compare
      </BaseButton>
      <div v-if="isMobile" class="mb-4">
        <BaseButton
          @click="isSearchOpen = !isSearchOpen"
          text
          rounded
          severity="secondary"
          class="mb-2 md:mb-0 -ml-2 md:ml-0"
        >
          <SearchIcon
            class="h-5 w-5 text-neutral-500 hover:text-neutral-200 transition-all"
          />
          <span class="font-bold mt-1"> Search </span>
        </BaseButton>
      </div>
      <div
        v-if="isSearchOpen || !isMobile"
        class="flex flex-col-reverse md:flex-row items-start md:items-end -ml-10 md:ml-0 -mt-6 md:mt-0 scale-75 md:scale-100 transition-all overflow-clip"
      >
        <div class="flex-grow">
          <div class="flex flex-col md:flex-row items-start md:items-center">
            <BaseButton
              label="Secondary button"
              severity="secondary"
              class="my-4 mr-5"
              v-if="isCompareButtonVisible && !isMobile"
              @click="goToComparePage"
            >
              Compare
            </BaseButton>
            <div class="flex flex-col mr-2 -mt-5">
              <div
                class="text-neutral-400 font-bold mb-1"
                :style="{ fontSize: '.78rem' }"
              >
                System requirements filter
              </div>
              <Select
                v-model="systemRequirementsFilter"
                :options="systemRequirementFilterOptions"
                @update:modelValue="
                  handleSystemRequirementsFilterChange($event)
                "
                :disabled="!games.length"
                placeholder="System requirements filter"
                class="h-10 w-64 mb-2 md:mb-0"
              />
            </div>
            <BaseButton
              @click="toggleCompatibilityFilter"
              text
              rounded
              severity="secondary"
              class="mb-2 md:mb-0 -ml-2 md:ml-0"
            >
              <BaseToggle
                v-model="isCompatibilityFilterEnabled"
                class="pointer-events-none"
              />
              <span class="font-bold mt-1"> Compatibility filter </span>
            </BaseButton>
          </div>
        </div>
        <Search
          :type="props.type"
          @search="handleSearch"
          class="mb-8 md:mb-0"
        />
      </div>
      <Transition name="opacity-slide-left">
        <p v-if="isLoading" class="mt-4">
          <ComponentsLoader />
        </p>
        <div v-else>
          <ul v-if="!fetchError && paginatedData.length">
            <table
              v-if="!isMobile"
              class="mx-0 my-5 w-full bg-neutral-800 text-white border-separate border-spacing-0"
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
                    <Checkbox
                      v-model="item.selected"
                      :binary="true"
                      @change="handleCheckboxChange(item)"
                    />
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
                        <img
                          :src="item[key]"
                          class="h-12 w-20 object-contain"
                        />
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
            <div v-else>
              <MobileComponentCard
                v-for="item in paginatedData"
                :part="item"
                :key="item._id"
                @select="handleCheckboxChange(item)"
                @store-modal-open="modalData = $event"
                @add="handleAddClick"
                :keys="sortedKeys"
                :type="type"
              />
            </div>
          </ul>
        </div>
      </Transition>
      <p v-if="fetchError" class="text-red-500 mt-4">Error: {{ fetchError }}</p>

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
  <Modal
    v-model="errorDialogVisible"
    header="Selection Limit"
    modal
    :breakpoints="{ '1199px': '50vw', '575px': '75vw' }"
  >
    <p>You can only select up to {{ maxSelection }} items.</p>
  </Modal>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import BaseButton from "../components/BaseButton.vue";
import BaseToggle from "../components/BaseToggle.vue";
import Checkbox from "../components/Checkbox.vue";
import { useRouter } from "vue-router";
import useFetch from "../composables/useFetch";
import { ComponentBase } from "../types/componentBase";
import SystemRequirementsSidebar from "../components/SystemRequirementsSidebar.vue";
import CaretIcon from "@/assets/icons/caret.svg";
import SearchIcon from "@/assets/icons/search.svg";
import Modal from "../components/Modal.vue";
import BenchmarkBar from "../components/BenchmarkBar.vue";
import { formatValue, formatKey } from "../utils/formatValues";
import Search from "../components/SearchComponents.vue";
import { buildQueryParams } from "../utils/buildQueryParams";
import Select from "primevue/select";
import { useScreenSize } from "../composables/useScreenSize";
import MobileComponentCard from "../components/MobileComponentCard.vue";
import ComponentsLoader from "../components/loaders/ComponentsLoader.vue";
import { nextTick } from "vue";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

const props = defineProps<{ type: string }>();
const router = useRouter();
const emit = defineEmits<{
  (event: "add", data: { name: string; price: number }): void;
}>();
const selectedComponents = ref<SelectableComponent[]>([]);
const maxSelection = 5;
const errorDialogVisible = ref(false);

const goToComparePage = () => {
  selectedComponents.value = paginatedData.value.filter(
    (item: SelectableComponent) => item.selected
  );

  if (selectedComponents.value.length > maxSelection) {
    alert(`You can only select up to ${maxSelection} items.`);
    return;
  }

  localStorage.setItem(
    "compareComponents",
    JSON.stringify({
      [props.type]: selectedComponents.value,
    })
  );

  router.push({
    name: "compare",
    query: {
      type: props.type,
    },
  });
};

interface SelectableComponent extends ComponentBase {
  selected: boolean;
}

const isCompareButtonVisible = computed(() => {
  const selectedCount = paginatedData.value.filter(
    (item: SelectableComponent) => item.selected
  ).length;
  return selectedCount >= 2;
});

const currentPage = ref(1);
const itemsPerPage = ref(10);
const searchQuery = ref("");
const data = ref<any>(0);
const isCompatibilityFilterEnabled = ref(
  localStorage.getItem("compatibilityFilter") === "true"
);
const selectedGames = ref(JSON.parse(localStorage.getItem("games") || "[]"));
const games = computed(() => selectedGames.value.map((game: any) => game._id));
const systemRequirementsFilter = ref<string>(
  localStorage.getItem("systemRequirementsFilter") || "Off"
);
const systemRequirementFilterOptions = ["Off", "Minimum", "Recommended"];
const requirementsFilter = computed(() =>
  systemRequirementsFilter.value.toLowerCase()
);
const { screenWidth } = useScreenSize();
const isMobile = computed(() => screenWidth.value < 768);
const isSearchOpen = ref(false);

const fetchUrl = computed(() => {
  const selectedParts = JSON.parse(
    localStorage.getItem("selectedComponents") || "{}"
  );
  const simplifiedParts = Object.keys(selectedParts).reduce((acc: any, key) => {
    if (Array.isArray(selectedParts[key])) {
      acc[key] = selectedParts[key].map((part: any) => part._id);
    } else {
      acc[key] = selectedParts[key]._id;
    }
    return acc;
  }, {});

  return searchQuery.value ||
    isCompatibilityFilterEnabled.value ||
    requirementsFilter.value !== "off"
    ? `${apiBaseUrl}/${props.type}/search?q=${encodeURIComponent(
        searchQuery.value
      )}&page=${currentPage.value}&limit=${
        itemsPerPage.value
      }&compatibilityFilter=${
        isCompatibilityFilterEnabled.value
      }&systemRequirementsFilter=${requirementsFilter.value}&${buildQueryParams(
        games.value,
        simplifiedParts
      )}`
    : `${apiBaseUrl}/${props.type}?page=${currentPage.value}&limit=${itemsPerPage.value}`;
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

const toggleCompatibilityFilter = () => {
  isCompatibilityFilterEnabled.value = !isCompatibilityFilterEnabled.value;
  currentPage.value = 1;
  localStorage.setItem(
    "compatibilityFilter",
    JSON.stringify(isCompatibilityFilterEnabled.value)
  );
};

const handleSystemRequirementsFilterChange = (value: string) => {
  systemRequirementsFilter.value = value;
  currentPage.value = 1;
  localStorage.setItem("systemRequirementsFilter", value);
  handleSearch(searchQuery.value);
};

watch(fetchedData, (newValue) => {
  if (newValue) {
    data.value = newValue;
  }
});

const handleCheckboxChange = (item: SelectableComponent) => {
  const selectedCount = paginatedData.value.filter(
    (c: SelectableComponent) => c.selected
  ).length;

  if (selectedCount > maxSelection) {
    nextTick(() => {
      item.selected = false;
      errorDialogVisible.value = true;
    });
  }
};

watch(
  () => paginatedData.value,
  () => {
    const selectedCount = paginatedData.value.filter(
      (item: SelectableComponent) => item.selected
    ).length;

    if (selectedCount > maxSelection) {
      paginatedData.value
        .filter((item: SelectableComponent) => item.selected)
        .slice(maxSelection)
        .forEach((item: SelectableComponent) => (item.selected = false));
    }
  }
);
</script>
