function Navbar({
  isAuthenticated,
  username,
  onNavigate,
  onLogout,
  language,
  onToggleLanguage,
}) {
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
    },
  };

  const text = copy[language];

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
        <button
          type="button"
          onClick={() => onNavigate("home")}
          className="px-3 py-2 rounded-lg text-sm font-medium text-green-600 bg-green-50"
        >
          {text.home}
        </button>
        <button
          type="button"
          onClick={() => onNavigate("buy")}
          className="px-3 py-2 rounded-lg text-sm font-medium hover:bg-green-50"
        >
          {text.buy}
        </button>
        <button
          type="button"
          onClick={() => onNavigate("sell")}
          className="px-3 py-2 rounded-lg text-sm font-medium hover:bg-green-50"
        >
          {text.sell}
        </button>
        <button className="px-3 py-2 rounded-lg text-sm font-medium hover:bg-green-50">
          {text.mandiPrices}
        </button>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onToggleLanguage}
          className="text-sm border px-3 py-1 rounded-lg"
        >
          {text.languageButton}
        </button>

        <button
          type="button"
          onClick={() => onNavigate("create", "SELL")}
          className="border border-green-400 text-green-600 px-4 py-2 rounded-lg text-sm font-medium"
        >
          {text.postListing}
        </button>

        {isAuthenticated ? (
          <>
            <span className="hidden text-sm text-gray-600 md:block">
              {username}
            </span>
            <button
              type="button"
              onClick={onLogout}
              className="bg-green-400 text-white px-4 py-2 rounded-lg text-sm font-medium"
            >
              {text.logout}
            </button>
          </>
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
