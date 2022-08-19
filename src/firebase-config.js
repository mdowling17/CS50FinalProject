// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "@firebase/firestore";
import { getAuth, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, sendPasswordResetEmail, updateEmail, updatePassword } from "firebase/auth";
import { useEffect } from "react/cjs/react.development";
import { useState } from "react"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: AIzaSyBGD-YKP7Jwi2yeidAJeYZq8ViKgH-FQU",
    authDomain: process.env.REACT_APP_FIREBASE_AUTHDOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_PROJECTID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGEBUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGINGSENDERID,
    appId: process.env.REACT_APP_FIREBASE_APPID
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
const auth = getAuth();
const projectsCollectionRef = collection(db, "projects")

export function useAuth() {
  const [currentUser, setCurrentUser] = useState();
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => setCurrentUser(user))
    return unsubscribe
  }, [])

  return currentUser
}

export async function signUp(email, password) {
  await addDoc(projectsCollectionRef, {parentproject: false, projectname: "home", user: email})
  return createUserWithEmailAndPassword(auth, email, password)
}

export function logIn(email, password) {
  return signInWithEmailAndPassword(auth, email, password)
}

export function logOut() {
  return signOut(auth)
}

// export function resetPassword(email) {
//   return sendPasswordResetEmail(auth, email)
// }

// export function changeEmail(newEmail) {
//   return updateEmail(auth.currentUser, newEmail)
// }

// export function changePassword(newPassword) {
//   return updatePassword(auth.currentUser, newPassword)
// }