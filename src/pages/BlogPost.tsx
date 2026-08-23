import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { getPublishedPostBySlug, type Post } from "../lib/posts";

export default function BlogPost() {
  const { slug } = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    getPublishedPostBySlug(slug)
      .then(setPost)
      .finally(() => setLoading(false));
  }, [slug]);

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
          className="mt-8 aspect-video w-full rounded-lg border border-line object-cover"
        />
      )}

      <div
        className="prose prose-sm mt-8 max-w-none"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
    </article>
  );
}
