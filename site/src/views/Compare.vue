<template>
  <div class="max-w-6xl mx-auto p-3">
    <td class="px-1 py-2 md:p-3 text-neutral-100 flex justify-center">
      <Parts :type="type">
        <div class="text-xs mx-4 text-center md:text-base">
          {{ type }}
        </div>
      </Parts>
    </td>
    <p class="text-3xl font-bold text-white text-center mb-6">
      Compare Selected {{ props.type }}
    </p>
    <div
      v-if="filteredComponents.length"
      class="flex justify-center gap-4 my-12"
    >
      <div
        v-for="component in filteredComponents"
        :key="component._id"
        class="bg-neutral-700 p-12 border border-neutral-500 rounded-lg shadow-lg max-w-xs flex-shrink-0 text-neutral-100"
      >
        <div class="border-b-2 border-b-neutral-400 -mx-10 px-12 mb-6">
          <div v-if="component.image" class="mb-4">
            <img
              :src="component.image"
              class="h-32 w-full object-contain mx-auto"
            />
          </div>

          <h2 class="text-3xl font-semibold mb-4 text-center">
            {{ component.name }}
          </h2>
          <td class="py-3">
            <div class="flex items-center justify-between">
              <BaseButton @click="handleAddClick(component)"> Add </BaseButton>
              <div
                v-if="component.price_data"
                class="ml-4 border-b-neutral-400"
              >
                <div>
                  <strong class="text-lg font-medium">Lowest Price:</strong>
                  <br />
                  <span>{{ component.price_data[0]?.price }} lei</span>
                </div>
              </div>
            </div>
          </td>
        </div>

        <div v-for="(value, key) in component" :key="key" class="mb-3">
          <div v-if="!hiddenKeys.includes(key as string)">
            <strong class="text-lg font-medium">{{ formatKey(key) }}:</strong>
            <span
              v-if="typeof value === 'number'"
              :class="{
                'text-green-400':
                  (key === 'tdp' && props.type !== 'cpu-coolers') ||
                  key === 'length'
                    ? value === minValues[key]
                    : value === maxValues[key],
                'text-red-600':
                  (key === 'tdp' && props.type !== 'cpu-coolers') ||
                  key === 'length' ||
                  key === 'price_per_gb'
                    ? value === maxValues[key]
                    : value === minValues[key],
                'text-orange-400':
                  (key !== 'tdp' && typeof value === 'number') ||
                  key === 'length' ||
                  key === 'price_per_gb'
                    ? value !== maxValues[key] && value !== minValues[key]
                    : (key === 'tdp' && typeof value === 'number') ||
                      key === 'length'
                    ? value !== minValues[key] && value !== maxValues[key]
                    : false,
              }"
              class="ml-2"
            >
              {{ value }}
            </span>
            <span
              v-else-if="key === 'smt' || key === 'pwm' || key === 'type'"
              :class="{
                'text-green-400': value === true || value === SSD,
                'text-red-600': value === false,
              }"
              class="ml-2"
            >
              {{ value }}
            </span>
            <span
              v-else-if="
                (typeof value === 'number' || Array.isArray(value)) &&
                key !== 'rpm' &&
                key !== 'airflow' &&
                key !== 'speed'
              "
              :class="{
                'text-green-400': Array.isArray(value)
                  ? value[0] === minValues[key]
                  : value === maxValues[key],
                'text-red-600': Array.isArray(value)
                  ? value[0] === maxValues[key]
                  : value === minValues[key],
                'text-orange-400': Array.isArray(value)
                  ? value[0] !== minValues[key] && value[0] !== maxValues[key]
                  : value !== maxValues[key] && value !== minValues[key],
              }"
              class="ml-2"
            >
              {{ value }}
            </span>
            <span
              v-else-if="
                ((typeof value === 'number' || Array.isArray(value)) &&
                  key === 'airflow') ||
                key === 'speed'
              "
              :class="{
                'text-green-400': Array.isArray(value)
                  ? value[1] === maxValues[key]
                  : value === minValues[key],
                'text-red-600': Array.isArray(value)
                  ? value[1] === minValues[key]
                  : value === maxValues[key],
                'text-orange-400': Array.isArray(value)
                  ? value[1] !== minValues[key] && value[1] !== maxValues[key]
                  : value !== minValues[key] && value !== maxValues[key],
              }"
              class="ml-2"
            >
              {{ value }}
            </span>

            <span v-else class="ml-2">{{ value }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import Parts from "../components/Parts.vue";
import BaseButton from "../components/BaseButton.vue";
import { ComponentBase } from "../types/componentBase";
import { useRouter } from "vue-router";

const selectedComponents = ref<Record<string, any>[]>([]);
const emit = defineEmits<{
  (event: "add", data: { name: string; price: number }): void;
}>();
const router = useRouter();
const SSD = "SSD";

onMounted(() => {
  const savedComponents = JSON.parse(
    localStorage.getItem("compareComponents") || "{}"
  );
  selectedComponents.value = savedComponents[props.type as string] || [];
});

const formatKey = (key: string | number) => {
  const keyStr = String(key);
  return keyStr
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

const hiddenKeys = ["image", "price", "price_data", "name"];
const filteredComponents = computed<ComponentBase[]>(() =>
  selectedComponents.value.map((component) => {
    const { selected, __v, _id, power_consumption, price_per_gb, ...filtered } =
      component;
    return filtered as ComponentBase;
  })
);

const numericValues = computed(() => {
  const values: { [key: string]: number[] } = {};

  selectedComponents.value.forEach((component) => {
    Object.entries(component).forEach(([key, value]) => {
      if (Array.isArray(value) && value.length > 0) {
        if (!values[key]) values[key] = [];
        values[key].push(value[0]);
      } else if (typeof value === "number") {
        if (!values[key]) values[key] = [];
        values[key].push(value);
      }
    });
  });

  return values;
});

const maxValues = computed(() => {
  const max: { [key: string]: number } = {};
  Object.entries(numericValues.value).forEach(([key, values]) => {
    max[key] = Math.max(...values);
  });
  return max;
});

const minValues = computed(() => {
  const min: { [key: string]: number } = {};
  Object.entries(numericValues.value).forEach(([key, values]) => {
    min[key] = Math.min(...values);
  });
  return min;
});

type Props = {
  type: string;
};

const props = defineProps<Props>();

const handleAddClick = (item: ComponentBase) => {
  emit("add", { name: item.name, price: item.price_data[0]?.price });

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
      price: item.price_data[0]?.price?.toString(),
    },
  });
};

const performanceValues: Record<string, number> = {
  "M.2 PCIe 5.0 X4": 100,
  "M.2 PCIe 4.0 X4": 90,
  "M.2 PCIe 3.0 X4": 80,
  "M.2 PCIe 5.0 X2": 85,
  "M.2 PCIe 4.0 X8": 95,
  "M.2 PCIe 3.0 X2": 70,
  "M.2 PCIe 2.0 X4": 60,
  "PCIe x16": 100,
  "PCIe x8": 85,
  "PCIe x4": 80,
  "PCIe x2": 70,
  "PCIe x1": 60,
  "SAS 12.0 Gb/s": 75,
  "SAS 6.0 Gb/s": 60,
  "SAS 3.0 Gb/s": 50,
  "SATA 6.0 Gb/s": 50,
  "SATA 3.0 Gb/s": 40,
  "SATA 1.5 Gb/s": 30,
  "M.2 SATA": 55,
  mSATA: 45,
  "U.2": 70,
  "PATA 100": 20,
  "PATA 44-Pin 100": 15,
};
</script>
