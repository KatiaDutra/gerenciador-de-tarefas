import { initializeApp } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyC-52lKamy7Dsi1h9HMjdFBYMroYKx35KE",
  authDomain: "fococerto-67138.firebaseapp.com",
  projectId: "fococerto-67138",
  storageBucket: "fococerto-67138.firebasestorage.app",
  messagingSenderId: "16217094166",
  appId: "1:16217094166:web:ebe6f7d064ff287b369d37"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
