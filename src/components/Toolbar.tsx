import { FiArrowLeft, FiMenu } from "react-icons/fi";

type ToolbarProps = {
  selectedFolderName: string;
  totalItems: number;
  canGoBack: boolean;
  onOpenActionMenu: () => void;
  onGoBack: () => void;
  onCreateFolder: () => void;
  onCreateFile: () => void;
  onReset: () => void;
};

export default function Toolbar({
  selectedFolderName,
  totalItems,
  canGoBack,
  onOpenActionMenu,
  onGoBack,
  onCreateFolder,
  onCreateFile,
  onReset,
}: ToolbarProps) {
  return (
    <div className="overflow-hidden rounded-4xl border border-white/70 bg-white/80 p-4 shadow-sm shadow-slate-200/70 backdrop-blur-xl lg:p-5">
      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div className="flex min-w-0 items-start justify-between gap-4 lg:hidden">
          <div className="flex min-w-0 items-start gap-3">
            {canGoBack && (
              <button
                type="button"
                onClick={onGoBack}
                className="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-50"
                aria-label="Go back to parent folder"
              >
                <FiArrowLeft className="size-4" />
              </button>
            )}

            <div className="min-w-0">
              <p className="mb-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-blue-600">
                Current Folder
              </p>
              <h1 className="truncate text-2xl font-black tracking-tight text-slate-950">
                {selectedFolderName}
              </h1>
              <p className="mt-1 text-xs font-medium text-slate-500">
                {totalItems} item{totalItems !== 1 ? "s" : ""} available here
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onOpenActionMenu}
            className="flex size-11 shrink-0 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-50 lg:hidden"
            aria-label="Open actions"
          >
            <FiMenu className="size-5" />
          </button>
        </div>

        <div className="hidden lg:block">
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

        <div className="hidden gap-3 lg:flex">
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
