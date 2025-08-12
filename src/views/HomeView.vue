<script setup>
import { RouterLink } from "vue-router";
import { useUserStore } from "@/stores/users.js";

const userStore = useUserStore();
</script>

<template>
    <!-- prettier-ignore -->
    <div class="min-h-screen bg-white flex flex-col">
        <!-- Header -->
        <div class="h-24 bg-orange-600 border-b-4 border-orange-700"></div>

        <!-- Sadržaj -->
        <div class="relative flex-1 overflow-hidden">

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

            <!-- Gumbi -->
            <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center space-y-4">
                <RouterLink to="/signup" class="w-64">
                    <button class="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold font-sans py-2 rounded">
                        Sign Up
                    </button>
                </RouterLink>
                <RouterLink to="/signin" class="w-64">
                    <button class="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold font-sans py-2 rounded">
                        Sign In
                    </button>
                </RouterLink>
                <RouterLink to="/main" class="w-64" @click.native="userStore.continueAsGuest()">
                    <button class="w-full bg-gray-700 hover:bg-gray-800 text-white font-bold font-sans py-2 rounded">
                        Continue as Guest
                    </button>
                </RouterLink>
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
h1 {
    font-family: "Uncial Antiqua", serif;
}
</style>
