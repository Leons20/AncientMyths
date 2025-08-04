import { createRouter, createWebHistory } from "vue-router";
import HomeView from "@/views/HomeView.vue";
import SignUp from "@/views/SignUp.vue";
import SignIn from "@/views/SignIn.vue";
import MainView from "@/views/MainView.vue";
import NotFound from "@/views/NotFound.vue";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        { path: "/home", redirect: "/" },
        { path: "/", name: "home", component: HomeView },
        { path: "/signup", name: "SignUp", component: SignUp },
        { path: "/signin", name: "SignIn", component: SignIn },
        { path: "/main", name: "main", component: MainView },
        { path: "/:pathMatch(.*)*", name: "NotFound", component: NotFound },
    ],
});

export default router;
