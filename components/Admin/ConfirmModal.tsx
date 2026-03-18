interface ConfirmModalProps {
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading: boolean;
}

export default function ConfirmModal({ title, message, onConfirm, onCancel, loading }: ConfirmModalProps) {
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[100]">
      <div className="bg-charcoal border border-gold/30 rounded-2xl p-8 max-w-md w-full text-center">
        <h3 className="text-2xl font-serif text-gold mb-4">{title}</h3>
        <p className="text-gray-300 mb-8">{message}</p>
        <div className="flex justify-center gap-6">
          <button
            onClick={onCancel}
            disabled={loading}
            className="px-8 py-3 border border-gold/60 rounded-lg hover:bg-gold/10 transition disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="px-8 py-3 bg-red-700 text-white rounded-lg hover:bg-red-600 transition disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}
