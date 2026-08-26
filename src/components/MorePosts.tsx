import { Link } from "react-router-dom";
import type { Post } from "../lib/posts";

interface MorePostsProps {
  posts: Post[];
}

export default function MorePosts({ posts }: MorePostsProps) {
  if (posts.length === 0) return null;

  return (
    <div className="mt-16 border-t border-line pt-10">
      <h2 className="font-display text-lg font-semibold">More from the blog</h2>
      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-3">
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
            <h3 className="font-display mt-3 text-sm font-semibold group-hover:text-orange-600">
              {post.title}
            </h3>
          </Link>
        ))}
      </div>
    </div>
  );
}
