import { useState } from "react";

function Navbar() {
  const [language, setLanguage] = useState("EN");

  return (
    <nav className="bg-white border-b border-gray-100 shadow-sm h-16 flex items-center justify-between px-6 sticky top-0 z-50">
      
      {/* Logo */}
      <div className="flex items-center gap-2">
        <div className="bg-green-400 text-white w-8 h-8 flex items-center justify-center rounded-lg">
          🌾
        </div>
        <h1 className="font-bold text-xl">
          <span className="text-green-800">Agri</span>
          <span className="text-amber-400">Mandi</span>
        </h1>
      </div>

      {/* Nav Links */}
      <div className="hidden md:flex gap-4">
        <button className="px-3 py-2 rounded-lg text-sm font-medium text-green-600 bg-green-50">
          Home
        </button>
        <button className="px-3 py-2 rounded-lg text-sm font-medium hover:bg-green-50">
          Buy
        </button>
        <button className="px-3 py-2 rounded-lg text-sm font-medium hover:bg-green-50">
          Sell
        </button>
        <button className="px-3 py-2 rounded-lg text-sm font-medium hover:bg-green-50">
          Mandi Prices
        </button>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-3">
        
        {/* Language Toggle */}
        <button
          onClick={() => setLanguage(language === "EN" ? "HI" : "EN")}
          className="text-sm border px-3 py-1 rounded-lg"
        >
          {language === "EN" ? "हिन्दी" : "English"}
        </button>

        {/* Post Listing */}
        <button className="border border-green-400 text-green-600 px-4 py-2 rounded-lg text-sm font-medium">
          Post Listing
        </button>

        {/* Sign In */}
        <button className="bg-green-400 text-white px-4 py-2 rounded-lg text-sm font-medium">
          Sign In
        </button>
      </div>
    </nav>
  );
}

export default Navbar;