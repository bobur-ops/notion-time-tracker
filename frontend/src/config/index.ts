// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD6MJqVuUh79f0_9gSMD6R1ev87s_UArEg",
  authDomain: "notion-time-tracker-8e634.firebaseapp.com",
  projectId: "notion-time-tracker-8e634",
  storageBucket: "notion-time-tracker-8e634.appspot.com",
  messagingSenderId: "979607049675",
  appId: "1:979607049675:web:1d0c3102eff575d712d24e",
  measurementId: "G-Q4WPXYF5MC",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const firebaseDb = getFirestore(app);
const analytics = getAnalytics(app);

export const redirectUri = "https://cc52-45-9-230-78.ngrok-free.app";

// https://api.notion.com/v1/oauth/authorize?client_id=695b8556-de84-4c9c-b004-bf84a98457f1&response_type=code&owner=user&redirect_uri=http%3A%2F%2Flocalhost%3A1234
