function CategoryGrid({ language }) {
  const categories = [
    { en: "Grains", hi: "अनाज", icon: "🌾", count: 1240 },
    { en: "Pulses", hi: "दालें", icon: "🫘", count: 870 },
    { en: "Spices", hi: "मसाले", icon: "🌶️", count: 620 },
    { en: "Oilseeds", hi: "तिलहन", icon: "🌻", count: 490 },
    { en: "Vegetables", hi: "सब्जियां", icon: "🥦", count: 380 },
    { en: "Fruits", hi: "फल", icon: "🍊", count: 310 },
    { en: "Cotton", hi: "कपास", icon: "🌿", count: 215 },
    { en: "Sugar", hi: "चीनी", icon: "🍬", count: 178 },
  ];

  const text = language === "HI"
    ? {
        title: "श्रेणी के अनुसार ब्राउज़ करें",
        subtitle: "विभिन्न श्रेणियों में उत्पाद खोजें",
        listings: "लिस्टिंग",
      }
    : {
        title: "Browse by Category",
        subtitle: "Explore commodities across different categories",
        listings: "listings",
      };

  return (
    <section className="bg-white py-14 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold">{text.title}</h2>
        <p className="text-gray-600 mt-1">{text.subtitle}</p>

        <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {categories.map((cat, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-xl p-5 text-center cursor-pointer hover:shadow-md hover:border-green-200 transition-all"
            >
              <div className="text-3xl mb-2">{cat.icon}</div>
              <h3 className="font-semibold text-sm">{language === "HI" ? cat.hi : cat.en}</h3>
              <p className="text-xs text-green-500 mt-1">
                {cat.count} {text.listings}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default CategoryGrid;
