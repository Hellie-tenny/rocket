import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { getPublishedPostBySlug, incrementPostViews, type Post } from "../lib/posts";
import AdSlot from "../components/AdSlot";

export default function BlogPost() {
  const { slug } = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    getPublishedPostBySlug(slug)
      .then((found) => {
        setPost(found);
        if (found) trackView(found.id);
      })
      .finally(() => setLoading(false));
  }, [slug]);

  // Count each post view once per browser session so refreshes/rerenders
  // don't inflate the count.
  const trackView = (postId: string) => {
    const key = `viewed-${postId}`;
    if (sessionStorage.getItem(key)) return;
    sessionStorage.setItem(key, "1");
    incrementPostViews(postId).catch(() => {
      // Non-fatal — view count is a nice-to-have, not core functionality.
    });
  };

  if (loading) {
    return <p className="mx-auto max-w-3xl px-6 py-24 text-sm text-ink-500">Loading…</p>;
  }

  if (!post) {
    return (
      <section className="mx-auto max-w-3xl px-6 py-24">
        <h1 className="font-display text-3xl font-bold">Post not found</h1>
        <Link to="/blog" className="mt-4 inline-block text-orange-600 hover:underline">
          Back to blog
        </Link>
      </section>
    );
  }

  return (
    <article className="mx-auto max-w-3xl px-6 py-24">
      <Helmet>
        <title>{post.title} — Rocket</title>
        <meta name="description" content={post.excerpt} />
      </Helmet>

      <h1 className="font-display text-3xl font-bold sm:text-4xl">{post.title}</h1>

      {post.coverImageUrl && (
        <img
          src={post.coverImageUrl}
          alt=""
          fetchPriority="high"
          className="mt-8 aspect-video w-full rounded-lg border border-line object-cover"
        />
      )}

      <AdSlot />

      <div
        className="prose prose-sm mt-8 max-w-none"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      <AdSlot />
    </article>
  );
}
