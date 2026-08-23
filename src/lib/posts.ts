import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
  type Timestamp,
} from "firebase/firestore";
import { db } from "./firebase";

export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string; // HTML from the rich text editor
  coverImageUrl: string | null;
  published: boolean;
  createdAt: Timestamp | null;
  updatedAt: Timestamp | null;
}

export type PostInput = Pick<Post, "title" | "slug" | "excerpt" | "content" | "coverImageUrl" | "published">;

const postsRef = collection(db, "posts");

export function slugify(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export async function createPost(input: PostInput): Promise<string> {
  const docRef = await addDoc(postsRef, {
    ...input,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function updatePost(id: string, input: Partial<PostInput>): Promise<void> {
  await updateDoc(doc(db, "posts", id), {
    ...input,
    updatedAt: serverTimestamp(),
  });
}

export async function deletePost(id: string): Promise<void> {
  await deleteDoc(doc(db, "posts", id));
}

// Admin: all posts regardless of published state, newest first.
export async function getAllPosts(): Promise<Post[]> {
  const q = query(postsRef, orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Post);
}

// Public: published posts only, newest first.
export async function getPublishedPosts(): Promise<Post[]> {
  const q = query(postsRef, where("published", "==", true), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Post);
}

export async function getPostById(id: string): Promise<Post | null> {
  const snap = await getDoc(doc(db, "posts", id));
  return snap.exists() ? ({ id: snap.id, ...snap.data() } as Post) : null;
}

// Public: fetch a single published post by its slug.
export async function getPublishedPostBySlug(slug: string): Promise<Post | null> {
  const q = query(postsRef, where("slug", "==", slug), where("published", "==", true));
  const snap = await getDocs(q);
  if (snap.empty) return null;
  const d = snap.docs[0];
  return { id: d.id, ...d.data() } as Post;
}

// Admin: check a slug isn't already taken (optionally excluding the post being edited).
export async function isSlugTaken(slug: string, excludeId?: string): Promise<boolean> {
  const q = query(postsRef, where("slug", "==", slug));
  const snap = await getDocs(q);
  return snap.docs.some((d) => d.id !== excludeId);
}
