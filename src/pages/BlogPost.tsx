import { useParams } from "react-router-dom";

export default function BlogPost() {
  const { slug } = useParams();

  return (
    <section className="mx-auto max-w-3xl px-6 py-24">
      <h1 className="font-display text-3xl font-bold sm:text-4xl">Post: {slug}</h1>
      <p className="mt-4 text-ink-500">Post content will render here.</p>
    </section>
  );
}
