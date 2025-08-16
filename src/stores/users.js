import { ref } from "vue";
import { defineStore } from "pinia";

export const useUserStore = defineStore("user", () => {
    const fullName = ref("");
    const email = ref("");
    const username = ref("");
    const password = ref("");
    const isLoggedIn = ref(false);
    const isGuest = ref(false);
    const isAdmin = ref(false);
    const selectedMythology = ref("");
    const profileImage = ref("");

    const allUsers = ref([
        { fullName: "Admin", email: "admin@gmail.com", username: "Admin", password: "admin123", profileImage: "" },
    ]);

    function register(userData) {
        fullName.value = userData.fullName;
        email.value = userData.email;
        username.value = userData.username;
        password.value = userData.password;
        profileImage.value = userData.profileImage || "";
        isLoggedIn.value = true;
        isGuest.value = false;

        if (!allUsers.value.find((u) => u.email === userData.email)) {
            allUsers.value.push({
                fullName: userData.fullName,
                email: userData.email,
                username: userData.username,
                password: userData.password,
                profileImage: userData.profileImage || "",
            });
        }

        if (email.value === "admin@gmail.com" && username.value === "Admin" && password.value === "admin123") {
            isAdmin.value = true;
        } else {
            isAdmin.value = false;
        }
    }

    function login(userData) {
        username.value = userData.username;
        password.value = userData.password;
        isLoggedIn.value = true;
        isGuest.value = false;

        const user = allUsers.value.find((u) => u.username === userData.username && u.password === userData.password);

        if (user) {
            fullName.value = user.fullName;
            email.value = user.email;
            profileImage.value = user.profileImage || "";
            if (user.username === "Admin" && user.password === "admin123") {
                isAdmin.value = true;
            } else {
                isAdmin.value = false;
            }
        }
    }

    function continueAsGuest() {
        fullName.value = "";
        email.value = "";
        username.value = "";
        password.value = "";
        profileImage.value = "";
        isLoggedIn.value = false;
        isGuest.value = true;
        isAdmin.value = false;
    }

    function logout() {
        fullName.value = "";
        email.value = "";
        username.value = "";
        password.value = "";
        profileImage.value = "";
        isLoggedIn.value = false;
        isGuest.value = false;
        isAdmin.value = false;
    }

    function deleteUser(userEmail) {
        allUsers.value = allUsers.value.filter((u) => u.email !== userEmail);
    }

    return {
        fullName,
        email,
        username,
        password,
        profileImage,
        isLoggedIn,
        isGuest,
        isAdmin,
        selectedMythology,
        allUsers,
        register,
        login,
        continueAsGuest,
        logout,
        deleteUser,
    };
});
