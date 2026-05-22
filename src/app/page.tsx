"use client";

import { useEffect, useMemo, useState } from "react";
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

const STORAGE_KEY = "mini-file-explorer-data";

export default function Home() {
  const [fileSystem, setFileSystem] = useState<FileNode>(mockFileSystem);
  const [selectedFolderId, setSelectedFolderId] = useState("root");
  const [openedFileId, setOpenedFileId] = useState<string | null>(null);
  const [expandedFolderIds, setExpandedFolderIds] = useState<string[]>([
    "root",
  ]);

  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [modalValue, setModalValue] = useState("");
  const [targetNode, setTargetNode] = useState<FileNode | null>(null);

  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);

    if (!savedData) return;

    try {
      setFileSystem(JSON.parse(savedData) as FileNode);
    } catch {
      setFileSystem(mockFileSystem);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(fileSystem));
  }, [fileSystem]);

  const selectedFolder = useMemo(() => {
    const folder = findNodeById(fileSystem, selectedFolderId);
    return folder?.type === "folder" ? folder : fileSystem;
  }, [fileSystem, selectedFolderId]);

  const openedFile = useMemo(() => {
    if (!openedFileId) return null;

    const file = findNodeById(fileSystem, openedFileId);
    return file?.type === "file" ? file : null;
  }, [fileSystem, openedFileId]);

  const selectedFolderItemsCount = selectedFolder.children?.length || 0;

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

    setExpandedFolderIds((currentIds) =>
      currentIds.includes(folderId) ? currentIds : [...currentIds, folderId],
    );
  };

  const openFile = (fileId: string) => {
    setOpenedFileId(fileId);

    const parentFolderId = getParentFolderId(fileSystem, fileId);

    if (parentFolderId) {
      setSelectedFolderId(parentFolderId);
    }
  };

  const openModal = (mode: ModalMode, node?: FileNode) => {
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
    }

    setExpandedFolderIds((currentIds) =>
      currentIds.filter((id) => id !== node.id),
    );
  };

  const handleSaveFile = (fileId: string, content: string) => {
    setFileSystem((currentTree) =>
      updateFileContent(currentTree, fileId, content),
    );
  };

  const handleReset = () => {
    const isConfirmed = window.confirm(
      "Reset the explorer to the original mock data?",
    );

    if (!isConfirmed) return;

    localStorage.removeItem(STORAGE_KEY);
    setFileSystem(mockFileSystem);
    setSelectedFolderId("root");
    setOpenedFileId(null);
    setExpandedFolderIds(["root"]);
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
    <main className="min-h-screen  items-center justify-center  flex  bg-[radial-gradient(circle_at_top_left,#dbeafe,transparent_28%),radial-gradient(circle_at_bottom_right,#e0e7ff,transparent_30%),linear-gradient(135deg,#f8fafc,#eef2ff)] p-4 text-slate-900 md:p-6">
      <div className="mx-auto items-center h-full justify-center flex max-w-375 flex-col gap-5 lg:grid lg:grid-cols-[320px_1fr]">
        <Sidebar
          fileSystem={fileSystem}
          selectedFolderId={selectedFolderId}
          openedFileId={openedFileId}
          expandedFolderIds={expandedFolderIds}
          onToggleFolder={toggleFolder}
          onSelectFolder={openFolder}
          onOpenFile={openFile}
        />

        <div className="space-y-5">
          <Toolbar
            selectedFolderName={selectedFolder.name}
            totalItems={selectedFolderItemsCount}
            onCreateFolder={() => openModal("create-folder")}
            onCreateFile={() => openModal("create-file")}
            onReset={handleReset}
          />

          <div className="grid gap-5 xl:grid-cols-[1fr_430px]">
            <MainPanel
              selectedFolder={selectedFolder}
              onOpenFolder={openFolder}
              onOpenFile={openFile}
              onRename={(node) => openModal("rename", node)}
              onDelete={handleDelete}
            />

            <FileEditor
              file={openedFile}
              onSave={handleSaveFile}
              onClose={() => setOpenedFileId(null)}
            />
          </div>
        </div>
      </div>

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
