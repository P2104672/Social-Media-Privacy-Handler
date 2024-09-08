import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyA0OXu-K40t-CcIwkJYY7VUb8nAUaFzDjo",
    authDomain: "social-media-privacy-handler.firebaseapp.com",
    projectId: "social-media-privacy-handler",
    storageBucket: "social-media-privacy-handler.appspot.com",
    messagingSenderId: "448674267572",
    appId: "1:448674267572:web:acf76c5e8e637f3f55f2e1",
    measurementId: "G-8RMVZQFQHM"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

export default app;
