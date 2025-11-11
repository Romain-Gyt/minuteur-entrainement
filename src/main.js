import "./assets/main.css";
import { createApp } from "vue";
import App from "./App.vue";
import { router } from "./router";

import { registerSW } from "virtual:pwa-register";

const updateSW = registerSW({
  immediate: true,
  onNeedRefresh() {
    // Optionnel: afficher un toast "Nouvelle version dispo" puis updateSW(true)
    updateSW(true);
  },
  onOfflineReady() {
    // Optionnel: toast "L’app est prête hors-ligne"
    console.log("PWA prête hors-ligne");
  },
});

createApp(App).use(router).mount("#app");
