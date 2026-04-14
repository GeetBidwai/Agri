import { useEffect, useState } from "react";
import axios from "axios";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import CategoryGrid from "./components/CategoryGrid";
import LatestListings from "./components/LatestListings";
import HowItWorks from "./components/HowItWorks";
import AppBanner from "./components/AppBanner";
import CreateListing from "./components/CreateListing";

function App() {
  const [listings, setListings] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Refetch listings whenever the search query changes
  useEffect(() => {
    axios.get("http://127.0.0.1:8000/api/products/", {
      params: {
        search: searchQuery,
      },
    })
      .then((res) => setListings(res.data))
      .catch((err) => console.error(err));
  }, [searchQuery]);

  return (
    <div>
      <Navbar />
      <Hero searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <CategoryGrid />

      {/* 🔥 connect form */}
      <CreateListing setListings={setListings} />

      {/* 🔥 pass listings */}
      <LatestListings listings={listings} />

      <HowItWorks />
      <AppBanner />
    </div>
  );
}

export default App;
