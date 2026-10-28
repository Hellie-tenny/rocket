import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import IconUploader from "../components/IconUploader";
import ScreenshotsUploader from "../components/ScreenshotsUploader";
import { createProject, getProjectById, updateProject, type ScreenshotStyle } from "../../lib/projects";

const inputClass =
  "mt-1 w-full rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-orange-500";

const isWebUrl = (value: string) => /^https?:\/\/\S+$/i.test(value);

export default function ProjectEditor() {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();

  const [draftId] = useState(() => id ?? crypto.randomUUID());
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [url, setUrl] = useState("");
  const [downloadUrl, setDownloadUrl] = useState("");
  const [iconUrl, setIconUrl] = useState<string | null>(null);
  const [screenshotStyle, setScreenshotStyle] = useState<ScreenshotStyle>("desktop");
  const [screenshots, setScreenshots] = useState<string[]>([]);
  const [order, setOrder] = useState("0");
  const [published, setPublished] = useState(true);

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const project = await getProjectById(id);
        if (project) {
          setName(project.name);
          setDescription(project.description);
          setTags((project.tags ?? []).join(", "));
          setUrl(project.url ?? "");
          setDownloadUrl(project.downloadUrl ?? "");
          setIconUrl(project.iconUrl ?? null);
          setScreenshotStyle(project.screenshotStyle ?? "desktop");
          setScreenshots(project.screenshots ?? []);
          setOrder(String(project.order ?? 0));
          setPublished(project.published);
        } else {
          setError("That project no longer exists.");
        }
      } catch (err) {
        console.error("Failed to load project:", err);
        setError("Couldn't load this project.");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const handleSave = async () => {
    setError(null);

    const orderNumber = Number(order);
    const siteUrl = url.trim();
    const apkUrl = downloadUrl.trim();

    if (!name.trim()) {
      setError("Name is required.");
      return;
    }
    if (!Number.isFinite(orderNumber)) {
      setError("Order must be a number.");
      return;
    }
    if (siteUrl && !isWebUrl(siteUrl)) {
      setError("Website link must start with http:// or https://");
      return;
    }
    if (apkUrl && !isWebUrl(apkUrl) && !apkUrl.startsWith("/")) {
      setError("Download link must start with https:// (or / for a file on this site).");
      return;
    }

    setSaving(true);
    try {
      const input = {
        name: name.trim(),
        description: description.trim(),
        tags: tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        url: siteUrl || null,
        downloadUrl: apkUrl || null,
        iconUrl,
        screenshots,
        screenshotStyle,
        order: orderNumber,
        published,
      };
      if (isEditing && id) {
        await updateProject(id, input);
      } else {
        await createProject(input);
      }
      navigate("/admin/projects");
    } catch (err) {
      console.error("Failed to save project:", err);
      setError("Something went wrong saving the project. Try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-sm text-ink-500">Loading…</p>;

  return (
    <div className="max-w-2xl">
      <h1 className="font-display text-2xl font-bold">{isEditing ? "Edit project" : "New project"}</h1>

      <div className="mt-6 space-y-5">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-ink-700">
            Name
          </label>
          <input id="name" value={name} onChange={(e) => setName(e.target.value)} className={inputClass} />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-ink-700">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className={inputClass}
          />
        </div>

        <IconUploader draftId={draftId} value={iconUrl} onChange={setIconUrl} />

        <div>
          <label htmlFor="tags" className="block text-sm font-medium text-ink-700">
            Tags
          </label>
          <input
            id="tags"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="Android, Kotlin, Firebase"
            className={inputClass}
          />
          <p className="mt-1 text-xs text-ink-500">Separate with commas.</p>
        </div>

        <div>
          <label htmlFor="url" className="block text-sm font-medium text-ink-700">
            Website link <span className="font-normal text-ink-500">(optional)</span>
          </label>
          <input
            id="url"
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://"
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="downloadUrl" className="block text-sm font-medium text-ink-700">
            APK download link <span className="font-normal text-ink-500">(optional)</span>
          </label>
          <input
            id="downloadUrl"
            value={downloadUrl}
            onChange={(e) => setDownloadUrl(e.target.value)}
            placeholder="https://github.com/you/sprout/releases/download/v1.0/sprout.apk"
            className={inputClass}
          />
          <p className="mt-1 text-xs text-ink-500">
            A direct link to the file. When set, the project card shows a Download APK button.
          </p>
        </div>

        <div>
          <label htmlFor="screenshotStyle" className="block text-sm font-medium text-ink-700">
            Screenshot type
          </label>
          <select
            id="screenshotStyle"
            value={screenshotStyle}
            onChange={(e) => setScreenshotStyle(e.target.value as ScreenshotStyle)}
            className={`${inputClass} max-w-xs bg-paper`}
          >
            <option value="desktop">Desktop / web (wide)</option>
            <option value="phone">Phone (tall)</option>
          </select>
          <p className="mt-1 text-xs text-ink-500">
            Shown when someone opens "View screenshots" on the card. Wide ones show one at a
            time with arrows and thumbnails; tall phone ones show side by side in a swipeable row.
          </p>
        </div>

        <ScreenshotsUploader
          draftId={draftId}
          value={screenshots}
          onChange={setScreenshots}
          portrait={screenshotStyle === "phone"}
        />

        <div>
          <label htmlFor="order" className="block text-sm font-medium text-ink-700">
            Order
          </label>
          <input
            id="order"
            type="number"
            step="1"
            value={order}
            onChange={(e) => setOrder(e.target.value)}
            className={`${inputClass} max-w-xs`}
          />
          <p className="mt-1 text-xs text-ink-500">Lower numbers appear first. Use 0 to put it at the top.</p>
        </div>

        <label className="flex items-center gap-2 text-sm font-medium text-ink-700">
          <input
            type="checkbox"
            checked={published}
            onChange={(e) => setPublished(e.target.checked)}
            className="h-4 w-4 accent-orange-500"
          />
          Show on the Our Work page
        </label>

        {error && <p className="text-sm text-orange-600">{error}</p>}

        <div className="flex items-center gap-3 border-t border-line pt-5">
          <button
            type="button"
            disabled={saving}
            onClick={handleSave}
            className="rounded-full bg-orange-500 px-5 py-2 text-sm font-semibold text-paper transition-colors hover:bg-orange-600 disabled:opacity-50"
          >
            {saving ? "Saving…" : "Save project"}
          </button>
          <button
            type="button"
            disabled={saving}
            onClick={() => navigate("/admin/projects")}
            className="rounded-full border border-line px-5 py-2 text-sm font-semibold text-ink-950 transition-colors hover:border-ink-950 disabled:opacity-50"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
