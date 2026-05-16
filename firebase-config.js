import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
  getDatabase
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyBNN9RSVO01p7Xz9xzaBghSoNV-H3wQruI",
  authDomain: "campuscrack-cbb41.firebaseapp.com",
  databaseURL: "https://campuscrack-cbb41-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "campuscrack-cbb41",
  storageBucket: "campuscrack-cbb41.firebasestorage.app",
  messagingSenderId: "689398385446",
  appId: "1:689398385446:web:be472bcebba66a6d67cfe7",
  measurementId: "G-WBNBFMTW1M"
};
const app = initializeApp(firebaseConfig);

export const db = getDatabase(app);
