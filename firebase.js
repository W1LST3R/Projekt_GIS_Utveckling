
// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-app.js";
import { getFirestore, getDocs, addDoc, collection, doc} from "https://www.gstatic.com/firebasejs/9.21.0/firebase-firestore.js";
import {getPermData} from "http://www.student.hig.se/~22wipe02/udgis/Projekt_GIS_Utveckling-main/project.js";

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
initializeApp(firebaseConfig);
const db = getFirestore();
const colRef = collection(db,"poiDataPerm")
const dataToAdd = getPermData();
console.log(dataToAdd);
//const permPoiDataGet = await 
var pois = [];
  getDocs(colRef)
  .then((snapshot)=>{
    snapshot.docs.forEach((doc) => {
      pois.push({...doc.data()})
    })
  })
  .catch(err =>{
      console.log(err.message)
  });

addDoc(collection(db,"poiDataPerm"),{
  dataToAdd
});

 
export default pois;
