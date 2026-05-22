import { useEffect, useState } from "react";
import { FiCheckCircle, FiEdit3, FiSave, FiX } from "react-icons/fi";
import type { FileNode } from "@/types/file";

type FileEditorProps = {
  file: FileNode | null;
  saveMessage: string;
  onSave: (fileId: string, content: string) => void;
  onClose: () => void;
};

export default function FileEditor({
  file,
  saveMessage,
  onSave,
  onClose,
}: FileEditorProps) {
  const [content, setContent] = useState("");

  useEffect(() => {
    setContent(file?.content || "");
  }, [file]);

  if (!file) {
    return (
      <section className="flex min-h-105 flex-col rounded-4xl border border-white/70 bg-white/80 p-6 shadow-sm shadow-slate-200/70 backdrop-blur-xl xl:min-h-0 xl:h-full">
        <div className="flex min-h-0 flex-1 flex-col items-center justify-center rounded-4xl border border-dashed border-slate-200 bg-slate-50/80 p-8 text-center">
          <div className="flex size-16 items-center justify-center rounded-3xl bg-blue-50 text-3xl text-blue-600">
            <FiEdit3 />
          </div>
          <h3 className="mt-4 text-lg font-black text-slate-800">
            No file opened
          </h3>
          <p className="mt-1 max-w-sm text-sm font-medium text-slate-500">
            Select a text file from the sidebar or main panel to edit its
            content.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="flex min-h-130 flex-col rounded-4xl border border-white/70 bg-white/80 p-5 shadow-sm shadow-slate-200/70 backdrop-blur-xl xl:min-h-0 xl:h-full">
      <div className="mb-5 flex shrink-0 flex-col gap-4 border-b border-slate-100 pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <p className="mb-2 text-xs font-black uppercase tracking-[0.22em] text-blue-600">
            Editing Text File
          </p>
          <h2 className="truncate text-xl font-black tracking-tight text-slate-950">
            {file.name}
          </h2>

          {saveMessage && (
            <div className="mt-2 flex items-center gap-2 text-sm font-bold text-emerald-600">
              <FiCheckCircle className="size-4" />
              <span>{saveMessage}</span>
            </div>
          )}
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-600 transition hover:bg-slate-50"
          >
            <FiX className="size-4" />
            Close
          </button>

          <button
            onClick={() => onSave(file.id, content)}
            className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-600/25 transition hover:-translate-y-0.5 hover:bg-blue-700"
          >
            <FiSave className="size-4" />
            Save
          </button>
        </div>
      </div>

      <textarea
        value={content}
        onChange={(event) => setContent(event.target.value)}
        className="min-h-0 flex-1 resize-none rounded-[1.75rem] border border-slate-200 bg-slate-50/80 p-5 text-sm font-medium leading-7 text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
        placeholder="Write your text content here..."
      />
    </section>
  );
}
