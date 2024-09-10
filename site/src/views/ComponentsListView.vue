<template>
  <div class="flex">
    <div class="home flex-grow">
      <GameSelector @game-data-changed="handleGameDataChanged" />
      <CompatibilityMessages
        :parts="selected"
        :style="{
          maxWidth: maxWidth,
        }"
      />
      <div
        id="components-list"
        class="components-list"
        :style="{
          maxWidth: maxWidth,
        }"
      >
        <table
          class="mx-4 my-4 w-full bg-neutral-800 rounded-lg overflow-hidden shadow-md"
        >
          <thead>
            <tr class="bg-neutral-700 text-white">
              <th
                v-for="header in ['Components', 'Selected ', 'Price', 'Store']"
                class="px-1 py-2 md:p-3 text-center text-xs md:text-base"
              >
                {{ header }}
              </th>
              <th class="w-1"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="part in partsList" :key="part.type">
              <ComponentsListItem @delete-part="handleDelete" :part="part" />
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <SystemRequirementsSidebar
      :gameData="games"
      :parts="selected"
      class="flex-1"
    />
  </div>
</template>

<script setup lang="ts">
import GameSelector from "../components/GameSelector.vue";
import SystemRequirementsSidebar from "../components/SystemRequirementsSidebar.vue";
import ComponentsListItem from "../components/ComponentsListItem.vue";
import CompatibilityMessages from "../components/CompatibilityMessages.vue";
import { useScreenSize } from "../composables/useScreenSize";
import { computed, ref } from "vue";

const selected = ref<any>(null);
const games = ref<any>(null);
const { screenWidth } = useScreenSize();
const maxWidth = computed(() => {
  return screenWidth.value < 768
    ? `calc(${screenWidth.value}px - ${games.value?.length ? `${screenWidth.value * 0.175}px` : "2rem"})`
    : undefined;
});

function handleDelete(selectedParts: any) {
  selected.value = selectedParts;
}

function handleGameDataChanged(gameData: any) {
  games.value = gameData;
}

const partsList = [
  { type: "cpus", label: "CPU", multiple: false },
  { type: "cpu-coolers", label: "CPU Cooler", multiple: false },
  { type: "gpus", label: "GPU", multiple: false },
  { type: "cases", label: "Case", multiple: false },
  { type: "case-fans", label: "Case Fan", multiple: true },
  { type: "hard-drives", label: "Storage", multiple: true },
  { type: "memories", label: "Memory", multiple: true },
  { type: "motherboards", label: "Motherboard", multiple: false },
  { type: "power-supplies", label: "Power Supply", multiple: false },
];
</script>
