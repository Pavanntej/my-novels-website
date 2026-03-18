import { useEffect, useState } from "react"
import { supabase } from "./supabase"

export default function App() {
  const [books, setBooks] = useState([])
  const [active, setActive] = useState(null)
  const [settings, setSettings] = useState({})

  useEffect(() => {
    fetchAll()
  }, [])

  async function fetchAll() {
    const { data: booksData } = await supabase.from("books").select("*")
    const { data: settingsData } = await supabase
      .from("settings")
      .select("*")
      .eq("id", 1)
      .single()

    setBooks(booksData || [])
    setActive(booksData?.[0])
    setSettings(settingsData || {})
  }

  return (
    <div className="bg-black text-white min-h-screen">

      {/* HEADER */}
      <div className="fixed top-0 w-full z-50">

        {/* GOLD BAR */}
        <div className="bg-gradient-to-r from-yellow-600 via-yellow-400 to-yellow-600 text-black px-6 py-3 flex justify-between items-center shadow-lg">

          <h1 className="text-2xl font-bold tracking-wide">
            Bookshelf
          </h1>

          <div className="flex gap-4 text-sm font-semibold">
            {settings?.instagram && (
              <a href={settings.instagram} target="_blank">Instagram</a>
            )}
            {settings?.youtube && (
              <a href={settings.youtube} target="_blank">YouTube</a>
            )}
            {settings?.whatsapp && (
              <a href={`https://wa.me/${settings.whatsapp}`}>WhatsApp</a>
            )}
            {settings?.email && (
              <a href={`mailto:${settings.email}`}>Email</a>
            )}
          </div>

        </div>

        {/* LOGO SCROLLER */}
        <div className="bg-black/80 backdrop-blur flex gap-4 px-4 py-2 overflow-x-auto">
          {books.map(b => (
            <img
              key={b.id}
              src={b.logo}
              onClick={() => setActive(b)}
              className="h-12 cursor-pointer hover:scale-110 transition"
            />
          ))}
        </div>

      </div>

      {/* DEFAULT SCREEN */}
      {!books.length && (
        <div className="h-screen flex flex-col justify-center items-center bg-gradient-to-br from-black to-yellow-900">
          <h1 className="text-5xl font-bold">Bookshelf</h1>
        </div>
      )}

      {/* BOOK VIEW */}
      {active && (
        <div
          className="h-screen flex items-center px-10 pt-32"
          style={{
            backgroundImage: `url(${active.poster})`,
            backgroundSize: "cover",
            backgroundPosition: "center"
          }}
        >

          {/* LEFT */}
          <div className="w-1/2 bg-black/60 backdrop-blur p-6 rounded-xl">
            <img src={active.logo} className="h-16 mb-3" />

            <p className="text-yellow-400">{active.genre}</p>

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
