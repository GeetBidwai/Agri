export function formatPricePerKg(value) {
  const normalized = String(value ?? "")
    .replace(/^\s*(?:₹|Rs\.?|INR)\s*/i, "")
    .trim();

  return normalized ? `₹${normalized}/kg` : "N/A";
}
