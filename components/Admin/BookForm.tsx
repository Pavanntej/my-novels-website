'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Book } from '@/types';
import { Upload, X, Plus, Trash2, Save, Eye } from 'lucide-react';
import CastBuilder from './CastBuilder';
import ConfirmModal from './ConfirmModal';
import SuccessToast from './SuccessToast';

interface BookFormProps {
  book?: Book | null;
  onClose: () => void;
  onSaved: () => void;
}

export default function BookForm({ book, onClose, onSaved }: BookFormProps) {
  const isEdit = !!book;
  const [form, setForm] = useState<Partial<Book>>({
    title: '',
    genre: '',
    trailer_url: '',
    buy_color_url: '',
    buy_bw_url: '',
    description: '',
    cast: [],
  });

  const [posterFile, setPosterFile] = useState<File | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [posterPreview, setPosterPreview] = useState<string | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (book) {
      setForm(book);
      setPosterPreview(book.poster_url || null);
      setLogoPreview(book.logo_url || null);
    }
  }, [book]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'poster' | 'logo') => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (type === 'poster') {
      setPosterFile(file);
      setPosterPreview(URL.createObjectURL(file));
    } else {
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const uploadFile = async (file: File, bucket: string, path: string) => {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(`${path}/${Date.now()}-${file.name}`, file, { upsert: true });

    if (error) throw error;
    const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(data.path);
    return urlData.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title?.trim()) {
      setError("Title is required");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let posterUrl = posterPreview;
      let logoUrl = logoPreview;

      if (posterFile) {
        posterUrl = await uploadFile(posterFile, 'posters', 'books');
      }
      if (logoFile) {
        logoUrl = await uploadFile(logoFile, 'logos', 'books');
      }

      const payload = {
        ...form,
        poster_url: posterUrl,
        logo_url: logoUrl,
        cast: form.cast || [],
      };

      if (isEdit && book?.id) {
        const { error } = await supabase.from('books').update(payload).eq('id', book.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('books').insert([payload]);
        if (error) throw error;
      }

      setShowSuccess(true);
      setTimeout(() => {
        onSaved();
        onClose();
      }, 1800);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!book?.id) return;
    setLoading(true);

    try {
      const { error } = await supabase.from('books').delete().eq('id', book.id);
      if (error) throw error;
      setShowSuccess(true);
      setTimeout(() => {
        onSaved();
        onClose();
      }, 1800);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-charcoal border border-gold/30 rounded-2xl w-full max-w-4xl max-h-[95vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gold/20">
          <h2 className="text-3xl font-serif text-gold">{isEdit ? 'Edit Book' : 'Add New Book'}</h2>
          <button onClick={onClose} className="text-gold/70 hover:text-gold">
            <X size={28} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-8 overflow-y-auto max-h-[75vh]">
          {/* Title */}
          <div>
            <label className="block text-gold mb-2 font-medium">Title *</label>
            <input
              type="text"
              value={form.title || ''}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full bg-charcoal/70 border border-gold/40 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-gold"
              required
            />
          </div>

          {/* Genre */}
          <div>
            <label className="block text-gold mb-2 font-medium">Genre</label>
            <input
              type="text"
              value={form.genre || ''}
              onChange={(e) => setForm({ ...form, genre: e.target.value })}
              className="w-full bg-charcoal/70 border border-gold/40 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-gold"
              placeholder="Fantasy, Thriller, Romance..."
            />
          </div>

          {/* Two-column layout for uploads */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* Poster */}
            <div>
              <label className="block text-gold mb-2 font-medium">Book Poster</label>
              <div className="border-2 border-dashed border-gold/40 rounded-xl p-6 text-center hover:border-gold transition">
                {posterPreview ? (
                  <div className="relative">
                    <img src={posterPreview} alt="Poster preview" className="max-h-64 mx-auto rounded-lg shadow-lg object-cover" />
                    <button
                      type="button"
                      onClick={() => { setPosterFile(null); setPosterPreview(null); }}
                      className="absolute top-2 right-2 bg-red-600/80 p-2 rounded-full"
                    >
                      <X size={20} />
                    </button>
                  </div>
                ) : (
                  <label className="cursor-pointer flex flex-col items-center">
                    <Upload className="text-gold mb-3" size={48} />
                    <span className="text-gold">Click or drag poster here</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, 'poster')}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>

            {/* Logo */}
            <div>
              <label className="block text-gold mb-2 font-medium">Title Logo (transparent preferred)</label>
              <div className="border-2 border-dashed border-gold/40 rounded-xl p-6 text-center hover:border-gold transition">
                {logoPreview ? (
                  <div className="relative">
                    <img src={logoPreview} alt="Logo preview" className="max-h-32 mx-auto object-contain" />
                    <button
                      type="button"
                      onClick={() => { setLogoFile(null); setLogoPreview(null); }}
                      className="absolute top-2 right-2 bg-red-600/80 p-2 rounded-full"
                    >
                      <X size={20} />
                    </button>
                  </div>
                ) : (
                  <label className="cursor-pointer flex flex-col items-center">
                    <Upload className="text-gold mb-3" size={48} />
                    <span className="text-gold">Click or drag logo here</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, 'logo')}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>
          </div>

          {/* Trailer & Buy Links */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gold mb-2 font-medium">YouTube Trailer URL</label>
              <input
                type="url"
                value={form.trailer_url || ''}
                onChange={(e) => setForm({ ...form, trailer_url: e.target.value })}
                className="w-full bg-charcoal/70 border border-gold/40 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-gold"
                placeholder="https://www.youtube.com/watch?v=..."
              />
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-gold mb-2 font-medium">Buy Color Edition Link</label>
                <input
                  type="url"
                  value={form.buy_color_url || ''}
                  onChange={(e) => setForm({ ...form, buy_color_url: e.target.value })}
                  className="w-full bg-charcoal/70 border border-gold/40 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-gold"
                />
              </div>
              <div>
                <label className="block text-gold mb-2 font-medium">Buy Black & White Edition Link</label>
                <input
                  type="url"
                  value={form.buy_bw_url || ''}
                  onChange={(e) => setForm({ ...form, buy_bw_url: e.target.value })}
                  className="w-full bg-charcoal/70 border border-gold/40 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-gold"
                />
              </div>
            </div>
          </div>

          {/* Cast Builder */}
          <CastBuilder
            cast={form.cast || []}
            onChange={(newCast) => setForm({ ...form, cast: newCast })}
          />

          {/* Description */}
          <div>
            <label className="block text-gold mb-2 font-medium">Book Description</label>
            <textarea
              value={form.description || ''}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={6}
              className="w-full bg-charcoal/70 border border-gold/40 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-gold"
              placeholder="Write a compelling synopsis..."
            />
          </div>

          {error && <p className="text-red-400 text-center font-medium">{error}</p>}

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 pt-6 border-t border-gold/20">
            {isEdit && (
              <button
                type="button"
                onClick={() => setShowConfirm(true)}
                disabled={loading}
                className="px-6 py-3 bg-red-700/70 text-white rounded-lg hover:bg-red-600 transition flex items-center gap-2 disabled:opacity-50"
              >
                <Trash2 size={18} /> Delete Book
              </button>
            )}
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-gold text-charcoal font-bold rounded-lg hover:bg-yellow-400 transition flex items-center gap-2 disabled:opacity-50"
            >
              <Save size={18} />
              {loading ? 'Saving...' : isEdit ? 'Update Book' : 'Create Book'}
            </button>
          </div>
        </form>
      </div>

      {showConfirm && (
        <ConfirmModal
          title="Delete Book?"
          message="This action cannot be undone."
          onConfirm={handleDelete}
          onCancel={() => setShowConfirm(false)}
          loading={loading}
        />
      )}

      {showSuccess && <SuccessToast message={isEdit ? "Book updated!" : "Book created!"} />}
    </div>
  );
}
