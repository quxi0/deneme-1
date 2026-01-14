import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBwXA86hD5TfST8neTSyJ-PHV0GUQdrbWo",
  authDomain: "vizarc-918e7.firebaseapp.com",
  projectId: "vizarc-918e7",
  storageBucket: "vizarc-918e7.firebasestorage.app",
  messagingSenderId: "689928012276",
  appId: "1:689928012276:web:5b3e8f0ae230c727c7b9a1",
  measurementId: "G-31CJM4ZY7Y"
};

// --- Initialization Logic with Validation ---

const validateConfig = () => {
  const requiredKeys = ['apiKey', 'authDomain', 'projectId'];
  const missing = requiredKeys.filter(key => !firebaseConfig[key as keyof typeof firebaseConfig]);
  
  if (missing.length > 0) {
    console.warn(`⚠️ Firebase Config Warning: Missing keys [${missing.join(', ')}]. Check firebaseConfig.ts.`);
  } else {
    console.log(`✅ Firebase Configuration Loaded for Project: ${firebaseConfig.projectId}`);
  }
};

validateConfig();

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);