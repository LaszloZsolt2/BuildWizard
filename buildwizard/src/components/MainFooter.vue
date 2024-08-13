<template>
  <footer class="bg-violet-800 text-white p-4">
    <div
      class="container mx-auto flex flex-col md:flex-row justify-between items-center"
    >
      <div class="mb-4 md:mb-0">
        <p>&copy; 2024 BuildWizard. Your guide to compatible PC components.</p>
      </div>
      <nav class="flex space-x-4">
        <SvgIcon
          name="facebook"
          href="https://www.facebook.com"
          class="w-6 h-6 text-white"
        />
        <SvgIcon
          name="email"
          href="https://www.gmail.com"
          class="w-6 h-6 text-white"
        />
        <SvgIcon
          name="linkedin"
          href="https://www.linkedin.com"
          class="w-6 h-6 text-white"
        />
      </nav>
    </div>
  </footer>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import SvgIcon from "@/components/SvgIcon.vue";

export default defineComponent({
  name: "MainFooter",
  components: {
    SvgIcon,
  },
});
</script>
