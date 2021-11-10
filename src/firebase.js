import firebase from "firebase/app";
import "firebase/auth";

const app = firebase.initializeApp({
  apiKey: "AIzaSyD5bLDqLXNPsK9e28XYsXe0tfuj-3VAtGY",
  authDomain: "lproject-1bc54.firebaseapp.com",
  projectId: "lproject-1bc54",
  storageBucket: "lproject-1bc54.appspot.com",
  messagingSenderId: "274092324594",
  appId: "1:274092324594:web:6612fa04412bf64b71426b",
  measurementId: "G-7J240Y60ZS"
});

export const auth = app.auth();
export default app;