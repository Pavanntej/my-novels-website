import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyD2DKkovTJJQmtmXOQqjvFGwMnachGQp0I",
  authDomain: "pavannbookshelf.firebaseapp.com",
  projectId: "pavannbookshelf",
  storageBucket: "pavannbookshelf.firebasestorage.app",
  messagingSenderId: "971399753602",
  appId: "1:971399753602:web:d66d3cdb54a9cb7967699b",
  measurementId: "G-03BWCS7ERJ"
};
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
