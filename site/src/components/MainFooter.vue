<template>
  <footer class="bg-violet-800 text-white p-4">
    <div
      class="container mx-auto flex flex-col md:flex-row justify-between items-center"
    >
      <div class="mb-4 md:mb-0">
        <p>&copy; 2024 BuildWizard. Your guide to compatible PC components.</p>
      </div>
      <nav class="flex space-x-4">
        <a
          href="https://www.facebook.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FacebookIcon class="w-6 h-6 text-white" />
        </a>
        <a
          href="https://www.gmail.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          <EmailIcon class="w-6 h-6 text-white" />
        </a>
        <a
          href="https://www.linkedin.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          <LinkedinIcon class="w-6 h-6 text-white" />
        </a>
      </nav>
    </div>
  </footer>
</template>

<script setup lang="ts">
import SvgIcon from "../components/SvgIcon.vue";
</script>
