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
    <Button @click="copyAndSaveLink">Copy Link</Button>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { v4 as uuidv4 } from "uuid";
import Button from "../components/BaseButton.vue";
import axios from "axios";

axios.defaults.baseURL = "http://localhost:5000";

const generateLink = () => {
  const baseUrl = window.location.origin;
  const pagePath = window.location.pathname;
  const uniqueId = (linkId.value = uuidv4());

  return `${baseUrl}${pagePath}?list=${uniqueId}`;
};

const linkId = ref("");
const link = ref(generateLink());

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
      alert("Link copied to clipboard and saved successfully!");
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
</script>
