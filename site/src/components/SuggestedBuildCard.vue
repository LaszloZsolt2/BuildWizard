<template>
  <div
    v-if="build"
    @click="onBuildClick"
    class="flex-1 bg-neutral-800 bg-opacity-70 my-3 mx-1 p-6 rounded-xl cursor-pointer transition-all duration-300"
    :style="{
      height: '70vh',
      width: screenWidth < 1280 ? '85vw' : '25vw',
      boxShadow: isSelected
        ? 'inset 0 0px 20px 0 rgba(139, 92, 246, 0.5)'
        : undefined,
    }"
  >
    <div class="overflow-clip" :style="{ height: '5.5rem' }">
      <div class="md:text-2xl capitalize text-neutral-300 font-bold mb-2">
        {{ typeAliases[type as keyof typeof typeAliases] || type }}
      </div>
      <div class="text-sm md:text-base text-neutral-400 ml-2">
        {{ typeExplanations[type] }}
      </div>
    </div>
    <div class="card-content">
      <div
        v-for="component in Object.keys(build.build) as PartType[]"
        :key="component"
      >
        <div v-if="Array.isArray(build.build[component])">
          <SuggestedBuildCardComponent
            v-for="(subComponent, index) in build.build[component]"
            :key="index"
            :component="subComponent"
          />
        </div>
        <SuggestedBuildCardComponent
          v-else
          :component="build.build[component]"
          :type="component"
        />
      </div>
    </div>
    <BaseLabel severity="secondary" class="mt-6 text-nowrap overflow-x-clip">
      <div class="text-sm">
        <CheckIcon class="h-6 w-6 inline-block mr-1 pb-1" />
        Meets
        <span class="font-bold text-violet-400">{{ build.type }} </span>
        requirements
      </div>
    </BaseLabel>
    <div class="mt-4">
      <span class="text-2xl md:text-3xl font-bold text-violet-400">{{
        price
      }}</span>
      <span class="text-xl md:text-2xl font-bold text-neutral-200"> lei </span>
      <span
        v-if="!build.price.isPriceForAllParts"
        class="text-sm font-bold text-neutral-500"
      >
        (Not including all parts)
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Build } from "../types/build";
import { PartType } from "../types/partType";
import SuggestedBuildCardComponent from "./SuggestedBuildCardComponent.vue";
import BaseLabel from "./BaseLabel.vue";
import CheckIcon from "@/assets/icons/check.svg";
import { computed } from "vue";
import { useScreenSize } from "../composables/useScreenSize";
import { BuildType, typeExplanations } from "../types/buildType";

type Props = {
  build: Build;
  type: BuildType;
  selectedBuild: BuildType | null;
};

const typeAliases = {
  maxPerformance: "Max Performance",
  recPremium: "Premium",
};

const props = defineProps<Props>();
const emit = defineEmits<{
  (e: "update:selectedBuild", value: BuildType | null): void;
}>();

const { screenWidth } = useScreenSize();
const isSelected = computed(() => props.selectedBuild === props.type);
const price = computed(() => Math.round(props.build.price.price * 100) / 100);

function onBuildClick() {
  const newValue = isSelected.value ? null : props.type;
  emit("update:selectedBuild", newValue);
}
</script>

<style scoped>
.card-content::-webkit-scrollbar {
  display: none;
}
.card-content {
  -ms-overflow-style: none;
  scrollbar-width: none;
  height: calc(65vh - 12rem);
  overflow-y: scroll;
}
</style>
