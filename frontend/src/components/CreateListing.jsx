import { useState } from "react";
import axios from "axios";

function CreateListing({ setListings }) {
  const [form, setForm] = useState({
    type: "sell",
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // ✅ Validation
    if (!form.name || !form.price_per_kg || !form.location) {
      alert("Please fill required fields (name, price, location)");
      return;
    }

    setLoading(true);

    axios.post("http://127.0.0.1:8000/api/products/", form)
      .then((res) => {
        alert("Listing created!");

        // 🔥 LIVE UPDATE (NO RELOAD)
        setListings((prev) => [res.data, ...prev]);

        // ✅ Reset form
        setForm({
          type: "sell",
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
        alert("Something went wrong!");
        setLoading(false);
      });
  };

  return (
    <div className="p-6 bg-white max-w-xl mx-auto mt-10 rounded-xl shadow">
      <h2 className="text-xl font-bold mb-4">Create Listing</h2>

      <form onSubmit={handleSubmit} className="space-y-3">

        <input
          name="name"
          value={form.name}
          placeholder="Product Name"
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />

        <input
          name="hindi"
          value={form.hindi}
          placeholder="Hindi Name"
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />

        <input
          name="variety"
          value={form.variety}
          placeholder="Variety"
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />

        <input
          name="quantity"
          value={form.quantity}
          placeholder="Quantity"
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />

        <input
          name="price_per_kg"
          value={form.price_per_kg}
          placeholder="Price per kg"
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />

        <input
          name="location"
          value={form.location}
          placeholder="Location"
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />

        <input
          name="seller"
          value={form.seller}
          placeholder="Seller Name"
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />

        <button
          disabled={loading}
          className="bg-green-600 text-white px-4 py-2 rounded w-full"
        >
          {loading ? "Submitting..." : "Submit"}
        </button>

      </form>
    </div>
  );
}

export default CreateListing;