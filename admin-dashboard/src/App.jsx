import { useState } from "react"
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

      <h1 className="text-3xl mb-6">Admin Panel</h1>

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

      {/* CAST */}
      <div className="mt-6">
        <h2>Cast</h2>

        {cast.map((c, i) => (
          <div key={i}>
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

        <button onClick={addCast}>Add Cast</button>
      </div>

      <button onClick={addBook} className="gold-btn mt-6">Upload</button>

    </div>
  )
}
