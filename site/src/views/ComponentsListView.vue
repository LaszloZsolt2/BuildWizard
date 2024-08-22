<template>
  <div>
    <div class="bg-violet-800 p-10">
      <p class="text-3xl font-bold text-white text-center">
        Select Your Components
      </p>
    </div>
    <p class="mb-20"></p>
    <table
      class="m-16 w-11/12 bg-gray-800 rounded-lg overflow-hidden shadow-md"
    >
      <thead>
        <tr class="bg-gray-700 text-white">
          <th class="p-3 text-center">Components</th>
          <th class="p-3 text-center">Selected</th>
          <th class="p-3 text-center">Price</th>
          <th class="p-3 text-center">Where</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td class="p-3 w-1/12">
            <Cpu />
          </td>
          <td class="p-3 text-white text-center">
            {{ selected.Cpus?.name || "" }}
          </td>
          <td class="p-3 text-white text-center">
            {{ selected.Cpus?.price || "" }}
          </td>
          <td class="p-3 text-center"></td>
        </tr>
        <tr>
          <td class="p-3">
            <CpuCooler />
          </td>
          <td class="p-3 text-white text-center">
            {{ selected["Cpu-coolers"]?.name || "" }}
          </td>
          <td class="p-3 text-white text-center">
            {{ selected["Cpu-coolers"]?.price || "" }}
          </td>
          <td class="p-3 text-center"></td>
        </tr>
        <tr>
          <td class="p-3">
            <Gpu />
          </td>
          <td class="p-3 text-white text-center">
            {{ selected.Gpus?.name || "" }}
          </td>
          <td class="p-3 text-white text-center">
            {{ selected.Gpus?.price || "" }}
          </td>
          <td class="p-3 text-center"></td>
        </tr>
        <tr>
          <td class="p-3">
            <Case />
          </td>
          <td class="p-3 text-white text-center">
            {{ selected.Cases?.name || "" }}
          </td>
          <td class="p-3 text-white text-center">
            {{ selected.Cases?.price || "" }}
          </td>
          <td class="p-3 text-center"></td>
        </tr>
        <tr>
          <td class="p-3">
            <CaseFan />
          </td>
          <td class="p-3 text-white text-center">
            {{ selected["Case-fans"]?.name || "" }}
          </td>
          <td class="p-3 text-white text-center">
            {{ selected["Case-fans"]?.price || "" }}
          </td>
        </tr>
        <tr>
          <td class="p-3">
            <HardDrive />
          </td>
          <td class="p-3 text-white text-center">
            {{ selected["Hard-drives"]?.name || "" }}
          </td>
          <td class="p-3 text-white text-center">
            {{ selected["Hard-drives"]?.price || "" }}
          </td>
          <td class="p-3 text-center"></td>
        </tr>
        <tr>
          <td class="p-3">
            <Memory />
          </td>
          <td class="p-3 text-white text-center">
            {{ selected.Memories?.name || "" }}
          </td>
          <td class="p-3 text-white text-center">
            {{ selected.Memories?.price || "" }}
          </td>
          <td class="p-3 text-center"></td>
        </tr>
        <tr>
          <td class="p-3">
            <Motherboard />
          </td>
          <td class="p-3 text-white text-center">
            {{ selected.Motherboards?.name || "" }}
          </td>
          <td class="p-3 text-white text-center">
            {{ selected.Motherboards?.price || "" }}
          </td>
          <td class="p-3 text-center"></td>
        </tr>
        <tr>
          <td class="p-3">
            <PowerSupply />
          </td>
          <td class="p-3 text-white text-center">
            {{ selected["Power-supplies"]?.name || "" }}
          </td>
          <td class="p-3 text-white text-center">
            {{ selected["Power-supplies"]?.price || "" }}
          </td>
          <td class="p-3 text-center"></td>
        </tr>
      </tbody>
    </table>
    <p class="mb-20"></p>
  </div>
</template>

<script setup lang="ts">
import Cpu from "../components/parts/Cpu.vue";
import Gpu from "../components/parts/Gpu.vue";
import Case from "../components/parts/Case.vue";
import CaseFan from "../components/parts/CaseFan.vue";
import CpuCooler from "../components/parts/CpuCooler.vue";
import HardDrive from "../components/parts/HardDrive.vue";
import Memory from "../components/parts/Memory.vue";
import Motherboard from "../components/parts/Motherboard.vue";
import PowerSupply from "../components/parts/PowerSupply.vue";
import { ref, watch, onMounted } from "vue";
import { useRoute } from "vue-router";

const selected = ref<{ [key: string]: { name: string; price: number } }>({});
const route = useRoute();

onMounted(() => {
  // Load selected items from localStorage when component is mounted
  const storedData = localStorage.getItem("selectedComponents");
  if (storedData) {
    selected.value = JSON.parse(storedData);
  }
});

watch(
  () => route.query,
  (newQuery) => {
    const type = newQuery.type as string | undefined;
    const name = newQuery.name as string | undefined;
    const price = newQuery.price as string | undefined;

    if (type && name && price) {
      selected.value[type] = {
        name: name,
        price: parseFloat(price),
      };

      // Update localStorage with the latest selection
      const storedData = localStorage.getItem("selectedComponents");
      const selectedComponents = storedData ? JSON.parse(storedData) : {};
      selectedComponents[type] = {
        name: name,
        price: parseFloat(price),
      };
      localStorage.setItem(
        "selectedComponents",
        JSON.stringify(selectedComponents)
      );
    }
  },
  { immediate: true }
);
</script>
