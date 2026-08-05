import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDsV-TCJVkWJ1lSfYW0BnUwNY3rx76BCWE",
  authDomain: "mock-exam-portal-d3c59.firebaseapp.com",
  projectId: "mock-exam-portal-d3c59",
  storageBucket: "mock-exam-portal-d3c59.firebasestorage.app",
  messagingSenderId: "735557800537",
  appId: "1:735557800537:web:ed1a1b99ec13a245b31748",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();