import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, AlertTriangle, X } from 'lucide-react';

export default function ConfirmDeleteModal({
  isOpen,
  onClose,
  onConfirm,
  title = 'Delete Confirmation',
  description = 'Are you sure you want to delete this item? This action cannot be undone.',
  confirmText = 'Yes, Delete',
  cancelText = 'Cancel'
}) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 15 }}
          transition={{ duration: 0.18, ease: 'easeOut' }}
          className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 p-7 z-10 text-center space-y-4"
        >
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer"
          >
            <X size={18} />
          </button>

          {/* Warning Icon with red pulse */}
          <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto shadow-inner border border-rose-100">
            <Trash2 size={28} />
          </div>

          <div className="space-y-1.5">
            <h3 className="text-xl font-bold text-slate-900">{title}</h3>
            <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">{description}</p>
          </div>

          <div className="pt-3 grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={onClose}
              className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition cursor-pointer"
            >
              {cancelText}
            </button>
            <button
              type="button"
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className="w-full py-3 bg-rose-600 hover:bg-rose-700 active:scale-95 text-white font-bold rounded-xl text-xs shadow-lg shadow-rose-600/25 transition cursor-pointer"
            >
              {confirmText}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
