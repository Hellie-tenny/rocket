import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <section className="mx-auto flex max-w-6xl flex-col items-start px-6 py-24">
      <h1 className="font-display text-3xl font-bold sm:text-4xl">Page not found</h1>
      <p className="mt-4 text-ink-500">That page doesn't exist.</p>
      <Link to="/" className="mt-6 font-semibold text-orange-500 hover:underline">
        Back home
      </Link>
    </section>
  );
}
