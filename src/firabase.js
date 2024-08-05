// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, addDoc, collection } from "@firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAzgsAGG71HGSKoh_W1BvNYgOiXFzYCvnY",
  authDomain: "imageocr-424205.firebaseapp.com",
  databaseURL: "https://imageocr-424205-default-rtdb.firebaseio.com",
  projectId: "imageocr-424205",
  storageBucket: "imageocr-424205.appspot.com",
  messagingSenderId: "42912040620",
  appId: "1:42912040620:web:d72f2caac4c52aaffd8109"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const firebaseDb = getFirestore(app);

export { auth, firebaseDb };
