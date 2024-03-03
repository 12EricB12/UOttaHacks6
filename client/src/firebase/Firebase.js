// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "@firebase/database";
import { ref, set } from "firebase/database";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyARqGHiqT8qTVfENJgS_EyWabl6y9HOBQ4",
  authDomain: "uottahack2024.firebaseapp.com",
  projectId: "uottahack2024",
  storageBucket: "uottahack2024.appspot.com",
  messagingSenderId: "843510610148",
  appId: "1:843510610148:web:b2fb3e6a2b0669357ed4f1",
  measurementId: "G-K2XVYJ5WXR",
  databaseURL: "https://uottahack2024-default-rtdb.firebaseio.com",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const database = getDatabase(app);

function writeUserData(userId, name, email, imageUrl) {
    set(ref(database, "users/" + userId), {
      username: name,
      email: email,
      profile_picture: imageUrl,
    }).catch((error) => {
      console.error("Error writing document: ", error);
    });
  }
  
export default writeUserData;