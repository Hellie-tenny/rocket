import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useCart } from "../lib/cart";
import { formatPrice } from "../lib/shopConfig";

export default function Shop() {
  const { products, status, ensureProducts, has, add, remove, count, total, openCart } = useCart();

  useEffect(() => {
    ensureProducts();
  }, [ensureProducts]);

  return (
    <section className="mx-auto max-w-6xl px-6 py-24">
      <Helmet>
        <title>Shop — Rocket</title>
        <meta name="description" content="Software and digital products from Rocket. Pick what you need and order on WhatsApp." />
        <link rel="canonical" href="https://rocket-technologies.web.app/shop" />
      </Helmet>

      <h1 className="font-display text-3xl font-bold sm:text-4xl">Shop</h1>
      <p className="mt-4 max-w-xl text-ink-500">
        Choose what you need, then send your order to us on WhatsApp. We'll reply with payment details and
        deliver it to you.
      </p>

      {(status === "idle" || status === "loading") && <p className="mt-12 text-sm text-ink-500">Loading products…</p>}

      {status === "error" && (
        <div className="mt-12 text-sm text-ink-500">
          <p>Couldn't load the products. Check your connection and try again.</p>
          <button type="button" onClick={ensureProducts} className="mt-2 font-semibold text-orange-600 hover:underline">
            Try again
          </button>
        </div>
      )}

      {status === "ready" && products.length === 0 && (
        <p className="mt-12 text-sm text-ink-500">Nothing in the shop yet. Check back soon.</p>
      )}

      {products.length > 0 && (
        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => {
            const inOrder = has(product.id);
            return (
              <article
                key={product.id}
                className={`flex flex-col overflow-hidden rounded-xl border transition-colors ${
                  inOrder ? "border-orange-500" : "border-line hover:border-orange-500"
                }`}
              >
                {product.imageUrl ? (
                  <img
                    src={product.imageUrl}
                    alt=""
                    loading="lazy"
                    className="aspect-video w-full border-b border-line object-cover"
                  />
                ) : (
                  <div
                    aria-hidden="true"
                    className="font-display flex aspect-video w-full items-center justify-center border-b border-line bg-paper-dim text-4xl font-bold text-ink-300"
                  >
                    {product.name.charAt(0).toUpperCase()}
                  </div>
                )}

                <div className="flex flex-1 flex-col p-6">
                  <h2 className="font-display text-xl font-semibold">{product.name}</h2>
                  <p className="mt-3 flex-1 whitespace-pre-line text-sm text-ink-500">{product.description}</p>

                  <div className="mt-6 flex items-center justify-between gap-4">
                    <p className="font-display text-lg font-bold">{formatPrice(product.price)}</p>
                    {inOrder ? (
                      <button
                        type="button"
                        onClick={() => remove(product.id)}
                        className="rounded-full border border-orange-500 bg-orange-100 px-5 py-2 text-sm font-semibold text-orange-600 transition-colors hover:bg-orange-500 hover:text-paper"
                      >
                        Added · Remove
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => add(product.id)}
                        className="rounded-full bg-ink-950 px-5 py-2 text-sm font-semibold text-paper transition-colors hover:bg-orange-500"
                      >
                        Add to order
                      </button>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Phone-friendly shortcut once something is selected */}
      {count > 0 && (
        <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-paper/95 px-4 py-3 backdrop-blur sm:hidden">
          <button
            type="button"
            onClick={openCart}
            className="flex w-full items-center justify-between rounded-full bg-orange-500 px-6 py-3 text-sm font-semibold text-paper"
          >
            <span>
              Review order ({count})
            </span>
            {status === "ready" && <span>{formatPrice(total)}</span>}
          </button>
        </div>
      )}
    </section>
  );
}
