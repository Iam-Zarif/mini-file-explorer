"use client";

import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import {
  FiFilePlus,
  FiFolder,
  FiFolderPlus,
  FiRefreshCw,
  FiX,
} from "react-icons/fi";
import FileEditor from "@/components/FileEditor";
import MainPanel from "@/components/MainPanel";
import Modal from "@/components/Modal";
import Sidebar from "@/components/Sidebar";
import Toolbar from "@/components/Toolbar";
import { mockFileSystem } from "@/data/mockFileSystem";
import type { FileNode } from "@/types/file";
import {
  addNodeToFolder,
  deleteNode,
  findNodeById,
  generateId,
  getParentFolderId,
  renameNode,
  updateFileContent,
} from "@/utils/fileTree";

type ModalMode = "create-folder" | "create-file" | "rename" | null;
type FileSystemUpdate = FileNode | ((currentTree: FileNode) => FileNode);

const STORAGE_KEY = "mini-file-explorer-data";

const fileSystemSubscribers = new Set<() => void>();
let cachedStoredData: string | null | undefined;
let cachedFileSystem: FileNode = mockFileSystem;

const parseStoredFileSystem = (storedData: string | null) => {
  if (!storedData) return mockFileSystem;

  try {
    return JSON.parse(storedData) as FileNode;
  } catch {
    return mockFileSystem;
  }
};

const emitFileSystemChange = () => {
  fileSystemSubscribers.forEach((subscriber) => subscriber());
};

const getFileSystemSnapshot = () => {
  if (typeof window === "undefined") return mockFileSystem;

  const storedData = window.localStorage.getItem(STORAGE_KEY);

  if (storedData === cachedStoredData) {
    return cachedFileSystem;
  }

  cachedStoredData = storedData;
  cachedFileSystem = parseStoredFileSystem(storedData);

  return cachedFileSystem;
};

const getServerFileSystemSnapshot = () => mockFileSystem;

const subscribeToFileSystem = (callback: () => void) => {
  fileSystemSubscribers.add(callback);

  if (typeof window === "undefined") {
    return () => {
      fileSystemSubscribers.delete(callback);
    };
  }

  const handleStorage = (event: StorageEvent) => {
    if (event.key !== STORAGE_KEY) return;

    cachedStoredData = event.newValue;
    cachedFileSystem = parseStoredFileSystem(event.newValue);
    callback();
  };

  window.addEventListener("storage", handleStorage);

  return () => {
    fileSystemSubscribers.delete(callback);
    window.removeEventListener("storage", handleStorage);
  };
};

const writeFileSystemSnapshot = (nextFileSystem: FileNode) => {
  const storedData = JSON.stringify(nextFileSystem);

  cachedStoredData = storedData;
  cachedFileSystem = nextFileSystem;
  window.localStorage.setItem(STORAGE_KEY, storedData);
  emitFileSystemChange();
};

const clearFileSystemSnapshot = () => {
  cachedStoredData = null;
  cachedFileSystem = mockFileSystem;
  window.localStorage.removeItem(STORAGE_KEY);
  emitFileSystemChange();
};

