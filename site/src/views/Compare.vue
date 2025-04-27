<template>
  <div class="max-w-6xl mx-auto p-3">
    <div class="px-1 py-2 md:p-3 text-neutral-100 flex justify-center">
      <Parts :type="type">
        <div class="text-xs mx-4 text-center md:text-base">
          {{ type }}
        </div>
      </Parts>
    </div>

    <p class="text-3xl font-bold text-white text-center mb-6">
      Compare Selected {{ props.type }}
    </p>
    <div
      v-if="filteredComponents.length"
      class="flex flex-col items-center md:flex-row justify-center gap-4 my-12"
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
          <div class="py-3">
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
          </div>
        </div>

        <div v-for="(value, key) in component" :key="key" class="mb-3">
          <div v-if="!hiddenKeys.includes(key as string)">
            <strong class="text-lg font-medium">{{ formatKey(key) }}:</strong>
            <span :class="getTextColor(value, key as any)" class="ml-2">
              {{ formatValue(value, key as string, props.type) }}
            </span>
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
import { formatValue } from "../utils/formatValues";

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

const getTextColor = (value: any, key: string) => {
  if (typeof value === "number") {
    if (
      (key === "tdp" && props.type !== "cpu-coolers") ||
      key === "length" ||
      key === "cas_latency" ||
      key === "first_word_latency"
    ) {
      return value === minValues.value[key]
        ? "text-green-400"
        : value === maxValues.value[key]
        ? "text-red-600"
        : "text-orange-400";
    }
    return value === maxValues.value[key]
      ? "text-green-400"
      : value === minValues.value[key]
      ? "text-red-600"
      : "text-orange-400";
  } else if (Array.isArray(value)) {
    if (key === "noise_level") {
      return value[0] === minValues2.value[key]
        ? "text-green-400"
        : value[0] === maxValues2.value[key]
        ? "text-red-600"
        : "text-orange-400";
    } else if (key === "airflow" || key === "speed") {
      return value[value.length - 1] === maxValues.value[key]
        ? "text-green-400"
        : value[value.length - 1] === minValues.value[key]
        ? "text-red-600"
        : "text-orange-400";
    } else if (key === "modules") {
      const product = value.reduce((acc, num) => acc * num, 1);
      return product === maxValues3.value[key]
        ? "text-green-400"
        : product === minValues3.value[key]
        ? "text-red-600"
        : "text-orange-400";
    }
  } else if (typeof value === "string" && key === "interface") {
    const rankedValue = rankInterface(value);
    const maxRank = Math.max(
      ...selectedComponents.value.map((c) => rankInterface(c.interface))
    );
    const minRank = Math.min(
      ...selectedComponents.value.map((c) => rankInterface(c.interface))
    );
    return rankedValue === maxRank
      ? "text-green-400"
      : rankedValue === minRank
      ? "text-red-600"
      : "text-orange-400";
  } else if (key === "smt" || key === "pwm" || key === "type") {
    return value === true || value === SSD
      ? "text-green-400"
      : value === false
      ? "text-red-600"
      : "";
  }

  return "";
};

const numericValues = computed<{ [key: string]: number[] }>(() => {
  const values: { [key: string]: number[] } = {};

  selectedComponents.value.forEach((component) => {
    Object.entries(component).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        if (!values[key]) values[key] = [];
        values[key].push(value[value.length - 1]);
      } else if (typeof value === "number") {
        if (!values[key]) values[key] = [];
        values[key].push(value);
      }
    });
  });

  return values;
});

const maxValues = computed<{ [key: string]: number }>(() => {
  const max: { [key: string]: number } = {};
  Object.entries(numericValues.value).forEach(([key, values]) => {
    max[key] = Math.max(...values);
  });
  return max;
});

const minValues = computed<{ [key: string]: number }>(() => {
  const min: { [key: string]: number } = {};
  Object.entries(numericValues.value).forEach(([key, values]) => {
    min[key] = Math.min(...values);
  });
  return min;
});

const numericValues2 = computed<{ [key: string]: number[] }>(() => {
  const values: { [key: string]: number[] } = {};

  selectedComponents.value.forEach((component) => {
    Object.entries(component).forEach(([key, value]) => {
      if (Array.isArray(value)) {
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

const maxValues2 = computed<{ [key: string]: number }>(() => {
  const max: { [key: string]: number } = {};
  Object.entries(numericValues2.value).forEach(([key, values]) => {
    max[key] = Math.max(...values);
  });
  return max;
});

const minValues2 = computed<{ [key: string]: number }>(() => {
  const min: { [key: string]: number } = {};
  Object.entries(numericValues2.value).forEach(([key, values]) => {
    min[key] = Math.min(...values);
  });
  return min;
});

const numericValues3 = computed<{ [key: string]: number[] }>(() => {
  const values: { [key: string]: number[] } = {};

  selectedComponents.value.forEach((component) => {
    Object.entries(component).forEach(([key, value]) => {
      if (Array.isArray(value) && value.length > 0) {
        const product = value.reduce((acc, num) => acc * num, 1);
        if (!values[key]) values[key] = [];
        values[key].push(product);
      } else if (typeof value === "number") {
        if (!values[key]) values[key] = [];
        values[key].push(value);
      }
    });
  });

  return values;
});

const maxValues3 = computed<{ [key: string]: number }>(() => {
  const max: { [key: string]: number } = {};
  Object.entries(numericValues3.value).forEach(([key, values]) => {
    if (values.length > 0) {
      max[key] = Math.max(...values);
    }
  });
  return max;
});

const minValues3 = computed<{ [key: string]: number }>(() => {
  const min: { [key: string]: number } = {};
  Object.entries(numericValues3.value).forEach(([key, values]) => {
    if (values.length > 0) {
      min[key] = Math.min(...values);
    }
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

function rankInterface(interfaceType: string): number {
  const rankings: Record<string, number> = {
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

  return rankings[interfaceType] ?? 100;
}
</script>
