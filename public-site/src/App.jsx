import { useEffect, useState } from "react"
import { supabase } from "./supabase"

export default function App() {
  const [books, setBooks] = useState([])
  const [active, setActive] = useState(null)

  useEffect(() => {
    fetchBooks()
  }, [])

  async function fetchBooks() {
    const { data } = await supabase.from("books").select("*")
    setBooks(data || [])
    setActive(data?.[0])
  }

  return (
    <div className="bg-black text-white min-h-screen overflow-x-hidden">

      {/* HEADER */}
      <div className="fixed top-0 w-full bg-black/70 backdrop-blur z-50 flex gap-4 p-4 overflow-x-auto">
        {books.map(b => (
          <img
            key={b.id}
            src={b.logo}
            onClick={() => setActive(b)}
            className="h-12 cursor-pointer hover:scale-110 transition"
          />
        ))}
      </div>

      {/* DEFAULT HERO (NO BOOKS) */}
      {!books.length && (
        <div className="h-screen flex flex-col justify-center items-center bg-gradient-to-br from-black to-yellow-900">
          <h1 className="text-5xl font-bold">Bookshelf</h1>

          <div className="flex gap-6 mt-6">
            <a href="#" className="gold-btn">Instagram</a>
            <a href="#" className="gold-btn">YouTube</a>
            <a href="#" className="gold-btn">Contact</a>
          </div>
        </div>
      )}

      {/* BOOK SECTION */}
      {active && (
        <div
          className="h-screen flex items-center px-10 transition-all duration-700"
          style={{
            backgroundImage: `url(${active.poster})`,
            backgroundSize: "cover",
            backgroundPosition: "center"
          }}
        >

          {/* LEFT CONTENT */}
          <div className="w-1/2 backdrop-blur-md bg-black/50 p-8 rounded-xl">
            <img src={active.logo} className="h-16 mb-4" />

            <p className="text-yellow-400 mb-2">{active.genre}</p>

            <div className="flex gap-4 mt-4">
              <a href={active.buy_color} className="gold-btn">Color</a>
              <a href={active.buy_bw} className="gold-btn">B&W</a>
            </div>

            <button
              className="mt-4 underline"
              onClick={() => alert(active.description)}
            >
              More Info
            </button>
          </div>

          {/* TRAILER */}
          <div className="w-1/2 flex justify-end">
            <iframe
              src={`${active.trailer}?autoplay=1&mute=0`}
              className="w-[300px] h-[530px] rounded-xl shadow-xl hover:scale-105 transition"
              allow="autoplay"
            />
          </div>

        </div>
      )}

    </div>
  )
}
