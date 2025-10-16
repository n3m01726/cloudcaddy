import { Folder, File, Image, Music, Film, FileText } from "lucide-react";

const map = {
  jpg: Image, jpeg: Image, png: Image, gif: Image,
  pdf: FileText, doc: FileText, docx: FileText,
  xls: FileText, xlsx: FileText,
  mp3: Music, mp4: Film,
  default: File,
};

export function getFileIcon(file) {
  if (file.type === "folder") return Folder;
  const ext = file.name.split(".").pop().toLowerCase();
  return map[ext] || map.default;
}
