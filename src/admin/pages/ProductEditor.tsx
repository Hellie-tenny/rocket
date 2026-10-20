import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ImageUploader from "../components/ImageUploader";
import { createProduct, getProductById, updateProduct } from "../../lib/products";
import { deleteCoverImage } from "../../lib/images";
import { CURRENCY_LABEL } from "../../lib/shopConfig";

export default function ProductEditor() {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();

  const [draftId] = useState(() => id ?? crypto.randomUUID());
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [originalImageUrl, setOriginalImageUrl] = useState<string | null>(null);
  const [published, setPublished] = useState(true);

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const product = await getProductById(id);
        if (product) {
          setName(product.name);
          setDescription(product.description);
          setPrice(String(product.price));
          setImageUrl(product.imageUrl);
          setOriginalImageUrl(product.imageUrl);
          setPublished(product.published);
        } else {
          setError("That product no longer exists.");
        }
      } catch (err) {
        console.error("Failed to load product:", err);
        setError("Couldn't load this product.");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const handleImageChange = async (url: string | null) => {
    if (originalImageUrl && originalImageUrl !== url) {
      await deleteCoverImage(originalImageUrl);
    }
    setImageUrl(url);
    setOriginalImageUrl(url);
  };

  const handleSave = async () => {
    setError(null);

    const priceNumber = Number(price);
    if (!name.trim()) {
      setError("Name is required.");
      return;
    }
    if (price.trim() === "" || !Number.isFinite(priceNumber) || priceNumber < 0) {
      setError("Enter a price of 0 or more.");
      return;
    }

    setSaving(true);
    try {
      const input = {
        name: name.trim(),
        description: description.trim(),
        price: priceNumber,
        imageUrl,
        published,
      };
      if (isEditing && id) {
        await updateProduct(id, input);
      } else {
        await createProduct(input);
      }
      navigate("/admin/products");
    } catch (err) {
      console.error("Failed to save product:", err);
      setError("Something went wrong saving the product. Try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-sm text-ink-500">Loading…</p>;

  return (
    <div className="max-w-2xl">
      <h1 className="font-display text-2xl font-bold">{isEditing ? "Edit product" : "New product"}</h1>

      <div className="mt-6 space-y-5">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-ink-700">
            Name
          </label>
          <input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 w-full rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-orange-500"
          />
        </div>

        <div>
          <label htmlFor="price" className="block text-sm font-medium text-ink-700">
            Price ({CURRENCY_LABEL})
          </label>
          <input
            id="price"
            type="number"
            inputMode="decimal"
            min="0"
            step="any"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="mt-1 w-full max-w-xs rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-orange-500"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-ink-700">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="mt-1 w-full rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-orange-500"
          />
          <p className="mt-1 text-xs text-ink-500">What the customer gets. Line breaks are kept.</p>
        </div>

        <ImageUploader postId={draftId} value={imageUrl} onChange={handleImageChange} label="Product image" />

        <label className="flex items-center gap-2 text-sm font-medium text-ink-700">
          <input
            type="checkbox"
            checked={published}
            onChange={(e) => setPublished(e.target.checked)}
            className="h-4 w-4 accent-orange-500"
          />
          Show in the shop
        </label>

        {error && <p className="text-sm text-orange-600">{error}</p>}

        <div className="flex items-center gap-3 border-t border-line pt-5">
          <button
            type="button"
            disabled={saving}
            onClick={handleSave}
            className="rounded-full bg-orange-500 px-5 py-2 text-sm font-semibold text-paper transition-colors hover:bg-orange-600 disabled:opacity-50"
          >
            {saving ? "Saving…" : "Save product"}
          </button>
          <button
            type="button"
            disabled={saving}
            onClick={() => navigate("/admin/products")}
            className="rounded-full border border-line px-5 py-2 text-sm font-semibold text-ink-950 transition-colors hover:border-ink-950 disabled:opacity-50"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
