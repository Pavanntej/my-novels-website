import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';

interface SuccessToastProps {
  message: string;
}

export default function SuccessToast({ message }: SuccessToastProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-green-800/90 text-white px-10 py-5 rounded-full shadow-2xl flex items-center gap-4 z-[200] border border-green-400/30"
    >
      <CheckCircle size={28} className="text-green-300" />
      <span className="text-lg font-medium">{message}</span>
    </motion.div>
  );
}
