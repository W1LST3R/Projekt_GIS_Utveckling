// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-app.js";
import { getFirestore, getDocs, addDoc, collection, doc} from "https://www.gstatic.com/firebasejs/9.21.0/firebase-firestore.js";

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
const colRefPoi = collection(db,"poiDataPerm")
const colRefTra = collection(db,"trailDataPerm")
const colRefTraInfo = collection(db,"trailDataPermInfo")
const colRefCat = collection(db,"categoryDataPerm")
var pois = [];
var trails = [];
var categorys = [];

await getDocs(colRefPoi)
  .then((snapshot)=>{
    snapshot.docs.forEach((doc) => {
      pois.push({...doc.data()})
    })
  })
  .catch(err =>{
      console.log(err.message)
  });

  await getDocs(colRefTra)
  .then((snapshot)=>{
    snapshot.docs.forEach((doc) => {
      trails.push({...doc.data()})
    })
  })
  .catch(err =>{
      console.log(err.message)
  });

  await getDocs(colRefCat)
  .then((snapshot)=>{
    snapshot.docs.forEach((doc) => {
      categorys.push({...doc.data()})
    })
  })
  .catch(err =>{
      console.log(err.message)
  });

export function getPermPoi(){
    return pois;
 }

export function getPermTra(){
  return {"perm":trails};
}

export function getPermCat(){
  return {"perm":categorys};
}

export function addPermPoi(dataToAdd){
  addDoc(collection(db,"poiDataPerm"),dataToAdd
  );
}

export function addPermTra(dataToAdd){
  addDoc(collection(db,"trailDataPerm"),dataToAdd
  );
}
export function addPermCat(dataToAdd){
  addDoc(collection(db,"categoryDataPerm"),dataToAdd
  );
}

