import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllPosts, type Post } from "../../lib/posts";

export default function Analytics() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllPosts()
      .then(setPosts)
      .finally(() => setLoading(false));
  }, []);

  const published = posts.filter((p) => p.published);
  const totalViews = published.reduce((sum, p) => sum + (p.views ?? 0), 0);
  const topPosts = [...published].sort((a, b) => (b.views ?? 0) - (a.views ?? 0)).slice(0, 10);

  return (
    <div>
      <h1 className="font-display text-2xl font-bold">Analytics</h1>
      <p className="mt-2 text-sm text-ink-500">
        View counts tracked per post. For deeper traffic data (sources,
        geography, devices), check the Analytics section of the Firebase
        console — that's collected automatically in the background.
      </p>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:max-w-md">
        <div className="rounded-lg border border-line p-4">
          <p className="text-xs font-medium text-ink-500">Published posts</p>
          <p className="font-display mt-1 text-2xl font-bold">{published.length}</p>
        </div>
        <div className="rounded-lg border border-line p-4">
          <p className="text-xs font-medium text-ink-500">Total views</p>
          <p className="font-display mt-1 text-2xl font-bold">{totalViews}</p>
        </div>
      </div>

      <div className="mt-10">
        <h2 className="font-display text-lg font-semibold">Top posts</h2>

        {loading ? (
          <p className="mt-3 text-sm text-ink-500">Loading…</p>
        ) : topPosts.length === 0 ? (
          <p className="mt-3 text-sm text-ink-500">No published posts yet.</p>
        ) : (
          <ul className="mt-4 divide-y divide-line rounded-lg border border-line">
            {topPosts.map((post, i) => (
              <li key={post.id} className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-sm text-ink-500">{i + 1}</span>
                  <Link
                    to={`/admin/posts/${post.id}/edit`}
                    className="truncate text-sm font-medium hover:text-orange-600"
                  >
                    {post.title}
                  </Link>
                </div>
                <span className="shrink-0 text-sm text-ink-500">{post.views ?? 0} views</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
