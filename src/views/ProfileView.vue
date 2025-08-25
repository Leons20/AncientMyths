<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "@/stores/users.js";

const router = useRouter();
const userStore = useUserStore();

const fullName = ref(userStore.fullName);
const email = ref(userStore.email);
const username = ref(userStore.username);
const selectedMythology = ref(userStore.selectedMythology);

const originalUsername = ref(userStore.username);

const mythologyInputFocused = ref(false);
const mythologyInput = ref(null);
const mythologiesDropdown = ref(null);

const mythologies = [
    { name: "Egyptian", color: "text-orange-600" },
    { name: "Greek", color: "text-red-600" },
    { name: "Norse", color: "text-blue-600" },
    { name: "Hindu", color: "text-yellow-700" },
    { name: "Chinese", color: "text-gray-600" },
    { name: "Mayan", color: "text-green-600" },
];

const selectedMythologyObj = computed(() => mythologies.find((m) => m.name === selectedMythology.value));

const goToSettings = () => {
    router.push({ path: "/settings", query: { user: username.value } });
};

const previewImage = computed({
    get: () => userStore.profileImage,
    set: (val) => {
        userStore.profileImage = val;
    },
});

const onFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
        const newImage = e.target.result;
        previewImage.value = newImage;
        await userStore.updateProfileImage(newImage);
    };
    reader.readAsDataURL(file);
};

const saveChanges = async () => {
    userStore.fullName = fullName.value;
    userStore.email = email.value;
    userStore.username = username.value;

    await userStore.updateMythology(selectedMythology.value);

    if (previewImage.value) {
        await userStore.updateProfileImage(previewImage.value);
    }

    if (originalUsername.value !== username.value) {
        originalUsername.value = username.value;
    }

    goToSettings();
};

const handleClickOutside = (event) => {
    if (
        mythologyInput.value &&
        mythologiesDropdown.value &&
        !mythologyInput.value.contains(event.target) &&
        !mythologiesDropdown.value.contains(event.target)
    ) {
        mythologyInputFocused.value = false;
    }
};

onMounted(() => {
    document.addEventListener("click", handleClickOutside);
    fullName.value = userStore.fullName;
    email.value = userStore.email;
    username.value = userStore.username;
    selectedMythology.value = userStore.selectedMythology;
});

onBeforeUnmount(() => {
    document.removeEventListener("click", handleClickOutside);
});
</script>

<template>
    <!-- prettier-ignore -->
    <div class="min-h-screen bg-white flex flex-col">
        <!-- Header -->
        <div class="h-24 bg-orange-600 border-b-4 border-orange-700 flex justify-end items-center px-6">
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
            <div class="flex-1 flex flex-col items-center relative pt-12">
                <div class="w-full max-w-md px-4 space-y-3">

                    <h2 class="text-2xl font-bold font-sans text-center mb-2">Profile</h2>

                    <!-- Ikone korisnika i kamere -->
                    <div class="flex justify-center py-2">
                        <div class="relative w-32 h-32">
                            <!-- Profilna slika ili default ikona -->
                            <div class="w-full h-full border-2 border-gray-400 rounded-full flex items-center justify-center overflow-hidden">
                                <img
                                    :src="previewImage || '/icons/user.svg'"
                                    class="w-full h-full object-cover"
                                />
                            </div>

                            <!-- Ikona kamere -->
                            <label
                                class="absolute bottom-0 right-0 translate-x-1/4 translate-y-1/4 w-12 h-12 border-2 
                                border-gray-400 rounded-full flex items-center justify-center bg-white cursor-pointer"
                            >
                                <img src="/icons/camera.svg" class="w-6 h-6" />
                                <input type="file" accept="image/*" @change="onFileChange" class="hidden" />
                            </label>
                        </div>
                    </div>

                    <!-- Input polja -->
                    <input v-model="fullName" type="text" placeholder="Full Name" class="w-full border border-gray-400 rounded px-3 py-2 font-sans" />
                    <input v-model="email" type="email" placeholder="Email" class="w-full border border-gray-400 rounded px-3 py-2 font-sans" />
                    <input v-model="username" type="text" placeholder="Username" class="w-full border border-gray-400 rounded px-3 py-2 font-sans" />

                    <!-- Input za mitologiju -->
                    <div class="relative w-full">
                        <img src="/icons/select.svg" class="w-5 h-5 absolute left-3 top-3" />
                        <input
                            ref="mythologyInput"
                            @focus="mythologyInputFocused = true"
                            type="text"
                            v-model="selectedMythology"
                            placeholder="Select preferred mythology..."
                            :class="[
                                'w-full pl-10 border border-gray-400 rounded px-4 py-2 font-sans font-bold',
                                selectedMythologyObj?.color
                            ]"
                        />
                        <div
                            ref="mythologiesDropdown"
                            v-if="mythologyInputFocused"
                            class="absolute mt-2 w-full bg-white border border-gray-300 rounded shadow p-2 space-y-2 z-10"
                        >
                            <div
                                v-for="(myth, index) in mythologies"
                                :key="index"
                                @click="selectedMythology = myth.name; mythologyInputFocused = false"
                                :class="['cursor-pointer hover:underline font-sans text-base font-bold', myth.color]"
                            >
                                {{ myth.name }}
                            </div>
                        </div>
                    </div>

                    <!-- Gumb -->
                    <button
                        @click="saveChanges"
                        class="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded font-bold font-sans w-full"
                    >
                        Save Changes
                    </button>

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
