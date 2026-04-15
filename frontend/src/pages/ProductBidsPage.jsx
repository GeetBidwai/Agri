import { useEffect, useState } from "react";

import api from "../api";
import { formatPricePerKg } from "../utils/price";

function ProductBidsPage({ productId, product, onBack, language }) {
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);

  const text = language === "HI"
    ? {
        title: "à¤‡à¤¸ à¤‰à¤¤à¥à¤ªà¤¾à¤¦ à¤•à¥€ à¤¬à¥‹à¤²à¤¿à¤¯à¤¾à¤‚",
        back: "à¤µà¤¾à¤ªà¤¸ à¤œà¤¾à¤à¤‚",
        noBids: "à¤…à¤­à¥€ à¤¤à¤• à¤•à¥‹à¤ˆ à¤¬à¥‹à¤²à¥€ à¤¨à¤¹à¥€à¤‚",
        highestBid: "à¤‰à¤šà¥à¤šà¤¤à¤® à¤¬à¥‹à¤²à¥€",
        buyer: "à¤–à¤°à¥€à¤¦à¤¾à¤°",
        phone: "à¤«à¥‹à¤¨",
        price: "à¤¬à¥‹à¤²à¥€ à¤®à¥‚à¤²à¥à¤¯",
        qty: "à¤®à¤¾à¤¤à¥à¤°à¤¾",
        date: "à¤¤à¤¾à¤°à¥€à¤–",
        listedPrice: "à¤¸à¥‚à¤šà¥€à¤¬à¤¦à¥à¤§ à¤®à¥‚à¤²à¥à¤¯",
      }
    : {
        title: "Bids for this Product",
        back: "Go Back",
        noBids: "No bids yet",
        highestBid: "Highest Bid",
        buyer: "Buyer",
        phone: "Phone",
        price: "Bid Price",
        qty: "Quantity",
        date: "Date",
        listedPrice: "Listed Price",
      };

  useEffect(() => {
    const fetchBids = async () => {
      try {
        const res = await api.get(`/products/${productId}/bids/`);
        setBids(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBids();
  }, [productId]);

  const highestBid = bids.length > 0
    ? Math.max(...bids.map((b) => parseFloat(b.bid_price)))
    : null;

  return (
    <div className="bg-gray-50 min-h-screen py-10 px-4 md:px-8">
      <div className="max-w-4xl mx-auto">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 text-green-600 hover:text-green-700 mb-6 font-medium transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          {text.back}
        </button>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">{text.title}</h1>
          {product && (
            <div className="flex flex-wrap gap-4 items-center">
              <div>
                <p className="font-semibold text-lg">{product.name}</p>
                <p className="text-sm text-gray-500">{product.variety}</p>
              </div>
              <div className="ml-auto text-right">
                <p className="text-sm text-gray-500">{text.listedPrice}</p>
                <p className="text-xl font-bold text-green-600">{formatPricePerKg(product.price_per_kg)}</p>
              </div>
            </div>
          )}
        </div>

        {loading ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
            <p className="text-gray-500">Loading...</p>
          </div>
        ) : bids.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
            <p className="text-gray-500 italic">{text.noBids}</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {highestBid && (
              <div className="bg-green-50 px-6 py-3 border-b border-green-100 flex items-center gap-2">
                <span className="text-green-700 font-semibold">{text.highestBid}:</span>
                <span className="text-green-800 font-bold text-lg">₹{highestBid}/kg</span>
              </div>
            )}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-gray-600 uppercase text-xs font-bold tracking-wider">
                    <th className="px-6 py-4">{text.buyer}</th>
                    <th className="px-6 py-4">{text.phone}</th>
                    <th className="px-6 py-4 text-right">{text.price}</th>
                    <th className="px-6 py-4 text-right">{text.qty}</th>
                    <th className="px-6 py-4 text-right">{text.date}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {bids.map((bid, index) => {
                    const isHighest = parseFloat(bid.bid_price) === highestBid;
                    return (
                      <tr
                        key={index}
                        className={`transition-colors ${
                          isHighest ? "bg-green-50/50 hover:bg-green-50" : "hover:bg-gray-50"
                        }`}
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            {isHighest && (
                              <span className="bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">
                                {text.highestBid}
                              </span>
                            )}
                            <span className="font-medium text-gray-800">{bid.buyer_name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-600">{bid.buyer_phone}</td>
                        <td className={`px-6 py-4 text-right font-semibold ${
                          isHighest ? "text-green-700" : "text-gray-700"
                        }`}>
                          ₹{bid.bid_price}
                        </td>
                        <td className="px-6 py-4 text-right text-gray-600">{bid.quantity} kg</td>
                        <td className="px-6 py-4 text-right text-gray-500 text-sm">
                          {new Date(bid.created_at).toLocaleDateString()}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductBidsPage;
