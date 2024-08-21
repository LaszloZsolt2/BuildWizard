import { ref, UnwrapRef } from "vue";
import axios from "axios";

export function useFetch<T>(url: string) {
  const data = ref<T | null>(null);
  const error = ref<string | null>(null);
  const loading = ref<boolean>(true);

  const fetchData = async () => {
    try {
      const response = await axios.get<T>(url);
      data.value = response.data as UnwrapRef<T>;
      error.value = null;
    } catch (err) {
      if (axios.isAxiosError(err)) {
        error.value = err.message;
      } else {
        error.value = "An unexpected error occurred";
      }
    } finally {
      loading.value = false;
    }
  };

  fetchData();

  return {
    data,
    error,
    loading,
  };
}
