import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyAYCgyop1Fx-1P1VHEH19U3VdccaBRgw1c",
  authDomain: "swp391-2004.firebaseapp.com",
  databaseURL:
    "https://swp391-2004-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "swp391-2004",
  storageBucket: "swp391-2004.appspot.com",
  messagingSenderId: "736158534534",
  appId: "1:736158534534:web:df7ccbef6894fbb7323a07",
};

const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);
