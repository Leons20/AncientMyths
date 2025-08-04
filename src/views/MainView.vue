<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { useRouter, useRoute } from "vue-router";

const router = useRouter();
const route = useRoute();

const username = route.query.user;
const isGuest = route.query.guest === "true";

const searchFocused = ref(false);
const selectFocused = ref(false);

const mythDropdown = ref(null);
const mythInput = ref(null);
const mythologiesDropdown = ref(null);
const mythologyInput = ref(null);

const mythologies = [
    { name: "Egyptian", color: "text-orange-600" },
    { name: "Greek", color: "text-red-600" },
    { name: "Norse", color: "text-blue-600" },
    { name: "Hindu", color: "text-yellow-700" },
    { name: "Chinese", color: "text-gray-600" },
    { name: "Mayan", color: "text-green-600" },
];

const myths = [
    "The Contending of Horus and Seth",
    "The Story of Prometheus",
    "The Death of Baldur",
    "The Churning of the Ocean",
    "Nüwa Mends the Heavens",
    "The Hero Twins and the Lords of Xibalba",
];

const logout = () => {
    router.push("/");
};

const handleClickOutside = (event) => {
    /* prettier-ignore */
    if (mythInput.value && mythDropdown.value && !mythInput.value.contains(event.target) && !mythDropdown.value.contains(event.target)) {
        searchFocused.value = false;
    }

    /* prettier-ignore */
    if (mythologyInput.value && mythologiesDropdown.value && !mythologyInput.value.contains(event.target) && !mythologiesDropdown.value.contains(event.target)) {
        selectFocused.value = false;
    }
};

onMounted(() => {
    document.addEventListener("click", handleClickOutside);
});

onBeforeUnmount(() => {
    document.removeEventListener("click", handleClickOutside);
});
</script>

<template>
    <!-- prettier-ignore -->
    <div class="min-h-screen bg-white flex flex-col">
        <!-- Gornji border + Logout -->
        <div class="h-24 bg-orange-600 border-b-4 border-orange-700 flex justify-end items-center px-6">
            <div class="cursor-pointer" @click="logout">
                <span class="text-white text-xl font-bold font-sans">Log Out</span>
            </div>
        </div>

        <!-- Glavni sadržaj -->
        <div class="relative flex-1 overflow-auto pb-10">

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

            <!-- Središnji sadržaj -->
            <div class="mt-48 flex flex-col items-center justify-center space-y-6 w-full max-w-md mx-auto">

                <!-- Poruka dobrodošlice -->
                <h2 class="text-2xl text-center font-sans font-bold">
                    Welcome{{ !isGuest && username ? ' ' + username : '' }}!
                </h2>

                <!-- Input za mitove -->
                <div class="relative w-full">
                    <img src="/icons/search.svg" class="w-5 h-5 absolute left-3 top-3" />
                    <input
                        ref="mythInput"
                        @focus="searchFocused = true"
                        type="text"
                        placeholder="Search for myths..."
                        class="w-full pl-10 border border-gray-400 rounded px-4 py-2 font-sans"
                    />
                    <div
                        ref="mythDropdown"
                        v-if="searchFocused"
                        class="absolute mt-2 w-full bg-white border border-gray-300 rounded shadow p-2 space-y-2 z-10"
                    >
                        <div
                            v-for="(myth, index) in myths"
                            :key="index"
                            class="text-base font-sans cursor-pointer hover:underline"
                        >
                            {{ myth }}
                        </div>
                    </div>
                </div>

                <!-- Input za mitologije -->
                <div class="relative w-full">
                    <img src="/icons/select.svg" class="w-5 h-5 absolute left-3 top-3" />
                    <input
                        ref="mythologyInput"
                        @focus="selectFocused = true"
                        type="text"
                        placeholder="Select mythology..."
                        class="w-full pl-10 border border-gray-400 rounded px-4 py-2 font-sans"
                    />
                    <div
                        ref="mythologiesDropdown"
                        v-if="selectFocused"
                        class="absolute mt-2 w-full bg-white border border-gray-300 rounded shadow p-2 space-y-2 z-10"
                    >
                        <div
                            v-for="(myth, index) in mythologies"
                            :key="index"
                            :class="['text-base font-bold font-sans cursor-pointer hover:underline', myth.color]"
                        >
                            {{ myth.name }}
                        </div>
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

        <!-- Donji border -->
        <div class="h-24 bg-orange-600 border-t-4 border-orange-700"></div>
    </div>
</template>

<style scoped>
h1 {
    font-family: "Uncial Antiqua", serif;
}
</style>
