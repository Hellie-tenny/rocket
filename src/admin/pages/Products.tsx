import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { deleteProduct, getAllProducts, updateProduct, type Product } from "../../lib/products";
import { deleteCoverImage } from "../../lib/images";
import { formatPrice } from "../../lib/shopConfig";

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getAllProducts()
      .then(setProducts)
      .catch((err) => {
        console.error("Failed to load products:", err);
        setError("Couldn't load products. Check the browser console and your Firestore rules.");
      })
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (product: Product) => {
    if (!window.confirm(`Delete "${product.name}"? This can't be undone.`)) return;
    try {
      await deleteProduct(product.id);
      if (product.imageUrl) await deleteCoverImage(product.imageUrl);
      setProducts((prev) => prev.filter((p) => p.id !== product.id));
    } catch (err) {
      console.error("Failed to delete product:", err);
      setError("Couldn't delete that product. Try again.");
    }
  };

  const handleToggle = async (product: Product) => {
    try {
      await updateProduct(product.id, { published: !product.published });
      setProducts((prev) => prev.map((p) => (p.id === product.id ? { ...p, published: !p.published } : p)));
    } catch (err) {
      console.error("Failed to update product:", err);
      setError("Couldn't update that product. Try again.");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold">Products</h1>
        <Link
          to="/admin/products/new"
          className="rounded-full bg-orange-500 px-5 py-2 text-sm font-semibold text-paper transition-colors hover:bg-orange-600"
        >
          New product
        </Link>
      </div>

      {error && <p className="mt-4 text-sm text-orange-600">{error}</p>}

      <div className="mt-6">
        {loading ? (
          <p className="text-sm text-ink-500">Loading…</p>
        ) : products.length === 0 ? (
          <p className="text-sm text-ink-500">
            No products yet —{" "}
            <Link to="/admin/products/new" className="text-orange-600 hover:underline">
              add your first one
            </Link>
            .
          </p>
        ) : (
          <ul className="divide-y divide-line rounded-lg border border-line">
            {products.map((product) => (
              <li key={product.id} className="flex items-center justify-between gap-4 px-4 py-3">
                <div className="flex min-w-0 items-center gap-3">
                  {product.imageUrl ? (
                    <img src={product.imageUrl} alt="" className="h-10 w-14 shrink-0 rounded-md border border-line object-cover" />
                  ) : (
                    <div className="h-10 w-14 shrink-0 rounded-md border border-line bg-paper-dim" />
                  )}
                  <div className="min-w-0">
                    <p className="truncate font-medium">{product.name}</p>
                    <div className="mt-0.5 flex items-center gap-2 text-xs text-ink-500">
                      <span
                        className={`rounded-full px-2 py-0.5 font-medium ${
                          product.published ? "bg-orange-100 text-orange-600" : "bg-paper-dim text-ink-500"
                        }`}
                      >
                        {product.published ? "Visible" : "Hidden"}
                      </span>
                      <span>{formatPrice(product.price)}</span>
                    </div>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <button
                    onClick={() => handleToggle(product)}
                    className="text-sm font-medium text-ink-500 hover:text-orange-600"
                  >
                    {product.published ? "Hide" : "Show"}
                  </button>
                  <Link
                    to={`/admin/products/${product.id}/edit`}
                    className="text-sm font-medium text-ink-700 hover:text-orange-600"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(product)}
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
