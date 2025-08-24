<script setup>
import { ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useUserStore } from "@/stores/users.js";
import { useReviewStore } from "@/stores/reviews.js";
import { db } from "@/firebase.js";
import { collection, doc, getDoc, addDoc, serverTimestamp } from "firebase/firestore";

const router = useRouter();
const route = useRoute();
const userStore = useUserStore();
const reviewStore = useReviewStore();

const reviewText = ref("");

const mythology = (route.query.mythology || "egyptian").toLowerCase();
const mythTitle = route.query.myth || "Myth";
const backPath = `/myths/${mythology}/${encodeURIComponent(mythTitle)}`;

const colors = {
    egyptian: { bg: "bg-orange-600", border: "border-orange-700", hover: "hover:bg-orange-700" },
    greek: { bg: "bg-red-600", border: "border-red-700", hover: "hover:bg-red-700" },
    norse: { bg: "bg-blue-600", border: "border-blue-700", hover: "hover:bg-blue-700" },
    hindu: { bg: "bg-yellow-700", border: "border-yellow-800", hover: "hover:bg-yellow-800" },
    chinese: { bg: "bg-gray-500", border: "border-gray-600", hover: "hover:bg-gray-600" },
    mayan: { bg: "bg-green-600", border: "border-green-700", hover: "hover:bg-green-700" },
};

const selectedColors = colors[mythology] || colors.egyptian;

const goBack = () => router.push(backPath);

const postReview = async () => {
    if (!reviewText.value.trim()) return;

    try {
        const userRef = doc(db, "users", userStore.username);
        const userSnap = await getDoc(userRef);
        const profileImage = userSnap.exists() ? userSnap.data().profileImage : "";

        await addDoc(collection(db, "reviews"), {
            mythTitle,
            mythology,
            username: userStore.username,
            fullName: userStore.fullName,
            profileImage: profileImage || "",
            text: reviewText.value,
            createdAt: serverTimestamp(),
        });

        reviewStore.addReview(backPath, userStore.username, reviewText.value, profileImage, mythology, mythTitle);

        reviewText.value = "";
        goBack();
    } catch (error) {
        console.error("Failed to post review:", error);
        alert("Failed to post review. Please try again.");
    }
};
</script>

<template>
    <!-- prettier-ignore -->
    <div class="min-h-screen bg-white flex flex-col">
        <!-- Header -->
        <div :class="['h-24 text-white px-6 py-4 flex justify-between items-center border-b-4', selectedColors.bg, selectedColors.border]">
            <h1 class="text-2xl font-bold">{{ mythologyTitle }}</h1>
            <button @click="goBack" class="flex items-center space-x-2 font-semibold">
                <img src="/icons/back.svg" class="w-10 h-10 filter invert" />
                <span class="text-xl">Back to Myth</span>
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

            <!-- Naslov mita -->
            <div class="text-center mt-20">
                <h2 class="text-3xl font-bold mb-8">{{ mythTitle }}</h2>
            </div>

            <!-- Forma za recenziju -->
            <div class="flex-1 flex flex-col justify-center items-center px-6 text-center">
                <div class="max-w-lg w-full">
                    <textarea
                        v-model="reviewText"
                        placeholder="Write your review..."
                        :class="['w-full rounded p-3 text-lg mb-6 resize-none border-2', selectedColors.border]"
                        rows="7"
                    ></textarea>
                    <button
                        @click="postReview"
                        :class="['text-white px-6 py-2 rounded font-semibold', selectedColors.bg, selectedColors.hover]"
                    >
                        Post Review
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
