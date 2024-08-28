<template>
  <div class="flex">
    <div class="home flex-grow">
      <GameSelector @game-data-changed="handleGameDataChanged" />
      <div
        id="components-list"
        class="components-list"
        :style="{ maxWidth: screenWidth < 768 ? 'calc(82.5vw)' : undefined }"
      >
        <table
          class="mx-4 my-10 w-full bg-neutral-800 rounded-lg overflow-hidden shadow-md"
        >
          <thead>
            <tr class="bg-neutral-700 text-white">
              <th
                v-for="header in ['Components', 'Selected ', 'Price', 'Where']"
                class="px-1 py-2 md:p-3 text-center text-xs md:text-base"
              >
                {{ header }}
              </th>
              <th class="w-1"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="part in partsList" :key="part.type">
              <td class="px-1 py-2 md:p-3 w-1/12">
                <Parts :type="part.type"
                  ><div class="text-xs md:text-base">
                    {{ part.label }}
                  </div></Parts
                >
              </td>
              <td
                class="px-1 py-2 md:p-3 max-w-2 md:max-w-none text-xs md:text-base text-white text-center"
              >
                {{ selected[part.type]?.name || "" }}
              </td>

              <td
                class="px-1 py-2 md:p-3 max-w-2 md:max-w-none text-xs md:text-base text-white text-center"
              >
                {{
                  selected[part.type]?.price
                    ? selected[part.type]?.price.toFixed(2) + " $"
                    : ""
                }}
              </td>
              <td
                class="px-1 py-2 md:p-3 max-w-2 md:max-w-none text-xs md:text-base text-center"
              ></td>
              <td class="text-right">
                <Delete :type="part.type" @delete="handleDelete" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <SystemRequirementsSidebar
      :parts="selected"
      :gameData="gameData"
      class="flex-1"
    />
  </div>
</template>

<script setup lang="ts">
import Parts from "../components/Parts.vue";
import Delete from "../components/DeleteButton.vue";
import GameSelector from "../components/GameSelector.vue";
import SystemRequirementsSidebar from "../components/SystemRequirementsSidebar.vue";
import { ref, onMounted } from "vue";
import { useScreenSize } from "../composables/useScreenSize";

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

const selected = ref<{
  [key: string]: { name: string; price: number; _id: string };
}>({});
const { screenWidth } = useScreenSize();
const gameData = ref<any>(null);

onMounted(() => {
  const storedData = localStorage.getItem("selectedComponents");
  if (storedData) {
    selected.value = JSON.parse(storedData);
  }
});

function removeProperty(type: string) {
  const { [type]: _, ...updatedSelected } = selected.value;
  selected.value = updatedSelected;
}

function handleGameDataChanged(data: any) {
  gameData.value = data;
}

const handleDelete = (type: string) => {
  removeProperty(type);
  localStorage.setItem("selectedComponents", JSON.stringify(selected.value));
};
</script>
