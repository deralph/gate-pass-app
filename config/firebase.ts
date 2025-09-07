import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';



// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBKXs4M7DgfoXHSiLCcGlx7Ej16aTAmYys",
  authDomain: "l-m-s-8576b.firebaseapp.com",
  projectId: "l-m-s-8576b",
  storageBucket: "l-m-s-8576b.firebasestorage.app",
  messagingSenderId: "46871716424",
  appId: "1:46871716424:web:cefbf4c628bd4392b86e7d",
};


const app = initializeApp(firebaseConfig);
// export const auth = getAuth(app);

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});



export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
