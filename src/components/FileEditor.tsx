import { useState } from "react";
import {
  FiArrowLeft,
  FiCheckCircle,
  FiEdit3,
  FiSave,
  FiX,
} from "react-icons/fi";
import type { FileNode } from "@/types/file";

type FileEditorProps = {
  file: FileNode | null;
  saveMessage: string;
  className?: string;
  closeIcon?: "back" | "close";
  closeLabel?: string;
  onSave: (fileId: string, content: string) => void;
  onClose: () => void;
};

export default function FileEditor({
  file,
  saveMessage,
  className,
  closeIcon = "close",
  closeLabel = "Close",
  onSave,
  onClose,
}: FileEditorProps) {
  const [draft, setDraft] = useState({
    content: file?.content || "",
    fileId: file?.id || null,
  });
  const CloseIcon = closeIcon === "back" ? FiArrowLeft : FiX;

  if (!file) {
    return (
      <section
        className={`flex flex-col rounded-4xl border border-white/70 bg-white/80 p-5 shadow-sm shadow-slate-200/70 backdrop-blur-xl lg:p-6 ${
          className || "min-h-105 xl:min-h-0 xl:h-full"
        }`}
      >
        <div className="flex min-h-0 flex-1 flex-col items-center justify-center rounded-4xl border border-dashed border-slate-200 bg-slate-50/80 p-6 text-center lg:p-8">
          <div className="flex size-14 items-center justify-center rounded-3xl bg-blue-50 text-2xl text-blue-600 lg:size-16 lg:text-3xl">
            <FiEdit3 />
          </div>
          <h3 className="mt-3 text-base font-black text-slate-800 lg:mt-4 lg:text-lg">
            No file opened
          </h3>
          <p className="mt-1 max-w-sm text-xs font-medium text-slate-500 lg:text-sm">
            Select a text file from the sidebar or main panel to edit its
            content.
          </p>
        </div>
      </section>
    );
  }

  const content = draft.fileId === file.id ? draft.content : file.content || "";

  return (
    <section
      className={`flex flex-col rounded-4xl border border-white/70 bg-white/80 p-4 shadow-sm shadow-slate-200/70 backdrop-blur-xl lg:p-5 ${
        className || "min-h-130 xl:min-h-0 xl:h-full"
      }`}
    >
      <div className="mb-4 flex shrink-0 flex-col gap-3 border-b border-slate-100 pb-4 sm:flex-row sm:items-center sm:justify-between lg:mb-5 lg:gap-4 lg:pb-5">
        <div className="min-w-0">
          <p className="mb-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-blue-600 lg:mb-2 lg:text-xs lg:tracking-[0.22em]">
            Editing Text File
          </p>
          <h2 className="truncate text-lg font-black tracking-tight text-slate-950 lg:text-xl">
            {file.name}
          </h2>

          {saveMessage && (
            <div className="mt-2 flex items-center gap-2 text-xs font-bold text-emerald-600 lg:text-sm">
              <FiCheckCircle className="size-4" />
              <span>{saveMessage}</span>
            </div>
          )}
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-bold text-slate-600 transition hover:bg-slate-50 lg:px-4 lg:text-sm"
          >
            <CloseIcon className="size-4" />
            {closeLabel}
          </button>

          <button
            onClick={() => onSave(file.id, content)}
            className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-blue-600/25 transition hover:-translate-y-0.5 hover:bg-blue-700 lg:px-5 lg:text-sm"
          >
            <FiSave className="size-4" />
            Save
          </button>
        </div>
      </div>

      <textarea
        value={content}
        onChange={(event) =>
          setDraft({ content: event.target.value, fileId: file.id })
        }
        className="min-h-0 flex-1 resize-none rounded-[1.75rem] border border-slate-200 bg-slate-50/80 p-4 text-xs font-medium leading-6 text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 lg:p-5 lg:text-sm lg:leading-7"
        placeholder="Write your text content here..."
      />
    </section>
  );
}
