import type { FileNode } from "@/types/file";

export const generateId = () => {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
};

export const findNodeById = (
  tree: FileNode,
  nodeId: string,
): FileNode | null => {
  if (tree.id === nodeId) return tree;

  if (!tree.children) return null;

  for (const child of tree.children) {
    const foundNode = findNodeById(child, nodeId);
    if (foundNode) return foundNode;
  }

  return null;
};

export const addNodeToFolder = (
  tree: FileNode,
  folderId: string,
  newNode: FileNode,
): FileNode => {
  if (tree.id === folderId && tree.type === "folder") {
    return {
      ...tree,
      children: [...(tree.children || []), newNode],
    };
  }

  return {
    ...tree,
    children: tree.children?.map((child) =>
      addNodeToFolder(child, folderId, newNode),
    ),
  };
};

export const renameNode = (
  tree: FileNode,
  nodeId: string,
  newName: string,
): FileNode => {
  if (tree.id === nodeId) {
    return {
      ...tree,
      name: newName,
    };
  }

  return {
    ...tree,
    children: tree.children?.map((child) => renameNode(child, nodeId, newName)),
  };
};

export const deleteNode = (tree: FileNode, nodeId: string): FileNode => {
  return {
    ...tree,
    children: tree.children
      ?.filter((child) => child.id !== nodeId)
      .map((child) => deleteNode(child, nodeId)),
  };
};

export const updateFileContent = (
  tree: FileNode,
  fileId: string,
  content: string,
): FileNode => {
  if (tree.id === fileId && tree.type === "file") {
    return {
      ...tree,
      content,
    };
  }

  return {
    ...tree,
    children: tree.children?.map((child) =>
      updateFileContent(child, fileId, content),
    ),
  };
};

export const getParentFolderId = (
  tree: FileNode,
  targetId: string,
  parentId: string | null = null,
): string | null => {
  if (tree.id === targetId) return parentId;

  if (!tree.children) return null;

  for (const child of tree.children) {
    const result = getParentFolderId(child, targetId, tree.id);
    if (result) return result;
  }

  return null;
};
