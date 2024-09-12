import { createApp } from "vue";
// @ts-ignore
import App from "./App.vue";
import router from "../../site/src/router";
import PrimeVue from "primevue/config";
import Aura from "@primevue/themes/aura";
import { setTheme } from "../../site/src/utils/primeVueTheme";
import ToastService from "primevue/toastservice";
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
  .use(ToastService)
  .mount("#app")
  .$nextTick(setTheme);