export default function Home() {
  const fileSystem = useSyncExternalStore(
    subscribeToFileSystem,
    getFileSystemSnapshot,
    getServerFileSystemSnapshot,
  );
  const [selectedFolderId, setSelectedFolderId] = useState("root");
  const [openedFileId, setOpenedFileId] = useState<string | null>(null);
  const [expandedFolderIds, setExpandedFolderIds] = useState<string[]>([
    "root",
  ]);

  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [modalValue, setModalValue] = useState("");
  const [targetNode, setTargetNode] = useState<FileNode | null>(null);
  const [saveMessage, setSaveMessage] = useState("");
  const [isActionMenuOpen, setIsActionMenuOpen] = useState(false);
  const [isSidebarDrawerOpen, setIsSidebarDrawerOpen] = useState(false);
  const [isFileEditorDrawerOpen, setIsFileEditorDrawerOpen] = useState(false);

  const setFileSystem = (nextValue: FileSystemUpdate) => {
    const nextFileSystem =
      typeof nextValue === "function"
        ? nextValue(getFileSystemSnapshot())
        : nextValue;

    writeFileSystemSnapshot(nextFileSystem);
  };

  useEffect(() => {
    if (!saveMessage) return;

    const timeoutId = window.setTimeout(() => {
      setSaveMessage("");
    }, 2200);

    return () => window.clearTimeout(timeoutId);
  }, [saveMessage]);

  const selectedFolder = useMemo(() => {
    const folder = findNodeById(fileSystem, selectedFolderId);
    return folder?.type === "folder" ? folder : fileSystem;
  }, [fileSystem, selectedFolderId]);

  const openedFile = useMemo(() => {
    if (!openedFileId) return null;

    const file = findNodeById(fileSystem, openedFileId);
    return file?.type === "file" ? file : null;
  }, [fileSystem, openedFileId]);

  const selectedFolderParentId = useMemo(
    () => getParentFolderId(fileSystem, selectedFolderId),
    [fileSystem, selectedFolderId],
  );

  const hasOpenMobileOverlay =
    isActionMenuOpen ||
    isSidebarDrawerOpen ||
    (isFileEditorDrawerOpen && Boolean(openedFile));

  useEffect(() => {
    if (!hasOpenMobileOverlay) return;

    const originalOverflow = document.body.style.overflow;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;

      if (isFileEditorDrawerOpen) {
        setIsFileEditorDrawerOpen(false);
        return;
      }

      if (isSidebarDrawerOpen) {
        setIsSidebarDrawerOpen(false);
        return;
      }

      setIsActionMenuOpen(false);
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [
    hasOpenMobileOverlay,
    isActionMenuOpen,
    isFileEditorDrawerOpen,
    isSidebarDrawerOpen,
  ]);

  const selectedFolderItemsCount = selectedFolder.children?.length || 0;

  const openMobileEditorDrawer = () => {
    if (window.matchMedia("(max-width: 1023px)").matches) {
      setIsFileEditorDrawerOpen(true);
    }
  };

  const closeOpenedFile = () => {
    setOpenedFileId(null);
    setSaveMessage("");
    setIsFileEditorDrawerOpen(false);
  };

  const toggleFolder = (folderId: string) => {
    setExpandedFolderIds((currentIds) =>
      currentIds.includes(folderId)
        ? currentIds.filter((id) => id !== folderId)
        : [...currentIds, folderId],
    );
  };

  const openFolder = (folderId: string) => {
    setSelectedFolderId(folderId);
    setOpenedFileId(null);
    setSaveMessage("");
    setIsActionMenuOpen(false);
    setIsSidebarDrawerOpen(false);
    setIsFileEditorDrawerOpen(false);

    setExpandedFolderIds((currentIds) =>
      currentIds.includes(folderId) ? currentIds : [...currentIds, folderId],
    );
  };

  const goBackToParentFolder = () => {
    if (!selectedFolderParentId) return;

    setSelectedFolderId(selectedFolderParentId);
    setOpenedFileId(null);
    setSaveMessage("");
    setIsActionMenuOpen(false);
    setIsSidebarDrawerOpen(false);
    setIsFileEditorDrawerOpen(false);

    setExpandedFolderIds((currentIds) =>
      currentIds.includes(selectedFolderParentId)
        ? currentIds
        : [...currentIds, selectedFolderParentId],
    );
  };

  const openFile = (fileId: string) => {
    setOpenedFileId(fileId);
    setSaveMessage("");
    setIsActionMenuOpen(false);
    setIsSidebarDrawerOpen(false);
    openMobileEditorDrawer();

    const parentFolderId = getParentFolderId(fileSystem, fileId);

    if (parentFolderId) {
      setSelectedFolderId(parentFolderId);

      setExpandedFolderIds((currentIds) =>
        currentIds.includes(parentFolderId)
          ? currentIds
          : [...currentIds, parentFolderId],
      );
    }
  };

  const openModal = (mode: ModalMode, node?: FileNode) => {
    setIsActionMenuOpen(false);
    setModalMode(mode);
    setTargetNode(node || null);
    setModalValue(mode === "rename" && node ? node.name : "");
  };

  const closeModal = () => {
    setModalMode(null);
    setModalValue("");
    setTargetNode(null);
  };

  const handleModalConfirm = () => {
    const trimmedValue = modalValue.trim();

    if (!trimmedValue) return;

    if (modalMode === "create-folder") {
      const newFolder: FileNode = {
        id: generateId(),
        name: trimmedValue,
        type: "folder",
        children: [],
      };

      setFileSystem((currentTree) =>
        addNodeToFolder(currentTree, selectedFolderId, newFolder),
      );

      setExpandedFolderIds((currentIds) =>
        currentIds.includes(selectedFolderId)
          ? currentIds
          : [...currentIds, selectedFolderId],
      );
    }

    if (modalMode === "create-file") {
      const fileName = trimmedValue.endsWith(".txt")
        ? trimmedValue
        : `${trimmedValue}.txt`;

      const newFile: FileNode = {
        id: generateId(),
        name: fileName,
        type: "file",
        content: "",
      };

      setFileSystem((currentTree) =>
        addNodeToFolder(currentTree, selectedFolderId, newFile),
      );

      setExpandedFolderIds((currentIds) =>
        currentIds.includes(selectedFolderId)
          ? currentIds
          : [...currentIds, selectedFolderId],
      );
    }

    if (modalMode === "rename" && targetNode) {
      setFileSystem((currentTree) =>
        renameNode(currentTree, targetNode.id, trimmedValue),
      );
    }

    closeModal();
  };

  const handleDelete = (node: FileNode) => {
    if (node.id === "root") return;

    const isConfirmed = window.confirm(
      `Are you sure you want to delete "${node.name}"?`,
    );

    if (!isConfirmed) return;

    setFileSystem((currentTree) => deleteNode(currentTree, node.id));

    if (selectedFolderId === node.id) {
      setSelectedFolderId("root");
    }

    if (openedFileId === node.id) {
      setOpenedFileId(null);
      setIsFileEditorDrawerOpen(false);
    }

    setExpandedFolderIds((currentIds) =>
      currentIds.filter((id) => id !== node.id),
    );
  };

  const handleSaveFile = (fileId: string, content: string) => {
    setFileSystem((currentTree) =>
      updateFileContent(currentTree, fileId, content),
    );

    setSaveMessage("saved");
  };

  const handleReset = () => {
    const isConfirmed = window.confirm(
      "Reset the explorer to the original mock data?",
    );

    if (!isConfirmed) return;

    clearFileSystemSnapshot();
    setSelectedFolderId("root");
    setOpenedFileId(null);
    setExpandedFolderIds(["root"]);
    setSaveMessage("");
    setIsActionMenuOpen(false);
    setIsSidebarDrawerOpen(false);
    setIsFileEditorDrawerOpen(false);
  };

  const getModalTitle = () => {
    if (modalMode === "create-folder") return "Create New Folder";
    if (modalMode === "create-file") return "Create New Text File";
    if (modalMode === "rename") return "Rename Item";
    return "";
  };

  const getModalButtonText = () => {
    if (modalMode === "rename") return "Save Name";
    return "Create";
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,#dbeafe,transparent_28%),radial-gradient(circle_at_bottom_right,#e0e7ff,transparent_30%),linear-gradient(135deg,#f8fafc,#eef2ff)] p-4 text-slate-900 md:p-6">
      <div className="mx-auto flex min-h-[calc(100vh-32px)] max-w-375 flex-col gap-5 md:min-h-[calc(100vh-48px)] lg:grid lg:grid-cols-[320px_1fr]">
        <div className="hidden min-h-0 lg:block lg:h-full">
          <Sidebar
            fileSystem={fileSystem}
            selectedFolderId={selectedFolderId}
            openedFileId={openedFileId}
            expandedFolderIds={expandedFolderIds}
            onToggleFolder={toggleFolder}
            onSelectFolder={openFolder}
            onOpenFile={openFile}
          />
        </div>

        <div className="flex min-h-0 flex-1 flex-col gap-5">
          <Toolbar
            selectedFolderName={selectedFolder.name}
            totalItems={selectedFolderItemsCount}
            canGoBack={Boolean(selectedFolderParentId)}
            onOpenActionMenu={() => setIsActionMenuOpen(true)}
            onGoBack={goBackToParentFolder}
            onCreateFolder={() => openModal("create-folder")}
            onCreateFile={() => openModal("create-file")}
            onReset={handleReset}
          />

          <div className="grid min-h-0 flex-1 gap-5 xl:grid-cols-[1fr_430px]">
            <MainPanel
              selectedFolder={selectedFolder}
              onOpenFolder={openFolder}
              onOpenFile={openFile}
              onRename={(node) => openModal("rename", node)}
              onDelete={handleDelete}
            />

            <div className="hidden min-h-0 lg:block">
              <FileEditor
                file={openedFile}
                saveMessage={saveMessage}
                onSave={handleSaveFile}
                onClose={closeOpenedFile}
              />
            </div>
          </div>
        </div>
      </div>

      {isActionMenuOpen && (
        <div
          className="fixed inset-0 z-50 lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Explorer actions"
        >
          <button
            type="button"
            aria-label="Close actions"
            onClick={() => setIsActionMenuOpen(false)}
            className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm"
          />

          <div className="absolute right-3 top-3 w-[min(88vw,340px)] rounded-4xl border border-white/70 bg-white p-3.5 shadow-2xl shadow-slate-950/20 sm:right-4 sm:top-4">
            <div className="mb-4 flex items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-blue-600">
                  Menu
                </p>
                <h2 className="mt-1 text-base font-black text-slate-950">
                  Explorer Actions
                </h2>
              </div>

              <button
                type="button"
                aria-label="Close actions"
                onClick={() => setIsActionMenuOpen(false)}
                className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-slate-700 transition hover:bg-slate-200"
              >
                <FiX className="size-5" />
              </button>
            </div>

            <div className="grid gap-2">
              <button
                type="button"
                onClick={() => {
                  setIsActionMenuOpen(false);
                  setIsSidebarDrawerOpen(true);
                }}
                className="flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3 text-left text-xs font-bold text-slate-700 transition hover:bg-blue-50 hover:text-blue-700"
              >
                <FiFolder className="size-5 shrink-0" />
                Browse
              </button>

              <button
                type="button"
                onClick={() => openModal("create-folder")}
                className="flex items-center gap-3 rounded-2xl bg-blue-50 px-4 py-3 text-left text-xs font-bold text-blue-700 transition hover:bg-blue-100"
              >
                <FiFolderPlus className="size-5 shrink-0" />
                New Folder
              </button>

              <button
                type="button"
                onClick={() => openModal("create-file")}
                className="flex items-center gap-3 rounded-2xl bg-blue-600 px-4 py-3 text-left text-xs font-bold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700"
              >
                <FiFilePlus className="size-5 shrink-0" />
                New Text File
              </button>

              <button
                type="button"
                onClick={handleReset}
                className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-left text-xs font-bold text-slate-600 transition hover:bg-slate-50"
              >
                <FiRefreshCw className="size-5 shrink-0" />
                Reset
              </button>
            </div>
          </div>
        </div>
      )}

      {isSidebarDrawerOpen && (
        <div
          className="fixed inset-0 z-50 lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Folder tree"
        >
          <button
            type="button"
            aria-label="Close folder drawer"
            onClick={() => setIsSidebarDrawerOpen(false)}
            className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm"
          />

          <div className="absolute inset-y-0 left-0 flex w-[min(88vw,360px)] flex-col p-3 sm:p-4">
            <div className="mb-3 flex items-center justify-between px-1">
              <p className="text-xs font-black uppercase tracking-[0.22em] text-white/80">
                Folders
              </p>

              <button
                type="button"
                aria-label="Close drawer"
                onClick={() => setIsSidebarDrawerOpen(false)}
                className="flex size-10 items-center justify-center rounded-2xl bg-white text-slate-700 shadow-lg shadow-slate-950/15 transition hover:bg-slate-50"
              >
                <FiX className="size-5" />
              </button>
            </div>

            <div className="min-h-0 flex-1">
              <Sidebar
                fileSystem={fileSystem}
                selectedFolderId={selectedFolderId}
                openedFileId={openedFileId}
                expandedFolderIds={expandedFolderIds}
                className="h-full min-h-0"
                onToggleFolder={toggleFolder}
                onSelectFolder={openFolder}
                onOpenFile={openFile}
              />
            </div>
          </div>
        </div>
      )}

      {openedFile && isFileEditorDrawerOpen && (
        <div
          className="fixed inset-0 z-50 lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Text file editor"
        >
          <button
            type="button"
            aria-label="Close text file editor"
            onClick={closeOpenedFile}
            className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm"
          />

          <div className="absolute inset-x-0 bottom-0 flex h-[min(88vh,760px)] flex-col p-3 sm:p-4">
            <FileEditor
              file={openedFile}
              saveMessage={saveMessage}
              className="h-full min-h-0"
              closeIcon="back"
              closeLabel="Back"
              onSave={handleSaveFile}
              onClose={closeOpenedFile}
            />
          </div>
        </div>
      )}

      {modalMode && (
        <Modal
          title={getModalTitle()}
          value={modalValue}
          confirmText={getModalButtonText()}
          onChange={setModalValue}
          onClose={closeModal}
          onConfirm={handleModalConfirm}
        />
      )}
    </main>
  );
}
