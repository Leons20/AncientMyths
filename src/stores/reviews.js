import { ref } from "vue";
import { defineStore } from "pinia";
import { db } from "@/firebase.js";
import { collection, doc, addDoc, deleteDoc, query, where, getDocs, serverTimestamp } from "firebase/firestore";

export const useReviewStore = defineStore("review", () => {
    const reviews = ref({});

    function formatDate(timestamp) {
        if (!timestamp) return "";
        const date = timestamp.toDate();
        const day = date.getDate();
        const month = date.toLocaleString("en-US", { month: "short" });
        return `${day} ${month}`;
    }

    async function fetchReviews(path, mythology, mythTitle) {
        const reviewsRef = collection(db, "reviews");
        const q = query(
            reviewsRef,
            where("mythology", "==", mythology.toLowerCase()),
            where("mythTitle", "==", mythTitle),
        );

        const snapshot = await getDocs(q);
        const seen = {};
        const uniqueReviews = [];

        snapshot.docs.forEach((docSnap) => {
            const data = docSnap.data();
            const key = (data.username || "") + (data.text || "");
            if (!seen[key]) {
                seen[key] = true;
                uniqueReviews.push({
                    id: docSnap.id,
                    username: data.username || "",
                    text: data.text || "",
                    profileImage: data.profileImage || "/icons/user.svg",
                    mythology: data.mythology || "",
                    mythTitle: data.mythTitle || "",
                    date: data.createdAt ? formatDate(data.createdAt) : "",
                });
            }
        });

        reviews.value[path] = uniqueReviews;
    }

    async function addReview(path, username, text, profileImage, mythology, mythTitle) {
        await addDoc(collection(db, "reviews"), {
            username,
            text,
            profileImage: profileImage || "/icons/user.svg",
            mythology: mythology.toLowerCase(),
            mythTitle,
            createdAt: serverTimestamp(),
        });
    }

    async function deleteReview(reviewId, path, index) {
        await deleteDoc(doc(db, "reviews", reviewId));
        if (reviews.value[path]) {
            reviews.value[path].splice(index, 1);
        }
    }

    function getReviews(path) {
        return reviews.value[path] || [];
    }

    function setReviews(path, newReviews) {
        reviews.value[path] = newReviews.map((review) => ({
            id: review.id,
            username: review.username || "",
            text: review.text || "",
            profileImage: review.profileImage || "/icons/user.svg",
            mythology: review.mythology || "",
            mythTitle: review.mythTitle || "",
            date: review.date || "",
        }));
    }

    return {
        reviews,
        fetchReviews,
        addReview,
        deleteReview,
        getReviews,
        setReviews,
    };
});
