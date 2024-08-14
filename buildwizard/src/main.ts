import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import axios from "axios";
import PrimeVue from "primevue/config";
import Checkbox from "primevue/checkbox";
import Message from "primevue/message";
import InputText from "primevue/inputtext";
import ToggleSwitch from "primevue/toggleswitch";
import Button from "primevue/button";
import Aura from "@primevue/themes/aura";
import "./assets/output.css";
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
  .component("Message", Message)
  .component("InputText", InputText)
  .component("ToggleSwitch", ToggleSwitch)
  .mount("#app")
  .$nextTick(setTheme);
