function CategoryGrid() {
  const categories = [
    { name: "Grains", hindi: "अनाज", icon: "🌾", count: 1240 },
    { name: "Pulses", hindi: "दालें", icon: "🫘", count: 870 },
    { name: "Spices", hindi: "मसाले", icon: "🌶️", count: 620 },
    { name: "Oilseeds", hindi: "तिलहन", icon: "🌻", count: 490 },
    { name: "Vegetables", hindi: "सब्जियां", icon: "🥦", count: 380 },
    { name: "Fruits", hindi: "फल", icon: "🍊", count: 310 },
    { name: "Cotton", hindi: "कपास", icon: "🌿", count: 215 },
    { name: "Sugar", hindi: "चीनी", icon: "🍬", count: 178 },
  ];

  return (
    <section className="bg-white py-14 px-6">
      <div className="max-w-6xl mx-auto">
        
        {/* Heading */}
        <h2 className="text-2xl font-bold">Browse by Category</h2>
        <p className="text-gray-600 mt-1">
          Explore commodities across different categories
        </p>
        <p className="text-gray-400 text-sm font-devanagari">
          विभिन्न श्रेणियों में उत्पाद खोजें
        </p>

        {/* Grid */}
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {categories.map((cat, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-xl p-5 text-center cursor-pointer hover:shadow-md hover:border-green-200 transition-all"
            >
              <div className="text-3xl mb-2">{cat.icon}</div>
              <h3 className="font-semibold text-sm">{cat.name}</h3>
              <p className="text-xs text-gray-400 font-devanagari">
                {cat.hindi}
              </p>
              <p className="text-xs text-green-500 mt-1">
                {cat.count} listings
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

export default CategoryGrid;