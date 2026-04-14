function Hero() {
  return (
    <section className="bg-gradient-to-r from-green-800 via-green-600 to-teal-600 text-white py-20 px-6">
      
      <div className="max-w-6xl mx-auto">
        
        {/* Badge */}
        <div className="mb-4">
          <span className="bg-white/20 px-4 py-1 rounded-full text-sm">
            🇮🇳 India's Trusted Agri Marketplace
          </span>
        </div>

        {/* Heading */}
        <h1 className="text-4xl md:text-5xl font-bold leading-tight">
          Buy & Sell{" "}
          <span className="text-amber-100">Agri Commodities</span> Across India
        </h1>

        {/* Subtitle */}
        <p className="mt-4 text-white/80 max-w-xl">
          Connect with verified farmers, traders & buyers — no middlemen, no commission
        </p>

        {/* Hindi line */}
        <p className="mt-2 text-white/60 font-devanagari text-sm">
          सीधे किसानों और व्यापारियों से जुड़ें — बिना कमीशन के
        </p>

        {/* Search Bar */}
        <div className="mt-8 bg-white rounded-xl shadow-xl flex flex-col md:flex-row overflow-hidden">
          
          <select className="p-3 text-gray-700 bg-gray-50 border-r">
            <option>All Categories</option>
            <option>Grains</option>
            <option>Pulses</option>
            <option>Spices</option>
          </select>

          <input
            type="text"
            placeholder="Search commodities (e.g. Wheat, Rice)"
            className="flex-1 p-3 text-gray-700 outline-none"
          />

          <button className="bg-amber-400 text-white px-6 py-3 font-semibold">
            Search
          </button>
        </div>

        {/* Stats */}
        <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          
          <div>
            <h2 className="text-2xl font-bold">6L+</h2>
            <p className="text-white/60 text-sm">Users</p>
          </div>

          <div>
            <h2 className="text-2xl font-bold">4L+</h2>
            <p className="text-white/60 text-sm">Farmers</p>
          </div>

          <div>
            <h2 className="text-2xl font-bold">2L+</h2>
            <p className="text-white/60 text-sm">Traders</p>
          </div>

          <div>
            <h2 className="text-2xl font-bold">2000+</h2>
            <p className="text-white/60 text-sm">Markets</p>
          </div>

        </div>

      </div>
    </section>
  );
}

export default Hero;