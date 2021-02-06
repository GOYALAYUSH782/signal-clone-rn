import * as firebase from 'firebase';
import firebaseConfig from './config';
import "firebase/auth";
import "firebase/firestore";

let app;
if (firebase.apps.length === 0) {
  app = firebase.initializeApp(firebaseConfig);
} else {
  app = firebase.app();
}

const db = app.firestore();
const auth = firebase.auth();

export { db, auth };


