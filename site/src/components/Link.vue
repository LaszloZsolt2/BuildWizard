<template>
  <div
    class="p-3 ml-4 -mr-4 my-5 bg-neutral-800 border border-gray-800 rounded-md shadow-md flex items-center space-x-4"
  >
    <div class="flex-1">
      <input
        v-model="link"
        type="text"
        readonly
        class="w-full p-2 border border-violet-800 rounded-md bg-neutral-700 text-neutral-200 focus:outline-none"
      />
    </div>
    <Button @click="copyAndSaveLink">
      <div class="px-1 inline">
        <CopyIcon class="w-4 h-4 mr-2 inline" />
        <span class="font-bold"> Copy Link </span>
      </div>
    </Button>
  </div>
  <Toast />
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { v4 as uuidv4 } from "uuid";
import Button from "../components/BaseButton.vue";
import axios from "axios";
import { onMounted } from "vue";
import useFetch from "../composables/useFetch";
import router from "../router";
import CopyIcon from "@/assets/icons/copy.svg";
import Toast from "primevue/toast";
import { useToast } from "primevue/usetoast";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

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
const { fetchedData, fetchError, isLoading } = useFetch(sharedLink);
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

watch(fetchedData, () => {
  if (fetchedData.value) {
    const simplifiedBuild = Object.fromEntries(
      Object.entries(fetchedData.value).map(([category, components]) => {
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

watch(fetchError, () => {
  if (fetchError.value) {
    router.push("/");
  }
});
</script>
