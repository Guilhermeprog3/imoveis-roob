import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
 apiKey: "AIzaSyCbqwEFFfPDbmhe8ieC78ZUEX_G-aKbG6M",
  authDomain: "imoveis-app-1aa09.firebaseapp.com",
  projectId: "imoveis-app-1aa09",
  storageBucket: "imoveis-app-1aa09.firebasestorage.app",
  messagingSenderId: "614740017018",
  appId: "1:614740017018:web:2059b4667854b8d49ea0c3",
  measurementId: "G-ZBL587TVFL"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };