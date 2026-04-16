import { useMemo, useState } from "react";
import api from "../api";

const CATEGORY_OPTIONS = ["Grains", "Pulses", "Spices", "Oilseeds", "Vegetables", "Fruits", "Cotton", "Sugar"];

const HINDI_TRANSLATIONS = {
  wheat: "गेहूं",
  rice: "चावल",
  maize: "मक्का",
  corn: "मक्का",
  barley: "जौ",
  millet: "बाजरा",
  sorghum: "ज्वार",
  tur: "अरहर",
  "tur dal": "अरहर दाल",
  lentil: "मसूर",
  chickpea: "चना",
  gram: "चना",
  moong: "मूंग",
  urad: "उड़द",
  soybean: "सोयाबीन",
  mustard: "सरसों",
  groundnut: "मूंगफली",
  cumin: "जीरा",
  coriander: "धनिया",
  chilli: "मिर्च",
  chili: "मिर्च",
  turmeric: "हल्दी",
  onion: "प्याज",
  potato: "आलू",
  tomato: "टमाटर",
  cotton: "कपास",
  sugarcane: "गन्ना",
  sugar: "चीनी",
};

const createInitialForm = (initialListingType) => ({
  product_name: "",
  hindi_name: "",
  category: "",
  listing_type: initialListingType,
  variety: "",
  quantity: "",
  price_per_kg: "",
  location: "",
  description: "",
  image: null,
});

function CreateListing({ initialListingType = "SELL", setListings, refreshListings, language }) {
  const [form, setForm] = useState(() => createInitialForm(initialListingType));
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const suggestedHindi = useMemo(() => {
    const key = form.product_name.trim().toLowerCase();
    return HINDI_TRANSLATIONS[key] || "";
  }, [form.product_name]);

  const showHindiSuggestion = suggestedHindi && suggestedHindi !== form.hindi_name;

  const text = language === "HI"
    ? {
        title: "à¤²à¤¿à¤¸à¥à¤Ÿà¤¿à¤‚à¤— à¤¬à¤¨à¤¾à¤à¤‚",
        name: "à¤‰à¤¤à¥à¤ªà¤¾à¤¦ à¤•à¤¾ à¤¨à¤¾à¤®",
        hindi: "à¤¹à¤¿à¤‚à¤¦à¥€ à¤¨à¤¾à¤®",
        category: "à¤•à¥ˆà¤Ÿà¥‡à¤—à¤°à¥€",
        listingType: "à¤²à¤¿à¤¸à¥à¤Ÿà¤¿à¤‚à¤— à¤Ÿà¤¾à¤‡à¤ª",
        variety: "à¤•à¤¿à¤¸à¥à¤®",
        quantity: "à¤®à¤¾à¤¤à¥à¤°à¤¾",
        price: "à¤ªà¥à¤°à¤¤à¤¿ à¤•à¤¿à¤²à¥‹ à¤•à¥€à¤®à¤¤",
        location: "à¤¸à¥à¤¥à¤¾à¤¨",
        image: "à¤‰à¤¤à¥à¤ªà¤¾à¤¦ à¤•à¥€ à¤›à¤µà¤¿",
        selectCategory: "à¤•à¥ˆà¤Ÿà¥‡à¤—à¤°à¥€ à¤šà¥à¤¨à¥‡à¤‚",
        selectType: "à¤²à¤¿à¤¸à¥à¤Ÿà¤¿à¤‚à¤— à¤Ÿà¤¾à¤‡à¤ª à¤šà¥à¤¨à¥‡à¤‚",
        submit: "à¤œà¤®à¤¾ à¤•à¤°à¥‡à¤‚",
        submitting: "à¤œà¤®à¤¾ à¤¹à¥‹ à¤°à¤¹à¤¾ à¤¹à¥ˆ...",
        validation: "à¤•à¥ƒà¤ªà¤¯à¤¾ à¤œà¤°à¥‚à¤°à¥€ à¤«à¤¼à¥€à¤²à¥à¤¡ à¤­à¤°à¥‡à¤‚",
        created: "à¤²à¤¿à¤¸à¥à¤Ÿà¤¿à¤‚à¤— à¤¬à¤¨ à¤—à¤ˆ!",
        error: "à¤•à¥à¤› à¤—à¤²à¤¤ à¤¹à¥‹ à¤—à¤¯à¤¾!",
        suggestion: "à¤¹à¤¿à¤‚à¤¦à¥€ à¤¸à¥à¤à¤¾à¤µ",
        useSuggestion: "à¤à¤¹ à¤ªà¥à¤°à¤¾ à¤•à¤°à¥‡à¤‚",
      }
    : {
        title: "Create Listing",
        name: "Product Name",
        hindi: "Hindi Name",
        category: "Category",
        listingType: "Listing Type",
        variety: "Variety",
        quantity: "Quantity",
        price: "Price per kg",
        location: "Location",
        description: "Description",
        image: "Product Image",
        selectCategory: "Select Category",
        selectType: "Select Listing Type",
        submit: "Submit",
        submitting: "Submitting...",
        validation: "Please fill required fields",
        created: "Listing created!",
        error: "Something went wrong!",
        suggestion: "Hindi suggestion",
        useSuggestion: "Use suggestion",
      };

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "image") {
      const file = files?.[0] || null;
      setForm((current) => ({ ...current, image: file }));

      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => setImagePreview(reader.result);
        reader.readAsDataURL(file);
      } else {
        setImagePreview(null);
      }
      return;
    }

    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !form.product_name ||
      !form.category ||
      !form.listing_type ||
      !form.quantity ||
      !form.price_per_kg ||
      !form.location
    ) {
      alert(text.validation);
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("product_name", form.product_name);
    formData.append("hindi_name", form.hindi_name);
    formData.append("category", form.category);
    formData.append("listing_type", form.listing_type);
    formData.append("variety", form.variety);
    formData.append("quantity", form.quantity);
    formData.append("price_per_kg", form.price_per_kg);
    formData.append("location", form.location);
    formData.append("description", form.description);

    if (form.image) {
      formData.append("image", form.image);
    }

    api.post("/listings/create/", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
      .then((res) => {
        alert(text.created);

        if (refreshListings) {
          refreshListings();
        } else if (setListings) {
          setListings((prev) => [res.data, ...prev]);
        }

        setForm(createInitialForm(initialListingType));
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
        <input
          name="product_name"
          value={form.product_name}
          placeholder={text.name}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />

        <div className="space-y-2">
          <input
            name="hindi_name"
            value={form.hindi_name}
            placeholder={text.hindi}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />

          {showHindiSuggestion && (
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>{text.suggestion}: {suggestedHindi}</span>
              <button
                type="button"
                onClick={() => setForm((current) => ({ ...current, hindi_name: suggestedHindi }))}
                className="text-green-600"
              >
                {text.useSuggestion}
              </button>
            </div>
          )}
        </div>

        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        >
          <option value="">{text.selectCategory}</option>
          {CATEGORY_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>

        <select
          name="listing_type"
          value={form.listing_type}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        >
          <option value="">{text.selectType}</option>
          <option value="BUY">Buy</option>
          <option value="SELL">Sell</option>
        </select>

        <input
          name="variety"
          value={form.variety}
          placeholder={text.variety}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <input
          type="number"
          name="quantity"
          value={form.quantity}
          placeholder={text.quantity}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <input
          type="number"
          step="0.01"
          name="price_per_kg"
          value={form.price_per_kg}
          placeholder={text.price}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <input
          name="location"
          value={form.location}
          placeholder={text.location}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <textarea
          name="description"
          value={form.description}
          placeholder={text.description}
          onChange={handleChange}
          rows="3"
          className="w-full p-2 border rounded"
        />
        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />

        {imagePreview && (
          <div className="overflow-hidden rounded border">
            <img src={imagePreview} alt={form.product_name || text.image} className="w-full object-cover" />
          </div>
        )}

        <button className="bg-green-600 text-white px-4 py-2 rounded w-full">
          {loading ? text.submitting : text.submit}
        </button>
      </form>
    </div>
  );
}

export default CreateListing;
