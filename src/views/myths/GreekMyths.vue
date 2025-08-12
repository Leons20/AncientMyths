<script setup>
import { computed } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "@/stores/users.js";
import { useMythStore } from "@/stores/myths.js";
import { useReviewStore } from "@/stores/reviews.js";

const router = useRouter();
const userStore = useUserStore();
const mythStore = useMythStore();
const reviewStore = useReviewStore();

const mythologyKey = "Greek";
const myth = mythStore.myths[mythologyKey][0];

const isGuest = computed(() => userStore.isGuest);

const goBackToMain = () => {
    if (isGuest.value) {
        router.push({ path: "/main", query: { guest: "true" } });
    } else {
        router.push("/main");
    }
};

const goToReview = () => {
    const query = {
        from: `/myths/${mythologyKey.toLowerCase()}`,
        mythology: mythologyKey,
        myth: myth.title,
    };

    if (isGuest.value) {
        query.guest = "true";
    }

    router.push({
        path: "/review",
        query: query,
    });
};
</script>

<template>
    <!-- prettier-ignore -->
    <div class="min-h-screen bg-white flex flex-col">
        <!-- Header -->
        <div class="h-24 bg-red-600 text-white px-6 py-4 flex justify-between items-center border-b-4 border-red-700">
            <h1 class="text-2xl font-bold">{{ mythologyKey }} myths</h1>
            <button @click="goBackToMain" class="flex items-center space-x-2 font-semibold">
                <img src="/icons/back.svg" class="w-10 h-10 filter invert" />
                <span class="text-xl">Back to Main</span>
            </button>
        </div>

        <!-- Sadržaj -->
        <div class="flex-1 flex flex-col justify-start items-center px-6 py-10 text-center mt-10 relative">
            <div class="max-w-3xl">
                <!-- Slika mita -->
                <div class="flex items-center justify-center mb-4 relative">
                    <img :src="myth.image" class="w-128 h-96 object-cover rounded shadow-lg absolute left-[-550px] top-0"/>
                    <h2 class="text-3xl font-bold">{{ myth.title }}</h2>
                </div>

                <!-- Tekst mita -->
                <p class="text-xl font-semibold mb-4">{{ myth.myth }}</p>

                <!-- Poveznica na cijeli mit -->
                <a :href="myth.link" target="_blank" class="text-red-700 underline font-semibold mb-6 inline-block">
                    Read more...
                </a>

                <h3 class="text-2xl font-bold mb-2">Interpretation</h3>
                <p class="text-xl font-semibold mb-6">{{ myth.interpretation }}</p>

                <!-- Gumb za recenziju -->
                <button
                    v-if="userStore.isLoggedIn"
                    @click="goToReview"
                    class="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded font-semibold"
                >
                    Write a Review
                </button>
            </div>
        </div>

        <!-- Recenzije -->
        <div class="max-h-48 overflow-y-auto border-t border-gray-300 px-6 py-4">
            <h3 class="text-xl font-bold mb-3">Reviews</h3>
            <div v-if="reviewStore.getReviews(`/myths/${mythologyKey.toLowerCase()}`).length" class="space-y-4">
                <div
                    v-for="(review, index) in reviewStore.getReviews(`/myths/${mythologyKey.toLowerCase()}`)"
                    :key="index"
                    class="bg-gray-100 p-3 rounded shadow"
                >
                    <div class="flex items-center mb-2 text-gray-700">
                        <img src="/icons/user.svg" class="w-5 h-5 mr-0.5" />
                        <span class="font-semibold">{{ review.username }}</span>
                        <span class="mx-1">•</span>
                        <span class="text-sm text-gray-500 font-semibold">{{ review.date }}</span>
                    </div>
                    <p class="text-lg font-semibold">{{ review.text }}</p>
                </div>
            </div>
            <div v-else class="text-gray-500 italic">No reviews yet.</div>
        </div>

        <!-- Footer -->
        <div class="h-24 bg-red-600 border-t-4 border-red-700"></div>
    </div>
</template>

<style scoped>
* {
    font-family: sans-serif;
}
</style>
