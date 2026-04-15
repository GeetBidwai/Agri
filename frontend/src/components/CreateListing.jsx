import { useState } from "react";
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
    phone: "",
    image: null,
    verified: false,
  });

  const [imagePreview, setImagePreview] = useState(null);
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
        phone: "फ़ोन नंबर",
        image: "उत्पाद की छवि (केवल बेचने के लिए)",
        submit: "जमा करें",
        submitting: "जमा हो रहा है...",
        validation: "कृपया जरूरी फ़ील्ड भरें",
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
        phone: "Contact Phone",
        image: "Product Image (Selling only)",
        submit: "Submit",
        submitting: "Submitting...",
        validation: "Please fill required fields",
        created: "Listing created!",
        error: "Something went wrong!",
      };

  const handleListingTypeChange = (listingType) => {
    setForm({
      ...form,
      listing_type: listingType,
      type: listingType.toLowerCase(),
    });
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "image") {
      const file = files[0];
      setForm({ ...form, image: file });

      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => setImagePreview(reader.result);
        reader.readAsDataURL(file);
      } else {
        setImagePreview(null);
      }
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // ✅ FIXED VALIDATION
    if (!form.name || !form.price_per_kg || !form.location) {
      alert(text.validation);
      return;
    }

    if (form.listing_type === "SELL" && !form.phone) {
      alert("Phone is required for selling");
      return;
    }

    setLoading(true);

    const formData = new FormData();

    Object.keys(form).forEach((key) => {
      if (key === "image") {
        if (form[key]) formData.append(key, form[key]);
      } else {
        // ✅ Clean BUY payload
        if (form.listing_type === "BUY" && (key === "seller" || key === "phone")) {
          formData.append(key, "");
        } else {
          formData.append(key, form[key]);
        }
      }
    });

    api.post("/products/", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
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
          phone: "",
          image: null,
          verified: false,
        });

        setImagePreview(null);
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

        {/* Toggle */}
        <div className="grid grid-cols-2 gap-3">
          <button type="button" onClick={() => handleListingTypeChange("BUY")}>
            {text.buy}
          </button>

          <button type="button" onClick={() => handleListingTypeChange("SELL")}>
            {text.sell}
          </button>
        </div>

        {/* Common fields */}
        <input name="name" value={form.name} placeholder={text.name} onChange={handleChange} className="w-full p-2 border rounded" />
        <input name="hindi" value={form.hindi} placeholder={text.hindi} onChange={handleChange} className="w-full p-2 border rounded" />
        <input name="variety" value={form.variety} placeholder={text.variety} onChange={handleChange} className="w-full p-2 border rounded" />
        <input name="quantity" value={form.quantity} placeholder={text.quantity} onChange={handleChange} className="w-full p-2 border rounded" />
        <input name="price_per_kg" value={form.price_per_kg} placeholder={text.price} onChange={handleChange} className="w-full p-2 border rounded" />
        <input name="location" value={form.location} placeholder={text.location} onChange={handleChange} className="w-full p-2 border rounded" />

        {/* SELL ONLY */}
        {form.listing_type === "SELL" && (
          <>
            <input name="seller" value={form.seller} placeholder={text.seller} onChange={handleChange} className="w-full p-2 border rounded" />
            <input name="phone" value={form.phone} placeholder={text.phone} onChange={handleChange} className="w-full p-2 border rounded" />
          </>
        )}

        <button className="bg-green-600 text-white px-4 py-2 rounded w-full">
          {loading ? text.submitting : text.submit}
        </button>
      </form>
    </div>
  );
}

export default CreateListing;