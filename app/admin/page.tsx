'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Book } from '@/types';
import BookForm from '@/components/Admin/BookForm';
import { Plus, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AdminDashboard() {
  const [books, setBooks] = useState<Book[]>([]);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchBooks = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('books')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) setBooks(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleSaved = () => {
    fetchBooks();
    setShowForm(false);
    setSelectedBook(null);
  };

  return (
    <div className="min-h-screen bg-charcoal text-white">
      {/* Header */}
      <header className="border-b border-gold/20 bg-charcoal/90 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">
          <h1 className="text-4xl font-serif text-gold tracking-wider">Admin Panel</h1>
          <div className="flex gap-4">
            <button
              onClick={() => { setSelectedBook(null); setShowForm(true); }}
              className="px-6 py-3 bg-gold text-charcoal font-bold rounded-lg hover:bg-yellow-400 transition flex items-center gap-2"
            >
              <Plus size={20} /> Add New Book
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-gold border-solid mx-auto"></div>
            <p className="mt-6 text-gold/70">Loading books...</p>
          </div>
        ) : books.length === 0 ? (
          <div className="text-center py-24">
            <h2 className="text-3xl text-gold/80 mb-4">No books yet</h2>
            <p className="text-gray-400 mb-8">Click "Add New Book" to get started</p>
            <button
              onClick={() => { setSelectedBook(null); setShowForm(true); }}
              className="px-10 py-4 bg-gold text-charcoal font-bold text-lg rounded-full hover:bg-yellow-400 transition"
            >
              Create Your First Book
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {books.map((b) => (
              <motion.div
                key={b.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-charcoal/70 border border-gold/20 rounded-2xl overflow-hidden hover:border-gold/60 transition group cursor-pointer shadow-xl"
                onClick={() => { setSelectedBook(b); setShowForm(true); }}
              >
                {b.poster_url && (
                  <div className="h-64 overflow-hidden">
                    <img
                      src={b.poster_url}
                      alt={b.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                )}
                <div className="p-6">
                  <h3 className="text-2xl font-serif text-gold mb-2">{b.title}</h3>
                  {b.genre && <p className="text-gold/70 mb-4">{b.genre}</p>}
                  <div className="text-sm text-gray-400">
                    {b.cast?.length || 0} cast member{b.cast?.length !== 1 ? 's' : ''}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>

      {showForm && (
        <BookForm
          book={selectedBook}
          onClose={() => { setShowForm(false); setSelectedBook(null); }}
          onSaved={handleSaved}
        />
      )}
    </div>
  );
}
