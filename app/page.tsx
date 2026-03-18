'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Header from '../components/Header';
import BookSection from '../components/BookSection';
import { supabase } from '../lib/supabase';
import { Book } from '../types';

export default function PublicSite() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from('books').select('*').order('created_at', { ascending: false }).then(({ data }) => {
      setBooks(data || []);
      setLoading(false);
    });
  }, []);

  return (
    <>
      <Header books={books} />

      {/* Immersive Hero */}
      <section className="min-h-screen flex items-center justify-center relative overflow-hidden bg-charcoal">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center z-10"
        >
          <h1 className="text-8xl font-serif gold-glow tracking-widest">MY BOOKSHELF</h1>
          <p className="mt-4 text-2xl text-gold/80">Cinematic Worlds Await</p>
        </motion.div>

        {/* Parallax background elements */}
        <div className="absolute inset-0 bg-[radial-gradient(circle,#d4af37_1px,transparent_1px)] bg-[length:50px_50px] opacity-10" />
      </section>

      {/* Books Sections */}
      {books.length > 0 ? (
        books.map((book, i) => <BookSection key={book.id} book={book} index={i} />)
      ) : (
        <div className="min-h-screen flex items-center justify-center text-4xl text-gold/50">
          No books yet — add them in /admin
        </div>
      )}

      {/* Footer / Contact */}
      <footer className="py-12 border-t border-gold/20 text-center">
        <div className="flex justify-center gap-8 text-xl">
          <a href="https://wa.me/YOURNUMBER" className="hover:text-gold transition">WhatsApp</a>
          <a href="mailto:your@email.com" className="hover:text-gold transition">Email</a>
          <a href="https://instagram.com/yourhandle" target="_blank" className="hover:text-gold transition">Instagram</a>
          <a href="https://youtube.com/yourchannel" target="_blank" className="hover:text-gold transition">YouTube</a>
        </div>
        <p className="mt-8 text-sm text-gold/40">© Your Name — All Rights Reserved</p>
      </footer>
    </>
  );
}
