import type { FileNode } from "@/types/file";
import TreeItem from "./TreeItem";

type SidebarProps = {
  fileSystem: FileNode;
  selectedFolderId: string;
  openedFileId: string | null;
  expandedFolderIds: string[];
  onToggleFolder: (folderId: string) => void;
  onSelectFolder: (folderId: string) => void;
  onOpenFile: (fileId: string) => void;
};

export default function Sidebar({
  fileSystem,
  selectedFolderId,
  openedFileId,
  expandedFolderIds,
  onToggleFolder,
  onSelectFolder,
  onOpenFile,
}: SidebarProps) {
  return (
    <aside className="h-full rounded-4xl border border-white/70 bg-white/85 p-4 shadow-sm shadow-slate-200/70 backdrop-blur-xl">
      <div className="mb-5 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-linear-to-br from-blue-600 to-indigo-600 text-xl text-white shadow-lg shadow-blue-600/25">
            🗂️
          </div>

          <div className="min-w-0">
            <h2 className="truncate text-base font-black text-slate-950">
              Mini Explorer
            </h2>
            <p className="text-xs font-medium text-slate-500">
              Folder tree view
            </p>
          </div>
        </div>
      </div>

      <div className="max-h-[calc(100vh-180px)] space-y-1 overflow-y-auto pr-1">
        <TreeItem
          node={fileSystem}
          selectedFolderId={selectedFolderId}
          openedFileId={openedFileId}
          expandedFolderIds={expandedFolderIds}
          onToggleFolder={onToggleFolder}
          onSelectFolder={onSelectFolder}
          onOpenFile={onOpenFile}
        />
      </div>
    </aside>
  );
}
