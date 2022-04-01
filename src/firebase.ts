import { collection, CollectionReference, connectFirestoreEmulator, DocumentData } from 'firebase/firestore';
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore"
import { connectAuthEmulator, getAuth } from "firebase/auth";
import { User } from './shared/types/User';
import { Lab } from './shared/types/Lab';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCvIpqVeHhM-B5S175b7JNT4jMwMTNJLK4",
    authDomain: "virtul-lab-nit.firebaseapp.com",
    projectId: "virtul-lab-nit",
    storageBucket: "virtul-lab-nit.appspot.com",
    messagingSenderId: "238547004021",
    appId: "1:238547004021:web:c70cb2708ce8a7bd62e63c",
    measurementId: "G-HCS0PY5G4P"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app)
const auth = getAuth(app)
// connectAuthEmulator(auth, "http://localhost:9099");
// connectFirestoreEmulator(db, "localhost", 8080)
const analytics = getAnalytics(app);

const createCollection = <T = DocumentData>(collectionName: string) => {
    return collection(db, collectionName) as CollectionReference<T>
}

const usersCol = createCollection<User>("users")
const labsCol = createCollection<Lab>("labs")

export { app, db, auth, analytics, usersCol, labsCol };
