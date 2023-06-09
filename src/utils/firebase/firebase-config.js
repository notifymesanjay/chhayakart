import { initializeApp } from 'firebase/app';
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBmJNMdF6M_onQs6-GlKMrLL1Sa_cmFZrQ",
  authDomain: "chhayakart-2aad5.firebaseapp.com",
  projectId: "chhayakart-2aad5",
  storageBucket: "chhayakart-2aad5.appspot.com",
  messagingSenderId: "925593502189",
  appId: "1:925593502189:web:4f6505e29629b7fdb527e4",
  measurementId: "G-HVNTN7MHYB"
};

const app = initializeApp(firebaseConfig);
export const authentication = getAuth(app);