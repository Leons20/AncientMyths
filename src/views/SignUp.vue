<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "@/stores/users.js";

const fullName = ref("");
const email = ref("");
const username = ref("");
const password = ref("");
const successMessage = ref("");

const router = useRouter();
const userStore = useUserStore();

const isFormValid = computed(() => {
    return fullName.value && email.value && username.value && password.value;
});

function createAccount() {
    userStore.register({
        fullName: fullName.value,
        email: email.value,
        username: username.value,
        password: password.value,
    });

    successMessage.value = "Account successfully created";

    setTimeout(() => {
        router.push("/signin");
    }, 2000);
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
.success-message {
    font-family: sans-serif;
}
</style>
