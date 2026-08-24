import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { deletePost, getAllPosts, type Post } from "../../lib/posts";
import { deleteCoverImage } from "../../lib/images";

const SITE_URL = "https://rocket-technologies.web.app";

export default function Posts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "published" | "draft">("all");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const all = await getAllPosts();
    setPosts(all);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (post: Post) => {
    if (!window.confirm(`Delete "${post.title}"? This can't be undone.`)) return;
    await deletePost(post.id);
    if (post.coverImageUrl) await deleteCoverImage(post.coverImageUrl);
    setPosts((prev) => prev.filter((p) => p.id !== post.id));
  };

  const handleShare = async (post: Post) => {
    const url = `${SITE_URL}/blog/${post.slug}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopiedId(post.id);
      setTimeout(() => setCopiedId((current) => (current === post.id ? null : current)), 2000);
    } catch (err) {
      console.error("Failed to copy link:", err);
      window.prompt("Copy this link:", url);
    }
  };

  const filtered = posts.filter((p) => {
    if (filter === "published") return p.published;
    if (filter === "draft") return !p.published;
    return true;
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold">Posts</h1>
        <Link
          to="/admin/posts/new"
          className="rounded-full bg-orange-500 px-5 py-2 text-sm font-semibold text-paper transition-colors hover:bg-orange-600"
        >
          New post
        </Link>
      </div>

      <div className="mt-4 flex gap-2">
        {(["all", "published", "draft"] as const).map((key) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`rounded-full px-3 py-1 text-xs font-medium capitalize transition-colors ${
              filter === key
                ? "bg-ink-950 text-paper"
                : "bg-paper-dim text-ink-700 hover:bg-line"
            }`}
          >
            {key}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {loading ? (
          <p className="text-sm text-ink-500">Loading…</p>
        ) : filtered.length === 0 ? (
          <p className="text-sm text-ink-500">No posts yet.</p>
        ) : (
          <ul className="divide-y divide-line rounded-lg border border-line">
            {filtered.map((post) => (
              <li key={post.id} className="flex items-center justify-between gap-4 px-4 py-3">
                <div className="min-w-0">
                  <p className="truncate font-medium">{post.title}</p>
                  <div className="mt-0.5 flex items-center gap-2 text-xs text-ink-500">
                    <span
                      className={`rounded-full px-2 py-0.5 font-medium ${
                        post.published
                          ? "bg-orange-100 text-orange-600"
                          : "bg-paper-dim text-ink-500"
                      }`}
                    >
                      {post.published ? "Published" : "Draft"}
                    </span>
                    <span>/blog/{post.slug}</span>
                    <span>· {post.views ?? 0} views</span>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  {post.published && (
                    <button
                      onClick={() => handleShare(post)}
                      aria-label="Copy post link"
                      title="Copy post link"
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-ink-500 transition-colors hover:bg-paper-dim hover:text-orange-600"
                    >
                      {copiedId === post.id ? (
                        <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
                          <path
                            d="M5 13l4 4L19 7"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      ) : (
                        <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
                          <path
                            d="M13.5 6.5l3-3a3 3 0 114 4l-3 3M10.5 17.5l-3 3a3 3 0 11-4-4l3-3M8 16l8-8"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}
                    </button>
                  )}
                  <Link
                    to={`/admin/posts/${post.id}/edit`}
                    className="text-sm font-medium text-ink-700 hover:text-orange-600"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(post)}
                    className="text-sm font-medium text-ink-500 hover:text-orange-600"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
