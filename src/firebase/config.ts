import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyAPk3bdlN2hUntjNzFBbFb0_uFSgNVD934",
  authDomain: "airecruiterx.firebaseapp.com",
  projectId: "airecruiterx",
  storageBucket: "airecruiterx.firebasestorage.app",
  messagingSenderId: "281888351289",
  appId: "1:281888351289:web:3432a2e6e0f679599699e8",
  measurementId: "G-5CEWZYF7DQ"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);