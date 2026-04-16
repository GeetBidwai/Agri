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
        title: "à¤¨à¤ˆ à¤²à¤¿à¤¸à¥à¤Ÿà¤¿à¤‚à¤—",
        subtitle: "à¤–à¤°à¥€à¤¦ à¤”à¤° à¤¬à¤¿à¤•à¥à¤°à¥€ à¤•à¥‡ à¤¨à¤ à¤…à¤µà¤¸à¤°",
        sell: "à¤¬à¤¿à¤•à¥à¤°à¥€ à¤•à¥‡ à¤²à¤¿à¤ à¤‰à¤ªà¤²à¤¬à¥à¤§",
        buy: "à¤–à¤°à¥€à¤¦à¤¾à¤° à¤¤à¤²à¤¾à¤¶ à¤®à¥‡à¤‚",
        category: "Category",
        maxPrice: "Max Price",
        location: "Location",
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
              {language === "HI" ? "à¤•à¥‹à¤ˆ à¤²à¤¿à¤¸à¥à¤Ÿà¤¿à¤‚à¤— à¤¨à¤¹à¥€à¤‚ à¤®à¤¿à¤²à¥€" : "No listings found"}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default LatestListings;
