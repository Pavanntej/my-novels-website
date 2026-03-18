'use client';

import { useState } from 'react';
import { Plus, Trash2, Upload } from 'lucide-react';
import { CastMember } from '@/types';

interface CastBuilderProps {
  cast: CastMember[];
  onChange: (cast: CastMember[]) => void;
}

export default function CastBuilder({ cast, onChange }: CastBuilderProps) {
  const [newName, setNewName] = useState('');
  const [newPhotoFile, setNewPhotoFile] = useState<File | null>(null);
  const [newPhotoPreview, setNewPhotoPreview] = useState<string | null>(null);

  const addCast = async () => {
    if (!newName.trim() || !newPhotoFile) return;

    try {
      const filePath = `cast/${Date.now()}-${newPhotoFile.name}`;
      const { error: uploadError } = await supabase.storage
        .from('cast-photos')
        .upload(filePath, newPhotoFile);

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage.from('cast-photos').getPublicUrl(filePath);

      const newMember: CastMember = {
        name: newName.trim(),
        photo_url: urlData.publicUrl,
      };

      onChange([...cast, newMember]);
      setNewName('');
      setNewPhotoFile(null);
      setNewPhotoPreview(null);
    } catch (err) {
      alert("Failed to upload photo");
    }
  };

  const removeCast = (index: number) => {
    const updated = cast.filter((_, i) => i !== index);
    onChange(updated);
  };

  return (
    <div className="space-y-6">
      <label className="block text-gold font-medium text-lg">Cast / Characters</label>

      {/* Existing cast cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {cast.map((member, i) => (
          <div key={i} className="relative group">
            <div className="bg-charcoal/60 border border-gold/30 rounded-xl overflow-hidden shadow-lg">
              <img
                src={member.photo_url}
                alt={member.name}
                className="w-full h-40 object-cover"
              />
              <div className="p-3 text-center">
                <p className="font-medium">{member.name}</p>
              </div>
            </div>
            <button
              onClick={() => removeCast(i)}
              className="absolute top-2 right-2 bg-red-600/80 p-2 rounded-full opacity-0 group-hover:opacity-100 transition"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>

      {/* Add new cast */}
      <div className="border border-gold/40 rounded-xl p-6 bg-charcoal/40">
        <div className="grid md:grid-cols-2 gap-6 items-end">
          <div>
            <label className="block text-gold mb-2 text-sm">Name</label>
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Character / Actor name"
              className="w-full bg-charcoal/70 border border-gold/30 rounded-lg px-4 py-2.5 text-white"
            />
          </div>

          <div>
            <label className="block text-gold mb-2 text-sm">Photo</label>
            {newPhotoPreview ? (
              <div className="flex items-center gap-4">
                <img src={newPhotoPreview} alt="preview" className="w-20 h-20 object-cover rounded-lg" />
                <button
                  type="button"
                  onClick={() => {
                    setNewPhotoFile(null);
                    setNewPhotoPreview(null);
                  }}
                  className="text-red-400 hover:text-red-300"
                >
                  Remove
                </button>
              </div>
            ) : (
              <label className="cursor-pointer inline-flex items-center gap-3 text-gold hover:text-yellow-400">
                <Upload size={20} />
                <span>Choose photo</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setNewPhotoFile(file);
                      setNewPhotoPreview(URL.createObjectURL(file));
                    }
                  }}
                  className="hidden"
                />
              </label>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={addCast}
          disabled={!newName.trim() || !newPhotoFile}
          className="mt-6 px-6 py-2.5 bg-gold/80 text-charcoal rounded-lg hover:bg-gold transition disabled:opacity-50 flex items-center gap-2"
        >
          <Plus size={18} /> Add Cast Member
        </button>
      </div>
    </div>
  );
}
