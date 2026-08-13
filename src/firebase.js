import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCbqOabN1A4apAm0MKxqIr-OVaVpbSM8cQ",
  authDomain: "alshorouk-sudanese.firebaseapp.com",
  projectId: "alshorouk-sudanese",
  storageBucket: "alshorouk-sudanese.firebasestorage.app",
  messagingSenderId: "124942972085",
  appId: "1:124942972085:web:65f36407592c73a6b7bafc",
  measurementId: "G-YV7ZRJ8MTQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

export default app;
