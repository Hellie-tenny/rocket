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

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string | null;
  published: boolean;
  createdAt: Timestamp | null;
  updatedAt: Timestamp | null;
}

export type ProductInput = Pick<Product, "name" | "description" | "price" | "imageUrl" | "published">;

const productsRef = collection(db, "products");

export async function createProduct(input: ProductInput): Promise<string> {
  const docRef = await addDoc(productsRef, {
    ...input,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function updateProduct(id: string, input: Partial<ProductInput>): Promise<void> {
  await updateDoc(doc(db, "products", id), { ...input, updatedAt: serverTimestamp() });
}

export async function deleteProduct(id: string): Promise<void> {
  await deleteDoc(doc(db, "products", id));
}

// Admin: every product, newest first.
export async function getAllProducts(): Promise<Product[]> {
  const snap = await getDocs(query(productsRef, orderBy("createdAt", "desc")));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Product);
}

// Public: published products only. Sorted in the browser so this query
// doesn't need a custom Firestore index.
export async function getPublishedProducts(): Promise<Product[]> {
  const snap = await getDocs(query(productsRef, where("published", "==", true)));
  return snap.docs
    .map((d) => ({ id: d.id, ...d.data() }) as Product)
    .sort((a, b) => (b.createdAt?.toMillis() ?? 0) - (a.createdAt?.toMillis() ?? 0));
}

export async function getProductById(id: string): Promise<Product | null> {
  const snap = await getDoc(doc(db, "products", id));
  return snap.exists() ? ({ id: snap.id, ...snap.data() } as Product) : null;
}
