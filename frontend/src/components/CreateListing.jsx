import { useMemo, useState } from "react";
import api from "../api";

const CATEGORY_OPTIONS = ["Grains", "Pulses", "Spices", "Oilseeds", "Vegetables", "Fruits", "Cotton", "Sugar"];

const HINDI_TRANSLATIONS = {
  wheat: "\u0917\u0947\u0939\u0942\u0902",
  rice: "\u091a\u093e\u0935\u0932",
  maize: "\u092e\u0915\u094d\u0915\u093e",
  corn: "\u092e\u0915\u094d\u0915\u093e",
  barley: "\u091c\u094c",
  millet: "\u092c\u093e\u091c\u0930\u093e",
  sorghum: "\u091c\u094d\u0935\u093e\u0930",
  tur: "\u0905\u0930\u0939\u0930",
  "tur dal": "\u0905\u0930\u0939\u0930 \u0926\u093e\u0932",
  lentil: "\u092e\u0938\u0942\u0930",
  chickpea: "\u091a\u0928\u093e",
  gram: "\u091a\u0928\u093e",
  moong: "\u092e\u0942\u0902\u0917",
  urad: "\u0909\u095c\u0926",
  soybean: "\u0938\u094b\u092f\u093e\u092c\u0940\u0928",
  mustard: "\u0938\u0930\u0938\u094b\u0902",
  groundnut: "\u092e\u0942\u0902\u0917\u092b\u0932\u0940",
  cumin: "\u091c\u0940\u0930\u093e",
  coriander: "\u0927\u0928\u093f\u092f\u093e",
  chilli: "\u092e\u093f\u0930\u094d\u091a",
  chili: "\u092e\u093f\u0930\u094d\u091a",
  turmeric: "\u0939\u0932\u094d\u0926\u0940",
  onion: "\u092a\u094d\u092f\u093e\u091c",
  potato: "\u0906\u0932\u0942",
  tomato: "\u091f\u092e\u093e\u091f\u0930",
  cotton: "\u0915\u092a\u093e\u0938",
  sugarcane: "\u0917\u0928\u094d\u0928\u093e",
  sugar: "\u091a\u0940\u0928\u0940",
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
        title: "\u0932\u093f\u0938\u094d\u091f\u093f\u0902\u0917 \u092c\u0928\u093e\u090f\u0902",
        name: "\u0909\u0924\u094d\u092a\u093e\u0926 \u0915\u093e \u0928\u093e\u092e",
        hindi: "\u0939\u093f\u0902\u0926\u0940 \u0928\u093e\u092e",
        category: "\u0915\u0948\u091f\u0947\u0917\u0930\u0940",
        listingType: "\u0932\u093f\u0938\u094d\u091f\u093f\u0902\u0917 \u091f\u093e\u0907\u092a",
        variety: "\u0915\u093f\u0938\u094d\u092e",
        quantity: "\u092e\u093e\u0924\u094d\u0930\u093e",
        price: "\u092a\u094d\u0930\u0924\u093f \u0915\u093f\u0932\u094b \u0915\u0940\u092e\u0924",
        location: "\u0938\u094d\u0925\u093e\u0928",
        image: "\u0909\u0924\u094d\u092a\u093e\u0926 \u0915\u0940 \u091b\u0935\u093f",
        description: "\u0935\u093f\u0935\u0930\u0923",
        selectCategory: "\u0915\u0948\u091f\u0947\u0917\u0930\u0940 \u091a\u0941\u0928\u0947\u0902",
        selectType: "\u0932\u093f\u0938\u094d\u091f\u093f\u0902\u0917 \u091f\u093e\u0907\u092a \u091a\u0941\u0928\u0947\u0902",
        submit: "\u091c\u092e\u093e \u0915\u0930\u0947\u0902",
        submitting: "\u091c\u092e\u093e \u0939\u094b \u0930\u0939\u093e \u0939\u0948...",
        validation: "\u0915\u0943\u092a\u092f\u093e \u091c\u0930\u0942\u0930\u0940 \u092b\u0940\u0932\u094d\u0921 \u092d\u0930\u0947\u0902",
        created: "\u0932\u093f\u0938\u094d\u091f\u093f\u0902\u0917 \u092c\u0928 \u0917\u0908!",
        error: "\u0915\u0941\u091b \u0917\u0932\u0924 \u0939\u094b \u0917\u092f\u093e!",
        suggestion: "\u0939\u093f\u0902\u0926\u0940 \u0938\u0941\u091d\u093e\u0935",
        useSuggestion: "\u092f\u0939 \u092a\u0942\u0930\u093e \u0915\u0930\u0947\u0902",
        buy: "खरीदें",
        sell: "बेचें",
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
        buy: "Buy",
        sell: "Sell",
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
          <option value="BUY">{text.buy}</option>
          <option value="SELL">{text.sell}</option>
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
