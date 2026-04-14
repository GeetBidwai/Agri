import { useEffect, useState } from "react";

import api from "../api";

function CreateListing({ initialListingType = "SELL", setListings, refreshListings, language }) {
  const [form, setForm] = useState({
    type: initialListingType.toLowerCase(),
    listing_type: initialListingType,
    name: "",
    hindi: "",
    variety: "",
    quantity: "",
    price_per_kg: "",
    location: "",
    seller: "",
    verified: false,
  });

  const [loading, setLoading] = useState(false);

  const text = language === "HI"
    ? {
        title: "लिस्टिंग बनाएं",
        buy: "मैं खरीदना चाहता हूं",
        sell: "मैं बेचना चाहता हूं",
        name: "उत्पाद का नाम",
        hindi: "हिंदी नाम",
        variety: "किस्म",
        quantity: "मात्रा",
        price: "प्रति किलो कीमत",
        location: "स्थान",
        seller: "विक्रेता का नाम",
        submit: "जमा करें",
        submitting: "जमा हो रहा है...",
        validation: "कृपया जरूरी फ़ील्ड भरें (नाम, कीमत, स्थान)",
        created: "लिस्टिंग बन गई!",
        error: "कुछ गलत हो गया!",
      }
    : {
        title: "Create Listing",
        buy: "I Want to Buy",
        sell: "I Want to Sell",
        name: "Product Name",
        hindi: "Hindi Name",
        variety: "Variety",
        quantity: "Quantity",
        price: "Price per kg",
        location: "Location",
        seller: "Seller Name",
        submit: "Submit",
        submitting: "Submitting...",
        validation: "Please fill required fields (name, price, location)",
        created: "Listing created!",
        error: "Something went wrong!",
      };

  useEffect(() => {
    setForm((prev) => ({
      ...prev,
      listing_type: initialListingType,
      type: initialListingType.toLowerCase(),
    }));
  }, [initialListingType]);

  const handleListingTypeChange = (listingType) => {
    setForm({
      ...form,
      listing_type: listingType,
      type: listingType.toLowerCase(),
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.name || !form.price_per_kg || !form.location) {
      alert(text.validation);
      return;
    }

    setLoading(true);

    api.post("/products/", form)
      .then((res) => {
        alert(text.created);

        if (refreshListings) {
          refreshListings();
        } else {
          setListings((prev) => [res.data, ...prev]);
        }

        setForm({
          type: initialListingType.toLowerCase(),
          listing_type: initialListingType,
          name: "",
          hindi: "",
          variety: "",
          quantity: "",
          price_per_kg: "",
          location: "",
          seller: "",
          verified: false,
        });

        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        alert(err.response?.data?.detail || text.error);
        setLoading(false);
      });
  };

  return (
    <div className="p-6 bg-white max-w-xl mx-auto mt-10 rounded-xl shadow">
      <h2 className="text-xl font-bold mb-4">{text.title}</h2>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => handleListingTypeChange("BUY")}
            className={`rounded border px-4 py-2 font-medium transition ${
              form.listing_type === "BUY"
                ? "border-amber-500 bg-amber-50 text-amber-700"
                : "border-gray-200 bg-white text-gray-600"
            }`}
          >
            {text.buy}
          </button>

          <button
            type="button"
            onClick={() => handleListingTypeChange("SELL")}
            className={`rounded border px-4 py-2 font-medium transition ${
              form.listing_type === "SELL"
                ? "border-green-600 bg-green-50 text-green-700"
                : "border-gray-200 bg-white text-gray-600"
            }`}
          >
            {text.sell}
          </button>
        </div>

        <input name="name" value={form.name} placeholder={text.name} onChange={handleChange} className="w-full p-2 border rounded" />
        <input name="hindi" value={form.hindi} placeholder={text.hindi} onChange={handleChange} className="w-full p-2 border rounded" />
        <input name="variety" value={form.variety} placeholder={text.variety} onChange={handleChange} className="w-full p-2 border rounded" />
        <input name="quantity" value={form.quantity} placeholder={text.quantity} onChange={handleChange} className="w-full p-2 border rounded" />
        <input name="price_per_kg" value={form.price_per_kg} placeholder={text.price} onChange={handleChange} className="w-full p-2 border rounded" />
        <input name="location" value={form.location} placeholder={text.location} onChange={handleChange} className="w-full p-2 border rounded" />
        <input name="seller" value={form.seller} placeholder={text.seller} onChange={handleChange} className="w-full p-2 border rounded" />

        <button
          disabled={loading}
          className="bg-green-600 text-white px-4 py-2 rounded w-full"
        >
          {loading ? text.submitting : text.submit}
        </button>
      </form>
    </div>
  );
}

export default CreateListing;
