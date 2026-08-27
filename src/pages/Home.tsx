import { Helmet } from "react-helmet-async";

export default function Home() {
  return (
    <>
      <Helmet>
        <title>Rocket — Tech-focused product studio</title>
        <meta
          name="description"
          content="Rocket builds technology products, tools, and ideas worth shipping."
        />
        <link rel="canonical" href="https://rocket-technologies.web.app/" />
        <meta property="og:url" content="https://rocket-technologies.web.app/" />
      </Helmet>

      <section className="relative overflow-hidden">
        <picture>
          <source srcSet="/hero-rocket.webp" type="image/webp" />
          <img
            src="/hero-rocket.png"
            alt=""
            fetchPriority="high"
            className="pointer-events-none absolute inset-y-0 right-0 hidden h-full max-w-[65%] object-contain object-right sm:block"
          />
        </picture>

        <div className="relative mx-auto max-w-6xl px-6 pb-20 pt-24 sm:pt-32">
          <h1 className="font-display max-w-3xl text-4xl font-bold leading-[1.1] tracking-tight sm:text-6xl">
            We build technology that
            <span className="text-orange-500"> takes off.</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg text-ink-500">
            Rocket is a tech-focused company building products, tools, and
            ideas worth shipping. Site under construction — more soon.
          </p>
          <div className="mt-10 flex gap-4">
            <a
              href="/contact"
              className="rounded-full bg-orange-500 px-6 py-3 text-sm font-semibold text-paper transition-colors hover:bg-orange-600"
            >
              Get in touch
            </a>
            <a
              href="/projects"
              className="rounded-full border border-line px-6 py-3 text-sm font-semibold text-ink-950 transition-colors hover:border-ink-950"
            >
              See our work
            </a>
          </div>
        </div>
      </section>

      <section className="border-t border-line bg-paper-dim">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-6 py-16 sm:grid-cols-3">
          <div>
            <picture>
              <source srcSet="/products-icon.webp" type="image/webp" />
              <img
                src="/products-icon.png"
                alt=""
                loading="lazy"
                className="h-12 w-12"
              />
            </picture>
            <h2 className="font-display mt-4 text-lg font-semibold">Products</h2>
            <p className="mt-2 text-sm text-ink-500">
              Tools we design, build, and ship end to end.
            </p>
          </div>
          <div>
            <picture>
              <source srcSet="/craft-icon.webp" type="image/webp" />
              <img
                src="/craft-icon.png"
                alt=""
                loading="lazy"
                className="h-12 w-12"
              />
            </picture>
            <h2 className="font-display mt-4 text-lg font-semibold">Craft</h2>
            <p className="mt-2 text-sm text-ink-500">
              Careful engineering and design in everything we release.
            </p>
          </div>
          <div>
            <picture>
              <source srcSet="/writing-icon.webp" type="image/webp" />
              <img
                src="/writing-icon.png"
                alt=""
                loading="lazy"
                className="h-12 w-12"
              />
            </picture>
            <h2 className="font-display mt-4 text-lg font-semibold">Writing</h2>
            <p className="mt-2 text-sm text-ink-500">
              Notes on what we're building, on the blog.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
