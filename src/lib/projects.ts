import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  updateDoc,
  where,
  writeBatch,
  type Timestamp,
} from "firebase/firestore";
import { db } from "./firebase";

export type ScreenshotStyle = "desktop" | "phone";

export interface Project {
  id: string;
  name: string;
  description: string;
  tags: string[];
  url: string | null; // website link ("Visit site")
  downloadUrl: string | null; // e.g. an APK link ("Download APK")
  iconUrl: string | null; // small app icon shown beside the name
  screenshots: string[]; // image URLs, first one is shown by default
  screenshotStyle: ScreenshotStyle; // how the screenshots are laid out
  order: number; // lower numbers show first
  published: boolean;
  createdAt: Timestamp | null;
  updatedAt: Timestamp | null;
}

export type ProjectInput = Pick<
  Project,
  "name" | "description" | "tags" | "url" | "downloadUrl" | "iconUrl" | "screenshots" | "screenshotStyle" | "order" | "published"
>;

const projectsRef = collection(db, "projects");

// Lower `order` first; ties go to the newest project. Sorted in the browser
// so these queries don't need a custom Firestore index.
function sortProjects(list: Project[]): Project[] {
  return [...list].sort(
    (a, b) =>
      (a.order ?? 0) - (b.order ?? 0) ||
      (b.createdAt?.toMillis() ?? 0) - (a.createdAt?.toMillis() ?? 0)
  );
}

export async function createProject(input: ProjectInput): Promise<string> {
  const docRef = await addDoc(projectsRef, {
    ...input,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function updateProject(id: string, input: Partial<ProjectInput>): Promise<void> {
  await updateDoc(doc(db, "projects", id), { ...input, updatedAt: serverTimestamp() });
}

export async function deleteProject(id: string): Promise<void> {
  await deleteDoc(doc(db, "projects", id));
}

// Admin: every project, hidden ones included.
export async function getAllProjects(): Promise<Project[]> {
  const snap = await getDocs(projectsRef);
  return sortProjects(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Project));
}

// Public: published projects only.
export async function getPublishedProjects(): Promise<Project[]> {
  const snap = await getDocs(query(projectsRef, where("published", "==", true)));
  return sortProjects(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Project));
}

export async function getProjectById(id: string): Promise<Project | null> {
  const snap = await getDoc(doc(db, "projects", id));
  return snap.exists() ? ({ id: snap.id, ...snap.data() } as Project) : null;
}

// One-time import of the projects that used to be hardcoded on the Our Work page.
const INITIAL_PROJECTS: ProjectInput[] = [
  {
    name: "FeatScope",
    description:
      "A movie and TV recommendation app with genre and mood filtering, a content-based scoring algorithm, watchlists, trailer embeds, and streaming provider info.",
    tags: ["React", "TypeScript", "Vite", "Tailwind", "TMDB API"],
    url: "https://featscope.web.app",
    downloadUrl: null,
    iconUrl: null,
    screenshots: [],
    screenshotStyle: "desktop",
    order: 10,
    published: true,
  },
  {
    name: "Etiquette CV",
    description:
      "A CV generator that helps people put together a polished resume quickly, with an AI-assisted cover letter feature built on Gemini.",
    tags: ["React", "Vite", "TypeScript", "Tailwind", "Firebase"],
    url: "https://ettiquette-cv.web.app",
    downloadUrl: null,
    iconUrl: null,
    screenshots: [],
    screenshotStyle: "desktop",
    order: 20,
    published: true,
  },
  {
    name: "Postank",
    description:
      "An in-browser photo prep and post-design tool — photo enhancement, collages, gradient text cards, and product posts for businesses, all free and client-side.",
    tags: ["React", "Vite", "TypeScript", "Tailwind"],
    url: null,
    downloadUrl: null,
    iconUrl: null,
    screenshots: [],
    screenshotStyle: "desktop",
    order: 30,
    published: true,
  },
];

export async function importInitialProjects(): Promise<void> {
  const batch = writeBatch(db);
  for (const project of INITIAL_PROJECTS) {
    batch.set(doc(projectsRef), {
      ...project,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  }
  await batch.commit();
}
