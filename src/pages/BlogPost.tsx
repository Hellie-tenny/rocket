import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { getPublishedPostBySlug, getPublishedPosts, incrementPostViews, type Post } from "../lib/posts";
import AdSlot from "../components/AdSlot";
import MorePosts from "../components/MorePosts";

export default function BlogPost() {
  const { slug } = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [morePosts, setMorePosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    getPublishedPostBySlug(slug)
      .then((found) => {
        setPost(found);
        if (found) {
          trackView(found.id);
          loadMorePosts(found.id);
        }
      })
      .catch((err) => {
        console.error("Failed to load post:", err);
      })
      .finally(() => setLoading(false));
  }, [slug]);

  // No tagging/category system exists yet, so the best available "related
  // posts" signal is simply recency — most recently published, excluding
  // the post currently being read.
  const loadMorePosts = (currentPostId: string) => {
    getPublishedPosts()
      .then((all) => {
        setMorePosts(all.filter((p) => p.id !== currentPostId).slice(0, 3));
      })
      .catch((err) => {
        console.error("Failed to load more posts:", err);
      });
  };

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
        <link rel="canonical" href={`https://rocket-technologies.web.app/blog/${post.slug}`} />

        <meta property="og:type" content="article" />
        <meta property="og:title" content={`${post.title} — Rocket`} />
        <meta property="og:description" content={post.excerpt} />
        <meta property="og:url" content={`https://rocket-technologies.web.app/blog/${post.slug}`} />
        {post.coverImageUrl && <meta property="og:image" content={post.coverImageUrl} />}

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${post.title} — Rocket`} />
        <meta name="twitter:description" content={post.excerpt} />
        {post.coverImageUrl && <meta name="twitter:image" content={post.coverImageUrl} />}
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

      <MorePosts posts={morePosts} />
    </article>
  );
}
