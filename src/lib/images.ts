import imageCompression from "browser-image-compression";

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME as string;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET as string;

// Resize/compress before upload so we stay well within Cloudinary's free tier.
// 1600px wide max, targets a small file size, converts to webp where possible.
async function prepareCoverImage(file: File): Promise<File> {
  return imageCompression(file, {
    maxWidthOrHeight: 1600,
    maxSizeMB: 0.35,
    useWebWorker: true,
    fileType: "image/webp",
  });
}

// Uploads to Cloudinary via an unsigned upload preset — no API secret needed
// client-side, no billing account required. postId is used as a folder tag
// so images stay organized and traceable back to their post.
export async function uploadCoverImage(file: File, postId: string): Promise<string> {
  const prepared = await prepareCoverImage(file);

  const formData = new FormData();
  formData.append("file", prepared);
  formData.append("upload_preset", UPLOAD_PRESET);
  formData.append("folder", "covers");
  formData.append("public_id", `${postId}-${Date.now()}`);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    { method: "POST", body: formData }
  );

  if (!response.ok) {
    throw new Error("Cloudinary upload failed");
  }

  const data = await response.json();
  return data.secure_url as string;
}

// Cloudinary deletion requires a signed, authenticated API call (needs the
// API secret, which can't safely live in client code). We don't delete the
// remote asset automatically — just stop referencing it in Firestore.
// Periodically clear unused images from the Cloudinary Media Library console
// if storage usage becomes a concern.
export async function deleteCoverImage(_url: string): Promise<void> {
  // Intentional no-op — see comment above.
}
