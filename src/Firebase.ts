import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAwAu0EOqOQTAwlG1UEZ3LGUCWZEU3t-QE",
  authDomain: "hyzik-5edfd.firebaseapp.com",
  databaseURL: "https://hyzik-5edfd-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "hyzik-5edfd",
  storageBucket: "hyzik-5edfd.appspot.com",
  messagingSenderId: "972630337145",
  appId: "1:972630337145:web:5046f2aabb4c954aef56a8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);