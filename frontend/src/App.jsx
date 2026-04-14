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

  // Fetch data once
  useEffect(() => {
    axios.get("http://127.0.0.1:8000/api/products/")
      .then((res) => setListings(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div>
      <Navbar />
      <Hero />
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