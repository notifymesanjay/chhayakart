import { initializeApp } from 'firebase/app';
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCVvE1Rxo6KGKCBS052oukpHoR2r5E2ug4",
  authDomain: "chayyakartaug.firebaseapp.com",
  projectId: "chayyakartaug",
  storageBucket: "chayyakartaug.appspot.com",
  messagingSenderId: "902650636483",
  appId: "1:902650636483:web:2c19c7777845a0ed695a76",
  measurementId: "G-PZ85Z7VN45"
};

const app = initializeApp(firebaseConfig);
export const authentication = getAuth(app);