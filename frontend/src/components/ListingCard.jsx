function ListingCard({ item }) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 hover:shadow-md transition-all">
      
      <span className={`text-xs font-bold px-2 py-1 rounded-full ${
        item.type === "sell"
          ? "bg-green-50 text-green-600"
          : "bg-amber-50 text-amber-600"
      }`}>
        {item.type === "sell" ? "FOR SALE" : "WANTED"}
      </span>

      <h3 className="mt-2 font-bold text-lg">
        {item.name}{" "}
        <span className="text-gray-400 font-devanagari text-sm">
          {item.hindi}
        </span>
      </h3>

      <p className="text-sm text-gray-500">{item.variety}</p>

      <h2 className="text-xl font-bold text-green-600 mt-2">
        {item.price_per_kg}/kg
      </h2>

      <div className="text-xs text-gray-400 mt-2 space-y-1">
        <p>📦 {item.qty}</p>
        <p>📍 {item.location}</p>
        <p>🕒 {item.date}</p>
      </div>

      <div className="mt-3 pt-3 border-t flex justify-between items-center">
        <div>
          <p className="text-xs font-semibold">{item.seller}</p>
          {item.verified && (
            <p className="text-xs text-teal-600">✓ KYC Verified</p>
          )}
        </div>

        <button className="bg-green-400 text-white px-3 py-1 rounded-lg text-xs">
          View Contact
        </button>
      </div>
    </div>
  );
}

export default ListingCard;