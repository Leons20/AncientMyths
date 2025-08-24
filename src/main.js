import { createApp } from "vue";
import { createPinia } from "pinia";
import { useUserStore } from "@/stores/users.js";

import "./assets/main.css";
import "./firebase.js";
import App from "./App.vue";
import router from "./router";

const app = createApp(App);

app.use(createPinia());
app.use(router);

const userStore = useUserStore();
userStore.initAuthListener();

app.mount("#app");
