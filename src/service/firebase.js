import firebase from 'firebase/app';
require('firebase/database');
require('firebase/auth');
console.log('in firebase.js');
console.log(process.env.REACT_APP_API_KEY);
var firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DB_URL,
  projectId: process.env.REACT_APP_PROJECT_ID,
};
firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth;
export const db = firebase.database();
