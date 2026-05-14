import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCFqYoTJKZ3Ju7TUD_PZbGSsRpi9e_W27E",
  authDomain: "firesafe-vision-demo.firebaseapp.com",
  projectId: "firesafe-vision-demo",
  storageBucket: "firesafe-vision-demo.firebasestorage.app",
  messagingSenderId: "264218464416",
  appId: "1:264218464416:web:812c7435de334ebc38b9c5",
  measurementId: "G-T8SY75Z53C",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
