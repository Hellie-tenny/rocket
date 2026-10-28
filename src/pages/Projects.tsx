import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { getPublishedProjects, type Project, type ScreenshotStyle } from "../lib/projects";

const isExternal = (href: string) => /^https?:\/\//i.test(href);

function Lightbox({ src, alt, onClose }: { src: string; alt: string; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={alt}
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink-950/85 p-4"
      onClick={onClose}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-paper text-ink-950"
      >
        ✕
      </button>
      <img
        src={src}
        alt={alt}
        className="max-h-[90vh] max-w-full rounded-lg object-contain"
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  );
}

function Screenshots({
  images,
  name,
  style,
}: {
  images: string[];
  name: string;
  style: ScreenshotStyle;
}) {
  const [active, setActive] = useState(0);
  const [zoomed, setZoomed] = useState<{ src: string; alt: string } | null>(null);
  if (images.length === 0) return null;

  const lightbox = zoomed && (
    <Lightbox src={zoomed.src} alt={zoomed.alt} onClose={() => setZoomed(null)} />
  );

  // Phone screenshots: tall images in a swipeable row, several visible at once.
  if (style === "phone") {
    return (
      <div className="mb-5">
        <div className="-mx-1 flex snap-x gap-3 overflow-x-auto px-1 pb-2">
          {images.map((src, i) => {
            const alt = `${name} screenshot ${i + 1}`;
            return (
              <button
                key={src}
                type="button"
                onClick={() => setZoomed({ src, alt })}
                aria-label={`Enlarge ${alt}`}
                className="shrink-0 snap-start overflow-hidden rounded-xl border border-line bg-paper-dim"
              >
                <img src={src} alt={alt} loading="lazy" className="h-72 w-auto object-contain" />
              </button>
            );
          })}
        </div>
        {lightbox}
      </div>
    );
  }

  // Desktop screenshots: one wide frame with thumbnails to switch between them.
  const alt = `${name} screenshot ${active + 1}`;
  return (
    <div className="mb-5">
      <button
        type="button"
        onClick={() => setZoomed({ src: images[active], alt })}
        aria-label={`Enlarge ${alt}`}
        className="flex aspect-video w-full items-center justify-center overflow-hidden rounded-lg border border-line bg-paper-dim"
      >
        <img src={images[active]} alt={alt} loading="lazy" className="h-full w-full object-contain" />
      </button>

      {images.length > 1 && (
        <div className="mt-2 flex gap-2 overflow-x-auto">
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Show ${name} screenshot ${i + 1}`}
              aria-current={i === active}
              className={`h-12 w-16 shrink-0 overflow-hidden rounded-md border bg-paper-dim ${
                i === active ? "border-orange-500" : "border-line"
              }`}
            >
              <img src={src} alt="" loading="lazy" className="h-full w-full object-contain" />
            </button>
          ))}
        </div>
      )}
      {lightbox}
    </div>
  );
}

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    getPublishedProjects()
      .then(setProjects)
      .catch((err) => {
        console.error("Failed to load projects:", err);
        setError(true);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="mx-auto max-w-6xl px-6 py-24">
      <Helmet>
        <title>Our Work — Rocket</title>
        <meta name="description" content="Products Rocket has designed, built, and shipped." />
        <link rel="canonical" href="https://rocket-technologies.web.app/projects" />
      </Helmet>

      <h1 className="font-display text-3xl font-bold sm:text-4xl">Our Work</h1>
      <p className="mt-4 max-w-xl text-ink-500">
        Products we've designed, built, and shipped.
      </p>

      {loading ? (
        <p className="mt-12 text-sm text-ink-500">Loading…</p>
      ) : error ? (
        <p className="mt-12 text-sm text-ink-500">
          Couldn't load our projects right now. Please try again shortly.
        </p>
      ) : projects.length === 0 ? (
        <p className="mt-12 text-sm text-ink-500">Projects coming soon.</p>
      ) : (
        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <div
              key={project.id}
              className="min-w-0 rounded-xl border border-line p-6 transition-colors hover:border-orange-500"
            >
              <Screenshots
                images={project.screenshots ?? []}
                name={project.name}
                style={project.screenshotStyle ?? "desktop"}
              />

              <div className="flex items-center gap-3">
                {project.iconUrl && (
                  <img
                    src={project.iconUrl}
                    alt=""
                    loading="lazy"
                    className="h-11 w-11 shrink-0 rounded-xl border border-line object-cover"
                  />
                )}
                <h2 className="font-display text-xl font-semibold">{project.name}</h2>
              </div>

              <p className="mt-3 whitespace-pre-line text-sm text-ink-500">{project.description}</p>

              {project.tags?.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-paper-dim px-2.5 py-1 text-xs font-medium text-ink-700"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {project.url && (
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-block text-sm font-semibold text-orange-600 hover:underline"
                >
                  Visit site →
                </a>
              )}

              {project.downloadUrl && (
                <>
                  <a
                    href={project.downloadUrl}
                    download
                    {...(isExternal(project.downloadUrl)
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                    className="mt-4 inline-flex items-center gap-2 rounded-full bg-orange-500 px-4 py-2 text-sm font-semibold text-paper transition-colors hover:bg-orange-600"
                  >
                    Download APK
                    <span aria-hidden="true">↓</span>
                  </a>
                  <p className="mt-2 text-xs text-ink-500">
                    Android only. You may need to allow installs from unknown sources.
                  </p>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
