'use client';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Book } from '@/types'; // create types later

export default function Header({ books }: { books: Book[] }) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-charcoal/90 backdrop-blur-md border-b border-gold/20">
      <div className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide py-4 gap-6 px-6">
        {books.map((book) => (
          <motion.button
            key={book.id}
            whileHover={{ scale: 1.1, rotate: 2 }}
            onClick={() => document.getElementById(`book-${book.id}`)?.scrollIntoView({ behavior: 'smooth' })}
            className="snap-start flex-shrink-0"
          >
            <Image
              src={book.logo_url || '/placeholder-logo.png'}
              alt={book.title}
              width={120}
              height={60}
              className="object-contain hover:brightness-110 transition"
            />
          </motion.button>
        ))}
      </div>
    </header>
  );
}
