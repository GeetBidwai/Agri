function AppBanner() {
  return (
    <section className="bg-gray-50 py-14 px-6">
      <div className="max-w-6xl mx-auto bg-green-800 rounded-2xl p-10 flex flex-col md:flex-row justify-between items-center text-white">
        
        <div>
          <h3 className="text-2xl font-bold">
            📱 Get the AgriMandi App
          </h3>
          <p className="text-white/80 mt-2 text-sm">
            Trade commodities anytime, anywhere
          </p>
          <p className="text-white/60 text-xs font-devanagari mt-1">
            कभी भी, कहीं भी व्यापार करें
          </p>

          <div className="mt-4 flex gap-3">
            <button className="bg-white text-green-800 px-4 py-2 rounded-lg text-sm font-semibold">
              Google Play
            </button>
            <button className="bg-white text-green-800 px-4 py-2 rounded-lg text-sm font-semibold">
              App Store
            </button>
          </div>
        </div>

        <div className="text-7xl opacity-20 mt-6 md:mt-0">
          🌾
        </div>

      </div>
    </section>
  );
}

export default AppBanner;