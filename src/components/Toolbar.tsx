type ToolbarProps = {
  selectedFolderName: string;
  totalItems: number;
  onCreateFolder: () => void;
  onCreateFile: () => void;
  onReset: () => void;
};

export default function Toolbar({
  selectedFolderName,
  totalItems,
  onCreateFolder,
  onCreateFile,
  onReset,
}: ToolbarProps) {
  return (
    <div className="overflow-hidden rounded-4xl border border-white/70 bg-white/80 p-5 shadow-sm shadow-slate-200/70 backdrop-blur-xl">
      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="mb-2 text-xs font-black uppercase tracking-[0.22em] text-blue-600">
            Current Folder
          </p>
          <h1 className="text-3xl font-black tracking-tight text-slate-950">
            {selectedFolderName}
          </h1>
          <p className="mt-1 text-sm font-medium text-slate-500">
            {totalItems} item{totalItems !== 1 ? "s" : ""} available here
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            onClick={onReset}
            className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-600 shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-50 hover:shadow-md"
          >
            Reset
          </button>

          <button
            onClick={onCreateFolder}
            className="rounded-2xl border border-blue-100 bg-blue-50 px-5 py-3 text-sm font-bold text-blue-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-blue-100 hover:shadow-md"
          >
            + New Folder
          </button>

          <button
            onClick={onCreateFile}
            className="rounded-2xl bg-blue-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-blue-600/25 transition hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-xl"
          >
            + New Text File
          </button>
        </div>
      </div>
    </div>
  );
}
