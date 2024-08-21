<template>
  <div class="components">
    {{ data?.data }}
  </div>
</template>

<script setup lang="ts">
import { useFetch } from "../composables/useFetch";
import { Cpu } from "../types/cpu";
import { PaginatedResponse } from "../types/paginatedResponse";

const { data, error, loading } = useFetch<PaginatedResponse<Cpu>>(
  "http://localhost:5000/api/cpus"
);
</script>
