import ListingCard from "./ListingCard";

function LatestListings({
  listings,
  activeListingType,
  setActiveListingType,
  onNavigateToContact,
  onPlaceBid,
  onViewBids,
  language,
}) {
  const text = language === "HI"
    ? {
        title: "नई लिस्टिंग",
        subtitle: "खरीद और बिक्री के नए अवसर",
        sell: "बिक्री के लिए उपलब्ध",
        buy: "खरीदार तलाश में",
      }
    : {
        title: "Latest Listings",
        subtitle: "Fresh buy & sell opportunities",
        sell: "Available to Sell",
        buy: "Buyers Looking For",
      };

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

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {listings.length > 0 ? (
            listings.map((item, index) => (
              <ListingCard
                key={index}
                item={item}
                onNavigateToContact={onNavigateToContact}
                onPlaceBid={onPlaceBid}
                onViewBids={onViewBids}
                language={language}
              />
            ))
          ) : (
            <div className="col-span-full py-12 text-center text-gray-500 italic">
              {language === "HI" ? "कोई लिस्टिंग नहीं मिली" : "No listings found"}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default LatestListings;
