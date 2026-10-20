import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../lib/cart";
import { WHATSAPP_NUMBER, formatPrice } from "../lib/shopConfig";
import { buildWhatsAppUrl } from "../lib/whatsapp";

const NAME_KEY = "rocket-customer-name";

function readName(): string {
  try {
    return localStorage.getItem(NAME_KEY) ?? "";
  } catch {
    return "";
  }
}

export default function CartDrawer() {
  const { items, count, total, status, isOpen, closeCart, remove, clear, ensureProducts } = useCart();
  const [name, setName] = useState(readName);
  const [nameError, setNameError] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);

  // Escape closes; page behind doesn't scroll while the drawer is open.
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeCart();
    };
    document.addEventListener("keydown", onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen, closeCart]);

  const handleNameChange = (value: string) => {
    setName(value);
    setNameError(false);
    try {
      localStorage.setItem(NAME_KEY, value);
    } catch {
      // ignore
    }
  };

  const canSend = items.length > 0 && Boolean(WHATSAPP_NUMBER);

  return (
    <div
      className={`fixed inset-0 z-50 ${isOpen ? "" : "pointer-events-none"}`}
      aria-hidden={!isOpen}
    >
      <div
        onClick={closeCart}
        className={`absolute inset-0 bg-ink-950/40 transition-opacity motion-reduce:transition-none ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Your order"
        className={`absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-paper shadow-xl transition-[transform,visibility] duration-200 motion-reduce:transition-none ${
          isOpen ? "visible translate-x-0" : "invisible translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-line px-6 py-4">
          <h2 className="font-display text-lg font-semibold">Your order</h2>
          <button
            ref={closeRef}
            type="button"
            onClick={closeCart}
            aria-label="Close order"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-ink-950 hover:bg-paper-dim"
          >
            <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
              <path d="M6 6l12 12M6 18L18 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          {status === "loading" && count > 0 && <p className="text-sm text-ink-500">Loading your order…</p>}

          {status === "error" && (
            <div className="text-sm text-ink-500">
              <p>Couldn't load your order. Check your connection and try again.</p>
              <button
                type="button"
                onClick={ensureProducts}
                className="mt-2 font-semibold text-orange-600 hover:underline"
              >
                Try again
              </button>
            </div>
          )}

          {status !== "loading" && status !== "error" && items.length === 0 && (
            <div className="text-sm text-ink-500">
              <p>Your order is empty.</p>
              <Link
                to="/shop"
                onClick={closeCart}
                className="mt-2 inline-block font-semibold text-orange-600 hover:underline"
              >
                Browse the shop
              </Link>
            </div>
          )}

          {items.length > 0 && (
            <ul className="divide-y divide-line">
              {items.map((product) => (
                <li key={product.id} className="flex items-start justify-between gap-4 py-4">
                  <div className="min-w-0">
                    <p className="font-medium">{product.name}</p>
                    <p className="mt-0.5 text-sm text-ink-500">{formatPrice(product.price)}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => remove(product.id)}
                    className="shrink-0 text-sm font-medium text-ink-500 hover:text-orange-600"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <div className="space-y-4 border-t border-line px-6 py-5">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-ink-700">Total</span>
              <span className="font-display text-xl font-bold">{formatPrice(total)}</span>
            </div>

            <div>
              <label htmlFor="customer-name" className="block text-sm font-medium text-ink-700">
                Your name
              </label>
              <input
                id="customer-name"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                autoComplete="name"
                aria-invalid={nameError}
                className={`mt-1 w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-orange-500 ${
                  nameError ? "border-orange-500" : "border-line"
                }`}
              />
              {nameError && <p className="mt-1 text-xs text-orange-600">Enter your name so we know who the order is from.</p>}
            </div>

            {/* A real link (not window.open) so phone browsers never block it. */}
            <a
              href={canSend && name.trim() ? buildWhatsAppUrl(items, name) : undefined}
              target="_blank"
              rel="noopener noreferrer"
              role="button"
              aria-disabled={!canSend}
              onClick={(e) => {
                if (!canSend) {
                  e.preventDefault();
                  return;
                }
                if (!name.trim()) {
                  e.preventDefault();
                  setNameError(true);
                  document.getElementById("customer-name")?.focus();
                }
              }}
              className={`block rounded-full px-6 py-3 text-center text-sm font-semibold text-paper transition-colors ${
                canSend ? "bg-orange-500 hover:bg-orange-600" : "cursor-not-allowed bg-ink-300"
              }`}
            >
              Send order on WhatsApp
            </a>

            {!WHATSAPP_NUMBER && (
              <p className="text-xs text-ink-500">Ordering isn't switched on yet — check back soon.</p>
            )}

            <div className="flex items-center justify-between text-xs text-ink-500">
              <span>WhatsApp opens with your order ready to send.</span>
              <button type="button" onClick={clear} className="font-medium hover:text-orange-600">
                Clear order
              </button>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}
