import { createApp } from "vue";
// @ts-ignore
import App from "./App.vue";
import router from "../../site/src/router";
import PrimeVue from "primevue/config";
import Aura from "@primevue/themes/aura";
import { setTheme } from "../../site/src/utils/primeVueTheme";
import "./style.css";

createApp(App)
  .use(router)
  .use(PrimeVue, {
    theme: {
      preset: Aura,
      options: {
        prefix: "p",
      },
    },
  })
  .mount("#app")
  .$nextTick(setTheme);
