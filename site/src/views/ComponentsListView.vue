<template>
  <div>
    <div class="bg-violet-800 p-10">
      <p class="text-3xl font-bold text-white text-center">
        Select Your Components
      </p>
    </div>

    <table
      class="mx-16 my-20 w-11/12 bg-gray-800 rounded-lg overflow-hidden shadow-md"
    >
      <thead>
        <tr class="bg-gray-700 text-white">
          <th class="p-3 text-center">Components</th>
          <th class="p-3 text-center">Selected</th>
          <th class="p-3 text-center">Price</th>
          <th class="p-3 text-center">Where</th>
          <th class="w-1"></th>
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
          <td class="text-right">
            <Delete :type="'Cpus'" @delete="handleDelete" />
          </td>
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
          <td class="text-right">
            <Delete :type="'Cpu-coolers'" @delete="handleDelete" />
          </td>
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
          <td class="text-right">
            <Delete :type="'Gpus'" @delete="handleDelete" />
          </td>
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
          <td class="text-right">
            <Delete :type="'Cases'" @delete="handleDelete" />
          </td>
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
          <td class="p-3 text-center"></td>
          <td class="text-right">
            <Delete :type="'Case-fans'" @delete="handleDelete" />
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
          <td class="text-right">
            <Delete :type="'Hard-drives'" @delete="handleDelete" />
          </td>
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
          <td class="text-right">
            <Delete :type="'Memories'" @delete="handleDelete" />
          </td>
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
          <td class="text-right">
            <Delete :type="'Motherboards'" @delete="handleDelete" />
          </td>
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
          <td class="text-right">
            <Delete :type="'Power-supplies'" @delete="handleDelete" />
          </td>
        </tr>
      </tbody>
    </table>
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
import Delete from "../components/Delete.vue";
import { ref, onMounted } from "vue";

const selected = ref<{ [key: string]: { name: string; price: number } }>({});

onMounted(() => {
  const storedData = localStorage.getItem("selectedComponents");
  if (storedData) {
    selected.value = JSON.parse(storedData);
  }
});

const handleDelete = (type: string) => {
  delete selected.value[type];
  const updatedComponents = { ...selected.value };
  localStorage.setItem("selectedComponents", JSON.stringify(updatedComponents));
};
</script>
