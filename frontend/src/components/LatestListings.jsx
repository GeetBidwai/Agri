import { useMemo, useState } from "react";
import ListingCard from "./ListingCard";

function LatestListings({
  listings = [],
  onNavigateToContact,
  onNavigateToDetail,
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
        title: "लिस्टिंग्स",
        subtitle: "ताजा मार्केट अवसर एक जगह",
        category: "श्रेणी",
        maxPrice: "अधिकतम मूल्य",
        location: "स्थान",
        empty: "कोई लिस्टिंग नहीं मिली",
      }
    : {
        title: "Listings",
        subtitle: "Browse all marketplace opportunities in one place",
        category: "Category",
        maxPrice: "Max Price",
        location: "Location",
        empty: "No listings found",
      };

  const filteredListings = useMemo(() => listings
    .filter((item) => !filters.category || item.category === filters.category)
    .filter((item) => !filters.location || item.location?.toLowerCase().includes(filters.location.toLowerCase()))
    .filter((item) => !filters.maxPrice || Number(item.price || item.price_per_kg || 0) <= Number(filters.maxPrice)), [filters, listings]);

  return (
    <section id="latest-listings" className="bg-gray-50 py-14 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold">{text.title}</h2>
        <p className="mt-1 text-gray-600">{text.subtitle}</p>

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
                onNavigateToDetail={onNavigateToDetail}
                onPlaceBid={onPlaceBid}
                onViewBids={onViewBids}
                language={language}
              />
            ))
          ) : (
            <div className="col-span-full py-12 text-center text-gray-500 italic">
              {text.empty}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default LatestListings;
