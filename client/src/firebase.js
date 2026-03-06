// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey:import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "roomoo---mern.firebaseapp.com",
  projectId: "roomoo---mern",
  storageBucket: "roomoo---mern.appspot.com",
  messagingSenderId: "37511691895",
  appId: "1:37511691895:web:252a43bb008df67b6bd072"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);