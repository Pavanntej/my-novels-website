// pages/admin.js
import { useEffect, useState } from "react";
import { auth, db, storage } from "../firebase";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function Admin() {
  const [user, setUser] = useState(null);
  const [books, setBooks] = useState([]);

  useEffect(()=> {
    const unsub = auth.onAuthStateChanged(u => setUser(u));
    return unsub;
  },[]);

  async function login() {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  }

  async function loadBooks() {
    const snap = await getDocs(collection(db, "books"));
    setBooks(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  }

  useEffect(()=>{ if (user) loadBooks() }, [user]);

  if (!user) return (
    <div className="min-h-screen flex items-center justify-center">
      <button onClick={login} className="px-6 py-3 bg-blue-600 text-white rounded-lg">Sign in with Google</button>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto py-10">
      <h2 className="text-2xl mb-4">Admin — Manage Books</h2>
      {/* Show list and form (use separate components AdminBookForm for add/edit) */}
      {/* Provide Upload flow: upload to storage then save doc with coverPath & coverUrl */}
    </div>
  );
}
