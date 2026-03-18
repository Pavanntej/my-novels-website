'use client';
import { useInView } from 'framer-motion';
import { useRef, useEffect } from 'react';
import { useDominantColor } from '../hooks/useDominantColor';
import Image from 'next/image';
import { Book } from '../types';

export default function BookSection({ book, index }: { book: Book; index: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { threshold: 0.6 });
  const accent = useDominantColor(book.poster_url);

  const trailerRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (inView && trailerRef.current) {
      const url = new URL(book.trailer_url);
      url.searchParams.set('autoplay', '1');
      url.searchParams.set('mute', '0');
      trailerRef.current.src = url.toString();
    }
  }, [inView, book.trailer_url]);

  return (
    <section
      id={`book-${book.id}`}
      ref={ref}
      className="section relative min-h-screen flex items-center overflow-hidden"
      style={{ backgroundColor: '#1a1a1a' }}
    >
      {/* Blending Poster Background */}
      {book.poster_url && (
        <div
          className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-screen"
          style={{ backgroundImage: `url(${book.poster_url})` }}
        />
      )}

      <div className="relative z-10 max-w-7xl mx-auto grid md:grid-cols-2 gap-12 px-6 items-center">
        {/* LEFT — Netflix Style */}
        <div className="space-y-8">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="flex items-center gap-6"
          >
            {book.logo_url && <Image src={book.logo_url} alt={book.title} width={280} height={120} className="drop-shadow-2xl" />}
            <div>
              <div className="text-5xl font-serif tracking-wider">{book.title}</div>
              <div className="text-gold text-2xl mt-2">{book.genre}</div>
            </div>
          </motion.div>

          {/* Cast Cards */}
          <div className="flex gap-4 flex-wrap">
            {book.cast?.map((c: any, i: number) => (
              <div key={i} className="text-center">
                <Image src={c.photo_url} alt={c.name} width={80} height={80} className="rounded-full border-2 border-gold mx-auto" />
                <p className="text-sm mt-2">{c.name}</p>
              </div>
            ))}
          </div>

          {/* Buttons */}
          <div className="flex flex-wrap gap-4">
            <a href={book.buy_color_url} target="_blank" className="px-10 py-4 bg-gold text-charcoal font-bold rounded-full hover:scale-110 transition">BUY COLOR EDITION</a>
            <a href={book.buy_bw_url} target="_blank" className="px-10 py-4 border-2 border-gold rounded-full hover:bg-gold hover:text-charcoal transition">BUY B&W EDITION</a>
          </div>

          <button
            onClick={() => {/* open modal with description + cast */ alert(book.description)}}
            className="text-gold underline text-xl"
          >
            MORE INFO →
          </button>
        </div>

        {/* RIGHT — Trailer (9:16) */}
        <div className="relative group">
          <div className="aspect-[9/16] w-full max-w-[320px] mx-auto overflow-hidden rounded-3xl border-4 border-gold/50 shadow-2xl transition-all group-hover:scale-110">
            <iframe
              ref={trailerRef}
              width="100%"
              height="100%"
              allow="autoplay; encrypted-media"
              allowFullScreen
              className="w-full h-full"
            />
          </div>
          <div className="absolute -bottom-6 right-6 bg-charcoal/90 px-4 py-1 text-xs tracking-widest">TRAILER • SCROLL TO PLAY</div>
        </div>
      </div>
    </section>
  );
}
