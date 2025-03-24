<template>
  <div
    class="bg-neutral-800 m-4 px-4 pt-6 pb-1 rounded-lg w-full transition-all duration-500"
    ref="componentsList"
    :style="{ maxWidth: maxWidth }"
  >
    <Transition name="opacity-slide-left">
      <div v-if="messages.length">
        <h2 class="text-lg md:text-xl font-bold mb-3 md:mb-6">
          Compatibility issues
        </h2>
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
                  class="h-5 w-5 md:h-6 md:w-6 inline-block mr-2 md:mr-3 pb-1"
                />
              </div>
              <div class="text-sm md:text-base font-bold flex-grow">
                {{ message.message }}
              </div>
            </div>
          </BaseLabel>
        </TransitionGroup>
        <div
          class="flex flex-col md:flex-row border-t-2 border-t-neutral-700 -mx-4 pb-2 px-4"
        >
          <div class="md:flex-grow">
            <span class="mt-4 mr-6 inline-block">
              <MoneyIcon
                class="h-5 w-5 md:h-6 md:w-6 inline-block pb-1 text-violet-500"
              />
              <div
                class="text-sm md:text-base font-bold text-neutral-400 inline"
              >
                Total price:
                <span class="text-violet-400">{{ price }}</span> lei
              </div>
            </span>
            <br v-if="screenWidth < 768" />
            <span class="mt-2 md:mt-4 inline-block">
              <BoltIcon class="h-5 w-5 inline-block pb-1 text-violet-500" />
              <div
                class="text-sm md:text-base font-bold text-neutral-400 inline"
              >
                Estimated wattage:
                <span class="text-violet-400">{{ powerConsumption }}</span> W
              </div>
            </span>
          </div>
          <BaseButton
            @click="copyAndSaveLink"
            class="mt-4 md:mt-2 h-8 md:h-9 w-fit"
          >
            <div class="px-1 inline -mt-0.5 md:mt-0">
              <CopyIcon class="h-3 w-3 md:w-4 md:h-4 mr-2 inline" />
              <span class="text-sm md:text-base font-bold"> Copy Link </span>
            </div>
          </BaseButton>
        </div>
      </div>
      <div v-else><CompatibilityLoader class="transition-all" /></div>
    </Transition>
  </div>
  <Toast />
</template>

<script setup lang="ts">
import { onMounted, ref, watch, Transition } from "vue";
import useFetch from "../composables/useFetch";
import CompatibilityLoader from "../components/loaders/CompatibilityMessagesLoader.vue";
import BaseLabel from "./BaseLabel.vue";
import BaseButton from "./BaseButton.vue";
import CopyIcon from "@/assets/icons/copy.svg";
import CheckIcon from "@/assets/icons/check.svg";
import ErrorIcon from "@/assets/icons/error.svg";
import WarningIcon from "@/assets/icons/warning.svg";
import MoneyIcon from "@/assets/icons/money.svg";
import BoltIcon from "@/assets/icons/bolt.svg";
import { removePriceField } from "../utils/removePriceField";
import { useScreenSize } from "../composables/useScreenSize";
import axios from "axios";
import { useToast } from "primevue/usetoast";
import Toast from "primevue/toast";
import router from "../router";
import { v4 as uuidv4 } from "uuid";

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

type Props = { parts?: any; maxWidth?: string };
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

axios.defaults.baseURL = apiBaseUrl.replace("/api", "");

const generateLink = () => {
  const baseUrl = window.location.origin;
  const pagePath = window.location.pathname;
  const uniqueId = (linkId.value = uuidv4());

  return `${baseUrl}${pagePath}?list=${uniqueId}`;
};

const linkId = ref("");
const link = ref(generateLink());
const sharedLink = ref("");
const { fetchedData: fetchedLink } = useFetch(sharedLink);
const emit = defineEmits(["build-load"]);
const toast = useToast();

const copyAndSaveLink = async () => {
  try {
    const selectedComponents = JSON.parse(
      localStorage.getItem("selectedComponents") || "{}"
    );

    const postData = {
      link: linkId.value,
      cpu: selectedComponents.cpus?._id || null,
      cpu_cooler: selectedComponents["cpu-coolers"]?._id || null,
      gpu: selectedComponents.gpus?._id || null,
      case: selectedComponents.cases?._id || null,
      case_fans: selectedComponents["case-fans"]
        ? selectedComponents["case-fans"].map((fan: any) => fan._id)
        : null,
      hard_drives: selectedComponents["hard-drives"]
        ? selectedComponents["hard-drives"].map((drive: any) => drive._id)
        : null,
      memories: selectedComponents["memories"]
        ? selectedComponents["memories"].map((memory: any) => memory._id)
        : null,
      motherboards: selectedComponents.motherboards?._id || null,
      power_supplies: selectedComponents["power-supplies"]?._id || null,
    };

    const response = await axios.post("/api/links", postData, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.status === 201) {
      await navigator.clipboard.writeText(link.value);
      toast.add({
        severity: "success",
        summary: "Success",
        detail: "Link copied to clipboard and saved successfully!",
        life: 3000,
      });
    } else {
      throw new Error("Failed to save link");
    }
  } catch (err) {
    if (axios.isAxiosError(err)) {
      console.error(
        "Failed to save the link and components:",
        err.response?.data
      );
      alert(
        `Failed to save the link and components. ${err.response?.data.message}`
      );
    } else if (err instanceof Error) {
      console.error("Failed to save the link and components:", err.message);
      alert("Failed to save the link and components.");
    } else {
      console.error("Failed to save the link and components:", err);
      alert("Failed to save the link and components.");
    }
  }
};

onMounted(() => {
  const urlParams = new URLSearchParams(window.location.search);
  const listId = urlParams.get("list");

  if (listId) {
    sharedLink.value = `${apiBaseUrl}/links/${listId}`;
  }
});

watch(fetchedLink, () => {
  if (fetchedLink.value) {
    const simplifiedBuild = Object.fromEntries(
      Object.entries(fetchedLink.value).map(([category, components]) => {
        if (!components) return [category, undefined];
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
    emit("build-load", simplifiedBuild);
    router.push("/");
  }
});
</script>

<style>
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
