<template>
  <div
    class="bg-neutral-800 m-4 px-4 pt-6 pb-1 rounded-lg w-full transition-all duration-500"
    ref="componentsList"
  >
    <Transition name="opacity-slide-left">
      <div v-if="messages.length">
        <h2 class="text-xl font-bold mb-6">Compatibility issues</h2>
        <TransitionGroup tag="div" name="list">
          <BaseLabel
            v-for="message in messages"
            :key="message.message"
            :severity="message.severity"
            class="mb-4"
          >
            <div class="flex items-center">
              <div class="flex-1">
                <component
                  :is="messageIcons[message.severity]"
                  class="h-6 w-6 inline-block mr-3 pb-1"
                />
              </div>
              <div class="font-bold flex-grow">{{ message.message }}</div>
            </div>
          </BaseLabel>
        </TransitionGroup>
        <div class="border-t-2 border-t-neutral-700 -mx-4 pb-2 px-4">
          <span class="mt-4 mr-6 inline-block">
            <MoneyIcon class="h-6 w-6 inline-block pb-1 text-violet-500" />
            <div class="font-bold text-neutral-400 inline">
              Total price: <span class="text-violet-400">{{ price }}</span> lei
            </div>
          </span>
          <br v-if="screenWidth < 768" />
          <span class="mt-4 inline-block">
            <BoltIcon class="h-5 w-5 inline-block pb-1 text-violet-500" />
            <div class="font-bold text-neutral-400 inline">
              Estimated wattage:
              <span class="text-violet-400">{{ powerConsumption }}</span> W
            </div>
          </span>
        </div>
      </div>
      <div v-else><CompatibilityLoader class="transition-all" /></div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch, Transition } from "vue";
import useFetch from "../composables/useFetch";
import CompatibilityLoader from "../components/loaders/CompatibilityMessagesLoader.vue";
import BaseLabel from "./BaseLabel.vue";
import CheckIcon from "@/assets/icons/check.svg";
import ErrorIcon from "@/assets/icons/error.svg";
import WarningIcon from "@/assets/icons/warning.svg";
import MoneyIcon from "@/assets/icons/money.svg";
import BoltIcon from "@/assets/icons/bolt.svg";
import { removePriceField } from "../utils/removePriceField";
import { useScreenSize } from "../composables/useScreenSize";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

type CompatibilityMessage = {
  message: string;
  severity: "error" | "warn" | "success";
};

const messageIcons = {
  error: ErrorIcon,
  warn: WarningIcon,
  success: CheckIcon,
};

type Props = { parts?: any };
const props = defineProps<Props>();

const apiUrl = ref<string>("");
const parts = ref<any>(
  JSON.parse(localStorage.getItem("selectedComponents") || "{}")
);
const messages = ref<CompatibilityMessage[]>([]);
const price = ref<number>(0);
const powerConsumption = ref<number>(0);

const { screenWidth } = useScreenSize();

function buildQueryString(parts: any) {
  const params = new URLSearchParams();
  parts = removePriceField(parts);

  Object.entries(parts).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((item: any) => {
        params.append(`components[${key}][]`, JSON.stringify(item));
      });
    } else {
      params.append(`components[${key}]`, JSON.stringify(value));
    }
  });

  return params.toString();
}

function updateApiUrl() {
  const queryString = buildQueryString(parts.value);
  apiUrl.value = `${apiBaseUrl}/compatibility?${queryString}`;
}

let updateTimeout: any;

function debouncedUpdateApiUrl() {
  if (updateTimeout) clearTimeout(updateTimeout);
  updateTimeout = setTimeout(() => {
    updateApiUrl();
  }, 300);
}

function handlePartsChanged() {
  const newParts = JSON.parse(
    localStorage.getItem("selectedComponents") || "{}"
  );
  if (JSON.stringify(newParts) !== JSON.stringify(parts.value)) {
    parts.value = newParts;
  }
}

onMounted(() => {
  updateApiUrl();
});

watch(parts, debouncedUpdateApiUrl, { deep: true });
watch(() => props.parts, handlePartsChanged, { immediate: true });

const { fetchedData, fetchError, isLoading } = useFetch(apiUrl);

watch(fetchedData, (newData) => {
  if (newData?.messages) {
    messages.value = newData.messages;
  }
  if (newData?.price) {
    price.value = Math.round(newData.price.price * 100) / 100;
  }
  if (newData) {
    powerConsumption.value = newData.powerConsumption;
  }
});
</script>

<style scoped>
.opacity-slide-left-enter-active {
  @apply transition-all duration-200 delay-200;
}

.opacity-slide-left-leave-active {
  @apply transition-all duration-200;
}

.opacity-slide-left-enter-from,
.opacity-slide-left-leave-to {
  @apply opacity-0 transform -translate-x-6;
}
</style>
