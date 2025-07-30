import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import { createPinia } from "pinia";
const pinia = createPinia();

import router from "./router/index.js";
import "./assets/tailwind.css"; // Import Tailwind CSS


createApp(App)
  .use(pinia)
  .use(router)
  .mount("#app")
  .$nextTick(() => {
    // Use contextBridge
    window.ipcRenderer.on("main-process-message", (_event, message) => {
      console.log(message);
    });
  });
