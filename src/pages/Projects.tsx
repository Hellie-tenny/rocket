import { useCallback, useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { getPublishedProjects, type Project } from "../lib/projects";

const isExternal = (href: string) => /^https?:\/\//i.test(href);

function Header({ project }: { project: Project }) {
  return (
    <div className="flex min-w-0 items-center gap-3">
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
  );
}

function Tags({ tags }: { tags: string[] }) {
  if (!tags?.length) return null;
  return (
    <div className="mt-4 flex flex-wrap gap-1.5">
      {tags.map((tag) => (
        <span
          key={tag}
          className="rounded-full bg-paper-dim px-2.5 py-1 text-xs font-medium text-ink-700"
        >
          {tag}
        </span>
      ))}
    </div>
  );
}

function Actions({ project, onOpen }: { project: Project; onOpen?: () => void }) {
  const count = project.screenshots?.length ?? 0;
  return (
    <>
      <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-3">
        {project.downloadUrl && (
          <a
            href={project.downloadUrl}
            download
            {...(isExternal(project.downloadUrl)
              ? { target: "_blank", rel: "noopener noreferrer" }
              : {})}
            className="inline-flex items-center gap-2 rounded-full bg-orange-500 px-4 py-2 text-sm font-semibold text-paper transition-colors hover:bg-orange-600"
          >
            Download APK
            <span aria-hidden="true">↓</span>
          </a>
        )}
        {project.url && (
          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-semibold text-orange-600 hover:underline"
          >
            Visit site →
          </a>
        )}
        {onOpen && count > 0 && (
          <button
            type="button"
            onClick={onOpen}
            className="text-sm font-semibold text-ink-700 hover:text-orange-600"
          >
            View screenshots ({count})
          </button>
        )}
      </div>
      {project.downloadUrl && (
        <p className="mt-2 text-xs text-ink-500">
          Android only. You may need to allow installs from unknown sources.
        </p>
      )}
    </>
  );
}

function Gallery({ project }: { project: Project }) {
  const images = project.screenshots ?? [];
  const style = project.screenshotStyle ?? "desktop";
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (style !== "desktop" || images.length < 2) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") setActive((i) => (i + 1) % images.length);
      if (e.key === "ArrowLeft") setActive((i) => (i - 1 + images.length) % images.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [style, images.length]);

  if (images.length === 0) return null;

  // Phone: tall screenshots side by side in a swipeable row.
  if (style === "phone") {
    return (
      <div className="flex snap-x gap-4 overflow-x-auto pb-2">
        {images.map((src, i) => (
          <img
            key={src}
            src={src}
            alt={`${project.name} screenshot ${i + 1}`}
            className="h-[55vh] max-h-[28rem] w-auto shrink-0 snap-start rounded-xl border border-line bg-paper-dim object-contain"
          />
        ))}
      </div>
    );
  }

  // Desktop: one large screenshot, arrows and thumbnails to move between them.
  return (
    <div>
      <div className="relative">
        <div className="flex max-h-[60vh] items-center justify-center overflow-hidden rounded-lg border border-line bg-paper-dim">
          <img
            src={images[active]}
            alt={`${project.name} screenshot ${active + 1}`}
            className="max-h-[60vh] w-auto max-w-full object-contain"
          />
        </div>
        {images.length > 1 && (
          <>
            <button
              type="button"
              aria-label="Previous screenshot"
              onClick={() => setActive((i) => (i - 1 + images.length) % images.length)}
              className="absolute left-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-line bg-paper/90 text-ink-950 hover:border-ink-950"
            >
              ←
            </button>
            <button
              type="button"
              aria-label="Next screenshot"
              onClick={() => setActive((i) => (i + 1) % images.length)}
              className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-line bg-paper/90 text-ink-950 hover:border-ink-950"
            >
              →
            </button>
          </>
        )}
      </div>

      {images.length > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto">
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Show screenshot ${i + 1}`}
              aria-current={i === active}
              className={`h-12 w-16 shrink-0 overflow-hidden rounded-md border bg-paper-dim ${
                i === active ? "border-orange-500" : "border-line"
              }`}
            >
              <img src={src} alt="" className="h-full w-full object-contain" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function ProjectModal({ project, onClose }: { project: Project; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const trigger = document.activeElement as HTMLElement | null;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
      trigger?.focus();
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-ink-950/60 sm:items-center sm:p-6"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={project.name}
        className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-t-2xl bg-paper p-6 sm:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-5 flex items-start justify-between gap-4">
          <Header project={project} />
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-line text-ink-950 hover:border-ink-950"
          >
            ✕
          </button>
        </div>

        <Gallery project={project} />

        <p className="mt-5 whitespace-pre-line text-sm text-ink-500">{project.description}</p>
        <Tags tags={project.tags} />
        <Actions project={project} />
      </div>
    </div>
  );
}

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [selected, setSelected] = useState<Project | null>(null);
  const closeModal = useCallback(() => setSelected(null), []);

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
              <Header project={project} />
              <p className="mt-3 line-clamp-3 whitespace-pre-line text-sm text-ink-500">
                {project.description}
              </p>
              <Tags tags={project.tags} />
              <Actions project={project} onOpen={() => setSelected(project)} />
            </div>
          ))}
        </div>
      )}

      {selected && <ProjectModal project={selected} onClose={closeModal} />}
    </section>
  );
}
