import {
  FiChevronDown,
  FiChevronRight,
  FiFileText,
  FiFolder,
  FiFolderMinus,
} from "react-icons/fi";
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
  const hasChildren = Boolean(node.children?.length);

  const handleItemClick = () => {
    if (isFolder) {
      onSelectFolder(node.id);
      return;
    }

    onOpenFile(node.id);
  };

  const handleToggleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();

    if (isFolder) {
      onToggleFolder(node.id);
    }
  };

  return (
    <div className="relative">
      <div
        className={`relative ${level > 0 ? "ml-5 border-l border-slate-200 pl-3" : ""}`}
      >
        {level > 0 && (
          <span className="absolute left-0 top-5 h-px w-3 bg-slate-200" />
        )}

        <button
          onClick={handleItemClick}
          className={`group flex w-full items-center gap-2 rounded-2xl px-3 py-2.5 text-left text-sm transition ${
            isSelectedFolder || isOpenedFile
              ? "bg-blue-600 text-white shadow-lg shadow-blue-600/25"
              : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
          }`}
        >
          <span className="flex size-5 shrink-0 items-center justify-center">
            {isFolder ? (
              <button
                type="button"
                onClick={handleToggleClick}
                className={`flex size-5 items-center justify-center rounded-md transition ${
                  isSelectedFolder
                    ? "text-white hover:bg-white/15"
                    : "text-slate-400 hover:bg-slate-200 hover:text-slate-700"
                }`}
                aria-label={isExpanded ? "Collapse folder" : "Expand folder"}
              >
                {isExpanded ? (
                  <FiChevronDown className="size-4" />
                ) : (
                  <FiChevronRight className="size-4" />
                )}
              </button>
            ) : (
              <span className="size-5" />
            )}
          </span>

          <span className="shrink-0 text-lg">
            {isFolder ? (
              isExpanded ? (
                <FiFolderMinus />
              ) : (
                <FiFolder />
              )
            ) : (
              <FiFileText />
            )}
          </span>

          <span className="truncate font-bold">{node.name}</span>

          {isFolder && hasChildren && (
            <span
              className={`ml-auto rounded-full px-2 py-0.5 text-[10px] font-black ${
                isSelectedFolder
                  ? "bg-white/15 text-white"
                  : "bg-slate-100 text-slate-400"
              }`}
            >
              {node.children?.length}
            </span>
          )}
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
    </div>
  );
}
