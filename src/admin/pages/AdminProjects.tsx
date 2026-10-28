import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  deleteProject,
  getAllProjects,
  importInitialProjects,
  updateProject,
  type Project,
} from "../../lib/projects";

export default function AdminProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [importing, setImporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = () =>
    getAllProjects()
      .then(setProjects)
      .catch((err) => {
        console.error("Failed to load projects:", err);
        setError("Couldn't load projects. Check the browser console and your Firestore rules.");
      })
      .finally(() => setLoading(false));

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (project: Project) => {
    if (!window.confirm(`Delete "${project.name}"? This can't be undone.`)) return;
    try {
      await deleteProject(project.id);
      setProjects((prev) => prev.filter((p) => p.id !== project.id));
    } catch (err) {
      console.error("Failed to delete project:", err);
      setError("Couldn't delete that project. Try again.");
    }
  };

  const handleToggle = async (project: Project) => {
    try {
      await updateProject(project.id, { published: !project.published });
      setProjects((prev) =>
        prev.map((p) => (p.id === project.id ? { ...p, published: !p.published } : p))
      );
    } catch (err) {
      console.error("Failed to update project:", err);
      setError("Couldn't update that project. Try again.");
    }
  };

  const handleImport = async () => {
    setImporting(true);
    setError(null);
    try {
      await importInitialProjects();
      await load();
    } catch (err) {
      console.error("Failed to import projects:", err);
      setError("Couldn't import the existing projects. Check your Firestore rules.");
    } finally {
      setImporting(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold">Projects</h1>
        <Link
          to="/admin/projects/new"
          className="rounded-full bg-orange-500 px-5 py-2 text-sm font-semibold text-paper transition-colors hover:bg-orange-600"
        >
          New project
        </Link>
      </div>

      {error && <p className="mt-4 text-sm text-orange-600">{error}</p>}

      <div className="mt-6">
        {loading ? (
          <p className="text-sm text-ink-500">Loading…</p>
        ) : projects.length === 0 ? (
          <div className="rounded-lg border border-dashed border-line p-6">
            <p className="text-sm text-ink-700">No projects yet.</p>
            <p className="mt-1 text-sm text-ink-500">
              Your Our Work page now reads from here. Import FeatScope, Etiquette CV and Postank
              to get started, then add Sprout.
            </p>
            <div className="mt-4 flex items-center gap-4">
              <button
                onClick={handleImport}
                disabled={importing}
                className="rounded-full bg-orange-500 px-5 py-2 text-sm font-semibold text-paper transition-colors hover:bg-orange-600 disabled:opacity-50"
              >
                {importing ? "Importing…" : "Import existing projects"}
              </button>
              <Link to="/admin/projects/new" className="text-sm font-medium text-orange-600 hover:underline">
                or add one from scratch
              </Link>
            </div>
          </div>
        ) : (
          <ul className="divide-y divide-line rounded-lg border border-line">
            {projects.map((project) => (
              <li key={project.id} className="flex items-center justify-between gap-4 px-4 py-3">
                <div className="min-w-0">
                  <p className="truncate font-medium">{project.name}</p>
                  <div className="mt-0.5 flex flex-wrap items-center gap-2 text-xs text-ink-500">
                    <span
                      className={`rounded-full px-2 py-0.5 font-medium ${
                        project.published ? "bg-orange-100 text-orange-600" : "bg-paper-dim text-ink-500"
                      }`}
                    >
                      {project.published ? "Visible" : "Hidden"}
                    </span>
                    {project.downloadUrl && <span>APK link</span>}
                    {project.url && <span>Website link</span>}
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <button
                    onClick={() => handleToggle(project)}
                    className="text-sm font-medium text-ink-500 hover:text-orange-600"
                  >
                    {project.published ? "Hide" : "Show"}
                  </button>
                  <Link
                    to={`/admin/projects/${project.id}/edit`}
                    className="text-sm font-medium text-ink-700 hover:text-orange-600"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(project)}
                    className="text-sm font-medium text-ink-500 hover:text-orange-600"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
