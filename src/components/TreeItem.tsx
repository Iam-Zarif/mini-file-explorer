import type { FileNode } from "@/types/file";

type TreeItemProps = {
  node: FileNode;
  level?: number;
  selectedFolderId: string;
  openedFileId: string | null;
  expandedFolderIds: string[];
  onToggleFolder: (folderId: string) => void;
  onSelectFolder: (folderId: string) => void;
  onOpenFile: (fileId: string) => void;
};

export default function TreeItem({
  node,
  level = 0,
  selectedFolderId,
  openedFileId,
  expandedFolderIds,
  onToggleFolder,
  onSelectFolder,
  onOpenFile,
}: TreeItemProps) {
  const isFolder = node.type === "folder";
  const isExpanded = expandedFolderIds.includes(node.id);
  const isSelectedFolder = selectedFolderId === node.id;
  const isOpenedFile = openedFileId === node.id;

  const handleItemClick = () => {
    if (isFolder) {
      onSelectFolder(node.id);
      onToggleFolder(node.id);
      return;
    }

    onOpenFile(node.id);
  };

  return (
    <div>
      <button
        onClick={handleItemClick}
        style={{ paddingLeft: `${level * 14 + 12}px` }}
        className={`group flex w-full items-center gap-2 rounded-2xl px-3 py-2.5 text-left text-sm transition ${
          isSelectedFolder || isOpenedFile
            ? "bg-blue-600 text-white shadow-lg shadow-blue-600/25"
            : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
        }`}
      >
        <span className="flex w-4 justify-center text-xs">
          {isFolder ? (isExpanded ? "▾" : "▸") : ""}
        </span>

        <span className="text-base">{isFolder ? "📁" : "📄"}</span>

        <span className="truncate font-bold">{node.name}</span>
      </button>

      {isFolder && isExpanded && node.children && (
        <div className="mt-1 space-y-1">
          {node.children.map((child) => (
            <TreeItem
              key={child.id}
              node={child}
              level={level + 1}
              selectedFolderId={selectedFolderId}
              openedFileId={openedFileId}
              expandedFolderIds={expandedFolderIds}
              onToggleFolder={onToggleFolder}
              onSelectFolder={onSelectFolder}
              onOpenFile={onOpenFile}
            />
          ))}
        </div>
      )}
    </div>
  );
}
