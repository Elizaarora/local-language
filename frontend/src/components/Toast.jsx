import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';

/* ─── Context ─────────────────────────────────────────────────── */

const ToastContext = createContext(null);

let toastId = 0;

const ICONS = {
  success: { icon: CheckCircle, color: 'text-emerald-500', bar: 'bg-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800' },
  error:   { icon: XCircle,     color: 'text-red-500',     bar: 'bg-red-500',     bg: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800' },
  warning: { icon: AlertTriangle,color: 'text-amber-500',  bar: 'bg-amber-500',   bg: 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800' },
  info:    { icon: Info,         color: 'text-blue-500',   bar: 'bg-blue-500',    bg: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800' },
};

/* ─── Single Toast Item ───────────────────────────────────────── */

function ToastItem({ toast, onDismiss }) {
  const [visible, setVisible] = useState(false);
  const cfg = ICONS[toast.type] || ICONS.info;
  const Icon = cfg.icon;

  useEffect(() => {
    // Mount → slide in
    requestAnimationFrame(() => setVisible(true));

    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(() => onDismiss(toast.id), 350);
    }, toast.duration || 4000);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setVisible(false);
    setTimeout(() => onDismiss(toast.id), 350);
  };

  return (
    <div
      className={`
        relative flex items-start gap-3 w-80 max-w-full
        bg-white dark:bg-[#242530] border rounded-2xl shadow-xl p-4
        overflow-hidden transition-all duration-350 ease-out
        ${cfg.bg}
        ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
      `}
    >
      {/* Progress bar */}
      <div
        className={`absolute bottom-0 left-0 h-0.5 ${cfg.bar} rounded-full`}
        style={{
          width: '100%',
          animation: `shrinkWidth ${toast.duration || 4000}ms linear forwards`,
        }}
      />

      <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${cfg.color}`} />

      <div className="flex-1 min-w-0">
        {toast.title && (
          <p className="font-semibold text-slate-900 dark:text-white text-sm">{toast.title}</p>
        )}
        <p className={`text-sm ${toast.title ? 'text-slate-600 dark:text-slate-400 mt-0.5' : 'text-slate-700 dark:text-slate-300 font-medium'}`}>
          {toast.message}
        </p>
      </div>

      <button
        onClick={handleClose}
        className="flex-shrink-0 p-0.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#2d2e3a] transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

/* ─── Provider ────────────────────────────────────────────────── */

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info', options = {}) => {
    const id = ++toastId;
    setToasts(prev => [...prev, { id, message, type, ...options }]);
    return id;
  }, []);

  const dismiss = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const toast = {
    success: (msg, opts) => addToast(msg, 'success', opts),
    error:   (msg, opts) => addToast(msg, 'error',   opts),
    warning: (msg, opts) => addToast(msg, 'warning', opts),
    info:    (msg, opts) => addToast(msg, 'info',    opts),
    dismiss,
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}

      {/* Toast Container */}
      <div className="fixed bottom-6 right-4 sm:right-6 z-[9999] flex flex-col gap-3 items-end pointer-events-none">
        {toasts.map(t => (
          <div key={t.id} className="pointer-events-auto">
            <ToastItem toast={t} onDismiss={dismiss} />
          </div>
        ))}
      </div>

      {/* Progress bar keyframe */}
      <style>{`
        @keyframes shrinkWidth {
          from { width: 100%; }
          to   { width: 0%; }
        }
      `}</style>
    </ToastContext.Provider>
  );
}

/* ─── Hook ────────────────────────────────────────────────────── */

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside <ToastProvider>');
  return ctx;
}

export default useToast;
