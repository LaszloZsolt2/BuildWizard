<template>
  <div>
    <div class="bg-violet-800 p-10">
      <p class="text-3xl font-bold text-white text-center">
        Select Your Components
      </p>
    </div>

    <table
      class="mx-16 my-20 w-11/12 bg-gray-800 rounded-lg overflow-hidden shadow-md"
    >
      <thead>
        <tr class="bg-gray-700 text-white">
          <th
            v-for="header in ['Components', 'Selected ', 'Price', 'Where']"
            class="p-3 text-center"
          >
            {{ header }}
          </th>
          <th class="w-1"></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="part in partsList" :key="part.type">
          <td class="p-3 w-1/12">
            <Parts :type="part.type">{{ part.label }}</Parts>
          </td>
          <td class="p-3 text-white text-center">
            {{ selected[part.type]?.name || "" }}
          </td>

          <td class="p-3 text-white text-center">
            {{
              selected[part.type]?.price
                ? selected[part.type]?.price.toFixed(2) + " $"
                : ""
            }}
          </td>
          <td class="p-3 text-center"></td>
          <td class="text-right">
            <Delete :type="part.type" @delete="handleDelete" />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import Parts from "../components/Parts.vue";
import Delete from "../components/DeleteButton.vue";
import { ref, onMounted } from "vue";

const partsList = [
  { type: "cpus", label: "CPU" },
  { type: "cpu-coolers", label: "CPU Cooler" },
  { type: "gpus", label: "GPU" },
  { type: "cases", label: "Case" },
  { type: "case-fans", label: "Case Fan" },
  { type: "hard-drives", label: "Hard Drive" },
  { type: "memories", label: "Memory" },
  { type: "motherboards", label: "Motherboard" },
  { type: "power-supplies", label: "Power Supply" },
];

const selected = ref<{ [key: string]: { name: string; price: number } }>({});

onMounted(() => {
  const storedData = localStorage.getItem("selectedComponents");
  if (storedData) {
    selected.value = JSON.parse(storedData);
  }
});

const handleDelete = (type: string) => {
  delete selected.value[type];
  localStorage.setItem("selectedComponents", JSON.stringify(selected.value));
};
</script>
