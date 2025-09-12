
import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import AsyncStorage  from '@react-native-async-storage/async-storage';


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBKXs4M7DgfoXHSiLCcGlx7Ej16aTAmYys",
  authDomain: "l-m-s-8576b.firebaseapp.com",
  projectId: "l-m-s-8576b",
  storageBucket: "l-m-s-8576b.firebasestorage.app",
  messagingSenderId: "46871716424",
  appId: "1:46871716424:web:cefbf4c628bd4392b86e7d",
};



// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth with AsyncStorage persistence
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage )
});

// Initialize other Firebase services
const db = getFirestore(app);
const storage = getStorage(app);

// Enable offline persistence for Firestore
// Note: This should be done after initialization
import { enableNetwork, disableNetwork } from 'firebase/firestore';

// Optional: Enable offline persistence
// You might want to conditionally enable this based on network status
// enableNetwork(db);

export { auth, db, storage };
export default app;