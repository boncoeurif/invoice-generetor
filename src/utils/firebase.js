import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCNRZHD81VowMdjV61cIKppiILxmcheogU",
  authDomain: "invoxa-6ac7a.firebaseapp.com",
  projectId: "invoxa-6ac7a",
  storageBucket: "invoxa-6ac7a.firebasestorage.app",
  messagingSenderId: "85503294651",
  appId: "1:85503294651:web:6114e9245d10bebf953d9e",
  measurementId: "G-35TTR4XM3F"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
