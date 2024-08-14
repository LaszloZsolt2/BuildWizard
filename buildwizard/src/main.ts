import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import axios from "axios";
import PrimeVue from "primevue/config";
import Checkbox from "primevue/checkbox";
import Aura from "@primevue/themes/aura";
import "./assets/output.css";
import "./assets/style.css";
import { setTheme } from "./utils/primeVueTheme";

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
  .component("Checkbox", Checkbox)
  .mount("#app")
  .$nextTick(setTheme);
