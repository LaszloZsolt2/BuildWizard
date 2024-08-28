<template>
  <div
    class="bg-neutral-800 m-4 px-2 py-10 pb-8 rounded-lg flex flex-col xl:flex-row w-full"
    ref="componentsList"
    :style="{
      maxWidth:
        screenWidth < 768
          ? `calc(${screenWidth}px - ${selectedGames.length ? `${screenWidth * 0.175}px` : '2rem'})`
          : undefined,
    }"
  >
    <div class="left flex-grow">
      <h1 class="text-2xl xl:text-4xl font-bold m-2 xl:m-6">
        <div class="text-neutral-200 m-2">Pick your games and budget,</div>
        <div class="text-violet-500 m-2">We'll handle the rest</div>
      </h1>
      <BaseButton
        @click="scrollToBuilder"
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
        <div
          class="right flex-1 2xl:min-w-96 xl:max-w-96 mx-3 mt-4 content-top"
        >
          <TransitionGroup tag="div" name="list">
            <div class="text-neutral-200 font-bold text-lg" key="select-label">
              Select games and software
            </div>
            <SearchableSelector
              key="searchable-selector"
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
              v-for="game in selectedGames"
              :key="game.name"
              text
              rounded
              severity="secondary"
              @click="removeGame(game)"
            >
              {{ game.name }}
              <TrashIcon class="m-1 h-4 inline-block" />
            </BaseButton>
          </TransitionGroup>
        </div>
        <div
          class="right flex-1 2xl:min-w-96 xl:max-w-96mx-3 mx-3 mt-4 content-top"
        >
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
import { ref, watch, onMounted } from "vue";
import SearchableSelector from "./SearchableSelector.vue";
import DownArrowIcon from "@/assets/icons/down.svg";
import TrashIcon from "@/assets/icons/trash.svg";
import RightArrowIcon from "@/assets/icons/arrow.svg";
import axios from "axios";
import BaseButton from "./BaseButton.vue";
import BaseInput from "./BaseInput.vue";
import { useScreenSize } from "../composables/useScreenSize";
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

const { screenWidth } = useScreenSize();
const gameQuery = ref("");
const filteredGames = ref<any[]>([]);
const selectedGames = ref<any[]>([]);
const budget = ref("");

const emit = defineEmits(["game-data-changed"]);

function onGameSelect(game: any) {
  gameQuery.value = "";
  let currentGames = JSON.parse(localStorage.getItem("games") || "[]");
  if (currentGames.filter((g: any) => g._id === game.value._id).length > 0) {
    return;
  }

  currentGames.push(game.value);
  selectedGames.value.push(game.value);
  localStorage.setItem("games", JSON.stringify(currentGames));

  emit("game-data-changed", currentGames);
}

function removeGame(game: any) {
  const currentGames = JSON.parse(localStorage.getItem("games") || "[]");
  const newGames = currentGames.filter((g: any) => g._id !== game._id);
  localStorage.setItem("games", JSON.stringify(newGames));
  selectedGames.value = newGames;

  emit("game-data-changed", newGames);
}

function scrollToBuilder() {
  const componentsList = document.getElementById("components-list");
  if (componentsList) {
    componentsList.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }
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

<style scoped>
.list-enter-from,
.list-leave-to {
  /* scale: 0.5; */
  opacity: 0;
  transform: translateY(-20px);
}
.list-enter-active,
.list-leave-active {
  transition: all 0.3s;
}
.list-leave-active {
  position: absolute;
}

.list-move {
  transition: all 0.3s;
}
</style>
