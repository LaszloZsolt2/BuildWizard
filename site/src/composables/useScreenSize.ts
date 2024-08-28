import { ref, onMounted, onUnmounted } from "vue";

export function useScreenSize() {
  const screenWidth = ref<number>(window.innerWidth);
  const screenHeight = ref<number>(window.innerHeight);

  const updateScreenSize = () => {
    screenWidth.value = window.innerWidth;
    screenHeight.value = window.innerHeight;
  };

  onMounted(() => {
    window.addEventListener("resize", updateScreenSize);
  });

  onUnmounted(() => {
    window.removeEventListener("resize", updateScreenSize);
  });

  return {
    screenWidth,
    screenHeight,
  };
}
