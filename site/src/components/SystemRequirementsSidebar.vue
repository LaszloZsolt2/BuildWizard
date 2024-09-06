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
        'sticky top-0 h-screen transition-all duration-300 md:ml-8',
        panelStateWidths[panelState].inner,
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
      <div class="content p-8 pl-10 min-w-96 w-full overflow-y-scroll h-full">
        <Transition name="opacity-slide-right">
          <div v-if="systemRequirements">
            <h2 class="text-xl font-bold">System requirements</h2>
            <p class="text-neutral-400 ml-2 my-2">
              {{
                currentGames &&
                getFirstNStrings(
                  currentGames.map((game: any) => game.name),
                  3
                )
              }}
            </p>
            <SystemRequirements
              type="minimum"
              :systemRequirements="systemRequirements.systemRequirement"
              :requirementsMet="systemRequirements.requirementsMet"
            />
            <SystemRequirements
              type="recommended"
              :systemRequirements="systemRequirements.systemRequirement"
              :requirementsMet="systemRequirements.requirementsMet"
            />
            <div class="pl-0 pt-2">
              <ul class="list-inside pl-5">
                <li class="mb-2">
                  <p class="font-bold">Storage</p>
                  <div>
                    <p class="text-neutral-400 ml-4">
                      <ReqirementsMet
                        :met="systemRequirements.requirementsMet.space"
                      />
                      {{ systemRequirements.systemRequirement.space }} GB
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
          <div v-else>
            <SystemRequirementsLoader />
          </div>
        </Transition>
      </div>
    </div>
  </span>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import CaretIcon from "@/assets/icons/caret.svg";
import { useScreenSize } from "../composables/useScreenSize";
import SystemRequirementsLoader from "./loaders/SystemRequirementsLoader.vue";
import { getFirstNStrings } from "../utils/string";
import SystemRequirements from "./SystemRequirements.vue";
import ReqirementsMet from "./RequirementMet.vue";
import useFetch from "../composables/useFetch";
import { removePriceField } from "../utils/removePriceField";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

type Props = { gameData?: any; parts?: any };
const props = defineProps<Props>();

const emit = defineEmits(["game-data-changed"]);

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
const systemRequirements = ref<any>(null);
const currentGames = ref<any[]>([]);
const { screenWidth } = useScreenSize();
const url = ref<string>("");

function togglePanel() {
  panelState.value = panelState.value === "open" ? "closed" : "open";
}

onMounted(() => {
  handleGameDataChanged();
});

async function handleGameDataChanged() {
  currentGames.value = JSON.parse(localStorage.getItem("games") || "[]");
  if (currentGames.value.length === 0) {
    panelState.value = "hidden";
  } else if (panelState.value === "hidden" && currentGames.value.length > 0) {
    panelState.value = "open";
  }

  const components = JSON.parse(
    localStorage.getItem("selectedComponents") || "{}"
  );
  const ids = currentGames.value.map((g: any) => g._id);

  if (panelState.value !== "hidden") {
    systemRequirements.value = null;
    url.value = `${apiBaseUrl}/system-requirements/combined?${buildQueryParams(ids, removePriceField(components))}`;
  } else {
    url.value = "";
  }
  emit("game-data-changed", currentGames.value);
}

function buildQueryParams(ids: string[], components: any): string {
  const queryString: string[] = [];

  ids.forEach((id) => queryString.push(`ids[]=${encodeURIComponent(id)}`));

  function appendNestedParams(params: any, parentKey: string): void {
    for (const [key, value] of Object.entries(params)) {
      const encodedKey = `${parentKey}[${key}]`;
      if (typeof value === "object" && value !== null) {
        appendNestedParams(value, encodedKey);
      } else {
        queryString.push(
          `${encodedKey}=${encodeURIComponent(value as string)}`
        );
      }
    }
  }

  appendNestedParams(components, "components");

  return queryString.join("&");
}

const { fetchedData, fetchError, isLoading } = useFetch(url);

watch(() => props.gameData, handleGameDataChanged, { immediate: true });
watch(() => props.parts, handleGameDataChanged, { immediate: true });
watch(fetchedData, (data) => {
  systemRequirements.value = data;
});
</script>

<style scoped>
svg {
  @apply transition-all duration-500;
}
#caret-icon-container:hover > svg {
  @apply text-neutral-300;
}
.content::-webkit-scrollbar {
  display: none;
}
.content {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
ul {
  list-style-position: outside;
  margin: 0;
  padding: 0;
}

li {
  margin-bottom: 0.5rem;
}

.opacity-slide-right-enter-active {
  @apply transition-all duration-200 delay-200;
}

.opacity-slide-right-leave-active {
  @apply transition-all duration-200;
}

.opacity-slide-right-enter-from,
.opacity-slide-right-leave-to {
  @apply opacity-0 transform translate-x-6;
}
</style>
