import { useEffect, useMemo, useState } from "react";

import api from "../api";
import { formatPricePerKg } from "../utils/price";

function ListingDetailPage({ listingId, onNavigate, onPlaceBid, language }) {
  const [listing, setListing] = useState(null);
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState("");

  const text = language === "HI"
    ? {
        back: "लिस्टिंग पर वापस जाएं",
        loading: "लोड हो रहा है...",
        unavailable: "उपलब्ध नहीं",
        productInfo: "उत्पाद जानकारी",
        sellerInfo: "विक्रेता जानकारी",
        bidsTitle: "बोलियां",
        trustTitle: "सुरक्षा",
        productName: "उत्पाद",
        hindiName: "हिंदी नाम",
        quantity: "मात्रा",
        location: "स्थान",
        date: "तारीख",
        seller: "विक्रेता",
        totalListings: "कुल लिस्टिंग",
        notAvailable: "उपलब्ध नहीं",
        verifiedSeller: "सत्यापित विक्रेता",
        doNotPay: "अग्रिम भुगतान न करें",
        contactSeller: "संपर्क देखें",
        placeBid: "बोली लगाएं",
        highestBid: "उच्चतम बोली",
        totalBids: "कुल बोलियां",
        noBids: "अभी तक कोई बोली नहीं",
        bidder: "बोलीदाता",
        price: "मूल्य",
        time: "समय",
        description: "विवरण",
        report: "रिपोर्ट करें",
        recentlyAdded: "अभी जोड़ी गई",
        sellerNotVerified: "विक्रेता सत्यापित नहीं",
      }
    : {
        back: "Back to listings",
        loading: "Loading...",
        unavailable: "Unavailable",
        productInfo: "Product Info",
        sellerInfo: "Seller Info",
        bidsTitle: "Bids",
        trustTitle: "Trust & Safety",
        productName: "Product",
        hindiName: "Hindi Name",
        quantity: "Quantity",
        location: "Location",
        date: "Date",
        seller: "Seller",
        totalListings: "Total Listings",
        notAvailable: "Not available",
        verifiedSeller: "Verified Seller",
        doNotPay: "Do not pay in advance",
        contactSeller: "Contact Seller",
        placeBid: "Place Bid",
        highestBid: "Highest Bid",
        totalBids: "Total Bids",
        noBids: "No bids yet",
        bidder: "Bidder",
        price: "Price",
        time: "Time",
        description: "Description",
        report: "Report",
        recentlyAdded: "Recently added",
        sellerNotVerified: "Seller not verified",
      };

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      setLoading(true);
      try {
        const [listingRes, bidsRes] = await Promise.all([
          api.get(`/listings/${listingId}/`),
          api.get(`/products/${listingId}/bids/`),
        ]);

        if (!isMounted) {
          return;
        }

        setListing(listingRes.data);
        setBids(Array.isArray(bidsRes.data) ? bidsRes.data : []);

        const nextImages = Array.isArray(listingRes.data?.images) && listingRes.data.images.length > 0
          ? listingRes.data.images
          : listingRes.data?.image
            ? [listingRes.data.image]
            : [];

        setSelectedImage(nextImages[0] || "");
      } catch (error) {
        console.error("Failed to load listing detail:", error);
        if (isMounted) {
          setListing(null);
          setBids([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [listingId]);

  const galleryImages = useMemo(() => {
    if (Array.isArray(listing?.images) && listing.images.length > 0) {
      return listing.images;
    }

    if (!listing?.image || typeof listing.image !== "string") {
      return [];
    }

    return [listing.image];
  }, [listing]);

  const highestBid = useMemo(() => {
    if (!bids.length) {
      return null;
    }

    return bids.reduce((highest, current) => (
      Number(current.bid_price) > Number(highest.bid_price) ? current : highest
    ), bids[0]);
  }, [bids]);

  const displayName = listing?.product_name || listing?.name || text.unavailable;
  const displayHindiName = listing?.hindi_name || listing?.hindi || text.notAvailable;
  const displayQuantity = listing?.quantity || listing?.qty || text.notAvailable;
  const displayDate = listing?.created_at
    ? new Date(listing.created_at).toLocaleDateString()
    : listing?.date || text.recentlyAdded;
  const isVerifiedSeller = Boolean(listing?.seller_verified || listing?.is_verified || listing?.verified);

  if (loading) {
    return (
      <section className="bg-gray-50 py-14 px-6 min-h-[calc(100vh-4rem)]">
        <div className="max-w-6xl mx-auto">
          <p className="text-gray-600">{text.loading}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-gray-50 py-10 px-6 min-h-[calc(100vh-4rem)]">
      <div className="max-w-6xl mx-auto">
        <button
          type="button"
          onClick={() => onNavigate("home")}
          className="text-sm text-green-700 font-medium"
        >
          {text.back}
        </button>

        <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="space-y-6">
            <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="overflow-hidden rounded-2xl border border-gray-100 bg-gray-50">
                {selectedImage ? (
                  <img
                    src={selectedImage}
                    alt={displayName}
                    className="h-[360px] w-full object-cover"
                  />
                ) : (
                  <div className="flex h-[360px] items-center justify-center text-sm text-gray-400">
                    {text.notAvailable}
                  </div>
                )}
              </div>

              {galleryImages.length > 0 && (
                <div className="mt-4 flex gap-3 overflow-x-auto">
                  {galleryImages.map((image) => (
                    <button
                      key={image}
                      type="button"
                      onClick={() => setSelectedImage(image)}
                      className={`overflow-hidden rounded-xl border ${
                        selectedImage === image ? "border-green-500" : "border-gray-200"
                      }`}
                    >
                      <img
                        src={image}
                        alt={displayName}
                        className="h-20 w-20 object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{displayName}</h1>
                  <p className="mt-1 text-lg text-gray-500">{displayHindiName}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-green-600">{formatPricePerKg(listing?.price_per_kg || listing?.price)}</p>
                  {isVerifiedSeller && (
                    <span className="mt-2 inline-flex rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-700">
                      {text.verifiedSeller}
                    </span>
                  )}
                </div>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl bg-gray-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">{text.quantity}</p>
                  <p className="mt-2 text-lg font-semibold text-gray-900">{displayQuantity}</p>
                </div>
                <div className="rounded-2xl bg-gray-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">{text.location}</p>
                  <p className="mt-2 text-lg font-semibold text-gray-900">{listing?.location || text.notAvailable}</p>
                </div>
                <div className="rounded-2xl bg-gray-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">{text.date}</p>
                  <p className="mt-2 text-lg font-semibold text-gray-900">{displayDate}</p>
                </div>
                <div className="rounded-2xl bg-gray-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">{text.productName}</p>
                  <p className="mt-2 text-lg font-semibold text-gray-900">{displayName}</p>
                </div>
              </div>

              {listing?.description && (
                <div className="mt-6 rounded-2xl border border-gray-100 p-4">
                  <p className="text-sm font-semibold text-gray-700">{text.description}</p>
                  <p className="mt-2 text-sm text-gray-600">{listing.description}</p>
                </div>
              )}
            </div>

            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900">{text.bidsTitle}</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl bg-green-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-green-700">{text.highestBid}</p>
                  <p className="mt-2 text-2xl font-bold text-green-800">
                    {highestBid ? formatPricePerKg(highestBid.bid_price) : text.noBids}
                  </p>
                </div>
                <div className="rounded-2xl bg-gray-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">{text.totalBids}</p>
                  <p className="mt-2 text-2xl font-bold text-gray-900">{bids.length}</p>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                {bids.length > 0 ? (
                  bids
                    .slice()
                    .sort((a, b) => Number(b.bid_price) - Number(a.bid_price))
                    .map((bid) => (
                      <div key={bid.id || `${bid.buyer_name}-${bid.created_at}`} className="rounded-2xl border border-gray-100 p-4">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <div>
                            <p className="text-sm text-gray-500">{text.bidder}</p>
                            <p className="font-semibold text-gray-900">{bid.buyer_name || text.notAvailable}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-500">{text.price}</p>
                            <p className="font-semibold text-green-700">{formatPricePerKg(bid.bid_price)}</p>
                          </div>
                        </div>
                        <p className="mt-3 text-sm text-gray-500">
                          {text.time}: {bid.created_at ? new Date(bid.created_at).toLocaleString() : text.notAvailable}
                        </p>
                      </div>
                    ))
                ) : (
                  <div className="rounded-2xl border border-dashed border-gray-200 p-6 text-center text-sm text-gray-500">
                    {text.noBids}
                  </div>
                )}
              </div>
            </div>
          </div>

          <aside className="space-y-6 lg:sticky lg:top-24 self-start">
            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-3">
                <button
                  type="button"
                  onClick={() => onNavigate("contacts", listingId)}
                  className="rounded-xl bg-green-500 px-5 py-3 text-sm font-semibold text-white"
                >
                  {text.contactSeller}
                </button>

                {(listing?.listing_type || "").toUpperCase() === "SELL" && (
                  <button
                    type="button"
                    onClick={() => onPlaceBid(listing)}
                    className="rounded-xl bg-amber-500 px-5 py-3 text-sm font-semibold text-white"
                  >
                    {text.placeBid}
                  </button>
                )}
              </div>
            </div>

            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900">{text.sellerInfo}</h2>
              <div className="mt-4 space-y-3 text-sm text-gray-700">
                <p><span className="font-semibold">{text.seller}:</span> {listing?.username || listing?.seller || text.notAvailable}</p>
                <p><span className="font-semibold">{text.totalListings}:</span> {listing?.seller_listing_count ?? text.notAvailable}</p>
                <p className={isVerifiedSeller ? "font-semibold text-teal-700" : "font-semibold text-gray-500"}>
                  {isVerifiedSeller ? text.verifiedSeller : text.sellerNotVerified}
                </p>
              </div>
            </div>

            <div className="rounded-3xl border border-amber-200 bg-amber-50 p-6 shadow-sm">
              <h2 className="text-xl font-bold text-amber-900">{text.trustTitle}</h2>
              <div className="mt-4 space-y-2 text-sm text-amber-800">
                <p>{isVerifiedSeller ? text.verifiedSeller : text.sellerNotVerified}</p>
                <p>{text.doNotPay}</p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

export default ListingDetailPage;
