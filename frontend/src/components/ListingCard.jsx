import api from "../api";

function ListingCard({ item, onNavigateToContact, onPlaceBid, onViewBids, language }) {
  const listingType = item.listing_type || item.type?.toUpperCase();
  const isTrusted = item.seller_verified || item.is_verified || item.verified;
  const displayName = item.product_name || item.name;
  const displayHindiName = item.hindi_name || item.hindi;
  const displayPrice = item.price || item.price_per_kg;

  const text = language === "HI"
    ? {
        forSale: "\u092c\u093f\u0915\u094d\u0930\u0940 \u0915\u0947 \u0932\u093f\u090f",
        wanted: "\u091c\u093c\u0930\u0942\u0930\u0924 \u0939\u0948",
        verified: "\u0938\u0924\u094d\u092f\u093e\u092a\u093f\u0924",
        verifiedListing: "\u0938\u0924\u094d\u092f\u093e\u092a\u093f\u0924 \u0932\u093f\u0938\u094d\u091f\u093f\u0902\u0917",
        qty: "\u092e\u093e\u0924\u094d\u0930\u093e",
        location: "\u0938\u094d\u0925\u093e\u0928",
        date: "\u0924\u093e\u0930\u0940\u0916",
        recentlyAdded: "\u0905\u092d\u0940 \u091c\u094b\u0921\u093c\u0940 \u0917\u0908",
        warning: "\u0905\u0917\u094d\u0930\u093f\u092e \u092d\u0941\u0917\u0924\u093e\u0928 \u0928 \u0915\u0930\u0947\u0902",
        report: "\u0930\u093f\u092a\u094b\u0930\u094d\u091f \u0915\u0930\u0947\u0902",
        viewContact: "\u0938\u0902\u092a\u0930\u094d\u0915 \u0926\u0947\u0916\u0947\u0902",
        placeBid: "\u092c\u094b\u0932\u0940 \u0932\u0917\u093e\u090f\u0902",
        viewBids: "\u092c\u094b\u0932\u093f\u092f\u093e\u0902 \u0926\u0947\u0916\u0947\u0902",
        notSpecified: "\u0909\u0932\u094d\u0932\u0947\u0916 \u0928\u0939\u0940\u0902",
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

  const handleReport = async () => {
    try {
      await api.post(`/products/${item.id}/report/`, { reason: "Suspicious listing" });
      alert("Reported successfully");
    } catch (error) {
      console.error(error);
      alert("Already reported");
    }
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
            onClick={handleReport}
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
