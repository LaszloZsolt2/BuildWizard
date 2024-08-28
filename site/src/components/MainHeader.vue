<template>
  <div class="w-full fixed z-50">
    <nav
      :class="[
        'bg-neutral-800 m-2 md:m-4 rounded-lg flex content-start p-3 md:p-4 shadow-lg transition-all duration-500',
        navbarHeight,
      ]"
    >
      <!-- Logo -->
      <div class="flex-10 md:flex md:ml-auto items-start justify-start">
        <RouterLink to="/">
          <img
            src="../assets/logo.png"
            alt="logo"
            class="h-12 ml-2 mt-1 md:mt-0 block object-cover"
          />
        </RouterLink>
      </div>

      <!-- Navigation buttons -->
      <div class="flex-1 h-20 md:flex md:ml-auto justify-end">
        <RouterLink to="/" class="navbar-button hidden md:block">
          <BuildIcon class="navbar-icon inline-flex" />
          Builder
        </RouterLink>
        <RouterLink to="/builds" class="navbar-button hidden md:block">
          <CompletedBuildsIcon class="navbar-icon inline-flex mr-1" />
          Completed Builds
        </RouterLink>
        <BarsIcon
          @click="toggleNavbar"
          id="menu-icon"
          class="navbar-icon block md:hidden cursor-pointer ml-auto mt-4 mr-1"
        />
      </div>

      <!-- Mobile navigation -->
      <transition name="opacity-slide-top">
        <div v-if="isNavbarOpen" class="block md:hidden absolute top-24">
          <div class="my-4">
            <RouterLink to="/" @click="toggleNavbar" class="navbar-button">
              <BuildIcon class="navbar-icon inline-flex" />
              Builder
            </RouterLink>
          </div>
          <div class="my-4">
            <RouterLink
              to="/builds"
              @click="toggleNavbar"
              class="navbar-button"
            >
              <CompletedBuildsIcon class="navbar-icon inline-flex mr-1" />
              Completed Builds
            </RouterLink>
          </div>
        </div>
      </transition>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import BarsIcon from "@/assets/icons/bars.svg";
import CompletedBuildsIcon from "@/assets/icons/completedBuilds.svg";
import BuildIcon from "@/assets/icons/build.svg";

const isNavbarOpen = ref(false);

const navbarHeight = computed(() => {
  return isNavbarOpen.value ? "h-52" : "h-20";
});

function handleResize(): void {
  isNavbarOpen.value = isNavbarOpen.value && window.innerWidth < 768;
}

function toggleNavbar(): void {
  isNavbarOpen.value = !isNavbarOpen.value;
}

onMounted(() => {
  window.addEventListener("resize", handleResize);
});

onUnmounted(() => {
  window.removeEventListener("resize", handleResize);
});
</script>

<style>
.navbar-button {
  @apply text-neutral-400 pl-2 pr-4 pb-3 pt-3 h-12 rounded-lg hover:text-neutral-300 hover:bg-neutral-700 transition;
}

.navbar-button.router-link-exact-active {
  @apply text-neutral-300;
}

.navbar-button:hover > .navbar-icon,
.navbar-button.router-link-exact-active > .navbar-icon {
  @apply text-violet-500;
}

.navbar-icon {
  @apply text-neutral-400 h-6 w-10 mb-1 transition;
}

#menu-icon {
  @apply hover:text-neutral-300;
}

.opacity-slide-top-enter-active {
  @apply transition-all duration-200 delay-200;
}

.opacity-slide-top-leave-active {
  @apply transition-all duration-200;
}

.opacity-slide-top-enter-from,
.opacity-slide-top-leave-to {
  @apply opacity-0 transform -translate-y-6;
}
</style>
