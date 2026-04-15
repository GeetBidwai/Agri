import { useState } from "react";

import api from "../api";
import { formatPricePerKg } from "../utils/price";

function BidModal({ product, onClose, language }) {
  const [form, setForm] = useState({
    buyer_name: "",
    buyer_phone: "",
    bid_price: "",
    quantity: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const text = language === "HI"
    ? {
        title: "à¤¬à¥‹à¤²à¥€ à¤²à¤—à¤¾à¤à¤‚",
        name: "à¤†à¤ªà¤•à¤¾ à¤¨à¤¾à¤®",
        phone: "à¤«à¥‹à¤¨ à¤¨à¤‚à¤¬à¤°",
        price: "à¤¬à¥‹à¤²à¥€ à¤®à¥‚à¤²à¥à¤¯ (â‚¹/kg)",
        qty: "à¤®à¤¾à¤¤à¥à¤°à¤¾ (kg)",
        submit: "à¤¬à¥‹à¤²à¥€ à¤œà¤®à¤¾ à¤•à¤°à¥‡à¤‚",
        submitting: "à¤œà¤®à¤¾ à¤¹à¥‹ à¤°à¤¹à¤¾ à¤¹à¥ˆ...",
        success: "à¤†à¤ªà¤•à¥€ à¤¬à¥‹à¤²à¥€ à¤¸à¤«à¤²à¤¤à¤¾à¤ªà¥‚à¤°à¥à¤µà¤• à¤œà¤®à¤¾ à¤¹à¥‹ à¤—à¤ˆ!",
        error: "à¤•à¥à¤› à¤—à¤²à¤¤ à¤¹à¥‹ à¤—à¤¯à¤¾!",
        close: "à¤¬à¤‚à¤¦ à¤•à¤°à¥‡à¤‚",
      }
    : {
        title: "Place Your Bid",
        name: "Your Name",
        phone: "Phone Number",
        price: "Bid Price (â‚¹/kg)",
        qty: "Quantity (kg)",
        submit: "Submit Bid",
        submitting: "Submitting...",
        success: "Your bid has been placed successfully!",
        error: "Something went wrong!",
        close: "Close",
      };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!form.buyer_name || !form.buyer_phone || !form.bid_price || !form.quantity) {
      setError(text.error);
      return;
    }

    setLoading(true);

    api.post(`/products/${product.id}/bids/`, form)
      .then(() => {
        alert(text.success);
        onClose();
      })
      .catch(() => {
        setError(text.error);
        setLoading(false);
      });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden">
        <div className="bg-green-600 px-6 py-4 flex justify-between items-center">
          <h2 className="text-white font-bold text-lg">{text.title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-white hover:bg-green-700 rounded-lg p-1 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6">
          <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-100">
            <p className="font-semibold text-gray-800">{product.name}</p>
            <p className="text-sm text-gray-500">{product.variety}</p>
            <p className="text-green-600 font-bold">Listed: {formatPricePerKg(product.price_per_kg)}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{text.name}</label>
              <input
                type="text"
                name="buyer_name"
                value={form.buyer_name}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{text.phone}</label>
              <input
                type="tel"
                name="buyer_phone"
                value={form.buyer_phone}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{text.price}</label>
              <input
                type="number"
                name="bid_price"
                value={form.bid_price}
                onChange={handleChange}
                min="0"
                step="0.01"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{text.qty}</label>
              <input
                type="text"
                name="quantity"
                value={form.quantity}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            {error && (
              <p className="text-red-500 text-sm">{error}</p>
            )}

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
              >
                {text.close}
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:bg-green-400"
              >
                {loading ? text.submitting : text.submit}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default BidModal;
