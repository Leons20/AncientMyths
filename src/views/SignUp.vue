<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { auth, db } from "@/firebase.js";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, getDocs, collection, query, where } from "firebase/firestore";

const fullName = ref("");
const email = ref("");
const username = ref("");
const password = ref("");
const successMessage = ref("");
const errorMessages = ref([]);

const router = useRouter();

const isFormValid = computed(() => {
    return fullName.value && email.value && username.value && password.value;
});

async function createAccount() {
    errorMessages.value = [];

    if (!email.value.includes("@")) {
        errorMessages.value.push("Invalid email address.");
    }

    try {
        const usersCollection = collection(db, "users");
        const q = query(usersCollection, where("username", "==", username.value));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
            errorMessages.value.push("Username already taken.");
        }
    } catch (e) {
        console.error("Error checking username:", e);
        errorMessages.value.push("Could not verify username uniqueness.");
    }

    if (password.value.length < 6) {
        errorMessages.value.push("Password should be at least 6 characters.");
    }

    if (errorMessages.value.length === 0) {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email.value, password.value);
            const user = userCredential.user;

            await setDoc(doc(db, "users", user.uid), {
                fullName: fullName.value,
                email: email.value,
                username: username.value,
                createdAt: new Date(),
            });

            successMessage.value = "Account successfully created";
            setTimeout(() => {
                router.push("/signin");
            }, 2000);
        } catch (error) {
            if (error.code === "auth/email-already-in-use") {
                errorMessages.value.push("This email is already in use.");
            }
            if (!["auth/email-already-in-use"].includes(error.code)) {
                errorMessages.value.push(error.message);
            }
        }
    }
}
</script>

<template>
    <!-- prettier-ignore -->
    <div class="min-h-screen bg-white flex flex-col">
        <!-- Header -->
        <div class="h-24 bg-orange-600 border-b-4 border-orange-700"></div>

        <!-- Sadržaj -->
        <div class="flex-1 flex items-center justify-center relative overflow-hidden">

            <!-- Gornje ikone + Naslov -->
            <div class="absolute top-10 w-full flex justify-between items-center px-6">
                <!-- Lijeve ikone -->
                <div class="flex gap-x-8">
                    <img src="/icons/spartan.svg" class="h-28" />
                    <img src="/icons/temple.svg" class="h-28 ml-24" />
                </div>

                <!-- Naslov -->
                <h1 class="text-5xl text-orange-600 font-[Uncial Antiqua] text-center">AncientMyths</h1>

                <!-- Desne ikone -->
                <div class="flex gap-x-8">
                    <img src="/icons/greek-temple.svg" class="h-28 mr-24" />
                    <img src="/icons/pyramid.svg" class="h-28" />
                </div>
            </div>

            <!-- Forma za registraciju -->
            <div class="w-full max-w-xs flex flex-col items-center space-y-3">
                <input v-model="fullName" type="text" placeholder="Full Name" class="w-full border border-gray-400 rounded px-3 py-2" />
                <input v-model="email" type="email" placeholder="Email" class="w-full border border-gray-400 rounded px-3 py-2" />
                <input v-model="username" type="text" placeholder="Username" class="w-full border border-gray-400 rounded px-3 py-2" />
                <input v-model="password" type="password" placeholder="Password" class="w-full border border-gray-400 rounded px-3 py-2" />

                <button
                    @click="createAccount"
                    :disabled="!isFormValid"
                    :class="[
                        'w-full text-white font-bold font-sans py-2 rounded',
                        isFormValid ? 'bg-orange-600 hover:bg-orange-700 cursor-pointer' : 'bg-gray-400 cursor-not-allowed'
                    ]"
                >
                    Create Account
                </button>

                <div v-if="errorMessages.length" class="mt-4 text-red-600 font-bold flex flex-col items-center space-y-1">
                    <p v-for="(msg, index) in errorMessages" :key="index" class="error-message text-center">
                        {{ msg }}
                    </p>
                </div>

                <p v-if="successMessage" class="success-message text-green-600 font-bold mt-4">
                    {{ successMessage }}
                </p>
            </div>

            <!-- Donje ikone -->
            <div class="absolute bottom-8 w-full flex justify-between items-center px-6">
                <!-- Lijeve ikone -->
                <div class="flex gap-x-8">
                    <img src="/icons/buddha.svg" class="h-28" />
                    <img src="/icons/hieroglyph.svg" class="h-28 ml-24" />
                </div>

                <!-- Desne ikone -->
                <div class="flex gap-x-8">
                    <img src="/icons/vase.svg" class="h-28 mr-24" />
                    <img src="/icons/sphinx.svg" class="h-28" />
                </div>
            </div>
            
        </div>

        <!-- Footer -->
        <div class="h-24 bg-orange-600 border-t-4 border-orange-700"></div>
    </div>
</template>

<style scoped>
h1 {
    font-family: "Uncial Antiqua", serif;
}
input,
.success-message,
.error-message {
    font-family: sans-serif;
}
</style>
