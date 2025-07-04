<template>
  <div
    class="bg-neutral-800 m-4 px-2 py-10 pb-8 rounded-lg flex flex-col xl:flex-row w-full"
    ref="componentsList"
    :style="{
      maxWidth:
        screenWidth < 768
          ? `calc(${screenWidth}px - ${
              selectedGames.length ? `${screenWidth * 0.175}px` : '2rem'
            })`
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
        rounded
        severity="secondary"
        class="text-xl font-bold text-neutral-200 m-1 ml-2 md:ml-1 mb-8 xl:mb-0 xl:m-5"
      >
        <div class="md:mx-2">
          <span class="text-sm md:text-xl"> Build manually instead </span>
          <DownArrowIcon class="ml-2 h-4 md:h-6 inline-block" />
        </div>
      </BaseButton>
    </div>

    <div class="flex flex-col xl:items-end">
      <div class="flex flex-col xl:flex-row flex-1">
        <div
          class="right flex-1 2xl:min-w-96 xl:max-w-96 mx-3 -mt-4 md:mt-4 content-top"
        >
          <TransitionGroup tag="div" name="list">
            <div
              class="text-neutral-200 font-bold text-md md:text-lg"
              key="select-label"
            >
              Select games and software
            </div>
            <SearchableSelector
              key="searchable-selector"
              v-model="gameQuery"
              :suggestions="filteredGames"
              @option-select="onGameSelect"
              @keydown="handleKeyDown"
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
              <span class="text-xs mt-0.5 md:text-base">
                {{ game.name }}
              </span>
              <TrashIcon class="md:m-1 h-3 md:h-4 inline-block" />
            </BaseButton>
          </TransitionGroup>
        </div>
        <div
          class="right flex-1 2xl:min-w-96 xl:max-w-96 mx-3 mt-4 content-top"
        >
          <div class="text-neutral-200 font-bold text-md md:text-lg">
            Set a budget
          </div>
          <BaseInput
            v-model="budget"
            class="block mt-3 mb-2"
            placeholder="Enter a number"
            maxlength="5"
            :invalid="isBudgetInvalid"
            fluid
          />
          <div class="text-sm text-neutral-400 ml-3">
            You can also leave this empty
          </div>
          <div
            class="-mt-16 pt-1 text-neutral-400 pointer-events-none text-nowrap w-4"
            :style="{
              transform: `translateX(${
                budget.toString().length * 0.575 + 1
              }rem)`,
              opacity: budget ? 1 : 0,
            }"
          >
            lei
          </div>
        </div>
      </div>
      <BaseButton
        @click="onBuild"
        :disabled="!selectedGames.length || isBudgetInvalid"
        class="mt-14 xl:mt-0 mx-4"
        :style="{
          transition: 'all 0.2s ease',
        }"
      >
        <div class="px-2 font-bold">
          <RightArrowIcon class="h-5 inline-block pr-2 pb-1" />
          Build
        </div>
      </BaseButton>
    </div>
  </div>
  <Modal
    v-model="isModalOpen"
    @hide="onModalClose"
    class="overflow-x-hidden transition-all"
  >
    <template #header
      ><h1 class="text-xl md:text-3xl mt-2">Build suggestions</h1></template
    >
    <div>
      <Transition name="list">
        <div
          v-if="fetchedBuilds?.message"
          class="text-neutral-500 font-bold m-8"
        >
          {{ fetchedBuilds.message }}
        </div>
        <div v-else-if="fetchedBuilds" class="flex flex-col xl:flex-row">
          <SuggestedBuildCard
            v-for="buildType in Object.keys(fetchedBuilds.builds)"
            @update:selectedBuild="selectedBuild = $event"
            :build="fetchedBuilds.builds[buildType]"
            :type="buildType as BuildType"
            :key="buildType"
            :selectedBuild="selectedBuild as BuildType"
          />
        </div>
        <div v-else class="flex flex-col xl:flex-row">
          <SuggestedBuildLoader v-for="n in 3" />
        </div>
      </Transition>
    </div>
    <template #footer>
      <BaseButton
        @click="onBuildAccept"
        v-if="!fetchedBuilds?.message"
        :disabled="!selectedBuild"
        label="Accept build"
        class="mt-4"
        :style="{
          transition: 'all 0.2s ease',
        }"
      />
      <BaseButton
        @click="onModalClose"
        severity="secondary"
        label="Close"
        class="mt-4"
      />
    </template>
  </Modal>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from "vue";
