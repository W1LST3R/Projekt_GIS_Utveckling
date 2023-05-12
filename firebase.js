

// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-firestore.js";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCELyv8DU-rq5d0OSw-ACGkSqQ1uNr4vFI",
  authDomain: "projektgisutveckling.firebaseapp.com",
  projectId: "projektgisutveckling",
  storageBucket: "projektgisutveckling.appspot.com",
  messagingSenderId: "940911299347",
  appId: "1:940911299347:web:9e4dd8a5ae0cf4fea6e8e6",
  measurementId: "G-DW82HL8DVY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getFirestore(app);
const serverData = collection(database, 'poiDataPerm');
const pdata = await getDocs(serverData);

export default serverData + pdata;