<template>
  <div class="mt-6">
    <p class="text-xl font-bold text-neutral-200">
      {{ capitalizeFirstLetter(props.type) }}
    </p>
    <div class="pl-4 pt-2">
      <ul class="list-inside pl-5">
        <li
          v-for="requirement in Object.keys(
            props.systemRequirements[props.type]
          )"
          :key="requirement"
          class="mb-2"
        >
          <p class="font-bold">
            <RequirementsMet
              :met="props.requirementsMet[props.type][requirement]"
            />
            {{ requirement.toUpperCase() }}
          </p>
          <div
            v-if="
              typeof props.systemRequirements[props.type][requirement] ===
              'object'
            "
          >
            <p
              v-for="component in props.systemRequirements[props.type][
                requirement
              ]"
              :key="component"
              class="text-neutral-400 ml-4"
            >
              {{ component }}
            </p>
          </div>
          <div v-else>
            <p class="text-neutral-400 ml-4">
              {{ props.systemRequirements[props.type][requirement] }} GB
            </p>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from "vue";
import { capitalizeFirstLetter } from "../utils/string";
import RequirementsMet from "./RequirementMet.vue";

type Props = {
  systemRequirements: any;
  requirementsMet: any;
  type: "minimum" | "recommended";
};
const props = defineProps<Props>();
</script>

<style scoped>
ul {
  list-style-position: outside;
  margin: 0;
  padding: 0;
}

li {
  margin-bottom: 0.5rem;
}
</style>
