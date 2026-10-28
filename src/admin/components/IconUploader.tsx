import { useRef, useState } from "react";
import { uploadCoverImage } from "../../lib/images";

interface IconUploaderProps {
  draftId: string;
  value: string | null;
  onChange: (url: string | null) => void;
  label?: string;
}

export default function IconUploader({ draftId, value, onChange, label = "App icon" }: IconUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = async (file: File) => {
    setError(null);
    setUploading(true);
    try {
      onChange(await uploadCoverImage(file, `${draftId}-icon`));
    } catch (err) {
      console.error("Icon upload failed:", err);
      setError("Upload failed. Try a different image.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-ink-700">
        {label} <span className="font-normal text-ink-500">(optional)</span>
      </label>

      <div className="mt-2 flex items-center gap-4">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          aria-label={value ? "Replace icon" : "Upload icon"}
          className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-dashed border-line bg-paper-dim text-xs text-ink-500 transition-colors hover:border-orange-500 hover:text-orange-600 disabled:opacity-50"
        >
          {value ? (
            <img src={value} alt="Icon preview" className="h-full w-full object-cover" />
          ) : uploading ? (
            "Uploading…"
          ) : (
            "Upload"
          )}
        </button>

        {value && (
          <div className="flex gap-3 text-sm">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="font-medium text-orange-600 hover:underline"
            >
              Replace
            </button>
            <button
              type="button"
              onClick={() => onChange(null)}
              className="font-medium text-ink-500 hover:text-orange-600"
            >
              Remove
            </button>
          </div>
        )}
      </div>
      <p className="mt-1 text-xs text-ink-500">Square works best, ideally 512×512.</p>

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
