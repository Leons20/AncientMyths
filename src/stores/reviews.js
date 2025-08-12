import { ref } from "vue";
import { defineStore } from "pinia";

export const useReviewStore = defineStore("review", () => {
    const reviews = ref({});

    function addReview(path, username, text) {
        const date = new Date();
        const formattedDate = date.toLocaleString("en-GB", { day: "2-digit", month: "short" });

        if (!reviews.value[path]) {
            reviews.value[path] = [];
        }
        reviews.value[path].push({
            username,
            date: formattedDate,
            text,
        });
    }

    function getReviews(path) {
        return reviews.value[path] || [];
    }

    return { reviews, addReview, getReviews };
});
