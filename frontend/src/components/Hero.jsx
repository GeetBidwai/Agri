function Hero({ searchQuery, setSearchQuery, language }) {
  const copy = {
    EN: {
      badge: "India's Trusted Agri Marketplace",
      titleStart: "Buy & Sell",
      titleHighlight: "Agri Commodities",
      titleEnd: "Across India",
      subtitle: "Connect with verified farmers, traders and buyers with no middlemen and no commission",
      helper: "Connect directly with farmers and traders with no commission",
      allCategories: "All Categories",
      grains: "Grains",
      pulses: "Pulses",
      spices: "Spices",
      searchPlaceholder: "Search commodities (e.g. Wheat, Rice)",
      search: "Search",
      users: "Users",
      farmers: "Farmers",
      traders: "Traders",
      markets: "Markets",
    },
    HI: {
      badge: "भारत का भरोसेमंद कृषि मार्केटप्लेस",
      titleStart: "खरीदें और बेचें",
      titleHighlight: "कृषि उत्पाद",
      titleEnd: "पूरे भारत में",
      subtitle: "सत्यापित किसानों, व्यापारियों और खरीदारों से बिना बिचौलियों और बिना कमीशन के जुड़ें",
      helper: "किसानों और व्यापारियों से सीधे जुड़ें, बिना कमीशन",
      allCategories: "सभी श्रेणियां",
      grains: "अनाज",
      pulses: "दालें",
      spices: "मसाले",
      searchPlaceholder: "उत्पाद खोजें (जैसे गेहूं, चावल)",
      search: "खोजें",
      users: "उपयोगकर्ता",
      farmers: "किसान",
      traders: "व्यापारी",
      markets: "मंडियां",
    },
  };

  const text = copy[language];

  return (
    <section className="bg-gradient-to-r from-green-800 via-green-600 to-teal-600 text-white py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-4">
          <span className="bg-white/20 px-4 py-1 rounded-full text-sm">
            {text.badge}
          </span>
        </div>

        <h1 className="text-4xl md:text-5xl font-bold leading-tight">
          {text.titleStart}{" "}
          <span className="text-amber-100">{text.titleHighlight}</span> {text.titleEnd}
        </h1>

        <p className="mt-4 text-white/80 max-w-xl">
          {text.subtitle}
        </p>

        <p className="mt-2 text-white/60 text-sm">
          {text.helper}
        </p>

        <div className="mt-8 bg-white rounded-xl shadow-xl flex flex-col md:flex-row overflow-hidden">
          <select className="p-3 text-gray-700 bg-gray-50 border-r">
            <option>{text.allCategories}</option>
            <option>{text.grains}</option>
            <option>{text.pulses}</option>
            <option>{text.spices}</option>
          </select>

          <input
            type="text"
            placeholder={text.searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 p-3 text-gray-700 outline-none"
          />

          <button className="bg-amber-400 text-white px-6 py-3 font-semibold">
            {text.search}
          </button>
        </div>

        <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <h2 className="text-2xl font-bold">6L+</h2>
            <p className="text-white/60 text-sm">{text.users}</p>
          </div>

          <div>
            <h2 className="text-2xl font-bold">4L+</h2>
            <p className="text-white/60 text-sm">{text.farmers}</p>
          </div>

          <div>
            <h2 className="text-2xl font-bold">2L+</h2>
            <p className="text-white/60 text-sm">{text.traders}</p>
          </div>

          <div>
            <h2 className="text-2xl font-bold">2000+</h2>
            <p className="text-white/60 text-sm">{text.markets}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
