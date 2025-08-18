<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "@/stores/users.js";

const router = useRouter();
const userStore = useUserStore();

const users = ref([]);
const selectedUser = ref(null);
const successMessage = ref("");

onMounted(() => {
    users.value = userStore.allUsers.map((user) => ({
        fullName: user.fullName,
        email: user.email,
        username: user.username,
        password: user.password,
        isCurrent: user.email === userStore.email,
    }));
});

const goToSettings = () => {
    router.push({ path: "/settings", query: { user: userStore.username } });
};

const selectUser = (user) => {
    selectedUser.value = selectedUser.value?.email === user.email ? null : user;
};

const deleteUser = () => {
    if (!selectedUser.value) return;

    userStore.deleteUser(selectedUser.value.email);

    users.value = userStore.allUsers.map((user) => ({
        fullName: user.fullName,
        email: user.email,
        username: user.username,
        password: user.password,
        isCurrent: user.email === userStore.email,
    }));

    selectedUser.value = null;
    successMessage.value = "Account successfully deleted";
};
</script>

<template>
    <!-- prettier-ignore -->
    <div class="min-h-screen bg-white flex flex-col">
        <!-- Header -->
        <div class="h-24 bg-orange-600 text-white px-6 py-4 flex justify-between items-center border-b-4 border-orange-700">
            <h1 class="text-2xl font-bold">Account Management</h1>
            <div class="cursor-pointer p-2" @click="goToSettings">
                <img src="/icons/settings.svg" class="h-16 w-16 filter invert" />
            </div>
        </div>

        <!-- Sadržaj -->
        <div class="flex-1 flex flex-col items-center justify-center relative">

            <!-- Gornje ikone -->
            <div class="absolute top-10 w-full flex justify-between items-center px-6">
                <!-- Lijeve ikone -->
                <div class="flex gap-x-8">
                    <img src="/icons/spartan.svg" class="h-28" />
                    <img src="/icons/temple.svg" class="h-28 ml-24" />
                </div>

                <!-- Desne ikone -->
                <div class="flex gap-x-8">
                    <img src="/icons/greek-temple.svg" class="h-28 mr-24" />
                    <img src="/icons/pyramid.svg" class="h-28" />
                </div>
            </div>

            <!-- Središnji sadržaj -->
            <div class="flex-1 flex flex-col items-center relative pt-20">
                <div class="w-full max-w-md px-4 flex flex-col justify-between h-full">

                    <!-- Input polja mailova -->
                    <div class="space-y-3">
                        <h2 class="text-3xl font-bold font-sans text-center mb-30">Accounts</h2>

                        <!-- Lista korisnika -->
                        <div class="max-h-40 overflow-y-auto pr-1 space-y-2">
                            <div v-for="user in users" :key="user.email" class="w-full">
                                <input
                                    type="text"
                                    :value="user.email + (user.isCurrent ? ' (you)' : '')"
                                    readonly
                                    :disabled="user.isCurrent"
                                    class="w-full border rounded px-3 py-2 font-sans"
                                    :class="{
                                        'cursor-pointer': !user.isCurrent,
                                        'border-red-500 bg-red-200': selectedUser?.email === user.email && !user.isCurrent,
                                        'bg-gray-200 text-gray-500 cursor-not-allowed': user.isCurrent
                                    }"
                                    @click="!user.isCurrent && selectUser(user)"
                                />
                            </div>
                        </div>
                    </div>

                    <!-- Gumbi -->
                    <div class="mt-30 space-y-2">
                        <!-- Gumb Delete -->
                        <button
                            @click="deleteUser"
                            :disabled="!selectedUser"
                            :class="[
                                'px-4 py-2 rounded font-bold font-sans w-full',
                                selectedUser ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-red-400 text-white cursor-not-allowed'
                            ]"
                        >
                            Delete Account
                        </button>

                        <!-- Gumb Back -->
                        <button
                            @click="goToSettings"
                            class="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded font-bold font-sans w-full"
                        >
                            Back to Settings
                        </button>

                        <p v-if="successMessage" class="success-message text-red-600 flex flex-col items-center font-bold mt-4">
                            {{ successMessage }}
                        </p>
                    </div>

                </div>
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
* {
    font-family: sans-serif;
}
</style>
