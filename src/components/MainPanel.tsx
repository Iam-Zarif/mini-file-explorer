import type { FileNode } from "@/types/file";

type MainPanelProps = {
  selectedFolder: FileNode;
  onOpenFolder: (folderId: string) => void;
  onOpenFile: (fileId: string) => void;
  onRename: (node: FileNode) => void;
  onDelete: (node: FileNode) => void;
};

export default function MainPanel({
  selectedFolder,
  onOpenFolder,
  onOpenFile,
  onRename,
  onDelete,
}: MainPanelProps) {
  const children = selectedFolder.children || [];

  return (
    <section className="flex min-h-130 flex-col rounded-4xl border border-white/70 bg-white/80 p-4 shadow-sm shadow-slate-200/70 backdrop-blur-xl lg:p-5 xl:min-h-0 xl:h-full">
      <div className="mb-4 shrink-0 lg:mb-5">
        <p className="mb-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-slate-400 lg:mb-2 lg:text-xs lg:tracking-[0.22em]">
          Main Panel
        </p>
        <h2 className="text-lg font-black tracking-tight text-slate-950 lg:text-xl">
          Folder Contents
        </h2>
        <p className="mt-1 text-xs font-medium text-slate-500 lg:text-sm">
          Open, rename, or delete folders and files.
        </p>
      </div>

      {children.length === 0 ? (
        <div className="flex min-h-0 flex-1 flex-col items-center justify-center rounded-4xl border border-dashed border-slate-200 bg-slate-50/80 p-6 text-center lg:p-8">
          <div className="text-5xl lg:text-6xl">📭</div>
          <h3 className="mt-3 text-base font-black text-slate-800 lg:mt-4 lg:text-lg">
            This folder is empty
          </h3>
          <p className="mt-1 max-w-sm text-xs font-medium text-slate-500 lg:text-sm">
            Create a folder or text file to start organizing your workspace.
          </p>
        </div>
      ) : (
        <div className="min-h-0 flex-1 overflow-y-auto pr-1">
          <div className="grid gap-4 sm:grid-cols-2 2xl:grid-cols-3">
            {children.map((item) => (
              <article
                key={item.id}
                className="group rounded-[1.75rem] border border-slate-100 bg-white p-3.5 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-blue-100 hover:shadow-xl hover:shadow-slate-200/80 lg:p-4"
              >
                <button
                  onClick={() =>
                    item.type === "folder"
                      ? onOpenFolder(item.id)
                      : onOpenFile(item.id)
                  }
                  className="flex w-full items-start gap-4 text-left"
                >
                  <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br from-slate-100 to-slate-50 text-2xl transition group-hover:from-blue-50 group-hover:to-indigo-50 lg:size-14 lg:text-3xl">
                    {item.type === "folder" ? "📁" : "📄"}
                  </div>

                  <div className="min-w-0 pt-1">
                    <h3 className="truncate text-sm font-black text-slate-900 lg:text-base">
                      {item.name}
                    </h3>
                    <p className="mt-1 text-[10px] font-black uppercase tracking-wide text-slate-400 lg:text-xs">
                      {item.type === "folder" ? "Folder" : "Text File"}
                    </p>
                  </div>
                </button>

                <div className="mt-5 flex gap-2 border-t border-slate-100 pt-4">
                  <button
                    onClick={() => onRename(item)}
                    className="flex-1 rounded-2xl bg-slate-100 px-3 py-2.5 text-[11px] font-black text-slate-600 transition hover:bg-blue-50 hover:text-blue-700 lg:text-xs"
                  >
                    Rename
                  </button>

                  <button
                    onClick={() => onDelete(item)}
                    className="flex-1 rounded-2xl bg-red-50 px-3 py-2.5 text-[11px] font-black text-red-600 transition hover:bg-red-100 lg:text-xs"
                  >
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
