import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { getAuth, setPersistence, browserLocalPersistence } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-storage.js";
import { getAnalytics, isSupported } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-analytics.js";

export const firebaseConfig = {
  apiKey: "AIzaSyBKhZMX8neMsKzjx7UWbpVz-FgQ4FyP99c",
  authDomain: "sheikh-apiaries-stamp-card.firebaseapp.com",
  projectId: "sheikh-apiaries-stamp-card",
  storageBucket: "sheikh-apiaries-stamp-card.firebasestorage.app",
  messagingSenderId: "80280866205",
  appId: "1:80280866205:web:04d6a300e2652f773a7374",
  measurementId: "G-3TTMGFLSBQ"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

try {
  await setPersistence(auth, browserLocalPersistence);
} catch (_) {}

export const analytics = (await isSupported()) ? getAnalytics(app) : null;
