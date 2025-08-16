<script setup>
import { computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useUserStore } from "@/stores/users.js";
import { useMythStore } from "@/stores/myths.js";
import { useReviewStore } from "@/stores/reviews.js";

const router = useRouter();
const route = useRoute();
const userStore = useUserStore();
const mythStore = useMythStore();
const reviewStore = useReviewStore();

const mythologyKey = "Mayan";

const mythsArray = computed(() => mythStore.myths[mythologyKey] || []);

const myth = computed(() => {
    if (!mythsArray.value.length) return null;

    if (!route.params.title) return mythsArray.value[0];

    const decodedTitle = decodeURIComponent(route.params.title).trim().toLowerCase();
    return mythsArray.value.find((m) => m.title.trim().toLowerCase() === decodedTitle) || null;
});

const isGuest = computed(() => userStore.isGuest);

const goBackToMain = () => {
    if (isGuest.value) {
        router.push({ path: "/main", query: { guest: "true" } });
    } else {
        router.push("/main");
    }
};

const goToReview = () => {
    if (!myth.value) return;

    const query = {
        from: `/myths/${mythologyKey.toLowerCase()}/${encodeURIComponent(myth.value.title)}`,
        mythology: mythologyKey,
        myth: myth.value.title,
    };

    if (isGuest.value) query.guest = "true";

    router.push({ path: "/review", query });
};

const deleteReview = (index) => {
    const path = `/myths/${mythologyKey.toLowerCase()}/${encodeURIComponent(myth.value?.title || "")}`;
    reviewStore.deleteReview(path, index);
};
</script>

<template>
    <!-- prettier-ignore -->
    <div class="h-screen flex flex-col bg-white">
        <!-- Header -->
        <div class="h-24 bg-green-600 text-white px-6 py-4 flex justify-between items-center border-b-4 border-green-700">
            <h1 class="text-2xl font-bold">{{ mythologyKey }} myths</h1>
            <button @click="goBackToMain" class="flex items-center space-x-2 font-semibold">
                <img src="/icons/back.svg" class="w-10 h-10 filter invert" />
                <span class="text-xl">Back to Main</span>
            </button>
        </div>

        <!-- Sadržaj -->
        <div class="flex-1 overflow-y-auto px-6 py-6 text-center">
            <div class="max-w-3xl mx-auto">
                <div v-if="myth">
                    <!-- Naslov i slika mita -->
                    <div class="flex items-center justify-center mb-4 relative">
                        <img :src="myth.image" class="w-128 h-96 object-cover rounded shadow-lg absolute left-[-550px] top-0"/>
                        <h2 class="text-3xl font-bold">{{ myth.title }}</h2>
                    </div>

                    <!-- Tekst mita -->
                    <p class="text-xl font-semibold mb-4">{{ myth.mythText }}</p>

                    <!-- Poveznica na cijeli mit -->
                    <a :href="myth.link" target="_blank" class="text-green-700 underline font-semibold mb-6 inline-block">
                        Read more...
                    </a>

                    <!-- Interpretacija mita -->
                    <h3 class="text-2xl font-bold mb-2">Interpretation</h3>
                    <p class="text-xl font-semibold mb-6">{{ myth.interpretation }}</p>

                    <!-- Gumbi -->
                    <div class="flex justify-center gap-4 mt-4">
                        <button
                            v-if="userStore.isLoggedIn"
                            @click="goToReview"
                            class="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded font-semibold"
                        >
                            Write a Review
                        </button>

                        <button
                            v-if="userStore.isAdmin"
                            @click="mythStore.deleteMyth(mythologyKey, mythsArray.findIndex(m => m.title === myth.title))"
                            class="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded font-semibold"
                        >
                            Delete Myth
                        </button>
                    </div>
                </div>
                <div v-else class="text-green-600 text-3xl font-bold mt-10">Myth not found.</div>
            </div>
        </div>

        <!-- Recenzije -->
        <div class="flex-[0_0_20%] overflow-y-auto border-t border-gray-300 px-6 py-4">
            <h3 class="text-xl font-bold mb-3">Reviews</h3>
            <div
                v-if="reviewStore.getReviews(`/myths/${mythologyKey.toLowerCase()}/${encodeURIComponent(myth?.title || '')}`).length"
                class="space-y-4"
            >
                <div
                    v-for="(review, index) in reviewStore.getReviews(`/myths/${mythologyKey.toLowerCase()}/${encodeURIComponent(myth?.title || '')}`)"
                    :key="index"
                    class="flex items-start gap-3 bg-gray-100 p-3 rounded shadow"
                >
                    <!-- Delete gumb -->
                    <button
                        v-if="userStore.isAdmin"
                        @click="deleteReview(index)"
                        class="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm font-bold"
                    >
                        Delete
                    </button>

                    <!-- Sadržaj recenzije -->
                    <div class="flex-1">
                        <div class="flex items-center mb-2 text-gray-700">
                            <img 
                                v-if="review.profileImage" 
                                :src="review.profileImage" 
                                class="w-6 h-6 rounded-full mr-2 object-cover" 
                            />
                            <img 
                                v-else 
                                src="/icons/user.svg" 
                                class="w-5 h-5 mr-2" 
                            />
                            <span class="font-semibold">{{ review.username }}</span>
                            <span class="mx-1">•</span>
                            <span class="text-sm text-gray-500 font-semibold">{{ review.date }}</span>
                        </div>
                        <p class="text-lg font-semibold">{{ review.text }}</p>
                    </div>
                </div>
            </div>
            <div v-else class="text-gray-500 italic">No reviews yet.</div>
        </div>

        <!-- Footer -->
        <div class="h-24 bg-green-600 border-t-4 border-green-700"></div>
    </div>
</template>

<style scoped>
* {
    font-family: sans-serif;
}
</style>
