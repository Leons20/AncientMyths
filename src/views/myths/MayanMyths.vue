<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useUserStore } from "@/stores/users.js";
import { useMythStore } from "@/stores/myths.js";
import { useReviewStore } from "@/stores/reviews.js";
import { db } from "@/firebase.js";
import { collection, query, doc, getDocs, deleteDoc, where, onSnapshot } from "firebase/firestore";

const router = useRouter();
const route = useRoute();
const userStore = useUserStore();
const mythStore = useMythStore();
const reviewStore = useReviewStore();

const mythologyKey = "Mayan";

const mythsArray = computed(() => mythStore.myths[mythologyKey] || []);

const currentMyth = ref(null);

const mythIndex = computed(() => mythsArray.value.findIndex((m) => m.title === currentMyth.value?.title));

const reviewPath = computed(
    () => `/myths/${mythologyKey.toLowerCase()}/${encodeURIComponent(currentMyth.value?.title || "")}`,
);

let unsubscribe = null;

function getUserProfileImage(username) {
    const user = userStore.allUsers.find((u) => u.username === username);
    return user?.profileImage || "/icons/user.svg";
}

function attachReviewListener() {
    if (!currentMyth.value) {
        reviewStore.setReviews(reviewPath.value, []);
        return;
    }

    if (unsubscribe) unsubscribe();

    const reviewsRef = collection(db, "reviews");
    const q = query(
        reviewsRef,
        where("mythTitle", "==", currentMyth.value.title),
        where("mythology", "==", mythologyKey.toLowerCase()),
    );

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    unsubscribe = onSnapshot(q, (snapshot) => {
        const seen = {};
        const fetchedReviews = [];

        snapshot.docs.forEach((doc) => {
            const data = doc.data();

            let formattedDate = "";
            if (data.createdAt) {
                const d = data.createdAt.toDate();
                formattedDate = d.getDate() + " " + monthNames[d.getMonth()];
            }

            const username = data.username || "";
            const text = data.text || "";
            const key = username + text;

            if (!seen[key]) {
                seen[key] = true;

                fetchedReviews.push({
                    id: doc.id,
                    username: username,
                    text: text,
                    mythology: data.mythology || "",
                    mythTitle: data.mythTitle || "",
                    date: formattedDate,
                });
            }
        });

        reviewStore.setReviews(reviewPath.value, fetchedReviews);
    });
}

onMounted(async () => {
    await userStore.fetchAllUsers();

    if (!mythsArray.value.length) {
        currentMyth.value = null;
    } else if (!route.params.title) {
        currentMyth.value = mythsArray.value[0];
    } else {
        const decodedTitle = decodeURIComponent(route.params.title).trim().toLowerCase();
        currentMyth.value = mythsArray.value.find((m) => m.title.trim().toLowerCase() === decodedTitle) || null;
    }

    attachReviewListener();
});

onUnmounted(() => {
    if (unsubscribe) unsubscribe();
});

const goBackToMain = () => {
    router.push("/main");
};

const goToReview = () => {
    if (!currentMyth.value) return;

    router.push({
        path: "/review",
        query: {
            from: `/myths/${mythologyKey.toLowerCase()}/${encodeURIComponent(currentMyth.value.title)}`,
            mythology: mythologyKey,
            myth: currentMyth.value.title,
        },
    });
};

const isDefaultMyth = (index) => {
    return index === 0;
};

const deleteMyth = async () => {
    if (!currentMyth.value) return;

    const mythId = currentMyth.value.id;
    if (!mythId) {
        console.warn("Cannot delete myth: no ID available");
        return;
    }

    const reviewsRef = collection(db, "reviews");
    const q = query(
        reviewsRef,
        where("mythTitle", "==", currentMyth.value.title),
        where("mythology", "==", mythologyKey.toLowerCase()),
    );

    const snapshot = await getDocs(q);
    const deletePromises = snapshot.docs.map((docSnap) => deleteDoc(doc(db, "reviews", docSnap.id)));
    await Promise.all(deletePromises);

    await mythStore.deleteMyth(mythologyKey, mythId);

    currentMyth.value = null;
    reviewStore.setReviews(reviewPath.value, []);
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
                <div v-if="currentMyth">
                    <!-- Naslov i slika mita -->
                    <div class="flex items-center justify-center mb-4 relative">
                        <img :src="currentMyth.image" class="w-128 h-96 object-cover rounded shadow-lg absolute left-[-550px] top-0"/>
                        <h2 class="text-3xl font-bold">{{ currentMyth.title }}</h2>
                    </div>

                    <!-- Tekst mita -->
                    <p class="text-xl font-semibold mb-4">{{ currentMyth.mythText }}</p>

                    <!-- Poveznica na cijeli mit -->
                    <a :href="currentMyth.link" target="_blank" class="text-green-700 underline font-semibold mb-6 inline-block">
                        Read more...
                    </a>

                    <!-- Interpretacija mita -->
                    <h3 class="text-2xl font-bold mb-2">Interpretation</h3>
                    <p class="text-xl font-semibold mb-6">{{ currentMyth.interpretation }}</p>

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
                            v-if="userStore.isAdmin && !isDefaultMyth(mythIndex)"
                            @click="deleteMyth"
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
                v-if="reviewStore.getReviews(reviewPath).length"
                class="space-y-4"
            >
                <div
                    v-for="(review, index) in reviewStore.getReviews(reviewPath)"
                    :key="review.id"
                    class="flex items-start gap-3 bg-gray-100 p-3 rounded shadow"
                >
                    <!-- Delete gumb -->
                    <button
                        v-if="userStore.isAdmin"
                        @click="reviewStore.deleteReview(review.id, reviewPath, index)"
                        class="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm font-bold"
                    >
                        Delete
                    </button>

                    <!-- Sadržaj recenzije -->
                    <div class="flex-1">
                        <div class="flex items-center mb-2 text-gray-700">
                            <img
                                :src="getUserProfileImage(review.username)"
                                class="w-6 h-6 rounded-full mr-2 object-cover"
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
