import { useEffect, useState } from "react";
import api from "../api";
import ListingCard from "../components/ListingCard";

function CategoryPage({ categoryName, onNavigateToContact, onPlaceBid, language }) {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  const text = language === "HI"
    ? {
        title: "लिस्टिंग",
        noData: "कोई लिस्टिंग नहीं मिली",
        loading: "लोड हो रहा है...",
        showingAllItemsIn: "इस श्रेणी की सभी वस्तुएं दिखाई जा रही हैं",
      }
    : {
        title: "Listings",
        noData: "No listings found",
        loading: "Loading...",
        showingAllItemsIn: "Showing all items in",
      };

  useEffect(() => {
    const fetchCategoryListings = async () => {
      setLoading(true);
      try {
        const res = await api.get("/products/", {
          params: { category: categoryName }
        });
        setListings(res.data);
      } catch (err) {
        console.error("Error fetching category listings:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryListings();
  }, [categoryName]);

  const displayTitle = categoryName ? categoryName.charAt(0).toUpperCase() + categoryName.slice(1) : "";

  return (
    <div className="bg-gray-50 min-h-screen py-14 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            {displayTitle} {text.title}
          </h1>
          <p className="text-gray-600 mt-2">
            {text.showingAllItemsIn} {displayTitle}
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">{text.loading}</p>
          </div>
        ) : listings.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {listings.map((item, index) => (
              <ListingCard
                key={index}
                item={item}
                onNavigateToContact={onNavigateToContact}
                onPlaceBid={onPlaceBid}
                language={language}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
            <p className="text-gray-500 italic text-lg">{text.noData}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default CategoryPage;
