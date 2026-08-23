import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import RichTextEditor from "../components/RichTextEditor";
import ImageUploader from "../components/ImageUploader";
import {
  createPost,
  getPostById,
  isSlugTaken,
  slugify,
  updatePost,
} from "../../lib/posts";
import { deleteCoverImage } from "../../lib/images";

export default function PostEditor() {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();

  // Stable id used for the Storage path even before the Firestore doc exists.
  const [draftId] = useState(() => id ?? crypto.randomUUID());

  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [slugEdited, setSlugEdited] = useState(false);
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [coverImageUrl, setCoverImageUrl] = useState<string | null>(null);
  const [originalCoverUrl, setOriginalCoverUrl] = useState<string | null>(null);
  const [published, setPublished] = useState(false);

  useEffect(() => {
    if (!id) return;
    (async () => {
      const post = await getPostById(id);
      if (post) {
        setTitle(post.title);
        setSlug(post.slug);
        setExcerpt(post.excerpt);
        setContent(post.content);
        setCoverImageUrl(post.coverImageUrl);
        setOriginalCoverUrl(post.coverImageUrl);
        setPublished(post.published);
        setSlugEdited(true); // don't auto-overwrite an existing slug
      }
      setLoading(false);
    })();
  }, [id]);

  const handleTitleChange = (value: string) => {
    setTitle(value);
    if (!slugEdited) setSlug(slugify(value));
  };

  const handleCoverChange = async (url: string | null) => {
    // Clean up the previous image if it's being replaced/removed.
    if (originalCoverUrl && originalCoverUrl !== url) {
      await deleteCoverImage(originalCoverUrl);
    }
    setCoverImageUrl(url);
    setOriginalCoverUrl(url);
  };

  const handleSave = async (publishNow: boolean) => {
    setError(null);

    if (!title.trim()) {
      setError("Title is required.");
      return;
    }
    const finalSlug = slug.trim() || slugify(title);
    if (!finalSlug) {
      setError("Slug is required.");
      return;
    }

    setSaving(true);
    try {
      const taken = await isSlugTaken(finalSlug, id);
      if (taken) {
        setError("That slug is already in use by another post.");
        setSaving(false);
        return;
      }

      const input = {
        title: title.trim(),
        slug: finalSlug,
        excerpt: excerpt.trim(),
        content,
        coverImageUrl,
        published: publishNow,
      };

      if (isEditing && id) {
        await updatePost(id, input);
      } else {
        await createPost(input);
      }
      navigate("/admin/posts");
    } catch {
      setError("Something went wrong saving the post. Try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <p className="text-sm text-ink-500">Loading…</p>;
  }

  return (
    <div className="max-w-2xl">
      <h1 className="font-display text-2xl font-bold">
        {isEditing ? "Edit post" : "New post"}
      </h1>

      <div className="mt-6 space-y-5">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-ink-700">
            Title
          </label>
          <input
            id="title"
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            className="mt-1 w-full rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-orange-500"
          />
        </div>

        <div>
          <label htmlFor="slug" className="block text-sm font-medium text-ink-700">
            Slug
          </label>
          <input
            id="slug"
            value={slug}
            onChange={(e) => {
              setSlug(slugify(e.target.value));
              setSlugEdited(true);
            }}
            className="mt-1 w-full rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-orange-500"
          />
          <p className="mt-1 text-xs text-ink-500">/blog/{slug || "your-post-slug"}</p>
        </div>

        <div>
          <label htmlFor="excerpt" className="block text-sm font-medium text-ink-700">
            Excerpt
          </label>
          <textarea
            id="excerpt"
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            rows={2}
            className="mt-1 w-full rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-orange-500"
          />
        </div>

        <ImageUploader postId={draftId} value={coverImageUrl} onChange={handleCoverChange} />

        <div>
          <label className="block text-sm font-medium text-ink-700">Content</label>
          <div className="mt-1">
            <RichTextEditor content={content} onChange={setContent} />
          </div>
        </div>

        {error && <p className="text-sm text-orange-600">{error}</p>}

        <div className="flex items-center gap-3 border-t border-line pt-5">
          <button
            type="button"
            disabled={saving}
            onClick={() => handleSave(false)}
            className="rounded-full border border-line px-5 py-2 text-sm font-semibold text-ink-950 transition-colors hover:border-ink-950 disabled:opacity-50"
          >
            Save draft
          </button>
          <button
            type="button"
            disabled={saving}
            onClick={() => handleSave(true)}
            className="rounded-full bg-orange-500 px-5 py-2 text-sm font-semibold text-paper transition-colors hover:bg-orange-600 disabled:opacity-50"
          >
            {published ? "Update & keep published" : "Publish"}
          </button>
        </div>
      </div>
    </div>
  );
}
