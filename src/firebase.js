import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDLXoRDCS0vb97DGJzahMrmrIwQmh2nDjs",
  authDomain: "tubuyaki-17d6b.firebaseapp.com",
  projectId: "tubuyaki-17d6b",
  storageBucket: "tubuyaki-17d6b.firebasestorage.app",
  messagingSenderId: "926506764617",
  appId: "1:926506764617:web:d65f9eac15791f5a8eb298"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app; 