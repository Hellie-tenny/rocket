import { Helmet } from "react-helmet-async";

export default function Contact() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-24">
      <Helmet>
        <title>Contact — Rocket</title>
        <meta name="description" content="Get in touch with Rocket." />
        <link rel="canonical" href="https://rocket-technologies.web.app/contact" />
      </Helmet>

      <h1 className="font-display text-3xl font-bold sm:text-4xl">Contact</h1>
      <p className="mt-4 max-w-xl text-ink-500">Coming in a later phase.</p>
    </section>
  );
}
