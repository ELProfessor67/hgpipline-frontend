import { initializeApp } from "firebase/app";
import { getStorage} from 'firebase/storage';
import {getFirestore} from "firebase/firestore"

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAFkHtXA3auvvPhrRVcAztxDCH8J2CDEp8",
  authDomain: "hgpipeline.firebaseapp.com",
  projectId: "hgpipeline",
  storageBucket: "hgpipeline.appspot.com",
  messagingSenderId: "252209238912",
  appId: "1:252209238912:web:effe59a961cec887186765",
  measurementId: "G-JQ84TV6JBR"
};



// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const storage = getStorage(app)
export const db = getFirestore(app)