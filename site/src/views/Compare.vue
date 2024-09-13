<template>
  <div class="max-w-6xl mx-auto p-3">
    <td class="px-1 py-2 md:p-3 text-neutral-100 flex justify-center">
      <Parts :type="type">
        <div class="text-xs md:text-base">
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
            <span class="ml-2">{{ value }}</span>
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
const hiddenKeys = ["image", "price", "price_data"];
const filteredComponents = computed<ComponentBase[]>(() =>
  selectedComponents.value.map((component) => {
    const { selected, __v, _id, power_consumption, ...filtered } = component;
    return filtered as ComponentBase;
  })
);

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
</script>
