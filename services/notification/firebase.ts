// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported as isAnalyticsSupported } from "firebase/analytics";
import { getMessaging, isSupported as isMessagingSupported } from "firebase/messaging";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBV_iL72XDAei_kHKZhQ-_iMAJYA8kR6MQ",
  authDomain: "jobapplicationmanagementsys.firebaseapp.com",
  projectId: "jobapplicationmanagementsys",
  storageBucket: "jobapplicationmanagementsys.firebasestorage.app",
  messagingSenderId: "861780248380",
  appId: "1:861780248380:web:2d7ca0131d497c6bc54039",
  measurementId: "G-6ELX8W01S9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const getFirebaseMessaging = async () => {
  if (typeof window === "undefined") return null;

  const supported = await isMessagingSupported();
  return supported ? getMessaging(app) : null;
};

export const initFirebaseAnalytics = async () => {
  if (typeof window === "undefined") return null;

  const supported = await isAnalyticsSupported();
  return supported ? getAnalytics(app) : null;
};
