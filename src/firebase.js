// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Diretsong i-set ang Firebase configuration dito
const firebaseConfig = {
    apiKey: "AIzaSyAkRPDGahJBGG3vBECuFE432LMkRs_VYv0",
    authDomain: "cubeswapbot.firebaseapp.com",
    projectId: "cubeswapbot",
    storageBucket: "cubeswapbot.appspot.com",
    messagingSenderId: "976441105759",
    appId: "1:976441105759:web:ea323d03d1c4f825abaaea",
};

let db;

try {
    const app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    console.log("Firebase initialized:", app);
    console.log("Firestore initialized:", db);
} catch (error) {
    console.error("Error initializing Firebase:", error);
}

export { db };
