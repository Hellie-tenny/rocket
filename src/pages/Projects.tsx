import { Helmet } from "react-helmet-async";

interface Project {
  name: string;
  description: string;
  tags: string[];
  url?: string;
}

const projects: Project[] = [
  {
    name: "FeatScope",
    description:
      "A movie and TV recommendation app with genre and mood filtering, a content-based scoring algorithm, watchlists, trailer embeds, and streaming provider info.",
    tags: ["React", "TypeScript", "Vite", "Tailwind", "TMDB API"],
    url: "https://featscope.web.app",
  },
  {
    name: "Etiquette CV",
    description:
      "A CV generator that helps people put together a polished resume quickly, with an AI-assisted cover letter feature built on Gemini.",
    tags: ["React", "Vite", "TypeScript", "Tailwind", "Firebase"],
    url: "https://ettiquette-cv.web.app",
  },
  {
    name: "Postank",
    description:
      "An in-browser photo prep and post-design tool — photo enhancement, collages, gradient text cards, and product posts for businesses, all free and client-side.",
    tags: ["React", "Vite", "TypeScript", "Tailwind"],
  },
];

export default function Projects() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-24">
      <Helmet>
        <title>Our Work — Rocket</title>
        <meta name="description" content="Products Rocket has designed, built, and shipped." />
      </Helmet>

      <h1 className="font-display text-3xl font-bold sm:text-4xl">Our Work</h1>
      <p className="mt-4 max-w-xl text-ink-500">
        Products we've designed, built, and shipped.
      </p>

      <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <div
            key={project.name}
            className="rounded-xl border border-line p-6 transition-colors hover:border-orange-500"
          >
            <h2 className="font-display text-xl font-semibold">{project.name}</h2>
            <p className="mt-3 text-sm text-ink-500">{project.description}</p>
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
          </div>
        ))}
      </div>
    </section>
  );
}
