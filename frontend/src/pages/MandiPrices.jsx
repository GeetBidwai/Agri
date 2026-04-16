import { useState } from "react";

const dummyData = [
  { commodity: "Wheat", market: "Pune", state: "Maharashtra", min_price: 2100, max_price: 2400, modal_price: 2250 },
  { commodity: "Rice", market: "Nagpur", state: "Maharashtra", min_price: 3000, max_price: 3500, modal_price: 3200 },
  { commodity: "Onion", market: "Nashik", state: "Maharashtra", min_price: 1200, max_price: 1800, modal_price: 1500 },
  { commodity: "Potato", market: "Indore", state: "Madhya Pradesh", min_price: 1000, max_price: 1400, modal_price: 1200 }
];

const MandiPrices = ({ language }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState(dummyData);

  const copy = {
    EN: {
      title: "Mandi Prices",
      subtitle: "Daily update of commodity prices across Indian markets",
      placeholder: "Search commodity (e.g. Wheat)",
      search: "Search",
      noData: "No data found",
      commodity: "Commodity",
      market: "Market",
      state: "State",
      minPrice: "Min Price",
      maxPrice: "Max Price",
      modalPrice: "Modal Price",
    },
    HI: {
      title: "मंडी भाव",
      subtitle: "भारतीय बाजारों में जिन्सों की कीमतों का दैनिक अपडेट",
      placeholder: "जिन्स खोजें (जैसे गेहूं)",
      search: "खोजें",
      noData: "कोई डेटा नहीं मिला",
      commodity: "जिन्स",
      market: "मंडी",
      state: "राज्य",
      minPrice: "न्यूनतम मूल्य",
      maxPrice: "अधिकतम मूल्य",
      modalPrice: "औसत मूल्य",
    },
  };

  const text = copy[language || "EN"];

  const handleSearch = () => {
    const results = dummyData.filter(item =>
      item.commodity.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredData(results);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-10 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 text-center md:text-left">
          <h1 className="text-3xl font-bold text-green-800 mb-2">{text.title}</h1>
          <p className="text-gray-600">{text.subtitle}</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={text.placeholder}
                className="w-full pl-4 pr-10 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
            <button
              onClick={handleSearch}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
            >
              <span>{text.search}</span>
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-green-50 text-green-800 uppercase text-xs font-bold tracking-wider">
                  <th className="px-6 py-4">{text.commodity}</th>
                  <th className="px-6 py-4">{text.market}</th>
                  <th className="px-6 py-4">{text.state}</th>
                  <th className="px-6 py-4 text-right">{text.minPrice}</th>
                  <th className="px-6 py-4 text-right">{text.maxPrice}</th>
                  <th className="px-6 py-4 text-right">{text.modalPrice}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredData.length > 0 ? (
                  filteredData.map((item, index) => (
                    <tr key={index} className="hover:bg-green-50/30 transition-colors">
                      <td className="px-6 py-4 font-semibold text-gray-800">{item.commodity}</td>
                      <td className="px-6 py-4 text-gray-600">{item.market}</td>
                      <td className="px-6 py-4 text-gray-600">{item.state}</td>
                      <td className="px-6 py-4 text-right text-green-600 font-medium">₹{item.min_price}</td>
                      <td className="px-6 py-4 text-right text-amber-600 font-medium">₹{item.max_price}</td>
                      <td className="px-6 py-4 text-right text-green-800 font-bold">₹{item.modal_price}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-gray-500 italic">
                      {text.noData}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MandiPrices;
