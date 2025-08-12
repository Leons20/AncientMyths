import { ref } from "vue";
import { defineStore } from "pinia";

export const useUserStore = defineStore("user", () => {
    const fullName = ref("");
    const email = ref("");
    const username = ref("");
    const password = ref("");
    const isLoggedIn = ref(false);
    const isGuest = ref(false);
    const selectedMythology = ref("");

    function register(userData) {
        fullName.value = userData.fullName;
        email.value = userData.email;
        username.value = userData.username;
        password.value = userData.password;
        isLoggedIn.value = true;
        isGuest.value = false;
    }

    function login(userData) {
        username.value = userData.username;
        password.value = userData.password;
        isLoggedIn.value = true;
        isGuest.value = false;
    }

    function continueAsGuest() {
        fullName.value = "";
        email.value = "";
        username.value = "";
        password.value = "";
        isLoggedIn.value = false;
        isGuest.value = true;
    }

    function logout() {
        fullName.value = "";
        email.value = "";
        username.value = "";
        password.value = "";
        isLoggedIn.value = false;
        isGuest.value = false;
    }

    return {
        fullName,
        email,
        username,
        password,
        isLoggedIn,
        isGuest,
        selectedMythology,
        register,
        login,
        continueAsGuest,
        logout,
    };
});
