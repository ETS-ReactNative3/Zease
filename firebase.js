// Import the functions you need from the SDKs you need
import * as firebase from 'firebase';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyBmS_S3Ae6skCQa-ZkaBsmoeOFOx7Ms2eA',
  authDomain: 'capstone-8c19d.firebaseapp.com',
  databaseURL: 'https://capstone-8c19d-default-rtdb.firebaseio.com',
  projectId: 'capstone-8c19d',
  storageBucket: 'capstone-8c19d.appspot.com',
  messagingSenderId: '718930949173',
  appId: '1:718930949173:web:8c07fc54da24732595ed7c',
  measurementId: 'G-YXMLPCC99R'
};

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