import SearchableSelector from "./SearchableSelector.vue";
import DownArrowIcon from "@/assets/icons/down.svg";
import TrashIcon from "@/assets/icons/trash.svg";
import RightArrowIcon from "@/assets/icons/arrow.svg";
import BaseButton from "./BaseButton.vue";
import BaseInput from "./BaseInput.vue";
import { useScreenSize } from "../composables/useScreenSize";
import useFetch from "../composables/useFetch";
import { removePriceField } from "../utils/removePriceField";
import { buildQueryParams } from "../utils/buildQueryParams";
import { computed } from "vue";
import Modal from "./Modal.vue";
import SuggestedBuildCard from "./SuggestedBuildCard.vue";
import SuggestedBuildLoader from "./loaders/SuggestedBuildLoader.vue";
import { BuildType } from "../types/buildType";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

const { screenWidth } = useScreenSize();
const gameQuery = ref("");
const filteredGames = ref<any[]>([]);
const selectedGames = ref<any[]>([]);
const budget = ref("");
const gameSearchUrl = ref<string>("");
const buildUrl = ref<string>("");
const isBudgetInvalid = computed(() => {
  return !/^[0-9]*$/.test(budget.value);
});
const isModalOpen = ref(false);
const selectedBuild = ref<string | null>(null);

const emit = defineEmits(["game-data-changed", "build-accept"]);

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

function handleKeyDown(event: KeyboardEvent) {
  if (event.key === "Enter" && filteredGames.value.length > 0) {
    const firstGame = filteredGames.value[0];
    onGameSelect({ value: firstGame });
  }
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

function onBuild() {
  const components = JSON.parse(
    localStorage.getItem("selectedComponents") || "{}"
  );
  const ids = selectedGames.value.map((g: any) => g._id);
  buildUrl.value = `${apiBaseUrl}/build/?${buildQueryParams(
    ids,
    removePriceField(components)
  )}${budget.value ? `&budget=${budget.value}` : ""}`;
  isModalOpen.value = true;
}

function onModalClose() {
  isModalOpen.value = false;
  buildUrl.value = "";
  selectedBuild.value = null;
  fetchedBuilds.value = null;
}

function onBuildAccept() {
  let build = fetchedBuilds.value.builds[selectedBuild.value!].build;

  let simplifiedBuild = Object.fromEntries(
    Object.entries(build).map(([category, components]) => {
      if (Array.isArray(components)) {
        return [
          category,
          components.map((comp) => ({
            _id: comp._id,
            price_data: comp.price_data,
            name: comp.name,
          })),
        ];
      }
      return [
        category,
        {
          _id: components._id,
          price: components.price_data,
          name: components.name,
          chipset: components.chipset,
        },
      ];
    })
  );

  localStorage.setItem("selectedComponents", JSON.stringify(simplifiedBuild));
  emit("build-accept", simplifiedBuild);
  onModalClose();
}

watch(gameQuery, (newQuery) => {
  if (newQuery) {
    gameSearchUrl.value = `${apiBaseUrl}/system-requirements/search?q=${encodeURIComponent(
      newQuery
    )}`;
  } else {
    gameSearchUrl.value = "";
  }
});

const {
  fetchedData: fetchedBuilds,
  fetchError: fetchBuildError,
  isLoading: isBuildLoading,
} = useFetch(buildUrl);
const { fetchedData, fetchError, isLoading } = useFetch(gameSearchUrl);

watch(fetchedData, (data) => {
  data?.forEach((game: any) => {
    if (selectedGames.value.filter((g: any) => g._id === game._id).length) {
      game.name = `✓‎ ‎ ${game.name}`;
    }
  });
  filteredGames.value = data || [];
});

onMounted(() => {
  const currentGames = JSON.parse(localStorage.getItem("games") || "[]");
  selectedGames.value = currentGames;
});
</script>

<style>
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateY(-20px);
  scale: 0.95;
}
.list-enter-active,
.list-leave-active,
.list-small-enter-active,
.list-small-leave-active {
  transition: all 0.3s;
}
.list-leave-active {
  position: absolute;
}

.list-move,
.list-small-move {
  transition: all 0.3s;
}

.list-small-enter-from,
.list-small-leave-to {
  opacity: 0;
  transform: translateY(-20px);
  scale: 0.5;
}

.list-small-leave-active {
  position: absolute;
  width: 0;
}
</style>
