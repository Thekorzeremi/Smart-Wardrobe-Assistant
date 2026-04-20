import { supabase } from "./supabase";

const DEFAULT_WARDROBE_BUCKET = "clothes_image";

const getFileExtensionFromUri = (uri) => {
  const cleanUri = uri.split("?")[0];
  const parts = cleanUri.split(".");
  return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : "jpg";
};

const getMimeType = (ext) => {
  if (ext === "png") return "image/png";
  if (ext === "webp") return "image/webp";
  if (ext === "gif") return "image/gif";
  return "image/jpeg";
};

export const uploadImageToSupabaseStorage = async ({ userId, localUri, folder = "clothes" }) => {
  if (!userId) {
    throw new Error("Identifiant utilisateur manquant pour l'upload.");
  }
  if (!localUri) {
    throw new Error("Image locale manquante.");
  }

  const extension = getFileExtensionFromUri(localUri);
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${extension}`;
  const filePath = `${folder}/${fileName}`;

  const response = await fetch(localUri);
  const blob = await response.blob();

  const { error: uploadError } = await supabase.storage
    .from(DEFAULT_WARDROBE_BUCKET)
    .upload(filePath, blob, {
      contentType: getMimeType(extension),
      upsert: false,
    });

  if (uploadError) {
    throw uploadError;
  }

  const { data } = supabase.storage.from(DEFAULT_WARDROBE_BUCKET).getPublicUrl(filePath);
  if (!data?.publicUrl) {
    throw new Error("Impossible de récupérer l'URL publique de l'image.");
  }

  return data.publicUrl;
};
