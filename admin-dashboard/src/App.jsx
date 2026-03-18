import { useState, useEffect } from "react"
import { supabase } from "./supabase"

export default function Admin() {

  const [form, setForm] = useState({
    title: "",
    genre: "",
    description: "",
    trailer: "",
    buy_color: "",
    buy_bw: ""
  })

  const [poster, setPoster] = useState(null)
  const [logo, setLogo] = useState(null)
  const [cast, setCast] = useState([])

  const [settings, setSettings] = useState({
    instagram: "",
    youtube: "",
    whatsapp: "",
    email: ""
  })

  useEffect(() => {
    loadSettings()
  }, [])

  async function loadSettings() {
    const { data } = await supabase.from("settings").select("*").eq("id", 1).single()
    if (data) setSettings(data)
  }

  async function saveSettings() {
    await supabase.from("settings").update(settings).eq("id", 1)
    alert("Settings Updated")
  }

  async function uploadFile(file) {
    const name = Date.now() + file.name
    await supabase.storage.from("books").upload(name, file)
    return `https://YOUR_PROJECT.supabase.co/storage/v1/object/public/books/${name}`
  }

  async function addBook() {

    const posterUrl = await uploadFile(poster)
    const logoUrl = await uploadFile(logo)

    const { error } = await supabase.from("books").insert([{
      ...form,
      poster: posterUrl,
      logo: logoUrl,
      cast
    }])

    if (!error) alert("Uploaded!")
  }

  function addCast() {
    setCast([...cast, { name: "", photo: "" }])
  }

  function updateCast(i, field, value) {
    const updated = [...cast]
    updated[i][field] = value
    setCast(updated)
  }

  return (
    <div className="p-10 bg-black text-white min-h-screen">

      <h1 className="text-3xl mb-6 text-yellow-400">Admin Panel</h1>

      {/* BOOK FORM */}
      <div className="space-y-3">

        <input placeholder="Title" onChange={e => setForm({...form, title: e.target.value})} />
        <input placeholder="Genre" onChange={e => setForm({...form, genre: e.target.value})} />
        <textarea placeholder="Description" onChange={e => setForm({...form, description: e.target.value})} />

        <input placeholder="Trailer link" onChange={e => setForm({...form, trailer: e.target.value})} />
        <input placeholder="Buy Color link" onChange={e => setForm({...form, buy_color: e.target.value})} />
        <input placeholder="Buy B&W link" onChange={e => setForm({...form, buy_bw: e.target.value})} />

        <p>Poster</p>
        <input type="file" onChange={e => setPoster(e.target.files[0])} />

        <p>Logo</p>
        <input type="file" onChange={e => setLogo(e.target.files[0])} />

      </div>

      {/* CAST */}
      <div className="mt-6">
        <h2 className="text-yellow-400">Cast</h2>

        {cast.map((c, i) => (
          <div key={i} className="flex gap-2 mt-2">
            <input
              placeholder="Name"
              onChange={e => updateCast(i, "name", e.target.value)}
            />
            <input
              type="file"
              onChange={async e => {
                const url = await uploadFile(e.target.files[0])
                updateCast(i, "photo", url)
              }}
            />
          </div>
        ))}

        <button onClick={addCast} className="gold-btn mt-2">Add Cast</button>
      </div>

      <button onClick={addBook} className="gold-btn mt-6">Upload Book</button>

      {/* SETTINGS */}
      <div className="mt-10 p-6 border border-yellow-500 rounded-xl">
        <h2 className="text-xl mb-4 text-yellow-400">Site Settings</h2>

        <input
          placeholder="Instagram URL"
          value={settings.instagram}
          onChange={e => setSettings({...settings, instagram: e.target.value})}
        />

        <input
          placeholder="YouTube URL"
          value={settings.youtube}
          onChange={e => setSettings({...settings, youtube: e.target.value})}
        />

        <input
          placeholder="WhatsApp Number"
          value={settings.whatsapp}
          onChange={e => setSettings({...settings, whatsapp: e.target.value})}
        />

        <input
          placeholder="Email"
          value={settings.email}
          onChange={e => setSettings({...settings, email: e.target.value})}
        />

        <button onClick={saveSettings} className="gold-btn mt-4">
          Save Settings
        </button>
      </div>

    </div>
  )
}
