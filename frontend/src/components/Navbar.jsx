import { useEffect, useRef, useState } from "react";

function Navbar({
  isAuthenticated,
  username,
  onNavigate,
  onLogout,
  language,
  onToggleLanguage,
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const copy = {
    EN: {
      home: "Home",
      buy: "Buy",
      sell: "Sell",
      mandiPrices: "Mandi Prices",
      languageButton: "Hindi",
      postListing: "Post Listing",
      logout: "Logout",
      signIn: "Sign In",
      myProfile: "My Profile",
      language: "Language",
      english: "English",
      hindi: "Hindi",
      hello: "Hi",
    },
    HI: {
      home: "होम",
      buy: "खरीदें",
      sell: "बेचें",
      mandiPrices: "मंडी भाव",
      languageButton: "English",
      postListing: "लिस्टिंग पोस्ट करें",
      logout: "लॉगआउट",
      signIn: "साइन इन",
      myProfile: "मेरी प्रोफाइल",
      language: "भाषा",
      english: "English",
      hindi: "हिंदी",
      hello: "नमस्ते",
    },
  };

  const text = copy[language];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="bg-white border-b border-gray-100 shadow-sm h-16 flex items-center justify-between px-6 sticky top-0 z-50">
      <div className="flex items-center gap-2">
        <div className="bg-green-400 text-white w-8 h-8 flex items-center justify-center rounded-lg">
          AM
        </div>
        <h1 className="font-bold text-xl">
          <span className="text-green-800">Agri</span>
          <span className="text-amber-400">Mandi</span>
        </h1>
      </div>

      <div className="hidden md:flex gap-4">
        <button type="button" onClick={() => onNavigate("home")} className="px-3 py-2 rounded-lg text-sm font-medium text-green-600 bg-green-50">
          {text.home}
        </button>
        <button type="button" onClick={() => onNavigate("buy")} className="px-3 py-2 rounded-lg text-sm font-medium hover:bg-green-50">
          {text.buy}
        </button>
        <button type="button" onClick={() => onNavigate("sell")} className="px-3 py-2 rounded-lg text-sm font-medium hover:bg-green-50">
          {text.sell}
        </button>
        <button className="px-3 py-2 rounded-lg text-sm font-medium hover:bg-green-50">
          {text.mandiPrices}
        </button>
      </div>

      <div className="flex items-center gap-3">
        {!isAuthenticated && (
          <button
            type="button"
            onClick={onToggleLanguage}
            className="text-sm border px-3 py-1 rounded-lg"
          >
            {text.languageButton}
          </button>
        )}

        <button
          type="button"
          onClick={() => onNavigate("create", "SELL")}
          className="border border-green-400 text-green-600 px-4 py-2 rounded-lg text-sm font-medium"
        >
          {text.postListing}
        </button>

        {isAuthenticated ? (
          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={() => setMenuOpen((prev) => !prev)}
              className="text-sm text-gray-700 md:block"
            >
              {username}
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-3 w-56 rounded-xl border border-gray-200 bg-white shadow-lg overflow-hidden">
                <div className="border-b border-gray-100 px-4 py-3 text-sm text-gray-600">
                  {text.hello}, {username}
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    onNavigate("profile");
                  }}
                  className="block w-full px-4 py-3 text-left text-sm hover:bg-gray-50"
                >
                  {text.myProfile}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onToggleLanguage();
                  }}
                  className="block w-full px-4 py-3 text-left text-sm hover:bg-gray-50"
                >
                  {text.language}: {language === "EN" ? text.hindi : text.english}
                </button>

                <button
                  type="button"
                  onClick={onLogout}
                  className="block w-full px-4 py-3 text-left text-sm text-red-600 hover:bg-red-50"
                >
                  {text.logout}
                </button>
              </div>
            )}
          </div>
        ) : (
          <button
            type="button"
            onClick={() => onNavigate("login")}
            className="bg-green-400 text-white px-4 py-2 rounded-lg text-sm font-medium"
          >
            {text.signIn}
          </button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
