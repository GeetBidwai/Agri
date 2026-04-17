function CategoryGrid({ onNavigate, language }) {
  const categories = [
    { en: "Grains", hi: "\u0905\u0928\u093e\u091c", icon: "\u{1F33E}", count: 1240, slug: "grains" },
    { en: "Pulses", hi: "\u0926\u093e\u0932\u0947\u0902", icon: "\u{1FAD8}", count: 870, slug: "pulses" },
    { en: "Spices", hi: "\u092e\u0938\u093e\u0932\u0947", icon: "\u{1F336}\uFE0F", count: 620, slug: "spices" },
    { en: "Oilseeds", hi: "\u0924\u093f\u0932\u0939\u0928", icon: "\u{1F33B}", count: 490, slug: "oilseeds" },
    { en: "Vegetables", hi: "\u0938\u092c\u094d\u091c\u093f\u092f\u093e\u0902", icon: "\u{1F966}", count: 380, slug: "vegetables" },
    { en: "Fruits", hi: "\u092b\u0932", icon: "\u{1F34A}", count: 310, slug: "fruits" },
    { en: "Cotton", hi: "\u0915\u092a\u093e\u0938", icon: "\u{1F33F}", count: 215, slug: "cotton" },
    { en: "Sugar", hi: "\u091a\u0940\u0928\u0940", icon: "\u{1F36C}", count: 178, slug: "sugar" },
  ];

  const text = language === "HI"
    ? {
        title: "\u0936\u094d\u0930\u0947\u0923\u0940 \u0915\u0947 \u0905\u0928\u0941\u0938\u093e\u0930 \u092c\u094d\u0930\u093e\u0909\u091c\u093c \u0915\u0930\u0947\u0902",
        subtitle: "\u0935\u093f\u092d\u093f\u0928\u094d\u0928 \u0936\u094d\u0930\u0947\u0923\u093f\u092f\u094b\u0902 \u092e\u0947\u0902 \u0909\u0924\u094d\u092a\u093e\u0926 \u0916\u094b\u091c\u0947\u0902",
        listings: "\u0932\u093f\u0938\u094d\u091f\u093f\u0902\u0917",
      }
    : {
        title: "Browse by Category",
        subtitle: "Explore commodities across different categories",
        listings: "listings",
      };

  return (
    <section id="browse-categories" className="bg-white py-14 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold">{text.title}</h2>
        <p className="text-gray-600 mt-1">{text.subtitle}</p>

        <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {categories.map((cat, index) => (
            <div
              key={index}
              onClick={() => onNavigate(cat.slug)}
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
