import firebaseConfig from "./firebaseConfig";
import firebase from "firebase/app";
import "firebase/database"; // If using Firebase database
import "firebase/auth"; // If using Firebase storage
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

// Initialize Firebase
let app;
if (firebase.apps.length === 0) {
  app = firebase.initializeApp(firebaseConfig);
} else {
  app = firebase.app();
}
const auth = firebase.auth();
const database = firebase.database();

export { auth, database };
