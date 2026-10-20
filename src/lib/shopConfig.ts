// Shop settings. Set these in your .env file (and in your hosting build environment):
//   VITE_WHATSAPP_NUMBER=265XXXXXXXXX   (country code + number, digits only)
//   VITE_CURRENCY_LABEL=MWK             (shown before every price)
export const WHATSAPP_NUMBER = ((import.meta.env.VITE_WHATSAPP_NUMBER as string | undefined) ?? "").replace(
  /\D/g,
  ""
);

export const CURRENCY_LABEL = ((import.meta.env.VITE_CURRENCY_LABEL as string | undefined) ?? "$").trim();

export function formatPrice(amount: number): string {
  const value = amount.toLocaleString(undefined, { maximumFractionDigits: 2 });
  // Symbols ($, £, €) sit tight against the number; codes (MWK, USD) get a space.
  return CURRENCY_LABEL.length <= 1 ? `${CURRENCY_LABEL}${value}` : `${CURRENCY_LABEL} ${value}`;
}
