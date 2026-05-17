import path from "path";
import fs from "fs";
import { writeFile } from "fs/promises";

export const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const allowedMimeTypes = new Set(["image/jpeg", "image/png", "image/gif", "image/webp"]);
const allowedExtensions = new Set([".jpeg", ".jpg", ".png", ".gif", ".webp"]);
const maxFileSize = 5 * 1024 * 1024;

export const saveUploadedImage = async (file: File) => {
  const extension = path.extname(file.name).toLowerCase();
  if (!allowedMimeTypes.has(file.type) || !allowedExtensions.has(extension)) {
    throw new Error("Only image files (jpeg, jpg, png, gif, webp) are allowed");
  }

  if (file.size > maxFileSize) {
    throw new Error("Image size must be less than 5MB");
  }

  const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
  const filename = `${uniqueSuffix}${extension}`;
  const filePath = path.join(uploadDir, filename);
  const buffer = Buffer.from(await file.arrayBuffer());

  await writeFile(filePath, buffer);

  return `/uploads/${filename}`;
};
