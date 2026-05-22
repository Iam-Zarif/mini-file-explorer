type ModalProps = {
  title: string;
  value: string;
  placeholder?: string;
  confirmText: string;
  onChange: (value: string) => void;
  onClose: () => void;
  onConfirm: () => void;
};

export default function Modal({
  title,
  value,
  placeholder = "Enter name",
  confirmText,
  onChange,
  onClose,
  onConfirm,
}: ModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-4xl border border-white/70 bg-white p-6 shadow-2xl shadow-slate-950/20">
        <div className="mb-5">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-blue-600">
            File Action
          </p>
          <h2 className="text-2xl font-black tracking-tight text-slate-950">
            {title}
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Use a clear name so the item is easy to identify.
          </p>
        </div>

        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          autoFocus
          onKeyDown={(event) => {
            if (event.key === "Enter") onConfirm();
            if (event.key === "Escape") onClose();
          }}
          className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
        />

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-2xl border border-slate-200 px-5 py-2.5 text-sm font-bold text-slate-600 transition hover:bg-slate-50"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="rounded-2xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-600/25 transition hover:-translate-y-0.5 hover:bg-blue-700"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
