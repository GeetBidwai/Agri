import { useEffect, useState } from "react";

import api from "../api";

function ContactsPage({ productId, listing, onNavigate, language }) {
  const [contact, setContact] = useState(null);
  const [showPhone, setShowPhone] = useState(false);
  const [loading, setLoading] = useState(true);

  const text = language === "HI"
    ? {
        back: "लिस्टिंग पर वापस जाएं",
        title: "संपर्क विवरण",
        subtitle: "सुरक्षित तरीके से संपर्क देखें और ऑफलाइन जुड़ें।",
        listing: "लिस्टिंग",
        type: "प्रकार",
        owner: "मालिक",
        location: "स्थान",
        notAvailable: "उपलब्ध नहीं",
        warning: "अग्रिम भुगतान न करें। सौदा करने से पहले विवरण जांच लें।",
        viewPhone: "फोन देखें",
        hidePhone: "फोन छिपाएं",
        loading: "लोड हो रहा है...",
        report: "रिपोर्ट करें",
        phoneNumber: "फोन नंबर",
        phoneMissing: "फोन उपलब्ध नहीं",
      }
    : {
        back: "Back to listings",
        title: "Contact Details",
        subtitle: "View contact safely and connect offline.",
        listing: "Listing",
        type: "Type",
        owner: "Owner",
        location: "Location",
        verified: "Verified Seller",
        notAvailable: "N/A",
        warning: "Do not pay advance. Meet carefully and verify details before making a deal.",
        viewPhone: "View Phone",
        hidePhone: "Hide Phone",
        loading: "Loading...",
        report: "Report",
        phoneNumber: "Phone Number",
        phoneMissing: "Phone not available",
      };

  useEffect(() => {
    api.get(`/products/${productId}/contact/`)
      .then((res) => setContact(res.data))
      .catch((err) => {
        console.error(err);
        setContact(null);
      })
      .finally(() => setLoading(false));
  }, [productId]);

  return (
    <section className="bg-gray-50 py-14 px-6 min-h-[calc(100vh-4rem)]">
      <div className="max-w-3xl mx-auto">
        <button
          type="button"
          onClick={() => onNavigate("home")}
          className="text-sm text-green-700 font-medium"
        >
          {text.back}
        </button>

        <div className="mt-4 rounded-2xl bg-white p-8 shadow">
          <h2 className="text-3xl font-bold text-gray-900">{text.title}</h2>
          <p className="mt-2 text-gray-600">{text.subtitle}</p>

          <div className="mt-6 space-y-3 text-sm text-gray-700">
            <p><span className="font-semibold">{text.listing}:</span> {listing?.name || "Product listing"}</p>
            <p><span className="font-semibold">{text.type}:</span> {listing?.listing_type || contact?.listing_type || text.notAvailable}</p>
            <p><span className="font-semibold">{text.owner}:</span> {contact?.username || listing?.username || listing?.seller || text.notAvailable}</p>
            <p><span className="font-semibold">{text.verified || "Verified Seller"}:</span> {contact?.seller_verified ? "Yes" : "No"}</p>
            <p><span className="font-semibold">{text.location}:</span> {listing?.location || text.notAvailable}</p>
          </div>

          <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
            {text.warning}
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => setShowPhone((prev) => !prev)}
              disabled={loading}
              className="rounded-lg bg-green-500 px-4 py-2 text-sm font-medium text-white"
            >
              {loading ? text.loading : showPhone ? text.hidePhone : text.viewPhone}
            </button>

            <button
              type="button"
              onClick={() => alert("Report feature will be connected soon.")}
              className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-600"
            >
              {text.report}
            </button>
          </div>

          {showPhone && !loading && (
            <div className="mt-4 rounded-xl border border-gray-200 bg-gray-50 p-4">
              <p className="text-sm text-gray-500">{text.phoneNumber}</p>
              <p className="mt-1 text-lg font-semibold text-gray-900">
                {contact?.phone || text.phoneMissing}
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default ContactsPage;
