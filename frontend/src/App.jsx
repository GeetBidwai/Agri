import { useCallback, useEffect, useState } from "react";

import api from "./api";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import CategoryGrid from "./components/CategoryGrid";
import LatestListings from "./components/LatestListings";
import HowItWorks from "./components/HowItWorks";
import AppBanner from "./components/AppBanner";
import CreateListing from "./components/CreateListing";
import AuthPage from "./components/AuthPage";
import ContactsPage from "./components/ContactsPage";
import ProfilePage from "./components/ProfilePage";
import MandiPrices from "./pages/MandiPrices";
import BidModal from "./components/BidModal";
import ProductBidsPage from "./pages/ProductBidsPage";
import CategoryPage from "./pages/CategoryPage";

const getRouteFromHash = () => {
  const hash = window.location.hash || "#/";

  if (hash === "#/login") {
    return { page: "login" };
  }

  if (hash === "#/signup") {
    return { page: "signup" };
  }

  if (hash === "#/profile") {
    return { page: "profile" };
  }

  if (hash === "#/mandi-prices") {
    return { page: "mandi-prices" };
  }

  if (hash.startsWith("#/category/")) {
    return {
      page: "category",
      categoryName: hash.replace("#/category/", ""),
    };
  }

  if (hash.startsWith("#/product-bids/")) {
    return {
      page: "product-bids",
      productId: hash.replace("#/product-bids/", ""),
    };
  }

  if (hash === "#/create" || hash === "#/create/sell") {
    return { page: "create", listingType: "SELL" };
  }

  if (hash === "#/create/buy") {
    return { page: "create", listingType: "BUY" };
  }

  if (hash.startsWith("#/contacts/")) {
    return {
      page: "contacts",
      productId: hash.replace("#/contacts/", ""),
    };
  }

  if (hash === "#/buy") {
    return { page: "home", listingType: "BUY" };
  }

  if (hash === "#/sell") {
    return { page: "home", listingType: "SELL" };
  }

  return { page: "home" };
};

function App() {
  const [listings, setListings] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeListingType, setActiveListingType] = useState("");
  const [route, setRoute] = useState(getRouteFromHash);
  const [language, setLanguage] = useState(() => localStorage.getItem("siteLanguage") || "EN");
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("authUser");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [bidModalProduct, setBidModalProduct] = useState(null);

  const isAuthenticated = Boolean(localStorage.getItem("authToken"));

  const navigate = (nextRoute, value) => {
    const hashMap = {
      home: "#/",
      buy: "#/buy",
      sell: "#/sell",
      login: "#/login",
      signup: "#/signup",
      profile: "#/profile",
      create: "#/create/sell",
      "mandi-prices": "#/mandi-prices",
    };

    if (nextRoute === "contacts" && value) {
      window.location.hash = `#/contacts/${value}`;
      return;
    }

    if (nextRoute === "create" && value) {
      window.location.hash = value === "BUY" ? "#/create/buy" : "#/create/sell";
      return;
    }

    if (nextRoute === "product-bids") {
      window.location.hash = `#/product-bids/${value}`;
      return;
    }

    if (nextRoute === "category") {
      window.location.hash = `#/category/${value}`;
      return;
    }

    window.location.hash = hashMap[nextRoute] || "#/";
  };

  const fetchListings = useCallback(() => {
    const params = {
      search: searchQuery,
    };

    if (activeListingType) {
      params.type = activeListingType;
    }

    api.get("/products/", { params })
      .then((res) => {
        setListings(res.data);
      })
      .catch((err) => {
        console.error("Failed to fetch listings:", err);
        // Show an error message if fetching fails
        alert("Failed to load listings. Please make sure the backend is running and migrations are applied.");
      });
  }, [searchQuery, activeListingType]);

  useEffect(() => {
    const handleHashChange = () => {
      const nextRoute = getRouteFromHash();

      // Protect authenticated routes without adding a router dependency
      if ((nextRoute.page === "create" || nextRoute.page === "profile") && !localStorage.getItem("authToken")) {
        window.location.hash = "#/login";
        return;
      }

      if (nextRoute.page === "home") {
        setActiveListingType(nextRoute.listingType || "");
      }

      setRoute(nextRoute);
    };

    handleHashChange();
    window.addEventListener("hashchange", handleHashChange);

    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  useEffect(() => {
    if ((route.page === "home" && route.listingType) || route.page === "buy" || route.page === "sell") {
      const listingsSection = document.getElementById("latest-listings");
      if (listingsSection) {
        listingsSection.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  }, [route]);

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  useEffect(() => {
    localStorage.setItem("siteLanguage", language);
  }, [language]);

  const handleAuthSuccess = (nextUser) => {
    setUser(nextUser);
    navigate("home");
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("authUser");
    setUser(null);
    navigate("home");
  };

  const handlePlaceBid = (product) => {
    setBidModalProduct(product);
  };

  return (
    <div>
      <Navbar
        isAuthenticated={isAuthenticated}
        username={user?.username}
        onNavigate={navigate}
        onLogout={handleLogout}
        language={language}
        onToggleLanguage={() => setLanguage((prev) => (prev === "EN" ? "HI" : "EN"))}
      />

      {route.page === "login" && (
        <AuthPage
          mode="login"
          onAuthSuccess={handleAuthSuccess}
          onNavigate={navigate}
          language={language}
        />
      )}

      {route.page === "signup" && (
        <AuthPage
          mode="signup"
          onAuthSuccess={handleAuthSuccess}
          onNavigate={navigate}
          language={language}
        />
      )}

      {route.page === "create" && (
        <section className="bg-gray-50 py-14 px-6 min-h-[calc(100vh-4rem)]">
          <div className="max-w-6xl mx-auto">
            <CreateListing
              key={route.listingType || "SELL"}
              initialListingType={route.listingType || "SELL"}
              setListings={setListings}
              refreshListings={fetchListings}
              language={language}
            />
          </div>
        </section>
      )}

      {route.page === "profile" && (
        <ProfilePage language={language} />
      )}

      {route.page === "mandi-prices" && (
        <MandiPrices language={language} />
      )}

      {route.page === "category" && (
        <CategoryPage
          categoryName={route.categoryName}
          onNavigateToContact={(productId) => navigate("contacts", productId)}
          onPlaceBid={handlePlaceBid}
          language={language}
        />
      )}

      {route.page === "product-bids" && (
        <ProductBidsPage
          productId={route.productId}
          product={listings.find((item) => String(item.id) === String(route.productId))}
          onBack={() => navigate("home")}
          language={language}
        />
      )}

      {route.page === "contacts" && (
        <ContactsPage
          key={route.productId}
          productId={route.productId}
          listing={listings.find((item) => String(item.id) === String(route.productId))}
          onNavigate={navigate}
          language={language}
        />
      )}

      {route.page === "home" && (
        <>
          <Hero searchQuery={searchQuery} setSearchQuery={setSearchQuery} language={language} />
          <CategoryGrid
            onNavigate={(category) => navigate("category", category)}
            language={language}
          />
          <LatestListings
            listings={listings}
            activeListingType={activeListingType}
            setActiveListingType={setActiveListingType}
            onNavigateToContact={(productId) => navigate("contacts", productId)}
            onPlaceBid={handlePlaceBid}
            onViewBids={(productId) => navigate("product-bids", productId)}
            language={language}
          />
          <HowItWorks language={language} />
          <AppBanner language={language} />
        </>
      )}

      {bidModalProduct && (
        <BidModal
          product={bidModalProduct}
          onClose={() => setBidModalProduct(null)}
          language={language}
        />
      )}
    </div>
  );
}

export default App;
