import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { getPublishedProducts, type Product } from "./products";

const STORAGE_KEY = "rocket-cart";

type LoadStatus = "idle" | "loading" | "ready" | "error";

interface CartContextValue {
  /** Products in the order, resolved against the live product list. */
  items: Product[];
  count: number;
  total: number;
  products: Product[];
  status: LoadStatus;
  isOpen: boolean;
  has: (id: string) => boolean;
  add: (id: string) => void;
  remove: (id: string) => void;
  clear: () => void;
  openCart: () => void;
  closeCart: () => void;
  /** Loads the product list once (safe to call repeatedly). Retries after an error. */
  ensureProducts: () => void;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

// Only product ids are stored in the browser. Names and prices always come
// from Firestore, so a price change on your side applies to carts that are
// already open.
function readIds(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((x): x is string => typeof x === "string") : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [ids, setIds] = useState<string[]>(readIds);
  const [products, setProducts] = useState<Product[]>([]);
  const [status, setStatus] = useState<LoadStatus>("idle");
  const [isOpen, setIsOpen] = useState(false);
  const loadStarted = useRef(false);

  const ensureProducts = useCallback(() => {
    if (loadStarted.current) return;
    loadStarted.current = true;
    setStatus("loading");
    getPublishedProducts()
      .then((list) => {
        setProducts(list);
        setStatus("ready");
      })
      .catch((err) => {
        console.error("Failed to load products:", err);
        loadStarted.current = false; // allow a retry
        setStatus("error");
      });
  }, []);

  // Someone returning with a saved order: load products so it can be shown.
  useEffect(() => {
    if (ids.length > 0) ensureProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
    } catch {
      // Storage blocked (private mode etc.) — the order still works for this visit.
    }
  }, [ids]);

  // Drop products that were unpublished or deleted since they were added.
  useEffect(() => {
    if (status !== "ready") return;
    const live = new Set(products.map((p) => p.id));
    setIds((prev) => (prev.every((id) => live.has(id)) ? prev : prev.filter((id) => live.has(id))));
  }, [status, products]);

  const items = useMemo(
    () => ids.map((id) => products.find((p) => p.id === id)).filter((p): p is Product => Boolean(p)),
    [ids, products]
  );

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      count: status === "ready" ? items.length : ids.length,
      total: items.reduce((sum, p) => sum + p.price, 0),
      products,
      status,
      isOpen,
      has: (id) => ids.includes(id),
      add: (id) => setIds((prev) => (prev.includes(id) ? prev : [...prev, id])),
      remove: (id) => setIds((prev) => prev.filter((x) => x !== id)),
      clear: () => setIds([]),
      openCart: () => {
        ensureProducts();
        setIsOpen(true);
      },
      closeCart: () => setIsOpen(false),
      ensureProducts,
    }),
    [items, ids, products, status, isOpen, ensureProducts]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
