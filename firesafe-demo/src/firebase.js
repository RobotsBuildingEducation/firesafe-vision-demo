import { getApp, getApps, initializeApp } from 'firebase/app'

const firebaseConfig = {
  apiKey: 'AIzaSyCFqYoTJKZ3Ju7TUD_PZbGSsRpi9e_W27E',
  authDomain: 'firesafe-vision-demo.firebaseapp.com',
  projectId: 'firesafe-vision-demo',
  storageBucket: 'firesafe-vision-demo.firebasestorage.app',
  messagingSenderId: '264218464416',
  appId: '1:264218464416:web:812c7435de334ebc38b9c5',
  measurementId: 'G-T8SY75Z53C',
}

export const firebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig)
