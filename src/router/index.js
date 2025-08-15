import { createRouter, createWebHistory } from "vue-router";
import HomeView from "@/views/HomeView.vue";
import SignUp from "@/views/SignUp.vue";
import SignIn from "@/views/SignIn.vue";
import MainView from "@/views/MainView.vue";
import EgyptianMyths from "@/views/myths/EgyptianMyths.vue";
import GreekMyths from "@/views/myths/GreekMyths.vue";
import NorseMyths from "@/views/myths/NorseMyths.vue";
import HinduMyths from "@/views/myths/HinduMyths.vue";
import ChineseMyths from "@/views/myths/ChineseMyths.vue";
import MayanMyths from "@/views/myths/MayanMyths.vue";
import AddMyth from "@/views/AddMyth.vue";
import ReviewView from "@/views/ReviewView.vue";
import SettingsView from "@/views/SettingsView.vue";
import ProfileView from "@/views/ProfileView.vue";
import NotFound from "@/views/NotFound.vue";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        { path: "/home", redirect: "/" },
        { path: "/", name: "Home", component: HomeView },
        { path: "/signup", name: "SignUp", component: SignUp },
        { path: "/signin", name: "SignIn", component: SignIn },
        { path: "/main", name: "Main", component: MainView },
        { path: "/myths/egyptian/:title?", name: "EgyptianMyths", component: EgyptianMyths },
        { path: "/myths/greek/:title?", name: "GreekMyths", component: GreekMyths },
        { path: "/myths/norse/:title?", name: "NorseMyths", component: NorseMyths },
        { path: "/myths/hindu/:title?", name: "HinduMyths", component: HinduMyths },
        { path: "/myths/chinese/:title?", name: "ChineseMyths", component: ChineseMyths },
        { path: "/myths/mayan/:title?", name: "MayanMyths", component: MayanMyths },
        { path: "/add-myth", name: "AddMyth", component: AddMyth },
        { path: "/review", name: "Review", component: ReviewView },
        { path: "/settings", name: "settings", component: SettingsView },
        { path: "/profile", name: "Profile", component: ProfileView },
        { path: "/:pathMatch(.*)*", name: "NotFound", component: NotFound },
    ],
});

export default router;
