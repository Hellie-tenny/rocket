import type { Product } from "./products";
import { WHATSAPP_NUMBER, formatPrice } from "./shopConfig";

export function buildOrderMessage(items: Product[], customerName: string): string {
  const total = items.reduce((sum, p) => sum + p.price, 0);
  const lines = items.map((p, i) => `${i + 1}. ${p.name} - ${formatPrice(p.price)}`);

  return [
    "Hello Rocket, I'd like to order:",
    "",
    ...lines,
    "",
    `Total: ${formatPrice(total)}`,
    "",
    `Name: ${customerName.trim()}`,
    "",
    `Sent from ${window.location.origin}/shop`,
  ].join("\n");
}

export function buildWhatsAppUrl(items: Product[], customerName: string): string {
  const text = encodeURIComponent(buildOrderMessage(items, customerName));
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;
}
