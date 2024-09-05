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
import { removePriceField } from "../utils/removePriceField";

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
