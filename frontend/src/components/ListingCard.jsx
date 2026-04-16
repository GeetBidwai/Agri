function ListingCard({ item, onNavigateToContact, onPlaceBid, onViewBids, language }) {
  const listingType = item.listing_type || item.type?.toUpperCase();
  const isTrusted = item.seller_verified || item.is_verified || item.verified;
  const displayName = item.product_name || item.name;
  const displayHindiName = item.hindi_name || item.hindi;
  const displayPrice = item.price || item.price_per_kg;

  const text = language === "HI"
    ? {
        forSale: "बिक्री के लिए",
        wanted: "जरूरत है",
        verified: "सत्यापित",
        verifiedListing: "सत्यापित लिस्टिंग",
        qty: "मात्रा",
        location: "स्थान",
        date: "तारीख",
        recentlyAdded: "अभी जोड़ी गई",
        warning: "अग्रिम भुगतान न करें",
        report: "रिपोर्ट करें",
        viewContact: "संपर्क देखें",
        placeBid: "बोली लगाएं",
        viewBids: "बोलियां देखें",
        notSpecified: "उल्लेख नहीं",
      }
    : {
        forSale: "FOR SALE",
        wanted: "WANTED",
        verified: "Verified Seller",
        verifiedListing: "Verified seller",
        qty: "Qty",
        location: "Location",
        date: "Date",
        recentlyAdded: "Recently added",
        warning: "Do not pay advance",
        report: "Report",
        viewContact: "Contact Seller",
        placeBid: "Place Bid",
        viewBids: "View Bids",
        notSpecified: "Not specified",
      };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 hover:shadow-md transition-all">
      <span className={`text-xs font-bold px-2 py-1 rounded-full ${
        listingType === "SELL"
          ? "bg-green-50 text-green-600"
          : "bg-amber-50 text-amber-600"
      }`}>
        {listingType === "SELL" ? text.forSale : text.wanted}
      </span>

      {isTrusted && (
        <span className="ml-2 inline-block rounded-full bg-teal-50 px-2 py-1 text-xs font-semibold text-teal-700">
          {text.verified}
        </span>
      )}

      {item.image && typeof item.image === "string" && (
        <div className="mt-4 aspect-video w-full overflow-hidden rounded-xl border border-gray-100">
          <img
            src={item.image}
            alt={displayName}
            className="h-full w-full object-cover transition-transform hover:scale-105"
          />
        </div>
      )}

      <h3 className="mt-2 font-bold text-lg">
        {displayName} <span className="text-gray-400 text-sm">{displayHindiName}</span>
      </h3>

      <p className="text-sm text-gray-500">{item.variety}</p>

      <h2 className="text-xl font-bold text-green-600 mt-2">
        {displayPrice}/kg
      </h2>

      <div className="text-xs text-gray-400 mt-2 space-y-1">
        <p>{text.qty}: {item.qty || item.quantity || text.notSpecified}</p>
        <p>{text.location}: {item.location}</p>
        <p>{text.date}: {item.date || text.recentlyAdded}</p>
        {item.description && <p>{item.description}</p>}
      </div>

      <div className="mt-3 pt-3 border-t flex justify-between items-center">
        <div>
          <p className="text-xs font-semibold">{item.username || item.seller}</p>
          {isTrusted && (
            <p className="text-xs text-teal-600">{text.verifiedListing}</p>
          )}
          <p className="mt-1 text-xs text-amber-700">
            {text.warning}
          </p>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => alert("Report feature will be connected soon.")}
            className="border border-red-200 bg-red-50 px-3 py-1 rounded-lg text-xs text-red-600"
          >
            {text.report}
          </button>

          <button
            type="button"
            onClick={() => onNavigateToContact(item.id)}
            className="bg-green-400 text-white px-3 py-1 rounded-lg text-xs"
          >
            {text.viewContact}
          </button>

          {listingType === "SELL" && (
            <button
              type="button"
              onClick={() => onPlaceBid(item)}
              className="bg-amber-500 text-white px-3 py-1 rounded-lg text-xs hover:bg-amber-600 transition-colors"
            >
              {text.placeBid}
            </button>
          )}

          {listingType === "SELL" && onViewBids && (
            <button
              type="button"
              onClick={() => onViewBids(item.id)}
              className="border border-green-200 bg-green-50 text-green-600 px-3 py-1 rounded-lg text-xs hover:bg-green-100 transition-colors"
            >
              {text.viewBids}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default ListingCard;
