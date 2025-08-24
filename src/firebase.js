import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDSrltzgxwEaPsYjW7sRJScOrb1Q1wZolE",
    authDomain: "ancientmyths-9d6b4.firebaseapp.com",
    projectId: "ancientmyths-9d6b4",
    storageBucket: "ancientmyths-9d6b4.firebasestorage.app",
    messagingSenderId: "529674326921",
    appId: "1:529674326921:web:e941b42b4e52c77e380758",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
