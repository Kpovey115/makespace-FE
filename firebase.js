import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBwhgu9mFun3uI5-r_kjv2o_QHUnz_53Pk",
    authDomain: "authapp2-7fbad.firebaseapp.com",
    projectId: "authapp2-7fbad",
    storageBucket: "authapp2-7fbad.appspot.com",
    messagingSenderId: "883766256456",
    appId: "1:883766256456:web:57cff70000bd5069c5497d",
};

// Initialize Firebase
// let app;
// if (app === undefined) {
//     app = initializeApp(firebaseConfig);
// } else {
//     app = app();
// }
export const app = initializeApp(firebaseConfig);

const auth = getAuth();

export { auth };