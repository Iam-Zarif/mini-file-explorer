# Mini File Explorer

A small file manager UI built for the Webbly Media task.

## What I implemented

- Sidebar tree view for folders and files
- Expand/collapse folder navigation
- Main panel for selected folder contents
- Create, rename, delete operations for folders and files
- Text file editor with save support
- Local state + mock JSON data, no backend required
- Responsive UI using Next.js, TypeScript, and Tailwind CSS

## Code approach

- `src/data` holds the mock file system data
- `src/utils/fileTree.ts` manages tree operations and state updates
- `src/components` contains reusable UI pieces:
  - `Sidebar` for folder tree navigation
  - `MainPanel` for listing folder contents
  - `FileEditor` for editing text files
  - `Toolbar` for action buttons
  - `TreeItem` for folder/file nodes

## Development flow

1. Scaffolded the Next.js app and added TypeScript + Tailwind
2. Built the folder/file tree model and tree rendering
3. Added CRUD actions and selection state
4. Implemented file editing and save behavior
5. Polished responsive layout and UX

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Live demo

https://mini-file-explorer-mostofafatin.vercel.app/
