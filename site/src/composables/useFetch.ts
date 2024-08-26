// src/composables/useFetch.ts
import { ref, onMounted } from "vue";

export default function useFetch(url: string) {
  const fetchedData = ref<any>(null);
  const fetchError = ref<string | null>(null);
  const isLoading = ref<boolean>(true);

  const fetchData = async () => {
    try {
      const response = await fetch(url);
      if (response.ok) {
        fetchedData.value = await response.json();
        fetchError.value = null;
      } else {
        throw new Error("Failed to fetch data");
      }
    } catch (err) {
      fetchError.value = err instanceof Error ? err.message : "Unknown error";
      fetchedData.value = null;
    } finally {
      isLoading.value = false;
    }
  };

  onMounted(fetchData);

  return { fetchedData, fetchError, isLoading };
}
