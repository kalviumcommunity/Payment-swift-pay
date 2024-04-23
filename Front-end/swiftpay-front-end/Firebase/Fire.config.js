// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import {getFirestore} from "firebase/firestore"
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC8j8l1KaiVjmy7wGEOELLpCQkBVyJgs9g",
  authDomain: "financial-hub-dfedc.firebaseapp.com",
  projectId: "financial-hub-dfedc",
  storageBucket: "financial-hub-dfedc.appspot.com",
  messagingSenderId: "625218922052",
  appId: "1:625218922052:web:5f2faf30349d61b5bc3e11",
  measurementId: "G-MYEBCJWHCG"
};




// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
 const auth = getAuth(app);
 const db =getFirestore(app);
 const storage=getStorage(app)
export {app,auth,db,storage}