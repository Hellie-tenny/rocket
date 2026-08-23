import imageCompression from "browser-image-compression";
import { getDownloadURL, ref, uploadBytes, deleteObject } from "firebase/storage";
import { storage } from "./firebase";

// Resize/compress before upload so we don't burn through the Storage free tier.
// 1600px wide max, targets a small file size, converts to webp where possible.
async function prepareCoverImage(file: File): Promise<File> {
  return imageCompression(file, {
    maxWidthOrHeight: 1600,
    maxSizeMB: 0.35,
    useWebWorker: true,
    fileType: "image/webp",
  });
}

export async function uploadCoverImage(file: File, postId: string): Promise<string> {
  const prepared = await prepareCoverImage(file);
  const path = `covers/${postId}-${Date.now()}.webp`;
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, prepared);
  return getDownloadURL(storageRef);
}

// Best-effort cleanup when a cover is replaced or a post is deleted.
export async function deleteCoverImage(url: string): Promise<void> {
  try {
    const storageRef = ref(storage, url);
    await deleteObject(storageRef);
  } catch {
    // Non-fatal — the object may already be gone or the URL may be external.
  }
}
