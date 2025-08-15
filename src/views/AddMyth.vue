<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import { useRouter } from "vue-router";
import { useMythStore } from "@/stores/myths.js";

const router = useRouter();
const mythStore = useMythStore();

const mythology = ref("Egyptian");
const title = ref("");
const mythText = ref("");
const interpretation = ref("");
const image = ref("");
const link = ref("");

const selectFocused = ref(false);

const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

const colors = {
    egyptian: { bg: "bg-orange-600", border: "border-orange-700", hover: "hover:bg-orange-700" },
    greek: { bg: "bg-red-600", border: "border-red-700", hover: "hover:bg-red-700" },
    norse: { bg: "bg-blue-600", border: "border-blue-700", hover: "hover:bg-blue-700" },
    hindu: { bg: "bg-yellow-700", border: "border-yellow-800", hover: "hover:bg-yellow-800" },
    chinese: { bg: "bg-gray-500", border: "border-gray-600", hover: "hover:bg-gray-600" },
    mayan: { bg: "bg-green-600", border: "border-green-700", hover: "hover:bg-green-700" },
};

const selectedColors = computed(() => colors[mythology.value.toLowerCase()] || colors.egyptian);
const selectedTextColor = computed(() => selectedColors.value.bg.replace("bg", "text"));

const goBackToMain = () => {
    router.push("/main");
};

const saveMyth = () => {
    const missingFields = [];

    if (!mythology.value.trim()) missingFields.push("Mythology");
    if (!title.value.trim()) missingFields.push("Title");
    if (!mythText.value.trim()) missingFields.push("Myth text");
    if (!interpretation.value.trim()) missingFields.push("Interpretation");
    if (!image.value.trim()) missingFields.push("Image URL");
    if (!link.value.trim()) missingFields.push("Full myth link");

    if (missingFields.length > 0) {
        alert(`Please fill in the following fields:\n- ${missingFields.join("\n- ")}`);
        return;
    }

    mythStore.addMyth(mythology.value, {
        title: title.value,
        mythText: mythText.value,
        interpretation: interpretation.value,
        image: image.value,
        link: link.value,
    });

    router.push("/main");
};

const handleClickOutside = (event) => {
    if (!event.target.closest(".mythology-select")) {
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
        <!-- Header -->
        <div :class="['h-24 text-white px-6 py-4 flex justify-between items-center border-b-4', selectedColors.bg, selectedColors.border]">
            <h1 class="text-2xl font-bold">Add a Myth</h1>
            <button @click="goBackToMain" class="flex items-center space-x-2 font-semibold">
                <img src="/icons/back.svg" class="w-10 h-10 filter invert" />
                <span class="text-xl">Back to Main</span>
            </button>
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

            <!-- Forma -->
            <div class="flex-1 flex flex-col justify-center items-center pb-15 px-6">
                <div class="max-w-lg w-full">
                    <!-- Dropdown za mitologiju -->
                    <div class="relative w-full mb-4 mythology-select">
                        <img src="/icons/select.svg" class="w-5 h-5 absolute left-3 top-3" />
                        <input
                            v-model="mythology"
                            @focus="selectFocused = true"
                            type="text"
                            placeholder="Select mythology..."
                            :class="['w-full pl-10 border-2 rounded px-4 py-2 font-sans font-bold', selectedColors.border, selectedTextColor]"
                        />
                        <div v-if="selectFocused" class="absolute mt-2 w-full bg-white border border-gray-300 rounded shadow p-2 space-y-2 z-10">
                            <div
                                v-for="(color, name) in colors"
                                :key="name"
                                :class="['text-base font-bold font-sans cursor-pointer hover:underline', color.bg.replace('bg', 'text')]"
                                @click="mythology = capitalize(name); selectFocused = false"
                            >
                                {{ capitalize(name) }}
                            </div>
                        </div>
                    </div>

                    <!-- Naslov -->
                    <input v-model="title" placeholder="Myth title" :class="['w-full rounded p-3 text-lg mb-4 border-2', selectedColors.border]" />

                    <!-- Tekst mita -->
                    <textarea
                        v-model="mythText"
                        placeholder="Myth text..."
                        :class="['w-full rounded p-3 text-lg mb-4 resize-none border-2', selectedColors.border]"
                        rows="2"
                    ></textarea>

                    <!-- Interpretacija -->
                    <textarea
                        v-model="interpretation"
                        placeholder="Interpretation..."
                        :class="['w-full rounded p-3 text-lg mb-4 resize-none border-2', selectedColors.border]"
                        rows="2"
                    ></textarea>

                    <!-- Slika -->
                    <input v-model="image" placeholder="Image URL" :class="['w-full rounded p-3 text-lg mb-4 border-2', selectedColors.border]" />

                    <!-- Link -->
                    <input v-model="link" placeholder="Full myth link" :class="['w-full rounded p-3 text-lg mb-4 border-2', selectedColors.border]" />

                    <button
                        @click="saveMyth"
                        :class="['text-white px-6 py-2 rounded font-semibold w-full', selectedColors.bg, selectedColors.hover]"
                    >
                        Save Myth
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
        <div :class="['h-24 border-t-4', selectedColors.bg, selectedColors.border]"></div>
    </div>
</template>

<style scoped>
* {
    font-family: sans-serif;
}
</style>
