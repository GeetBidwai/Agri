import { useMemo, useState } from "react";
import ListingCard from "./ListingCard";

function LatestListings({
  listings = [],
  activeListingType,
  setActiveListingType,
  onNavigateToContact,
  onPlaceBid,
  onViewBids,
  language,
}) {
  const [filters, setFilters] = useState({
    category: "",
    maxPrice: "",
    location: "",
  });

  const text = language === "HI"
    ? {
        title: "\u0928\u0908 \u0932\u093f\u0938\u094d\u091f\u093f\u0902\u0917",
        subtitle: "\u0916\u0930\u0940\u0926 \u0914\u0930 \u092c\u093f\u0915\u094d\u0930\u0940 \u0915\u0947 \u0928\u090f \u0905\u0935\u0938\u0930",
        sell: "\u092c\u093f\u0915\u094d\u0930\u0940 \u0915\u0947 \u0932\u093f\u090f \u0909\u092a\u0932\u092c\u094d\u0927",
        buy: "\u0916\u0930\u0940\u0926\u093e\u0930 \u0924\u0932\u093e\u0936 \u092e\u0947\u0902",
        category: "श्रेणी",
        maxPrice: "अधिकतम मूल्य",
        location: "स्थान",
      }
    : {
        title: "Latest Listings",
        subtitle: "Fresh buy & sell opportunities",
        sell: "Available to Sell",
        buy: "Buyers Looking For",
        category: "Category",
        maxPrice: "Max Price",
        location: "Location",
      };

  const filteredListings = useMemo(() => listings
    .filter((item) => !activeListingType || item.listing_type === activeListingType)
    .filter((item) => !filters.category || item.category === filters.category)
    .filter((item) => !filters.location || item.location?.toLowerCase().includes(filters.location.toLowerCase()))
    .filter((item) => !filters.maxPrice || Number(item.price || item.price_per_kg || 0) <= Number(filters.maxPrice)), [activeListingType, filters, listings]);

  return (
    <section id="latest-listings" className="bg-gray-50 py-14 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold">{text.title}</h2>
        <p className="text-gray-600 mt-1">{text.subtitle}</p>

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => setActiveListingType("SELL")}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              activeListingType === "SELL"
                ? "bg-green-600 text-white"
                : "border border-gray-200 bg-white text-gray-700"
            }`}
          >
            {text.sell}
          </button>

          <button
            type="button"
            onClick={() => setActiveListingType("BUY")}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              activeListingType === "BUY"
                ? "bg-amber-500 text-white"
                : "border border-gray-200 bg-white text-gray-700"
            }`}
          >
            {text.buy}
          </button>
        </div>

        <div className="mt-6 grid gap-3 md:grid-cols-3">
          <input
            value={filters.category}
            onChange={(e) => setFilters((current) => ({ ...current, category: e.target.value }))}
            placeholder={text.category}
            className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm"
          />
          <input
            type="number"
            value={filters.maxPrice}
            onChange={(e) => setFilters((current) => ({ ...current, maxPrice: e.target.value }))}
            placeholder={text.maxPrice}
            className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm"
          />
          <input
            value={filters.location}
            onChange={(e) => setFilters((current) => ({ ...current, location: e.target.value }))}
            placeholder={text.location}
            className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm"
          />
        </div>

        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3">
          {filteredListings.length > 0 ? (
            filteredListings.map((item) => (
              <ListingCard
                key={item.id}
                item={item}
                onNavigateToContact={onNavigateToContact}
                onPlaceBid={onPlaceBid}
                onViewBids={onViewBids}
                language={language}
              />
            ))
          ) : (
            <div className="col-span-full py-12 text-center text-gray-500 italic">
              {language === "HI" ? "\u0915\u094b\u0908 \u0932\u093f\u0938\u094d\u091f\u093f\u0902\u0917 \u0928\u0939\u0940\u0902 \u092e\u093f\u0932\u0940" : "No listings found"}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default LatestListings;
