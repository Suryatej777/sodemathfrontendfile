import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyDOEkOdl-ylf0daRrSky7Vf9_nU8RUnIlg",
    authDomain: "sode-matha-fb1e2.firebaseapp.com",
    projectId: "sode-matha-fb1e2",
    storageBucket: "sode-matha-fb1e2.firebasestorage.app",
    messagingSenderId: "1090244564751",
    appId: "1:1090244564751:web:e0a819200e0af40819d07a",
    measurementId: "G-E0CP0GGP16"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
