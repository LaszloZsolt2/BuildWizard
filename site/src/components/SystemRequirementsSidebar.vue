<template>
  <span
    class="transition-all duration-300"
    :style="{
      maxWidth: panelStateWidths[panelState].outer,
      position:
        panelState === 'open' && screenWidth < 768 ? 'absolute' : 'inherit',
    }"
  >
    <div
      :class="[
        'sticky top-0 h-screen transition-all duration-300',
        panelStateWidths[panelState].inner,
        panelState && panelState !== 'open' ? 'ml-8' : 'xl:ml-8 2xl:ml-8',
      ]"
    ></div>
    <div
      :class="[
        'bg-neutral-800 ml-8 w rounded-l-lg fixed top-32 h-5/6 right-0 transition-all duration-300',
        panelStateWidths[panelState].inner,
      ]"
    >
      <div
        id="caret-icon-container"
        :class="[
          'h-full p-2 w-8 flex items-center hover:cursor-pointer transition-all duration-300 absolute',
          panelState !== 'open' ? 'transform rotate-180' : '',
        ]"
        @click="togglePanel"
      >
        <CaretIcon class="h-8 text-neutral-500" />
      </div>
      sidebar content
    </div>
  </span>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import CaretIcon from "@/assets/icons/caret.svg";
import axios from "axios";
import { useScreenSize } from "../composables/useScreenSize";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

const panelStateWidths = {
  open: {
    inner: "w-full md:w-96",
    outer: "36rem",
  },
  closed: {
    inner: "w-8",
    outer: "4rem",
  },
  hidden: {
    inner: "w-0",
    outer: "2rem",
  },
};
const panelState = ref<keyof typeof panelStateWidths>("hidden");
const { screenWidth, screenHeight } = useScreenSize();

function togglePanel() {
  panelState.value = panelState.value === "open" ? "closed" : "open";
}

async function handleGameDataChanged() {
  const currentGames = JSON.parse(localStorage.getItem("games") || "[]");
  if (currentGames.length === 0) {
    panelState.value = "hidden";
  } else if (panelState.value === "hidden" && currentGames.length > 0) {
    panelState.value = "open";
  }

  if (panelState.value !== "hidden") {
    const response = await axios.get(
      `${apiBaseUrl}/system-requirements/combined`,
      {
        params: {
          ids: currentGames.map((g: any) => g._id),
        },
      }
    );
    localStorage.setItem("systemRequirements", JSON.stringify(response.data));
  } else {
    localStorage.removeItem("systemRequirements");
  }
}

onMounted(() => {
  handleGameDataChanged();
  window.addEventListener("game-data-changed", handleGameDataChanged);
});
</script>

<style scoped>
svg {
  @apply transition-all duration-500;
}
#caret-icon-container:hover > svg {
  @apply text-neutral-300;
}
</style>
