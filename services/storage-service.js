import { supabase } from "./supabase";
import { readAsStringAsync, EncodingType } from 'expo-file-system/legacy';
import { decode } from 'base64-arraybuffer';

const DEFAULT_WARDROBE_BUCKET = "clothes_image";

const getFileExtensionFromUri = (uri) => {
  const cleanUri = uri.split("?")[0];
  const parts = cleanUri.split(".");
  return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : "jpg";
};

const getMimeType = (ext) => {
  if (ext.toLowerCase() === "png") return "image/png";
  if (ext.toLowerCase() === "webp") return "image/webp";
  if (ext.toLowerCase() === "gif") return "image/gif";
  return "image/jpeg";
};

export const uploadImageToSupabaseStorage = async ({ userId, localUri, folder = "clothes" }) => {
  if (!userId) {
    throw new Error("Identifiant utilisateur manquant pour l'upload.");
  }
  if (!localUri) {
    throw new Error("Image locale manquante.");
  }
  try {
  const extension = getFileExtensionFromUri(localUri);
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${extension}`;
  const filePath = `${folder}/${fileName}`;
  const base64 = await readAsStringAsync(localUri, {
    encoding: EncodingType.Base64,
  });
  const { error: uploadError } = await supabase.storage
      .from(DEFAULT_WARDROBE_BUCKET)
      .upload(filePath, decode(base64), {
        contentType: getMimeType(extension),
        upsert: true,
      });

    if (uploadError) throw uploadError;

    const { data } = supabase.storage.from(DEFAULT_WARDROBE_BUCKET).getPublicUrl(filePath);
    return data.publicUrl;
  } catch (error) {
    console.error("Upload error details:", error);
    throw error;
  }
};
