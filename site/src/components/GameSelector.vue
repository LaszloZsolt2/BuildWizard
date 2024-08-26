<template>
  <div
    class="bg-neutral-800 m-2 xl:m-4 px-2 py-6 pb-8 rounded-lg flex flex-col xl:flex-row"
  >
    <div class="left flex-grow">
      <h1 class="text-2xl xl:text-4xl font-bold m-2 xl:m-6">
        <div class="text-neutral-200 m-2">Pick your games and budget,</div>
        <div class="text-violet-500 m-2">We'll handle the rest</div>
      </h1>
      <!-- TODO: scroll to builder on press -->
      <BaseButton
        text
        severity="secondary"
        class="text-xl font-bold text-neutral-200 m-1 mb-8 xl:mb-0 xl:m-5"
      >
        Build manually instead
        <DownArrowIcon class="ml-2 h-6 inline-block" />
      </BaseButton>
    </div>

    <div class="flex flex-col xl:items-end">
      <div class="flex flex-col xl:flex-row flex-1">
        <div class="right flex-1 mx-3 -mt-4 content-center">
          <div class="text-neutral-200 font-bold text-lg">
            Select games and software
          </div>
          <SearchableSelector
            v-model="gameQuery"
            :suggestions="filteredGames"
            @option-select="onGameSelect"
            placeholder="Search..."
            class="block my-3"
            :minLength="0"
            :delay="0"
            optionLabel="name"
            fluid
          />
          <BaseButton
            text
            rounded
            severity="secondary"
            @click="removeGame(game)"
            v-for="game in selectedGames"
          >
            {{ game.name }}
            <TrashIcon class="m-1 h-4 inline-block" />
          </BaseButton>
        </div>
        <div class="right flex-1 mx-3 mt-4 lg:-mt-9 content-center">
          <div class="text-neutral-200 font-bold text-lg">Set a budget</div>
          <BaseInput
            v-model="budget"
            class="block mt-3 mb-2"
            placeholder="Enter a number"
            maxlength="5"
            :invalid="!/^[0-9]*$/.test(budget)"
            fluid
          />
          <div class="text-sm text-neutral-400 ml-3">
            You can also leave this empty
          </div>
          <div
            class="-mt-16 pt-1 text-neutral-400 pointer-events-none text-nowrap w-4"
            :style="{
              transform: `translateX(${budget.toString().length * 0.575 + 1}rem)`,
              opacity: budget ? 1 : 0,
            }"
          >
            lei
          </div>
        </div>
      </div>
      <BaseButton class="mt-14 xl:mt-0 mx-4">
        <div class="px-2 font-bold">
          <RightArrowIcon class="h-5 inline-block pr-2 pb-1" />
          Build
        </div>
      </BaseButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import SearchableSelector from "./SearchableSelector.vue";
import DownArrowIcon from "@/assets/icons/down.svg";
import TrashIcon from "@/assets/icons/trash.svg";
import RightArrowIcon from "@/assets/icons/arrow.svg";
import axios from "axios";
import BaseButton from "./BaseButton.vue";
import BaseInput from "./BaseInput.vue";
import { onMounted } from "vue";
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

const gameQuery = ref("");
const filteredGames = ref<any[]>([]);
// const filteredGames = ref<Game[]>([]);
const selectedGames = ref<any[]>([]);
const budget = ref("");

function onGameSelect(game: any) {
  gameQuery.value = "";
  let currentGames = JSON.parse(localStorage.getItem("games") || "[]");
  if (currentGames.filter((g: any) => g._id === game.value._id).length > 0) {
    return;
  }

  currentGames.push(game.value);
  selectedGames.value.push(game.value);
  localStorage.setItem("games", JSON.stringify(currentGames));
}

function removeGame(game: any) {
  const currentGames = JSON.parse(localStorage.getItem("games") || "[]");
  const newGames = currentGames.filter((g: any) => g._id !== game._id);
  localStorage.setItem("games", JSON.stringify(newGames));
  selectedGames.value = newGames;
}

onMounted(() => {
  const currentGames = JSON.parse(localStorage.getItem("games") || "[]");
  selectedGames.value = currentGames;
});

watch(gameQuery, async (newQuery) => {
  if (newQuery) {
    try {
      const response = await axios.get(
        `${apiBaseUrl}/system-requirements/search`,
        {
          params: {
            q: newQuery,
          },
        }
      );
      filteredGames.value = response.data;
    } catch (error) {
      console.error("Failed to fetch games:", error);
      filteredGames.value = [];
    }
  } else {
    filteredGames.value = [];
  }
});
</script>
