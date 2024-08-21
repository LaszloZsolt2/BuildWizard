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
          <th class="p-3 text-left">Components</th>
          <th class="p-3 text-left">Selected</th>
          <th class="p-3 text-left">Price</th>
          <th class="p-3 text-left">Where</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td class="p-3 w-1/12">
            <Cpu />
          </td>
          <td class="p-3"></td>
          <td class="p-3"></td>
          <td class="p-3"></td>
        </tr>
        <tr></tr>
        <tr>
          <td class="p-3">
            <CpuCooler />
          </td>
          <td class="p-3"></td>
          <td class="p-3"></td>
          <td class="p-3"></td>
        </tr>
        <tr>
          <td class="p-3">
            <Gpu />
          </td>
          <td class="p-3"></td>
          <td class="p-3"></td>
          <td class="p-3"></td>
        </tr>
        <tr>
          <td class="p-3">
            <Case />
          </td>
          <td class="p-3"></td>
          <td class="p-3"></td>
          <td class="p-3"></td>
        </tr>
        <tr>
          <td class="p-3">
            <CaseFan />
          </td>
          <td class="p-3"></td>
          <td class="p-3"></td>
          <td class="p-3"></td>
        </tr>
        <tr>
          <td class="p-3">
            <HardDrive />
          </td>
          <td class="p-3"></td>
          <td class="p-3"></td>
          <td class="p-3"></td>
        </tr>
        <tr>
          <td class="p-3">
            <Memory />
          </td>
          <td class="p-3"></td>
          <td class="p-3"></td>
          <td class="p-3"></td>
        </tr>
        <tr>
          <td class="p-3">
            <Motherboard />
          </td>
          <td class="p-3"></td>
          <td class="p-3"></td>
          <td class="p-3"></td>
        </tr>
        <tr>
          <td class="p-3">
            <PowerSupply />
          </td>
          <td class="p-3"></td>
          <td class="p-3"></td>
          <td class="p-3"></td>
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
</script>
