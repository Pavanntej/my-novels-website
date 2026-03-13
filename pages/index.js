// pages/index.js
import { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../firebase";
import BookCard from "../components/BookCard";

export default function Home() {
  const [books, setBooks] = useState([]);
  useEffect(() => {
    async function load() {
      const q = query(collection(db, "books"), orderBy("publishedAt", "desc"));
      const snap = await getDocs(q);
      setBooks(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    }
    load();
  }, []);

  return (
    <div className="min-h-screen transition-colors duration-700" style={{ background: "var(--page-bg, #f8fafc)" }}>
      <main className="max-w-6xl mx-auto py-12 px-6">
        <h1 className="text-4xl font-semibold mb-8">Pavanntej — Bookshelf</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {books.map(book => <BookCard key={book.id} book={book} />)}
        </div>
      </main>
    </div>
  );
}
