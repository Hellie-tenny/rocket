import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllPosts, type Post } from "../../lib/posts";

export default function Dashboard() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    getAllPosts()
      .then(setPosts)
      .catch((err) => {
        console.error("Failed to load posts:", err);
        setError(true);
      })
      .finally(() => setLoading(false));
  }, []);

  const published = posts.filter((p) => p.published);
  const drafts = posts.filter((p) => !p.published);
  const totalViews = published.reduce((sum, p) => sum + (p.views ?? 0), 0);
  const recent = [...posts]
    .sort((a, b) => (b.updatedAt?.toMillis() ?? 0) - (a.updatedAt?.toMillis() ?? 0))
    .slice(0, 5);

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold">Dashboard</h1>
        <Link
          to="/admin/posts/new"
          className="rounded-full bg-orange-500 px-5 py-2 text-sm font-semibold text-paper transition-colors hover:bg-orange-600"
        >
          New post
        </Link>
      </div>

      {error ? (
        <p className="mt-6 text-sm text-orange-600">
          Couldn't load your posts right now. Check the browser console for details.
        </p>
      ) : (
        <>
          <div className="mt-6 grid grid-cols-2 gap-4 sm:max-w-lg sm:grid-cols-3">
            <div className="rounded-lg border border-line p-4">
              <p className="text-xs font-medium text-ink-500">Published</p>
              <p className="font-display mt-1 text-2xl font-bold">
                {loading ? "—" : published.length}
              </p>
            </div>
            <div className="rounded-lg border border-line p-4">
              <p className="text-xs font-medium text-ink-500">Drafts</p>
              <p className="font-display mt-1 text-2xl font-bold">
                {loading ? "—" : drafts.length}
              </p>
            </div>
            <div className="rounded-lg border border-line p-4">
              <p className="text-xs font-medium text-ink-500">Total views</p>
              <p className="font-display mt-1 text-2xl font-bold">
                {loading ? "—" : totalViews}
              </p>
            </div>
          </div>

          <div className="mt-10">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-semibold">Recently updated</h2>
              <Link to="/admin/posts" className="text-sm font-medium text-orange-600 hover:underline">
                View all
              </Link>
            </div>

            {loading ? (
              <p className="mt-3 text-sm text-ink-500">Loading…</p>
            ) : recent.length === 0 ? (
              <p className="mt-3 text-sm text-ink-500">
                No posts yet —{" "}
                <Link to="/admin/posts/new" className="text-orange-600 hover:underline">
                  write your first one
                </Link>
                .
              </p>
            ) : (
              <ul className="mt-4 divide-y divide-line rounded-lg border border-line">
                {recent.map((post) => (
                  <li key={post.id} className="flex items-center justify-between gap-4 px-4 py-3">
                    <div className="min-w-0">
                      <Link
                        to={`/admin/posts/${post.id}/edit`}
                        className="truncate text-sm font-medium hover:text-orange-600"
                      >
                        {post.title}
                      </Link>
                      <p className="mt-0.5 text-xs text-ink-500">
                        {post.published ? "Published" : "Draft"} · {post.views ?? 0} views
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}
    </div>
  );
}
