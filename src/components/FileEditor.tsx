import { useEffect, useState } from "react";
import type { FileNode } from "@/types/file";

type FileEditorProps = {
  file: FileNode | null;
  onSave: (fileId: string, content: string) => void;
  onClose: () => void;
};

export default function FileEditor({ file, onSave, onClose }: FileEditorProps) {
  const [content, setContent] = useState("");

  useEffect(() => {
    setContent(file?.content || "");
  }, [file]);

  if (!file) {
    return (
      <section className="rounded-4xl border border-white/70 bg-white/80 p-6 shadow-sm shadow-slate-200/70 backdrop-blur-xl">
        <div className="flex min-h-96 flex-col items-center justify-center rounded-4xl border border-dashed border-slate-200 bg-slate-50/80 p-8 text-center">
          <div className="text-6xl">📝</div>
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
    <section className="rounded-4xl border border-white/70 bg-white/80 p-5 shadow-sm shadow-slate-200/70 backdrop-blur-xl">
      <div className="mb-5 flex flex-col gap-4 border-b border-slate-100 pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <p className="mb-2 text-xs font-black uppercase tracking-[0.22em] text-blue-600">
            Editing Text File
          </p>
          <h2 className="truncate text-xl font-black tracking-tight text-slate-950">
            {file.name}
          </h2>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-600 transition hover:bg-slate-50"
          >
            Close
          </button>

          <button
            onClick={() => onSave(file.id, content)}
            className="rounded-2xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-600/25 transition hover:-translate-y-0.5 hover:bg-blue-700"
          >
            Save
          </button>
        </div>
      </div>

      <textarea
        value={content}
        onChange={(event) => setContent(event.target.value)}
        className="min-h-96 w-full resize-none rounded-[1.75rem] border border-slate-200 bg-slate-50/80 p-5 text-sm font-medium leading-7 text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
        placeholder="Write your text content here..."
      />
    </section>
  );
}
