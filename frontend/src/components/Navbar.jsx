import { useEffect, useRef, useState } from "react";

function Navbar({
  isAuthenticated,
  username,
  userRole,
  verificationStatus,
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
      verifyAccount: "Verify Account",
      verificationPending: "Verification Pending",
      verifiedSeller: "Verified Seller",
      language: "Language",
      english: "English",
      hindi: "Hindi",
      hello: "Hi",
    },
    HI: {
      home: "\u0939\u094b\u092e",
      buy: "\u0916\u0930\u0940\u0926\u0947\u0902",
      sell: "\u092c\u0947\u091a\u0947\u0902",
      mandiPrices: "\u092e\u0902\u0921\u0940 \u092d\u093e\u0935",
      languageButton: "English",
      postListing: "\u0932\u093f\u0938\u094d\u091f\u093f\u0902\u0917 \u092a\u094b\u0938\u094d\u091f \u0915\u0930\u0947\u0902",
      logout: "\u0932\u0949\u0917\u0906\u0909\u091f",
      signIn: "\u0938\u093e\u0907\u0928 \u0907\u0928",
      myProfile: "\u092e\u0947\u0930\u0940 \u092a\u094d\u0930\u094b\u092b\u093e\u0907\u0932",
      verifyAccount: "\u0916\u093e\u0924\u093e \u0938\u0924\u094d\u092f\u093e\u092a\u093f\u0924 \u0915\u0930\u0947\u0902",
      verificationPending: "\u0938\u0924\u094d\u092f\u093e\u092a\u0928 \u0932\u0902\u092c\u093f\u0924",
      verifiedSeller: "\u0938\u0924\u094d\u092f\u093e\u092a\u093f\u0924 \u0935\u093f\u0915\u094d\u0930\u0947\u0924\u093e",
      language: "\u092d\u093e\u0937\u093e",
      english: "English",
      hindi: "\u0939\u093f\u0902\u0926\u0940",
      hello: "\u0928\u092e\u0938\u094d\u0924\u0947",
    },
  };

  const text = copy[language];
  const verificationLabel = verificationStatus === "approved"
    ? text.verifiedSeller
    : verificationStatus === "pending"
      ? text.verificationPending
      : text.verifyAccount;

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
        <button type="button" onClick={() => onNavigate("mandi-prices")} className="px-3 py-2 rounded-lg text-sm font-medium hover:bg-green-50">
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

        {userRole === "seller" && (
          <button
            type="button"
            onClick={() => onNavigate("create", "SELL")}
            className="border border-green-400 text-green-600 px-4 py-2 rounded-lg text-sm font-medium"
          >
            {text.postListing}
          </button>
        )}

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

                {userRole === "seller" && (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        setMenuOpen(false);
                        onNavigate("seller-dashboard");
                      }}
                      className="block w-full px-4 py-3 text-left text-sm hover:bg-gray-50"
                    >
                      Seller Dashboard
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setMenuOpen(false);
                        onNavigate("kyc");
                      }}
                      className="block w-full px-4 py-3 text-left text-sm hover:bg-gray-50"
                    >
                      KYC
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setMenuOpen(false);
                        onNavigate("verify-account");
                      }}
                      className="block w-full px-4 py-3 text-left text-sm hover:bg-gray-50"
                    >
                      {verificationLabel}
                    </button>
                  </>
                )}

                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    onToggleLanguage();
                  }}
                  className="block w-full px-4 py-3 text-left text-sm hover:bg-gray-50"
                >
                  {text.language}: {language === "EN" ? text.hindi : text.english}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    onLogout();
                  }}
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
