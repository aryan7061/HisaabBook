export type AmountCurrency = "INR" | "USD";

export const CURRENCY_SYMBOL: Record<AmountCurrency, string> = {
  INR: "₹",
  USD: "$",
};

export const groupDigits = (
  digits: string,
  currency: AmountCurrency,
): string => {
  if (!digits) return "";

  if (currency === "USD") {
    return digits.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  const lastThree = digits.slice(-3);
  const rest = digits.slice(0, -3);
  if (!rest) return lastThree;

  return `${rest.replace(/\B(?=(\d{2})+(?!\d))/g, ",")},${lastThree}`;
};

export const formatAmountForInput = (
  value: string | number | undefined | null,
  currency: AmountCurrency,
): string => {
  if (value === undefined || value === null || value === "") return "";

  const raw = String(value);
  const negative = raw.startsWith("-");
  const unsigned = negative ? raw.slice(1) : raw;

  const dotIndex = unsigned.indexOf(".");
  const intPart = dotIndex === -1 ? unsigned : unsigned.slice(0, dotIndex);
  const decPart = dotIndex === -1 ? undefined : unsigned.slice(dotIndex + 1);

  const grouped = groupDigits(intPart.replace(/\D/g, ""), currency);
  const sign = negative ? "-" : "";

  return decPart === undefined
    ? `${sign}${grouped}`
    : `${sign}${grouped}.${decPart}`;
};

export const parseAmountFromInput = (display: string | undefined): string =>
  display ? display.replace(/[^\d.-]/g, "") : "";
