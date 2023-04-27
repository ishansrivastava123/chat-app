import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDVdh4kRAHRpoYgY6o8nx6N7mEeDxfhRnU",
  authDomain: "chat-app-ishansrivastava.firebaseapp.com",
  projectId: "chat-app-ishansrivastava",
  storageBucket: "chat-app-ishansrivastava.appspot.com",
  messagingSenderId: "1039150660505",
  appId: "1:1039150660505:web:7e7a6db6d45fad808ff108",
  measurementId: "G-19QHZSZJG3"
};

export const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);