// components/TrailerModal.jsx
import { Dialog } from "@headlessui/react";

export default function TrailerModal({ open, onClose, videoId }) {
  if (!open) return null;
  const src = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`;

  return (
    <Dialog open={open} onClose={onClose} className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/60" aria-hidden />
      <div className="relative w-full max-w-3xl mx-4">
        <iframe className="w-full aspect-video rounded-xl" src={src} title="Trailer" allow="autoplay; encrypted-media" />
        <button onClick={onClose} className="absolute top-3 right-3 bg-white rounded-full p-2">X</button>
      </div>
    </Dialog>
  );
}
