export type FileNodeType = "folder" | "file";

export type FileNode = {
  id: string;
  name: string;
  type: FileNodeType;
  content?: string;
  children?: FileNode[];
};
