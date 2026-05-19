import { createClient } from "@supabase/supabase-js";
import { AppError } from "../middleware/error.js";
import dotenv from "dotenv";

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const bucketName = process.env.SUPABASE_BUCKET || "project-images";

if (!supabaseUrl || !supabaseKey) {
  console.error("[supabase]: SUPABASE_URL or SUPABASE_ANON_KEY is missing");
}

export const supabase = createClient(supabaseUrl || "", supabaseKey || "");

const allowedMimeTypes = new Set([
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
]);
const maxFileSize = 5 * 1024 * 1024; // 5MB

export const saveUploadedImage = async (file: File) => {
  if (!allowedMimeTypes.has(file.type)) {
    throw new AppError(
      "Only image files (jpeg, jpg, png, gif, webp) are allowed",
      400,
    );
  }

  if (file.size > maxFileSize) {
    throw new AppError("Image size must be less than 5MB", 400);
  }

  const extension = file.name.split(".").pop();
  const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
  const filename = `${uniqueSuffix}.${extension}`;

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const { data, error } = await supabase.storage
    .from(bucketName)
    .upload(filename, buffer, {
      contentType: file.type,
      upsert: false,
    });

  if (error) {
    console.error("[supabase]: Upload error:", error);
    throw new AppError(`Failed to upload image: ${error.message}`, 500);
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from(bucketName).getPublicUrl(filename);

  return publicUrl;
};

/**
 * Menghapus file dari Supabase Storage berdasarkan URL public
 */
export const deleteImageFromStorage = async (publicUrl: string) => {
  if (!publicUrl) return;

  try {
    // Ambil nama file dari URL
    // Contoh: https://xxx.supabase.co/storage/v1/object/public/project-images/filename.jpg
    const filename = publicUrl.split("/").pop();
    if (!filename) return;

    const { error } = await supabase.storage
      .from(bucketName)
      .remove([filename]);

    if (error) {
      console.error("[supabase]: Delete error:", error);
    }
  } catch (err) {
    console.error("[supabase]: Failed to parse filename for deletion:", err);
  }
};
