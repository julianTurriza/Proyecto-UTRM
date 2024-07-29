import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported as isAnalyticsSupported } from "firebase/analytics";
import { getDatabase } from "firebase/database";
import { getAuth, initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCgfYQL5Fo7FOWys-qvy7wIhUlggv8huH4",
  authDomain: "pinkward-10fe9.firebaseapp.com",
  projectId: "pinkward-10fe9",
  storageBucket: "pinkward-10fe9.appspot.com",
  messagingSenderId: "223541059064",
  appId: "1:223541059064:web:a50f721742aaa050de8a0d",
  measurementId: "G-8WGNRZT7V1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth with AsyncStorage persistence
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

// Initialize Analytics only if supported
let analytics;
isAnalyticsSupported().then((supported) => {
  if (supported) {
    analytics = getAnalytics(app);
  }
});

// Initialize Database
export const db = getDatabase(app);
export { auth, analytics };
