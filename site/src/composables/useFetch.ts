import { ref, watch, Ref } from "vue";

export default function useFetch(url: Ref<string>) {
  const fetchedData = ref<any>(null);
  const fetchError = ref<string | null>(null);
  const isLoading = ref<boolean>(true);

  const fetchData = async () => {
    isLoading.value = true;
    try {
      const response = await fetch(url.value);
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

  watch(
    url,
    () => {
      fetchData();
    },
    { immediate: true }
  );

  return { fetchedData, fetchError, isLoading };
}
