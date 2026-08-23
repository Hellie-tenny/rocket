import { useRef, useState } from "react";
import { uploadCoverImage } from "../../lib/images";

interface ImageUploaderProps {
  postId: string;
  value: string | null;
  onChange: (url: string | null) => void;
}

export default function ImageUploader({ postId, value, onChange }: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = async (file: File) => {
    setError(null);
    setUploading(true);
    try {
      const url = await uploadCoverImage(file, postId);
      onChange(url);
    } catch {
      setError("Upload failed. Try a different image.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-ink-700">Cover image</label>

      {value ? (
        <div className="mt-2">
          <img
            src={value}
            alt="Cover preview"
            className="aspect-video w-full max-w-md rounded-lg border border-line object-cover"
          />
          <div className="mt-2 flex gap-3">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="text-sm font-medium text-orange-600 hover:underline"
            >
              Replace
            </button>
            <button
              type="button"
              onClick={() => onChange(null)}
              className="text-sm font-medium text-ink-500 hover:text-orange-600"
            >
              Remove
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="mt-2 flex aspect-video w-full max-w-md items-center justify-center rounded-lg border border-dashed border-line text-sm text-ink-500 transition-colors hover:border-orange-500 hover:text-orange-600 disabled:opacity-50"
        >
          {uploading ? "Uploading…" : "Click to upload an image"}
        </button>
      )}

      {error && <p className="mt-2 text-sm text-orange-600">{error}</p>}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = "";
        }}
      />
    </div>
  );
}
