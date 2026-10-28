import { useRef, useState } from "react";
import { uploadCoverImage } from "../../lib/images";

interface ScreenshotsUploaderProps {
  draftId: string;
  value: string[];
  onChange: (urls: string[]) => void;
  max?: number;
  label?: string;
  portrait?: boolean;
}

export default function ScreenshotsUploader({
  draftId,
  value,
  onChange,
  max = 6,
  label = "Screenshots",
  portrait = false,
}: ScreenshotsUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFiles = async (files: FileList) => {
    setError(null);
    const picked = Array.from(files).slice(0, max - value.length);
    if (picked.length === 0) return;

    setUploading(true);
    const urls = [...value];
    try {
      for (const file of picked) {
        const url = await uploadCoverImage(file, draftId);
        urls.push(url);
        onChange([...urls]);
      }
    } catch (err) {
      console.error("Screenshot upload failed:", err);
      setError("An upload failed. Any images before it were kept.");
    } finally {
      setUploading(false);
    }
  };

  const remove = (index: number) => onChange(value.filter((_, i) => i !== index));
  const makeFirst = (index: number) =>
    onChange([value[index], ...value.filter((_, i) => i !== index)]);

  return (
    <div>
      <label className="block text-sm font-medium text-ink-700">{label}</label>

      {value.length > 0 && (
        <ul className={`mt-2 grid gap-3 ${portrait ? "grid-cols-3 sm:grid-cols-4" : "grid-cols-2 sm:grid-cols-3"}`}>
          {value.map((url, i) => (
            <li key={url}>
              <div className={`flex items-center justify-center overflow-hidden rounded-lg border border-line bg-paper-dim ${portrait ? "aspect-[9/16]" : "aspect-video"}`}>
                <img src={url} alt={`Screenshot ${i + 1}`} className="h-full w-full object-contain" />
              </div>
              <div className="mt-1 flex items-center gap-3 text-xs">
                {i === 0 ? (
                  <span className="font-medium text-ink-500">First</span>
                ) : (
                  <button
                    type="button"
                    onClick={() => makeFirst(i)}
                    className="font-medium text-orange-600 hover:underline"
                  >
                    Make first
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => remove(i)}
                  className="font-medium text-ink-500 hover:text-orange-600"
                >
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {value.length < max && (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="mt-2 rounded-lg border border-dashed border-line px-4 py-3 text-sm text-ink-500 transition-colors hover:border-orange-500 hover:text-orange-600 disabled:opacity-50"
        >
          {uploading ? "Uploading…" : value.length === 0 ? "Click to upload screenshots" : "Add more"}
        </button>
      )}
      <p className="mt-1 text-xs text-ink-500">
        Up to {max}. The first one is shown by default on the Our Work page.
      </p>

      {error && <p className="mt-2 text-sm text-orange-600">{error}</p>}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => {
          if (e.target.files?.length) handleFiles(e.target.files);
          e.target.value = "";
        }}
      />
    </div>
  );
}
