import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { getPublishedPosts, type Post } from "../lib/posts";

export default function Blog() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPublishedPosts()
      .then(setPosts)
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="mx-auto max-w-6xl px-6 py-24">
      <Helmet>
        <title>Blog — Rocket</title>
        <meta name="description" content="Notes on what Rocket is building." />
      </Helmet>

      <h1 className="font-display text-3xl font-bold sm:text-4xl">Blog</h1>

      {loading ? (
        <p className="mt-6 text-sm text-ink-500">Loading…</p>
      ) : posts.length === 0 ? (
        <p className="mt-6 text-sm text-ink-500">No posts published yet.</p>
      ) : (
        <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Link key={post.id} to={`/blog/${post.slug}`} className="group block">
              {post.coverImageUrl && (
                <img
                  src={post.coverImageUrl}
                  alt=""
                  loading="lazy"
                  className="aspect-video w-full rounded-lg border border-line object-cover"
                />
              )}
              <h2 className="font-display mt-3 text-lg font-semibold group-hover:text-orange-600">
                {post.title}
              </h2>
              <p className="mt-1 line-clamp-2 text-sm text-ink-500">{post.excerpt}</p>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
