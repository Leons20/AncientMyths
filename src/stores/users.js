import { ref } from "vue";
import { defineStore } from "pinia";
import { auth, db } from "@/firebase.js";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc, setDoc, collection, getDocs, deleteDoc } from "firebase/firestore";

export const useUserStore = defineStore("user", () => {
    const fullName = ref("");
    const email = ref("");
    const username = ref("");
    const profileImage = ref("");
    const isLoggedIn = ref(false);
    const isGuest = ref(false);
    const isAdmin = ref(false);
    const selectedMythology = ref("");

    const allUsers = ref([]);

    function clearUser() {
        fullName.value = "";
        email.value = "";
        username.value = "";
        profileImage.value = "";
        isLoggedIn.value = false;
        isGuest.value = false;
        isAdmin.value = false;
        selectedMythology.value = "";
    }

    function initAuthListener() {
        onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                isLoggedIn.value = true;
                isGuest.value = false;

                const userDoc = doc(db, "users", firebaseUser.uid);
                const snap = await getDoc(userDoc);

                if (snap.exists()) {
                    const data = snap.data();
                    fullName.value = data.fullName || "";
                    email.value = data.email || firebaseUser.email;
                    username.value = data.username || "";
                    profileImage.value = data.profileImage || "";
                    isAdmin.value = data.isAdmin || false;
                    selectedMythology.value = data.selectedMythology || "";
                } else {
                    email.value = firebaseUser.email;
                    username.value = firebaseUser.displayName || "";
                    profileImage.value = firebaseUser.photoURL || "";
                }
            } else {
                clearUser();
            }
        });
    }

    async function logout() {
        await signOut(auth);
        clearUser();
    }

    async function continueAsGuest() {
        try {
            await signOut(auth);
        } catch (e) {
            console.warn("Error signing out before guest mode:", e);
        }

        clearUser();
        isGuest.value = true;
    }

    async function fetchAllUsers() {
        const querySnapshot = await getDocs(collection(db, "users"));
        allUsers.value = querySnapshot.docs.map((docSnap) => {
            const data = docSnap.data();
            return {
                id: docSnap.id,
                fullName: data.fullName || "",
                email: data.email || "",
                username: data.username || "",
                profileImage: data.profileImage || "",
                selectedMythology: data.selectedMythology || "",
                isAdmin: data.isAdmin || false,
            };
        });
    }

    async function deleteUser(userId) {
        if (auth.currentUser && auth.currentUser.uid === userId) {
            console.warn("You cannot delete your own account.");
            return;
        }

        const userRef = doc(db, "users", userId);
        const snap = await getDoc(userRef);

        if (!snap.exists()) {
            console.warn("User not found.");
            return;
        }

        const data = snap.data();

        if (data.isAdmin) {
            console.warn("Admin accounts cannot be deleted.");
            return;
        }

        await deleteDoc(userRef);
        await fetchAllUsers();
    }

    async function updateProfileImage(newUrl) {
        if (!auth.currentUser) return;

        const userRef = doc(db, "users", auth.currentUser.uid);
        await setDoc(userRef, { profileImage: newUrl }, { merge: true });
        profileImage.value = newUrl;
    }

    async function updateMythology(newMythology) {
        if (!auth.currentUser) return;

        const userRef = doc(db, "users", auth.currentUser.uid);
        await setDoc(userRef, { selectedMythology: newMythology }, { merge: true });
        selectedMythology.value = newMythology;
    }

    return {
        fullName,
        email,
        username,
        profileImage,
        isLoggedIn,
        isGuest,
        isAdmin,
        selectedMythology,
        allUsers,
        initAuthListener,
        logout,
        continueAsGuest,
        fetchAllUsers,
        deleteUser,
        updateProfileImage,
        updateMythology,
    };
});
