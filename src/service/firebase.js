import firebase from "firebase/app";
require("firebase/database");
require("firebase/auth");

var firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  databaseURL: process.env.DB_URL,
  projectId: process.env.PROJECT_ID,
};
/* var firebaseConfig = {
  apiKey: "AIzaSyCPRtO2cfEZKDsU9W88AP3k3CPm2gFBbsE",
  authDomain: "ga01-5e4a4.firebaseapp.com",
  databaseURL: "https://ga01-5e4a4.firebaseio.com/",
  projectId: "ga01-5e4a4",
}; */
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
